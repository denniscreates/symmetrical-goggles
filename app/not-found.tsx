import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="not-found">
      <div className="not-found-content">
        <h1>404</h1>
        <h2>Faqja nuk u gjet</h2>
        <p>Faqja që po kërkoni nuk ekziston ose është zhvendosur.</p>
        <Link href="/" className="btn btn-primary">
          Kthehu në Homepage
        </Link>
      </div>
    </div>
  )
}
