import {
  ArrowLeftRight,
  BookOpen,
  Coins,
  LayoutDashboard,
  Menu,
  RotateCcw,
  Sparkles,
  X,
} from 'lucide-react'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useDemo } from '../context/DemoStateContext'
import { useToast } from '../context/ToastContext'
import { currentUser, guideNavItem, navItems } from '../data/mockData'
import { cn } from '../lib/cn'
import { Avatar } from './ui/Avatar'

type LayoutProps = {
  children: ReactNode
}

const CURRENT_YEAR = new Date().getFullYear()

function Brand({ size = 'md' }: { size?: 'sm' | 'md' }) {
  const markClass = size === 'md' ? 'h-10 w-10 rounded-[14px]' : 'h-8 w-8 rounded-[11px]'

  return (
    <span className="flex items-center gap-2.5">
      <span
        className={cn(
          'flex items-center justify-center bg-brand-600 text-white shadow-lg shadow-brand-600/25',
          markClass,
        )}
      >
        <ArrowLeftRight size={size === 'md' ? 20 : 16} strokeWidth={2.5} />
      </span>
      <span
        className={cn(
          'font-extrabold tracking-[-0.045em] text-ink-900',
          size === 'md' ? 'text-lg sm:text-xl' : 'text-sm',
        )}
      >
        Skill<span className="text-brand-600">Proof</span>
      </span>
    </span>
  )
}

