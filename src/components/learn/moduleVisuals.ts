import {
  Camera,
  Code2,
  Languages,
  PenTool,
  Presentation,
  Wallet,
  type LucideIcon,
} from 'lucide-react'
import type { ProgressTone } from '../ui/ProgressBar'
import type { LearnModuleAccent, LearnModuleIcon } from '../../types'

export const moduleIcons: Record<LearnModuleIcon, LucideIcon> = {
  figma: PenTool,
  languages: Languages,
  presentation: Presentation,
  code: Code2,
  camera: Camera,
  wallet: Wallet,
}

export const moduleIconToneClasses: Record<LearnModuleAccent, string> = {
  teal: 'bg-brand-50 text-brand-600',
  amber: 'bg-[#fff8e8] text-[#a06e09]',
  blue: 'bg-sky-50 text-sky-600',
  rose: 'bg-rose-50 text-rose-600',
  green: 'bg-emerald-50 text-emerald-600',
  slate: 'bg-slate-100 text-slate-600',
}

export const moduleProgressTones: Record<LearnModuleAccent, ProgressTone> = {
  teal: 'brand',
  amber: 'amber',
  blue: 'blue',
  rose: 'rose',
  green: 'success',
  slate: 'brand',
}
