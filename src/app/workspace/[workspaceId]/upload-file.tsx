'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function UploadFile({ workspaceId, userId }: { workspaceId: string, userId: string }) {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault()
    if (!file) return
    setLoading(true)

    const path = `${workspaceId}/${Date.now()}_${file.name}`
    const { error: uploadError } = await supabase.storage.from('documents').upload(path, file)
    if (uploadError) { alert(uploadError.message); setLoading(false); return }

    const ext = file.name.split('.').pop()?.toLowerCase() || 'txt'
    const formData = new FormData()
    formData.append('file', file)

    const res = await fetch('/api/extract-text', { method: 'POST', body: formData })
    const { text } = await res.json()

    const { data, error: dbError } = await supabase.from('documents').insert({
  workspace_id: workspaceId,
  uploaded_by: userId,
  title: file.name,
  type: ext,
  content: text,
  storage_path: path,
}).select().single()
if (dbError) alert(dbError.message)
else {
  await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ingest`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ document_id: data.id }),
  })
}

    setFile(null)
    setLoading(false)
    router.refresh()
  }

  return (
    <form onSubmit={handleUpload} className="flex gap-2 items-center border p-3 rounded mt-3">
      <input type="file" accept=".pdf,.txt,.md" onChange={e => setFile(e.target.files?.[0] || null)} />
      <button disabled={loading} className="bg-black text-white px-4 py-2 rounded">
        {loading ? 'Uploading...' : 'Upload'}
      </button>
    </form>
  )
}