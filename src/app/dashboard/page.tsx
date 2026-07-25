import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import CreateWorkspace from './create-workspace'
import Link from 'next/link'

export default async function Dashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: memberships } = await supabase
    .from('workspace_members')
    .select('workspace_id, workspaces(id, name)')
    .eq('user_id', user.id)

  return (
    <div className="max-w-2xl mx-auto mt-16">
      <h1 className="text-xl font-medium mb-4">Your workspaces</h1>
      <ul className="mb-6">
        {memberships?.map((m: any) => (
  <Link key={m.workspace_id} href={`/workspace/${m.workspace_id}`}>
    <li className="border p-3 rounded mb-2 hover:bg-gray-50 cursor-pointer">{m.workspaces.name}</li>
  </Link>
))}
      </ul>
      <CreateWorkspace userId={user.id} />
    </div>
  )
}