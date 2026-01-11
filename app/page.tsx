import Image from 'next/image'
import { getUpdates, getImagesByUpdateId, getParticipants, getProgrammingLanguages } from '@/lib/db'
import Link from 'next/link'
import ImageDisplay from '@/components/ImageDisplay'

const partnershipLogoUrl = 'https://image2url.com/r2/bucket2/images/1768007938579-1c3c75bd-4c18-46ad-8c2c-06a2abffbd27.png'
const sponsorsImageUrl = 'https://image2url.com/r2/bucket2/images/1768009076939-8a95bd60-9358-44a2-8e86-adfb30ac9abf.png'

export default async function HomePage() {
  // Wrap all database calls in try-catch to prevent server errors
  let updates: Awaited<ReturnType<typeof getUpdates>> = []
  let participants: Awaited<ReturnType<typeof getParticipants>> = []
  let languages: Awaited<ReturnType<typeof getProgrammingLanguages>> = []
  let updatesWithImages: Array<{ id: string; title: string; content: string; created_at: string; images: Array<{ id: string; image_url: string; alt_text: string | null }> }> = []

  try {
    const updatesResult = await getUpdates(5)
    updates = Array.isArray(updatesResult) ? updatesResult : []
  } catch (error) {
    console.error('Error fetching updates:', error)
    updates = []
  }

  try {
    const participantsResult = await getParticipants()
    participants = Array.isArray(participantsResult) ? participantsResult : []
  } catch (error) {
    console.error('Error fetching participants:', error)
    participants = []
  }

  try {
    const languagesResult = await getProgrammingLanguages()
    languages = Array.isArray(languagesResult) ? languagesResult : []
  } catch (error) {
    console.error('Error fetching languages:', error)
    languages = []
  }

  // Get images for each update
  try {
    if (updates && Array.isArray(updates) && updates.length > 0) {
      updatesWithImages = await Promise.all(
        updates
          .filter((update) => update && update.id && typeof update.id === 'string')
          .map(async (update) => {
            try {
              const images = await getImagesByUpdateId(update.id)
              return {
                id: update.id || '',
                title: update.title || '',
                content: update.content || '',
                created_at: update.created_at || new Date().toISOString(),
                images: Array.isArray(images) ? images.map((img) => ({
                  id: img.id || '',
                  image_url: img.image_url || '',
                  alt_text: img.alt_text || null,
                })) : [],
              }
            } catch (error) {
              console.error(`Error fetching images for update ${update.id}:`, error)
              return {
                id: update.id || '',
                title: update.title || '',
                content: update.content || '',
                created_at: update.created_at || new Date().toISOString(),
                images: [],
              }
            }
          })
      )
    }
  } catch (error) {
    console.error('Error processing updates with images:', error)
    updatesWithImages = []
  }

  // Ensure all values are serializable
  const safeUpdatesWithImages = Array.isArray(updatesWithImages) ? updatesWithImages : []
  const safeLanguages = Array.isArray(languages) ? languages : []
  const safeParticipants = Array.isArray(participants) ? participants : []

  return (
    <div className="homepage">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <h1>Robotics Updates 2026</h1>
          <p className="hero-subtitle">Organizuar nga SHFMU Ismail Qemali, Prishtinë</p>
        </div>
      </section>

      {/* Latest Updates */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">Përditësimet e Fundit</h2>
          <div className="updates-grid">
            {safeUpdatesWithImages && safeUpdatesWithImages.length > 0 ? (
              safeUpdatesWithImages
                .filter((update) => update && update.id && update.title)
                .map((update) => (
                  <Link key={update.id} href={`/updates/${update.id}`} className="update-card-link">
                    <div className="update-card">
                      <h3>{update.title || 'Pa titull'}</h3>
                      <p className="update-date">
                        {update.created_at
                          ? new Date(update.created_at).toLocaleDateString('sq-AL', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })
                          : ''}
                      </p>
                      <div className="update-content">
                        {update.content || ''}
                      </div>
                      {update.images && Array.isArray(update.images) && update.images.length > 0 && (
                        <div className="update-images">
                          {update.images
                            .filter((img) => img && img.id && img.image_url && img.image_url.trim())
                            .slice(0, 3)
                            .map((img) => {
                              if (!img.image_url || !img.image_url.trim()) return null
                              return (
                                <ImageDisplay
                                  key={img.id}
                                  src={img.image_url}
                                  alt={img.alt_text || update.title || 'Update image'}
                                  className="update-image"
                                  width={150}
                                  height={100}
                                />
                              )
                            })
                            .filter(Boolean)}
                        </div>
                      )}
                    </div>
                  </Link>
                ))
            ) : (
              <p className="no-data">Nuk ka përditësime akoma.</p>
            )}
          </div>
        </div>
      </section>

      {/* Partnership Section */}
      <section className="section section-alt">
        <div className="container">
          <h2 className="section-title">Partneritet Organizues</h2>
          <div className="partnership-content">
            <div className="partnership-logo">
              <Image
                src={partnershipLogoUrl}
                alt="Partneritet Organizues - Kosova Makers League"
                width={300}
                height={250}
                className="partnership-image"
              />
            </div>
            <div className="partnership-info">
              <h3>SHFMU Ismail Qemali, Prishtinë</h3>
              <p>
                Ky projekt është organizuar nga SHFMU Ismail Qemali në Prishtinë, 
                me qëllim të promovimit të robotikës dhe teknologjisë në arsim.
              </p>
              <p>
                <strong>Organizues:</strong> Jehona Thaqi
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sponsors Section */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">Sponsorët</h2>
          <div className="sponsors-content">
            <Image
              src={sponsorsImageUrl}
              alt="Sponsorët e Robotics Updates 2026"
              width={1000}
              height={500}
              className="sponsors-image"
            />
          </div>
        </div>
      </section>

      {/* Programming Languages */}
      {safeLanguages && safeLanguages.length > 0 && (
        <section className="section section-alt">
          <div className="container">
            <h2 className="section-title">Gjuhët e Programimit</h2>
            <div className="languages-grid">
              {safeLanguages
                .filter((lang) => lang && lang.id && lang.name)
                .map((lang) => (
                  <div key={lang.id} className="language-card">
                    {lang.icon_url && (
                      <Image
                        src={lang.icon_url}
                        alt={lang.name || 'Language icon'}
                        width={64}
                        height={64}
                        className="language-icon"
                      />
                    )}
                    <h4>{lang.name || 'Pa emër'}</h4>
                    {lang.description && <p>{lang.description}</p>}
                  </div>
                ))}
            </div>
          </div>
        </section>
      )}

      {/* Participants */}
      {safeParticipants && safeParticipants.length > 0 && (
        <section className="section">
          <div className="container">
            <h2 className="section-title">Pjesëmarrësit</h2>
            <div className="participants-grid">
              {safeParticipants
                .filter((participant) => participant && participant.id && participant.name)
                .map((participant) => (
                  <div key={participant.id} className="participant-card">
                    <h4>{participant.name || 'Pa emër'}</h4>
                    {participant.team_name && <p><strong>Ekipi:</strong> {participant.team_name}</p>}
                    {participant.school && <p><strong>Shkolla:</strong> {participant.school}</p>}
                  </div>
                ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

