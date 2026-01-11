'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Error caught by error boundary:', error)
    console.error('Error message:', error?.message)
    console.error('Error stack:', error?.stack)
  }, [error])

  const errorMessage = error?.message || 'Një gabim ka ndodhur'
  const safeErrorMessage = typeof errorMessage === 'string' ? errorMessage : 'Një gabim ka ndodhur'

  return (
    <div className="error-page">
      <div className="error-content">
        <h1>Diçka shkoi keq!</h1>
        <p>{safeErrorMessage}</p>
        <button onClick={reset} className="btn btn-primary">
          Provo Përsëri
        </button>
      </div>
    </div>
  )
}

