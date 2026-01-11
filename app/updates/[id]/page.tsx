import Image from 'next/image'
import Link from 'next/link'
import { getUpdateById, getImagesByUpdateId } from '@/lib/db'
import { notFound } from 'next/navigation'
import ImageDisplay from '@/components/ImageDisplay'

export default async function UpdateDetailPage({
  params,
}: {
  params: { id: string }
}) {
  let update = null
  let images: Array<{ id: string; image_url: string; alt_text: string | null; is_main?: boolean; position?: string; display_order?: number }> = []

  try {
    update = await getUpdateById(params.id)
    if (!update) {
      notFound()
    }

    const imagesResult = await getImagesByUpdateId(params.id)
    // Filter out images without image_url and ensure image_url is a string
    if (Array.isArray(imagesResult)) {
      images = imagesResult
        .filter((img) => img.image_url && typeof img.image_url === 'string')
        .map((img) => ({
          id: img.id,
          image_url: img.image_url as string,
          alt_text: img.alt_text,
          is_main: img.is_main,
          position: img.position,
          display_order: img.display_order
        }))
    }
  } catch (error) {
    console.error('Error fetching update:', error)
    notFound()
  }

  return (
    <div className="update-detail-page">
      <div className="container">
        <Link href="/" className="back-link">
          ← Back to Home
        </Link>

        <article className="update-detail">
          <header className="update-detail-header">
            <h1>{update.title}</h1>
            <p className="update-detail-date">
              {update.created_at
                ? new Date(update.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })
                : ''}
            </p>
          </header>

          <div className="update-detail-content">
            <div className="update-detail-text">
              {update.content.split('\n').map((paragraph, index) => (
                <p key={index}>{paragraph || '\u00A0'}</p>
              ))}
            </div>

            {images && images.length > 0 && (
              <div className="update-detail-images">
                {images
                  .sort((a, b) => {
                    // Sort: main images first, then by display_order
                    if (a.is_main && !b.is_main) return -1
                    if (!a.is_main && b.is_main) return 1
                    return (a.display_order || 0) - (b.display_order || 0)
                  })
                  .filter((img) => img.image_url && img.image_url.trim())
                  .map((img) => {
                    if (!img.image_url || !img.image_url.trim()) return null
                    return (
                      <div 
                        key={img.id} 
                        className={`update-detail-image-wrapper ${img.position || 'none'}`}
                      >
                        <ImageDisplay
                          src={img.image_url}
                          alt={img.alt_text || update.title || 'Update image'}
                          className="update-detail-image"
                          width={800}
                          height={600}
                        />
                      </div>
                    )
                  })
                  .filter(Boolean)}
              </div>
            )}
          </div>
        </article>
      </div>
    </div>
  )
}
