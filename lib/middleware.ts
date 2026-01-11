import { NextRequest } from 'next/server'
import { verifyToken, AuthUser } from '@/lib/auth'

export function getAuthUser(request: NextRequest): AuthUser | null {
  const token = request.cookies.get('auth-token')?.value
  
  if (!token) {
    return null
  }

  return verifyToken(token)
}
