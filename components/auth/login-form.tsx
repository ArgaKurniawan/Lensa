'use client'

// Versi Client Component dari form login (opsional — untuk UX loading state)
// Saat ini halaman login menggunakan Server Actions langsung di page.tsx
// File ini disiapkan untuk iterasi selanjutnya (useFormStatus, toast, dsb.)

import { useFormStatus } from 'react-dom'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { login, signup } from '@/app/(auth)/login/actions'

function SubmitButton({ label, formAction }: { label: string; formAction: (fd: FormData) => Promise<void> }) {
  const { pending } = useFormStatus()
  return (
    <Button
      formAction={formAction}
      isLoading={pending}
      variant={label === 'Masuk' ? 'primary' : 'secondary'}
      className="w-full"
    >
      {label}
    </Button>
  )
}

export function LoginForm({ message }: { message?: string }) {
  return (
    <div
      className="w-full max-w-md rounded-2xl p-8"
      style={{
        backgroundColor: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        boxShadow: '0 4px 24px rgba(26,24,21,0.08)',
      }}
    >
      <div className="mb-8 text-center">
        <h1
          className="text-4xl"
          style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-display)' }}
        >
          Lensa
        </h1>
        <p className="mt-1 text-sm" style={{ color: 'var(--color-text-muted)' }}>
          Komunitas fotografi film
        </p>
      </div>

      {message && (
        <div
          className="mb-5 rounded-lg px-4 py-3 text-sm"
          style={{ backgroundColor: 'var(--color-primary-soft)', color: 'var(--color-danger)' }}
        >
          {decodeURIComponent(message)}
        </div>
      )}

      <form className="space-y-4">
        <Input name="email" type="email" label="Email" placeholder="kamu@email.com" required />
        <Input name="password" type="password" label="Password" placeholder="••••••••" required />
        <div className="flex flex-col gap-3 pt-2">
          <SubmitButton label="Masuk" formAction={login} />
          <SubmitButton label="Daftar" formAction={signup} />
        </div>
      </form>
    </div>
  )
}
