import React from 'react';

import { Post } from '../types/post'
import { PostCard } from './Post';

interface FeedProps {
  posts: Post[];
}

const Feed: React.FC<FeedProps> = ({ posts }) => {

  return (
    <div className="pb-20">
      <h1 className="text-3xl font-bold ">Dog+</h1>
      {posts.map(post => (
        <PostCard key={post.id} post={post} />
      ))
      }
    </div> 
  );
};

export default Feed;
