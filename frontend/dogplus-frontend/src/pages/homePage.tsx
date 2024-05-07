import React, { useEffect, useState } from 'react';
import Feed from '../components/Feed';
import { CreatePostButton } from '../components/CreatePostButton';
import { Post } from '../types/post';
import UserContext from '../context/UserContext';
import { toast } from 'react-hot-toast';
import { logout } from '../utils/authUtils';

export const HomePage = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  const handleAddPost = (newPost: Post) => {
    setPosts(prevPosts => [newPost, ...prevPosts]);
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_HOST}/api/feed/create-post/`, { //TODO change to an endpoint that fetcehs from following list
          method: "GET",
          headers: {
            "Authorization": "Token "+ localStorage.getItem("token")
          },
        });

        if (response.status === 401) {
          logout();
        }
        else if (!response.ok) throw new Error('Failed to fetch posts')
        const data = await response.json();
      
        setPosts(data);
      } catch (error) {
        console.error("Error:", error);
        toast.error("Failed to fetch posts");
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
