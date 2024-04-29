import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserCard from "../components/UserCard";
import { Loading } from "../components/common/loading";
import { PublicUser } from "../types/user";
import useUser from "../hooks/useUser";
import FriendsAndRequests from "../components/social/FriendsAndRequests";

export const UserPage = () => {
  const { user } = useUser();
  const [usernameToFollow, setUsernameToFollow] = useState("");
  const [searchResults, setSearchResults] = useState<PublicUser[]>([]);
  const [showSearch, setShowSearch] = useState(false);
  const navigate = useNavigate();

  const handleSearchToggle = () => {
    setShowSearch(!showSearch);
  };

  const handleSearch = async () => {
    const response = await fetch(
      `${process.env.REACT_APP_BACKEND_HOST}/api/social/search/?username=${usernameToFollow}`,
      {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      }
    );
    if (response.ok) {
      const data = await response.json();
      setSearchResults(data.users);
    }
  };

  const handleFollow = async (userId: string) => {
    const response = await fetch(
      `${process.env.REACT_APP_BACKEND_HOST}/api/social/follow/${userId}/`,
      {
        method: "POST",
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      }
    );
  };

  if (!user) {
    return <Loading />;
  }

  return (
    <div className="m-4">
      <div className="flex items-center mb-2">
        <img
          className="w-12 h-12 rounded-full mr-3"
          src={user?.profile_image}
          alt="Profile Image"
        />
        <h2 className="text-2xl font-semibold">{user?.username}</h2>
        <button
          type="button"
          className="ml-auto text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
          onClick={() =>
            navigate(`/user/edit/${localStorage.getItem("user_id")}`)
          }
        >
          Edit
        </button>
      </div>
      <div className="flex mb-2">
        <button
          type="button"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-2"
          onClick={handleSearchToggle}
        >
          Add friend
        </button>
      </div>
      {showSearch && (
        <div>
          <div className="flex mb-2">
            <input
              type="text"
              value={usernameToFollow}
              onChange={(e) => setUsernameToFollow(e.target.value)}
              placeholder="Enter username to follow"
              className="border p-2 mr-2"
            />
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={handleSearch}
            >
              Search
            </button>
          </div>
          <div>
            {searchResults.map((user) => {
              return (
                <UserCard key={user.id} user={user} onFollow={handleFollow} />
              );
            })}
          </div>
        </div>
      )}
      <FriendsAndRequests />
    </div>
  );
};
