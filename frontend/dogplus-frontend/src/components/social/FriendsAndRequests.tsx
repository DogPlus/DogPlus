import React, { useState, useEffect } from "react";
import { PublicUser } from "../../types/user";
import { FriendRequest } from "../../types/social";

const FriendsAndRequests = () => {
  const [activeTab, setActiveTab] = useState("friends");
  const [friends, setFriends] = useState<PublicUser[]>([]);
  const [pendingRequests, setPendingRequests] = useState<FriendRequest[]>([]);

  useEffect(() => {
    fetchFriends();
    fetchPendingRequests();
  }, []);

  const fetchFriends = async () => {
    const response = await fetch(
      `${process.env.REACT_APP_BACKEND_HOST}/api/social/followers/`,
      {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      }
    );
    if (response.ok) {
      const data = await response.json();
      setFriends(data.filter((f: FriendRequest) => f.is_accepted));
    }
  };

  const fetchPendingRequests = async () => {
    const response = await fetch(
      `${process.env.REACT_APP_BACKEND_HOST}/api/social/follow-requests/`,
      {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      }
    );
    if (response.ok) {
      const data = await response.json();
      setPendingRequests(data.filter((f: FriendRequest) => !f.is_accepted));
    }
  };

  return (
    <div className="container mx-auto mt-10">
      <div className="flex border-b">
        <button
          className={`flex-1 py-2 text-center ${
            activeTab === "friends"
              ? "border-b-4 border-blue-500 text-blue-500"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("friends")}
        >
          {friends.length} Friends
        </button>
        <button
          className={`flex-1 py-2 text-center ${
            activeTab === "requests"
              ? "border-b-4 border-blue-500 text-blue-500"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("requests")}
        >
          {pendingRequests.length} Pending Requests
        </button>
      </div>
      <div className="content mt-3">
        {activeTab === "friends" && (
          <ul>
            {friends.map((friend) => (
              <li key={friend.id} className="py-2 border-b">
                {friend.username}
              </li>
            ))}
          </ul>
        )}
        {activeTab === "requests" && (
          <ul>
            {pendingRequests.map((request) => (
              <li key={request.id} className="py-2 border-b">
                {request.followed.username}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default FriendsAndRequests;
