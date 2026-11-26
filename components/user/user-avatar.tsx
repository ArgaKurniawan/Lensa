import Image from 'next/image'
import { cn } from '@/lib/utils'

interface UserAvatarProps {
  src?: string | null
  username: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const sizeMap = {
  sm: 28,
  md: 36,
  lg: 56,
  xl: 96,
}

export function UserAvatar({ src, username, size = 'md', className }: UserAvatarProps) {
  const px = sizeMap[size]
  const initials = username.charAt(0).toUpperCase()

  if (!src) {
    return (
      <div
        className={cn(
          'flex items-center justify-center rounded-full text-white font-semibold select-none shrink-0',
          className
        )}
        style={{
          width: px,
          height: px,
          fontSize: px * 0.4,
          backgroundColor: 'var(--color-primary)',
        }}
      >
        {initials}
      </div>
    )
  }

  return (
    <Image
      src={src}
      alt={`Avatar ${username}`}
      width={px}
      height={px}
      className={cn('rounded-full object-cover shrink-0', className)}
    />
  )
}
