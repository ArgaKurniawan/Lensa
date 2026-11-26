import { Sidebar } from '@/components/layout/sidebar'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar kiri — fixed pada desktop */}
      <Sidebar />

      {/* Area konten utama */}
      <main className="flex-1 md:ml-64">
        <div className="mx-auto max-w-2xl px-4 py-6">{children}</div>
      </main>
    </div>
  )
}
