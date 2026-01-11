import { NextRequest, NextResponse } from 'next/server'
import { getUserByUsername } from '@/lib/db'
import { verifyPassword, generateToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    let body
    try {
      body = await request.json()
    } catch (parseError) {
      console.error('Error parsing request body:', parseError)
      return NextResponse.json(
        { error: 'Invalid request body. Expected JSON.' },
        { status: 400 }
      )
    }

    const { username, password } = body || {}

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username dhe password janë të nevojshme' },
        { status: 400 }
      )
    }

    console.log('Login attempt for username:', username)
    console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL || 'Using MCP connection')

    // Get user from database
    const userData = await getUserByUsername(username)

    if (!userData) {
      console.log('User not found:', username)
      console.log('Checking if Supabase is connected...')
      return NextResponse.json(
        { 
          error: 'Username ose password i gabuar',
          hint: 'Users ekzistojnë në database. Kontrollo që ke shkruar username dhe password saktësisht.'
        },
        { status: 401 }
      )
    }

    console.log('User found:', userData.username, 'Role:', userData.role)
    console.log('Password hash from DB (first 20 chars):', userData.password_hash?.substring(0, 20))

    // Verify password
    if (!userData.password_hash) {
      console.error('Password hash is missing for user:', username)
      return NextResponse.json(
        { error: 'Gabim në konfigurimin e përdoruesit' },
        { status: 500 }
      )
    }

    console.log('Verifying password for user:', username)
    console.log('Password hash length:', userData.password_hash.length)
    
    const isValid = await verifyPassword(password, userData.password_hash)
    console.log('Password verification result:', isValid)
    console.log('Input password length:', password.length)

    if (!isValid) {
      console.log('Password verification failed for user:', username)
      console.log('Expected password for admin: Admin@2026!RobotikaSHFMU')
      console.log('Expected password for teacher: Mesuese@2026!SHFMUIsmailQemali')
      console.log('Received password (first 10 chars):', password.substring(0, 10))
      return NextResponse.json(
        { 
          error: 'Username ose password i gabuar',
          hint: 'Admin: admin / Admin@2026!RobotikaSHFMU | Teacher: mesuese / Mesuese@2026!SHFMUIsmailQemali'
        },
        { status: 401 }
      )
    }

    console.log('Password verified successfully for user:', username)

    // Generate token
    const user = {
      id: userData.id,
      username: userData.username,
      role: userData.role,
    }

    const token = generateToken(user)
    console.log('Token generated for user:', user.username, 'role:', user.role)

    // Set cookie
    const response = NextResponse.json({
      message: 'Login i suksesshëm',
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    })

    // Set cookie with proper configuration
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })

    console.log('Cookie set successfully. Token length:', token.length)
    console.log('Cookie will be set with path: /, sameSite: lax, httpOnly: true')
    
    // Also set a header to confirm cookie is being set
    response.headers.set('X-Auth-Set', 'true')

    return response
  } catch (error) {
    console.error('Login error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    const errorStack = error instanceof Error ? error.stack : undefined
    console.error('Error details:', { errorMessage, errorStack })
    return NextResponse.json(
      { 
        error: 'Gabim në server',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      },
      { status: 500 }
    )
  }
}

