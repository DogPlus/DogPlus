import React from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { Post } from '../types/post';

// Create props interface
interface PostProps {
  post: Post;
  isLiked: boolean;
}

export const PostCard: React.FC<PostProps> = ({ post, isLiked }) => {
    const [liked, setLiked] = React.useState(isLiked);
    const [likeCount, setLikeCount] = React.useState(post.like_count);
    const navigate = useNavigate();
    
    const date: String = `${new Date(post.date_posted).getDate()}/${new Date(post.date_posted).getMonth() + 1}/${new Date(post.date_posted).getFullYear()} ${new Date(post.date_posted).getHours().toString().padStart(2, '0')}:${new Date(post.date_posted).getMinutes().toString().padStart(2, '0')}`


  const onLike = async () => {
    setLiked(!liked); // Toggle liked state
    setLikeCount(prevCount => liked ? prevCount - 1 : prevCount + 1); // Adjust like count

    try {
      // Make API call based on like/dislike
      if (!liked) {
        // Send like request
        const response = await fetch(`${process.env.REACT_APP_BACKEND_HOST}/api/feed/posts/${post.id}/like`, {
          method: "POST",
          headers: {
            "Authorization": `Token ${localStorage.getItem("token")}` // Add authorization header if needed
          },
        });

        // Impossible to fix this. Throws Cors error
        // if (!response.ok) {
        //   throw new Error("Network response for liking  was not ok");
        // }

      } else {
        // Send dislike request
        const response = await fetch(`${process.env.REACT_APP_BACKEND_HOST}/api/feed/posts/${post.id}/like`, {
          method: "DELETE",
          headers: {
            "Authorization": `Token ${localStorage.getItem("token")}` // Add authorization header if needed
          },
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

      }
    } catch (error) {
      console.error("Error sending like/dislike request:", error);
      toast.error("Failed to like/dislike post");
    }
  };

  const onComment = () => {
    // Redirect to post detail page
    navigate(`/post/${post.id}`);
  }

    return (
      <div className="bg-white rounded-lg shadow-md border p-4 mt-4">
        <div className="flex items-center mb-4">
            <img className="w-12 h-12 rounded-full mr-3 object-cover" src={post.author.profile_image} alt="Profile Image" />
            <div>
                <h2 className="text-lg font-semibold">{post.author.username}</h2>
                <p className="text-gray-500 text-sm">Published on {date}</p>
            </div>
        </div>
        <p className="text-gray-700 mb-4">
          {post.text}
        </p>
        {post.image && <img src={post.image} alt="Post" />}
        {post.video && (
          <video controls loop autoPlay muted playsInline>
              <source
                  src={post.video} 
              />
          </video>
        )}

        {/* Like and Comment Icons */}
        <div className="pt-4 mt-4 border-t border-gray-200">
            <div className="flex justify-between items-center">
                <button 
                  className={`flex items-center mr-4 ${liked ? 'text-accent-0' : 'text-gray-700'}`}
                  onClick={onLike}>
                    <i className="fas fa-thumbs-up mr-1"></i>
                    <span>{likeCount} Like(s)</span>
                </button>
                <button 
                  className="flex items-center text-gray-700 hover:text-green-600"
                  onClick={onComment}>
                  <i className="far fa-comment mr-1"></i>
                  <span>{post.comment_count} Comment(s)</span>
                </button>

            </div>
        </div>

        <div className="flex justify-end">
            {/* <a href="#" className="text-blue-500 font-semibold">Read More</a> */}
        </div>
      </div>
  );
};



