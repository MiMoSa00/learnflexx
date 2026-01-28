"use client"

import React from "react"

import { cn } from "@/app/lib/utils"
import type { ButtonHTMLAttributes, ReactNode } from "react"

interface BouncyButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: "primary" | "secondary" | "outline" | "ghost"
  size?: "sm" | "md" | "lg"
  className?: string
  ripple?: boolean
}

export function BouncyButton({
  children,
  variant = "primary",
  size = "md",
  className,
  ripple = true,
  ...props
}: BouncyButtonProps) {
  const baseClasses =
    "relative overflow-hidden font-semibold rounded-xl transition-all duration-300 ease-out transform active:scale-95 hover:scale-105 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:translate-y-0 inline-flex items-center justify-center gap-2"

  const variantClasses = {
    primary:
      "bg-primary text-primary-foreground hover:shadow-lg hover:shadow-primary/30 focus:ring-primary",
    secondary:
      "bg-accent text-accent-foreground hover:shadow-lg hover:shadow-accent/30 focus:ring-accent",
    outline:
      "border-2 border-primary text-primary bg-transparent hover:bg-primary hover:text-primary-foreground focus:ring-primary",
    ghost:
      "bg-transparent text-foreground hover:bg-muted focus:ring-muted",
  }

  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  }

  const handleRipple = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!ripple) return

    const button = e.currentTarget
    const rect = button.getBoundingClientRect()
    const size = Math.max(rect.width, rect.height)
    const x = e.clientX - rect.left - size / 2
    const y = e.clientY - rect.top - size / 2

    const rippleEl = document.createElement("span")
    rippleEl.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
      background: currentColor;
      opacity: 0.3;
      border-radius: 50%;
      transform: scale(0);
      animation: ripple-effect 0.6s ease-out;
      pointer-events: none;
    `

    button.appendChild(rippleEl)

    setTimeout(() => rippleEl.remove(), 600)
  }

  return (
    <>
      <style jsx global>{`
        @keyframes ripple-effect {
          to {
            transform: scale(2);
            opacity: 0;
          }
        }
      `}</style>
      <button
        className={cn(baseClasses, variantClasses[variant], sizeClasses[size], className)}
        onClick={(e) => {
          handleRipple(e)
          props.onClick?.(e)
        }}
        {...props}
      >
        {children}
      </button>
    </>
  )
}
