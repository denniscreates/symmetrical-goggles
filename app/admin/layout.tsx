'use client'

import { useEffect, useState } from 'react'

// Change this password to your desired admin password
const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'Admin@2026!RobotikaSHFMU'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isChecking, setIsChecking] = useState(true)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    // Check if already authenticated
    const authStatus = sessionStorage.getItem('admin-authenticated')
    if (authStatus === 'true') {
      setIsAuthenticated(true)
      setIsChecking(false)
    } else {
      setIsChecking(false)
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem('admin-authenticated', 'true')
      setIsAuthenticated(true)
    } else {
      setError('Incorrect password. Please try again.')
      setPassword('')
    }
  }

  if (isChecking) {
    return (
      <div className="admin-password-check">
        <div className="loading">Checking authentication...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="admin-password-check">
        <div className="password-form-container">
          <div className="password-form-card">
            <h1>Admin Access</h1>
            <p>Please enter the password to access the admin panel.</p>
            
            {error && (
              <div className="alert alert-error">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="password-form">
              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  className="form-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoFocus
                  placeholder="Enter admin password"
                />
              </div>

              <button type="submit" className="btn btn-primary">
                Access Admin Panel
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
