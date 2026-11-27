export interface PostAuthor {
  username: string
  display_name: string
  avatar_url: string | null
}

export interface Profile {
  id: string
  username: string
  display_name: string
  bio: string | null
  avatar_url: string | null
  role?: 'user' | 'admin'
  follower_count: number
  following_count: number
  post_count: number
  created_at: string
}

export interface CommentWithAuthor {
  id: string
  body: string
  created_at: string
  author: PostAuthor
}

export interface PostWithAuthor {
  id: string
  author_id: string
  image_url: string
  image_path: string
  frame_info: string
  film_stock: string
  camera: string
  lens: string
  exposure: string
  title: string
  caption: string
  tags: string[]
  location: string
  created_at: string
  like_count: number
  comment_count: number
  has_liked: boolean
  is_bookmarked: boolean
  comments: CommentWithAuthor[]
  author: PostAuthor
}
