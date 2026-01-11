import { NextResponse } from 'next/server'
import { hashPassword } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    // Check if users already exist
    const { data: existingUsers, error: checkError } = await supabase
      .from('users')
      .select('username')
      .in('username', ['admin', 'mesuese'])

    if (checkError) {
      console.error('Error checking existing users:', checkError)
      return NextResponse.json(
        { error: 'Gabim në kontrollimin e përdoruesve', details: checkError.message },
        { status: 500 }
      )
    }

    // Always delete and recreate users to ensure correct hashes
    console.log('Deleting existing users to recreate with correct hashes...')
    const { error: deleteError } = await supabase
      .from('users')
      .delete()
      .in('username', ['admin', 'mesuese'])
    
    if (deleteError) {
      console.error('Error deleting users:', deleteError)
    }

    // Create admin user
    const adminPassword = 'Admin@2026!RobotikaSHFMU'
    const adminPasswordHash = await hashPassword(adminPassword)
    console.log('Creating admin user with hash:', adminPasswordHash.substring(0, 20) + '...')
    
    const { data: adminData, error: adminError } = await supabase
      .from('users')
      .insert({
        username: 'admin',
        password_hash: adminPasswordHash,
        role: 'admin',
      })
      .select()

    if (adminError) {
      console.error('Admin creation error:', adminError)
    } else {
      console.log('Admin user created successfully:', adminData)
    }

    // Create teacher user
    const teacherPassword = 'Mesuese@2026!SHFMUIsmailQemali'
    const teacherPasswordHash = await hashPassword(teacherPassword)
    console.log('Creating teacher user with hash:', teacherPasswordHash.substring(0, 20) + '...')
    
    const { data: teacherData, error: teacherError } = await supabase
      .from('users')
      .insert({
        username: 'mesuese',
        password_hash: teacherPasswordHash,
        role: 'teacher',
      })
      .select()

    if (teacherError) {
      console.error('Teacher creation error:', teacherError)
    } else {
      console.log('Teacher user created successfully:', teacherData)
    }

    if (adminError || teacherError) {
      return NextResponse.json(
        {
          message: 'Gabim në krijimin e përdoruesve',
          errors: {
            admin: adminError?.message,
            teacher: teacherError?.message,
          },
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'Përdoruesit u krijuan me sukses',
      users: [
        {
          username: 'admin',
          password: 'Admin@2026!RobotikaSHFMU',
          role: 'admin',
        },
        {
          username: 'mesuese',
          password: 'Mesuese@2026!SHFMUIsmailQemali',
          role: 'teacher',
        },
      ],
    })
  } catch (error) {
    console.error('Setup error:', error)
    return NextResponse.json(
      { error: 'Gabim në server', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

