export default function FeedLoading() {
  return (
    <div className="space-y-6 pb-20">
      {[1, 2, 3].map((item) => (
        <article
          key={item}
          className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-xs animate-pulse"
        >
          {/* 1. Header Skeleton */}
          <header className="flex items-center justify-between p-4 sm:px-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-[var(--color-surface-muted)] shrink-0" />
              <div className="space-y-2">
                <div className="h-3.5 w-32 rounded bg-[var(--color-surface-muted)]" />
                <div className="h-2.5 w-20 rounded bg-[var(--color-surface-muted)]" />
              </div>
            </div>
            <div className="h-5 w-5 rounded bg-[var(--color-surface-muted)]" />
          </header>

          {/* 2. Photo Skeleton (Aspect 4:3) */}
          <div className="aspect-[4/3] w-full bg-[var(--color-surface-muted)]" />

          {/* 3. Metadata Bar Skeleton */}
          <div className="flex items-center gap-4 border-y border-[var(--color-border)] bg-[var(--color-surface-muted)]/50 px-4 py-3 sm:px-6">
            <div className="h-3.5 w-20 rounded bg-[var(--color-surface-muted)]" />
            <div className="h-3.5 w-24 rounded bg-[var(--color-surface-muted)]" />
            <div className="h-3.5 w-16 rounded bg-[var(--color-surface-muted)]" />
            <div className="ml-auto h-5 w-24 rounded-md bg-[var(--color-surface-muted)]" />
          </div>

          {/* 4. Text Content Skeleton */}
          <div className="space-y-3 p-4 sm:p-6">
            <div className="h-6 w-3/4 rounded bg-[var(--color-surface-muted)]" />
            <div className="space-y-2">
              <div className="h-3.5 w-full rounded bg-[var(--color-surface-muted)]" />
              <div className="h-3.5 w-5/6 rounded bg-[var(--color-surface-muted)]" />
            </div>
            <div className="flex gap-2 pt-1">
              <div className="h-5 w-16 rounded-full bg-[var(--color-surface-muted)]" />
              <div className="h-5 w-20 rounded-full bg-[var(--color-surface-muted)]" />
              <div className="h-5 w-14 rounded-full bg-[var(--color-surface-muted)]" />
            </div>
          </div>

          {/* 5. Footer Actions Skeleton */}
          <footer className="flex items-center justify-between border-t border-[var(--color-border)] px-4 py-3 sm:px-6">
            <div className="flex items-center gap-5">
              <div className="h-5 w-12 rounded bg-[var(--color-surface-muted)]" />
              <div className="h-5 w-12 rounded bg-[var(--color-surface-muted)]" />
            </div>
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded bg-[var(--color-surface-muted)]" />
              <div className="h-7 w-7 rounded bg-[var(--color-surface-muted)]" />
              <div className="h-7 w-7 rounded bg-[var(--color-surface-muted)]" />
            </div>
          </footer>
        </article>
      ))}
    </div>
  )
}
