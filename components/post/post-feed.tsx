import type { PostWithAuthor } from '@/types'
import { PostCard } from './post-card'

interface PostFeedProps {
  posts: PostWithAuthor[]
}

export function PostFeed({ posts }: PostFeedProps) {
  if (posts.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
          Belum ada postingan. Mulai ikuti fotografer lain!
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  )
}
