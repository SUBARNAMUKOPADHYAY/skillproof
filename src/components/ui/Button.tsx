import type { ButtonHTMLAttributes } from 'react'
import { cn } from '../../lib/cn'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'dark'
export type ButtonSize = 'sm' | 'md' | 'lg'

const baseClasses =
  'inline-flex items-center justify-center gap-2 rounded-xl font-extrabold transition-all duration-200 disabled:pointer-events-none disabled:opacity-50'

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-brand-600 text-white shadow-lg shadow-brand-600/15 hover:bg-brand-700 hover:shadow-brand-700/20',
  secondary:
    'border border-brand-200 bg-white text-ink-900 shadow-sm hover:border-brand-300 hover:bg-brand-50',
  ghost: 'text-ink-600 hover:bg-brand-50 hover:text-brand-700',
  danger:
    'bg-[#d9534f] text-white shadow-lg shadow-red-900/15 hover:bg-[#c44743]',
  dark: 'bg-ink-900 text-white shadow-lg shadow-ink-900/15 hover:bg-ink-700',
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-9 px-3.5 text-xs',
  md: 'h-11 px-5 text-sm',
  lg: 'h-12 px-6 text-[15px]',
}

export function buttonClasses(
  variant: ButtonVariant = 'primary',
  size: ButtonSize = 'md',
  className?: string,
) {
  return cn(baseClasses, variantClasses[variant], sizeClasses[size], className)
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  size?: ButtonSize
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={buttonClasses(variant, size, className)}
      {...props}
    />
  )
}
