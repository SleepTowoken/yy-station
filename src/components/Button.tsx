import type { ButtonHTMLAttributes, ReactNode } from 'react'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost'
  full?: boolean
  children: ReactNode
}

export function Button({ variant = 'primary', full = false, className = '', children, ...props }: ButtonProps) {
  return (
    <button className={`station-button ${variant} ${full ? 'full' : ''} ${className}`} type="button" {...props}>
      {children}
    </button>
  )
}
