import React, { useState, useEffect } from 'react';
import postsData from '../assets/fakePosts.json';

import { Post } from '../assets/interfaces'

interface FeedProps {
  posts: Post[];
}

const Feed: React.FC<FeedProps> = ({ posts }) => {
  const [localPosts, setLocalPosts] = useState<Post[]>([]);

  useEffect(() => {
    // Simulating a fetch request
    setLocalPosts(postsData);
  }, []);

  return (
    <div className="pb-20">
      <h1 className="text-3xl font-bold ">Dog+</h1>
      {posts.map(post => (

    <div key={post.id} className="bg-white rounded-lg shadow-md border p-4 mt-4">
    <div className="flex items-center mb-4">
        <img className="w-12 h-12 rounded-full mr-3" src={post.profile_pic} alt="Profile Image" />
        <div>
            <h2 className="text-lg font-semibold">{post.author}</h2>
            <p className="text-gray-500 text-sm">Published on {post.date}</p>
        </div>
    </div>
    <p className="text-gray-700 mb-4">
    {post.text}
    </p>
    {post.image && <img src={post.image} alt="Post" />}

    {/* Like and Comment Icons */}
    <div className="pt-4 mt-4 border-t border-gray-200">
        <div className="flex justify-between items-center">
            <button className="flex items-center mr-4 text-gray-700 hover:text-blue-600">
                <i className="fas fa-thumbs-up mr-1"></i>
                <span>{post.like_count} like(s)</span>
            </button>
            <button className="flex items-center text-gray-700 hover:text-green-600">
              <i className="far fa-comment mr-1"></i>
              <span>{post.comment_count} comment(s)</span>
            </button>

        </div>
    </div>

    <div className="flex justify-end">
        {/* <a href="#" className="text-blue-500 font-semibold">Read More</a> */}
    </div>
    </div>




      ))}
    </div> 
  );
};

export default Feed;
