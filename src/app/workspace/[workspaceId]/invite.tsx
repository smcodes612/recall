'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function Invite({ workspaceId }: { workspaceId: string }) {
  const [email, setEmail] = useState('')
  const [msg, setMsg] = useState('')
  const supabase = createClient()

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault()
    const { data, error } = await supabase.rpc('invite_by_email', {
      target_workspace_id: workspaceId,
      target_email: email,
    })
    if (error) setMsg(error.message)
    else if (data === 'no_account') setMsg('That email has no Recall account yet.')
    else setMsg('Member added!')
    setEmail('')
  }

  return (
    <form onSubmit={handleInvite} className="flex gap-2 items-center mt-3">
      <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Invite by email" className="border p-2 rounded flex-1" />
      <button className="bg-black text-white px-4 py-2 rounded">Invite</button>
      {msg && <span className="text-sm text-gray-500">{msg}</span>}
    </form>
  )
}