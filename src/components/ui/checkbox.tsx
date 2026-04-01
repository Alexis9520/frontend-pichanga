'use client'

import * as React from 'react'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface CheckboxProps {
  id?: string
  label?: string
  checked?: boolean
  defaultChecked?: boolean
  disabled?: boolean
  required?: boolean
  name?: string
  value?: string
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void
  ref?: React.Ref<HTMLInputElement>
  className?: string
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      className,
      label,
      id,
      checked,
      defaultChecked,
      disabled,
      required,
      name,
      value,
      onChange,
      onBlur,
      ...props
    },
    ref
  ) => {
    const autoId = React.useId()
    const checkboxId = id || autoId
    const [internalChecked, setInternalChecked] = React.useState(defaultChecked ?? false)

    // Use controlled state if checked is provided, otherwise internal state
    const isChecked = checked !== undefined ? checked : internalChecked

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (checked === undefined) {
        setInternalChecked(event.target.checked)
      }
      onChange?.(event)
    }

    return (
      <div className="flex items-center gap-2">
        <button
          type="button"
          role="checkbox"
          aria-checked={isChecked}
          aria-disabled={disabled}
          disabled={disabled}
          onClick={() => {
            if (!disabled) {
              // Simulate a click on the hidden input
              const input = ref
                ? (ref as React.RefObject<HTMLInputElement>).current
                : (document.getElementById(checkboxId) as HTMLInputElement)
              if (input) {
                input.click()
              }
            }
          }}
          className={cn(
            'peer border-border bg-background h-5 w-5 shrink-0 rounded-md border-2 transition-all duration-200',
            'focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
            'disabled:cursor-not-allowed disabled:opacity-50',
            isChecked && 'bg-primary border-primary text-primary-foreground',
            className
          )}
        >
          {isChecked && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
        </button>

        {/* Hidden input for form integration */}
        <input
          ref={ref}
          type="checkbox"
          id={checkboxId}
          name={name}
          value={value}
          checked={isChecked}
          disabled={disabled}
          required={required}
          onChange={handleChange}
          onBlur={onBlur}
          className="sr-only"
        />

        {label && (
          <label
            htmlFor={checkboxId}
            className="cursor-pointer text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {label}
          </label>
        )}
      </div>
    )
  }
)

Checkbox.displayName = 'Checkbox'
