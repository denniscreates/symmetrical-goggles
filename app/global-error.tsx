'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const errorMessage = error?.message || 'Një gabim ka ndodhur'
  const safeErrorMessage = typeof errorMessage === 'string' ? errorMessage : 'Një gabim ka ndodhur'

  return (
    <html>
      <body>
        <div className="error-page">
          <div className="error-content">
            <h1>Diçka shkoi keq!</h1>
            <p>{safeErrorMessage}</p>
            <button onClick={reset} className="btn btn-primary">
              Provo Përsëri
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}

