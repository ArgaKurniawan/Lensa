# Lensa — Entity Relationship Diagram

Dibuat: Fase 1. Dirender otomatis oleh GitHub & VS Code.

```mermaid
erDiagram
    auth_users ||--o| profiles : "has"
    profiles ||--o{ posts : "authors"
    profiles ||--o{ comments : "authors"
    profiles ||--o{ likes : "gives"
    profiles ||--o{ follows : "follower"
    profiles ||--o{ follows : "following"
    profiles ||--o{ blocks : "blocker"
    profiles ||--o{ blocks : "blocked"
    profiles ||--o{ notifications : "recipient"
    profiles ||--o{ notifications : "actor"
    profiles ||--o{ reports : "reporter"
    profiles ||--o{ reports : "reviewer"
    profiles ||--o{ admin_audit_logs : "admin"
    posts ||--o{ post_tags : "has"
    tags ||--o{ post_tags : "tagged"
    posts ||--o{ likes : "receives"
    posts ||--o{ comments : "has"
    posts ||--o{ notifications : "referenced"
    comments ||--o{ notifications : "referenced"
    posts ||--o{ reports : "target"
    comments ||--o{ reports : "target"
    profiles ||--o{ reports : "target"

    profiles {
        uuid id PK
        text username UK
        text display_name
        text bio
        text avatar_url
        user_role role
        int follower_count
        int following_count
        int post_count
        timestamptz created_at
        timestamptz updated_at
    }
    posts {
        uuid id PK
        uuid author_id FK
        text image_url
        text image_path
        text caption
        text film_stock
        text camera
        text lens
        text alt_text
        bool is_hidden
        text hidden_reason
        int like_count
        int comment_count
        timestamptz created_at
        timestamptz updated_at
    }
    tags {
        uuid id PK
        text name
        text slug UK
        int post_count
    }
    post_tags {
        uuid post_id PK,FK
        uuid tag_id PK,FK
    }
    likes {
        uuid user_id PK,FK
        uuid post_id PK,FK
        timestamptz created_at
    }
    comments {
        uuid id PK
        uuid post_id FK
        uuid author_id FK
        text body
        bool is_hidden
        text hidden_reason
        timestamptz created_at
        timestamptz updated_at
    }
    follows {
        uuid follower_id PK,FK
        uuid following_id PK,FK
        timestamptz created_at
    }
    blocks {
        uuid blocker_id PK,FK
        uuid blocked_id PK,FK
        timestamptz created_at
    }
    notifications {
        uuid id PK
        uuid recipient_id FK
        uuid actor_id FK
        notification_type type
        uuid post_id FK
        uuid comment_id FK
        bool is_read
        timestamptz created_at
    }
    reports {
        uuid id PK
        uuid reporter_id FK
        report_target_type target_type
        uuid target_id
        report_reason reason
        text details
        report_status status
        uuid reviewed_by FK
        timestamptz reviewed_at
        timestamptz created_at
    }
    admin_audit_logs {
        uuid id PK
        uuid admin_id FK
        text action
        text target_type
        uuid target_id
        jsonb metadata
        timestamptz created_at
    }
```

## Keputusan Desain

| # | Keputusan | Alasan |
|---|---|---|
| D1 | Profile dibuat saat onboarding, bukan signup | Username wajib; hindari profil setengah jadi |
| D2 | Denormalized counters + trigger | Feed & profil cepat; hindari COUNT(*) |
| D3 | `image_path` terpisah dari `image_url` | Perlu untuk delete di Storage |
| D4 | `reports.target_id` tanpa FK (polymorphic) | Divalidasi di Server Action |
| D5 | `unique (reporter_id, target_type, target_id)` | Cegah spam report |
| D6 | Username lowercase `[a-z0-9_]`, 3–20 | Normalisasi & cegah impersonasi |
| D7 | Notifikasi hanya dibuat trigger | Cegah spam notifikasi |
| D8 | Block berlaku dua arah di RLS | Konsisten dengan UX |
| D9 | Komentar flat (tanpa parent_id) | Nested masuk P2 |
| D10 | `on delete cascade` untuk data turunan user | Sederhanakan delete account |