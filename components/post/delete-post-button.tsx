'use client'

import { useState } from 'react'
import { Trash2, Loader2 } from 'lucide-react'
import { deletePost } from '@/app/(main)/feed/actions'

interface DeletePostButtonProps {
  postId: string
  imagePath: string
  isOwner: boolean
}

export function DeletePostButton({
  postId,
  imagePath,
  isOwner,
}: DeletePostButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  // Hanya tampilkan jika user adalah pemilik postingan
  if (!isOwner) {
    return null
  }

  const handleDelete = async () => {
    const confirmed = window.confirm('Hapus frame ini?')
    if (!confirmed) return

    setIsDeleting(true)
    try {
      const res = await deletePost(postId, imagePath)
      if (res?.error) {
        alert(res.error)
      }
    } catch (err: any) {
      alert(err?.message || 'Gagal menghapus postingan.')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isDeleting}
      aria-label="Hapus postingan"
      className="rounded-lg p-2 text-[var(--color-text-muted)] transition-colors hover:bg-red-50 hover:text-[var(--color-danger)] disabled:cursor-not-allowed disabled:opacity-50"
    >
      {isDeleting ? (
        <Loader2 className="h-4 w-4 animate-spin text-[var(--color-danger)]" />
      ) : (
        <Trash2 className="h-4 w-4" />
      )}
    </button>
  )
}
