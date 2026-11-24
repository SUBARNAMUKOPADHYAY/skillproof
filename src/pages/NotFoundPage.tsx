import { ArrowLeft, ArrowRight, Compass, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { buttonClasses } from '../components/ui/Button'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

export default function NotFoundPage() {
  useDocumentTitle('Page not found')

  return (
    <section className="relative isolate flex min-h-[70vh] items-center overflow-hidden px-5 py-16 sm:px-8">
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        <div className="absolute left-1/2 top-1/2 h-[32rem] w-[32rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-100/50 blur-3xl" />
        <div className="dot-grid absolute inset-x-0 top-0 h-full [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
      </div>

      <div className="mx-auto w-full max-w-lg text-center">
        <div className="relative inline-flex items-center justify-center">
          <span className="flex h-20 w-20 items-center justify-center rounded-[1.75rem] bg-brand-600 text-white shadow-xl shadow-brand-600/25">
            <Compass size={34} />
          </span>
          <span className="absolute -right-3 -top-2 flex h-8 w-8 items-center justify-center rounded-full border-4 border-canvas bg-sun-400 text-ink-900">
            <Sparkles size={14} />
          </span>
        </div>

        <p className="mt-8 text-[10px] font-extrabold uppercase tracking-[0.24em] text-brand-600">
          Error 404
        </p>
        <h1 className="mt-2 text-balance text-4xl font-extrabold tracking-[-0.05em] text-ink-900">
          This skill swap took a wrong turn.
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-ink-600">
          The page you were looking for isn’t here. Head home, browse the Match
          Hub, or ask the guide where to go next.
        </p>

        <div className="mt-7 flex flex-col items-center justify-center gap-2.5 sm:flex-row">
          <Link to="/" className={buttonClasses('primary', 'md')}>
            <ArrowLeft size={15} /> Back home
          </Link>
          <Link to="/match" className={buttonClasses('secondary', 'md')}>
            Browse matches <ArrowRight size={15} />
          </Link>
        </div>

        <p className="mt-8 text-[10px] font-semibold text-ink-400">
          Looking for your session? Open Swap Sessions and re-enter the room code.
        </p>
      </div>
    </section>
  )
}
