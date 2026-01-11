'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Update {
  id: string
  title: string
  content: string
  created_at: string
  published: boolean
}

interface Suggestion {
  id: string
  title: string
  content: string
  status: string
  admin_feedback: string | null
  created_at: string
}

export default function AdminPanel() {
  const router = useRouter()
  const [updates, setUpdates] = useState<Update[]>([])
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'updates' | 'suggestions'>('updates')
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingUpdate, setEditingUpdate] = useState<Update | null>(null)

  useEffect(() => {
    // Always allow dashboard to open, even if API fails
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [updatesRes, suggestionsRes] = await Promise.all([
        fetch('/api/admin/updates', { credentials: 'include' }).catch(() => null),
        fetch('/api/admin/suggestions', { credentials: 'include' }).catch(() => null),
      ])

      // Continue even if we get 401 - no redirects
      if (updatesRes?.status === 401 || suggestionsRes?.status === 401) {
        console.log('Unauthorized, but continuing anyway')
      }

      // Handle updates - always set empty array if fails
      if (updatesRes?.ok) {
        try {
          const updatesData = await updatesRes.json()
          setUpdates(Array.isArray(updatesData) ? updatesData : [])
        } catch (e) {
          console.error('Error parsing updates:', e)
          setUpdates([])
        }
      } else {
        console.warn('Could not fetch updates, using empty array')
        setUpdates([])
      }

      // Handle suggestions - always set empty array if fails
      if (suggestionsRes?.ok) {
        try {
          const suggestionsData = await suggestionsRes.json()
          setSuggestions(Array.isArray(suggestionsData) ? suggestionsData : [])
        } catch (e) {
          console.error('Error parsing suggestions:', e)
          setSuggestions([])
        }
      } else {
        console.warn('Could not fetch suggestions, using empty array')
        setSuggestions([])
      }

      setLoading(false)
    } catch (error) {
      console.error('Error fetching data:', error)
      // Always set empty arrays and stop loading, don't block dashboard
      setUpdates([])
      setSuggestions([])
      setLoading(false)
    }
  }

  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string | null; show: boolean }>({ id: null, show: false })

  const handleDelete = async (id: string) => {
    setDeleteConfirm({ id, show: true })
  }

  const confirmDelete = async () => {
    if (!deleteConfirm.id) return

    try {
      const response = await fetch(`/api/admin/updates/${deleteConfirm.id}`, {
        method: 'DELETE',
        credentials: 'include',
      })

      if (response.ok) {
        setUpdates(updates.filter((u) => u.id !== deleteConfirm.id))
      }
    } catch (error) {
      console.error('Error deleting update:', error)
    } finally {
      setDeleteConfirm({ id: null, show: false })
    }
  }

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/')
  }

  if (loading) {
    return (
      <div className="admin-panel">
        <div className="container">
          <div className="loading">Duke u ngarkuar...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-panel">
      <div className="container">
        <div className="admin-header">
          <h1>Admin Panel</h1>
          <button onClick={handleLogout} className="btn btn-secondary">
            Dil
          </button>
        </div>

        <div className="admin-tabs">
          <button
            className={activeTab === 'updates' ? 'active' : ''}
            onClick={() => setActiveTab('updates')}
          >
            Përditësimet ({updates.length})
          </button>
          <button
            className={activeTab === 'suggestions' ? 'active' : ''}
            onClick={() => setActiveTab('suggestions')}
          >
            Sugjerimet ({suggestions.filter((s) => s.status === 'pending').length})
          </button>
        </div>

        {activeTab === 'updates' && (
          <div className="updates-section">
            <div className="section-header">
              <h2>Menaxhim i Përditësimeve</h2>
              <button
                onClick={() => {
                  setEditingUpdate(null)
                  setShowAddForm(true)
                }}
                className="btn btn-primary"
              >
                + Shto Përditësim
              </button>
            </div>

            {showAddForm && (
              <UpdateForm
                update={editingUpdate}
                onClose={() => {
                  setShowAddForm(false)
                  setEditingUpdate(null)
                }}
                onSuccess={() => {
                  setShowAddForm(false)
                  setEditingUpdate(null)
                  fetchData()
                }}
              />
            )}

            <div className="updates-list">
              {updates.map((update) => (
                <div key={update.id} className="update-item">
                  <div className="update-item-content">
                    <h3>{update.title}</h3>
                    <p className="update-meta">
                      {new Date(update.created_at).toLocaleDateString('sq-AL')} •{' '}
                      {update.published ? 'Publikuar' : 'Draft'}
                    </p>
                    <p className="update-preview">
                      {update.content.substring(0, 150)}...
                    </p>
                  </div>
                  <div className="update-actions">
                    <button
                      onClick={() => {
                        setEditingUpdate(update)
                        setShowAddForm(true)
                      }}
                      className="btn btn-secondary"
                    >
                      Modifiko
                    </button>
                    <button
                      onClick={() => handleDelete(update.id)}
                      className="btn btn-danger"
                    >
                      Fshi
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'suggestions' && (
          <div className="suggestions-section">
            <h2>Sugjerimet nga Mësuesit</h2>
            <div className="suggestions-list">
              {suggestions.map((suggestion) => (
                <SuggestionItem
                  key={suggestion.id}
                  suggestion={suggestion}
                  onUpdate={fetchData}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm.show && (
        <div className="modal-overlay" onClick={() => setDeleteConfirm({ id: null, show: false })}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to delete this update? This action cannot be undone.</p>
            <div className="modal-actions">
              <button
                onClick={confirmDelete}
                className="btn btn-danger"
              >
                Delete
              </button>
              <button
                onClick={() => setDeleteConfirm({ id: null, show: false })}
                className="btn btn-secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

interface ImageData {
  url: string
  isMain: boolean
  position: 'top' | 'left' | 'right' | 'none'
}

function UpdateForm({
  update,
  onClose,
  onSuccess,
}: {
  update: Update | null
  onSuccess: () => void
  onClose: () => void
}) {
  const [title, setTitle] = useState(update?.title || '')
  const [content, setContent] = useState(update?.content || '')
  const [published, setPublished] = useState(update?.published ?? true)
  const [images, setImages] = useState<ImageData[]>([])
  const [newImageUrl, setNewImageUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const url = update
        ? `/api/admin/updates/${update.id}`
        : '/api/admin/updates'
      const method = update ? 'PUT' : 'POST'

      // Convert images to the format expected by API
      const imagesForApi = images.map((img, idx) => ({
        url: img.url,
        isMain: img.isMain,
        position: img.position,
        displayOrder: idx,
      }))

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          content,
          published,
          images: imagesForApi,
        }),
        credentials: 'include',
      })

      if (!response.ok) {
        let errorMessage = 'Error saving update'
        try {
          const data = await response.json()
          errorMessage = data.error || errorMessage
        } catch (e) {
          errorMessage = `Server error: ${response.status} ${response.statusText}`
        }
        console.error('Update save error:', errorMessage)
        setError(errorMessage)
        setLoading(false)
        return
      }

      const result = await response.json()
      console.log('Update saved successfully:', result)
      onSuccess()
    } catch (err) {
      console.error('Error submitting form:', err)
      const errorMessage = err instanceof Error ? err.message : 'Error connecting to server'
      setError(`Connection error: ${errorMessage}`)
      setLoading(false)
    }
  }

  const addImage = () => {
    const url = newImageUrl.trim()
    if (url) {
      // If this is the first image, make it main by default
      const isMain = images.length === 0
      setImages([...images, { url, isMain, position: isMain ? 'top' : 'none' }])
      setNewImageUrl('')
    }
  }

  const handleImageUrlKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addImage()
    }
  }


  const updateImagePosition = (index: number, position: string) => {
    const newImages = [...images]
    newImages[index] = { ...newImages[index], position: position as 'top' | 'left' | 'right' | 'none' }
    setImages(newImages)
  }

  const setMainImage = (index: number) => {
    const newImages = images.map((img, idx) => ({
      ...img,
      isMain: idx === index,
      position: (idx === index ? 'top' : img.position === 'top' ? 'none' : img.position) as 'top' | 'left' | 'right' | 'none',
    }))
    setImages(newImages)
  }

  return (
    <div className="update-form-overlay">
      <div className="update-form-card">
        <h2>{update ? 'Modifiko Përditësim' : 'Shto Përditësim të Ri'}</h2>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Titulli</label>
            <input
              type="text"
              className="form-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Përmbajtja</label>
            <textarea
              className="form-textarea"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>
              <input
                type="checkbox"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
              />
              {' '}Publikuar
            </label>
          </div>
          <div className="form-group">
            <label className="form-label">Images (URL only)</label>
            
            {/* URL Input */}
            <div className="add-image-input">
              <input
                type="text"
                className="form-input"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                onKeyPress={handleImageUrlKeyPress}
                placeholder="Enter image URL and press Enter or click 'Add'"
              />
              <button
                type="button"
                onClick={addImage}
                className="btn btn-secondary"
                disabled={!newImageUrl.trim()}
              >
                Add
              </button>
            </div>

            {/* Image List */}
            {images.length > 0 && (
              <div className="images-list">
                {images.map((img, idx) => (
                  <div key={idx} className="image-item-enhanced">
                    <div className="image-preview">
                      <img src={img.url} alt={`Preview ${idx + 1}`} />
                    </div>
                    <div className="image-controls">
                      <div className="image-url-input">
                        <input
                          type="text"
                          className="form-input"
                          value={img.url}
                          onChange={(e) => {
                            const newImages = [...images]
                            newImages[idx] = { ...newImages[idx], url: e.target.value }
                            setImages(newImages)
                          }}
                          placeholder="Image URL"
                        />
                      </div>
                      <div className="image-actions">
                        <button
                          type="button"
                          onClick={() => setMainImage(idx)}
                          className={`btn ${img.isMain ? 'btn-primary' : 'btn-secondary'}`}
                          title="Set as main image (top)"
                        >
                          {img.isMain ? '⭐ Main' : 'Set Main'}
                        </button>
                        <select
                          value={img.position}
                          onChange={(e) => updateImagePosition(idx, e.target.value as 'top' | 'left' | 'right' | 'none')}
                          className="form-select"
                          disabled={img.isMain}
                        >
                          <option value="none">Position: None</option>
                          <option value="left">Position: Left</option>
                          <option value="right">Position: Right</option>
                          <option value="top">Position: Top</option>
                        </select>
                        <button
                          type="button"
                          onClick={() => setImages(images.filter((_, i) => i !== idx))}
                          className="btn btn-danger"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Duke ruajtur...' : update ? 'Përditëso' : 'Ruaj'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
            >
              Anulo
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function SuggestionItem({
  suggestion,
  onUpdate,
}: {
  suggestion: Suggestion
  onUpdate: () => void
}) {
  const [status, setStatus] = useState(suggestion.status)
  const [feedback, setFeedback] = useState(suggestion.admin_feedback || '')
  const [showFeedback, setShowFeedback] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleStatusChange = async (newStatus: string) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/admin/suggestions/${suggestion.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          admin_feedback: feedback,
        }),
      })

      if (response.ok) {
        setStatus(newStatus)
        onUpdate()
      }
    } catch (error) {
      console.error('Error updating suggestion:', error)
    } finally {
      setLoading(false)
    }
  }

  const statusColors: Record<string, string> = {
    pending: '#f59e0b',
    approved: '#10b981',
    rejected: '#ef4444',
    implemented: '#3b82f6',
  }

  return (
    <div className="suggestion-item">
      <div className="suggestion-header">
        <h3>{suggestion.title}</h3>
        <span
          className="status-badge"
          style={{ backgroundColor: statusColors[status] || '#666' }}
        >
          {status}
        </span>
      </div>
      <p className="suggestion-content">{suggestion.content}</p>
      <p className="suggestion-date">
        {new Date(suggestion.created_at).toLocaleDateString('sq-AL')}
      </p>
      {suggestion.admin_feedback && (
        <div className="admin-feedback">
          <strong>Feedback:</strong> {suggestion.admin_feedback}
        </div>
      )}
      <div className="suggestion-actions">
        <button
          onClick={() => setShowFeedback(!showFeedback)}
          className="btn btn-secondary"
        >
          {showFeedback ? 'Fshih' : 'Shto/Modifiko Feedback'}
        </button>
        {showFeedback && (
          <div className="feedback-form">
            <textarea
              className="form-textarea"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Shkruani feedback-in tuaj..."
            />
            <div className="status-buttons">
              <button
                onClick={() => handleStatusChange('approved')}
                className="btn btn-success"
                disabled={loading}
              >
                Aprovo
              </button>
              <button
                onClick={() => handleStatusChange('rejected')}
                className="btn btn-danger"
                disabled={loading}
              >
                Refuzo
              </button>
              <button
                onClick={() => handleStatusChange('implemented')}
                className="btn"
                style={{ background: '#3b82f6', color: 'white' }}
                disabled={loading}
              >
                Implementuar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

