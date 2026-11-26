import { login, signup } from './actions'

type SearchParams = Promise<{ message?: string }>

export default async function LoginPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const { message } = await searchParams

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div
        className="w-full max-w-md rounded-2xl p-8 shadow-md"
        style={{
          backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          boxShadow: '0 4px 24px rgba(26,24,21,0.08)',
        }}
      >
        {/* Logo */}
        <div className="mb-8 text-center">
          <h1
            className="text-4xl font-display tracking-tight"
            style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-display)' }}
          >
            Lensa
          </h1>
          <p className="mt-1 text-sm" style={{ color: 'var(--color-text-muted)' }}>
            Komunitas fotografi film — masuk atau daftar
          </p>
        </div>

        {/* Error / Info Message */}
        {message && (
          <div
            className="mb-5 rounded-lg px-4 py-3 text-sm"
            style={{
              backgroundColor: 'var(--color-primary-soft)',
              color: 'var(--color-danger)',
              border: '1px solid var(--color-danger)',
            }}
          >
            {decodeURIComponent(message)}
          </div>
        )}

        {/* Form */}
        <form className="space-y-4">
          <div className="space-y-1.5">
            <label
              htmlFor="email"
              className="block text-sm font-medium"
              style={{ color: 'var(--color-text-main)' }}
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="kamu@email.com"
              className="w-full rounded-lg px-3.5 py-2.5 text-sm outline-none transition-shadow"
              style={{
                backgroundColor: 'var(--color-surface-muted)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-text-main)',
              }}
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="password"
              className="block text-sm font-medium"
              style={{ color: 'var(--color-text-main)' }}
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              placeholder="••••••••"
              className="w-full rounded-lg px-3.5 py-2.5 text-sm outline-none transition-shadow"
              style={{
                backgroundColor: 'var(--color-surface-muted)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-text-main)',
              }}
            />
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-3 pt-2">
            <button
              formAction={login}
              className="w-full rounded-lg py-2.5 text-sm font-semibold text-white transition-colors"
              style={{ backgroundColor: 'var(--color-primary)' }}
            >
              Masuk
            </button>
            <button
              formAction={signup}
              className="w-full rounded-lg py-2.5 text-sm font-medium transition-colors"
              style={{
                backgroundColor: 'var(--color-surface-muted)',
                color: 'var(--color-text-main)',
                border: '1px solid var(--color-border)',
              }}
            >
              Daftar akun baru
            </button>
          </div>
        </form>

        <p className="mt-6 text-center text-xs" style={{ color: 'var(--color-text-muted)' }}>
          Dengan masuk, kamu menyetujui{' '}
          <a href="#" style={{ color: 'var(--color-primary)' }}>
            Syarat & Ketentuan
          </a>{' '}
          kami.
        </p>
      </div>
    </div>
  )
}
