import React, { useState, useEffect } from 'react';
import postsData from '../assets/fakePosts.json';

interface Post {
  id: number;
  author: string;
  text: string;
  image?: string;
}

const Feed: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    // Simulating a fetch request
    setPosts(postsData);
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold underline">Feed</h1>
      {posts.map(post => (
        <div key={post.id}>
          <h2>{post.author}</h2>
          <p>{post.text}</p>
          {post.image && <img src={post.image} alt="Post" />}
        </div>
      ))}
    </div> 
  );
};

export default Feed;
