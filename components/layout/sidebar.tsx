'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ImagePlus } from 'lucide-react'
import { NAV_ITEMS } from '@/lib/constants/navigation'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface SidebarProps {
  currentUserUsername?: string | null
}

export function Sidebar({ currentUserUsername }: SidebarProps) {
  const pathname = usePathname()

  return (
    <aside
      className="fixed left-0 top-0 hidden h-screen w-64 flex-col justify-between border-r p-4 md:flex"
      style={{
        backgroundColor: 'var(--color-surface)',
        borderColor: 'var(--color-border)',
      }}
    >
      <div>
        {/* Logo */}
        <Link href="/feed" className="mb-8 block px-2">
          <span
            className="text-2xl font-bold font-display tracking-tight"
            style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-display)' }}
          >
            Lensa
          </span>
        </Link>

        {/* Navigation */}
        <nav className="flex flex-col gap-1">
          {NAV_ITEMS.map((item) => {
            // Jika menu profil, arahkan ke username user yang sedang login
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
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-[var(--color-primary-soft)] text-[var(--color-primary)] font-semibold'
                    : 'text-[var(--color-text-main)] hover:bg-[var(--color-surface-muted)]'
                )}
              >
                <item.icon
                  className={cn(
                    'h-5 w-5 shrink-0 transition-colors',
                    isActive
                      ? 'text-[var(--color-primary)]'
                      : 'text-[var(--color-text-muted)]'
                  )}
                />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Tombol Unggah Frame Baru */}
      <div className="pt-4">
        <Link href="/new" className="w-full">
          <Button variant="primary" size="md" className="w-full gap-2 shadow-xs">
            <ImagePlus className="h-4 w-4" />
            <span>Unggah Frame Baru</span>
          </Button>
        </Link>
      </div>
    </aside>
  )
}
