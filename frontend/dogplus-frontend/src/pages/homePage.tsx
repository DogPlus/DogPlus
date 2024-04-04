import React, { useState } from 'react';
import Feed from '../components/Feed';
import { AddPostButton } from '../components/AddPostButton';
import initialPosts from '../assets/fakePosts.json';
import { Post } from '../types/post';

export const HomePage = () => {
  const [posts, setPosts] = useState<Post[]>(initialPosts);

  const handleAddPost = (newPost: Post) => {
    setPosts([newPost, ...posts]); // Add the new post to the end of the posts list
  };

  return (
    <div>
      <AddPostButton onAddPost={handleAddPost} />
      <Feed posts={posts} />
    </div>
  );
};
