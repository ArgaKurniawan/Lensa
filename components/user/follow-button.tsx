'use client'

import { useState, useOptimistic, useTransition, useEffect } from 'react'
import { toggleFollow } from '@/app/(main)/profile/actions'
import { cn } from '@/lib/utils'

interface FollowButtonProps {
  targetUserId: string
  initialIsFollowing: boolean
}

export function FollowButton({
  targetUserId,
  initialIsFollowing,
}: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState<boolean>(initialIsFollowing)

  // Sinkronisasi state jika props server berubah
  useEffect(() => {
    setIsFollowing(initialIsFollowing)
  }, [initialIsFollowing])

  const [isPending, startTransition] = useTransition()

  // Optimistic UI untuk respon instan saat diklik
  const [optimisticFollowing, setOptimisticFollowing] = useOptimistic(
    isFollowing,
    (_current: boolean, nextValue: boolean) => nextValue
  )

  const handleToggle = () => {
    const previous = optimisticFollowing
    const next = !previous

    startTransition(async () => {
      // 1. Terapkan update optimis segera
      setOptimisticFollowing(next)
      setIsFollowing(next)

      // 2. Eksekusi Server Action di background
      const res = await toggleFollow(targetUserId, previous)

      // 3. Rollback jika server gagal
      if (res?.error) {
        console.error('Follow toggle error:', res.error)
        setIsFollowing(previous)
      }
    })
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={isPending}
      aria-label={optimisticFollowing ? 'Berhenti mengikuti' : 'Ikuti fotografer'}
      className={cn(
        'rounded-full px-5 py-2 text-sm font-semibold transition-all duration-200 active:scale-95 disabled:opacity-60',
        optimisticFollowing
          ? 'border border-[var(--color-border)] bg-[var(--color-surface-muted)] text-[var(--color-text-main)] hover:border-red-300 hover:bg-red-50 hover:text-red-600'
          : 'bg-[var(--color-primary)] text-white shadow-xs hover:bg-[var(--color-primary-hover)]'
      )}
    >
      {optimisticFollowing ? 'Mengikuti' : 'Ikuti'}
    </button>
  )
}
