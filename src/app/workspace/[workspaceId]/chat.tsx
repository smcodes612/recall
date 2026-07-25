'use client'
import { useState } from 'react'

export default function Chat({ workspaceId }: { workspaceId: string }) {
  const [question, setQuestion] = useState('')
  const [messages, setMessages] = useState<{ q: string, a: string, sources: string[] }[]>([])
  const [loading, setLoading] = useState(false)

  async function handleAsk(e: React.FormEvent) {
    e.preventDefault()
    if (!question.trim()) return
    setLoading(true)
    const q = question
    setQuestion('')

    const res = await fetch('http://localhost:8000/query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ workspace_id: workspaceId, question: q }),
    })
    const data = await res.json()
    setMessages(prev => [...prev, { q, a: data.answer, sources: data.sources }])
    setLoading(false)
  }

  return (
    <div className="border rounded p-4 mt-6">
      <h2 className="font-medium mb-3">Ask your team's knowledge base</h2>
      <div className="flex flex-col gap-4 mb-4 max-h-96 overflow-y-auto">
        {messages.map((m, i) => (
          <div key={i}>
            <p className="font-medium">{m.q}</p>
            <p className="whitespace-pre-wrap text-sm mt-1">{m.a}</p>
            {m.sources.length > 0 && (
              <p className="text-xs text-gray-400 mt-1">Sources: {m.sources.join(', ')}</p>
            )}
          </div>
        ))}
        {loading && <p className="text-sm text-gray-400">Thinking...</p>}
      </div>
      <form onSubmit={handleAsk} className="flex gap-2">
        <input value={question} onChange={e => setQuestion(e.target.value)} placeholder="Ask a question..." className="border p-2 rounded flex-1" />
        <button className="bg-black text-white px-4 rounded">Ask</button>
      </form>
    </div>
  )
}