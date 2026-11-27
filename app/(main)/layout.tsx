import { Sidebar } from '@/components/layout/sidebar'
import { MobileNav } from '@/components/layout/mobile-nav'
import { createClient } from '@/lib/supabase/server'

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  let currentUserUsername: string | null = null

  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('username')
      .eq('id', user.id)
      .maybeSingle()

    currentUserUsername = profile?.username || null
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar kiri — fixed pada desktop */}
      <Sidebar currentUserUsername={currentUserUsername} />

      {/* Area konten utama dengan padding bawah khusus mobile agar tidak tertutup nav */}
      <main className="flex-1 md:ml-64">
        <div className="mx-auto max-w-2xl px-4 py-6 pb-20 md:pb-0">{children}</div>
      </main>

      {/* Mobile Navigation bar — fixed pada mobile */}
      <MobileNav />
    </div>
  )
}
