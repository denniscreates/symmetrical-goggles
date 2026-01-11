import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/middleware'
import { getAllUpdates, createUpdate } from '@/lib/db'
import { createImage } from '@/lib/db'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const updates = await getAllUpdates()
    return NextResponse.json(updates || [])
  } catch (error) {
    console.error('Error fetching updates:', error)
    return NextResponse.json(
      { error: 'Error fetching updates' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { title, content, published, images } = await request.json()

    console.log('Creating update with data:', { title, content, published, images })

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      )
    }

    // Get a default admin user ID or use null (author_id can be null per schema)
    const user = getAuthUser(request)
    let authorId: string | null = null
    
    if (user) {
      authorId = user.id
    } else {
      // Try to get the first admin user from database as fallback
      try {
        const { data: adminUsers, error: adminError } = await supabase
          .from('users')
          .select('id')
          .eq('role', 'admin')
          .limit(1)
        
        if (!adminError && adminUsers && adminUsers.length > 0) {
          authorId = adminUsers[0].id
        } else {
          console.warn('Could not get admin user, using null for author_id')
        }
      } catch (e) {
        console.warn('Error getting admin user:', e)
      }
    }

    const update = await createUpdate({
      title,
      content,
      author_id: authorId, // Can be null - schema allows it
      published: published ?? true,
    })

    console.log('Update created:', update)

    if (!update) {
      console.error('Failed to create update - createUpdate returned null')
      return NextResponse.json(
        { error: 'Failed to create update. Check server logs.' },
        { status: 500 }
      )
    }

    // Add images if provided
    if (images && Array.isArray(images)) {
      for (let i = 0; i < images.length; i++) {
        const imageData = images[i]
        const imageUrl = typeof imageData === 'string' ? imageData : imageData.url
        if (imageUrl && imageUrl.trim()) {
          // Handle both old format (string) and new format (object)
          const isMain = typeof imageData === 'object' ? imageData.isMain : i === 0
          const position = typeof imageData === 'object' ? imageData.position : (i === 0 ? 'top' : 'none')
          
          const imageResult = await createImage({
            update_id: update.id,
            image_url: imageUrl.trim(),
            file_path: imageUrl.trim(), // Also set file_path for compatibility
            alt_text: `${title} - ${isMain ? 'Main' : 'Image'} ${i + 1}`,
            display_order: i,
            is_main: isMain,
            position: position,
          })
          console.log('Image created:', imageResult)
        }
      }
    }

    return NextResponse.json(update)
  } catch (error) {
    console.error('Error creating update:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { 
        error: 'Server error while creating update',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      },
      { status: 500 }
    )
  }
}

