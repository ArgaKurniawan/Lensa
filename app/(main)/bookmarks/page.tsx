import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { PostCard } from '@/components/post/post-card'
import type { PostWithAuthor, PostAuthor, CommentWithAuthor } from '@/types'

export const dynamic = 'force-dynamic'

export default async function BookmarksPage() {
  const supabase = await createClient()

  // 1. Cek autentikasi user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // 2. Query data postingan yang di-bookmark oleh user ini
  const { data: rawBookmarks, error } = await supabase
    .from('bookmarks')
    .select(`
      created_at,
      post:posts (
        *,
        author:profiles!author_id (
          username,
          display_name,
          avatar_url
        ),
        post_tags (
          tags (
            name
          )
        ),
        likes (
          user_id
        ),
        bookmarks (
          user_id
        ),
        comments (
          id,
          body,
          created_at,
          author:profiles!author_id (
            username,
            display_name,
            avatar_url
          )
        )
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching bookmarked posts:', error)
  }

  // 3. Format data postingan tersimpan
  const posts: PostWithAuthor[] = (rawBookmarks || [])
    .map((item: any) => item.post)
    .filter((p: any) => Boolean(p && p.id))
    .map((p: any) => {
      const authorData = Array.isArray(p.author) ? p.author[0] : p.author
      const author: PostAuthor = {
        username: authorData?.username || 'pengguna',
        display_name: authorData?.display_name || 'Pengguna Lensa',
        avatar_url: authorData?.avatar_url || null,
      }

      const tags: string[] = (p.post_tags || [])
        .map((pt: any) => {
          const tagObj = pt.tags || pt.tag
          return Array.isArray(tagObj) ? tagObj[0]?.name : tagObj?.name
        })
        .filter((name: any): name is string => Boolean(name))

      const hasLiked = Array.isArray(p.likes) && p.likes.some((l: any) => l.user_id === user.id)

      const comments: CommentWithAuthor[] = (p.comments || [])
        .map((c: any) => {
          const commentAuthorData = Array.isArray(c.author) ? c.author[0] : c.author
          return {
            id: c.id,
            body: c.body,
            created_at: c.created_at,
            author: {
              username: commentAuthorData?.username || 'pengguna',
              display_name: commentAuthorData?.display_name || 'Pengguna Lensa',
              avatar_url: commentAuthorData?.avatar_url || null,
            },
          }
        })
        .sort(
          (a: CommentWithAuthor, b: CommentWithAuthor) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        )

      return {
        id: p.id,
        author_id: p.author_id,
        image_url: p.image_url,
        image_path: p.image_path || '',
        frame_info: p.frame_info || 'FRAME • 35MM',
        film_stock: p.film_stock || '',
        camera: p.camera || '',
        lens: p.lens || '',
        exposure: p.exposure || '',
        title: p.title || 'Tanpa Judul',
        caption: p.caption || '',
        tags,
        location: p.location || '',
        created_at: p.created_at,
        like_count: p.like_count ?? 0,
        comment_count: p.comment_count ?? 0,
        has_liked: hasLiked,
        is_bookmarked: true,
        comments,
        author,
      }
    })

  return (
    <div className="space-y-6 pb-20">
      <header className="mb-2">
        <h1 className="font-display text-2xl font-bold tracking-tight text-[var(--color-text-main)] sm:text-3xl">
          Frame Tersimpan
        </h1>
        <p className="mt-1 text-xs text-[var(--color-text-muted)] sm:text-sm">
          Koleksi frame fotografi analog yang kamu simpan untuk inspirasi.
        </p>
      </header>

      {error && (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-5 text-sm text-red-600 dark:text-red-400">
          <p className="font-semibold">Gagal memuat frame tersimpan:</p>
          <p className="mt-1 font-mono text-xs">{error.message}</p>
        </div>
      )}

      {posts.length === 0 && !error ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--color-border)] bg-[var(--color-surface)] py-16 px-6 text-center shadow-xs">
          <p className="font-sans text-base text-[var(--color-text-muted)]">
            Belum ada frame yang disimpan.
          </p>
          <p className="mt-1 text-xs text-[var(--color-text-muted)] opacity-80">
            Klik ikon bookmark pada frame yang kamu sukai di Feed untuk menyimpannya ke sini.
          </p>
        </div>
      ) : (
        posts.map((post) => (
          <PostCard key={post.id} post={post} currentUserId={user.id} />
        ))
      )}
    </div>
  )
}
