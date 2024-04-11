import React from 'react';

export const PostCard: React.FC<{ post: any }> = ({ post }) => {
    
    const date: String = `${new Date(post.date_posted).getDate()}/${new Date(post.date_posted).getMonth() + 1}/${new Date(post.date_posted).getFullYear()} ${new Date(post.date_posted).getHours().toString().padStart(2, '0')}:${new Date(post.date_posted).getMinutes().toString().padStart(2, '0')}`
    return (
      <div className="bg-white rounded-lg shadow-md border p-4 mt-4">
        <div className="flex items-center mb-4">
            <img className="w-12 h-12 rounded-full mr-3" src={post.profile_pic} alt="Profile Image" />
            <div>
                <h2 className="text-lg font-semibold">{post.author}</h2>
                <p className="text-gray-500 text-sm">Published on {date}</p>
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
  );
};



