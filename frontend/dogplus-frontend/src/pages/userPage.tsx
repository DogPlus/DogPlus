import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loading } from '../components/common/loading';
import { PublicUser } from '../types/user';
import { logout } from '../utils/authUtils';

export const UserPage = () => {
  const [user, setUser] = useState<PublicUser | null>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchUser = async () => {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_HOST}/api/auth/user/${localStorage.getItem('user_id')}`, {
          method: 'GET',
          headers: {
            Authorization: `Token ${localStorage.getItem('token')}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setUser(data);
      }
    };
    fetchUser();
  }, []);

  if (!user) {
    return <Loading />;
  }

  return (
<div className="m-4 h-full flex flex-col">
  <div>
    <div className="flex items-center mb-2">
      <img className="w-12 h-12 object-cover rounded-full mr-3" src={user.profile_image} alt="Profile Image" />
      <div>
        <h2 className="text-2xl font-semibold">{user.username}</h2>
      </div>
    </div>
    <div className="flex mb-2">
      <button type="button" className="ml-auto text-foreground hover:text-white border bg-accent-0 hover:bg-accent-800 focus:ring-4 focus:outline-none focus:ring-accent-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center" onClick={e => navigate(`/user/edit/${localStorage.getItem('user_id')}`)}>Edit</button>
    </div>
  </div>
 
  <button
    className="mt-auto w-full justify-end bg-red-600 px-6 py-5 mb-5 text-sm font-bold leading-none text-white transition duration-300 md:w-96 rounded-2xl focus:ring-4"
    type="submit"
    onClick={logout}
  >
    Logout
  </button>
</div>
  );
};
