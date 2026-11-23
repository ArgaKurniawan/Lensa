# Lensa — Wireframes (Low-Fidelity Spec)

Sketsa bisa dibuat di Excalidraw / Figma. Struktur di bawah adalah acuan.

## W1 — Login / Register

- Card center, max-width 380px
- Logo Fraunces di atas
- Tombol "Continue with Google"
- Divider "atau"
- Input email + tombol "Kirim magic link"
- Footer kecil: privacy & terms

## W2 — Onboarding Username

- Muncul jika user login tapi belum punya profil
- Input username (preview live `@username`), display name
- Tombol "Selesai" disabled sampai username valid & unik

## W3 — Feed (`/`)

- Navbar atas: logo kiri, search tengah, bell + avatar kanan
- Main column 600px centered
- Post card: avatar + username + waktu, gambar, caption, meta film/kamera, tombol like/komentar/bookmark, count
- Infinite scroll dengan skeleton
- Empty state: saran follow
- Mobile: bottom nav (Feed, Explore, Search, Notif, Profile)

## W4 — Explore (`/explore`)

- Grid masonry: 3 kolom desktop, 2 kolom mobile
- Tile: gambar, hover overlay caption + author
- Filter chip tag trending di atas

## W5 — Post Detail (`/post/[id]`)

- Desktop 2 kolom: gambar besar kiri, panel info kanan
- Panel: author header, caption + meta, komentar, input komentar sticky
- Mobile single column

## W6 — Profil (`/u/[username]`)

- Header: avatar besar, display name, @username, bio, stat, tombol follow/edit
- Grid post 3 kolom desktop / 2 kolom mobile
- Tab P1: Posts, Likes

## W7 — New Post (`/new`)

- Desktop 2 kolom: dropzone upload kiri, form kanan
- Field: gambar, caption, film stock, kamera, lensa, alt text, tags (chip input)
- Tombol publish sticky bottom
- Preview gambar live

## W8 — Notifikasi (`/notifications`)

- List item: avatar, teks, thumbnail, waktu, dot unread
- Tombol "Tandai semua dibaca"
- Klik → navigate ke post / profil

## W9 — Settings (`/settings/*`)

- Sidebar: Profile, Blocks, Account
- Profile: avatar, display name, bio
- Blocks: list + tombol unblock
- Account: danger "Delete account" (konfirmasi ketik username)

## W10 — Admin Reports (`/admin/reports`)

- Statistik atas: users, posts, comments, reports open
- Table: ID, target, reporter, reason, tanggal, status, aksi
- Aksi: Hide, Delete, Resolve, Dismiss
- Tab: Open / Resolved / Dismissed
- Akses ditolak (404) jika bukan admin