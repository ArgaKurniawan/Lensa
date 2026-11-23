# Lensa — Decision Log

| ID | Keputusan | Alasan | Alternatif ditolak |
|---|---|---|---|
| D1 | Profile dibuat saat onboarding | Username wajib; hindari profil setengah jadi | Auto-create random username |
| D2 | Denormalized counters + trigger | Feed cepat; hindari COUNT(*) | Query COUNT(*) |
| D3 | RLS sebagai pertahanan utama | Client tidak bisa bypass | Validasi aplikasi saja |
| D4 | Block berlaku dua arah di RLS | Konsisten dengan UX | Block satu arah |
| D5 | Reports unique per (reporter, target) | Cegah spam | Tanpa unique |
| D6 | Tanpa trigger auto-profile | Onboarding lebih jelas | Auto-create |
| D7 | Komentar flat | Kurangi kompleksitas | Nested |
| D8 | Notifikasi hanya via trigger | Cegah spam | Client insert |
| D9 | Tag dibuat via `get_or_create_tag` (security definer) | Atomik, hindari race | Insert terpisah client |
| D10 | Audit log lewat service role | RLS tidak izinkan client | Client write audit |