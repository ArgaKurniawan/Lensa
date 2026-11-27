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
  isBookmarked: boolean
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
    if (isBookmarked) {
      // 2a. Jika sudah di-bookmark, lakukan DELETE dari tabel bookmarks
      const { error } = await supabase
        .from('bookmarks')
        .delete()
        .match({ user_id: user.id, post_id: postId })

      if (error) {
        return { error: `Gagal menghapus simpanan: ${error.message}` }
      }
    } else {
      // 2b. Jika belum di-bookmark, lakukan INSERT ke tabel bookmarks
      const { error } = await supabase
        .from('bookmarks')
        .insert({ user_id: user.id, post_id: postId })

      if (error) {
        return { error: `Gagal menyimpan postingan: ${error.message}` }
      }
    }

    revalidatePath('/feed')
    revalidatePath('/bookmarks')

    return { success: true }
  } catch (err: any) {
    return { error: err?.message || 'Terjadi kesalahan sistem saat memproses simpanan.' }
  }
}

export type DeletePostResult = {
  success?: boolean
  error?: string
}

export async function deletePost(
  postId: string,
  imagePath: string
): Promise<DeletePostResult> {
  const supabase = await createClient()

  // 1. Cek autentikasi user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Sesi kamu telah berakhir. Silakan login terlebih dahulu.' }
  }

  try {
    // 2. Verifikasi kepemilikan postingan
    const { data: post, error: fetchError } = await supabase
      .from('posts')
      .select('author_id')
      .eq('id', postId)
      .single()

    if (fetchError || !post) {
      return { error: 'Postingan tidak ditemukan.' }
    }

    if (post.author_id !== user.id) {
      return { error: 'Anda tidak berhak menghapus post ini.' }
    }

    // 3. Hapus file gambar dari Storage bucket post-images jika imagePath ada
    if (imagePath) {
      const { error: storageError } = await supabase.storage
        .from('post-images')
        .remove([imagePath])

      if (storageError) {
        console.warn('Gagal menghapus file gambar di Storage:', storageError.message)
      }
    }

    // 4. Hapus baris dari tabel posts (relasi comments, likes, post_tags otomatis terhapus via CASCADE)
    const { error: deleteError } = await supabase
      .from('posts')
      .delete()
      .eq('id', postId)

    if (deleteError) {
      return { error: `Gagal menghapus postingan: ${deleteError.message}` }
    }

    // 5. Revalidasi halaman feed dan bookmarks
    revalidatePath('/feed')
    revalidatePath('/bookmarks')

    return { success: true }
  } catch (err: any) {
    return { error: err?.message || 'Terjadi kesalahan sistem saat menghapus postingan.' }
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
    revalidatePath('/bookmarks')

    return { success: true }
  } catch (err: any) {
    return { error: err?.message || 'Terjadi kesalahan sistem saat mengirim komentar.' }
  }
}
