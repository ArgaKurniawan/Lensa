'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export type ToggleFollowResult = {
  success?: boolean
  error?: string
}

export async function toggleFollow(
  targetUserId: string,
  isFollowing: boolean
): Promise<ToggleFollowResult> {
  const supabase = await createClient()

  // 1. Cek autentikasi user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Sesi kamu telah berakhir. Silakan login terlebih dahulu.' }
  }

  // 2. Cegah follow akun sendiri
  if (user.id === targetUserId) {
    return { error: 'Anda tidak dapat mengikuti akun sendiri.' }
  }

  try {
    if (isFollowing) {
      // 3a. Jika sedang follow, lakukan unfollow (DELETE dari follows)
      const { error: deleteError } = await supabase
        .from('follows')
        .delete()
        .match({ follower_id: user.id, following_id: targetUserId })

      if (deleteError) {
        return { error: `Gagal berhenti mengikuti: ${deleteError.message}` }
      }
    } else {
      // 3b. Jika belum follow, lakukan follow (INSERT ke follows)
      const { error: insertError } = await supabase
        .from('follows')
        .insert({ follower_id: user.id, following_id: targetUserId })

      if (insertError) {
        return { error: `Gagal mengikuti: ${insertError.message}` }
      }
    }

    // Trigger database otomatis mengurus follower_count & following_count
    revalidatePath('/profile', 'layout')
    revalidatePath('/feed')

    return { success: true }
  } catch (err: any) {
    return { error: err?.message || 'Terjadi kesalahan sistem saat memproses follow.' }
  }
}
