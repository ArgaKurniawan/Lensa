import { Sidebar } from '@/components/layout/sidebar'
import { MobileNavbar } from '@/components/layout/navbar'
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

      {/* Area konten utama */}
      <main className="flex-1 md:ml-64">
        <div className="mx-auto max-w-2xl px-4 py-6">{children}</div>
      </main>

      {/* Mobile Navbar — tampil di bawah layar pada perangkat kecil */}
      <MobileNavbar currentUserUsername={currentUserUsername} />
    </div>
  )
}
