'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Compass, PlusSquare, Bell, User } from 'lucide-react'
import { cn } from '@/lib/utils'

interface NavItem {
  label: string
  href: string
  icon: typeof Home
  isAction?: boolean
}

const MOBILE_NAV_ITEMS: NavItem[] = [
  { label: 'Beranda', href: '/feed', icon: Home },
  { label: 'Explore', href: '/explore', icon: Compass },
  { label: 'Tambah', href: '/new', icon: PlusSquare, isAction: true },
  { label: 'Notifikasi', href: '/notifications', icon: Bell },
  { label: 'Profil', href: '/profile', icon: User },
]

export function MobileNav() {
  const pathname = usePathname()

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t px-2 py-2 md:hidden"
      style={{
        backgroundColor: 'var(--color-surface)',
        borderColor: 'var(--color-border)',
      }}
    >
      {MOBILE_NAV_ITEMS.map((item) => {
        const isActive =
          item.href === '/feed'
            ? pathname === '/feed'
            : pathname.startsWith(item.href)

        // Tombol Tambah yang menonjol di tengah
        if (item.isAction) {
          return (
            <Link
              key={item.label}
              href={item.href}
              className="flex flex-col items-center justify-center -mt-5"
              aria-label="Unggah Frame Baru"
            >
              <div
                className="flex h-11 w-11 items-center justify-center rounded-xl text-white shadow-md transition-transform active:scale-95"
                style={{ backgroundColor: 'var(--color-primary)' }}
              >
                <PlusSquare className="h-6 w-6" />
              </div>
              <span
                className="mt-1 text-[10px] font-medium"
                style={{ color: 'var(--color-text-muted)' }}
              >
                {item.label}
              </span>
            </Link>
          )
        }

        return (
          <Link
            key={item.label}
            href={item.href}
            className={cn(
              'flex flex-col items-center gap-1 p-1.5 text-xs transition-colors',
              isActive
                ? 'font-semibold'
                : 'opacity-70 hover:opacity-100'
            )}
            style={{
              color: isActive ? 'var(--color-primary)' : 'var(--color-text-muted)',
            }}
          >
            <item.icon className="h-5 w-5" />
            <span className="text-[10px]">{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
