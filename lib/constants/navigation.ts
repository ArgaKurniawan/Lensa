import { Home, Compass, Bell, User, ShieldCheck } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export interface NavItem {
  label: string
  href: string
  icon: LucideIcon
  adminOnly?: boolean
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'Feed', href: '/feed', icon: Home },
  { label: 'Jelajahi', href: '/explore', icon: Compass },
  { label: 'Notifikasi', href: '/notifications', icon: Bell },
  { label: 'Profil', href: '/profile', icon: User },
  { label: 'Admin', href: '/admin/reports', icon: ShieldCheck, adminOnly: true },
]
