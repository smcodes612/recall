'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function AddNote({ workspaceId, userId }: { workspaceId: string, userId: string }) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const router = useRouter()
  const supabase = createClient()

  async function handleAdd(e: React.FormEvent) {
  e.preventDefault();

  const { data, error } = await supabase.from('documents').insert({
    workspace_id: workspaceId,
    uploaded_by: userId,
    title,
    type: 'note',
    content,
  }).select().single();

  if (error) return alert(error.message);

  // Here is the updated fetch request using the environment variable!
  await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ingest`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ document_id: data.id }),
  });

  setTitle('');
  setContent('');
  router.refresh();
}

  return (
    <form onSubmit={handleAdd} className="flex flex-col gap-2 border p-3 rounded">
      <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Note title" className="border p-2 rounded" />
      <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="Note content" className="border p-2 rounded" rows={4} />
      <button className="bg-black text-white p-2 rounded">Add note</button>
    </form>
  )
}