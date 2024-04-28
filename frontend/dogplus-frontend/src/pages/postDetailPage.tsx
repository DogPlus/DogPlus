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

  let date: String = '';
  
  if (post) {
    date = `${new Date(post.date_posted).getDate()}/${new Date(post.date_posted).getMonth() + 1}/${new Date(post.date_posted).getFullYear()} ${new Date(post.date_posted).getHours().toString().padStart(2, '0')}:${new Date(post.date_posted).getMinutes().toString().padStart(2, '0')}`
  }

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
    <div className='pt-5 h-full flex flex-col'>
      {/* Render the profile header with picture, name and date of post */}
        <div className='p-3'>
          <div className="flex items-center">
              <img className="w-12 h-12 rounded-full mr-3" src={post.author.profile_image} alt="Profile Image" />
              <div>
                  <h2 className="text-lg font-semibold">{post.author.username}</h2>
                  <p className="text-gray-500 text-sm">Published on {date}</p>
              </div>
          </div>
          <p className="text-gray-700">
            {post.text}
          </p>
        </div>
        {post.image && <img src={post.image} alt="Post" />}

      
      <div className="border-t border-gray-200" />

      <div className="w-full flex-grow overflow-y-auto p-3 pt-0">
      {/* Render the comments */}
        {comments.map(comment => (
          <CommentComponent key={comment.id} comment={comment} />
        ))}
        
      </div>
        <div className="relative">
          <input
            type="text"
            className="block w-full p-4 text-sm text-gray-900 border border-gray-300 bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Add a comment"
            onChange={(e) => setCommentText(e.target.value)}
          />
          <button
            type="submit"
            className="text-white absolute right-0 h-full bottom-0 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium text-sm px-4 py-2 rounded-none"
            onClick={onCommentSubmit}
          >
            Send
          </button>
        </div>

    </div>
  );
};
