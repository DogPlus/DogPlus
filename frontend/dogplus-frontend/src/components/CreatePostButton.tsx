import React, { useState } from 'react';
import UserContext from '../context/UserContext';

import { Post } from '../types/post'

interface CreatePostButtonProps {
    onCreatePost: (newPost: Post) => void;
  }

export const CreatePostButton: React.FC<CreatePostButtonProps> = ({ onCreatePost }) => {
  const [showModal, setShowModal] = useState(false);
  const [postText, setPostText] = useState<string>('');
  const [postImage, setPostImage] = useState<File | null>();


  const handleCreatePost = async () => {
    try {
      let form_data = new FormData();
      if(postImage) {
        form_data.append("image", postImage, postImage.name)
      }
      form_data.append("text", postText)
      const response = await fetch(`${process.env.REACT_APP_BACKEND_HOST}/api/feed/create-post/`, {
        method: "POST",
        headers: {
          "Authorization": "Token "+ localStorage.getItem("token") //må kanskje endres?
        },
        body: form_data,
      });
      if(!response.ok){
        throw new Error("Failed to create new post")
      }

      const newPost = await response.json();
      onCreatePost(newPost);
      
    }
    catch (e) {
      console.log("Error while posting: ", e)
    }
  

    setShowModal(false);
    setPostText('');
    setPostImage(null);


  };

    const handleCloseModal = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            setShowModal(false);
        }
    };

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.files && event.target.files[0]) {
        const file = event.target.files[0];
        if (file.type.match('image.*')) { // Basic check for an image file
          setPostImage(file);
        } else {
          alert("Please select an image file.");
          setPostImage(null)
        }
      }
    };


  return (
    <div>
      <button onClick={() => setShowModal(true)} 
        className="p-0 w-12 h-12 bg-blue-500 text-white 
        rounded-full fixed bottom-20 right-5 flex items-center 
        justify-center text-2xl">
        <i className="fas fa-plus"></i> 
      </button>

      {showModal && (
        <div onClick={handleCloseModal} className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto mt-20 p-5 border w-96 shadow-lg rounded-md bg-white">

            <button 
              onClick={() => setShowModal(false)} 
              className="absolute top-0 left-0 mt-2 ml-2 text-gray-700 hover:text-gray-900">
              <i className="fas fa-times"></i> 
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
                  type="file"
                  placeholder="Upload an image (optional)"
                  onChange={handleImageUpload}
                  accept="image/png, image/jpeg, image/jpg"
                  className="border p-2 w-full mt-2"
                />
              </div>
              <button
                onClick={handleCreatePost}
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
