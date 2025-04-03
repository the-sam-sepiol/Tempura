import { useState, useEffect } from "react";
import { Friend, Take, WatchedItem } from "../components/FriendCard";

// Basic user profile type
export interface FriendProfile {
  _id: string;
  displayName: string;
  avatar: string;
}

// Activity type matching your backend model
export interface Activity {
  _id: string;
  userId: {
    _id: string;
    displayName: string;
    avatar: string;
  };
  activityType: "NEW_FOLLOWER" | "ADDED_TO_WATCHED" | "POSTED_REVIEW" | "UPDATED_TOP_THREE";
  animeId: number;
  details: {
    oldTopThree?: Array<{ animeId: number; position: number }>;
    newTopThree?: Array<{ animeId: number; position: number }>;
    rating?: number;
    reviewId?: string;
    followerId?: string;
  };
  follower?: {
    _id: string;
    displayName: string;
    avatar: string;
  };
  createdAt: string;
}

// Friend detail type for FriendCard
export interface FriendDetail {
  name: string;
  avatar: string;
  takes: Take[];
  watchedList: WatchedItem[];
}

/**
 * Custom hook for friend-related functionality
 */
const useFriends = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [friends, setFriends] = useState<FriendProfile[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedFriend, setSelectedFriend] = useState<FriendDetail | null>(null);
  const [searchResults, setSearchResults] = useState<FriendProfile[]>([]);

  // Get the auth token
  const getToken = () => {
    return localStorage.getItem("token");
  };

  // API request headers
  const getHeaders = () => {
    return {
      headers: {
        Authorization: `Bearer ${getToken()}`,
        'Content-Type': 'application/json'
      }
    };
  };

  // Get friends list (users you follow)
  const getFriends = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch("/api/friends/following", getHeaders());
      
      if (!response.ok) {
        throw new Error(`Failed to fetch friends: ${response.status}`);
      }
      
      const data = await response.json();
      setFriends(data);
    } catch (error) {
      console.error("Error fetching friends:", error);
      setError(error instanceof Error ? error.message : "Failed to fetch friends");
    } finally {
      setIsLoading(false);
    }
  };

  // Get activity log (including new followers)
  const getActivities = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch("/api/friends/activity", getHeaders());
      
      if (!response.ok) {
        throw new Error(`Failed to fetch activities: ${response.status}`);
      }
      
      const data = await response.json();
      setActivities(data);
    } catch (error) {
      console.error("Error fetching activities:", error);
      setError(error instanceof Error ? error.message : "Failed to fetch activities");
    } finally {
      setIsLoading(false);
    }
  };

  // Search for users to add as friends
  const searchUsers = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/friends/search/${query}`, getHeaders());
      
      if (!response.ok) {
        throw new Error(`Failed to search users: ${response.status}`);
      }
      
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error("Error searching users:", error);
      setError(error instanceof Error ? error.message : "Failed to search users");
    } finally {
      setIsLoading(false);
    }
  };

  // Get friend details for FriendCard
  const getFriendDetail = async (friendId: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/friends/${friendId}`, getHeaders());
      
      if (!response.ok) {
        throw new Error(`Failed to fetch friend details: ${response.status}`);
      }
      
      const data = await response.json();
      setSelectedFriend(data);
    } catch (error) {
      console.error("Error fetching friend details:", error);
      setError(error instanceof Error ? error.message : "Failed to fetch friend details");
    } finally {
      setIsLoading(false);
    }
  };

  // Follow a user
  const followUser = async (userId: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/friends/follow/${userId}`, {
        method: 'POST',
        ...getHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`Failed to follow user: ${response.status}`);
      }
      
      // Refresh friends list
      getFriends();
    } catch (error) {
      console.error("Error following user:", error);
      setError(error instanceof Error ? error.message : "Failed to follow user");
    } finally {
      setIsLoading(false);
    }
  };

  // Unfollow a user
  const unfollowUser = async (userId: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/friends/unfollow/${userId}`, {
        method: 'POST',
        ...getHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`Failed to unfollow user: ${response.status}`);
      }
      
      // Refresh friends list
      getFriends();
    } catch (error) {
      console.error("Error unfollowing user:", error);
      setError(error instanceof Error ? error.message : "Failed to unfollow user");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle take click in FriendCard
  const handleTakeClick = (take: Take) => {
    console.log("Take clicked:", take);
    // Navigate to anime page or show review details
  };

  // Handle media click in FriendCard
  const handleMediaClick = (media: WatchedItem) => {
    console.log("Media clicked:", media);
    // Navigate to anime page
  };

  // Clear selected friend
  const clearSelectedFriend = () => {
    setSelectedFriend(null);
  };

  return {
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
    clearSelectedFriend
  };
};

export default useFriends;