"use client"

import { cn } from "@/app/lib/utils"

interface PlayfulLoaderProps {
  className?: string
  size?: "sm" | "md" | "lg"
  variant?: "dots" | "squares" | "pulse" | "bounce" | "morph"
}

export function PlayfulLoader({
  className,
  size = "md",
  variant = "dots",
}: PlayfulLoaderProps) {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-12 h-12",
    lg: "w-20 h-20",
  }

  const dotSizes = {
    sm: "w-1.5 h-1.5",
    md: "w-3 h-3",
    lg: "w-5 h-5",
  }

  if (variant === "dots") {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={cn(
              dotSizes[size],
              "rounded-full bg-primary",
              "animate-bounce"
            )}
            style={{
              animationDelay: `${i * 0.15}s`,
              animationDuration: "0.6s",
            }}
          />
        ))}
      </div>
    )
  }

  if (variant === "squares") {
    return (
      <div className={cn("relative", sizeClasses[size], className)}>
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={cn(
              "absolute w-1/2 h-1/2 rounded-sm",
              i === 0 && "top-0 left-0 bg-primary",
              i === 1 && "top-0 right-0 bg-accent",
              i === 2 && "bottom-0 right-0 bg-primary",
              i === 3 && "bottom-0 left-0 bg-accent"
            )}
            style={{
              animation: `scale-bounce 1.2s ease-in-out ${i * 0.15}s infinite`,
            }}
          />
        ))}
      </div>
    )
  }

  if (variant === "pulse") {
    return (
      <div className={cn("relative", sizeClasses[size], className)}>
        <div className="absolute inset-0 rounded-full bg-primary/30 animate-ping" />
        <div className="absolute inset-2 rounded-full bg-primary/50 animate-ping animation-delay-150" />
        <div className="absolute inset-4 rounded-full bg-primary animate-pulse" />
      </div>
    )
  }

  if (variant === "bounce") {
    return (
      <div className={cn("relative", sizeClasses[size], className)}>
        <div
          className={cn(
            "w-full h-full rounded-lg bg-linear-to-br from-primary to-accent",
            "animate-bounce-rotate"
          )}
        />
      </div>
    )
  }

  if (variant === "morph") {
    return (
      <div className={cn("relative", sizeClasses[size], className)}>
        <div
          className={cn(
            "w-full h-full bg-linear-to-br from-primary via-accent to-primary",
            "animate-morph animate-gradient"
          )}
        />
      </div>
    )
  }

  return null
}

export function FullPageLoader({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-6">
        <div className="relative">
          {/* Outer ring */}
          <div className="w-24 h-24 rounded-full border-4 border-muted animate-pulse" />
          
          {/* Animated shapes */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 relative">
              <div
                className="absolute w-6 h-6 rounded-full bg-primary animate-bounce"
                style={{ top: "0", left: "50%", transform: "translateX(-50%)", animationDelay: "0s" }}
              />
              <div
                className="absolute w-6 h-6 rounded-full bg-accent animate-bounce"
                style={{ bottom: "0", left: "0", animationDelay: "0.2s" }}
              />
              <div
                className="absolute w-6 h-6 rounded-full bg-primary/70 animate-bounce"
                style={{ bottom: "0", right: "0", animationDelay: "0.4s" }}
              />
            </div>
          </div>
        </div>
        
        <div className="flex flex-col items-center gap-2">
          <p className="text-lg font-medium text-foreground animate-pulse">{message}</p>
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full bg-primary animate-bounce"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export function SkeletonLoader({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-lg bg-muted",
        className
      )}
    />
  )
}
