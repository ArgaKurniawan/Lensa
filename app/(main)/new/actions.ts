'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createPostSchema } from '@/lib/validations/post-schema'

export type FormState = {
  error?: string
} | null

export async function createPost(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const supabase = await createClient()

  // 1. Cek autentikasi user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Sesi kamu telah berakhir. Silakan login kembali.' }
  }

  // 2. Validasi input form teks menggunakan Zod
  const rawData = {
    title: formData.get('title'),
    caption: formData.get('caption') || undefined,
    location: formData.get('location') || undefined,
    camera: formData.get('camera') || undefined,
    lens: formData.get('lens') || undefined,
    exposure: formData.get('exposure') || undefined,
    film_stock: formData.get('film_stock') || undefined,
    tags: formData.get('tags') || undefined,
  }

  const parseResult = createPostSchema.safeParse(rawData)
  if (!parseResult.success) {
    const errorMessage =
      parseResult.error.issues?.[0]?.message || 'Data form tidak valid.'
    return {
      error: errorMessage,
    }
  }

  const validatedData = parseResult.data

  // 3. Validasi file gambar
  const file = formData.get('image') as File | null
  if (!file || file.size === 0) {
    return { error: 'Gambar wajib diunggah.' }
  }

  // Validasi ukuran maks 8MB (8 * 1024 * 1024 bytes)
  const MAX_FILE_SIZE = 8 * 1024 * 1024
  if (file.size > MAX_FILE_SIZE) {
    return { error: 'Ukuran gambar melebihi batas maksimal 8MB.' }
  }

  // Validasi tipe file
  if (!file.type.startsWith('image/')) {
    return { error: 'File yang diunggah harus berupa gambar.' }
  }

  // 4. Upload gambar ke Supabase Storage (bucket: post-images)
  const fileExt = file.name.split('.').pop() || 'jpg'
  const sanitizedName = file.name
    .replace(/\.[^/.]+$/, '')
    .replace(/[^a-zA-Z0-9_-]/g, '_')
  const fileName = `${user.id}/${Date.now()}-${sanitizedName}.${fileExt}`

  const { error: uploadError } = await supabase.storage
    .from('post-images')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    })

  if (uploadError) {
    return {
      error: `Gagal mengunggah gambar: ${uploadError.message}`,
    }
  }

  // 5. Dapatkan public URL gambar
  const {
    data: { publicUrl },
  } = supabase.storage.from('post-images').getPublicUrl(fileName)

  // 6. Simpan data post ke tabel `posts`
  let createdPostId: string | null = null

  try {
    const postPayload = {
      author_id: user.id,
      image_url: publicUrl,
      image_path: fileName,
      title: validatedData.title,
      caption: validatedData.caption || null,
      location: validatedData.location || null,
      camera: validatedData.camera || null,
      lens: validatedData.lens || null,
      exposure: validatedData.exposure || null,
      film_stock: validatedData.film_stock || null,
    }

    const { data: newPost, error: postError } = await supabase
      .from('posts')
      .insert(postPayload)
      .select('id')
      .single()

    if (postError) {
      return { error: `Gagal menyimpan post: ${postError.message}` }
    }

    createdPostId = newPost.id

    // 7. Handle Tags jika diisi
    if (validatedData.tags && createdPostId) {
      const tagList = validatedData.tags
        .split(',')
        .map((t) => t.trim())
        .filter((t) => t.length > 0)

      for (const rawTag of tagList) {
        // Panggil RPC get_or_create_tag
        const { data: tagId, error: tagRpcError } = await supabase.rpc(
          'get_or_create_tag',
          { p_name: rawTag }
        )

        if (!tagRpcError && tagId) {
          // Hubungkan post_id dan tag_id ke tabel post_tags
          await supabase.from('post_tags').insert({
            post_id: createdPostId,
            tag_id: tagId,
          })
        }
      }
    }

    revalidatePath('/feed')
  } catch (err: any) {
    if (err?.digest?.startsWith('NEXT_REDIRECT') || err?.message === 'NEXT_REDIRECT') {
      throw err
    }
    return { error: err?.message || 'Terjadi kesalahan sistem saat membuat post.' }
  }

  // Redirect setelah sukses di luar try-catch
  redirect('/feed')
}
