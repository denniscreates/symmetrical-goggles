import Link from 'next/link'
import Image from 'next/image'

export default function Header() {
  const schoolLogoUrl = 'https://image2url.com/r2/bucket2/images/1768007010531-a123974b-a1a7-4507-a0e6-f6ee33643781.png'
  const kosovaMakersLogoUrl = 'https://image2url.com/r2/bucket2/images/1768007938579-1c3c75bd-4c18-46ad-8c2c-06a2abffbd27.png'

  return (
    <header className="header">
      <div className="header-container">
        <Link href="/" className="logo-link">
          <Image
            src={schoolLogoUrl}
            alt="SHFMU Ismail Qemali Logo"
            width={250}
            height={100}
            className="logo school-logo"
            priority
          />
          <Image
            src={kosovaMakersLogoUrl}
            alt="Kosova Makers League Logo"
            width={400}
            height={160}
            className="logo kosova-makers-logo"
            priority
          />
        </Link>
      </div>
    </header>
  )
}

