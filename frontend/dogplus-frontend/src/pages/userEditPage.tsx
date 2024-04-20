import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loading } from '../components/common/loading';
import { User } from '../types/user';

export const UserEditPage = () => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_HOST}/api/auth/user/${localStorage.getItem('user_id')}`, {
          method: 'GET',
          headers: {
            Authorization: `Token ${localStorage.getItem('token')}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data);
        } else {
          // Handle error
          console.error('Failed to fetch user data');
        }
      } catch (error) {
        // Handle fetch error
        console.error('Error fetching user data:', error);
      }
    };

    fetchUser();
  }, []);

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      const formData = new FormData();
      formData.append('profile_image', file);
      formData.append('username', user?.username || '');
      formData.append('email', user?.email || '');

      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_HOST}/api/auth/user/${localStorage.getItem('user_id')}`, {
          method: 'POST',
          headers: {
            Authorization: `Token ${localStorage.getItem('token')}`,
          },
          body: formData,
        });

        if (response.ok) {
          // Assuming the response contains updated user data
          const data = await response.json();
          setUser(data);
          navigate(`/user`);
        } else {
          // Handle error
          console.error('Failed to update user image');
        }
      } catch (error) {
        // Handle fetch error
        console.error('Error updating user image:', error);
      }
    }
  };

  if (!user) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col items-center justify-center mb-2 mt-16 relative">
      <div className="w-20 h-20 rounded-full mb-3">
        <label htmlFor="profile_image_input" className="absolute w-20 h-20 flex justify-center items-center rounded-full bg-black opacity-70 cursor-pointer">
          <svg className="opacity-100" width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M37.2499 7.125C35.2499 5 33.1249 2.875 30.9999 0.8125C30.5624 0.375 30.0624 0.125 29.4999 0.125C28.9374 0.125 28.3749 0.3125 27.9999 0.75L4.43745 24.125C4.06245 24.5 3.81245 24.9375 3.62495 25.375L0.187446 35.875C-5.42551e-05 36.375 0.124946 36.875 0.374946 37.25C0.687446 37.625 1.12495 37.875 1.68745 37.875H1.93745L12.6249 34.3125C13.1249 34.125 13.5624 33.875 13.8749 33.5L37.3124 10.125C37.6874 9.75 37.9374 9.1875 37.9374 8.625C37.9374 8.0625 37.6874 7.5625 37.2499 7.125ZM11.8749 31.5625C11.8124 31.625 11.7499 31.625 11.6874 31.6875L3.62495 34.375L6.31245 26.3125C6.31245 26.25 6.37495 26.1875 6.43745 26.125L23.6249 9L29.0624 14.4375L11.8749 31.5625ZM30.9999 12.4375L25.5624 7L29.3749 3.1875C31.1874 4.9375 32.9999 6.8125 34.7499 8.625L30.9999 12.4375Z" fill="white"/>
          </svg>
        </label>
        <input
          id="profile_image_input"
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleImageChange}
        />
        <img src={user.profile_image} className="p-2" alt="Profile Image" />
      </div>
      <h2 className="text-2xl font-semibold">{user.username}</h2>
    </div>
  );
};
