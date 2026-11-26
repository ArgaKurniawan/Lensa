import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Mengubah tanggal (timestamp) dari database menjadi teks relatif
 * Contoh: "Baru saja", "5 menit lalu", "2 jam lalu", "3 hari lalu", atau "12 Okt 2026"
 */
export function timeAgo(dateString: string | Date): string {
  if (!dateString) return ''

  const date = typeof dateString === 'string' ? new Date(dateString) : dateString
  if (isNaN(date.getTime())) return ''

  const now = new Date()
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (seconds < 60) {
    return 'Baru saja'
  }

  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) {
    return `${minutes} menit lalu`
  }

  const hours = Math.floor(minutes / 60)
  if (hours < 24) {
    return `${hours} jam lalu`
  }

  const days = Math.floor(hours / 24)
  if (days < 7) {
    return `${days} hari lalu`
  }

  // Tampilkan format tanggal absolut jika lebih dari 7 hari (misal: "12 Okt 2026")
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}
