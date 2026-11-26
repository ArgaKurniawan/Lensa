import { z } from 'zod'

export const createPostSchema = z.object({
  title: z
    .string()
    .min(3, 'Judul minimal 3 karakter')
    .max(100, 'Judul maksimal 100 karakter'),
  caption: z
    .string()
    .max(500, 'Kapsi maksimal 500 karakter')
    .optional(),
  location: z.string().max(100).optional(),
  camera: z.string().max(100).optional(),
  lens: z.string().max(100).optional(),
  exposure: z.string().max(50).optional(),
  film_stock: z.string().max(100).optional(),
  tags: z.string().optional(), // String dipisah koma, misal: "Portra400, Kopi"
  alt_text: z.string().max(500).optional(),
})

export const updatePostSchema = createPostSchema.partial()

export type CreatePostInput = z.infer<typeof createPostSchema>
export type UpdatePostInput = z.infer<typeof updatePostSchema>
