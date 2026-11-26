// Tipe dasar dari skema Supabase (di-generate manual sesuai migration 0001_init.sql)
// Jalankan: npx supabase gen types typescript --linked > types/database.types.ts
// untuk mendapatkan tipe yang sepenuhnya auto-generated.

// ─── Enums ──────────────────────────────────────────────────────────────────
export type VisibilityType = 'public' | 'followers' | 'private'
export type ReportReasonType = 'spam' | 'nudity' | 'harassment' | 'misinformation' | 'other'
export type ReportStatusType = 'open' | 'resolved' | 'dismissed'
export type NotificationEventType =
  | 'like_post'
  | 'comment_post'
  | 'like_comment'
  | 'follow'
  | 'mention'

// ─── Tables ─────────────────────────────────────────────────────────────────

export interface Profile {
  id: string                 // UUID, FK → auth.users.id
  username: string
  display_name: string | null
  bio: string | null
  avatar_url: string | null
  website: string | null
  is_admin: boolean
  is_verified: boolean
  followers_count: number
  following_count: number
  posts_count: number
  created_at: string
  updated_at: string
}

export interface Post {
  id: string
  user_id: string
  image_url: string
  image_key: string
  alt_text: string | null
  caption: string | null
  film_stock: string | null
  camera: string | null
  lens: string | null
  visibility: VisibilityType
  likes_count: number
  comments_count: number
  saves_count: number
  created_at: string
  updated_at: string
}

export interface Comment {
  id: string
  post_id: string
  user_id: string
  parent_id: string | null
  body: string
  likes_count: number
  created_at: string
  updated_at: string
}

export interface Follow {
  follower_id: string
  following_id: string
  created_at: string
}

export interface Like {
  user_id: string
  post_id: string
  created_at: string
}

export interface Notification {
  id: string
  recipient_id: string
  actor_id: string | null
  event: NotificationEventType
  entity_id: string | null
  is_read: boolean
  created_at: string
}

// ─── Joined / Derived Types ──────────────────────────────────────────────────

/** Post dengan data author (dari join ke profiles) */
export interface PostWithAuthor extends Post {
  profiles: Pick<Profile, 'id' | 'username' | 'display_name' | 'avatar_url'> | null
}

/** Komentar dengan data author */
export interface CommentWithAuthor extends Comment {
  profiles: Pick<Profile, 'id' | 'username' | 'display_name' | 'avatar_url'> | null
}
