import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FriendCard from "../components/FriendCard.tsx";
import useFriends from "../hooks/useFriends.ts";

const Friends: React.FC = () => {
  const [friendSearchTerm, setFriendSearchTerm] = useState("");
  const [userSearchTerm, setUserSearchTerm] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [selectedFriendId, setSelectedFriendId] = useState<string | null>(null);
  const navigate = useNavigate();

  const {
    isLoading,
    error,
    friends,
    activities,
    selectedFriend,
    searchResults,
    getFriends,
    getActivities,
    searchUsers,
    getFriendDetail,
    followUser,
    unfollowUser,
    handleTakeClick,
    handleMediaClick,
    clearSelectedFriend,
  } = useFriends();

  useEffect(() => {
    // Fetch friends list and activities
    getFriends();
    getActivities();
  }, []);

  // Filter friends based on search
  const filteredFriends = friends.filter((friend) =>
    friend.displayName.toLowerCase().includes(friendSearchTerm.toLowerCase())
  );

  // Handle searching for users to add
  const handleSearchUsers = () => {
    if (userSearchTerm.trim()) {
      searchUsers(userSearchTerm);
      setShowSearchResults(true);
    }
  };

  // Handle selecting a friend to view detail
  const handleSelectFriend = (friendId: string) => {
    setSelectedFriendId(friendId);
    getFriendDetail(friendId);
  };

  // Handle closing friend card
  const handleCloseFriendCard = () => {
    setSelectedFriendId(null);
    clearSelectedFriend();
  };

  // Function to refresh activities after an action (like following someone)
  const refreshActivities = () => {
    getActivities();
    getFriends();
  };

  // Function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Check if user is already following another user
  const isFollowing = (userId: string) => {
    return friends.some((friend) => friend._id === userId);
  };

  // Function to render activity item based on type
  const renderActivity = (activity: any) => {
    switch (activity.activityType) {
      case "NEW_FOLLOWER":
        return (
          <div
            key={activity._id}
            className="flex items-center p-3 bg-blue-50 rounded-md mb-3"
          >
            <div className="h-8 w-8 bg-gray-300 rounded-full mr-3 flex items-center justify-center text-xs overflow-hidden">
              <img
                src={activity.follower?.avatar || "/default-avatar.png"}
                alt={activity.follower?.displayName || "User"}
                className="h-8 w-8 rounded-full object-cover"
                crossOrigin="anonymous"
              />
            </div>
            <div className="flex-1">
              <p className="text-sm">
                <span className="font-semibold">
                  {activity.follower?.displayName}
                </span>{" "}
                started following you
              </p>
              <p className="text-xs text-gray-500">
                {formatDate(activity.createdAt)}
              </p>
            </div>
            {/* Follow back button if you're not already following them */}
            {activity.follower && !isFollowing(activity.follower._id) && (
              <button
                onClick={() => {
                  followUser(activity.follower._id);
                  refreshActivities();
                }}
                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
              >
                Follow Back
              </button>
            )}
            {/* Already following label */}
            {activity.follower && isFollowing(activity.follower._id) && (
              <span className="text-green-600 text-sm">Following ✓</span>
            )}
          </div>
        );

      case "ADDED_TO_WATCHED":
        return (
          <div
            key={activity._id}
            className="flex items-center p-3 bg-gray-50 rounded-md mb-3"
          >
            <div className="h-8 w-8 bg-gray-300 rounded-full mr-3 flex items-center justify-center text-xs overflow-hidden">
              <img
                src={activity.userId.avatar || "/default-avatar.png"}
                alt={activity.userId.displayName}
                className="h-8 w-8 rounded-full object-cover"
                crossOrigin="anonymous"
              />
            </div>
            <div className="flex-1">
              <p className="text-sm">
                <span className="font-semibold">
                  {activity.userId.displayName}
                </span>{" "}
                added an anime to their watched list
              </p>
              <p className="text-xs text-gray-500">
                {formatDate(activity.createdAt)}
              </p>
            </div>
          </div>
        );

      case "POSTED_REVIEW":
        return (
          <div
            key={activity._id}
            className="flex items-center p-3 bg-gray-50 rounded-md mb-3"
          >
            <div className="h-8 w-8 bg-gray-300 rounded-full mr-3 flex items-center justify-center text-xs overflow-hidden">
              <img
                src={activity.userId.avatar || "/default-avatar.png"}
                alt={activity.userId.displayName}
                className="h-8 w-8 rounded-full object-cover"
                crossOrigin="anonymous"
              />
            </div>
            <div className="flex-1">
              <p className="text-sm">
                <span className="font-semibold">
                  {activity.userId.displayName}
                </span>{" "}
                posted a review
              </p>
              <p className="text-xs text-gray-500">
                {formatDate(activity.createdAt)}
              </p>
            </div>
          </div>
        );

      case "UPDATED_TOP_THREE":
        return (
          <div
            key={activity._id}
            className="flex items-center p-3 bg-gray-50 rounded-md mb-3"
          >
            <div className="h-8 w-8 bg-gray-300 rounded-full mr-3 flex items-center justify-center text-xs overflow-hidden">
              <img
                src={activity.userId.avatar || "/default-avatar.png"}
                alt={activity.userId.displayName}
                className="h-8 w-8 rounded-full object-cover"
                crossOrigin="anonymous"
              />
            </div>
            <div className="flex-1">
              <p className="text-sm">
                <span className="font-semibold">
                  {activity.userId.displayName}
                </span>{" "}
                updated their top three anime
              </p>
              <p className="text-xs text-gray-500">
                {formatDate(activity.createdAt)}
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
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

          {isLoading && <p className="text-gray-500">Loading...</p>}

          {!isLoading && filteredFriends.length === 0 && (
            <p className="text-gray-500 italic">No friends found.</p>
          )}

          <ul className="space-y-2">
            {filteredFriends.map((friend) => (
              <li
                key={friend._id}
                className="flex items-center p-2 rounded hover:bg-gray-100 cursor-pointer"
                onClick={() => handleSelectFriend(friend._id)}
              >
                <div className="h-8 w-8 bg-gray-300 rounded-full mr-2 flex items-center justify-center text-xs overflow-hidden">
                  <img
                    src={friend.avatar}
                    alt={friend.displayName}
                    className="h-8 w-8 rounded-full object-cover"
                    crossOrigin="anonymous"
                  />
                </div>
                <span className="flex-1">{friend.displayName}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    unfollowUser(friend._id);
                  }}
                  className="text-red-500 text-sm hover:text-red-700"
                >
                  Unfollow
                </button>
              </li>
            ))}
          </ul>

          {/* Find Friends Section */}
          <div className="mt-6">
            <h3 className="font-bold text-lg mb-3">Find Friends</h3>
            <div className="flex mb-2">
              <input
                type="text"
                className="flex-1 p-2 border border-gray-300 rounded-l-md"
                placeholder="Search Users"
                value={userSearchTerm}
                onChange={(e) => setUserSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearchUsers()}
              />
              <button
                onClick={handleSearchUsers}
                className="bg-blue-500 text-white px-3 py-2 rounded-r-md hover:bg-blue-600"
              >
                Search
              </button>
            </div>

            {showSearchResults && (
              <div className="mt-3">
                {isLoading && <p className="text-gray-500">Searching...</p>}

                {!isLoading && searchResults.length === 0 && (
                  <p className="text-gray-500 italic">No users found.</p>
                )}

                <ul className="space-y-2 max-h-40 overflow-y-auto">
                  {searchResults.map((user) => (
                    <li
                      key={user._id}
                      className="flex items-center p-2 bg-gray-50 rounded"
                    >
                      <div className="h-8 w-8 bg-gray-300 rounded-full mr-2 flex items-center justify-center text-xs overflow-hidden">
                        <img
                          src={user.avatar}
                          alt={user.displayName}
                          className="h-8 w-8 rounded-full object-cover"
                          crossOrigin="anonymous"
                        />
                      </div>
                      <span className="flex-1">{user.displayName}</span>
                      <button
                        onClick={() => {
                          followUser(user._id);
                          // Hide search results after following
                          setShowSearchResults(false);
                          setUserSearchTerm("");
                        }}
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
                      >
                        Follow
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Activity log main content */}
        <div className="w-3/4 p-6">
          <h2 className="font-bold text-xl mb-6 underline">Activity Log</h2>

          {isLoading && <p className="text-gray-500">Loading activities...</p>}

          {!isLoading && activities.length === 0 && (
            <p className="text-gray-500 italic">
              No recent activity from your friends.
            </p>
          )}

          {/* Activity list */}
          <div className="space-y-4">
            {activities.map((activity) => renderActivity(activity))}
          </div>

          {/* Error message if applicable */}
          {error && (
            <div className="mt-4 p-3 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}
        </div>
      </div>

      {/* Friend Card Modal */}
      {selectedFriendId && selectedFriend && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="max-w-2xl w-full">
            <FriendCard
              friend={selectedFriend}
              onClose={handleCloseFriendCard}
              onTakeClick={handleTakeClick}
              onMediaClick={handleMediaClick}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Friends;
