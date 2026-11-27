import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Heart, MessageCircle, Grid, Settings } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { FollowButton } from '@/components/user/follow-button'
import type { Profile } from '@/types'

export const dynamic = 'force-dynamic'

interface ProfilePageProps {
  params: Promise<{ username: string }>
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { username } = await params
  const supabase = await createClient()

  // 1. Ambil data user yang sedang login
  const {
    data: { user: currentUser },
  } = await supabase.auth.getUser()

  // 2. Query data profil berdasarkan username
  const { data: rawProfile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', username)
    .single()

  if (profileError || !rawProfile) {
    notFound()
  }

  const profile = rawProfile as Profile
  const isOwnProfile = Boolean(currentUser && currentUser.id === profile.id)

  // 3. Cek status follow jika melihat profil orang lain
  let isFollowing = false
  if (currentUser && !isOwnProfile) {
    const { data: followRecord } = await supabase
      .from('follows')
      .select('follower_id')
      .eq('follower_id', currentUser.id)
      .eq('following_id', profile.id)
      .maybeSingle()

    isFollowing = Boolean(followRecord)
  }

  // 4. Query semua postingan milik user ini (terbaru di atas)
  const { data: rawPosts, error: postsError } = await supabase
    .from('posts')
    .select('id, image_url, title, frame_info, film_stock, camera, like_count, comment_count, created_at')
    .eq('author_id', profile.id)
    .order('created_at', { ascending: false })

  if (postsError) {
    console.error('Error fetching user posts:', postsError)
  }

  const posts = rawPosts || []

  return (
    <div className="space-y-8 pb-20">
      {/* 1. Header Profil */}
      <header className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-8">
          {/* Avatar Besar */}
          {profile.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt={profile.display_name}
              className="h-20 w-20 rounded-full object-cover ring-2 ring-[var(--color-border)] sm:h-24 sm:w-24 shrink-0"
            />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[var(--color-primary-soft)] text-2xl font-bold text-[var(--color-primary)] ring-2 ring-[var(--color-border)] sm:h-24 sm:w-24 shrink-0">
              {profile.display_name.charAt(0).toUpperCase()}
            </div>
          )}

          {/* Info Utama & Tombol Aksi */}
          <div className="flex-1 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h1 className="font-display text-2xl font-bold tracking-tight text-[var(--color-text-main)] sm:text-3xl">
                  {profile.display_name}
                </h1>
                <p className="text-sm text-[var(--color-text-muted)] font-mono">
                  @{profile.username}
                </p>
              </div>

              {/* Tombol Aksi */}
              <div>
                {isOwnProfile ? (
                  <button
                    type="button"
                    className="flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface-muted)] px-5 py-2 text-sm font-semibold text-[var(--color-text-main)] transition-colors hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] active:scale-95"
                  >
                    <Settings className="h-4 w-4" />
                    <span>Edit Profil</span>
                  </button>
                ) : (
                  <FollowButton
                    targetUserId={profile.id}
                    initialIsFollowing={isFollowing}
                  />
                )}
              </div>
            </div>

            {/* Bio Fotografer */}
            {profile.bio && (
              <p className="max-w-xl text-sm leading-relaxed text-[var(--color-text-main)]">
                {profile.bio}
              </p>
            )}

            {/* Baris Statistik */}
            <div className="flex items-center gap-6 pt-2 border-t border-[var(--color-border)]/60 text-sm">
              <div>
                <span className="font-bold text-[var(--color-text-main)]">
                  {profile.post_count ?? posts.length}
                </span>{' '}
                <span className="text-[var(--color-text-muted)]">Frame</span>
              </div>
              <div>
                <span className="font-bold text-[var(--color-text-main)]">
                  {profile.follower_count ?? 0}
                </span>{' '}
                <span className="text-[var(--color-text-muted)]">Pengikut</span>
              </div>
              <div>
                <span className="font-bold text-[var(--color-text-main)]">
                  {profile.following_count ?? 0}
                </span>{' '}
                <span className="text-[var(--color-text-muted)]">Mengikuti</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 2. Galeri Postingan User */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 border-b border-[var(--color-border)] pb-3">
          <Grid className="h-4 w-4 text-[var(--color-primary)]" />
          <h2 className="font-sans text-sm font-bold tracking-wider text-[var(--color-text-main)] uppercase">
            Semua Frame ({posts.length})
          </h2>
        </div>

        {posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--color-border)] bg-[var(--color-surface)] py-16 px-6 text-center shadow-xs">
            <p className="font-sans text-base text-[var(--color-text-muted)]">
              Belum ada frame yang diunggah.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/feed#${post.id}`}
                className="group relative aspect-square overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-muted)] transition-all hover:shadow-md"
              >
                {/* Foto Post */}
                <img
                  src={post.image_url}
                  alt={post.title || 'Foto analog'}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />

                {/* Overlay film stock badge atas */}
                {post.film_stock && (
                  <div className="absolute left-2.5 top-2.5 rounded bg-black/60 px-2 py-0.5 font-mono text-[10px] font-medium text-amber-200 backdrop-blur-xs">
                    {post.film_stock}
                  </div>
                )}

                {/* Hover overlay dengan info Like & Komentar */}
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/55 opacity-0 transition-opacity duration-200 group-hover:opacity-100 p-3 text-center">
                  <p className="line-clamp-2 text-xs font-semibold text-white drop-shadow-sm font-display">
                    {post.title}
                  </p>
                  <div className="flex items-center gap-4 text-xs font-medium text-white/90">
                    <span className="flex items-center gap-1">
                      <Heart className="h-4 w-4 fill-white text-white" />
                      {post.like_count ?? 0}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="h-4 w-4 fill-white text-white" />
                      {post.comment_count ?? 0}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
