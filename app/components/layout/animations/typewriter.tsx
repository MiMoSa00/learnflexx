"use client"

import { useEffect, useState } from "react"
import { cn } from "@/app/lib/utils"

interface TypewriterProps {
  text: string
  className?: string
  speed?: number
  delay?: number
  cursor?: boolean
  cursorChar?: string
  onComplete?: () => void
}

export function Typewriter({
  text,
  className,
  speed = 50,
  delay = 0,
  cursor = true,
  cursorChar = "|",
  onComplete,
}: TypewriterProps) {
  const [displayedText, setDisplayedText] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [showCursor, setShowCursor] = useState(true)

  useEffect(() => {
    const startTimeout = setTimeout(() => {
      setIsTyping(true)
    }, delay)

    return () => clearTimeout(startTimeout)
  }, [delay])

  useEffect(() => {
    if (!isTyping) return

    if (displayedText.length < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(text.slice(0, displayedText.length + 1))
      }, speed)

      return () => clearTimeout(timeout)
    } else {
      onComplete?.()
    }
  }, [displayedText, text, speed, isTyping, onComplete])

  useEffect(() => {
    if (!cursor) return

    const interval = setInterval(() => {
      setShowCursor((prev) => !prev)
    }, 500)

    return () => clearInterval(interval)
  }, [cursor])

  return (
    <span className={cn("inline-block", className)}>
      {displayedText}
      {cursor && (
        <span
          className={cn(
            "inline-block text-primary transition-opacity duration-100",
            showCursor ? "opacity-100" : "opacity-0"
          )}
        >
          {cursorChar}
        </span>
      )}
    </span>
  )
}

interface TypewriterMultipleProps {
  texts: string[]
  className?: string
  speed?: number
  delay?: number
  pauseBetween?: number
  loop?: boolean
}

export function TypewriterMultiple({
  texts,
  className,
  speed = 50,
  delay = 0,
  pauseBetween = 2000,
  loop = true,
}: TypewriterMultipleProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [displayedText, setDisplayedText] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)
  const [isWaiting, setIsWaiting] = useState(false)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const startTimeout = setTimeout(() => {
      setStarted(true)
    }, delay)

    return () => clearTimeout(startTimeout)
  }, [delay])

  useEffect(() => {
    if (!started || isWaiting) return

    const currentText = texts[currentIndex]

    if (!isDeleting) {
      if (displayedText.length < currentText.length) {
        const timeout = setTimeout(() => {
          setDisplayedText(currentText.slice(0, displayedText.length + 1))
        }, speed)
        return () => clearTimeout(timeout)
      } else {
        setIsWaiting(true)
        const timeout = setTimeout(() => {
          setIsWaiting(false)
          setIsDeleting(true)
        }, pauseBetween)
        return () => clearTimeout(timeout)
      }
    } else {
      if (displayedText.length > 0) {
        const timeout = setTimeout(() => {
          setDisplayedText(displayedText.slice(0, -1))
        }, speed / 2)
        return () => clearTimeout(timeout)
      } else {
        setIsDeleting(false)
        const nextIndex = (currentIndex + 1) % texts.length
        if (!loop && nextIndex === 0) return
        setCurrentIndex(nextIndex)
      }
    }
  }, [displayedText, isDeleting, currentIndex, texts, speed, pauseBetween, started, isWaiting, loop])

  return (
    <span className={cn("inline-block", className)}>
      {displayedText}
      <span className="inline-block w-0.5 h-[1em] bg-primary ml-1 animate-pulse" />
    </span>
  )
}
