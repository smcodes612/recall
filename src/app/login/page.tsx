'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setError(error.message)
    else router.push('/dashboard')
  }

  return (
    <form onSubmit={handleLogin} className="max-w-sm mx-auto mt-20 flex flex-col gap-3">
      <h1 className="text-xl font-medium">Log in</h1>
      <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="border p-2 rounded" />
      <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="border p-2 rounded" />
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button className="bg-black text-white p-2 rounded">Log in</button>
      <a href="/signup" className="text-sm text-center underline">Need an account? Sign up</a>
    </form>
  )
}