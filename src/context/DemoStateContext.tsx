import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from 'react'
import {
  currentUser,
  initialCompletedLessons,
} from '../data/mockData'
import type { DemoSession } from '../types'

type DemoState = {
  credits: number
  completedLessons: Record<string, string[]>
  sessions: DemoSession[]
}

type DemoAction =
  | { type: 'COMPLETE_LESSON'; moduleId: string; lessonId: string }
  | { type: 'ADD_SESSION'; session: DemoSession }
  | { type: 'RATE_SESSION'; roomId: string; rating: number }
  | { type: 'RESET' }

type DemoContextValue = DemoState & {
  completeLesson: (moduleId: string, lessonId: string) => void
  addSession: (session: DemoSession) => void
  rateSession: (roomId: string, rating: number) => void
  resetDemo: () => void
}

const STORAGE_KEY = 'skillproof.demo.v1'

const seedState: DemoState = {
  credits: currentUser.credits,
  completedLessons: initialCompletedLessons,
  sessions: [],
}

function isValidState(value: unknown): value is DemoState {
  if (!value || typeof value !== 'object') return false
  const candidate = value as Partial<DemoState>
  return (
    typeof candidate.credits === 'number' &&
    typeof candidate.completedLessons === 'object' &&
    candidate.completedLessons !== null &&
    Array.isArray(candidate.sessions)
  )
}

function loadState(): DemoState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return seedState
    const parsed: unknown = JSON.parse(raw)
    return isValidState(parsed) ? parsed : seedState
  } catch {
    return seedState
  }
}

function demoReducer(state: DemoState, action: DemoAction): DemoState {
  switch (action.type) {
    case 'COMPLETE_LESSON': {
      const completed = state.completedLessons[action.moduleId] ?? []
      if (completed.includes(action.lessonId)) return state

      return {
        ...state,
        credits: state.credits + 1,
        completedLessons: {
          ...state.completedLessons,
          [action.moduleId]: [...completed, action.lessonId],
        },
      }
    }
    case 'ADD_SESSION': {
      if (state.sessions.some((session) => session.roomId === action.session.roomId)) {
        return state
      }

      return {
        ...state,
        credits: state.credits + action.session.creditsEarned,
        sessions: [action.session, ...state.sessions],
      }
    }
    case 'RATE_SESSION': {
      return {
        ...state,
        sessions: state.sessions.map((session) =>
          session.roomId === action.roomId
            ? { ...session, rating: action.rating }
            : session,
        ),
      }
    }
    case 'RESET':
      return seedState
    default:
      return state
  }
}

const DemoContext = createContext<DemoContextValue | null>(null)

export function DemoStateProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(demoReducer, undefined, loadState)

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      // Storage can be unavailable in private browsing; the demo still works in memory.
    }
  }, [state])

  const completeLesson = useCallback((moduleId: string, lessonId: string) => {
    dispatch({ type: 'COMPLETE_LESSON', moduleId, lessonId })
  }, [])

  const addSession = useCallback((session: DemoSession) => {
    dispatch({ type: 'ADD_SESSION', session })
  }, [])

  const rateSession = useCallback((roomId: string, rating: number) => {
    dispatch({ type: 'RATE_SESSION', roomId, rating })
  }, [])

  const resetDemo = useCallback(() => {
    dispatch({ type: 'RESET' })
  }, [])

  const value = useMemo<DemoContextValue>(
    () => ({
      ...state,
      completeLesson,
      addSession,
      rateSession,
      resetDemo,
    }),
    [state, completeLesson, addSession, rateSession, resetDemo],
  )

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>
}

export function useDemo() {
  const context = useContext(DemoContext)
  if (!context) {
    throw new Error('useDemo must be used inside DemoStateProvider')
  }
  return context
}
