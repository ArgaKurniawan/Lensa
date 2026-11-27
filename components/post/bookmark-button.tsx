'use client'

import { useState, useOptimistic, useTransition, useEffect } from 'react'
import { Bookmark } from 'lucide-react'
import { toggleBookmark } from '@/app/(main)/feed/actions'
import { cn } from '@/lib/utils'

interface BookmarkButtonProps {
  postId: string
  initialIsBookmarked: boolean
}

export function BookmarkButton({
  postId,
  initialIsBookmarked,
}: BookmarkButtonProps) {
  const [isBookmarked, setIsBookmarked] = useState<boolean>(initialIsBookmarked)

  // Sinkronisasi state jika props server berubah
  useEffect(() => {
    setIsBookmarked(initialIsBookmarked)
  }, [initialIsBookmarked])

  const [isPending, startTransition] = useTransition()

  // React 19 useOptimistic untuk perubahan UI instan
  const [optimisticBookmarked, setOptimisticBookmarked] = useOptimistic(
    isBookmarked,
    (_current: boolean, nextValue: boolean) => nextValue
  )

  const handleToggleBookmark = () => {
    const previous = optimisticBookmarked
    const next = !previous

    startTransition(async () => {
      // 1. Terapkan update optimis secara instan
      setOptimisticBookmarked(next)
      setIsBookmarked(next)

      // 2. Jalankan Server Action di latar belakang
      const res = await toggleBookmark(postId, previous)

      // 3. Rollback jika server mengembalikan error
      if (res?.error) {
        console.error('Bookmark toggle error:', res.error)
        setIsBookmarked(previous)
      }
    })
  }

  return (
    <button
      type="button"
      onClick={handleToggleBookmark}
      aria-label={optimisticBookmarked ? 'Hapus dari simpanan' : 'Simpan frame'}
      className={cn(
        'rounded-lg p-2 transition-all active:scale-90',
        optimisticBookmarked
          ? 'text-[var(--color-primary)]'
          : 'text-[var(--color-text-muted)] hover:bg-[var(--color-surface-muted)] hover:text-[var(--color-primary)]'
      )}
    >
      <Bookmark
        className={cn(
          'h-4 w-4 transition-all',
          optimisticBookmarked && 'fill-[var(--color-primary)] text-[var(--color-primary)]'
        )}
      />
    </button>
  )
}
