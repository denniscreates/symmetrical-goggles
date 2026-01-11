'use client'

import { useState } from 'react'

interface ImageDisplayProps {
  src: string
  alt: string
  className: string
  width?: number
  height?: number
}

export default function ImageDisplay({ src, alt, className, width, height }: ImageDisplayProps) {
  const [hasError, setHasError] = useState(false)

  if (hasError || !src || !src.trim()) {
    return null
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      width={width}
      height={height}
      onError={() => {
        console.error('Image failed to load:', src)
        setHasError(true)
      }}
      onLoad={() => {
        console.log('Image loaded successfully:', src)
      }}
    />
  )
}
