import React, { useEffect, useState } from 'react';
import Feed from '../components/Feed';
import { CreatePostButton } from '../components/CreatePostButton';
import { Post } from '../types/post';
import UserContext from '../context/UserContext';

export const HomePage = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  const handleAddPost = (newPost: Post) => {
    setPosts(prevPosts => [newPost, ...prevPosts]);
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_HOST}/api/feed/posts/user/${localStorage.getItem("user_id")}/`, { //TODO change to an endpoint that fetcehs from following list
          method: "GET",
          headers: {
            "Authorization": "Token "+ localStorage.getItem("token")
          },
        });

        if (!response.ok) throw new Error('Failed to fetch posts')
        const data = await response.json();
      
        setPosts(data);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div>
      <CreatePostButton onCreatePost={handleAddPost} />
      <Feed posts={posts} />
    </div>
  );
};
