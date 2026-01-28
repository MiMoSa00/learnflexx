"use client"

import { useScrollReveal } from "@/hooks/use-scroll-reveal"
import { cn } from "@/app/lib/utils"
import type { ReactNode } from "react"

interface ScrollRevealProps {
  children: ReactNode
  className?: string
  direction?: "up" | "down" | "left" | "right" | "scale"
  delay?: number
  duration?: number
  threshold?: number
  triggerOnce?: boolean
}

export function ScrollReveal({
  children,
  className,
  direction = "up",
  delay = 0,
  duration = 600,
  threshold = 0.1,
  triggerOnce = true,
}: ScrollRevealProps) {
  const { ref, isRevealed } = useScrollReveal<HTMLDivElement>({
    threshold,
    triggerOnce,
  })

  const directionClasses = {
    up: "translate-y-10",
    down: "-translate-y-10",
    left: "translate-x-10",
    right: "-translate-x-10",
    scale: "scale-95",
  }

  return (
    <div
      ref={ref}
      className={cn(
        "transition-all",
        !isRevealed && "opacity-0",
        !isRevealed && directionClasses[direction],
        isRevealed && "opacity-100 translate-x-0 translate-y-0 scale-100",
        className
      )}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
        transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
      {children}
    </div>
  )
}

interface StaggerRevealProps {
  children: ReactNode[]
  className?: string
  childClassName?: string
  direction?: "up" | "down" | "left" | "right" | "scale"
  staggerDelay?: number
  duration?: number
  threshold?: number
}

export function StaggerReveal({
  children,
  className,
  childClassName,
  direction = "up",
  staggerDelay = 100,
  duration = 600,
  threshold = 0.1,
}: StaggerRevealProps) {
  const { ref, isRevealed } = useScrollReveal<HTMLDivElement>({
    threshold,
    triggerOnce: true,
  })

  const directionClasses = {
    up: "translate-y-10",
    down: "-translate-y-10",
    left: "translate-x-10",
    right: "-translate-x-10",
    scale: "scale-95",
  }

  return (
    <div ref={ref} className={className}>
      {children.map((child, index) => (
        <div
          key={index}
          className={cn(
            "transition-all",
            !isRevealed && "opacity-0",
            !isRevealed && directionClasses[direction],
            isRevealed && "opacity-100 translate-x-0 translate-y-0 scale-100",
            childClassName
          )}
          style={{
            transitionDuration: `${duration}ms`,
            transitionDelay: `${index * staggerDelay}ms`,
            transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          {child}
        </div>
      ))}
    </div>
  )
}
