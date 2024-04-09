import React, { useState } from 'react';

import { NewPost, Post } from '../types/post'

interface AddPostButtonProps {
    onAddPost: (newPost: Post) => void;
  }

export const AddPostButton: React.FC<AddPostButtonProps> = () => {
  const [showModal, setShowModal] = useState(false);
  const [postText, setPostText] = useState('');
  const [postImage, setPostImage] = useState<File | "">("");


  const handlePost = async () => {
    
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_HOST}/api/feed/posts/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Token "+ localStorage.getItem("token") //må kanskje endres?
        },
        body: JSON.stringify({
          author: 5, // må endres til get user id
          date: new Date().toISOString(), //må formateres penere
          text: postText,
          image: postImage
        }),
      });
      if(!response.ok){
        throw new Error("Failed to create new post")
      }
    }
    catch (e) {
      console.log("Error while posting: ", e)
    }
  

    setShowModal(false);
    setPostText('');
    setPostImage('');


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
          setPostImage('')
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
