export interface PostAuthor {
  username: string
  display_name: string
  avatar_url: string | null
}

export interface CommentWithAuthor {
  id: string
  body: string
  created_at: string
  author: PostAuthor
}

export interface PostWithAuthor {
  id: string
  image_url: string
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
  comments: CommentWithAuthor[]
  author: PostAuthor
}
