import { z } from 'zod'

// Zod v4: required_error dihapus — gunakan .min(1) untuk validasi field kosong
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email wajib diisi.')
    .email('Format email tidak valid.'),
  password: z
    .string()
    .min(1, 'Password wajib diisi.')
    .min(8, 'Password minimal 8 karakter.'),
})

export const signupSchema = loginSchema
  .extend({
    confirmPassword: z.string().min(1, 'Konfirmasi password wajib diisi.'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Konfirmasi password tidak cocok.',
    path: ['confirmPassword'],
  })

export type LoginInput = z.infer<typeof loginSchema>
export type SignupInput = z.infer<typeof signupSchema>
