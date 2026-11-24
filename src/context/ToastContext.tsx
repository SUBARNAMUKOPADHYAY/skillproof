import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react'
import { cn } from '../lib/cn'

type ToastTone = 'success' | 'info' | 'error'

type Toast = {
  id: string
  message: string
  tone: ToastTone
}

type ToastContextValue = {
  pushToast: (message: string, tone?: ToastTone) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

const toneStyles: Record<ToastTone, string> = {
  success: 'border-brand-200 bg-white text-ink-900',
  info: 'border-sky-200 bg-white text-ink-900',
  error: 'border-red-200 bg-white text-ink-900',
}

const toneIcons = {
  success: CheckCircle2,
  info: Info,
  error: AlertCircle,
}

const toneIconStyles: Record<ToastTone, string> = {
  success: 'bg-brand-50 text-brand-600',
  info: 'bg-sky-50 text-sky-600',
  error: 'bg-red-50 text-red-600',
}

function ToastCard({
  toast,
  onDismiss,
}: {
  toast: Toast
  onDismiss: (id: string) => void
}) {
  const Icon = toneIcons[toast.tone]

  useEffect(() => {
    const timer = window.setTimeout(() => onDismiss(toast.id), 3600)
    return () => window.clearTimeout(timer)
  }, [toast.id, onDismiss])

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'animate-toast-in flex items-start gap-3 rounded-2xl border p-3 pr-2 shadow-lift',
        toneStyles[toast.tone],
      )}
    >
      <span
        className={cn(
          'flex h-8 w-8 shrink-0 items-center justify-center rounded-xl',
          toneIconStyles[toast.tone],
        )}
      >
        <Icon size={16} strokeWidth={2.4} />
      </span>
      <p className="pt-1 text-xs font-semibold leading-5 text-ink-700">
        {toast.message}
      </p>
      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        aria-label="Dismiss notification"
        className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-ink-400 transition-colors hover:bg-canvas hover:text-ink-700"
      >
        <X size={14} />
      </button>
    </div>
  )
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const counter = useRef(0)

  const removeToast = useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }, [])

  const pushToast = useCallback((message: string, tone: ToastTone = 'success') => {
    counter.current += 1
    const id = `toast-${counter.current}`
    setToasts((current) => [...current.slice(-2), { id, message, tone }])
  }, [])

  const value = useMemo(() => ({ pushToast }), [pushToast])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed bottom-5 right-4 z-[120] flex w-[min(22rem,calc(100vw-2rem))] flex-col gap-2 sm:right-6">
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <ToastCard toast={toast} onDismiss={removeToast} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used inside ToastProvider')
  }
  return context
}
