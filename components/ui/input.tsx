import * as React from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium"
            style={{ color: 'var(--color-text-main)' }}
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'w-full rounded-lg px-3.5 py-2.5 text-sm outline-none transition-shadow',
            'bg-[var(--color-surface-muted)] border border-[var(--color-border)]',
            'text-[var(--color-text-main)] placeholder:text-[var(--color-text-muted)]',
            'focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent',
            error && 'border-[var(--color-danger)] focus:ring-[var(--color-danger)]',
            className
          )}
          {...props}
        />
        {error && (
          <p className="text-xs" style={{ color: 'var(--color-danger)' }}>
            {error}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'
