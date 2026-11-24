import {
  ArrowLeft,
  ArrowLeftRight,
  ArrowRight,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Coins,
  Copy,
  Loader2,
  Mic,
  MicOff,
  Monitor,
  PhoneOff,
  ShieldCheck,
  Sparkles,
  Star,
  StickyNote,
  Video,
  VideoOff,
  Wifi,
  X,
} from 'lucide-react'
import { useEffect, useState, type FormEvent } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { Avatar } from '../components/ui/Avatar'
import { Button, buttonClasses } from '../components/ui/Button'
import { Modal } from '../components/ui/Modal'
import { useDemo } from '../context/DemoStateContext'
import { useToast } from '../context/ToastContext'
import {
  currentUser,
  demoRoom,
  matches,
  sessionAgenda,
} from '../data/mockData'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { cn } from '../lib/cn'

type SessionStage = 'precall' | 'connecting' | 'live' | 'summary'

const CREDITS_EARNED = 4

function formatClock(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

export default function SwapSessionPage() {
  const { roomId } = useParams()
  const [searchParams] = useSearchParams()
  const partner =
    matches.find((match) => match.id === searchParams.get('partner')) ?? matches[0]
  const roomCode = (roomId ?? demoRoom.code).toUpperCase()
  const sessionRoomId = roomId ?? demoRoom.code

  const { addSession, rateSession, credits } = useDemo()
  const { pushToast } = useToast()

  const [stage, setStage] = useState<SessionStage>('precall')
  const [displayName, setDisplayName] = useState(
    () => searchParams.get('name') ?? currentUser.name,
  )
  const [micOn, setMicOn] = useState(true)
  const [cameraOn, setCameraOn] = useState(true)
  const [notesOpen, setNotesOpen] = useState(true)
  const [notes, setNotes] = useState('')
  const [completedAgenda, setCompletedAgenda] = useState<string[]>([])
  const [secondsLeft, setSecondsLeft] = useState(demoRoom.durationMinutes * 60)
  const [endModalOpen, setEndModalOpen] = useState(false)
  const [rating, setRating] = useState(0)

  const topic = `${currentUser.teaches} ↔ ${partner.teaches[0]}`
  const initials = currentUser.initials

  useDocumentTitle(
    stage === 'live'
      ? 'Swap in progress'
      : stage === 'summary'
        ? 'Swap complete'
        : 'Pre-call lobby',
  )

  useEffect(() => {
    if (stage !== 'connecting') return

    const timer = window.setTimeout(() => setStage('live'), 1600)
    return () => window.clearTimeout(timer)
  }, [stage])

  useEffect(() => {
    if (stage !== 'live') return

    const interval = window.setInterval(() => {
      setSecondsLeft((current) => (current > 0 ? current - 1 : 0))
    }, 1000)

    return () => window.clearInterval(interval)
  }, [stage])

  const toggleAgendaItem = (id: string) => {
    setCompletedAgenda((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    )
  }

  const copyInvite = async () => {
    const invite = `${window.location.origin}/swap/${roomCode}?partner=${partner.id}`

    try {
      await navigator.clipboard.writeText(invite)
      pushToast('Invite link copied. Camera access is mocked in this build.')
    } catch {
      pushToast('Clipboard access is blocked here. Share the room code instead.', 'error')
    }
  }

  const joinSession = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setStage('connecting')
  }

  const endSession = () => {
    addSession({
      roomId: sessionRoomId,
      partnerName: partner.name,
      partnerInitials: partner.initials,
      topic,
      durationMinutes: demoRoom.durationMinutes,
      creditsEarned: CREDITS_EARNED,
      completedAt: new Date().toISOString(),
    })
    setEndModalOpen(false)
    setStage('summary')
    pushToast(`Swap logged to your dashboard. +${CREDITS_EARNED} demo credits.`)
  }

  const handleRate = (value: number) => {
    const firstRating = rating === 0
    setRating(value)
    rateSession(sessionRoomId, value)
    if (firstRating) {
      pushToast('Rating saved to this demo session.')
    }
  }

  const timerTone =
    secondsLeft <= 60
      ? 'border-red-400/30 bg-red-500/15 text-red-200'
      : secondsLeft <= 300
        ? 'border-amber-400/30 bg-amber-500/15 text-amber-200'
        : 'border-emerald-400/20 bg-emerald-400/10 text-emerald-100'

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-[#061a17] text-white">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -left-40 -top-40 h-[34rem] w-[34rem] rounded-full bg-brand-500/15 blur-3xl" />
        <div className="absolute -right-40 top-1/3 h-[30rem] w-[30rem] rounded-full bg-[#d9b35f]/10 blur-3xl" />
        <div className="dot-grid absolute inset-0 opacity-20 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
      </div>

      <header className="relative z-30 mx-auto flex w-full max-w-[1500px] items-center justify-between gap-3 px-4 py-4 sm:px-6">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500 text-ink-900 shadow-lg shadow-brand-500/20">
            <ArrowLeftRight size={18} strokeWidth={2.6} />
          </span>
          <span className="hidden text-sm font-extrabold tracking-[-0.03em] sm:inline">
            SkillProof
          </span>
          <span className="ml-1 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.06] px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-[0.1em] text-white/50">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-400" />
            Demo session
          </span>
        </div>

        {stage === 'live' && (
          <div className="hidden items-center gap-2 text-[10px] font-semibold text-white/45 md:flex">
            <span className="text-white/80">{partner.name}</span>
            <span className="text-white/20">·</span>
            <span>{topic}</span>
          </div>
        )}

        <div className="flex items-center gap-2">
          {stage === 'live' ? (
            <>
              <span
                className={cn(
                  'inline-flex h-9 items-center gap-1.5 rounded-full border px-3 font-mono text-xs font-bold tabular-nums',
                  timerTone,
                )}
                aria-label={`${formatClock(secondsLeft)} remaining in this demo swap`}
              >
                <Clock3 size={12} />
                {formatClock(secondsLeft)}
              </span>
              <button
                type="button"
                onClick={() => setEndModalOpen(true)}
                aria-label="Leave session"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] text-white/65 transition-colors hover:bg-red-500/20 hover:text-red-200"
              >
                <PhoneOff size={15} />
              </button>
            </>
          ) : stage === 'summary' ? (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-[9px] font-extrabold uppercase tracking-[0.1em] text-emerald-200">
              <CheckCircle2 size={12} /> Complete
            </span>
          ) : (
            <>
              <span className="hidden items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-[9px] font-extrabold uppercase tracking-[0.12em] text-white/45 sm:inline-flex">
                <ShieldCheck size={11} /> Room {roomCode}
              </span>
              <Link
                to="/swap"
                aria-label="Back to swap sessions"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] text-white/65 transition-colors hover:bg-white/10 hover:text-white"
              >
                <X size={16} />
              </Link>
            </>
          )}
        </div>
      </header>

      {stage === 'precall' && (
        <main className="relative z-10 mx-auto grid w-full max-w-6xl flex-1 gap-5 px-4 pb-8 pt-2 sm:px-6 lg:grid-cols-[minmax(0,1.08fr)_minmax(21rem,0.92fr)] lg:items-start lg:gap-7 lg:py-8">
          <div className="space-y-3">
            <div className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-gradient-to-br from-[#0b2b26] via-[#08211d] to-[#0a1c19] shadow-2xl shadow-black/30">
              <div className="relative flex aspect-[4/3] flex-col justify-between p-4 sm:p-5">
                <div
                  className="pointer-events-none absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:44px_44px]"
                  aria-hidden="true"
                />
                <div
                  className="pointer-events-none absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-500/20 blur-3xl"
                  aria-hidden="true"
                />

                <div className="relative flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.06] px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-[0.1em] text-white/50 backdrop-blur-sm">
                    <Video size={11} /> Camera preview
                  </span>
                  <span className="rounded-full border border-white/10 bg-white/[0.06] px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-[0.1em] text-white/40 backdrop-blur-sm">
                    Simulated
                  </span>
                </div>

                <div className="relative flex flex-1 flex-col items-center justify-center">
                  {cameraOn ? (
                    <>
                      <div className="relative">
                        <span className="absolute -inset-4 animate-pulse rounded-full border border-brand-400/20" />
                        <Avatar
                          initials={initials}
                          name={currentUser.name}
                          tone="amber"
                          size="xl"
                          className="h-24 w-24 text-3xl ring-4 ring-white/10 shadow-2xl sm:h-28 sm:w-28"
                        />
                      </div>
                      <p className="mt-4 text-sm font-extrabold">{displayName}</p>
                      <p className="mt-0.5 text-[10px] font-semibold text-white/40">
                        Camera preview is a mock in this build
                      </p>
                    </>
                  ) : (
                    <>
                      <span className="flex h-24 w-24 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/35">
                        <VideoOff size={36} />
                      </span>
                      <p className="mt-4 text-sm font-extrabold">Camera is off</p>
                      <p className="mt-0.5 text-[10px] text-white/35">
                        Turn it back on to see the dummy preview
                      </p>
                    </>
                  )}
                </div>

                <div className="relative flex items-center justify-between gap-2">
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-2.5 py-1.5 backdrop-blur-sm">
                    {micOn ? (
                      <span className="flex items-end gap-0.5" aria-hidden="true">
                        {[1, 2, 3, 4].map((bar) => (
                          <span
                            key={bar}
                            className="w-0.5 animate-pulse rounded-full bg-emerald-300"
                            style={{ height: `${4 + bar * 2}px`, animationDelay: `${bar * 120}ms` }}
                          />
                        ))}
                      </span>
                    ) : (
                      <MicOff size={12} className="text-red-300" />
                    )}
                    <span className="text-[9px] font-bold text-white/50">
                      {micOn ? 'Mic on' : 'Muted'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setMicOn((on) => !on)}
                      aria-pressed={!micOn}
                      aria-label={micOn ? 'Mute microphone' : 'Unmute microphone'}
                      className={cn(
                        'flex h-10 w-10 items-center justify-center rounded-full border transition-colors',
                        micOn
                          ? 'border-white/10 bg-white/[0.08] text-white/75 hover:bg-white/[0.14]'
                          : 'border-red-400/25 bg-red-500/15 text-red-200',
                      )}
                    >
                      {micOn ? <Mic size={17} /> : <MicOff size={17} />}
                    </button>
                    <button
                      type="button"
                      onClick={() => setCameraOn((on) => !on)}
                      aria-pressed={!cameraOn}
                      aria-label={cameraOn ? 'Turn camera off' : 'Turn camera on'}
                      className={cn(
                        'flex h-10 w-10 items-center justify-center rounded-full border transition-colors',
                        cameraOn
                          ? 'border-white/10 bg-white/[0.08] text-white/75 hover:bg-white/[0.14]'
                          : 'border-red-400/25 bg-red-500/15 text-red-200',
                      )}
                    >
                      {cameraOn ? <Video size={17} /> : <VideoOff size={17} />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="hidden items-center justify-between rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3 text-[10px] text-white/35 lg:flex">
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck size={12} className="text-brand-400" />
                No camera or microphone access is requested in this build.
              </span>
              <span>Room code {roomCode}</span>
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.045] p-5 backdrop-blur-sm sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-300/20 bg-brand-400/10 px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-[0.1em] text-brand-200">
                <Sparkles size={11} /> {partner.compatibility}% compatibility
              </span>
              <span className="text-[9px] font-bold uppercase tracking-[0.1em] text-white/30">
                You’re hosting
              </span>
            </div>

            <div className="mt-5 flex items-center gap-3">
              <Avatar
                initials={partner.initials}
                name={partner.name}
                tone={partner.tone}
                size="lg"
                className="ring-2 ring-white/15"
              />
              <div>
                <p className="text-[9px] font-extrabold uppercase tracking-[0.14em] text-white/35">
                  Swapping with
                </p>
                <p className="text-sm font-extrabold">{partner.name}</p>
                <p className="text-[10px] text-white/40">
                  Teaches {partner.teaches[0]} · wants {partner.wants[0]}
                </p>
              </div>
            </div>

            <h1 className="mt-5 text-2xl font-extrabold tracking-[-0.035em] sm:text-[1.7rem]">
              {topic}
            </h1>
            <p className="mt-2 text-xs leading-5 text-white/45">
              A focused 25-minute trade. Teach one useful thing, learn one useful
              thing, and leave with a clear next step.
            </p>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <div className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5">
                <p className="flex items-center gap-1 text-[8px] font-extrabold uppercase tracking-[0.12em] text-white/30">
                  <Clock3 size={10} /> Session
                </p>
                <p className="mt-1 text-xs font-extrabold">25 minutes</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5">
                <p className="flex items-center gap-1 text-[8px] font-extrabold uppercase tracking-[0.12em] text-white/30">
                  <Coins size={10} /> Reward
                </p>
                <p className="mt-1 text-xs font-extrabold text-amber-200">
                  +{CREDITS_EARNED} demo credits
                </p>
              </div>
            </div>

            <form onSubmit={joinSession} className="mt-5">
              <label
                htmlFor="display-name"
                className="text-[9px] font-extrabold uppercase tracking-[0.12em] text-white/40"
              >
                Your display name
              </label>
              <input
                id="display-name"
                value={displayName}
                onChange={(event) => setDisplayName(event.target.value)}
                required
                className="mt-1.5 h-11 w-full rounded-xl border border-white/10 bg-white/[0.055] px-3.5 text-xs font-semibold text-white placeholder:text-white/30 focus:border-brand-400/50"
              />

              <div className="mt-3 grid grid-cols-2 gap-2">
                <div>
                  <label
                    htmlFor="microphone-device"
                    className="text-[9px] font-extrabold uppercase tracking-[0.12em] text-white/40"
                  >
                    Microphone
                  </label>
                  <div className="relative mt-1.5">
                    <select
                      id="microphone-device"
                      defaultValue="Built-in microphone"
                      className="h-10 w-full appearance-none rounded-xl border border-white/10 bg-white/[0.055] pl-3 pr-8 text-[10px] font-semibold text-white/70 focus:border-brand-400/50"
                    >
                      <option>Built-in microphone</option>
                      <option>Headset microphone</option>
                      <option>External USB mic</option>
                    </select>
                    <ChevronDown
                      size={12}
                      className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-white/30"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="camera-device"
                    className="text-[9px] font-extrabold uppercase tracking-[0.12em] text-white/40"
                  >
                    Camera
                  </label>
                  <div className="relative mt-1.5">
                    <select
                      id="camera-device"
                      defaultValue="Built-in camera"
                      className="h-10 w-full appearance-none rounded-xl border border-white/10 bg-white/[0.055] pl-3 pr-8 text-[10px] font-semibold text-white/70 focus:border-brand-400/50"
                    >
                      <option>Built-in camera</option>
                      <option>External camera</option>
                      <option>Phone as webcam</option>
                    </select>
                    <ChevronDown
                      size={12}
                      className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-white/30"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.035] p-3">
                <p className="flex items-center gap-1.5 text-[9px] font-extrabold uppercase tracking-[0.12em] text-white/35">
                  <StickyNote size={11} /> Suggested agenda
                </p>
                <div className="mt-2 space-y-1.5">
                  {sessionAgenda.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-2 text-[10px] text-white/50"
                    >
                      <span className="flex h-4 w-4 items-center justify-center rounded-full border border-white/15 text-[7px] font-bold text-white/40">
                        {item.minutes}
                      </span>
                      <span className="flex-1">{item.label}</span>
                      <span className="text-[8px] font-semibold text-white/25">
                        {item.minutes} min
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className={buttonClasses(
                  'primary',
                  'lg',
                  'mt-4 w-full bg-brand-500 text-ink-900 shadow-lg shadow-brand-500/20 hover:bg-brand-400',
                )}
              >
                <Video size={17} /> Join demo swap
              </button>
            </form>

            <div className="mt-3 flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] p-2">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.06] text-white/40">
                <Monitor size={14} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[8px] font-extrabold uppercase tracking-[0.1em] text-white/30">
                  Invite
                </p>
                <p className="truncate font-mono text-[10px] font-semibold text-white/55">
                  /swap/{roomCode}
                </p>
              </div>
              <button
                type="button"
                onClick={() => void copyInvite()}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.05] text-white/50 transition-colors hover:bg-white/10 hover:text-white"
                aria-label="Copy invite link"
              >
                <Copy size={13} />
              </button>
            </div>

            <p className="mt-3 text-center text-[9px] leading-4 text-white/25">
              This is a simulated pre-call screen. Real camera permissions and
              peer-to-peer video will be added with WebRTC later.
            </p>
          </div>
        </main>
      )}

      {stage === 'connecting' && (
        <main className="relative z-10 flex flex-1 items-center justify-center px-5 py-16">
          <div className="w-full max-w-md text-center">
            <div className="relative mx-auto flex h-28 w-28 items-center justify-center">
              <span className="absolute inset-0 animate-ping rounded-full bg-brand-500/15" />
              <span className="absolute inset-3 rounded-full border border-brand-300/20" />
              <Avatar
                initials={partner.initials}
                name={partner.name}
                tone={partner.tone}
                size="xl"
                className="relative ring-4 ring-white/10 shadow-2xl"
              />
              <span className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full border-4 border-[#061a17] bg-brand-500 text-ink-900">
                <Loader2 size={15} className="animate-spin" />
              </span>
            </div>
            <p className="mt-7 text-[9px] font-extrabold uppercase tracking-[0.16em] text-brand-300">
              Connecting demo room {roomCode}
            </p>
            <h1 className="mt-2 text-2xl font-extrabold tracking-[-0.04em]">
              Bringing {partner.name.split(' ')[0]} into the room
            </h1>
            <p className="mx-auto mt-2 max-w-sm text-xs leading-5 text-white/40">
              Simulating a peer connection so you can review the in-call
              experience. No camera or network access is used.
            </p>

            <div className="mx-auto mt-6 max-w-xs rounded-2xl border border-white/10 bg-white/[0.04] p-3">
              {[
                'Checking room and display name',
                'Preparing mock audio and video',
                'Opening the session space',
              ].map((step, index) => (
                <div
                  key={step}
                  className="flex items-center gap-2 border-b border-white/[0.06] py-2 text-left text-[10px] font-semibold text-white/45 last:border-0"
                >
                  <span
                    className={cn(
                      'flex h-4 w-4 items-center justify-center rounded-full border text-[7px]',
                      index < 2
                        ? 'border-brand-400/40 bg-brand-400/15 text-brand-200'
                        : 'border-white/10 text-white/30',
                    )}
                  >
                    {index < 2 ? <Check size={9} /> : index + 1}
                  </span>
                  {step}
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setStage('precall')}
              className="mt-5 text-[10px] font-bold text-white/35 transition-colors hover:text-white/70"
            >
              Cancel and go back
            </button>
          </div>
        </main>
      )}

      {stage === 'live' && (
        <main className="relative z-10 mx-auto flex w-full max-w-[1500px] flex-1 flex-col px-4 pb-4 sm:px-6 sm:pb-6">
          <div
            className={cn(
              'grid flex-1 gap-3',
              notesOpen && 'xl:grid-cols-[minmax(0,1fr)_20rem]',
            )}
          >
            <div className="relative flex min-h-[27rem] flex-col overflow-hidden rounded-[1.5rem] border border-white/10 bg-gradient-to-br from-[#0b2924] via-[#071e1a] to-[#091714] shadow-2xl sm:min-h-[33rem]">
              <div
                className="pointer-events-none absolute inset-0 opacity-25 [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.08)_1px,transparent_0)] [background-size:32px_32px]"
                aria-hidden="true"
              />
              <div
                className="pointer-events-none absolute left-1/2 top-[44%] h-[26rem] w-[26rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-500/15 blur-3xl"
                aria-hidden="true"
              />

              <div className="relative flex items-start justify-between gap-3 p-4 sm:p-5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300/20 bg-emerald-400/10 px-2.5 py-1.5 text-[9px] font-extrabold text-emerald-200 backdrop-blur-sm">
                    <Wifi size={11} />
                    Connected
                    <span className="text-emerald-200/40">· demo</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-black/20 px-2.5 py-1.5 text-[9px] font-bold text-white/45 backdrop-blur-sm">
                    <Video size={11} /> Mock video feed
                  </span>
                </div>

                <div className="relative hidden w-32 shrink-0 overflow-hidden rounded-xl border border-white/15 bg-[#0e302a] shadow-2xl sm:block sm:w-44">
                  <div className="flex aspect-video items-center justify-center bg-gradient-to-br from-[#1b4b41] to-[#08201c]">
                    {cameraOn ? (
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#ffd18a] to-[#d97757] text-xs font-extrabold text-white">
                        {initials}
                      </span>
                    ) : (
                      <VideoOff size={18} className="text-white/30" />
                    )}
                  </div>
                  <div className="absolute inset-x-1.5 bottom-1.5 flex items-center justify-between gap-1 rounded-md bg-black/40 px-1.5 py-1 backdrop-blur-sm">
                    <span className="text-[8px] font-extrabold text-white/70">You</span>
                    {!micOn && <MicOff size={9} className="text-red-300" />}
                  </div>
                </div>
              </div>

              <div className="relative flex flex-1 flex-col items-center justify-center px-4 pb-24">
                <div className="relative">
                  <span className="absolute -inset-5 rounded-full border border-brand-400/10" />
                  <span className="absolute -inset-10 rounded-full border border-brand-400/[0.06]" />
                  <Avatar
                    initials={partner.initials}
                    name={partner.name}
                    tone={partner.tone}
                    size="xl"
                    className="h-28 w-28 text-4xl ring-4 ring-white/10 shadow-2xl sm:h-32 sm:w-32"
                  />
                </div>
                <p className="mt-5 text-lg font-extrabold tracking-[-0.02em]">
                  {partner.name}
                </p>
                <p className="mt-1 text-[10px] font-semibold text-white/35">
                  {topic} · 25-minute demo swap
                </p>
                <span className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[9px] font-semibold text-white/30">
                  <Sparkles size={10} className="text-brand-300/60" />
                  {partner.name.split(' ')[0]}’s camera is simulated
                </span>
              </div>

              <div className="absolute inset-x-0 bottom-0 z-20 flex justify-center bg-gradient-to-t from-[#061a17]/90 to-transparent px-3 pb-4 pt-12">
                <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-[#0b211d]/85 p-2 shadow-2xl backdrop-blur-xl">
                  <button
                    type="button"
                    onClick={() => setMicOn((on) => !on)}
                    aria-pressed={!micOn}
                    aria-label={micOn ? 'Mute microphone' : 'Unmute microphone'}
                    className={cn(
                      'flex h-11 w-11 items-center justify-center rounded-xl border transition-colors',
                      micOn
                        ? 'border-white/10 bg-white/[0.07] text-white/75 hover:bg-white/[0.12]'
                        : 'border-red-400/25 bg-red-500/20 text-red-200',
                    )}
                  >
                    {micOn ? <Mic size={18} /> : <MicOff size={18} />}
                  </button>
                  <button
                    type="button"
                    onClick={() => setCameraOn((on) => !on)}
                    aria-pressed={!cameraOn}
                    aria-label={cameraOn ? 'Turn camera off' : 'Turn camera on'}
                    className={cn(
                      'flex h-11 w-11 items-center justify-center rounded-xl border transition-colors',
                      cameraOn
                        ? 'border-white/10 bg-white/[0.07] text-white/75 hover:bg-white/[0.12]'
                        : 'border-red-400/25 bg-red-500/20 text-red-200',
                    )}
                  >
                    {cameraOn ? <Video size={18} /> : <VideoOff size={18} />}
                  </button>
                  <button
                    type="button"
                    onClick={() => setNotesOpen((open) => !open)}
                    aria-pressed={notesOpen}
                    aria-label={notesOpen ? 'Hide session notes' : 'Show session notes'}
                    className={cn(
                      'flex h-11 w-11 items-center justify-center rounded-xl border transition-colors',
                      notesOpen
                        ? 'border-brand-300/25 bg-brand-400/15 text-brand-200'
                        : 'border-white/10 bg-white/[0.07] text-white/75 hover:bg-white/[0.12]',
                    )}
                  >
                    <StickyNote size={18} />
                  </button>
                  <span className="mx-1 h-6 w-px bg-white/10" aria-hidden="true" />
                  <button
                    type="button"
                    onClick={() => setEndModalOpen(true)}
                    className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#d9534f] px-4 text-xs font-extrabold text-white transition-colors hover:bg-[#c44743]"
                  >
                    <PhoneOff size={16} />
                    <span className="hidden sm:inline">End</span>
                  </button>
                </div>
              </div>
            </div>

            {notesOpen && (
              <aside className="flex flex-col rounded-[1.5rem] border border-white/10 bg-white/[0.045] p-4 backdrop-blur-sm">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand-400/10 text-brand-300">
                      <StickyNote size={15} />
                    </span>
                    <div>
                      <p className="text-xs font-extrabold">Session notes</p>
                      <p className="text-[9px] text-white/30">Local to this demo</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setNotesOpen(false)}
                    aria-label="Close notes panel"
                    className="flex h-7 w-7 items-center justify-center rounded-lg text-white/30 hover:bg-white/10 hover:text-white"
                  >
                    <X size={13} />
                  </button>
                </div>

                <div className="mt-5">
                  <p className="text-[8px] font-extrabold uppercase tracking-[0.14em] text-white/30">
                    Suggested agenda
                  </p>
                  <div className="mt-2 space-y-1">
                    {sessionAgenda.map((item) => {
                      const done = completedAgenda.includes(item.id)
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => toggleAgendaItem(item.id)}
                          className="flex w-full items-center gap-2 rounded-lg px-1.5 py-1.5 text-left transition-colors hover:bg-white/[0.04]"
                        >
                          <span
                            className={cn(
                              'flex h-4 w-4 shrink-0 items-center justify-center rounded-full border text-[7px]',
                              done
                                ? 'border-brand-400 bg-brand-500 text-ink-900'
                                : 'border-white/15 text-white/25',
                            )}
                          >
                            {done ? <Check size={9} strokeWidth={3} /> : item.minutes}
                          </span>
                          <span
                            className={cn(
                              'flex-1 text-[10px] font-semibold',
                              done ? 'text-white/30 line-through' : 'text-white/60',
                            )}
                          >
                            {item.label}
                          </span>
                          <span className="text-[8px] text-white/20">
                            {item.minutes}m
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div className="mt-5 flex flex-1 flex-col">
                  <label
                    htmlFor="session-notes"
                    className="text-[8px] font-extrabold uppercase tracking-[0.14em] text-white/30"
                  >
                    Your notes
                  </label>
                  <textarea
                    id="session-notes"
                    value={notes}
                    onChange={(event) => setNotes(event.target.value)}
                    placeholder="One thing you learned, one thing to practice next..."
                    rows={6}
                    className="mt-2 min-h-24 flex-1 resize-none rounded-xl border border-white/10 bg-black/15 px-3 py-2.5 text-[11px] leading-5 text-white/75 placeholder:text-white/20 focus:border-brand-400/40"
                  />
                </div>

                <div className="mt-3 flex items-center justify-between border-t border-white/[0.07] pt-3">
                  <span className="text-[9px] text-white/25">
                    {notes.trim() ? `${notes.trim().length} characters` : 'No notes yet'}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[9px] font-semibold text-emerald-300/50">
                    <CheckCircle2 size={10} /> Autosaved locally
                  </span>
                </div>

                <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.035] p-2.5">
                  <p className="flex items-center gap-1.5 text-[8px] font-extrabold uppercase tracking-[0.12em] text-white/25">
                    <Coins size={10} /> End-of-swap reward
                  </p>
                  <p className="mt-1 text-[10px] text-white/45">
                    Completing this mock session adds +{CREDITS_EARNED} credits and
                    one dashboard activity.
                  </p>
                </div>
              </aside>
            )}
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 px-1 text-[9px] font-semibold text-white/25">
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck size={11} className="text-brand-400/60" />
              Simulated call environment · no media is transmitted
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Room {roomCode} · timer running
            </span>
          </div>
        </main>
      )}

      {stage === 'summary' && (
        <main className="relative z-10 flex flex-1 items-start justify-center px-4 py-8 sm:items-center sm:px-6">
          <div className="w-full max-w-xl overflow-hidden rounded-[2rem] border border-white/20 bg-white text-ink-900 shadow-2xl shadow-black/40">
            <div className="relative overflow-hidden border-b border-brand-100 bg-brand-50/80 px-6 pb-6 pt-8 text-center">
              <div
                className="pointer-events-none absolute -left-10 -top-16 h-40 w-40 rounded-full bg-brand-200/40 blur-2xl"
                aria-hidden="true"
              />
              <div
                className="pointer-events-none absolute -right-12 bottom-0 h-32 w-32 rounded-full bg-[#f4d9a2]/50 blur-2xl"
                aria-hidden="true"
              />
              <span className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-600 text-white shadow-lg shadow-brand-600/25">
                <CheckCircle2 size={30} />
              </span>
              <h1 className="relative mt-4 text-2xl font-extrabold tracking-[-0.04em] text-ink-900 sm:text-3xl">
                Swap complete.
              </h1>
              <p className="relative mx-auto mt-1.5 max-w-sm text-xs leading-5 text-ink-600">
                You traded {currentUser.teaches} for {partner.teaches[0]}. Your
                dashboard has been updated with this demo session.
              </p>
            </div>

            <div className="p-5 sm:p-6">
              <div className="flex items-center gap-3">
                <Avatar
                  initials={partner.initials}
                  name={partner.name}
                  tone={partner.tone}
                  size="lg"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-extrabold text-ink-900">
                    {partner.name}
                  </p>
                  <p className="truncate text-[10px] text-ink-500">{topic}</p>
                </div>
                <span className="rounded-full bg-brand-50 px-2.5 py-1 text-[9px] font-extrabold text-brand-700">
                  Complete
                </span>
              </div>

              <div className="mt-5 grid grid-cols-3 gap-2">
                {[
                  { label: 'Duration', value: '25 min' },
                  { label: 'Credits', value: `+${CREDITS_EARNED}` },
                  { label: 'Room', value: roomCode },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-xl border border-line bg-canvas px-2.5 py-2.5 text-center"
                  >
                    <p className="text-[8px] font-extrabold uppercase tracking-[0.1em] text-ink-400">
                      {item.label}
                    </p>
                    <p className="mt-1 text-sm font-extrabold text-ink-900">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-5 rounded-2xl border border-line bg-white p-4 text-center">
                <p className="text-[9px] font-extrabold uppercase tracking-[0.14em] text-brand-600">
                  How was the swap?
                </p>
                <div className="mt-2.5 flex items-center justify-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleRate(star)}
                      aria-label={`Rate swap ${star} out of 5 stars`}
                      aria-pressed={rating === star}
                      className="rounded-lg p-1 transition-transform hover:scale-110"
                    >
                      <Star
                        size={24}
                        className={
                          star <= rating
                            ? 'fill-sun-400 text-sun-400'
                            : 'text-ink-300'
                        }
                      />
                    </button>
                  ))}
                </div>
                <p className="mt-1 text-[9px] text-ink-400">
                  {rating > 0
                    ? `Thanks — ${rating}-star demo rating saved.`
                    : 'Ratings update the local demo session only.'}
                </p>
              </div>

              <div className="mt-5 flex flex-col gap-2 sm:flex-row">
                <Link
                  to="/dashboard"
                  className={buttonClasses('primary', 'md', 'flex-1')}
                >
                  Back to dashboard <ArrowRight size={14} />
                </Link>
                <Link
                  to="/match"
                  className={buttonClasses('secondary', 'md', 'flex-1')}
                >
                  Find another swap
                </Link>
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-line pt-3 text-[9px] text-ink-400">
                <span className="inline-flex items-center gap-1.5">
                  <Coins size={11} className="text-brand-500" />
                  Balance now {credits} demo credits
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays size={11} />
                  {demoRoom.durationMinutes}-minute session
                </span>
              </div>
            </div>
          </div>
        </main>
      )}

      <Modal
        open={endModalOpen}
        onClose={() => setEndModalOpen(false)}
        title="End this swap?"
        description={`You have ${formatClock(secondsLeft)} left in the demo session.`}
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => setEndModalOpen(false)}>
              Keep swapping
            </Button>
            <Button variant="danger" onClick={endSession}>
              <PhoneOff size={15} /> End & see summary
            </Button>
          </>
        }
      >
        <p className="text-sm leading-6 text-ink-600">
          Ending will mark the swap complete, add +{CREDITS_EARNED} demo credits,
          and place a new session in your dashboard activity. No media or notes
          leave this browser.
        </p>
        <div className="mt-4 flex items-center gap-3 rounded-xl border border-line bg-canvas p-3">
          <Avatar
            initials={partner.initials}
            name={partner.name}
            tone={partner.tone}
            size="md"
          />
          <div>
            <p className="text-[11px] font-extrabold text-ink-900">
              {partner.name}
            </p>
            <p className="text-[10px] text-ink-500">{topic}</p>
          </div>
          <span className="ml-auto rounded-full bg-white px-2 py-1 text-[9px] font-extrabold text-brand-700 shadow-sm">
            {formatClock(secondsLeft)} left
          </span>
        </div>
      </Modal>

      <div className="relative z-10 mx-auto flex w-full max-w-[1500px] items-center justify-between gap-3 px-4 pb-4 text-[9px] font-semibold text-white/20 sm:px-6">
        <span className="inline-flex items-center gap-1.5">
          <ArrowLeftRight size={11} /> SkillProof college prototype
        </span>
        <Link
          to="/swap"
          className="inline-flex items-center gap-1.5 transition-colors hover:text-white/50"
        >
          <ArrowLeft size={11} /> Swap lobby
        </Link>
      </div>
    </div>
  )
}
