import Link from 'next/link'

export default function Unauthorized() {
  return (
    <div className="unauthorized">
      <div className="unauthorized-content">
        <h1>403</h1>
        <h2>Qasje e Kufizuar</h2>
        <p>Ju nuk keni të drejtë për të hyrë në këtë faqe.</p>
        <div className="actions">
          <Link href="/" className="btn btn-primary">
            Kthehu në Homepage
          </Link>
        </div>
      </div>
    </div>
  )
}

