import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/middleware'
import { getSuggestionsByTeacher, createSuggestion } from '@/lib/db'

export async function GET(request: NextRequest) {
  const user = getAuthUser(request)
  if (!user || user.role !== 'teacher') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const suggestions = await getSuggestionsByTeacher(user.id)
  return NextResponse.json(suggestions)
}

export async function POST(request: NextRequest) {
  const user = getAuthUser(request)
  if (!user || user.role !== 'teacher') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { title, content } = await request.json()

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Titulli dhe përmbajtja janë të nevojshme' },
        { status: 400 }
      )
    }

    const suggestion = await createSuggestion({
      teacher_id: user.id,
      title,
      content,
    })

    if (!suggestion) {
      return NextResponse.json(
        { error: 'Gabim në krijimin e sugjerimit' },
        { status: 500 }
      )
    }

    return NextResponse.json(suggestion)
  } catch (error) {
    console.error('Error creating suggestion:', error)
    return NextResponse.json(
      { error: 'Gabim në server' },
      { status: 500 }
    )
  }
}

