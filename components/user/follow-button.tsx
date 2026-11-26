'use client'

// TODO: Fase 4 — optimistic update + Server Action untuk follow/unfollow
import { useState } from 'react'
import { Button } from '@/components/ui/button'

interface FollowButtonProps {
  targetUserId: string
  initialIsFollowing: boolean
}

export function FollowButton({ targetUserId: _targetUserId, initialIsFollowing }: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing)
  const [isPending, setIsPending] = useState(false)

  async function handleToggle() {
    setIsPending(true)
    // TODO: panggil Server Action follow/unfollow
    setIsFollowing((prev) => !prev)
    setIsPending(false)
  }

  return (
    <Button
      variant={isFollowing ? 'secondary' : 'primary'}
      size="sm"
      isLoading={isPending}
      onClick={handleToggle}
    >
      {isFollowing ? 'Unfollow' : 'Follow'}
    </Button>
  )
}
