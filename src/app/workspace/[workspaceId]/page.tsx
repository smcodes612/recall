import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AddNote from './add-note' 
import UploadFile from './upload-file'
import Link from 'next/link' 
import Chat from './chat'
import Invite from './invite'

export default async function WorkspacePage({ params }: { params: Promise<{ workspaceId: string }> }) {
  const { workspaceId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: workspace } = await supabase.from('workspaces').select('name').eq('id', workspaceId).single()
  const { data: documents } = await supabase
    .from('documents')
    .select('id, title, type, created_at')
    .eq('workspace_id', workspaceId)
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-2xl mx-auto mt-16">
      <h1 className="text-xl font-medium mb-4">{workspace?.name}</h1>
      
      {/* Both components rendered next to each other here */}
      <AddNote workspaceId={workspaceId} userId={user.id} />
      <UploadFile workspaceId={workspaceId} userId={user.id} />
      <Chat workspaceId={workspaceId} />
      <Invite workspaceId={workspaceId} />
      
      <ul className="mt-6">
       {documents?.map(doc => (
        <Link key={doc.id} href={`/workspace/${workspaceId}/document/${doc.id}`}>
          <li className="border p-3 rounded mb-2 hover:bg-gray-50 cursor-pointer">
            <span className="text-xs text-gray-400 uppercase">{doc.type}</span>
            <p>{doc.title}</p>
          </li>
        </Link>
        ))}
      </ul>
    </div>
  )
}