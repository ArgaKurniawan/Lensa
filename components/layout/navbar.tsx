'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { NAV_ITEMS } from '@/lib/constants/navigation'
import { cn } from '@/lib/utils'

interface MobileNavbarProps {
  currentUserUsername?: string | null
}

export function MobileNavbar({ currentUserUsername }: MobileNavbarProps) {
  const pathname = usePathname()

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around border-t px-2 py-2 md:hidden"
      style={{
        backgroundColor: 'var(--color-surface)',
        borderColor: 'var(--color-border)',
      }}
    >
      {NAV_ITEMS.filter((i) => !i.adminOnly).map((item) => {
        const href =
          item.href === '/profile' && currentUserUsername
            ? `/profile/${currentUserUsername}`
            : item.href

        const isActive = pathname === href

        return (
          <Link
            key={item.label}
            href={href}
            className={cn(
              'flex flex-col items-center gap-1 p-2 text-xs transition-colors',
              isActive
                ? 'text-[var(--color-primary)] font-semibold'
                : 'text-[var(--color-text-muted)]'
            )}
          >
            <item.icon className="h-5 w-5" />
            <span>{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
