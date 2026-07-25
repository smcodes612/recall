'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function Signup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [msg, setMsg] = useState('')
  const supabase = createClient()

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    const { error } = await supabase.auth.signUp({
  email,
  password,
  options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
})
    setMsg(error ? error.message : 'Check your email to confirm your account.')
  }

  return (
    <form onSubmit={handleSignup} className="max-w-sm mx-auto mt-20 flex flex-col gap-3">
      <h1 className="text-xl font-medium">Sign up</h1>
      <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="border p-2 rounded" />
      <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="border p-2 rounded" />
      {msg && <p className="text-sm text-center">{msg}</p>}
      <button className="bg-black text-white p-2 rounded">Sign up</button>
    </form>
  )
}