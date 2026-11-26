import {
  MessageCircle,
  Trash2,
  Bookmark,
  Share2,
  MapPin,
  Camera,
  Aperture,
  MoreHorizontal,
} from 'lucide-react'
import type { PostWithAuthor } from '@/types'
import { timeAgo } from '@/lib/utils'
import { LikeButton } from '@/components/post/like-button'
import { CommentSection } from '@/components/post/comment-section'

interface PostCardProps {
  post: PostWithAuthor
}

export function PostCard({ post }: PostCardProps) {
  return (
    <article className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm transition-shadow hover:shadow-md">
      {/* 1. Header */}
      <header className="flex items-center justify-between p-4 sm:px-6">
        <div className="flex items-center gap-3">
          {/* Avatar User */}
          {post.author.avatar_url ? (
            <img
              src={post.author.avatar_url}
              alt={post.author.display_name}
              className="h-10 w-10 rounded-full object-cover ring-1 ring-[var(--color-border)]"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-primary-soft)] text-sm font-bold text-[var(--color-primary)]">
              {post.author.display_name.charAt(0).toUpperCase()}
            </div>
          )}

          {/* Info Author & Meta */}
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-sans text-sm font-semibold text-[var(--color-text-main)]">
                {post.author.display_name}
              </span>
              <span className="text-xs text-[var(--color-text-muted)]">
                @{post.author.username}
              </span>
              <span className="text-xs text-[var(--color-text-muted)]">•</span>
              <span className="text-xs text-[var(--color-text-muted)]">
                {timeAgo(post.created_at)}
              </span>
            </div>

            {/* Lokasi */}
            {post.location && (
              <div className="mt-0.5 flex items-center gap-1 text-xs text-[var(--color-text-muted)]">
                <MapPin className="h-3.5 w-3.5 text-[var(--color-primary)]" />
                <span>{post.location}</span>
              </div>
            )}
          </div>
        </div>

        {/* Tombol Opsi */}
        <button
          type="button"
          aria-label="Opsi postingan"
          className="rounded-lg p-1.5 text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-surface-muted)] hover:text-[var(--color-text-main)]"
        >
          <MoreHorizontal className="h-5 w-5" />
        </button>
      </header>

      {/* 2. Gambar (Rasio 4:3) dengan Tag <img> Biasa & Overlay Gradien */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[var(--color-surface-muted)]">
        <img
          src={post.image_url}
          alt={post.title}
          className="h-full w-full object-cover transition-transform duration-500 hover:scale-[1.02]"
          loading="lazy"
        />

        {/* Overlay Gradien Hitam di Atas Gambar */}
        <div className="absolute inset-x-0 top-0 flex items-center justify-between bg-gradient-to-b from-black/75 via-black/35 to-transparent px-4 py-3 font-mono text-[11px] tracking-wider text-white/95 uppercase">
          <span className="drop-shadow-sm">{post.frame_info || 'FRAME • 35MM'}</span>
          <span className="rounded bg-black/40 px-1.5 py-0.5 font-bold tracking-widest text-[10px] text-amber-300 backdrop-blur-xs">
            35MM
          </span>
        </div>
      </div>

      {/* 3. Bar Metadata Kamera & Film */}
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-y border-[var(--color-border)] bg-[var(--color-surface-muted)] px-4 py-2.5 text-xs text-[var(--color-text-muted)] sm:px-6">
        {/* Kamera */}
        {post.camera && (
          <div className="flex items-center gap-1.5">
            <Camera className="h-4 w-4 text-[var(--color-primary)]" />
            <span className="font-medium text-[var(--color-text-main)]">{post.camera}</span>
          </div>
        )}

        {/* Lensa */}
        {post.lens && (
          <div className="flex items-center gap-1.5">
            <Aperture className="h-4 w-4 text-[var(--color-primary)]" />
            <span>{post.lens}</span>
          </div>
        )}

        {/* Exposure */}
        {post.exposure && (
          <div className="flex items-center gap-1.5 font-mono">
            <span>{post.exposure}</span>
          </div>
        )}

        {/* Film Stock */}
        {post.film_stock && (
          <div className="ml-auto flex items-center gap-1.5">
            <span className="rounded-md border border-[var(--color-primary)]/20 bg-[var(--color-primary-soft)] px-2 py-0.5 font-medium text-[var(--color-primary)]">
              {post.film_stock}
            </span>
          </div>
        )}
      </div>

      {/* 4. Konten Teks (Judul, Caption, Tags) */}
      <div className="space-y-3 p-4 sm:p-6">
        <h2 className="font-display text-2xl font-bold tracking-tight text-[var(--color-text-main)]">
          {post.title}
        </h2>

        {post.caption && (
          <p className="text-sm leading-relaxed text-[var(--color-text-main)]">
            {post.caption}
          </p>
        )}

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="cursor-pointer rounded-full border border-[var(--color-border)] bg-[var(--color-surface-muted)] px-3 py-0.5 text-xs text-[var(--color-text-muted)] transition-colors hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* 5. Footer Aksi */}
      <footer className="flex items-center justify-between border-t border-[var(--color-border)] px-4 py-3 sm:px-6">
        {/* Kiri: Like (Optimistic) & Komentar */}
        <div className="flex items-center gap-5">
          <LikeButton
            postId={post.id}
            initialLikeCount={post.like_count}
            initialHasLiked={post.has_liked}
          />

          <button
            type="button"
            className="group flex items-center gap-1.5 text-sm font-medium text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text-main)]"
            aria-label="Komentari postingan"
          >
            <MessageCircle className="h-5 w-5 transition-transform group-hover:scale-110 group-active:scale-95" />
            <span className="group-hover:text-[var(--color-text-main)]">{post.comment_count}</span>
          </button>
        </div>

        {/* Kanan: Hapus, Simpan, Bagikan */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label="Hapus postingan"
            className="rounded-lg p-2 text-[var(--color-text-muted)] transition-colors hover:bg-red-50 hover:text-[var(--color-danger)]"
          >
            <Trash2 className="h-4 w-4" />
          </button>

          <button
            type="button"
            aria-label="Simpan postingan"
            className="rounded-lg p-2 text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-surface-muted)] hover:text-[var(--color-primary)]"
          >
            <Bookmark className="h-4 w-4" />
          </button>

          <button
            type="button"
            aria-label="Bagikan postingan"
            className="rounded-lg p-2 text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-surface-muted)] hover:text-[var(--color-text-main)]"
          >
            <Share2 className="h-4 w-4" />
          </button>
        </div>
      </footer>

      {/* 6. Komentar / Diskusi */}
      <CommentSection postId={post.id} comments={post.comments} />
    </article>
  )
}
