'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface Suggestion {
  id: string
  title: string
  content: string
  status: 'pending' | 'approved' | 'rejected' | 'implemented'
  admin_feedback: string | null
  created_at: string
}

export default function TeacherPanel() {
  const router = useRouter()
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    // Always allow dashboard to open, even if API fails
    fetchSuggestions()
  }, [])

  const fetchSuggestions = async () => {
    try {
      const response = await fetch('/api/teacher/suggestions', { credentials: 'include' }).catch(() => null)
      
      // Continue even if we get 401 - no redirects
      if (response?.status === 401) {
        console.log('Unauthorized, but continuing anyway')
      }

      // Always set empty array if fetch fails, don't block dashboard
      if (response?.ok) {
        try {
          const data = await response.json()
          setSuggestions(Array.isArray(data) ? data : [])
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
      console.error('Error fetching suggestions:', error)
      // Always set empty array and stop loading, don't block dashboard
      setSuggestions([])
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/')
  }

  if (loading) {
    return (
      <div className="teacher-panel">
        <div className="container">
          <div className="loading">Duke u ngarkuar...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="teacher-panel">
      <div className="container">
        <div className="teacher-header">
          <h1>Teacher Panel</h1>
          <button onClick={handleLogout} className="btn btn-secondary">
            Dil
          </button>
        </div>

        <div className="teacher-content">
          <div className="section-header">
            <h2>Sugjerimet e Mia</h2>
            <button
              onClick={() => setShowForm(true)}
              className="btn btn-primary"
            >
              + Sugjero i Ri
            </button>
          </div>

          {showForm && (
            <SuggestionForm
              onClose={() => setShowForm(false)}
              onSuccess={() => {
                setShowForm(false)
                fetchSuggestions()
              }}
            />
          )}

          <div className="suggestions-list">
            {suggestions.length > 0 ? (
              suggestions.map((suggestion) => (
                <SuggestionCard
                  key={suggestion.id}
                  suggestion={suggestion}
                />
              ))
            ) : (
              <p className="no-data">Nuk keni sugjerime akoma.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function SuggestionForm({
  onClose,
  onSuccess,
}: {
  onClose: () => void
  onSuccess: () => void
}) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/teacher/suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content }),
      })

      if (!response.ok) {
        const data = await response.json()
        setError(data.error || 'Gabim në dërgim')
        setLoading(false)
        return
      }

      onSuccess()
    } catch (err) {
      setError('Gabim në lidhje me serverin')
      setLoading(false)
    }
  }

  return (
    <div className="suggestion-form-overlay">
      <div className="suggestion-form-card">
        <h2>Sugjero i Ri</h2>
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
          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Duke dërguar...' : 'Dërgo'}
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

function SuggestionCard({ suggestion }: { suggestion: Suggestion }) {
  const statusColors: Record<string, string> = {
    pending: '#f59e0b',
    approved: '#10b981',
    rejected: '#ef4444',
    implemented: '#3b82f6',
  }

  const statusLabels: Record<string, string> = {
    pending: 'Në Pritje',
    approved: 'Aprovuar',
    rejected: 'Refuzuar',
    implemented: 'Implementuar',
  }

  return (
    <div className="suggestion-card">
      <div className="suggestion-header">
        <h3>{suggestion.title}</h3>
        <span
          className="status-badge"
          style={{ backgroundColor: statusColors[suggestion.status] || '#666' }}
        >
          {statusLabels[suggestion.status]}
        </span>
      </div>
      <p className="suggestion-content">{suggestion.content}</p>
      <p className="suggestion-date">
        {new Date(suggestion.created_at).toLocaleDateString('sq-AL', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
      </p>
      {suggestion.admin_feedback && (
        <div className="admin-feedback">
          <strong>Feedback nga Admin:</strong>
          <p>{suggestion.admin_feedback}</p>
        </div>
      )}
    </div>
  )
}

