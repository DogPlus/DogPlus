import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { CommentComponent } from '../components/comment';
import { Loading } from '../components/common/loading';
import { Post, Comment } from '../types/post';

export const PostDetailPage = () => {
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]); // Array of comments [Post, Post, Post
  const [commentText, setCommentText] = useState<string>(""); // Array of comments [Post, Post, Post
  const { post_id } = useParams();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_HOST}/api/feed/posts/${post_id}`, {
          method: "GET",
          headers: {
            "Authorization": `Token ${localStorage.getItem("token")}`
          }
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        setPost(data);
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };

    fetchPost();
  }, [post_id]);

  useEffect(() => {
    // Fetch comments of post
    const fetchComments = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_HOST}/api/feed/posts/${post_id}/comments`, {
          method: "GET",
          headers: {
            "Authorization": `Token ${localStorage.getItem("token")}`
          }
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        setComments(data);
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };

    fetchComments();
  }, [post_id]);

  const onCommentSubmit = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_HOST}/api/feed/posts/${post_id}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Token ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          text: commentText
        })
          
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      setComments([...comments, await response.json()]); // Add the new comment to the list of comments
    } catch (error) {
      console.error("Error fetching post:", error);
    }
  };

  

  if (!post) {
    return <Loading />;
  }

  return (
    <div className='p-3 pt-5'>
      {/* Render the profile header with picture, name and date of post */}
      <div className="flex items-center w-100 mb-5">
        <div className="w-10 h-10 bg-yellow-500 rounded-full" />
        <div className="ml-5 flex flex-col">
          <p className='text-base font-bold'>{post.author}</p>
          <p className='font-sm'>{post.date_posted}</p>
        </div>
      </div>
      <p className='font-base'>{post.text}</p>
      <div className="w-full mt-5">
      {/* Render the comments */}
        {comments.map(comment => (
          <CommentComponent key={comment.id} comment={comment} />
        ))}
        
        <div className="relative">
            <input type="text" className="block w-full p-4 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500" placeholder="Add a comment" onChange={(e) => setCommentText(e.target.value)} />
            <button type="submit" className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2" onClick={onCommentSubmit}>Send</button>
        </div>

      </div>
    </div>
  );
};
