import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/middleware'
import { updateSuggestion } from '@/lib/db'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = getAuthUser(request)
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { status, admin_feedback } = await request.json()

    if (!status) {
      return NextResponse.json(
        { error: 'Statusi është i nevojshëm' },
        { status: 400 }
      )
    }

    const suggestion = await updateSuggestion(params.id, {
      status,
      admin_feedback: admin_feedback || null,
    })

    if (!suggestion) {
      return NextResponse.json(
        { error: 'Sugjerimi nuk u gjet' },
        { status: 404 }
      )
    }

    return NextResponse.json(suggestion)
  } catch (error) {
    console.error('Error updating suggestion:', error)
    return NextResponse.json(
      { error: 'Gabim në server' },
      { status: 500 }
    )
  }
}

