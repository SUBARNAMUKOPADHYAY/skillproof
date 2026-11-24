import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'

type RingTone = 'brand' | 'amber' | 'rose' | 'blue'

const strokeClasses: Record<RingTone, string> = {
  brand: 'stroke-brand-500',
  amber: 'stroke-[#e8a51d]',
  rose: 'stroke-rose-400',
  blue: 'stroke-sky-500',
}

export function ProgressRing({
  value,
  size = 72,
  strokeWidth = 6,
  tone = 'brand',
  className,
  children,
}: {
  value: number
  size?: number
  strokeWidth?: number
  tone?: RingTone
  className?: string
  children?: ReactNode
}) {
  const clamped = Math.max(0, Math.min(100, value))
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (clamped / 100) * circumference

  return (
    <span
      className={cn('relative inline-flex shrink-0 items-center justify-center', className)}
      role="img"
      aria-label={`${clamped}% complete`}
    >
      <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          className="stroke-brand-100/80"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={cn('transition-[stroke-dashoffset] duration-500 ease-out', strokeClasses[tone])}
        />
      </svg>
      {children && (
        <span className="absolute inset-0 flex items-center justify-center">
          {children}
        </span>
      )}
    </span>
  )
}
