import React, { useEffect, useState } from 'react';
import Feed from '../components/Feed';
import { AddPostButton } from '../components/AddPostButton';
import initialPosts from '../assets/fakePosts.json';
import { Post } from '../types/post';

export const HomePage = () => {
  const [posts, setPosts] = useState<Post[]>(initialPosts);

  const handleAddPost = (newPost: Post) => {
    setPosts([newPost, ...posts]); // Add the new post to the end of the posts list
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_HOST}/api/feed/create-post/`, { // jeg skjønner ikke hvorfor det er /api/feed/create-post/ her
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Token "+ localStorage.getItem("token") //må kanskje endres?
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
