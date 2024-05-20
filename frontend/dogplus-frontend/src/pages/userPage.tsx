import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import UserCard from "../components/UserCard";
import { Loading } from "../components/common/loading";
import FriendsAndRequests from "../components/social/FriendsAndRequests";
import useUser from "../hooks/useUser";
import { PublicUser, UserRole } from "../types/user";
import { BookingsOverview } from "../components/serviceProvider/BookingsOverview";

export const UserPage = () => {
  const { user } = useUser();
  const [usernameToFollow, setUsernameToFollow] = useState("");
  const [searchResults, setSearchResults] = useState<PublicUser[]>([]);
  const [showSearch, setShowSearch] = useState(false);
  const [activeTab, setActiveTab] = useState("friends");
  const navigate = useNavigate();
  const [refreshKey, setRefreshKey] = useState<number>(0);

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
    if (response.ok) {
      setSearchResults([]);
      setRefreshKey((prev) => prev + 1);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_HOST}/api/auth/logout/`,
        {
          method: "POST",
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.ok) {
        localStorage.removeItem("token");
        navigate("/auth");
      }
    } catch (error) {
      console.error("Logout failed", error);
      toast.error("Failed to logout");
    }
  };

  if (!user) {
    return <Loading />;
  }

  return (
    <div className="m-4">
      <div className="flex items-center mb-4">
        <img
          className="w-12 h-12 rounded-full mr-3"
          src={user?.profile_image}
          alt="Profile Image"
        />
        <h2 className="text-2xl font-semibold">{user?.username}</h2>
        <button
          type="button"
          className="ml-auto text-foreground hover:text-white border bg-accent-0 hover:bg-accent-800 focus:ring-4 focus:outline-none focus:ring-accent-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
          onClick={() =>
            navigate(`/user/edit/${localStorage.getItem("user_id")}`)
          }
        >
          <div className="fas fa-edit"></div>
        </button>
        <button
          onClick={handleLogout}
          className="text-red-500 hover:text-white hover:bg-red-600 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm p-2.5 ml-2"
          title="Logout"
        >
          <div className="fas fa-sign-out-alt"></div>
        </button>
      </div>
      <div className="flex mb-6 space-x-4">
        <button
          type="button"
          className={`flex-1 py-3 px-6 rounded ${
            activeTab === "friends"
              ? "bg-accent-0 text-white"
              : "ring-2 ring-accent-0 text-black"
          }`}
          onClick={() => setActiveTab("friends")}
        >
          <div className="fas fa-user-friends mr-2"></div>
          Friends
        </button>
        <button
          type="button"
          className={`flex-1 py-3 px-6 rounded ${
            activeTab === "bookings"
              ? "bg-accent-0 text-white"
              : "ring-2 ring-accent-0 text-black"
          }`}
          onClick={() => setActiveTab("bookings")}
        >
          <div className="fas fa-calendar-alt mr-2"></div>
          Bookings
        </button>
      </div>
      {activeTab === "friends" && (
        <>
          <div className="flex mb-2">
            <button
              type="button"
              className="bg-accent-0 hover:bg-accent-100 text-white font-bold py-2 px-4 rounded ml-2"
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
                  className="bg-accent-0 hover:bg-accent-100 text-white font-bold py-2 px-4 rounded"
                  onClick={handleSearch}
                >
                  Search
                </button>
              </div>
              <div>
                {searchResults.map((user) => {
                  return (
                    <UserCard
                      key={user.id}
                      user={user}
                      onFollow={handleFollow}
                    />
                  );
                })}
              </div>
            </div>
          )}
          <FriendsAndRequests refreshKey={refreshKey} />
        </>
      )}
      {activeTab === "bookings" && user.role === UserRole.User && (
        <BookingsOverview />
      )}
    </div>
  );
};
