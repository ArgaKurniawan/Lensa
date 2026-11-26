// Layout khusus halaman autentikasi — tidak ada Sidebar/Navbar
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-bg)' }}>
      {children}
    </div>
  )
}
