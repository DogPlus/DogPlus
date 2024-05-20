import { Button, FileInput, Label, Modal, Textarea } from "flowbite-react";
import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { v4 as uuidv4 } from 'uuid';

import { Post } from "../types/post";

interface CreatePostButtonProps {
  onCreatePost: (newPost: Post) => void;
}

export const CreatePostButton: React.FC<CreatePostButtonProps> = ({
  onCreatePost,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [postText, setPostText] = useState<string>("");
  const [postImage, setPostImage] = useState<File | null>();
  const [postVideo, setPostVideo] = useState<File | null>();

  const handleCreatePost = async () => {
    try {
      let form_data = new FormData();
      if (postImage) {
        form_data.append("image", postImage, postImage.name);
      }
      if (postVideo) {
        form_data.append("video", postVideo, uuidv4() + postVideo.name);
      }
      form_data.append("text", postText);
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_HOST}/api/feed/create-post/`,
        {
          method: "POST",
          headers: {
            Authorization: "Token " + localStorage.getItem("token"), 
          },
          body: form_data,
        }
      );
      if (!response.ok) {
        throw new Error("Failed to create new post");
      }

      const newPost = await response.json();
      onCreatePost(newPost);
    } catch (e) {
      toast.error("Failed to create new post");
    }

    setShowModal(false);
    setPostText("");
    setPostImage(null);
    setPostVideo(null);
  };

  const handleMediaUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (file.type.startsWith("image/")) {
        setPostImage(file);
        setPostVideo(null); // clear video if an image is uploaded
      } else if (file.type.startsWith("video/")) {
        setPostVideo(file);
        setPostImage(null); // clear image if a video is uploaded
      } else {
        toast.error("Invalid file type. Must be either video or image");
        setPostImage(null);
        setPostVideo(null);
      } 

    }
  };
  
  return (
    <div>
      <button
        onClick={() => setShowModal(true)}
        className="p-0 w-12 h-12 bg-accent-0 text-white 
        rounded-full fixed bottom-24 right-5 flex items-center 
        justify-center text-2xl"
      >
        <i className="fas fa-plus"></i>
      </button>

      <Modal show={showModal} position="center" size="xl" onClose={() => setShowModal(false)}>
        <Modal.Header>
          Create a new post
        </Modal.Header>
        <Modal.Body>
                <div className="mb-2 block">
                  <Label htmlFor="postText" value="Your Post Text" />
                </div>
                <Textarea
                  id="postText"
                  className="w-full text-md"
                  placeholder="Write something..."
                  onChange={(e) => setPostText(e.target.value)}
                  rows={6}
                  required
                />
                {postImage && (
                  <div>
                    <img
                      src={URL.createObjectURL(postImage)}
                      alt="Post"
                      className="w-full h-64 mt-2 object-cover rounded"
                    />
                    <Button
                      onClick={() => setPostImage(null)}
                      className="mt-2 bg-red-500 text-white p-2 rounded"
                    >
                      Remove image
                    </Button>
                  </div>
                )}
                {postVideo && (
                  <div>
                    <video
                      controls
                      playsInline
                      loop
                      muted
                      autoPlay
                      className="w-full h-64 mt-2 object-cover rounded"
                    >
                      <source src={URL.createObjectURL(postVideo)} />
                    </video>
                    <Button
                      onClick={() => setPostVideo(null)}
                      className="mt-2 bg-red-500 text-white p-2 rounded"
                    >
                      Remove video
                    </Button>
                  </div>
                )
                }
                {(!postImage && !postVideo) && (
                  <div className="mt-2">
                <div className="flex items-center justify-center w-full">
                    <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                            </svg>
                            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Tap to upload media to post</span></p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG, JPEG, MP4, OOG or WEBM</p>
                        </div>
                        <input 
                          id="dropzone-file" 
                          type="file" 
                          className="hidden"
                          onChange={handleMediaUpload}
                          accept="image/png, image/jpeg, image/jpg, video/mp4, video/oog, video/webm"
                        />
                    </label>
                </div>
                </div>
              )}
              <button
                onClick={handleCreatePost}
                className="mt-4 bg-accent-0 text-white p-2 rounded w-full"
              >
                Post
              </button>
        </Modal.Body>
      </Modal>
    </div>
  );
};
