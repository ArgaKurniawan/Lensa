'use client'

import { useActionState, useRef, useEffect } from 'react'
import { Send } from 'lucide-react'
import type { CommentWithAuthor } from '@/types'
import { addComment, type AddCommentResult } from '@/app/(main)/feed/actions'
import { timeAgo } from '@/lib/utils'

interface CommentSectionProps {
  postId: string
  comments: CommentWithAuthor[]
}

export function CommentSection({ postId, comments }: CommentSectionProps) {
  const formRef = useRef<HTMLFormElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // React 19 useActionState untuk memproses form submission
  const [state, formAction, isPending] = useActionState<AddCommentResult | null, FormData>(
    addComment.bind(null, postId),
    null
  )

  // Reset form setelah berhasil kirim komentar
  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset()
      inputRef.current?.blur()
    }
  }, [state])

  return (
    <section className="border-t border-[var(--color-border)] bg-[var(--color-surface-muted)]/50 p-4 sm:px-6">
      {/* 1. Daftar Komentar */}
      {comments.length > 0 && (
        <div className="mb-4 space-y-3">
          {comments.map((comment) => (
            <div key={comment.id} className="flex items-start gap-2.5 text-xs sm:text-sm">
              {/* Avatar User */}
              {comment.author.avatar_url ? (
                <img
                  src={comment.author.avatar_url}
                  alt={comment.author.display_name}
                  className="mt-0.5 h-7 w-7 rounded-full object-cover ring-1 ring-[var(--color-border)] shrink-0"
                />
              ) : (
                <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-[var(--color-primary-soft)] text-xs font-bold text-[var(--color-primary)] shrink-0">
                  {comment.author.display_name.charAt(0).toUpperCase()}
                </div>
              )}

              {/* Konten Komentar */}
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-1.5 flex-wrap">
                  <span className="font-semibold text-[var(--color-text-main)]">
                    {comment.author.display_name}
                  </span>
                  <span className="text-[11px] text-[var(--color-text-muted)]">
                    @{comment.author.username}
                  </span>
                  <span className="text-[10px] text-[var(--color-text-muted)]">•</span>
                  <span className="text-[11px] text-[var(--color-text-muted)]">
                    {timeAgo(comment.created_at)}
                  </span>
                </div>
                <p className="mt-0.5 text-[var(--color-text-main)] break-words leading-relaxed text-xs sm:text-sm">
                  {comment.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 2. Pesan Error Form jika ada */}
      {state?.error && (
        <p className="mb-2 text-xs font-medium text-red-500">{state.error}</p>
      )}

      {/* 3. Form Input Komentar */}
      <form ref={formRef} action={formAction} className="relative flex items-center">
        <input
          ref={inputRef}
          type="text"
          name="body"
          required
          maxLength={300}
          disabled={isPending}
          placeholder="Tulis diskusi eksposur..."
          className="w-full rounded-full border border-[var(--color-border)] bg-[var(--color-bg)] py-2 pl-4 pr-11 text-xs text-[var(--color-text-main)] placeholder-[var(--color-text-muted)] transition-colors focus:border-[var(--color-primary)] focus:outline-none disabled:opacity-60 sm:text-sm"
        />

        <button
          type="submit"
          disabled={isPending}
          aria-label="Kirim komentar"
          className="absolute right-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-[var(--color-primary)] text-white transition-all hover:bg-[var(--color-primary-hover)] active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Send className="h-3.5 w-3.5" />
        </button>
      </form>
    </section>
  )
}