export default function Layout({ children }: LayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const { pathname } = useLocation()
  const { credits, resetDemo } = useDemo()
  const { pushToast } = useToast()
  const profileRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMobileOpen(false)
    setProfileOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!profileOpen) return

    const handlePointerDown = (event: PointerEvent) => {
      if (!profileRef.current?.contains(event.target as Node)) {
        setProfileOpen(false)
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)
    return () => document.removeEventListener('pointerdown', handlePointerDown)
  }, [profileOpen])

  const handleReset = () => {
    resetDemo()
    setProfileOpen(false)
    setMobileOpen(false)
    pushToast('Demo data reset to the starting seed.', 'info')
  }

  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <header className="sticky top-0 z-50 border-b border-brand-100/80 bg-white/85 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-4 sm:px-8">
          <Link
            to="/"
            className="group shrink-0 transition-transform duration-200 hover:-rotate-1"
            aria-label="SkillProof home"
          >
            <Brand />
          </Link>

          <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Main navigation">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  cn(
                    'rounded-full px-3.5 py-2 text-[13px] font-bold transition-colors',
                    isActive
                      ? 'bg-brand-50 text-brand-700'
                      : 'text-ink-600 hover:bg-brand-50/70 hover:text-brand-700',
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-2.5">
            <Link
              to={guideNavItem.to}
              title="AI Guide"
              aria-label="Open AI Guide"
              className="hidden h-10 w-10 items-center justify-center rounded-full border border-brand-100 bg-white text-brand-600 transition-colors hover:border-brand-200 hover:bg-brand-50 sm:inline-flex"
            >
              <Sparkles size={17} />
            </Link>

            <Link
              to="/dashboard"
              className="inline-flex items-center gap-1.5 rounded-full border border-brand-200/80 bg-brand-50 px-2.5 py-2 text-[11px] font-extrabold text-brand-700 transition-colors hover:bg-brand-100 sm:px-3 sm:text-xs"
              aria-label={`${credits} demo credits. Open dashboard`}
            >
              <Coins size={14} strokeWidth={2.4} />
              <span>{credits} credits</span>
            </Link>

            <div className="relative" ref={profileRef}>
              <button
                type="button"
                onClick={() => setProfileOpen((open) => !open)}
                aria-expanded={profileOpen}
                aria-haspopup="menu"
                aria-label="Open profile menu"
                className="group flex items-center rounded-full transition-transform hover:-translate-y-0.5"
              >
                <Avatar
                  initials={currentUser.initials}
                  name={currentUser.name}
                  tone="amber"
                  size="md"
                  className="ring-2 ring-white shadow-md"
                />
                <span
                  className="absolute -bottom-0.5 right-0 h-3 w-3 rounded-full border-2 border-white bg-emerald-500"
                  aria-hidden="true"
                />
              </button>

              {profileOpen && (
                <div
                  role="menu"
                  aria-label="Profile menu"
                  className="absolute right-0 top-[calc(100%+0.65rem)] w-72 overflow-hidden rounded-2xl border border-line bg-white p-2 shadow-lift"
                >
                  <div className="flex items-center gap-3 rounded-xl bg-canvas p-3">
                    <Avatar
                      initials={currentUser.initials}
                      name={currentUser.name}
                      tone="amber"
                      size="lg"
                    />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-extrabold text-ink-900">
                        {currentUser.name}
                      </p>
                      <p className="truncate text-[11px] text-ink-600">
                        {currentUser.headline}
                      </p>
                      <span className="mt-1 inline-block text-[9px] font-extrabold uppercase tracking-[0.14em] text-brand-600">
                        Demo account
                      </span>
                    </div>
                  </div>

                  <div className="mt-1.5 flex flex-col">
                    <Link
                      to="/dashboard"
                      role="menuitem"
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-bold text-ink-700 transition-colors hover:bg-brand-50 hover:text-brand-700"
                    >
                      <LayoutDashboard size={15} /> Dashboard
                    </Link>
                    <Link
                      to="/learn"
                      role="menuitem"
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-bold text-ink-700 transition-colors hover:bg-brand-50 hover:text-brand-700"
                    >
                      <BookOpen size={15} /> Learning modules
                    </Link>
                    <Link
                      to="/guide"
                      role="menuitem"
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-bold text-ink-700 transition-colors hover:bg-brand-50 hover:text-brand-700"
                    >
                      <Sparkles size={15} /> AI Guide
                    </Link>
                  </div>

                  <div className="mt-1 border-t border-line pt-1">
                    <button
                      type="button"
                      role="menuitem"
                      onClick={handleReset}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-xs font-bold text-ink-600 transition-colors hover:bg-red-50 hover:text-red-600"
                    >
                      <RotateCcw size={15} /> Reset demo data
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => setMobileOpen((open) => !open)}
              aria-expanded={mobileOpen}
              aria-controls="mobile-navigation"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-brand-100 bg-white text-ink-700 transition-colors hover:bg-brand-50 hover:text-brand-700 lg:hidden"
            >
              {mobileOpen ? <X size={19} /> : <Menu size={19} />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div
            id="mobile-navigation"
            className="border-t border-brand-100 bg-white px-4 pb-5 pt-4 shadow-xl shadow-ink-900/5 lg:hidden"
          >
            <nav className="flex flex-col gap-1" aria-label="Mobile navigation">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center justify-between rounded-2xl px-4 py-3 text-left text-sm font-bold transition-colors',
                      isActive
                        ? 'bg-brand-50 text-brand-700'
                        : 'text-ink-600 hover:bg-brand-50/70 hover:text-brand-700',
                    )
                  }
                >
                  {item.label}
                </NavLink>
              ))}
              <NavLink
                to={guideNavItem.to}
                className={({ isActive }) =>
                  cn(
                    'flex items-center justify-between rounded-2xl px-4 py-3 text-left text-sm font-bold transition-colors',
                    isActive
                      ? 'bg-brand-50 text-brand-700'
                      : 'text-ink-600 hover:bg-brand-50/70 hover:text-brand-700',
                  )
                }
              >
                <span className="flex items-center gap-2">
                  <Sparkles size={15} /> {guideNavItem.label}
                </span>
                <span className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-brand-500">
                  Prototype
                </span>
              </NavLink>
            </nav>

            <div className="mt-4 flex items-center gap-3 rounded-2xl border border-brand-100 bg-canvas p-3">
              <Avatar
                initials={currentUser.initials}
                name={currentUser.name}
                tone="amber"
                size="md"
              />
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-ink-900">
                  {currentUser.name}
                </p>
                <p className="truncate text-xs text-ink-600">{currentUser.role}</p>
              </div>
              <div className="ml-auto flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.12em] text-brand-700 shadow-sm">
                <Coins size={11} />
                {credits}
              </div>
            </div>

            <button
              type="button"
              onClick={handleReset}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl px-3 py-2.5 text-xs font-bold text-ink-500 transition-colors hover:bg-red-50 hover:text-red-600"
            >
              <RotateCcw size={14} /> Reset demo data
            </button>
          </div>
        )}
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-brand-100 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <div className="flex items-center gap-2.5">
            <Brand size="sm" />
            <span className="ml-1 hidden text-xs text-ink-400 sm:inline">
              No money. Just skills.
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-semibold text-ink-600">
            <Link to="/match" className="transition-colors hover:text-brand-700">
              Match Hub
            </Link>
            <Link to="/learn" className="transition-colors hover:text-brand-700">
              Learn
            </Link>
            <Link to="/guide" className="transition-colors hover:text-brand-700">
              AI Guide
            </Link>
            <span className="text-ink-400">
              College prototype · © {CURRENT_YEAR}
            </span>
          </div>
        </div>
      </footer>
    </div>
  )
}
