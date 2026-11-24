import {
  ArrowRight,
  BookOpen,
  Coins,
  CornerDownLeft,
  MessageCircleMore,
  Send,
  ShieldCheck,
  Sparkles,
  Trash2,
  Users,
} from 'lucide-react'
import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from 'react'
import { Link } from 'react-router-dom'
import { Avatar } from '../components/ui/Avatar'
import { Badge } from '../components/ui/Badge'
import { Button, buttonClasses } from '../components/ui/Button'
import {
  aiFallback,
  aiResponses,
  aiSuggestions,
  currentUser,
  initialAiMessages,
} from '../data/mockData'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { cn } from '../lib/cn'
import type { AiResponse, ChatMessage } from '../types'

function getScriptedResponse(input: string): AiResponse {
  const normalized = input.toLowerCase()
  let best: AiResponse | null = null
  let bestScore = 0

  for (const response of aiResponses) {
    const score = response.keywords.reduce(
      (total, keyword) => (normalized.includes(keyword) ? total + 1 : total),
      0,
    )
    if (score > bestScore) {
      best = response
      bestScore = score
    }
  }

  return best ?? { keywords: [], content: aiFallback }
}

export default function AiGuidePage() {
  useDocumentTitle('AI Guide')

  const [messages, setMessages] = useState<ChatMessage[]>(initialAiMessages)
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const replyTimer = useRef<number | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = scrollRef.current
    if (container) {
      container.scrollTop = container.scrollHeight
    }
  }, [messages, typing])

  useEffect(() => {
    return () => {
      if (replyTimer.current) window.clearTimeout(replyTimer.current)
    }
  }, [])

  const sendMessage = (rawMessage: string) => {
    const message = rawMessage.trim()
    if (!message || typing) return

    setMessages((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        role: 'user',
        content: message,
      },
    ])
    setInput('')
    setTyping(true)

    const response = getScriptedResponse(message)
    replyTimer.current = window.setTimeout(() => {
      setMessages((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: response.content,
          action: response.action,
        },
      ])
      setTyping(false)
    }, 850 + Math.random() * 500)
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    sendMessage(input)
  }

  const clearChat = () => {
    if (replyTimer.current) window.clearTimeout(replyTimer.current)
    setTyping(false)
    setMessages(initialAiMessages)
    setInput('')
  }

  return (
    <section className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Badge tone="teal">
            <Sparkles size={12} /> AI Guide
          </Badge>
          <h1 className="mt-3 text-3xl font-extrabold tracking-[-0.045em] text-ink-900 sm:text-4xl">
            Your swap copilot.
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-ink-600">
            A scripted assistant for finding matches, understanding credits, and
            getting ready for your first 25-minute swap.
          </p>
        </div>
        <span className="inline-flex w-fit items-center gap-2 rounded-full border border-[#f3e3bc] bg-[#fffaf0] px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.1em] text-[#946208]">
          <ShieldCheck size={13} /> Prototype assistant
        </span>
      </div>

      <div className="mt-7 grid gap-5 lg:grid-cols-[19rem_minmax(0,1fr)] lg:items-start">
        <aside className="space-y-4">
          <div className="relative overflow-hidden rounded-[1.5rem] bg-ink-900 p-5 text-white">
            <div
              className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-brand-500/25 blur-2xl"
              aria-hidden="true"
            />
            <div className="relative flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-500 text-ink-900 shadow-lg shadow-brand-500/25">
                <Sparkles size={20} />
              </span>
              <div>
                <p className="text-sm font-extrabold">SkillProof Guide</p>
                <p className="text-[10px] font-semibold text-white/45">
                  Scripted · no network calls
                </p>
              </div>
            </div>
            <p className="relative mt-4 text-xs leading-5 text-white/60">
              I work from a small set of demo intents. Ask about matches, credits,
              what to teach, or how to prepare for a session.
            </p>
            <div className="relative mt-4 space-y-1.5">
              {[
                { icon: Users, label: 'Find a two-way match' },
                { icon: Coins, label: 'Decode the credit system' },
                { icon: BookOpen, label: 'Pick a skill to teach' },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-2.5 py-2 text-[10px] font-semibold text-white/65"
                >
                  <item.icon size={12} className="text-brand-300" />
                  {item.label}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-line bg-white p-4">
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
            <p className="mt-3 border-t border-line pt-3 text-[10px] leading-4 text-ink-500">
              Your guide uses this demo profile for suggestions. It does not store
              or send your conversation anywhere.
            </p>
            <Link
              to="/match"
              className={buttonClasses('secondary', 'sm', 'mt-3 w-full')}
            >
              Browse matches <ArrowRight size={13} />
            </Link>
          </div>
        </aside>

        <div className="flex min-h-[38rem] flex-col overflow-hidden rounded-[1.5rem] border border-line bg-white shadow-soft lg:min-h-[42rem]">
          <div className="flex items-center justify-between gap-3 border-b border-line bg-white/90 px-4 py-3.5 sm:px-5">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500 text-ink-900">
                <MessageCircleMore size={17} />
              </span>
              <div>
                <p className="text-xs font-extrabold text-ink-900">
                  Swap copilot
                </p>
                <p className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.1em] text-emerald-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Scripted & online
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={clearChat}
              disabled={messages.length <= 1 && !typing}
              className="inline-flex items-center gap-1.5 rounded-full border border-line px-2.5 py-1.5 text-[10px] font-bold text-ink-500 transition-colors hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700 disabled:opacity-40"
            >
              <Trash2 size={12} /> Clear chat
            </button>
          </div>

          <div
            ref={scrollRef}
            role="log"
            aria-live="polite"
            aria-label="Conversation with the SkillProof guide"
            className="flex-1 space-y-4 overflow-y-auto bg-canvas/60 px-4 py-5 sm:px-5"
          >
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  'flex items-start gap-2.5',
                  message.role === 'user' && 'flex-row-reverse',
                )}
              >
                {message.role === 'assistant' ? (
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-brand-500 text-ink-900 shadow-sm">
                    <Sparkles size={15} />
                  </span>
                ) : (
                  <Avatar
                    initials={currentUser.initials}
                    name={currentUser.name}
                    tone="amber"
                    size="sm"
                    className="mt-0.5 h-8 w-8"
                  />
                )}

                <div
                  className={cn(
                    'max-w-[85%] sm:max-w-[78%]',
                    message.role === 'user' && 'text-right',
                  )}
                >
                  <div
                    className={cn(
                      'rounded-2xl px-4 py-3 text-left text-[12px] leading-5',
                      message.role === 'assistant'
                        ? 'rounded-tl-md border border-line bg-white text-ink-700 shadow-sm'
                        : 'rounded-tr-md bg-brand-600 text-white',
                    )}
                  >
                    {message.content}
                  </div>
                  {message.action && (
                    <Link
                      to={message.action.to}
                      className={buttonClasses('secondary', 'sm', 'mt-2')}
                    >
                      {message.action.label} <ArrowRight size={12} />
                    </Link>
                  )}
                </div>
              </div>
            ))}

            {typing && (
              <div className="flex items-start gap-2.5">
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-brand-500 text-ink-900">
                  <Sparkles size={15} />
                </span>
                <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-md border border-line bg-white px-4 py-3.5 shadow-sm">
                  {[0, 1, 2].map((dot) => (
                    <span
                      key={dot}
                      className="h-1.5 w-1.5 animate-bounce rounded-full bg-brand-400"
                      style={{ animationDelay: `${dot * 140}ms` }}
                    />
                  ))}
                  <span className="ml-1 text-[10px] font-semibold text-ink-400">
                    Thinking through the script
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-line bg-white px-4 py-3.5 sm:px-5">
            <div className="flex gap-1.5 overflow-x-auto pb-2 no-scrollbar">
              {aiSuggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => sendMessage(suggestion)}
                  disabled={typing}
                  className="shrink-0 rounded-full border border-brand-100 bg-brand-50/60 px-3 py-1.5 text-[10px] font-bold text-brand-700 transition-colors hover:border-brand-200 hover:bg-brand-100 disabled:opacity-50"
                >
                  {suggestion}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="mt-1 flex items-end gap-2">
              <div className="relative min-w-0 flex-1">
                <label htmlFor="ai-guide-input" className="sr-only">
                  Ask the SkillProof guide
                </label>
                <input
                  id="ai-guide-input"
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  placeholder="Ask about matches, credits, or a swap..."
                  className="h-11 w-full rounded-xl border border-line bg-canvas px-3.5 pr-10 text-xs font-semibold text-ink-900 placeholder:font-medium placeholder:text-ink-400 focus:border-brand-300 focus:bg-white"
                />
                <CornerDownLeft
                  size={13}
                  className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-300"
                />
              </div>
              <Button
                type="submit"
                size="md"
                disabled={!input.trim() || typing}
                aria-label="Send message"
                className="h-11 w-11 shrink-0 px-0"
              >
                <Send size={16} />
              </Button>
            </form>

            <p className="mt-2 text-center text-[9px] font-medium text-ink-400">
              Prototype assistant — replies are scripted and stay in your browser.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
