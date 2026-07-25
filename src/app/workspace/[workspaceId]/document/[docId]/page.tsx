import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function DocumentPage({ params }: { params: Promise<{ workspaceId: string, docId: string }> }) {
  const { docId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: doc } = await supabase
    .from('documents')
    .select('title, type, content, created_at')
    .eq('id', docId)
    .single()

  if (!doc) return <p className="max-w-2xl mx-auto mt-16">Not found.</p>

  return (
    <div className="max-w-2xl mx-auto mt-16">
      <span className="text-xs text-gray-400 uppercase">{doc.type}</span>
      <h1 className="text-xl font-medium mb-4">{doc.title}</h1>
      <p className="whitespace-pre-wrap">{doc.content}</p>
    </div>
  )
}