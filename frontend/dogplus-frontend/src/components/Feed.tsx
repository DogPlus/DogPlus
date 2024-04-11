import React, { useEffect } from 'react';

import { Post } from '../types/post'
import { PostCard } from './Post';

interface FeedProps {
  posts: Post[];
}

const Feed: React.FC<FeedProps> = ({ posts }) => {
  const [likedPosts, setLikedPosts] = React.useState<Post[]>([]);

  const user_id = 1

  useEffect(() => {
    const fetchLikedPosts = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_HOST}/api/feed/posts/liked_by/${user_id}`, {
          method: "GET",
          headers: {
            "Authorization": `Token ${localStorage.getItem("token")}`
          }
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        setLikedPosts(data);
      } catch (error) {
        console.error("Error fetching liked posts:", error);
      }
    };

    fetchLikedPosts(); // Call the async function immediately

  }, [user_id]);

  const isLiked = (post: Post) => {
    return likedPosts.some(likedPost => likedPost.id === post.id);
  }

  return (
    <div className="pb-20">
      <h1 className="text-3xl font-bold ">Dog+</h1>
      {posts.map(post => (
        <PostCard key={post.id} post={post} isLiked={isLiked(post)}/>
      ))
      }
    </div> 
  );
};

export default Feed;
