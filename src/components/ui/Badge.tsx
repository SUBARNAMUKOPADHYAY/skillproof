import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'

export type BadgeTone =
  | 'teal'
  | 'amber'
  | 'neutral'
  | 'rose'
  | 'blue'
  | 'success'
  | 'dark'

const toneClasses: Record<BadgeTone, string> = {
  teal: 'border-brand-100 bg-brand-50 text-brand-700',
  amber: 'border-[#f5e3ba] bg-[#fff8e8] text-[#946208]',
  neutral: 'border-line bg-canvas text-ink-600',
  rose: 'border-rose-100 bg-rose-50 text-rose-700',
  blue: 'border-sky-100 bg-sky-50 text-sky-700',
  success: 'border-emerald-100 bg-emerald-50 text-emerald-700',
  dark: 'border-white/10 bg-white/10 text-white',
}

export function Badge({
  children,
  tone = 'teal',
  className,
}: {
  children: ReactNode
  tone?: BadgeTone
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.08em]',
        toneClasses[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}
