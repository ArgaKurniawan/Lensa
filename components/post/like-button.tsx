'use client'

import { useState, useOptimistic, useTransition, useEffect } from 'react'
import { Heart } from 'lucide-react'
import { toggleLike } from '@/app/(main)/feed/actions'
import { cn } from '@/lib/utils'

interface LikeButtonProps {
  postId: string
  initialLikeCount: number
  initialHasLiked: boolean
}

interface LikeState {
  likeCount: number
  hasLiked: boolean
}

export function LikeButton({
  postId,
  initialLikeCount,
  initialHasLiked,
}: LikeButtonProps) {
  const [state, setState] = useState<LikeState>({
    likeCount: initialLikeCount,
    hasLiked: initialHasLiked,
  })

  // Sinkronisasi state jika props dari server berubah
  useEffect(() => {
    setState({
      likeCount: initialLikeCount,
      hasLiked: initialHasLiked,
    })
  }, [initialLikeCount, initialHasLiked])

  const [isPending, startTransition] = useTransition()

  // React 19 useOptimistic untuk perubahan UI instan
  const [optimisticState, setOptimisticState] = useOptimistic(
    state,
    (current: LikeState, nextHasLiked: boolean) => ({
      likeCount: nextHasLiked
        ? current.likeCount + 1
        : Math.max(0, current.likeCount - 1),
      hasLiked: nextHasLiked,
    })
  )

  const handleToggleLike = () => {
    const previousHasLiked = optimisticState.hasLiked
    const nextHasLiked = !previousHasLiked

    startTransition(async () => {
      // 1. Terapkan update optimis secara instan
      setOptimisticState(nextHasLiked)
      setState((prev) => ({
        likeCount: nextHasLiked
          ? prev.likeCount + 1
          : Math.max(0, prev.likeCount - 1),
        hasLiked: nextHasLiked,
      }))

      // 2. Jalankan Server Action di latar belakang
      const res = await toggleLike(postId, previousHasLiked)

      // 3. Rollback jika server mengembalikan error
      if (res?.error) {
        console.error('Like toggle error:', res.error)
        setState({
          likeCount: initialLikeCount,
          hasLiked: initialHasLiked,
        })
      }
    })
  }

  return (
    <button
      type="button"
      onClick={handleToggleLike}
      aria-label={optimisticState.hasLiked ? 'Batalkan suka' : 'Sukai postingan'}
      className={cn(
        'group flex items-center gap-1.5 text-sm font-medium transition-colors',
        optimisticState.hasLiked
          ? 'text-red-500'
          : 'text-[var(--color-text-muted)] hover:text-red-500'
      )}
    >
      <Heart
        className={cn(
          'h-5 w-5 transition-all duration-200 group-hover:scale-110 group-active:scale-90',
          optimisticState.hasLiked
            ? 'fill-red-500 text-red-500'
            : 'text-current group-hover:text-red-500'
        )}
      />
      <span
        className={cn(
          'transition-colors font-medium',
          optimisticState.hasLiked ? 'text-red-500' : 'group-hover:text-red-500'
        )}
      >
        {optimisticState.likeCount}
      </span>
    </button>
  )
}
