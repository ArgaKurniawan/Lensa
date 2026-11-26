import { z } from 'zod'

export const commentSchema = z.object({
  body: z
    .string()
    .min(1, 'Komentar tidak boleh kosong')
    .max(300, 'Komentar maksimal 300 karakter'),
})

export type CommentInput = z.infer<typeof commentSchema>
