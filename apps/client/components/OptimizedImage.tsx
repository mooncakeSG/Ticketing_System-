'use client'

import Image from 'next/image'
import { useState } from 'react'

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
  placeholder?: 'blur' | 'empty'
  sizes?: string
  quality?: number
  fill?: boolean
  style?: React.CSSProperties
}

export const OptimizedImage = ({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  placeholder = 'empty',
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  quality = 75,
  fill = false,
  style,
}: OptimizedImageProps) => {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)

  const handleLoad = () => {
    setIsLoading(false)
  }

  const handleError = () => {
    setError(true)
    setIsLoading(false)
  }

  // Fallback for error state
  if (error) {
    return (
      <div
        className={`bg-gray-200 flex items-center justify-center ${className}`}
        style={{
          width: fill ? '100%' : width,
          height: fill ? '100%' : height,
          ...style,
        }}
      >
        <span className="text-gray-500 text-sm">Image failed to load</span>
      </div>
    )
  }

  return (
    <div className={`relative ${className}`} style={style}>
      <Image
        src={src}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        className={`transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
        priority={priority}
        placeholder={placeholder}
        sizes={sizes}
        quality={quality}
        fill={fill}
        onLoad={handleLoad}
        onError={handleError}
        loading={priority ? 'eager' : 'lazy'}
        style={{
          objectFit: fill ? 'cover' : 'contain',
        }}
      />
      
      {/* Loading skeleton */}
      {isLoading && (
        <div
          className="absolute inset-0 bg-gray-200 animate-pulse"
          style={{
            width: fill ? '100%' : width,
            height: fill ? '100%' : height,
          }}
        />
      )}
    </div>
  )
}

// Avatar component with optimized image
export const OptimizedAvatar = ({
  src,
  alt,
  size = 40,
  className,
}: {
  src: string
  alt: string
  size?: number
  className?: string
}) => {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      width={size}
      height={size}
      className={`rounded-full ${className}`}
      priority={false}
      sizes={`${size}px`}
    />
  )
}

// Hero image component with priority loading
export const HeroImage = ({
  src,
  alt,
  className,
}: {
  src: string
  alt: string
  className?: string
}) => {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      fill
      className={className}
      priority={true}
      sizes="100vw"
      quality={85}
    />
  )
}

// Thumbnail component for lists
export const ThumbnailImage = ({
  src,
  alt,
  className,
}: {
  src: string
  alt: string
  className?: string
}) => {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      width={80}
      height={80}
      className={`rounded-lg ${className}`}
      priority={false}
      sizes="80px"
      quality={60}
    />
  )
}

export default OptimizedImage 