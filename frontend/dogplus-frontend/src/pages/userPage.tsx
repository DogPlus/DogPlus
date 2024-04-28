import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loading } from '../components/common/loading';
import { PublicUser } from '../types/user';

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
<div className="m-4">
  <div className="flex items-center mb-2">
    <img className="w-12 h-12 rounded-full mr-3" src={user.profile_image} alt="Profile Image" />
    <div>
      <h2 className="text-2xl font-semibold">{user.username}</h2>
    </div>
  </div>
  <div className="flex mb-2">
    <button type="button" className="ml-auto text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center" onClick={e => navigate(`/user/edit/${localStorage.getItem('user_id')}`)}>Edit</button>
  </div>
</div>
  );
};
