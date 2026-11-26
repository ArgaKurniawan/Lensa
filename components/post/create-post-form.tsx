'use client'

import { useActionState, useState, useRef } from 'react'
import { useFormStatus } from 'react-dom'
import { ImagePlus, X, AlertCircle, RefreshCw } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { createPost, type FormState } from '@/app/(main)/new/actions'

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button
      type="submit"
      variant="primary"
      size="lg"
      className="w-full text-base font-semibold"
      isLoading={pending}
    >
      Unggah Frame
    </Button>
  )
}

export function CreatePostForm() {
  const [state, formAction] = useActionState<FormState, FormData>(createPost, null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageChange = (file: File | undefined) => {
    if (file) {
      // Bebaskan memori URL sebelumnya jika ada
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    } else {
      setPreviewUrl(null)
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file && fileInputRef.current) {
      const dataTransfer = new DataTransfer()
      dataTransfer.items.add(file)
      fileInputRef.current.files = dataTransfer.files
      handleImageChange(file)
    }
  }

  const handleRemoveImage = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }
    setPreviewUrl(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <form
      action={formAction}
      encType="multipart/form-data"
      className="space-y-6 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-sm md:p-8"
    >
      {/* Pesan Error */}
      {state?.error && (
        <div className="flex items-start gap-3 rounded-xl border border-[var(--color-danger)] bg-red-50 p-4 text-sm text-[var(--color-danger)]">
          <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
          <span>{state.error}</span>
        </div>
      )}

      {/* Input File disembunyikan tapi TETAP berada di dalam DOM agar FormData dapat membacanya */}
      <input
        ref={fileInputRef}
        type="file"
        name="image"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleImageChange(e.target.files?.[0])}
      />

      {/* Area Upload Gambar (Drag & Drop / Klik) */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-[var(--color-text-main)]">
          Foto Analog <span className="text-[var(--color-danger)]">*</span>
        </label>

        {previewUrl ? (
          <div className="group relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-muted)]">
            <img
              src={previewUrl}
              alt="Pratinjau frame"
              className="h-full w-full object-cover"
            />
            {/* Tombol Aksi di Atas Gambar */}
            <div className="absolute right-3 top-3 flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1.5 text-xs text-white backdrop-blur-xs transition-colors hover:bg-black/80"
                title="Ganti foto"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span>Ganti</span>
              </button>
              <button
                type="button"
                onClick={handleRemoveImage}
                className="rounded-full bg-black/60 p-1.5 text-white backdrop-blur-xs transition-colors hover:bg-black/80"
                title="Hapus foto"
                aria-label="Hapus gambar"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        ) : (
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault()
              setIsDragging(true)
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`group flex aspect-[4/3] w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center transition-all ${
              isDragging
                ? 'border-[var(--color-primary)] bg-[var(--color-primary-soft)]/40'
                : 'border-[var(--color-border)] bg-[var(--color-surface-muted)] hover:border-[var(--color-primary)]'
            }`}
          >
            <div className="flex flex-col items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-surface)] shadow-xs transition-transform group-hover:scale-105">
                <ImagePlus className="h-7 w-7 text-[var(--color-primary)]" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-[var(--color-text-main)]">
                  Klik untuk unggah atau seret foto ke sini
                </p>
                <p className="text-xs text-[var(--color-text-muted)]">
                  Format JPG, PNG, atau WEBP (Maksimal 8MB)
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Field: Judul */}
      <Input
        label="Judul Frame"
        name="title"
        placeholder="misal: Bias Pagi di Kedai Kopi Pecinan"
        required
      />

      {/* Field: Caption */}
      <Input
        label="Cerita di Balik Frame (Caption)"
        name="caption"
        placeholder="Tuliskan cerita, memori, atau catatan di balik frame ini..."
      />

      {/* Grid 2 Kolom untuk Info Kamera & Lensa */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="Kamera"
          name="camera"
          placeholder="misal: Leica M6, Canon AE-1"
        />
        <Input
          label="Lensa"
          name="lens"
          placeholder="misal: Summicron 35mm f/2"
        />
      </div>

      {/* Grid 2 Kolom untuk Film Stock & Exposure */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="Film Stock"
          name="film_stock"
          placeholder="misal: Kodak Portra 400, Ilford HP5"
        />
        <Input
          label="Exposure"
          name="exposure"
          placeholder="misal: f/2.8 · 1/125s"
        />
      </div>

      {/* Grid 2 Kolom untuk Lokasi & Tags */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="Lokasi"
          name="location"
          placeholder="misal: Pecinan Ketandan, Yogyakarta"
        />
        <Input
          label="Tags"
          name="tags"
          placeholder="Portra400, Kopi"
        />
      </div>

      {/* Tombol Submit */}
      <div className="pt-2">
        <SubmitButton />
      </div>
    </form>
  )
}
