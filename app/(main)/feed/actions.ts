'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { commentSchema } from '@/lib/validations/comment-schema'

export type ToggleLikeResult = {
  success?: boolean
  error?: string
}

export async function toggleLike(
  postId: string,
  hasLiked: boolean
): Promise<ToggleLikeResult> {
  const supabase = await createClient()

  // 1. Cek autentikasi user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Sesi kamu telah berakhir. Silakan login terlebih dahulu.' }
  }

  try {
    if (hasLiked) {
      // 2a. Jika sudah di-like, lakukan DELETE dari tabel likes
      const { error } = await supabase
        .from('likes')
        .delete()
        .match({ user_id: user.id, post_id: postId })

      if (error) {
        return { error: `Gagal membatalkan like: ${error.message}` }
      }
    } else {
      // 2b. Jika belum di-like, lakukan INSERT ke tabel likes
      const { error } = await supabase
        .from('likes')
        .insert({ user_id: user.id, post_id: postId })

      if (error) {
        return { error: `Gagal menyukai postingan: ${error.message}` }
      }
    }

    return { success: true }
  } catch (err: any) {
    return { error: err?.message || 'Terjadi kesalahan sistem saat memproses like.' }
  }
}

export type ToggleBookmarkResult = {
  success?: boolean
  error?: string
}

export async function toggleBookmark(
  postId: string,
  hasBookmarked: boolean
): Promise<ToggleBookmarkResult> {
  const supabase = await createClient()

  // 1. Cek autentikasi user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Sesi kamu telah berakhir. Silakan login terlebih dahulu.' }
  }

  try {
    if (hasBookmarked) {
      // 2a. Jika sudah di-bookmark, hapus dari tabel bookmarks
      const { error } = await supabase
        .from('bookmarks')
        .delete()
        .match({ user_id: user.id, post_id: postId })

      if (error) {
        return { error: `Gagal menghapus simpanan: ${error.message}` }
      }
    } else {
      // 2b. Jika belum di-bookmark, simpan ke tabel bookmarks
      const { error } = await supabase
        .from('bookmarks')
        .insert({ user_id: user.id, post_id: postId })

      if (error) {
        return { error: `Gagal menyimpan postingan: ${error.message}` }
      }
    }

    return { success: true }
  } catch (err: any) {
    return { error: err?.message || 'Terjadi kesalahan sistem saat memproses simpanan.' }
  }
}

export type AddCommentResult = {
  success?: boolean
  error?: string
}

export async function addComment(
  postId: string,
  _prevState: AddCommentResult | null,
  formData: FormData
): Promise<AddCommentResult> {
  const supabase = await createClient()

  // 1. Cek autentikasi user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Sesi kamu telah berakhir. Silakan login terlebih dahulu.' }
  }

  // 2. Validasi form body menggunakan commentSchema
  const rawBody = formData.get('body')
  const parseResult = commentSchema.safeParse({ body: rawBody })

  if (!parseResult.success) {
    return {
      error: parseResult.error.issues?.[0]?.message || 'Isi komentar tidak valid.',
    }
  }

  try {
    // 3. Simpan komentar ke tabel comments
    const { error: insertError } = await supabase.from('comments').insert({
      post_id: postId,
      author_id: user.id,
      body: parseResult.data.body,
    })

    if (insertError) {
      return { error: `Gagal mengirim komentar: ${insertError.message}` }
    }

    // 4. Revalidasi halaman feed agar komentar & counter terbaru segera muncul
    revalidatePath('/feed')

    return { success: true }
  } catch (err: any) {
    return { error: err?.message || 'Terjadi kesalahan sistem saat mengirim komentar.' }
  }
}
