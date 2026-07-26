'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function CreateWorkspace({ userId }: { userId: string }) {
  const [name, setName] = useState('')
  const router = useRouter()
  const supabase = createClient()

  async function handleCreate(e: React.FormEvent) {
  e.preventDefault()
  const { error } = await supabase.rpc('create_workspace', { workspace_name: name })
  if (error) return alert(error.message)
  router.refresh()
}

  return (
    <form onSubmit={handleCreate} className="flex gap-2">
      <input value={name} onChange={e => setName(e.target.value)} placeholder="Workspace name" className="border p-2 rounded flex-1" />
      <button className="bg-black text-white px-4 rounded">Create</button>
    </form>
  )
}
