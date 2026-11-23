# Fase 1 — Design Artifacts

## Ringkasan

Menambahkan seluruh artefak desain teknis Fase 1: ERD, RLS matrix, design tokens, wireframe spec, decision log, dan 4 migrasi SQL siap deploy ke Supabase.

## File yang Ditambahkan

| File | Isi |
|---|---|
| `docs/erd.md` | Diagram Mermaid + 10 keputusan desain |
| `docs/rls-matrix.md` | Matriks RLS + checklist test manual |
| `docs/design-tokens.md` | CSS variables, Tailwind extend, tipografi, komponen |
| `docs/wireframes.md` | Spec 10 halaman (W1–W10) |
| `docs/decision-log.md` | 10 keputusan teknis + alternatif ditolak |
| `supabase/migrations/0001_init.sql` | Schema, enum, index, constraint |
| `supabase/migrations/0002_functions.sql` | Helper: `is_admin`, `is_blocked_between`, `get_or_create_tag` |
| `supabase/migrations/0003_triggers.sql` | `updated_at` + counter & notifikasi trigger |
| `supabase/migrations/0004_rls.sql` | Semua RLS policy |

## Cara Verifikasi

1. `supabase link --project-ref <ref>`
2. `supabase db push`
3. Seed 2 user + 1 admin, uji policy RLS (lihat checklist di `docs/rls-matrix.md`).
4. Buka `docs/erd.md` di GitHub, pastikan diagram Mermaid ter-render.

## Checklist

- [ ] Semua migrasi jalan tanpa error di Supabase dev
- [ ] RLS aktif di 11 tabel
- [ ] 2 akun uji berhasil memverifikasi matrix
- [ ] `docs/erd.md` ter-render di GitHub
- [ ] `docs/design-tokens.md` siap dipakai Fase 2

## Catatan

- Perubahan `admin_audit_logs` hanya lewat `service role` Server Action.
- `reports.target_id` tanpa FK (polymorphic) — divalidasi di aplikasi.