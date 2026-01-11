import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/middleware'
import { getAllSuggestions } from '@/lib/db'

export async function GET(request: NextRequest) {
  const user = getAuthUser(request)
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const suggestions = await getAllSuggestions()
  return NextResponse.json(suggestions)
}

