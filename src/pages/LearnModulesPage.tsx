import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock3,
  Coins,
  Layers,
  Search,
  SearchX,
  Sparkles,
} from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Badge } from '../components/ui/Badge'
import { ProgressBar } from '../components/ui/ProgressBar'
import { ProgressRing } from '../components/ui/ProgressRing'
import { buttonClasses } from '../components/ui/Button'
import {
  moduleIconToneClasses,
  moduleIcons,
  moduleProgressTones,
} from '../components/learn/moduleVisuals'
import { useDemo } from '../context/DemoStateContext'
import { modules } from '../data/mockData'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { formatDuration } from '../lib/format'
import { cn } from '../lib/cn'

const categories = [
  'All',
  ...Array.from(new Set(modules.map((module) => module.category))),
]

export default function LearnModulesPage() {
  useDocumentTitle('Learning Modules')

  const { completedLessons } = useDemo()
  const [category, setCategory] = useState('All')
  const [query, setQuery] = useState('')

  const totalLessons = modules.reduce(
    (total, module) => total + module.lessons.length,
    0,
  )
  const completedCount = modules.reduce(
    (total, module) =>
      total + (completedLessons[module.id]?.length ?? 0),
    0,
  )
  const overallProgress = Math.round((completedCount / totalLessons) * 100)

  const normalizedQuery = query.trim().toLowerCase()
  const filteredModules = modules.filter((module) => {
    const inCategory = category === 'All' || module.category === category
    const matchesQuery =
      !normalizedQuery ||
      [module.title, module.description, module.category, module.level]
        .join(' ')
        .toLowerCase()
        .includes(normalizedQuery)
    return inCategory && matchesQuery
  })

  return (
    <>
      <section className="relative isolate overflow-hidden border-b border-brand-100/80 bg-white">
        <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
          <div className="absolute -left-44 -top-44 h-96 w-96 rounded-full bg-brand-100/60 blur-3xl" />
          <div className="absolute -right-20 top-10 h-80 w-80 rounded-full bg-[#f8ecd3]/70 blur-3xl" />
          <div className="dot-grid absolute inset-x-0 top-0 h-48 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
        </div>

        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-10 sm:px-8 lg:grid-cols-[1fr_21rem] lg:items-center lg:py-12">
          <div>
            <Badge tone="teal" className="bg-white/80 py-1.5">
              <BookOpen size={12} /> Learn Modules
            </Badge>
            <h1 className="mt-4 max-w-2xl text-balance text-3xl font-extrabold leading-[1.06] tracking-[-0.05em] text-ink-900 sm:text-4xl lg:text-[2.8rem]">
              Small lessons. Real swap energy.
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-ink-600">
              Prepare for a swap with focused modules, mark a lesson complete, and
              turn what you learn into something you can teach back.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.08em] text-ink-600">
                <Layers size={12} className="text-brand-600" />
                {modules.length} modules
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.08em] text-ink-600">
                <BookOpen size={12} className="text-brand-600" />
                {totalLessons} lessons
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.08em] text-ink-600">
                <Coins size={12} className="text-brand-600" />
                +1 credit per lesson
              </span>
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-line bg-white p-5 shadow-soft">
            <div className="flex items-center gap-4">
              <ProgressRing
                value={overallProgress}
                size={84}
                strokeWidth={7}
                className="shrink-0"
              >
                <div className="text-center">
                  <span className="block text-xl font-extrabold leading-none tracking-[-0.04em] text-ink-900">
                    {overallProgress}%
                  </span>
                  <span className="text-[8px] font-extrabold uppercase tracking-[0.1em] text-ink-400">
                    Overall
                  </span>
                </div>
              </ProgressRing>
              <div>
                <p className="text-[9px] font-extrabold uppercase tracking-[0.14em] text-brand-600">
                  Your learning
                </p>
                <p className="mt-1 text-sm font-extrabold text-ink-900">
                  {completedCount} of {totalLessons} lessons done
                </p>
                <p className="mt-1 text-[10px] leading-4 text-ink-500">
                  Progress is saved locally. The catalog content is dummy data.
                </p>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between rounded-xl bg-canvas px-3 py-2.5">
              <span className="flex items-center gap-1.5 text-[10px] font-semibold text-ink-500">
                <Sparkles size={12} className="text-brand-500" />
                Need a learning match?
              </span>
              <Link
                to="/guide"
                className="inline-flex items-center gap-1 text-[10px] font-extrabold text-brand-700 hover:text-brand-800"
              >
                Ask guide <ArrowRight size={11} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-10">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative w-full sm:max-w-xs">
              <label htmlFor="module-search" className="sr-only">
                Search learning modules
              </label>
              <Search
                size={16}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400"
              />
              <input
                id="module-search"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search modules..."
                className="h-11 w-full rounded-xl border border-line bg-white pl-10 pr-4 text-xs font-semibold text-ink-900 placeholder:font-medium placeholder:text-ink-400 focus:border-brand-300"
              />
            </div>
            <div className="flex gap-1.5 overflow-x-auto pb-0.5 no-scrollbar">
              {categories.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setCategory(item)}
                  aria-pressed={category === item}
                  className={cn(
                    'shrink-0 rounded-full px-3 py-1.5 text-[11px] font-bold transition-colors',
                    category === item
                      ? 'bg-brand-600 text-white shadow-sm'
                      : 'border border-line bg-white text-ink-600 hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700',
                  )}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
          <p className="text-[10px] font-semibold text-ink-400">
            {filteredModules.length}{' '}
            {filteredModules.length === 1 ? 'module' : 'modules'} shown
          </p>
        </div>

        {filteredModules.length > 0 ? (
          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredModules.map((module) => {
              const Icon = moduleIcons[module.icon]
              const completed = completedLessons[module.id]?.length ?? 0
              const progress = Math.round(
                (completed / module.lessons.length) * 100,
              )
              const isComplete = progress === 100

              return (
                <article
                  key={module.id}
                  className="group flex h-full flex-col rounded-[1.5rem] border border-line bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-lift"
                >
                  <div className="flex items-start justify-between gap-3">
                    <span
                      className={cn(
                        'flex h-12 w-12 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:-rotate-3',
                        moduleIconToneClasses[module.accent],
                      )}
                    >
                      <Icon size={22} />
                    </span>
                    <div className="flex flex-wrap justify-end gap-1.5">
                      <Badge tone="neutral">{module.level}</Badge>
                      {isComplete && (
                        <Badge tone="success">
                          <CheckCircle2 size={10} /> Done
                        </Badge>
                      )}
                    </div>
                  </div>

                  <p className="mt-4 text-[9px] font-extrabold uppercase tracking-[0.14em] text-brand-600">
                    {module.category}
                  </p>
                  <h2 className="mt-1 text-lg font-extrabold tracking-[-0.03em] text-ink-900">
                    {module.title}
                  </h2>
                  <p className="mt-2 line-clamp-3 text-[11px] leading-5 text-ink-600">
                    {module.description}
                  </p>

                  <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[10px] font-semibold text-ink-400">
                    <span className="inline-flex items-center gap-1">
                      <Clock3 size={12} /> {formatDuration(module.durationMinutes)}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <BookOpen size={12} /> {module.lessons.length} lessons
                    </span>
                  </div>

                  <div className="mt-auto pt-5">
                    <div className="flex items-center justify-between text-[9px] font-bold text-ink-400">
                      <span>
                        {completed} / {module.lessons.length} complete
                      </span>
                      <span className="text-ink-700">{progress}%</span>
                    </div>
                    <ProgressBar
                      value={progress}
                      tone={moduleProgressTones[module.accent]}
                      label={`${module.title} progress`}
                      className="mt-2"
                    />
                    <Link
                      to={`/learn/${module.id}`}
                      className={buttonClasses(
                        'secondary',
                        'sm',
                        'mt-4 w-full group-hover:border-brand-300 group-hover:bg-brand-50 group-hover:text-brand-700',
                      )}
                    >
                      {isComplete
                        ? 'Review module'
                        : progress > 0
                          ? 'Continue module'
                          : 'Start module'}
                      <ArrowRight size={13} />
                    </Link>
                  </div>
                </article>
              )
            })}
          </div>
        ) : (
          <div className="mt-5 flex flex-col items-center justify-center rounded-[1.75rem] border border-dashed border-brand-200 bg-white px-6 py-16 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
              <SearchX size={24} />
            </span>
            <h2 className="mt-4 text-lg font-extrabold tracking-[-0.02em] text-ink-900">
              No modules found
            </h2>
            <p className="mt-1.5 max-w-sm text-xs leading-5 text-ink-600">
              Try a different category or a shorter search. All content here is
              mock learning material.
            </p>
            <button
              type="button"
              onClick={() => {
                setQuery('')
                setCategory('All')
              }}
              className={buttonClasses('primary', 'md', 'mt-5')}
            >
              Clear filters
            </button>
          </div>
        )}

        <p className="mt-8 flex items-center justify-center gap-1.5 text-center text-[10px] font-semibold text-ink-400">
          <Sparkles size={11} className="text-brand-500" />
          Lesson content and credit rewards are placeholder data for the prototype.
        </p>
      </section>
    </>
  )
}
