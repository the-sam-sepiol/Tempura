import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface Friend {
  _id: string;
  displayName: string;
  avatar: string;
}

interface Activity {
  _id: string;
  userId: {
    _id: string;
    displayName: string;
  };
  activityType: "ADDED_TO_WATCHED" | "POSTED_REVIEW" | "UPDATED_TOP_THREE";
  animeId: number;
  animeName?: string;
  details: {
    oldTopThree?: Array<{ animeId: number; position: number }>;
    newTopThree?: Array<{ animeId: number; position: number }>;
    rating?: number;
    reviewId?: string;
  };
  createdAt: Date;
}

const Friends: React.FC = () => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [friendSearchTerm, setFriendSearchTerm] = useState("");
  const navigate = useNavigate();

  // Sample data for development
  const sampleFriends = [
    { _id: "1", displayName: "User1", avatar: "/default-avatar.png" },
    { _id: "2", displayName: "User2", avatar: "/default-avatar.png" },
  ];

  useEffect(() => {
    // Fetch friends list
    const fetchFriends = async () => {
      try {
        const response = await fetch("/api/friends", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setFriends(data);
        }
      } catch (error) {
        console.error("Error fetching friends:", error);
      }
    };

    // Fetch activity log (commented out as per request for empty activity log)
    // const fetchActivities = async () => { ... };

    fetchFriends();
    // fetchActivities();
  }, []);

  // Filter friends based on search
  const filteredFriends =
    friends.length > 0
      ? friends.filter((friend) =>
          friend.displayName
            .toLowerCase()
            .includes(friendSearchTerm.toLowerCase())
        )
      : sampleFriends.filter((friend) =>
          friend.displayName
            .toLowerCase()
            .includes(friendSearchTerm.toLowerCase())
        );

  // Handle add friend
  const handleAddFriend = () => {
    navigate("/add-friend");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        {/* Friends list sidebar */}
        <div className="w-1/4 bg-white p-4 border-r border-gray-300 min-h-screen">
          <h2 className="font-bold text-lg mb-4">Friend's List</h2>

          <div className="mb-4">
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Search Friend"
              value={friendSearchTerm}
              onChange={(e) => setFriendSearchTerm(e.target.value)}
            />
          </div>

          <ul className="space-y-2">
            {filteredFriends.map((friend) => (
              <li key={friend._id} className="flex items-center">
                <div className="h-6 w-6 bg-gray-300 rounded-full mr-2 flex items-center justify-center text-xs overflow-hidden">
                  <img
                    src={friend.avatar}
                    alt={friend.displayName}
                    className="h-6 w-6 rounded-full object-cover"
                    crossOrigin="anonymous"
                  />
                </div>
                <span>{friend.displayName}</span>
              </li>
            ))}
          </ul>

          {/* Friend Requests Section - Only one friend request */}
          <div className="mt-6">
            <h3 className="font-bold text-lg mb-3">Friend Requests</h3>

            <div className="space-y-3">
              <div className="bg-blue-50 p-3 rounded-md flex items-center justify-between">
                <div className="flex items-center">
                  <div className="h-8 w-8 bg-gray-300 rounded-full mr-3 flex items-center justify-center text-xs overflow-hidden">
                    <img
                      src="/default-avatar.png"
                      alt="User3"
                      className="h-8 w-8 rounded-full object-cover"
                      crossOrigin="anonymous"
                    />
                  </div>
                  <span>User3 wants to be your friend</span>
                </div>
                <div className="flex space-x-2">
                  <button className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">
                    Accept
                  </button>
                  <button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
                    Decline
                  </button>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={handleAddFriend}
            className="mt-4 flex items-center text-blue-500"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            Add Friend
          </button>
        </div>

        {/* Activity log main content - Empty as requested */}
        <div className="w-3/4 p-6">
          <h2 className="font-bold text-xl mb-6 underline">Activity Log</h2>

          <p className="text-gray-500 italic">
            No recent activity from your friends.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Friends;
