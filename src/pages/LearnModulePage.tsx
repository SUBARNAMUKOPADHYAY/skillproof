import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  BookX,
  Check,
  CheckCircle2,
  Clock3,
  Coins,
  Sparkles,
  Video,
} from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import {
  moduleIconToneClasses,
  moduleIcons,
} from '../components/learn/moduleVisuals'
import { Badge } from '../components/ui/Badge'
import { Button, buttonClasses } from '../components/ui/Button'
import { ProgressBar } from '../components/ui/ProgressBar'
import { ProgressRing } from '../components/ui/ProgressRing'
import { useDemo } from '../context/DemoStateContext'
import { useToast } from '../context/ToastContext'
import { modules } from '../data/mockData'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { cn } from '../lib/cn'
import { formatDuration } from '../lib/format'

export default function LearnModulePage() {
  const { moduleId } = useParams()
  const module = modules.find((candidate) => candidate.id === moduleId)

  useDocumentTitle(module?.title ?? 'Module not found')

  const { completedLessons, completeLesson } = useDemo()
  const { pushToast } = useToast()

  if (!module) {
    return (
      <section className="mx-auto flex max-w-2xl flex-col items-center px-5 py-20 text-center sm:px-8">
        <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
          <BookX size={28} />
        </span>
        <h1 className="mt-5 text-2xl font-extrabold tracking-[-0.03em] text-ink-900">
          This module is not in the demo catalog
        </h1>
        <p className="mt-2 max-w-md text-sm leading-6 text-ink-600">
          The link may be outdated. Head back to the learning catalog and pick one
          of the six mock modules.
        </p>
        <Link to="/learn" className={buttonClasses('primary', 'md', 'mt-5')}>
          <ArrowLeft size={14} /> Back to modules
        </Link>
      </section>
    )
  }

  const Icon = moduleIcons[module.icon]
  const completed = completedLessons[module.id] ?? []
  const progress = Math.round((completed.length / module.lessons.length) * 100)
  const currentIndex = modules.findIndex((candidate) => candidate.id === module.id)
  const nextModule = modules[(currentIndex + 1) % modules.length]
  const isModuleComplete = completed.length === module.lessons.length

  const handleComplete = (lessonId: string, lessonTitle: string) => {
    if (completed.includes(lessonId)) return

    completeLesson(module.id, lessonId)
    const willCompleteModule = completed.length + 1 === module.lessons.length
    pushToast(
      willCompleteModule
        ? 'Module complete! Every lesson is checked off.'
        : `“${lessonTitle}” completed. +1 demo credit.`,
    )
  }

  return (
    <>
      <section className="relative isolate overflow-hidden border-b border-brand-100/80 bg-white">
        <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
          <div className="absolute -left-44 -top-44 h-96 w-96 rounded-full bg-brand-100/60 blur-3xl" />
          <div className="absolute -right-24 top-0 h-80 w-80 rounded-full bg-[#f8ecd3]/60 blur-3xl" />
        </div>

        <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-10">
          <Link
            to="/learn"
            className="inline-flex items-center gap-1.5 text-[11px] font-extrabold text-ink-500 transition-colors hover:text-brand-700"
          >
            <ArrowLeft size={13} /> All learning modules
          </Link>

          <div className="mt-5 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={cn(
                    'flex h-14 w-14 items-center justify-center rounded-2xl',
                    moduleIconToneClasses[module.accent],
                  )}
                >
                  <Icon size={26} />
                </span>
                <Badge tone="teal">{module.category}</Badge>
                <Badge tone="neutral">{module.level}</Badge>
              </div>
              <h1 className="mt-4 text-3xl font-extrabold tracking-[-0.045em] text-ink-900 sm:text-4xl">
                {module.title}
              </h1>
              <p className="mt-2 text-sm leading-6 text-ink-600">
                {module.description}
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] font-semibold text-ink-500">
                <span className="inline-flex items-center gap-1.5">
                  <Clock3 size={13} className="text-brand-600" />
                  {formatDuration(module.durationMinutes)}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <BookOpen size={13} className="text-brand-600" />
                  {module.lessons.length} lessons
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Coins size={13} className="text-brand-600" />1 demo credit per
                  lesson
                </span>
              </div>
            </div>

            <div className="w-full shrink-0 rounded-[1.5rem] border border-line bg-white p-4 shadow-sm lg:w-64">
              <div className="flex items-center gap-3.5">
                <ProgressRing value={progress} size={64} strokeWidth={6}>
                  <span className="text-xs font-extrabold text-ink-900">
                    {progress}%
                  </span>
                </ProgressRing>
                <div>
                  <p className="text-[9px] font-extrabold uppercase tracking-[0.12em] text-brand-600">
                    Module progress
                  </p>
                  <p className="mt-1 text-xs font-extrabold text-ink-900">
                    {completed.length} of {module.lessons.length} lessons
                  </p>
                  <p className="mt-0.5 text-[9px] text-ink-400">
                    Saved in this browser
                  </p>
                </div>
              </div>
              <ProgressBar
                value={progress}
                label={`${module.title} progress`}
                className="mt-3"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-10">
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-start">
          <div>
            <div className="flex flex-wrap items-end justify-between gap-2">
              <div>
                <p className="text-[9px] font-extrabold uppercase tracking-[0.16em] text-brand-600">
                  Module outline
                </p>
                <h2 className="mt-1 text-xl font-extrabold tracking-[-0.03em] text-ink-900">
                  Work through it at your pace
                </h2>
              </div>
              <p className="text-[10px] font-semibold text-ink-400">
                {completed.length}/{module.lessons.length} complete
              </p>
            </div>

            <div className="mt-4 space-y-3">
              {module.lessons.map((lesson, index) => {
                const isComplete = completed.includes(lesson.id)

                return (
                  <article
                    key={lesson.id}
                    className={cn(
                      'overflow-hidden rounded-[1.35rem] border transition-colors',
                      isComplete
                        ? 'border-brand-200 bg-brand-50/40'
                        : 'border-line bg-white',
                    )}
                  >
                    <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-start sm:p-5">
                      <span
                        className={cn(
                          'flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-[11px] font-extrabold',
                          isComplete
                            ? 'bg-brand-600 text-white'
                            : 'bg-canvas text-ink-500',
                        )}
                      >
                        {isComplete ? (
                          <Check size={15} strokeWidth={3} />
                        ) : (
                          String(index + 1).padStart(2, '0')
                        )}
                      </span>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                          <h3 className="text-[13px] font-extrabold text-ink-900">
                            {lesson.title}
                          </h3>
                          {isComplete && (
                            <Badge tone="success">
                              <CheckCircle2 size={9} /> Complete
                            </Badge>
                          )}
                        </div>
                        <p className="mt-1 text-[11px] leading-5 text-ink-600">
                          {lesson.description}
                        </p>
                        <p className="mt-1.5 inline-flex items-center gap-1 text-[9px] font-bold text-ink-400">
                          <Clock3 size={10} /> {lesson.durationMinutes} min
                        </p>
                      </div>

                      <Button
                        size="sm"
                        variant={isComplete ? 'secondary' : 'primary'}
                        disabled={isComplete}
                        onClick={() => handleComplete(lesson.id, lesson.title)}
                        className="shrink-0 self-start whitespace-nowrap"
                      >
                        {isComplete ? (
                          <>
                            <Check size={12} /> Done
                          </>
                        ) : (
                          'Mark complete'
                        )}
                      </Button>
                    </div>

                    <div className="border-t border-brand-100/70 bg-white/60 px-4 py-3.5 sm:px-5">
                      <p className="text-[8px] font-extrabold uppercase tracking-[0.14em] text-ink-400">
                        Key takeaways
                      </p>
                      <ul className="mt-2 grid gap-1.5 sm:grid-cols-3">
                        {lesson.takeaways.map((takeaway) => (
                          <li
                            key={takeaway}
                            className="flex gap-1.5 text-[10px] leading-4 text-ink-600"
                          >
                            <Check
                              size={11}
                              className="mt-0.5 shrink-0 text-brand-500"
                            />
                            {takeaway}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </article>
                )
              })}
            </div>

            <div className="mt-5 flex flex-col gap-3 rounded-[1.35rem] border border-line bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[9px] font-extrabold uppercase tracking-[0.12em] text-ink-400">
                  Next in the catalog
                </p>
                <p className="mt-1 text-xs font-extrabold text-ink-900">
                  {nextModule.title}
                </p>
              </div>
              <Link
                to={`/learn/${nextModule.id}`}
                className={buttonClasses('secondary', 'sm')}
              >
                Next module <ArrowRight size={13} />
              </Link>
            </div>
          </div>

          <aside className="space-y-4 lg:sticky lg:top-24">
            <div className="rounded-[1.5rem] border border-line bg-white p-5">
              <div className="flex items-center justify-between">
                <p className="text-[9px] font-extrabold uppercase tracking-[0.14em] text-brand-600">
                  Your progress
                </p>
                <span className="rounded-full bg-brand-50 px-2 py-1 text-[9px] font-extrabold text-brand-700">
                  {progress}%
                </span>
              </div>
              <div className="mt-4 flex items-center gap-3">
                <ProgressRing value={progress} size={58} strokeWidth={5}>
                  <span className="text-[10px] font-extrabold text-ink-900">
                    {completed.length}/{module.lessons.length}
                  </span>
                </ProgressRing>
                <div>
                  <p className="text-[11px] font-extrabold text-ink-900">
                    {isModuleComplete ? 'Module complete' : 'In progress'}
                  </p>
                  <p className="mt-0.5 text-[9px] leading-4 text-ink-500">
                    {isModuleComplete
                      ? 'You can revisit any lesson anytime.'
                      : 'Finish a lesson to earn +1 demo credit.'}
                  </p>
                </div>
              </div>
              <div className="mt-4 space-y-2 border-t border-line pt-3">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-ink-500">Credits from this module</span>
                  <span className="font-extrabold text-ink-900">
                    +{completed.length}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-ink-500">Lessons left</span>
                  <span className="font-extrabold text-ink-900">
                    {module.lessons.length - completed.length}
                  </span>
                </div>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[1.5rem] bg-ink-900 p-5 text-white">
              <div
                className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-brand-500/25 blur-2xl"
                aria-hidden="true"
              />
              <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500 text-ink-900">
                <Video size={16} />
              </span>
              <h2 className="relative mt-3 text-sm font-extrabold">
                Turn this into proof
              </h2>
              <p className="relative mt-1 text-[10px] leading-4 text-white/50">
                Practice what you learned with a real person. A 25-minute swap is
                enough to test one idea out loud.
              </p>
              <Link
                to="/match"
                className={buttonClasses('secondary', 'sm', 'relative mt-3 w-full')}
              >
                Find a practice swap <ArrowRight size={12} />
              </Link>
              <Link
                to="/guide"
                className="relative mt-2 flex w-full items-center justify-center gap-1.5 rounded-xl border border-white/15 bg-white/[0.04] px-3 py-2 text-[10px] font-bold text-white/70 transition-colors hover:bg-white/[0.08] hover:text-white"
              >
                <Sparkles size={11} /> Ask the guide
              </Link>
            </div>

            <div className="rounded-[1.5rem] border border-brand-100 bg-brand-50/60 p-4">
              <p className="flex items-center gap-1.5 text-[9px] font-extrabold uppercase tracking-[0.12em] text-brand-700">
                <Coins size={12} /> Prototype note
              </p>
              <p className="mt-2 text-[10px] leading-4 text-ink-600">
                Lesson content, durations, and credit rewards are placeholder data.
                Progress lives in localStorage for this demo.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </>
  )
}
