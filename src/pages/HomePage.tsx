import {
  ArrowLeftRight,
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  CalendarDays,
  CheckCircle2,
  Clock3,
  ListChecks,
  Play,
  ShieldCheck,
  Sparkles,
  Star,
  Video,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { Avatar } from '../components/ui/Avatar'
import {
  howItWorksSteps,
  matchPreview,
} from '../data/mockData'
import { cn } from '../lib/cn'
import type { AvatarTone, MatchPerson } from '../types'

const stepIcons = {
  list: ListChecks,
  sparkles: Sparkles,
  video: Video,
  proof: BadgeCheck,
}

const communityAvatars: Array<{
  initials: string
  name: string
  tone: AvatarTone
}> = [
  { initials: 'JP', name: 'Jia Park', tone: 'rose' },
  { initials: 'MK', name: 'Milo Khan', tone: 'blue' },
  { initials: 'LC', name: 'Lena Costa', tone: 'teal' },
  { initials: 'DO', name: 'Dev Okafor', tone: 'amber' },
]

function MatchPersonTile({
  person,
  tone,
}: {
  person: MatchPerson
  tone: AvatarTone
}) {
  return (
    <div className="relative min-w-0 overflow-hidden rounded-[1.15rem] border border-white/10 bg-white/[0.055] p-3 text-center sm:p-4">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-white/[0.06] to-transparent"
        aria-hidden="true"
      />
      <div className="relative">
        <Avatar
          initials={person.initials}
          name={person.name}
          tone={tone}
          size="lg"
          className="mx-auto ring-2 ring-white/20 sm:h-16 sm:w-16 sm:text-xl"
        />
        <p className="mt-3 truncate text-xs font-extrabold tracking-[-0.01em] text-white sm:text-sm">
          {person.name}
        </p>
        <p className="mt-0.5 text-[9px] font-extrabold uppercase tracking-[0.16em] text-white/40">
          {person.role}
        </p>

        <div className="mt-2 flex items-center justify-center gap-1 text-[10px] font-semibold text-white/55">
          <Star size={10} className="fill-sun-400 text-sun-400" />
          {person.rating}
          <span className="text-white/25">·</span>
          {person.swaps} swaps
        </div>

        <div className="mt-3 rounded-xl border border-white/10 bg-white/[0.07] px-2.5 py-2 text-left">
          <p className="text-[9px] font-extrabold uppercase tracking-[0.14em] text-brand-200/70">
            Teaches
          </p>
          <p className="mt-0.5 truncate text-[11px] font-bold text-white sm:text-xs">
            {person.teaches}
          </p>
        </div>

        <p className="mt-2 truncate text-[10px] font-medium text-white/50">
          Wants to learn {person.wants}
        </p>
      </div>
    </div>
  )
}

export default function HomePage() {
  return (
    <>
      <section id="home" className="relative isolate overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
          <div className="absolute -left-40 -top-56 h-[38rem] w-[38rem] rounded-full bg-brand-200/35 blur-3xl" />
          <div className="absolute -right-48 top-20 h-[34rem] w-[34rem] rounded-full bg-[#d9f3ea]/80 blur-3xl" />
          <div className="dot-grid absolute inset-x-0 top-0 h-[72%] [mask-image:linear-gradient(to_bottom,black,transparent)]" />
        </div>

        <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 pb-16 pt-12 sm:px-8 sm:pb-20 sm:pt-16 xl:grid-cols-[1.15fr_0.85fr] xl:gap-8 xl:pb-24 xl:pt-20">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-200/80 bg-white/75 px-3.5 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.16em] text-brand-700 shadow-sm backdrop-blur-sm">
              <Sparkles size={13} className="text-brand-500" />
              Skill barter, reimagined
            </div>

            <h1 className="mt-6 max-w-[46rem] text-balance text-[2.6rem] font-extrabold leading-[1.02] tracking-[-0.055em] text-ink-900 sm:text-6xl xl:text-[3.7rem]">
              Trade what you know
              <br className="hidden sm:block" /> for{' '}
              <span className="text-brand-600">what you want to learn.</span>
            </h1>

            <p className="mt-6 max-w-xl text-[15px] leading-7 text-ink-600 sm:text-base">
              SkillProof pairs you with people who want to learn what you know
              — and can teach what you want to learn. One focused video swap at
              a time. No money, no subscriptions, just proof.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                to="/match"
                className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-brand-600 px-6 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-brand-600/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand-700 hover:shadow-xl hover:shadow-brand-700/20"
              >
                Start Swapping
                <ArrowRight
                  size={17}
                  strokeWidth={2.5}
                  className="transition-transform duration-200 group-hover:translate-x-0.5"
                />
              </Link>
              <a
                href="#how-it-works"
                className="group inline-flex items-center justify-center gap-2.5 rounded-2xl border border-brand-200 bg-white/85 px-6 py-3.5 text-sm font-extrabold text-ink-900 shadow-sm backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-300 hover:bg-white"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-50 text-brand-700 transition-colors group-hover:bg-brand-100">
                  <Play size={11} className="ml-0.5 fill-current" />
                </span>
                See how it works
              </a>
            </div>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-5">
              <div className="flex -space-x-2.5">
                {communityAvatars.map((person) => (
                  <Avatar
                    key={person.initials}
                    initials={person.initials}
                    name={person.name}
                    tone={person.tone}
                    size="sm"
                    className="ring-2 ring-canvas"
                  />
                ))}
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ink-900 text-[9px] font-extrabold text-white ring-2 ring-canvas">
                  +2.4k
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-ink-700">
                <Star size={14} className="fill-sun-400 text-sun-400" />
                4.9 average swap
                <span className="font-medium text-ink-400">from curious learners</span>
              </div>
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2.5 text-xs font-bold text-ink-600">
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 size={15} className="text-brand-500" />
                Free to swap
              </span>
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck size={15} className="text-brand-500" />
                Verified profiles
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Video size={15} className="text-brand-500" />
                1-on-1 video
              </span>
            </div>
          </div>

          <div id="match-preview" className="relative mx-auto w-full max-w-[500px] scroll-mt-28 xl:ml-auto">
            <div
              className="absolute -inset-5 -z-10 rounded-[3rem] bg-gradient-to-br from-brand-200/70 via-white/40 to-[#f7e6c7]/80 blur-2xl"
              aria-hidden="true"
            />
            <div
              className="absolute -right-8 -top-8 h-40 w-40 rounded-full border border-dashed border-brand-300/60"
              aria-hidden="true"
            />

            <div
              className="relative overflow-hidden rounded-[2rem] border border-white/80 bg-white p-2.5 shadow-[0_32px_90px_-32px_rgba(11,31,28,0.4)]"
              role="group"
              aria-label="Mock match preview between Aisha Sharma and Rohan Mehta"
            >
              <div className="relative overflow-hidden rounded-[1.6rem] bg-ink-900 p-4 sm:p-5">
                <div
                  className="pointer-events-none absolute -right-16 -top-20 h-52 w-52 rounded-full bg-brand-500/20 blur-3xl"
                  aria-hidden="true"
                />

                <div className="relative flex items-center justify-between gap-3">
                  <div className="inline-flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.16em] text-white/55">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                    </span>
                    Match preview
                  </div>
                  <div className="inline-flex items-center gap-1.5 rounded-full border border-brand-300/20 bg-brand-400/15 px-2.5 py-1.5 text-[10px] font-extrabold text-brand-100">
                    <Sparkles size={11} />
                    {matchPreview.compatibility}% match
                  </div>
                </div>

                <div className="relative mt-4 grid grid-cols-2 gap-3">
                  <MatchPersonTile person={matchPreview.aisha} tone="amber" />
                  <MatchPersonTile person={matchPreview.rohan} tone="teal" />

                  <div className="absolute left-1/2 top-[42%] z-10 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-[3px] border-ink-900 bg-brand-500 text-ink-900 shadow-lg shadow-brand-500/25">
                    <ArrowLeftRight size={17} strokeWidth={2.6} />
                  </div>
                </div>

                <div className="relative mt-3 rounded-2xl border border-white/10 bg-white/[0.05] p-3.5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[9px] font-extrabold uppercase tracking-[0.16em] text-white/40">
                        Why you match
                      </p>
                      <p className="mt-1 text-[11px] leading-5 text-white/80 sm:text-xs">
                        {matchPreview.reason}
                      </p>
                    </div>
                    <span className="shrink-0 text-lg font-extrabold tracking-[-0.04em] text-brand-200">
                      {matchPreview.compatibility}%
                    </span>
                  </div>
                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-brand-500 to-brand-300"
                      style={{ width: `${matchPreview.compatibility}%` }}
                    />
                  </div>
                </div>

                <div className="relative mt-3.5 flex items-center justify-between border-t border-white/10 pt-3 text-[10px] font-semibold text-white/45">
                  <span className="inline-flex items-center gap-1.5">
                    <Clock3 size={13} />
                    {matchPreview.durationMinutes}-minute swap
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarDays size={13} />
                    Flexible this week
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 px-2 py-3.5 sm:px-3">
                <div>
                  <p className="text-[9px] font-extrabold uppercase tracking-[0.14em] text-ink-400">
                    Next step
                  </p>
                  <p className="text-sm font-extrabold tracking-[-0.02em] text-ink-900">
                    Try a 25-minute swap
                  </p>
                </div>
                <a
                  href="#how-it-works"
                  className="group inline-flex items-center gap-1.5 rounded-xl bg-brand-50 px-3 py-2 text-[11px] font-extrabold text-brand-700 transition-colors hover:bg-brand-100"
                >
                  How it works
                  <ArrowUpRight
                    size={13}
                    strokeWidth={2.5}
                    className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      <section
        id="how-it-works"
        className="scroll-mt-20 border-y border-brand-100/80 bg-white"
      >
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:py-24">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-brand-600">
                How it works
              </p>
              <h2 className="mt-3 text-balance text-3xl font-extrabold tracking-[-0.045em] text-ink-900 sm:text-4xl">
                How a swap works
              </h2>
            </div>
            <p className="max-w-md text-sm leading-6 text-ink-600">
              Four small steps from “I’ve always wanted to try that” to “I can
              actually prove I did it.”
            </p>
          </div>

          <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {howItWorksSteps.map((step, index) => {
              const Icon = stepIcons[step.icon]
              const isProof = index === howItWorksSteps.length - 1

              return (
                <article
                  key={step.step}
                  className={cn(
                    'group relative overflow-hidden rounded-[1.75rem] border p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lift sm:p-6',
                    isProof
                      ? 'border-brand-200 bg-brand-50/70'
                      : 'border-brand-100 bg-white',
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div
                      className={cn(
                        'flex h-11 w-11 items-center justify-center rounded-2xl transition-colors',
                        isProof
                          ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/20'
                          : 'bg-brand-50 text-brand-600 group-hover:bg-brand-100',
                      )}
                    >
                      <Icon size={20} strokeWidth={2.2} />
                    </div>
                    <span
                      className={cn(
                        'text-4xl font-black tracking-[-0.06em]',
                        isProof ? 'text-brand-200/80' : 'text-brand-100',
                      )}
                    >
                      {step.step}
                    </span>
                  </div>

                  <p className="mt-6 text-[10px] font-extrabold uppercase tracking-[0.16em] text-brand-600">
                    {step.label}
                  </p>
                  <h3 className="mt-1.5 text-[17px] font-extrabold tracking-[-0.025em] text-ink-900">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-[13px] leading-6 text-ink-600">
                    {step.description}
                  </p>

                  <div className="mt-5 h-px w-full bg-gradient-to-r from-brand-100 to-transparent" />
                  <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.12em] text-ink-400">
                    Step {step.step}
                  </p>
                </article>
              )
            })}
          </div>

          <div className="mt-8 flex flex-col gap-4 rounded-[1.75rem] border border-brand-100 bg-canvas px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white text-brand-600 shadow-sm">
                <ShieldCheck size={20} />
              </span>
              <div>
                <p className="text-sm font-extrabold tracking-[-0.02em] text-ink-900">
                  No money. No subscriptions. Just skills.
                </p>
                <p className="mt-0.5 text-xs text-ink-600">
                  Every swap is a fair exchange of time and knowledge.
                </p>
              </div>
            </div>
            <a
              href="#match-preview"
              className="group inline-flex shrink-0 items-center gap-1.5 text-xs font-extrabold text-brand-700 transition-colors hover:text-brand-800"
            >
              Preview a match
              <ArrowRight
                size={14}
                strokeWidth={2.5}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
