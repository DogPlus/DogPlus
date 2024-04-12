// Create a react component
import React from 'react';
import { Comment } from '../types/post';
// Take props as an argument
interface CommentProps {
  comment: Comment;
}

export const CommentComponent: React.FC<CommentProps> = ({comment}) => {

  const date = new Date(comment.created_at);


  // Get month and day from the date object
  const month = new Intl.DateTimeFormat('en', { month: 'long' }).format(date);
  const day = date.getDate();

  // Combine month and day to form the desired format
  const formattedDate = `${month} ${day}`;

  return (
    <div key={comment.id} className="flex items-center w-100 mb-5">
      <img className="w-12 h-12 rounded-full mr-3" src={undefined} alt="Profile Image" />
      <div className="ml-5 flex flex-col">
        <p className='text-sm text-gray-700'>{comment.author.substring(0,15)} - {formattedDate}</p>
        <p className='text-base'>{comment.text}</p>
      </div>
    </div>
  );
}
