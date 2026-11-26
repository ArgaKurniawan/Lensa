import { createClient } from '@/lib/supabase/server'
import { PostCard } from '@/components/post/post-card'
import type { PostWithAuthor, PostAuthor, CommentWithAuthor } from '@/types'

export const dynamic = 'force-dynamic'

export default async function FeedPage() {
  const supabase = await createClient()

  // Ambil data user yang sedang login untuk mengecek status like
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let queryError: any = null
  let rawPosts: any[] = []

  // 1. Coba query utama dengan relasi author, tags, likes, dan comments(author)
  const primaryResult = await supabase
    .from('posts')
    .select(`
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
    `)
    .order('created_at', { ascending: false })

  if (!primaryResult.error && primaryResult.data) {
    rawPosts = primaryResult.data
  } else {
    queryError = primaryResult.error
    console.error('Query utama feed gagal:', primaryResult.error)

    // 2. Fallback: Coba tanpa post_tags jika terdapat kendala skema tags
    const fallbackResult = await supabase
      .from('posts')
      .select(`
        *,
        author:profiles!author_id (
          username,
          display_name,
          avatar_url
        ),
        likes (
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
      `)
      .order('created_at', { ascending: false })

    if (!fallbackResult.error && fallbackResult.data) {
      rawPosts = fallbackResult.data
      queryError = null
    } else {
      // 3. Fallback terakhir: Ambil posts, likes, dan comments dasar
      const basicResult = await supabase
        .from('posts')
        .select(`
          *,
          likes (
            user_id
          ),
          comments (
            id,
            author_id,
            body,
            created_at
          )
        `)
        .order('created_at', { ascending: false })

      if (!basicResult.error && basicResult.data) {
        // Ambil data profil untuk author postingan dan komentar
        const postAuthorIds = basicResult.data.map((p) => p.author_id)
        const commentAuthorIds = basicResult.data.flatMap((p) =>
          (p.comments || []).map((c: any) => c.author_id)
        )
        const allAuthorIds = Array.from(new Set([...postAuthorIds, ...commentAuthorIds]))

        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, username, display_name, avatar_url')
          .in('id', allAuthorIds)

        const profileMap = new Map((profiles || []).map((prof) => [prof.id, prof]))

        rawPosts = basicResult.data.map((p) => ({
          ...p,
          author: profileMap.get(p.author_id),
          comments: (p.comments || []).map((c: any) => ({
            ...c,
            author: profileMap.get(c.author_id),
          })),
        }))
        queryError = null
      } else {
        queryError = basicResult.error || fallbackResult.error || primaryResult.error
      }
    }
  }

  // Format data Supabase agar sesuai dengan interface PostWithAuthor
  const posts: PostWithAuthor[] = rawPosts.map((p: any) => {
    const authorData = Array.isArray(p.author) ? p.author[0] : p.author
    const author: PostAuthor = {
      username: authorData?.username || 'pengguna',
      display_name: authorData?.display_name || 'Pengguna Lensa',
      avatar_url: authorData?.avatar_url || null,
    }

    // Ekstraksi tags dari struktur relasi post_tags
    const tags: string[] = (p.post_tags || [])
      .map((pt: any) => {
        const tagObj = pt.tags || pt.tag
        return Array.isArray(tagObj) ? tagObj[0]?.name : tagObj?.name
      })
      .filter((name: any): name is string => Boolean(name))

    // Periksa apakah user saat ini sudah me-like postingan ini
    const hasLiked = user
      ? Array.isArray(p.likes) && p.likes.some((l: any) => l.user_id === user.id)
      : false

    // Format dan urutkan komentar ascending (terlama di atas)
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
      image_url: p.image_url,
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
      comments,
      author,
    }
  })

  return (
    <div className="space-y-6 pb-20">
      {/* Tampilkan banner error jika query database gagal */}
      {queryError && (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-5 text-sm text-red-600 dark:text-red-400">
          <p className="font-semibold">Gagal memuat feed dari database:</p>
          <p className="mt-1 font-mono text-xs">{queryError.message}</p>
          {queryError.hint && (
            <p className="mt-1 text-xs opacity-80">Hint: {queryError.hint}</p>
          )}
        </div>
      )}

      {posts.length === 0 && !queryError ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--color-border)] bg-[var(--color-surface)] py-16 px-6 text-center shadow-xs">
          <p className="font-sans text-base text-[var(--color-text-muted)]">
            Belum ada frame yang diunggah.
          </p>
        </div>
      ) : (
        posts.map((post) => <PostCard key={post.id} post={post} />)
      )}
    </div>
  )
}
