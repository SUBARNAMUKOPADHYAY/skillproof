import { CalendarDays, Clock3, ShieldCheck, Sparkles, Star, Video } from 'lucide-react'
import type { Match } from '../../types'
import { Avatar } from '../ui/Avatar'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { Modal } from '../ui/Modal'

export function MatchDetailModal({
  match,
  onClose,
  onStart,
}: {
  match: Match | null
  onClose: () => void
  onStart: (matchId: string) => void
}) {
  if (!match) return null

  return (
    <Modal
      open
      onClose={onClose}
      title={`Meet ${match.name.split(' ')[0]}`}
      description="A 25-minute, two-way skill swap. No money, no commitment."
      size="lg"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Keep browsing
          </Button>
          <Button onClick={() => onStart(match.id)}>
            Start 25-min swap <Video size={15} />
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <Avatar
          initials={match.initials}
          name={match.name}
          tone={match.tone}
          size="xl"
          className="ring-4 ring-brand-50"
        />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-xl font-extrabold tracking-[-0.03em] text-ink-900">
              {match.name}
            </h3>
            <Badge tone="teal">
              <Sparkles size={10} /> {match.compatibility}% match
            </Badge>
          </div>
          <p className="mt-1 text-sm text-ink-600">{match.headline}</p>
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-semibold text-ink-500">
            <span className="inline-flex items-center gap-1">
              <Star size={12} className="fill-sun-400 text-sun-400" /> {match.rating} rating
            </span>
            <span>{match.swaps} completed swaps</span>
            <span className="inline-flex items-center gap-1 text-emerald-600">
              <ShieldCheck size={12} /> Verified demo profile
            </span>
          </div>
        </div>
      </div>

      <p className="mt-5 text-[13px] leading-6 text-ink-600">{match.bio}</p>

      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        <div className="rounded-2xl border border-brand-100 bg-brand-50/70 p-4">
          <p className="text-[9px] font-extrabold uppercase tracking-[0.14em] text-brand-600">
            Can teach you
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {match.teaches.map((skill) => (
              <Badge key={skill} tone="teal" className="bg-white">
                {skill}
              </Badge>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-[#f3e3bc] bg-[#fffaf0] p-4">
          <p className="text-[9px] font-extrabold uppercase tracking-[0.14em] text-[#a06e09]">
            Wants to learn
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {match.wants.map((skill) => (
              <Badge key={skill} tone="amber" className="bg-white">
                {skill}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-2xl bg-ink-900 p-4 text-white">
        <div className="flex items-center gap-2 text-[9px] font-extrabold uppercase tracking-[0.16em] text-brand-300">
          <Sparkles size={12} /> Why this match works
        </div>
        <p className="mt-1.5 text-xs leading-5 text-white/75">{match.reason}</p>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-brand-500 to-brand-300"
            style={{ width: `${match.compatibility}%` }}
          />
        </div>
      </div>

      <div className="mt-4">
        <p className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.1em] text-ink-600">
          <CalendarDays size={14} className="text-brand-600" /> Suggested demo slots
        </p>
        <div className="mt-2 grid gap-2 sm:grid-cols-3">
          {match.slots.map((slot) => (
            <button
              key={slot}
              type="button"
              className="rounded-xl border border-line bg-white px-3 py-2.5 text-left text-[11px] font-bold text-ink-700 transition-colors hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700"
            >
              {slot}
            </button>
          ))}
        </div>
        <p className="mt-2 text-[10px] text-ink-400">
          Scheduling is mocked in this prototype. Starting a swap opens the pre-call lobby.
        </p>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 rounded-2xl border border-line bg-canvas px-4 py-3 text-[11px] font-semibold text-ink-500">
        <span className="inline-flex items-center gap-1.5">
          <Clock3 size={13} className="text-brand-600" /> 25 minutes
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Video size={13} className="text-brand-600" /> Simulated video call
        </span>
        <span className="inline-flex items-center gap-1.5">
          <ShieldCheck size={13} className="text-brand-600" /> Demo credits only
        </span>
      </div>
    </Modal>
  )
}
