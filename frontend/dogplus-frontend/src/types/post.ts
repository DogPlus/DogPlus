
export interface Post  {
  author: {
    username: string,
    profile_image: string
  },
  date_posted: string
  text: string,
  image?: string,
  video?: string,
  id: number,
  profile_pic: string;
  like_count: number;
  comment_count: number;
  }

export interface Comment {
  id: number;
  post: number;
  author: {
    username: string,
    profile_image: string
  };
  text: string;
  created_at: string;
}
