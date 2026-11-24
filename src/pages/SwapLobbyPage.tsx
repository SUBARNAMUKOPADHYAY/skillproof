import {
  ArrowRight,
  CalendarDays,
  Camera,
  CheckCircle2,
  Clock3,
  Copy,
  History,
  KeyRound,
  Mic,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
  Video,
} from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Avatar } from '../components/ui/Avatar'
import { Badge } from '../components/ui/Badge'
import { Button, buttonClasses } from '../components/ui/Button'
import { useToast } from '../context/ToastContext'
import {
  demoRoom,
  matches,
  pastSessions,
  sessionAgenda,
  upcomingSwap,
} from '../data/mockData'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { cn } from '../lib/cn'

const quickMatches = matches.slice(1, 4)

export default function SwapLobbyPage() {
  useDocumentTitle('Swap Sessions')

  const navigate = useNavigate()
  const { pushToast } = useToast()
  const [code, setCode] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [copying, setCopying] = useState(false)

  const openRoom = (roomCode: string, partnerId = 'rohan-mehta') => {
    navigate(`/swap/${roomCode.toUpperCase()}?partner=${partnerId}`)
  }

  const handleJoin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const cleanCode = code.replace(/[^a-zA-Z0-9]/g, '').toUpperCase()

    if (cleanCode.length !== 6) {
      setError('Enter the full six-character room code from your swap partner.')
      return
    }

    setError(null)
    pushToast(`Opening demo room ${cleanCode}.`, 'info')
    openRoom(cleanCode)
  }

  const useDemoCode = () => {
    setCode(demoRoom.code)
    setError(null)
  }

  const copyInvite = async () => {
    const invite = `${window.location.origin}/swap/${upcomingSwap.roomId}?partner=${upcomingSwap.matchId}&name=Aisha%20Sharma`

    try {
      await navigator.clipboard.writeText(invite)
      pushToast('Demo invite link copied to your clipboard.')
    } catch {
      pushToast('Clipboard access is blocked here. Open the lobby instead.', 'error')
    } finally {
      setCopying(false)
    }
  }

  return (
    <>
      <section className="relative isolate overflow-hidden border-b border-brand-100/80 bg-white">
        <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
          <div className="absolute -left-40 -top-48 h-96 w-96 rounded-full bg-brand-100/70 blur-3xl" />
          <div className="absolute -right-44 top-0 h-96 w-96 rounded-full bg-[#f8ecd3]/70 blur-3xl" />
          <div className="dot-grid absolute inset-x-0 top-0 h-48 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
        </div>

        <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:py-12">
          <Badge tone="teal" className="bg-white/80 py-1.5">
            <Video size={12} /> Swap Sessions
          </Badge>
          <div className="mt-4 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="max-w-2xl text-balance text-3xl font-extrabold leading-[1.06] tracking-[-0.05em] text-ink-900 sm:text-4xl lg:text-[2.8rem]">
                Twenty-five focused minutes. Two people. One fair trade.
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-ink-600">
                Join a partner’s room, start from a match, or open your upcoming
                swap. The call experience is simulated for this prototype build.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                { icon: Clock3, label: '25-min sessions' },
                { icon: ShieldCheck, label: 'Demo room' },
                { icon: Camera, label: 'Mock video' },
              ].map((item) => (
                <span
                  key={item.label}
                  className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.08em] text-ink-600"
                >
                  <item.icon size={12} className="text-brand-600" />
                  {item.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-10">
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(19rem,0.9fr)] lg:items-start">
          <div className="space-y-5">
            <div className="rounded-[1.5rem] border border-line bg-white p-5 shadow-soft sm:p-6">
              <div className="flex items-start gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
                  <KeyRound size={20} />
                </span>
                <div>
                  <p className="text-[9px] font-extrabold uppercase tracking-[0.16em] text-brand-600">
                    Join a session
                  </p>
                  <h2 className="mt-1 text-xl font-extrabold tracking-[-0.03em] text-ink-900">
                    Have a room code?
                  </h2>
                  <p className="mt-1 text-xs leading-5 text-ink-600">
                    Your partner shares a six-character code. Enter it here to open
                    the pre-call lobby.
                  </p>
                </div>
              </div>

              <form onSubmit={handleJoin} className="mt-5">
                <label
                  htmlFor="room-code"
                  className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-ink-600"
                >
                  Room code
                </label>
                <div className="mt-2 flex flex-col gap-2 sm:flex-row">
                  <input
                    id="room-code"
                    value={code}
                    onChange={(event) => {
                      setCode(
                        event.target.value
                          .toUpperCase()
                          .replace(/[^A-Z0-9]/g, '')
                          .slice(0, 6),
                      )
                      setError(null)
                    }}
                    placeholder="e.g. SWP428"
                    inputMode="text"
                    autoComplete="off"
                    aria-invalid={Boolean(error)}
                    aria-describedby={error ? 'room-code-error' : undefined}
                    className={cn(
                      'h-14 flex-1 rounded-2xl border bg-canvas px-4 text-center text-lg font-extrabold uppercase tracking-[0.35em] text-ink-900 placeholder:text-sm placeholder:font-semibold placeholder:normal-case placeholder:tracking-normal placeholder:text-ink-300 focus:bg-white',
                      error
                        ? 'border-red-300 focus:border-red-400'
                        : 'border-line focus:border-brand-300',
                    )}
                  />
                  <Button type="submit" size="lg" className="h-14 sm:px-7">
                    Join room <ArrowRight size={16} />
                  </Button>
                </div>

                {error && (
                  <p
                    id="room-code-error"
                    role="alert"
                    className="mt-2 text-[11px] font-semibold text-red-600"
                  >
                    {error}
                  </p>
                )}

                <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={useDemoCode}
                    className="inline-flex items-center gap-1.5 rounded-full border border-brand-100 bg-brand-50 px-2.5 py-1.5 text-[10px] font-bold text-brand-700 transition-colors hover:bg-brand-100"
                  >
                    <Sparkles size={11} /> Use demo code {demoRoom.code}
                  </button>
                  <p className="text-[10px] text-ink-400">
                    Any six-character code opens a mock room.
                  </p>
                </div>
              </form>
            </div>

            <div className="rounded-[1.5rem] border border-line bg-white p-5 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-[9px] font-extrabold uppercase tracking-[0.16em] text-brand-600">
                    Quick start
                  </p>
                  <h2 className="mt-1 text-lg font-extrabold tracking-[-0.03em] text-ink-900">
                    Start from a recent match
                  </h2>
                </div>
                <Link
                  to="/match"
                  className="inline-flex items-center gap-1 text-[11px] font-extrabold text-brand-700 hover:text-brand-800"
                >
                  Browse all matches <ArrowRight size={12} />
                </Link>
              </div>

              <div className="mt-4 space-y-2">
                {quickMatches.map((match) => (
                  <div
                    key={match.id}
                    className="flex items-center gap-3 rounded-2xl border border-line bg-canvas/70 p-3"
                  >
                    <Avatar
                      initials={match.initials}
                      name={match.name}
                      tone={match.tone}
                      size="md"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-extrabold text-ink-900">
                        {match.name}
                      </p>
                      <p className="truncate text-[10px] text-ink-500">
                        Teaches {match.teaches[0]} · Wants {match.wants[0]}
                      </p>
                    </div>
                    <span className="hidden rounded-full bg-brand-50 px-2 py-1 text-[9px] font-extrabold text-brand-700 sm:inline">
                      {match.compatibility}%
                    </span>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => {
                        pushToast(`Starting a demo lobby with ${match.name}.`, 'info')
                        openRoom(demoRoom.code, match.id)
                      }}
                    >
                      Start <ArrowRight size={12} />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-line bg-white p-5 sm:p-6">
              <div className="flex items-center gap-2.5">
                <History size={17} className="text-brand-600" />
                <h2 className="text-lg font-extrabold tracking-[-0.03em] text-ink-900">
                  Recent swaps
                </h2>
              </div>
              <div className="mt-4 divide-y divide-line">
                {pastSessions.map((session) => (
                  <div
                    key={session.id}
                    className="flex flex-wrap items-center gap-3 py-3 first:pt-0 last:pb-0"
                  >
                    <Avatar
                      initials={session.partnerInitials}
                      name={session.partnerName}
                      tone={session.partnerTone}
                      size="sm"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-extrabold text-ink-900">
                        {session.partnerName}
                      </p>
                      <p className="truncate text-[10px] text-ink-500">
                        {session.topic} · {session.date}
                      </p>
                    </div>
                    <div className="flex items-center gap-0.5" aria-label={`${session.rating} out of 5 stars`}>
                      {Array.from({ length: 5 }).map((_, index) => (
                        <Star
                          key={index}
                          size={10}
                          className={
                            index < session.rating
                              ? 'fill-sun-400 text-sun-400'
                              : 'text-ink-300'
                          }
                        />
                      ))}
                    </div>
                    <span className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-2 py-1 text-[9px] font-extrabold text-brand-700">
                      +{session.credits} credits
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <aside className="space-y-5">
            <div className="relative overflow-hidden rounded-[1.5rem] bg-ink-900 p-5 text-white">
              <div
                className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-brand-500/25 blur-3xl"
                aria-hidden="true"
              />
              <div className="relative flex items-center justify-between">
                <p className="text-[9px] font-extrabold uppercase tracking-[0.16em] text-brand-300">
                  Your upcoming swap
                </p>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300/20 bg-emerald-400/10 px-2 py-1 text-[9px] font-extrabold text-emerald-200">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
                  Confirmed
                </span>
              </div>

              <div className="relative mt-4 flex items-center gap-3">
                <Avatar
                  initials={upcomingSwap.partnerInitials}
                  name={upcomingSwap.partnerName}
                  tone={upcomingSwap.partnerTone}
                  size="lg"
                  className="ring-2 ring-white/20"
                />
                <div>
                  <p className="text-sm font-extrabold">{upcomingSwap.partnerName}</p>
                  <p className="text-[10px] text-white/50">{upcomingSwap.topic}</p>
                </div>
              </div>

              <div className="relative mt-4 grid grid-cols-2 gap-2">
                <div className="rounded-xl border border-white/10 bg-white/[0.05] p-2.5">
                  <p className="flex items-center gap-1 text-[8px] font-extrabold uppercase tracking-[0.12em] text-white/40">
                    <CalendarDays size={10} /> When
                  </p>
                  <p className="mt-1 text-[10px] font-bold text-white/85">
                    {upcomingSwap.when}
                  </p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/[0.05] p-2.5">
                  <p className="flex items-center gap-1 text-[8px] font-extrabold uppercase tracking-[0.12em] text-white/40">
                    <Clock3 size={10} /> Length
                  </p>
                  <p className="mt-1 text-[10px] font-bold text-white/85">
                    {upcomingSwap.durationMinutes} minutes
                  </p>
                </div>
              </div>

              <div className="relative mt-4 flex flex-col gap-2">
                <Link
                  to={`/swap/${upcomingSwap.roomId}?partner=${upcomingSwap.matchId}`}
                  className={buttonClasses('secondary', 'md', 'w-full')}
                >
                  Open lobby <ArrowRight size={14} />
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setCopying(true)
                    void copyInvite()
                  }}
                  disabled={copying}
                  className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.04] text-[11px] font-bold text-white/75 transition-colors hover:bg-white/[0.08] hover:text-white disabled:opacity-50"
                >
                  <Copy size={13} /> {copying ? 'Copying invite...' : 'Copy demo invite'}
                </button>
              </div>

              <p className="relative mt-3 text-center text-[9px] leading-4 text-white/35">
                Invite links prefill the guest name. Camera and audio are mocked in
                this build.
              </p>
            </div>

            <div className="rounded-[1.5rem] border border-line bg-white p-5">
              <h2 className="text-sm font-extrabold tracking-[-0.02em] text-ink-900">
                How a session runs
              </h2>
              <div className="mt-4 space-y-3.5">
                {[
                  {
                    icon: Users,
                    title: '1. Join the room',
                    detail: 'Check your name and preview the call settings.',
                  },
                  {
                    icon: Mic,
                    title: '2. Swap for 25 minutes',
                    detail: 'Use the agenda: warm up, teach, learn, wrap up.',
                  },
                  {
                    icon: CheckCircle2,
                    title: '3. Leave with proof',
                    detail: 'Rate the swap and log it to your dashboard.',
                  },
                ].map((step, index) => (
                  <div key={step.title} className="flex gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                      <step.icon size={15} />
                    </span>
                    <div>
                      <p className="text-[11px] font-extrabold text-ink-900">
                        {step.title}
                      </p>
                      <p className="mt-0.5 text-[10px] leading-4 text-ink-500">
                        {step.detail}
                      </p>
                    </div>
                    <span className="ml-auto text-[9px] font-extrabold text-ink-300">
                      0{index + 1}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-brand-100 bg-brand-50/60 p-5">
              <p className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.12em] text-brand-700">
                <ShieldCheck size={14} /> Before you join
              </p>
              <ul className="mt-3 space-y-2 text-[10px] leading-4 text-ink-600">
                <li className="flex gap-2">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-brand-500" />
                  Use headphones and find a quiet corner.
                </li>
                <li className="flex gap-2">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-brand-500" />
                  Bring one small thing you can teach in ten minutes.
                </li>
                <li className="flex gap-2">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-brand-500" />
                  No recording, no payment, no real camera access in this build.
                </li>
              </ul>
              <p className="mt-3 border-t border-brand-100 pt-3 text-[9px] font-semibold text-brand-700/70">
                Session agenda is a fixed demo:
                {sessionAgenda.map((item) => item.label).join(' · ')}
              </p>
            </div>
          </aside>
        </div>

        <div className="mt-8 flex justify-center">
          <p className="flex items-center gap-1.5 text-center text-[10px] font-semibold text-ink-400">
            <Sparkles size={11} className="text-brand-500" />
            Real WebRTC and Firebase signaling will replace this mock lobby in a
            later build phase.
          </p>
        </div>
      </section>
    </>
  )
}
