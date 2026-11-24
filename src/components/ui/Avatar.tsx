import { cn } from '../../lib/cn'
import type { AvatarTone } from '../../types'

type AvatarProps = {
  initials: string
  name?: string
  tone?: AvatarTone
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const toneClasses: Record<AvatarTone, string> = {
  teal: 'from-[#74ddce] to-[#007a6d]',
  amber: 'from-[#ffd18a] to-[#d97757]',
  rose: 'from-[#ffc1c8] to-[#c95f78]',
  blue: 'from-[#b9d7ff] to-[#4c79ad]',
  slate: 'from-[#d9e2df] to-[#71847f]',
}

const sizeClasses = {
  sm: 'h-8 w-8 text-[10px]',
  md: 'h-10 w-10 text-xs',
  lg: 'h-14 w-14 text-base',
  xl: 'h-16 w-16 text-xl',
}

export function Avatar({
  initials,
  name,
  tone = 'teal',
  size = 'md',
  className,
}: AvatarProps) {
  return (
    <span
      role="img"
      aria-label={name ? `${name}'s avatar` : initials}
      title={name}
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br font-extrabold tracking-[-0.03em] text-white shadow-sm',
        toneClasses[tone],
        sizeClasses[size],
        className,
      )}
    >
      {initials}
    </span>
  )
}
