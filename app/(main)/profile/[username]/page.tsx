// TODO: Fase 4 — Profil publik user
type ProfilePageProps = {
  params: Promise<{ username: string }>
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { username } = await params

  return (
    <div>
      <h2 className="mb-6 text-xl font-semibold" style={{ color: 'var(--color-text-main)' }}>
        @{username}
      </h2>
      <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
        Halaman Profil — coming soon.
      </p>
    </div>
  )
}
