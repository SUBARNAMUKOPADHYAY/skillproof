import {
  ChevronDown,
  Loader2,
  Search,
  SearchX,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Star,
  Users,
  X,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MatchCard } from '../components/match/MatchCard'
import { MatchDetailModal } from '../components/match/MatchDetailModal'
import { Avatar } from '../components/ui/Avatar'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { useToast } from '../context/ToastContext'
import {
  currentUser,
  demoRoom,
  matchCategories,
  matches,
} from '../data/mockData'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { cn } from '../lib/cn'
import type { Match, MatchAvailability, MatchCategory } from '../types'

type AvailabilityFilter = 'any' | MatchAvailability

const availabilityLabels: Record<AvailabilityFilter, string> = {
  any: 'Any availability',
  now: 'Available now',
  week: 'This week',
  weekend: 'Weekends',
}

export default function MatchHubPage() {
  useDocumentTitle('Match Hub')

  const navigate = useNavigate()
  const { pushToast } = useToast()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<'All' | MatchCategory>('All')
  const [availability, setAvailability] = useState<AvailabilityFilter>('any')
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null)
  const [smartMatching, setSmartMatching] = useState(false)
  const [smartPickId, setSmartPickId] = useState<string | null>(null)

  const filteredMatches = useMemo(() => {
    const normalized = query.trim().toLowerCase()

    return matches.filter((match) => {
      const matchesQuery =
        !normalized ||
        [
          match.name,
          match.headline,
          match.category,
          ...match.teaches,
          ...match.wants,
        ]
          .join(' ')
          .toLowerCase()
          .includes(normalized)

      const matchesCategory = category === 'All' || match.category === category
      const matchesAvailability =
        availability === 'any' || match.availability === availability

      return matchesQuery && matchesCategory && matchesAvailability
    })
  }, [query, category, availability])

  const smartPick = matches.find((match) => match.id === smartPickId) ?? null
  const activeFilters =
    (query.trim() ? 1 : 0) +
    (category !== 'All' ? 1 : 0) +
    (availability !== 'any' ? 1 : 0)
  const averageRating = (
    matches.reduce((total, match) => total + match.rating, 0) / matches.length
  ).toFixed(1)

  useEffect(() => {
    if (!smartMatching) return

    const timer = window.setTimeout(() => {
      const best = [...matches].sort((a, b) => b.compatibility - a.compatibility)[0]
      setSmartPickId(best.id)
      setSmartMatching(false)
      pushToast(
        `${best.name} is your top match at ${best.compatibility}% compatibility.`,
      )
    }, 1600)

    return () => window.clearTimeout(timer)
  }, [smartMatching, pushToast])

  const clearFilters = () => {
    setQuery('')
    setCategory('All')
    setAvailability('any')
  }

  const handleSmartMatch = () => {
    clearFilters()
    setSmartPickId(null)
    setSmartMatching(true)
  }

  const startSwap = (matchId: string) => {
    const match = matches.find((candidate) => candidate.id === matchId)
    if (match) {
      pushToast(`Opening a demo swap with ${match.name}.`, 'info')
    }
    navigate(`/swap/${demoRoom.code}?partner=${matchId}`)
  }

  return (
    <>
      <section className="relative isolate overflow-hidden border-b border-brand-100/80 bg-white">
        <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
          <div className="absolute -left-40 -top-40 h-[30rem] w-[30rem] rounded-full bg-brand-100/60 blur-3xl" />
          <div className="absolute -right-40 top-0 h-[26rem] w-[26rem] rounded-full bg-[#f8ecd3]/70 blur-3xl" />
          <div className="dot-grid absolute inset-x-0 top-0 h-56 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
        </div>

        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-10 sm:px-8 lg:grid-cols-[1fr_18rem] lg:items-end lg:py-12">
          <div>
            <Badge tone="teal" className="bg-white/80 py-1.5">
              <Users size={12} /> Match Hub
            </Badge>
            <h1 className="mt-4 max-w-2xl text-balance text-3xl font-extrabold leading-[1.06] tracking-[-0.05em] text-ink-900 sm:text-4xl lg:text-[2.8rem]">
              Your next skill is one swap away.
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-ink-600">
              Browse people whose skills complement yours, filter by the time you
              have, or let the demo smart match pick a strong fit.
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.08em] text-ink-600">
                <Users size={12} className="text-brand-600" />
                {matches.length} demo profiles
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.08em] text-ink-600">
                <Star size={12} className="fill-sun-400 text-sun-400" />
                {averageRating} average rating
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.08em] text-ink-600">
                <ShieldCheck size={12} className="text-brand-600" />
                Mock data, real filters
              </span>
            </div>
          </div>

          <aside className="relative hidden overflow-hidden rounded-[1.5rem] bg-ink-900 p-5 text-white shadow-xl shadow-ink-900/15 lg:block">
            <div
              className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-brand-500/25 blur-2xl"
              aria-hidden="true"
            />
            <p className="relative text-[9px] font-extrabold uppercase tracking-[0.16em] text-brand-300">
              Your swap profile
            </p>
            <div className="relative mt-3 flex items-center gap-3">
              <Avatar
                initials={currentUser.initials}
                name={currentUser.name}
                tone="amber"
                size="lg"
                className="ring-2 ring-white/15"
              />
              <div className="min-w-0">
                <p className="truncate text-sm font-extrabold">{currentUser.name}</p>
                <p className="text-[10px] text-white/50">{currentUser.headline}</p>
              </div>
            </div>
            <div className="relative mt-4 grid grid-cols-2 gap-2">
              <div className="rounded-xl border border-white/10 bg-white/[0.06] p-2.5">
                <p className="text-[8px] font-extrabold uppercase tracking-[0.12em] text-white/40">
                  Teaches
                </p>
                <p className="mt-1 text-[11px] font-bold text-brand-200">
                  {currentUser.teaches}
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/[0.06] p-2.5">
                <p className="text-[8px] font-extrabold uppercase tracking-[0.12em] text-white/40">
                  Wants
                </p>
                <p className="mt-1 text-[11px] font-bold text-[#ffd89a]">
                  {currentUser.wants}
                </p>
              </div>
            </div>
            <p className="relative mt-3 text-[10px] leading-4 text-white/45">
              Compatibility scores and availability are hardcoded for this
              college prototype.
            </p>
          </aside>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-10">
        <div className="rounded-[1.5rem] border border-line bg-white p-3 shadow-sm sm:p-3.5">
          <div className="flex flex-col gap-2.5 lg:flex-row lg:items-center">
            <div className="relative min-w-0 flex-1">
              <label htmlFor="match-search" className="sr-only">
                Search matches by name or skill
              </label>
              <Search
                size={17}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400"
              />
              <input
                id="match-search"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search name, skill, or category..."
                className="h-11 w-full rounded-xl border border-line bg-canvas pl-10 pr-10 text-sm font-semibold text-ink-900 placeholder:font-medium placeholder:text-ink-400 focus:border-brand-300 focus:bg-white"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  aria-label="Clear search"
                  className="absolute right-2.5 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg text-ink-400 hover:bg-white hover:text-ink-700"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            <div className="relative sm:w-48">
              <label htmlFor="match-availability" className="sr-only">
                Filter by availability
              </label>
              <SlidersHorizontal
                size={15}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400"
              />
              <select
                id="match-availability"
                value={availability}
                onChange={(event) =>
                  setAvailability(event.target.value as AvailabilityFilter)
                }
                className="h-11 w-full appearance-none rounded-xl border border-line bg-canvas pl-10 pr-9 text-xs font-bold text-ink-700 focus:border-brand-300 focus:bg-white"
              >
                {Object.entries(availabilityLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={15}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink-400"
              />
            </div>

            <Button
              variant="dark"
              onClick={handleSmartMatch}
              disabled={smartMatching}
              className="shrink-0"
            >
              {smartMatching ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Sparkles size={16} className="text-brand-300" />
              )}
              Smart match
            </Button>
          </div>

          <div className="mt-3 flex items-center gap-2 overflow-x-auto border-t border-line/70 pt-3 no-scrollbar">
            {matchCategories.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setCategory(item)}
                aria-pressed={category === item}
                className={cn(
                  'shrink-0 rounded-full px-3 py-1.5 text-[11px] font-bold transition-colors',
                  category === item
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'bg-canvas text-ink-600 hover:bg-brand-50 hover:text-brand-700',
                )}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-brand-600">
              Curated for you
            </p>
            <h2 className="mt-1 text-xl font-extrabold tracking-[-0.03em] text-ink-900">
              {filteredMatches.length}{' '}
              {filteredMatches.length === 1 ? 'match' : 'matches'}
              {category !== 'All' && (
                <span className="text-ink-400"> in {category}</span>
              )}
            </h2>
          </div>
          {activeFilters > 0 && (
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3 py-1.5 text-[11px] font-bold text-ink-600 transition-colors hover:border-brand-200 hover:text-brand-700"
            >
              <X size={12} /> Clear {activeFilters}{' '}
              {activeFilters === 1 ? 'filter' : 'filters'}
            </button>
          )}
        </div>

        {smartPick && !smartMatching && (
          <div className="mt-4 flex flex-col gap-3 rounded-2xl border border-brand-200 bg-brand-50/70 p-3.5 sm:flex-row sm:items-center">
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <Avatar
                initials={smartPick.initials}
                name={smartPick.name}
                tone={smartPick.tone}
                size="md"
              />
              <div className="min-w-0">
                <p className="text-[9px] font-extrabold uppercase tracking-[0.14em] text-brand-600">
                  Smart pick · {smartPick.compatibility}% compatible
                </p>
                <p className="truncate text-xs font-bold text-ink-900">
                  {smartPick.name} teaches {smartPick.teaches[0]} and wants to learn{' '}
                  {smartPick.wants[0]}.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="secondary" onClick={() => setSmartPickId(null)}>
                Dismiss
              </Button>
              <Button size="sm" onClick={() => setSelectedMatch(smartPick)}>
                View match
              </Button>
            </div>
          </div>
        )}

        {filteredMatches.length > 0 ? (
          <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filteredMatches.map((match) => (
              <MatchCard
                key={match.id}
                match={match}
                highlighted={smartPickId === match.id}
                onView={() => setSelectedMatch(match)}
                onStart={() => startSwap(match.id)}
              />
            ))}
          </div>
        ) : (
          <div className="mt-4 flex flex-col items-center justify-center rounded-[1.75rem] border border-dashed border-brand-200 bg-white px-6 py-16 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
              <SearchX size={24} />
            </span>
            <h2 className="mt-4 text-lg font-extrabold tracking-[-0.02em] text-ink-900">
              No matches in this corner yet
            </h2>
            <p className="mt-1.5 max-w-sm text-xs leading-5 text-ink-600">
              Try a broader skill, a different category, or clear your availability
              filter. The demo catalog is small and intentionally curated.
            </p>
            <Button className="mt-5" onClick={clearFilters}>
              Clear filters
            </Button>
          </div>
        )}

        <p className="mt-8 flex items-center justify-center gap-1.5 text-center text-[10px] font-semibold text-ink-400">
          <Sparkles size={11} className="text-brand-500" />
          Compatibility, ratings, and schedules are dummy data for this prototype.
        </p>
      </section>

      <MatchDetailModal
        match={selectedMatch}
        onClose={() => setSelectedMatch(null)}
        onStart={(matchId) => {
          setSelectedMatch(null)
          startSwap(matchId)
        }}
      />

      {smartMatching && (
        <div
          role="status"
          aria-live="polite"
          className="fixed inset-0 z-[90] flex items-center justify-center bg-ink-900/50 p-5 backdrop-blur-sm"
        >
          <div className="relative w-full max-w-sm overflow-hidden rounded-[2rem] border border-white/10 bg-ink-900 p-8 text-center text-white shadow-2xl">
            <div
              className="pointer-events-none absolute -left-20 -top-20 h-56 w-56 rounded-full bg-brand-500/25 blur-3xl"
              aria-hidden="true"
            />
            <div className="relative mx-auto flex h-20 w-20 items-center justify-center">
              <span className="absolute inset-0 animate-ping rounded-full bg-brand-500/20" />
              <span className="absolute inset-3 rounded-full border border-brand-400/30" />
              <span className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-500 text-ink-900 shadow-lg shadow-brand-500/30">
                <Sparkles size={24} />
              </span>
            </div>
            <h2 className="relative mt-6 text-xl font-extrabold tracking-[-0.03em]">
              Finding your best swap
            </h2>
            <p className="relative mt-2 text-xs leading-5 text-white/50">
              Scanning {matches.length} demo profiles for a two-way skill match...
            </p>
            <div className="relative mt-5 flex items-center justify-center gap-1.5">
              {[0, 1, 2].map((dot) => (
                <span
                  key={dot}
                  className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand-400"
                  style={{ animationDelay: `${dot * 160}ms` }}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
