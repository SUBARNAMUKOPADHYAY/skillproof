import { cn } from '../../lib/cn'

export type ProgressTone = 'brand' | 'amber' | 'rose' | 'blue' | 'success'

const fillClasses: Record<ProgressTone, string> = {
  brand: 'bg-brand-500',
  amber: 'bg-[#e8a51d]',
  rose: 'bg-rose-400',
  blue: 'bg-sky-500',
  success: 'bg-emerald-500',
}

export function ProgressBar({
  value,
  tone = 'brand',
  label,
  className,
}: {
  value: number
  tone?: ProgressTone
  label?: string
  className?: string
}) {
  const clamped = Math.max(0, Math.min(100, value))

  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={clamped}
      aria-label={label}
      className={cn('h-1.5 overflow-hidden rounded-full bg-brand-50', className)}
    >
      <div
        className={cn(
          'h-full rounded-full transition-[width] duration-500 ease-out',
          fillClasses[tone],
        )}
        style={{ width: `${clamped}%` }}
      />
    </div>
  )
}
