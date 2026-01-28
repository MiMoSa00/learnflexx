import React, { useState, useRef, useEffect } from "react"
import { cn } from "@/app/lib/utils"

interface DropdownMenuContextType {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  close: () => void
}

const DropdownMenuContext = React.createContext<DropdownMenuContextType | undefined>(undefined)

const useDropdownMenu = () => {
  const context = React.useContext(DropdownMenuContext)
  if (!context) {
    throw new Error("useDropdownMenu must be used within DropdownMenu")
  }
  return context
}

interface DropdownMenuProps {
  children: React.ReactNode
}

export function DropdownMenu({ children }: DropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const close = () => setIsOpen(false)

  return (
    <DropdownMenuContext.Provider value={{ isOpen, setIsOpen, close }}>
      <div className="relative inline-block">{children}</div>
    </DropdownMenuContext.Provider>
  )
}

interface DropdownMenuTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  asChild?: boolean
}

export function DropdownMenuTrigger({ children, className, asChild = false, ...props }: DropdownMenuTriggerProps) {
  const { isOpen, setIsOpen } = useDropdownMenu()

  if (asChild && React.isValidElement(children)) {
    const childElement = children as React.ReactElement<any>
    return React.cloneElement(childElement, {
      onClick: (e: React.MouseEvent<any>) => {
        setIsOpen(!isOpen)
        childElement.props.onClick?.(e)
      },
      className: cn(childElement.props.className, className),
    })
  }

  return (
    <button
      className={cn("inline-flex items-center", className)}
      onClick={() => setIsOpen(!isOpen)}
      {...props}
    >
      {children}
    </button>
  )
}

interface DropdownMenuContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  align?: "start" | "center" | "end"
}

export function DropdownMenuContent({
  children,
  className,
  align = "start",
  ...props
}: DropdownMenuContentProps) {
  const { isOpen, close } = useDropdownMenu()
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (contentRef.current && !contentRef.current.contains(event.target as Node)) {
        const triggerElement = contentRef.current.parentElement?.querySelector("button")
        if (!triggerElement?.contains(event.target as Node)) {
          close()
        }
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isOpen, close])

  if (!isOpen) return null

  const alignClasses = {
    start: "left-0",
    center: "left-1/2 -translate-x-1/2",
    end: "right-0",
  }

  return (
    <div
      ref={contentRef}
      className={cn(
        "absolute top-full mt-2 z-50 min-w-56 rounded-lg border border-border bg-card shadow-lg",
        "origin-top animate-in fade-in zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=closed]:zoom-out-95",
        alignClasses[align],
        isOpen ? "block" : "hidden",
        className
      )}
      style={{
        animation: isOpen
          ? "slideDownAndFade 0.2s ease-out"
          : "slideUpAndFade 0.15s ease-in",
      }}
      {...props}
    >
      <style>{`
        @keyframes slideDownAndFade {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideUpAndFade {
          from {
            opacity: 1;
            transform: translateY(0);
          }
          to {
            opacity: 0;
            transform: translateY(-8px);
          }
        }
      `}</style>
      {children}
    </div>
  )
}

interface DropdownMenuItemProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  children: React.ReactNode
  onSelect?: () => void
  asChild?: boolean
}

export function DropdownMenuItem({
  children,
  className,
  onSelect,
  asChild = false,
  ...props
}: DropdownMenuItemProps) {
  const { close } = useDropdownMenu()

  const handleClick = (e: React.MouseEvent<any>) => {
    onSelect?.()
    close()
    props.onClick?.(e as React.MouseEvent<HTMLAnchorElement>)
  }

  if (asChild && React.isValidElement(children)) {
    const childElement = children as React.ReactElement<any>
    return React.cloneElement(childElement, {
      onClick: handleClick,
      className: cn(
        "flex items-center gap-2 px-4 py-2.5 text-sm text-foreground hover:bg-muted hover:text-foreground transition-colors duration-150 cursor-pointer",
        "first:rounded-t-lg last:rounded-b-lg",
        childElement.props.className,
        className
      ),
    })
  }

  return (
    <a
      className={cn(
        "flex items-center gap-2 px-4 py-2.5 text-sm text-foreground hover:bg-muted hover:text-foreground transition-colors duration-150 cursor-pointer",
        "first:rounded-t-lg last:rounded-b-lg",
        className
      )}
      onClick={handleClick}
      {...props}
    >
      {children}
    </a>
  )
}

export function DropdownMenuSeparator({ className }: { className?: string }) {
  return <div className={cn("my-1 h-px bg-border", className)} />
}

export function DropdownMenuLabel({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("px-4 py-2 text-xs font-semibold text-muted-foreground", className)}>{children}</div>
}
