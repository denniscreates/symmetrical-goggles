import Link from 'next/link'
import Image from 'next/image'

export default function Header() {
  const logoUrl = 'https://image2url.com/r2/bucket2/images/1768007010531-a123974b-a1a7-4507-a0e6-f6ee33643781.png'

  return (
    <header className="header">
      <div className="header-container">
        <Link href="/" className="logo-link">
          <Image
            src={logoUrl}
            alt="Robotics Updates 2026 Logo"
            width={400}
            height={160}
            className="logo"
            priority
          />
        </Link>
      </div>
    </header>
  )
}

