import { ArrowRight, CalendarCheck2, Star } from 'lucide-react'
import { cn } from '../../lib/cn'
import type { Match } from '../../types'
import { Avatar } from '../ui/Avatar'
import { Button } from '../ui/Button'

const availabilityStyles = {
  now: 'bg-emerald-50 text-emerald-700',
  week: 'bg-brand-50 text-brand-700',
  weekend: 'bg-[#fff8e8] text-[#946208]',
}

const availabilityLabels = {
  now: 'Available now',
  week: 'This week',
  weekend: 'Weekends',
}

export function MatchCard({
  match,
  highlighted,
  onView,
  onStart,
}: {
  match: Match
  highlighted: boolean
  onView: () => void
  onStart: () => void
}) {
  return (
    <article
      id={`match-${match.id}`}
      className={cn(
        'group flex h-full flex-col rounded-[1.5rem] border bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lift',
        highlighted
          ? 'border-brand-400 ring-4 ring-brand-100/80'
          : 'border-line hover:border-brand-200',
      )}
    >
      <div className="flex items-start gap-3">
        <Avatar
          initials={match.initials}
          name={match.name}
          tone={match.tone}
          size="lg"
          className="ring-2 ring-white shadow-md"
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h2 className="truncate text-[15px] font-extrabold tracking-[-0.02em] text-ink-900">
                {match.name}
              </h2>
              <p className="mt-0.5 line-clamp-2 text-[11px] leading-4 text-ink-600">
                {match.headline}
              </p>
            </div>
            <span
              className={cn(
                'flex shrink-0 flex-col items-center rounded-xl px-2 py-1.5 text-brand-700',
                highlighted ? 'bg-brand-600 text-white' : 'bg-brand-50',
              )}
            >
              <span className="text-sm font-extrabold leading-none">
                {match.compatibility}%
              </span>
              <span
                className={cn(
                  'mt-1 text-[7px] font-extrabold uppercase tracking-[0.12em]',
                  highlighted ? 'text-brand-100' : 'text-brand-500',
                )}
              >
                match
              </span>
            </span>
          </div>

          <div className="mt-1.5 flex items-center gap-1.5 text-[10px] font-semibold text-ink-500">
            <Star size={11} className="fill-sun-400 text-sun-400" />
            {match.rating}
            <span className="text-ink-300">·</span>
            {match.swaps} swaps
            <span className="text-ink-300">·</span>
            <span className={cn('rounded-full px-1.5 py-0.5', availabilityStyles[match.availability])}>
              {availabilityLabels[match.availability]}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <div className="rounded-xl border border-brand-100 bg-brand-50/70 p-2.5">
          <p className="text-[8px] font-extrabold uppercase tracking-[0.14em] text-brand-600">
            Teaches
          </p>
          <div className="mt-1.5 flex flex-wrap gap-1">
            {match.teaches.map((skill) => (
              <span
                key={skill}
                className="rounded-full bg-white/80 px-1.5 py-0.5 text-[9px] font-bold text-brand-800"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-[#f3e3bc] bg-[#fffaf0] p-2.5">
          <p className="text-[8px] font-extrabold uppercase tracking-[0.14em] text-[#a06e09]">
            Wants
          </p>
          <div className="mt-1.5 flex flex-wrap gap-1">
            {match.wants.map((skill) => (
              <span
                key={skill}
                className="rounded-full bg-white/80 px-1.5 py-0.5 text-[9px] font-bold text-[#7e5809]"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>

      <p className="mt-3 line-clamp-2 rounded-xl bg-canvas px-3 py-2 text-[10px] leading-4 text-ink-600">
        <span className="font-extrabold text-ink-800">Why you match: </span>
        {match.reason}
      </p>

      <div className="mt-4 flex items-center gap-2 border-t border-line pt-3.5">
        <Button variant="secondary" size="sm" className="flex-1" onClick={onView}>
          View profile
        </Button>
        <Button size="sm" className="flex-1" onClick={onStart}>
          Start swap <ArrowRight size={13} />
        </Button>
      </div>

      <span className="sr-only">
        <CalendarCheck2 /> Match available for a 25-minute swap
      </span>
    </article>
  )
}
