// Navbar mobile — tampil di bawah layar pada perangkat kecil
// TODO: Fase 3 — tambahkan avatar user & link notifikasi dengan badge
import Link from 'next/link'
import { NAV_ITEMS } from '@/lib/constants/navigation'

export function MobileNavbar() {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 flex items-center justify-around border-t px-2 py-2 md:hidden"
      style={{
        backgroundColor: 'var(--color-surface)',
        borderColor: 'var(--color-border)',
      }}
    >
      {NAV_ITEMS.filter((i) => !i.adminOnly).map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="flex flex-col items-center gap-1 p-2 text-xs"
          style={{ color: 'var(--color-text-muted)' }}
        >
          <item.icon className="h-5 w-5" />
          {item.label}
        </Link>
      ))}
    </nav>
  )
}
