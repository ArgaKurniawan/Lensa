import { CreatePostForm } from '@/components/post/create-post-form'

export default function NewPostPage() {
  return (
    <div className="max-w-2xl mx-auto py-4">
      <h1 className="font-display text-3xl font-bold mb-6 text-[var(--color-text-main)]">
        Unggah Frame Baru
      </h1>
      <CreatePostForm />
    </div>
  )
}
