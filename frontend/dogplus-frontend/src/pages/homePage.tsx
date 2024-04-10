import React, { useEffect, useState } from 'react';
import Feed from '../components/Feed';
import { AddPostButton } from '../components/AddPostButton';
import { Post } from '../types/post';

export const HomePage = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  const handleAddPost = (newPost: Post) => {
    setPosts(prevPosts => [newPost, ...prevPosts]);
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_HOST}/api/feed/posts/user/1/`, { //TODO change to an endpoint that fetcehs from following list
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
      <AddPostButton onAddPost={handleAddPost} />
      <Feed posts={posts} />
    </div>
  );
};
