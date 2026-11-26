# Lensa — Design Tokens

Tema: Warm film photography. Netral hangat, aksen burnt-orange, Fraunces untuk display, dan efek dot-grid background.

## CSS Variables (Tailwind v4 `@theme`)

Sesuai dengan Next.js 15 dan Tailwind CSS v4, token didefinisikan di `app/globals.css`:

```css
@theme {
  /* Colors */
  --color-bg: #f7f3eb; /* Warm off-white */
  --color-surface: #ffffff;
  --color-surface-muted: #f1ece3;
  --color-border: #e2d9cc;

  --color-text-main: #1a1815;
  --color-text-muted: #6b6358;

  --color-primary: #c2410c; /* Burnt orange */
  --color-primary-hover: #9a3412;
  --color-primary-soft: #fef0e7;

  --color-danger: #b91c1c;

  /* Typography */
  --font-sans: var(--font-inter), system-ui, sans-serif;
  --font-display: var(--font-fraunces), Georgia, serif;

  /* Radius */
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 16px;
  --radius-xl: 24px;
  --radius-pill: 999px;

  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(26, 24, 21, 0.06);
  --shadow-md: 0 4px 12px rgba(26, 24, 21, 0.08);
}
```
