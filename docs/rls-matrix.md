# Lensa — RLS Policy Matrix

## Matriks

| Tabel | SELECT | INSERT | UPDATE | DELETE |
|---|---|---|---|---|
| **profiles** | semua | `id = auth.uid()` | `id = auth.uid()` | cascade via auth.user |
| **posts** | public & not hidden & not blocked, atau milik sendiri, atau admin | `author_id = auth.uid()` | `author_id = auth.uid()` | author atau admin |
| **tags** | semua | `auth.role() = 'authenticated'` | admin | admin |
| **post_tags** | semua | author post | — | author post |
| **likes** | semua | `user_id = auth.uid()` | — | `user_id = auth.uid()` |
| **comments** | not hidden & not blocked, atau milik sendiri, atau admin | `author_id = auth.uid()` | `author_id = auth.uid()` | author atau admin |
| **follows** | semua | `follower_id = auth.uid()` | — | `follower_id = auth.uid()` |
| **blocks** | `blocker_id = auth.uid()` | `blocker_id = auth.uid()` | — | `blocker_id = auth.uid()` |
| **notifications** | `recipient_id = auth.uid()` | trigger only | `recipient_id = auth.uid()` | `recipient_id = auth.uid()` |
| **reports** | `reporter_id = auth.uid()` atau admin | `reporter_id = auth.uid()` | admin | admin |
| **admin_audit_logs** | admin | service role via Server Action | — | — |

## Catatan Implementasi

- Semua write ke `admin_audit_logs` dan mutasi status `reports` dilakukan lewat Server Action dengan `service role` di server.
- Client tidak boleh menulis audit log sendiri — RLS memblokir.
- Block bersifat dua arah: konten user yang diblokir (atau yang memblokir) hilang dari feed dan akses langsung.

## Test Manual Wajib (Fase 5)

- [ ] Guest tidak bisa INSERT post
- [ ] User A tidak bisa UPDATE/DELETE post User B
- [ ] User A tidak bisa LIKE atas nama User B
- [ ] Blocked user tidak muncul di feed & profil
- [ ] Admin bisa SELECT post hidden
- [ ] User biasa tidak bisa SELECT `admin_audit_logs`