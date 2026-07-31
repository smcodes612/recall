'use client'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function DeleteDocButton({ docId }: { docId: string }) {
  const router = useRouter()
  const supabase = createClient()

  async function handleDelete(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    if (!confirm('Delete this document?')) return
    const { error } = await supabase.from('documents').delete().eq('id', docId)
    if (error) return alert(error.message)
    router.refresh()
  }

  return <button onClick={handleDelete} className="text-red-500 text-xs ml-2">Delete</button>
}