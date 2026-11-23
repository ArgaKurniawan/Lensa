# Lensa — Design Tokens

Tema: warm film photography. Netral hangat, aksen burnt-orange, Fraunces untuk display.

## CSS Variables

```css
/* app/globals.css */
:root {
  --color-bg:            #FAF7F2;
  --color-surface:       #FFFFFF;
  --color-surface-muted: #F1ECE3;
  --color-border:        #E2D9CC;

  --color-text:          #1A1815;
  --color-text-muted:    #6B6358;
  --color-text-inverse:  #FAF7F2;

  --color-primary:       #C2410C;
  --color-primary-hover: #9A3412;
  --color-primary-soft:  #FEF0E7;

  --color-danger:        #B91C1C;
  --color-success:       #15803D;
  --color-warning:       #A16207;

  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 16px;
  --radius-pill: 999px;

  --shadow-sm: 0 1px 2px rgba(26, 24, 21, 0.06);
  --shadow-md: 0 4px 12px rgba(26, 24, 21, 0.08);
}
```

## Tailwind Config (extend)

```ts
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        bg: 'var(--color-bg)',
        surface: 'var(--color-surface)',
        'surface-muted': 'var(--color-surface-muted)',
        border: 'var(--color-border)',
        text: 'var(--color-text)',
        'text-muted': 'var(--color-text-muted)',
        primary: {
          DEFAULT: 'var(--color-primary)',
          hover: 'var(--color-primary-hover)',
          soft: 'var(--color-primary-soft)',
        },
        danger: 'var(--color-danger)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Fraunces', 'Georgia', 'serif'],
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
      },
      boxShadow: {
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
      },
    },
  },
};
```

## Tipografi

| Peran | Font | Size | Weight | Line |
|---|---|---|---|---|
| Display / H1 | Fraunces | 32px (40px desktop) | 600 | 1.15 |
| H2 | Fraunces | 24px | 600 | 1.2 |
| H3 | Inter | 18px | 600 | 1.3 |
| Body | Inter | 15px | 400 | 1.55 |
| Caption / meta | Inter | 13px | 400 | 1.4 |
| Button | Inter | 14px | 500 | 1 |

## Spacing Scale

`4, 8, 12, 16, 24, 32, 48, 64`

## Komponen Wajib (shadcn/ui)

- Button: primary, secondary, ghost, danger
- Input, Textarea
- Card: post, profile
- Avatar
- Skeleton
- EmptyState (custom)
- Toast (sonner)
- Dialog (delete / report / block)
- Tabs (search & admin)