import React, { useState } from 'react';

import { Post } from '../assets/interfaces'

interface AddPostButtonProps {
    onAddPost: (newPost: Post) => void;
  }

export const AddPostButton: React.FC<AddPostButtonProps> = ({ onAddPost }) => {
    const [showModal, setShowModal] = useState(false);
  const [postText, setPostText] = useState('');
  const [postImage, setPostImage] = useState('');

  interface AddPostButtonProps {
    onAddPost: (newPost: Post) => void;
  }

  const handlePost = () => {
    const newPost: Post = {
      id: Date.now(),
      author: "Kari Nordmann",
      profile_pic: "https://randomuser.me/api/portraits/women/14.jpg",
      like_count: 0, 
      comment_count: 0,
      date: new Date().toISOString(), // Må formateres fra ISO til noe lesbart
      text: postText,
      image: postImage, 
    };

    onAddPost(newPost);
    setShowModal(false);
    setPostText('');
    setPostImage('');


  };

    const handleCloseModal = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            setShowModal(false);
        }
    };


  return (
    <div>
      <button onClick={() => setShowModal(true)} 
        className="p-0 w-12 h-12 bg-blue-500 text-white 
        rounded-full fixed bottom-20 right-5 flex items-center 
        justify-center text-2xl">
        <i className="fas fa-plus"></i> {/* Font Awesome Plus Icon */}
      </button>

      {showModal && (
        <div onClick={handleCloseModal} className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto mt-20 p-5 border w-96 shadow-lg rounded-md bg-white">

            <button 
              onClick={() => setShowModal(false)} 
              className="absolute top-0 left-0 mt-2 ml-2 text-gray-700 hover:text-gray-900">
              <i className="fas fa-times"></i> {/* Or use "X" if not using Font Awesome */}
            </button>


            <div className="mt-3 text-center">
              <div className="mt-2">
                <input
                  type="text"
                  placeholder="Write something..."
                  value={postText}
                  onChange={(e) => setPostText(e.target.value)}
                  className="border p-2 w-full"
                />
                <input
                  type="text"
                  placeholder="Image URL (optional)"
                  value={postImage}
                  onChange={(e) => setPostImage(e.target.value)}
                  className="border p-2 w-full mt-2"
                />
              </div>
              <button
                onClick={handlePost}
                className="mt-4 bg-blue-500 text-white p-2 rounded"
              >
                Post
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
