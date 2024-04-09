

export interface NewPost{
  author: string,
  date_posted: string
  text: string,
  image?: string,
}

export interface Post extends NewPost {
  id: number,
  profile_pic: string;
  like_count: number;
  comment_count: number;
  }
