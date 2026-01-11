import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/middleware'
import { getUpdateById, updateUpdate, deleteUpdate } from '@/lib/db'
import { getImagesByUpdateId, createImage, deleteImage } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const update = await getUpdateById(params.id)
    if (!update) {
      return NextResponse.json({ error: 'Update not found' }, { status: 404 })
    }

    const images = await getImagesByUpdateId(params.id)
    return NextResponse.json({ ...update, images })
  } catch (error) {
    console.error('Error fetching update:', error)
    return NextResponse.json(
      { error: 'Error fetching update' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { title, content, published, images } = await request.json()

    const update = await updateUpdate(params.id, {
      title,
      content,
      published,
    })

    if (!update) {
      return NextResponse.json(
        { error: 'Përditësimi nuk u gjet' },
        { status: 404 }
      )
    }

    // Handle images - delete existing and create new ones
    if (images && Array.isArray(images)) {
      const existingImages = await getImagesByUpdateId(params.id)
      for (const img of existingImages) {
        await deleteImage(img.id)
      }

      for (let i = 0; i < images.length; i++) {
        const imageData = images[i]
        const imageUrl = typeof imageData === 'string' ? imageData : imageData.url
        if (imageUrl && imageUrl.trim()) {
          const isMain = typeof imageData === 'object' ? imageData.isMain : i === 0
          const position = typeof imageData === 'object' ? imageData.position : (i === 0 ? 'top' : 'none')
          
          await createImage({
            update_id: update.id,
            image_url: imageUrl.trim(),
            file_path: imageUrl.trim(), // Also set file_path for compatibility
            alt_text: `${title} - ${isMain ? 'Main' : 'Image'} ${i + 1}`,
            display_order: i,
            is_main: isMain,
            position: position,
          })
        }
      }
    }

    return NextResponse.json(update)
  } catch (error) {
    console.error('Error updating update:', error)
    return NextResponse.json(
      { error: 'Gabim në server' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const success = await deleteUpdate(params.id)
    if (!success) {
      return NextResponse.json(
        { error: 'Update not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ message: 'Update deleted successfully' })
  } catch (error) {
    console.error('Error deleting update:', error)
    return NextResponse.json(
      { error: 'Error deleting update' },
      { status: 500 }
    )
  }
}

