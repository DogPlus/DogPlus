import React, { useEffect } from 'react';

import { Post } from '../types/post'
import { Loading } from './common/loading';
import { PostCard } from './Post';

interface FeedProps {
  posts: Post[];
}

const Feed: React.FC<FeedProps> = ({ posts }) => {
  const [likedPosts, setLikedPosts] = React.useState<Post[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);


  useEffect(() => {
    const fetchLikedPosts = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_HOST}/api/feed/posts/liked_by/${localStorage.getItem("user_id")}`, {
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
        setLoading(false);
      } catch (error) {
        console.error("Error fetching liked posts:", error);
      }
    };

    fetchLikedPosts(); // Call the async function immediately

  }, []);

  const isLiked = (post: Post) => {
    const liked = likedPosts.some(likedPost => likedPost.id === post.id);
    return liked;
  }
  if (loading) {
    return <><Loading /></>;
  }

  return (
    <div className="pb-20">
      {posts.map(post => (
        <PostCard key={post.id} post={post} isLiked={isLiked(post)}/>
      ))
      }
    </div> 
  );
};

export default Feed;
