import Link from 'next/link'
import { ImagePlus } from 'lucide-react'
import { NAV_ITEMS } from '@/lib/constants/navigation'
import { Button } from '@/components/ui/button'

export function Sidebar() {
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
            className="text-2xl font-display"
            style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-display)' }}
          >
            Lensa
          </span>
        </Link>

        {/* Navigation */}
        <nav className="flex flex-col gap-1">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-[var(--color-surface-muted)]"
              style={{ color: 'var(--color-text-main)' }}
            >
              <item.icon className="h-5 w-5 shrink-0" style={{ color: 'var(--color-text-muted)' }} />
              {item.label}
            </Link>
          ))}
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
