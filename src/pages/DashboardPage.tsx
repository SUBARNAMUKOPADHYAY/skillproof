import {
  ArrowLeftRight,
  ArrowRight,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Coins,
  Flame,
  Sparkles,
  Star,
  TrendingUp,
  Video,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { Avatar } from '../components/ui/Avatar'
import { Badge } from '../components/ui/Badge'
import { buttonClasses } from '../components/ui/Button'
import { ProgressBar } from '../components/ui/ProgressBar'
import { ProgressRing } from '../components/ui/ProgressRing'
import { useDemo } from '../context/DemoStateContext'
import { useToast } from '../context/ToastContext'
import {
  currentUser,
  dashboardBaseline,
  recentActivity,
  skillProgress,
  upcomingSwap,
  weeklyActivity,
} from '../data/mockData'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { cn } from '../lib/cn'
import type { ActivityIcon, ActivityItem } from '../types'

const NOW = new Date()
const TODAY_LABEL = new Intl.DateTimeFormat('en-US', {
  weekday: 'long',
  month: 'short',
  day: 'numeric',
}).format(NOW)

function getGreeting(hour: number) {
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}

const GREETING = getGreeting(NOW.getHours())

const activityIconStyles: Record<ActivityIcon, string> = {
  swap: 'bg-brand-50 text-brand-600',
  lesson: 'bg-sky-50 text-sky-600',
  match: 'bg-[#fff8e8] text-[#a06e09]',
  streak: 'bg-orange-50 text-orange-500',
}

const activityIcons = {
  swap: ArrowLeftRight,
  lesson: BookOpen,
  match: Sparkles,
  streak: Flame,
}

export default function DashboardPage() {
  useDocumentTitle('Dashboard')

  const { credits, sessions, resetDemo } = useDemo()
  const { pushToast } = useToast()

  const completedSwaps = dashboardBaseline.completedSwaps + sessions.length
  const learningHours = (
    dashboardBaseline.learningHours +
    sessions.reduce((total, session) => total + session.durationMinutes, 0) / 60
  ).toFixed(1)

  const stats = [
    {
      label: 'Completed swaps',
      value: String(completedSwaps),
      note: '12 seeded + new sessions',
      icon: ArrowLeftRight,
      iconClass: 'bg-brand-50 text-brand-600',
    },
    {
      label: 'Learning hours',
      value: learningHours,
      note: 'Across swaps and lessons',
      icon: Clock3,
      iconClass: 'bg-sky-50 text-sky-600',
    },
    {
      label: 'Credits',
      value: String(credits),
      note: 'Mock balance · local only',
      icon: Coins,
      iconClass: 'bg-[#fff8e8] text-[#a06e09]',
    },
    {
      label: 'Day streak',
      value: String(dashboardBaseline.streak),
      note: 'Best streak: 9 days',
      icon: Flame,
      iconClass: 'bg-orange-50 text-orange-500',
    },
  ]

  const sessionActivity: ActivityItem[] = sessions.map((session) => ({
    id: `session-${session.roomId}`,
    icon: 'swap',
    title: `Completed a swap with ${session.partnerName}`,
    detail: `${session.topic} · ${session.durationMinutes} min · +${session.creditsEarned} credits`,
    time: 'Just now',
  }))

  const activityFeed = [...sessionActivity, ...recentActivity]

  const maxMinutes = Math.max(...weeklyActivity.map((day) => day.minutes))

  const handleReminder = () => {
    pushToast(
      `Reminder mocked for ${upcomingSwap.when.toLowerCase()} — this prototype does not send notifications.`,
      'info',
    )
  }

  return (
    <section className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Badge tone="teal">
            <TrendingUp size={12} /> Dashboard
          </Badge>
          <h1 className="mt-3 text-3xl font-extrabold tracking-[-0.045em] text-ink-900 sm:text-4xl">
            {GREETING}, {currentUser.firstName}.
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-ink-600">
            Here is what is moving this week. {TODAY_LABEL} · demo data only.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.08em] text-ink-600">
            <Flame size={12} className="text-orange-500" />
            {dashboardBaseline.streak}-day streak
          </span>
          <Link to="/match" className={buttonClasses('secondary', 'sm')}>
            Find a swap <ArrowRight size={13} />
          </Link>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 xl:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-[1.4rem] border border-line bg-white p-4 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <span
                className={cn(
                  'flex h-9 w-9 items-center justify-center rounded-xl',
                  stat.iconClass,
                )}
              >
                <stat.icon size={16} />
              </span>
              <span className="text-[9px] font-extrabold uppercase tracking-[0.12em] text-ink-300">
                Demo
              </span>
            </div>
            <p className="mt-3 text-2xl font-extrabold tracking-[-0.04em] text-ink-900 sm:text-3xl">
              {stat.value}
            </p>
            <p className="mt-0.5 text-[11px] font-extrabold text-ink-800">
              {stat.label}
            </p>
            <p className="mt-1 text-[9px] leading-4 text-ink-400">{stat.note}</p>
          </div>
        ))}
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1.55fr)_minmax(19rem,1fr)] lg:items-start">
        <div className="space-y-5">
          <div className="relative overflow-hidden rounded-[1.5rem] bg-ink-900 p-5 text-white sm:p-6">
            <div
              className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-brand-500/25 blur-3xl"
              aria-hidden="true"
            />
            <div
              className="pointer-events-none absolute -bottom-24 left-1/3 h-48 w-48 rounded-full bg-[#f4b740]/10 blur-3xl"
              aria-hidden="true"
            />

            <div className="relative flex flex-wrap items-center justify-between gap-3">
              <p className="flex items-center gap-2 text-[9px] font-extrabold uppercase tracking-[0.16em] text-brand-300">
                <Video size={12} /> Upcoming swap
              </p>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300/20 bg-emerald-400/10 px-2.5 py-1 text-[9px] font-extrabold text-emerald-200">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
                Confirmed · demo
              </span>
            </div>

            <div className="relative mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3.5">
                <Avatar
                  initials={upcomingSwap.partnerInitials}
                  name={upcomingSwap.partnerName}
                  tone={upcomingSwap.partnerTone}
                  size="lg"
                  className="ring-2 ring-white/20"
                />
                <div>
                  <p className="text-base font-extrabold tracking-[-0.02em]">
                    {upcomingSwap.partnerName}
                  </p>
                  <p className="text-[11px] text-white/50">{upcomingSwap.topic}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] font-semibold text-white/60">
                    <span className="inline-flex items-center gap-1">
                      <CalendarDays size={11} /> {upcomingSwap.when}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Clock3 size={11} /> {upcomingSwap.durationMinutes} min
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <button
                  type="button"
                  onClick={handleReminder}
                  className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl border border-white/15 bg-white/[0.04] px-3.5 text-[11px] font-bold text-white/70 transition-colors hover:bg-white/[0.08] hover:text-white"
                >
                  Remind me
                </button>
                <Link
                  to={`/swap/${upcomingSwap.roomId}?partner=${upcomingSwap.matchId}`}
                  className={buttonClasses('secondary', 'md')}
                >
                  Open lobby <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            <div className="relative mt-4 flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5 text-[10px] text-white/45">
              <Sparkles size={12} className="shrink-0 text-brand-300" />
              Suggested agenda: 3 min intros · 10 min UI Design · 10 min Spanish · 2 min wrap-up
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-line bg-white p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-[9px] font-extrabold uppercase tracking-[0.16em] text-brand-600">
                  Skill proof
                </p>
                <h2 className="mt-1 text-lg font-extrabold tracking-[-0.03em] text-ink-900">
                  Progress you can point to
                </h2>
              </div>
              <Link
                to="/learn"
                className="inline-flex items-center gap-1 text-[11px] font-extrabold text-brand-700 hover:text-brand-800"
              >
                Learning modules <ArrowRight size={12} />
              </Link>
            </div>

            <div className="mt-4 grid gap-2.5 sm:grid-cols-3">
              {skillProgress.map((skill, index) => (
                <div
                  key={skill.name}
                  className="rounded-2xl border border-line bg-canvas/60 p-3.5"
                >
                  <div className="flex items-center gap-3">
                    <ProgressRing
                      value={skill.level}
                      size={52}
                      strokeWidth={5}
                      tone={index === 0 ? 'brand' : index === 1 ? 'amber' : 'blue'}
                    >
                      <span className="text-[10px] font-extrabold text-ink-900">
                        {skill.level}
                      </span>
                    </ProgressRing>
                    <div className="min-w-0">
                      <p className="truncate text-[11px] font-extrabold text-ink-900">
                        {skill.name}
                      </p>
                      <p className="text-[9px] font-semibold text-ink-400">
                        {skill.role}
                      </p>
                    </div>
                  </div>
                  <p className="mt-2 truncate text-[9px] text-ink-500">{skill.note}</p>
                  <ProgressBar
                    value={skill.level}
                    tone={index === 0 ? 'brand' : index === 1 ? 'amber' : 'blue'}
                    label={`${skill.name} progress`}
                    className="mt-2 bg-white"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-line bg-white p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[9px] font-extrabold uppercase tracking-[0.16em] text-brand-600">
                  This week
                </p>
                <h2 className="mt-1 text-lg font-extrabold tracking-[-0.03em] text-ink-900">
                  Learning rhythm
                </h2>
              </div>
              <span className="rounded-full bg-brand-50 px-2.5 py-1 text-[10px] font-extrabold text-brand-700">
                9h 30m total
              </span>
            </div>

            <div className="mt-5 flex h-32 items-end gap-2 sm:gap-3">
              {weeklyActivity.map((day) => (
                <div key={day.day} className="group flex h-full flex-1 flex-col justify-end">
                  <div className="relative flex flex-1 items-end">
                    <div
                      title={`${day.day}: ${day.minutes} minutes`}
                      className="w-full rounded-t-lg bg-gradient-to-t from-brand-500 to-brand-300 transition-all duration-300 group-hover:from-brand-600 group-hover:to-brand-400"
                      style={{
                        height: `${Math.max(8, (day.minutes / maxMinutes) * 100)}%`,
                      }}
                    />
                  </div>
                  <span className="mt-2 text-center text-[9px] font-bold text-ink-400">
                    {day.day}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-line pt-3 text-[10px] text-ink-400">
              <span>Minutes of focus per day</span>
              <span className="font-bold text-emerald-600">+18% vs last week</span>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-[1.5rem] border border-line bg-white p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-extrabold tracking-[-0.02em] text-ink-900">
                Recent activity
              </h2>
              <span className="rounded-full bg-canvas px-2 py-1 text-[9px] font-extrabold uppercase tracking-[0.1em] text-ink-400">
                Demo feed
              </span>
            </div>

            <div className="mt-4 space-y-0.5">
              {activityFeed.slice(0, 6).map((item) => {
                const Icon = activityIcons[item.icon]
                return (
                  <div
                    key={item.id}
                    className="relative flex gap-3 rounded-xl px-1.5 py-2.5 transition-colors hover:bg-canvas/60"
                  >
                    <span
                      className={cn(
                        'flex h-8 w-8 shrink-0 items-center justify-center rounded-xl',
                        activityIconStyles[item.icon],
                      )}
                    >
                      <Icon size={14} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-bold leading-4 text-ink-900">
                        {item.title}
                      </p>
                      <p className="mt-0.5 text-[9px] leading-4 text-ink-500">
                        {item.detail}
                      </p>
                    </div>
                    <span className="shrink-0 text-[8px] font-semibold text-ink-300">
                      {item.time}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[1.5rem] border border-brand-100 bg-brand-50/70 p-5">
            <div
              className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-brand-200/50 blur-2xl"
              aria-hidden="true"
            />
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white shadow-lg shadow-brand-600/20">
              <Sparkles size={16} />
            </span>
            <h2 className="relative mt-3 text-sm font-extrabold text-ink-900">
              Not sure what to swap next?
            </h2>
            <p className="relative mt-1 text-[10px] leading-4 text-ink-600">
              Ask the scripted guide for a match suggestion or a simple session
              plan.
            </p>
            <Link
              to="/guide"
              className={buttonClasses('secondary', 'sm', 'relative mt-3 w-full')}
            >
              Ask the AI Guide <ArrowRight size={12} />
            </Link>
          </div>

          <div className="rounded-[1.5rem] border border-line bg-white p-5">
            <div className="flex items-center gap-2.5">
              <Avatar
                initials={currentUser.initials}
                name={currentUser.name}
                tone="amber"
                size="md"
              />
              <div>
                <p className="text-xs font-extrabold text-ink-900">
                  {currentUser.name}
                </p>
                <p className="text-[10px] text-ink-500">{currentUser.headline}</p>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              <Badge tone="teal">Teaches {currentUser.teaches}</Badge>
              <Badge tone="amber">Learning {currentUser.wants}</Badge>
            </div>
            <div className="mt-4 flex items-center justify-between rounded-xl bg-canvas px-3 py-2.5">
              <span className="text-[10px] font-semibold text-ink-500">
                Demo progress stored locally
              </span>
              <button
                type="button"
                onClick={() => {
                  resetDemo()
                  pushToast('Demo data reset to the starting seed.', 'info')
                }}
                className="text-[10px] font-extrabold text-brand-700 transition-colors hover:text-brand-800"
              >
                Reset
              </button>
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-line bg-white p-5">
            <p className="text-[9px] font-extrabold uppercase tracking-[0.16em] text-brand-600">
              Proof snapshot
            </p>
            <div className="mt-3 space-y-2.5">
              {[
                { label: 'Swaps with 5-star ratings', value: '92%', icon: Star },
                { label: 'Sessions this month', value: '6', icon: CheckCircle2 },
                { label: 'Avg. partner rating', value: '4.9', icon: TrendingUp },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2.5">
                  <item.icon size={13} className="text-brand-500" />
                  <span className="flex-1 text-[10px] text-ink-500">{item.label}</span>
                  <span className="text-[11px] font-extrabold text-ink-900">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
