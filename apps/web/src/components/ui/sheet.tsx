import * as React from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

interface SheetProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  title?: string
  description?: string
  width?: string
}

export function Sheet({
  isOpen,
  onClose,
  children,
  title,
  description,
  width = "max-w-xl"
}: SheetProps) {
  // Handle escape key
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    if (isOpen) {
      window.addEventListener("keydown", handleEscape)
      document.body.style.overflow = "hidden"
    }
    return () => {
      window.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = "unset"
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex justify-end overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity animate-in fade-in duration-300"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Sheet Panel */}
      <div 
        className={cn(
          "relative flex h-full w-full flex-col bg-[var(--card)] shadow-2xl outline-none animate-in slide-in-from-right duration-500 ease-in-out border-l border-[var(--border)]",
          width
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--border)] p-5">
          <div>
            {title && <h2 className="text-lg font-bold text-[var(--text)]">{title}</h2>}
            {description && <p className="mt-1 text-sm text-[var(--muted)]">{description}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-[var(--border)] p-2 text-[var(--muted)] transition-all hover:bg-[var(--card-soft)] hover:text-[var(--text)] hover:border-[var(--primary)]/30 active:scale-95"
          >
            <X className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-0">
          {children}
        </div>
      </div>
    </div>
  )
}
