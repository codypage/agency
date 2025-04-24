import type React from "react"
import { cn } from "@/lib/utils"

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string
  alt: string
  width?: number
  height?: number
  priority?: boolean
  sizes?: string
  quality?: number
  className?: string
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  priority = false,
  sizes = "100vw",
  quality = 75,
  className,
  ...props
}: OptimizedImageProps) {
  // Generate srcSet for responsive images
  const generateSrcSet = () => {
    if (!width) return undefined

    const widths = [640, 750, 828, 1080, 1200, 1920, 2048]
    const filteredWidths = widths.filter((w) => w <= width * 2)

    if (filteredWidths.length === 0) {
      filteredWidths.push(width)
    }

    return filteredWidths
      .map((w) => {
        const calculatedSrc = src.includes("?")
          ? `${src}&width=${w}&quality=${quality}`
          : `${src}?width=${w}&quality=${quality}`
        return `${calculatedSrc} ${w}w`
      })
      .join(", ")
  }

  return (
    <img
      src={src || "/placeholder.svg"}
      alt={alt}
      width={width}
      height={height}
      sizes={sizes}
      srcSet={generateSrcSet()}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      className={cn("max-w-full h-auto", className)}
      {...props}
    />
  )
}
