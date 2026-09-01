'use client'

import { useState, useRef, useEffect, ReactNode } from 'react'
import { ChevronDown, Check } from 'lucide-react'

export interface SelectOption {
  value: string
  label: string
  icon?: ReactNode
}

interface CustomSelectProps {
  value: string
  onChange: (value: string) => void
  options: (SelectOption | string)[]
  placeholder?: string
  className?: string
  menuClassName?: string
  prefixIcon?: ReactNode
  actionOption?: {
    value: string
    label: string
    icon?: ReactNode
    onSelect?: () => void
  }
  align?: 'left' | 'right'
  'aria-label'?: string
}

export default function CustomSelect({
  value,
  onChange,
  options,
  placeholder = 'Select an option',
  className = '',
  menuClassName = '',
  prefixIcon,
  actionOption,
  align = 'left',
  'aria-label': ariaLabel,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Normalize options array to SelectOption[]
  const normalizedOptions: SelectOption[] = options.map((opt) =>
    typeof opt === 'string' ? { value: opt, label: opt } : opt
  )

  const selectedOption = normalizedOptions.find(
    (opt) => opt.value.toLowerCase() === value.toLowerCase()
  )

  const displayLabel = selectedOption ? selectedOption.label : value || placeholder

  // Close dropdown when clicking outside
  useEffect(() => {
    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('touchstart', handlePointerDown)
    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('touchstart', handlePointerDown)
    }
  }, [])

  // Close dropdown on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  const handleSelect = (val: string) => {
    onChange(val)
    setIsOpen(false)
  }

  return (
    <div ref={containerRef} className="relative inline-block text-left w-full">
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={ariaLabel || displayLabel}
        className={`w-full flex items-center justify-between gap-2 px-3 py-1.5 rounded-xl border border-theme-border bg-theme-subtle text-theme-text text-xs font-semibold hover:border-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition-all cursor-pointer ${className}`}
      >
        <div className="flex items-center gap-2 truncate min-w-0">
          {prefixIcon && <span className="shrink-0 text-theme-muted">{prefixIcon}</span>}
          <span className="truncate text-theme-text font-medium">{displayLabel}</span>
        </div>
        <ChevronDown
          className={`h-3.5 w-3.5 text-theme-muted shrink-0 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-purple-500' : ''
          }`}
        />
      </button>

      {/* Popover Dropdown Menu */}
      {isOpen && (
        <div
          role="listbox"
          className={`absolute z-50 mt-1.5 w-full min-w-[180px] max-h-60 overflow-y-auto rounded-xl border border-theme-border bg-theme-card p-1 shadow-2xl space-y-0.5 animate-in fade-in zoom-in-95 duration-150 ${
            align === 'right' ? 'right-0' : 'left-0'
          } ${menuClassName}`}
        >
          {normalizedOptions.map((opt) => {
            const isSelected = opt.value.toLowerCase() === value.toLowerCase()

            return (
              <button
                key={opt.value}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => handleSelect(opt.value)}
                className={`w-full text-left px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center justify-between gap-2 cursor-pointer ${
                  isSelected
                    ? 'bg-purple-600 text-white font-semibold shadow-xs'
                    : 'text-theme-text hover:bg-theme-subtle hover:text-theme-text'
                }`}
              >
                <div className="flex items-center gap-2 truncate min-w-0">
                  {opt.icon && <span className="shrink-0">{opt.icon}</span>}
                  <span className="truncate">{opt.label}</span>
                </div>
                {isSelected && <Check className="h-3.5 w-3.5 text-white shrink-0" />}
              </button>
            )
          })}

          {/* Action Option (e.g. "+ Add custom...") */}
          {actionOption && (
            <div className="pt-1 mt-1 border-t border-theme-border">
              <button
                type="button"
                role="option"
                aria-selected={false}
                onClick={() => {
                  setIsOpen(false)
                  if (actionOption.onSelect) {
                    actionOption.onSelect()
                  } else {
                    onChange(actionOption.value)
                  }
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-purple-500 hover:text-purple-400 hover:bg-purple-500/10 transition-colors flex items-center gap-2 cursor-pointer"
              >
                {actionOption.icon && <span className="shrink-0">{actionOption.icon}</span>}
                <span className="truncate">{actionOption.label}</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
