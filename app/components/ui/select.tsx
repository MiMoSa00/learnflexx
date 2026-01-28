import React, { useState, useRef, useEffect } from "react"
import { cn } from "@/app/lib/utils"
import { ChevronDown } from "lucide-react"

interface SelectContextType {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  close: () => void
  value: string | undefined
  setValue: (value: string) => void
}

const SelectContext = React.createContext<SelectContextType | undefined>(undefined)

const useSelect = () => {
  const context = React.useContext(SelectContext)
  if (!context) {
    throw new Error("useSelect must be used within Select")
  }
  return context
}

interface SelectProps {
  children: React.ReactNode
  value?: string
  onValueChange?: (value: string) => void
}

export function Select({ children, value = "", onValueChange }: SelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [internalValue, setInternalValue] = useState(value)
  const selectRef = useRef<HTMLDivElement>(null)

  const handleValueChange = (newValue: string) => {
    setInternalValue(newValue)
    onValueChange?.(newValue)
    setIsOpen(false)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isOpen])

  return (
    <SelectContext.Provider
      value={{
        isOpen,
        setIsOpen,
        close: () => setIsOpen(false),
        value: internalValue,
        setValue: handleValueChange,
      }}
    >
      <div ref={selectRef} className="relative inline-block w-full">{children}</div>
    </SelectContext.Provider>
  )
}

interface SelectTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
}

export function SelectTrigger({ children, className, ...props }: SelectTriggerProps) {
  const { isOpen, setIsOpen } = useSelect()

  return (
    <button
      className={cn(
        "flex items-center justify-between w-full px-3 py-2 rounded-md border border-input bg-background text-foreground placeholder:text-muted-foreground",
        "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      onClick={() => setIsOpen(!isOpen)}
      {...props}
    >
      {children}
      <ChevronDown className={cn("w-4 h-4 transition-transform", isOpen && "rotate-180")} />
    </button>
  )
}

interface SelectValueProps {
  placeholder?: string
}

export function SelectValue({ placeholder = "Select..." }: SelectValueProps) {
  const { value } = useSelect()

  return <span>{value || placeholder}</span>
}

interface SelectContentProps {
  children: React.ReactNode
  className?: string
}

export function SelectContent({ children, className }: SelectContentProps) {
  const { isOpen } = useSelect()

  if (!isOpen) return null

  return (
    <div
      className={cn(
        "absolute top-full left-0 right-0 mt-2 z-50 rounded-md border border-border bg-card shadow-lg overflow-hidden",
        className
      )}
    >
      <div className="max-h-64 overflow-y-auto">{children}</div>
    </div>
  )
}

interface SelectItemProps {
  value: string
  children: React.ReactNode
  className?: string
}

export function SelectItem({ value, children, className }: SelectItemProps) {
  const { value: selectedValue, setValue } = useSelect()

  return (
    <button
      onClick={() => setValue(value)}
      className={cn(
        "w-full px-3 py-2 text-left text-sm hover:bg-muted transition-colors",
        selectedValue === value && "bg-primary text-primary-foreground",
        className
      )}
    >
      {children}
    </button>
  )
}
