import { NextRequest, NextResponse } from 'next/server'
import { extractText, getDocumentProxy } from 'unpdf'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const file = formData.get('file') as File
  const buffer = new Uint8Array(await file.arrayBuffer())

  let text = ''
  if (file.name.toLowerCase().endsWith('.pdf')) {
    const pdf = await getDocumentProxy(buffer)
    const result = await extractText(pdf, { mergePages: true })
    text = result.text
  } else {
    text = Buffer.from(buffer).toString('utf-8')
  }

  return NextResponse.json({ text })
}