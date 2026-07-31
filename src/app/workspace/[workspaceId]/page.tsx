import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AddNote from './add-note' 
import UploadFile from './upload-file'
import Link from 'next/link' 
import Chat from './chat'
import Invite from './invite'
import DeleteDocButton from './delete-doc-button'

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
      
      <AddNote workspaceId={workspaceId} userId={user.id} />
      <UploadFile workspaceId={workspaceId} userId={user.id} />
      <Chat workspaceId={workspaceId} />
      <Invite workspaceId={workspaceId} />
      
      <ul className="mt-6">
        {documents?.map(doc => (
          <li key={doc.id} className="border p-3 rounded mb-2 hover:bg-gray-50 flex justify-between items-center">
            <Link href={`/workspace/${workspaceId}/document/${doc.id}`} className="flex-1 cursor-pointer">
              <span className="text-xs text-gray-400 uppercase">{doc.type}</span>
              <p>{doc.title}</p>
            </Link>
            <DeleteDocButton docId={doc.id} />
          </li>
        ))}
      </ul>
    </div>
  )
}