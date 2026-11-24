export type AvatarTone = 'teal' | 'amber' | 'rose' | 'blue' | 'slate'

export type NavItem = {
  label: string
  to: string
}

export type MatchPerson = {
  name: string
  initials: string
  role: string
  teaches: string
  wants: string
  rating: number
  swaps: number
}

export type MatchPreview = {
  compatibility: number
  durationMinutes: number
  reason: string
  aisha: MatchPerson
  rohan: MatchPerson
}

export type HowItWorksStep = {
  step: string
  label: 'List' | 'Match' | 'Swap' | 'Build Proof'
  title: string
  description: string
  icon: 'list' | 'sparkles' | 'video' | 'proof'
}

export type MatchCategory =
  | 'Languages'
  | 'Design'
  | 'Code'
  | 'Music'
  | 'Photography'
  | 'Cooking'
  | 'Business'
  | 'Communication'
  | 'Data'
  | 'Games'

export type MatchAvailability = 'now' | 'week' | 'weekend'

export type Match = {
  id: string
  name: string
  initials: string
  tone: AvatarTone
  headline: string
  bio: string
  teaches: string[]
  wants: string[]
  category: MatchCategory
  rating: number
  swaps: number
  availability: MatchAvailability
  compatibility: number
  reason: string
  slots: string[]
}

export type Lesson = {
  id: string
  title: string
  durationMinutes: number
  description: string
  takeaways: string[]
}

export type LearnModuleIcon =
  | 'figma'
  | 'languages'
  | 'presentation'
  | 'code'
  | 'camera'
  | 'wallet'

export type LearnModuleAccent = 'teal' | 'amber' | 'blue' | 'rose' | 'green' | 'slate'

export type LearnModule = {
  id: string
  title: string
  description: string
  category: string
  level: 'Beginner' | 'Intermediate' | 'Advanced'
  icon: LearnModuleIcon
  accent: LearnModuleAccent
  durationMinutes: number
  lessons: Lesson[]
}

export type ChatAction = {
  label: string
  to: string
}

export type ChatMessage = {
  id: string
  role: 'assistant' | 'user'
  content: string
  action?: ChatAction
}

export type AiResponse = {
  keywords: string[]
  content: string
  action?: ChatAction
}

export type DemoSession = {
  roomId: string
  partnerName: string
  partnerInitials: string
  topic: string
  durationMinutes: number
  creditsEarned: number
  completedAt: string
  rating?: number
}

export type ActivityIcon = 'swap' | 'lesson' | 'match' | 'streak'

export type ActivityItem = {
  id: string
  icon: ActivityIcon
  title: string
  detail: string
  time: string
}

export type SkillProgress = {
  name: string
  role: 'Teaching' | 'Learning'
  level: number
  note: string
}

export type UpcomingSwap = {
  partnerName: string
  partnerInitials: string
  partnerTone: AvatarTone
  topic: string
  when: string
  durationMinutes: number
  roomId: string
  matchId: string
}
