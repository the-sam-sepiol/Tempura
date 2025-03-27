import React, { useState } from 'react';

export interface WatchedItem {
  id: number | string;
  image: string;
  title: string;
  rank?: number;
}

export interface Take {
  id: number | string;
  rating: number;
  comment: string;
  movie?: {
    image: string;
    title: string;
  };
}

export interface Friend {
  name: string;
  avatar: string;
  takes: Take[];
  watchedList: WatchedItem[];
}

export interface FriendCardProps {
  friend: Friend;
  onClose?: () => void;
  onTakeClick?: (take: Take) => void;
  onMediaClick?: (media: WatchedItem) => void;
  maxVisibleItems?: number;
  showPedestal?: boolean;
  className?: string;
}

// Inline Icon Components
const CloseIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const ChevronRightIcon: React.FC<{ className?: string }> = ({ className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    className={className}
  >
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const StarIcon: React.FC<{ filled?: boolean }> = ({ filled = false }) => (
  <span className={`text-lg ${filled ? "text-yellow-400" : "text-gray-300"}`}>★</span>
);

const FriendCard: React.FC<FriendCardProps> = ({
  friend,
  onClose = () => {},
  onTakeClick = () => {},
  onMediaClick = () => {},
  maxVisibleItems = 4,
  showPedestal = true,
  className = ""
}) => {
  // Ensure friend object has all required properties
  const friendData: Friend = {
    name: friend.name || "User",
    avatar: friend.avatar || "/api/placeholder/100/100",
    takes: friend.takes || [],
    watchedList: friend.watchedList || []
  };

  // For scrolling through the watched list
  const [startIndex, setStartIndex] = useState(0);
  const nonPedestalItems = friendData.watchedList.filter(
    item => !showPedestal || !item.rank || item.rank > 3
  );

  const handleNextWatched = () => {
    if (startIndex + maxVisibleItems < nonPedestalItems.length) {
      setStartIndex(startIndex + 1);
    }
  };

  const handlePrevWatched = () => {
    if (startIndex > 0) {
      setStartIndex(startIndex - 1);
    }
  };

  const renderStars = (rating: number, maxRating = 5) => {
    return Array.from({ length: maxRating }, (_, i) => (
      <StarIcon key={i} filled={i + 1 <= rating} />
    ));
  };

  return (
    <div className={`border border-gray-300 rounded-lg p-4 shadow-md bg-white ${className}`}>
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-300">
            <img 
              src={friendData.avatar} 
              alt={`${friendData.name}'s profile`} 
              className="w-full h-full object-cover" 
            />
          </div>
          <h2 className="text-xl font-medium">{friendData.name}</h2>
        </div>
        <button onClick={onClose} className="text-red-400 hover:text-red-600">
          <CloseIcon />
        </button>
      </div>

      {/* Main Content */}
      <div className="flex flex-col gap-6">
        {/* Friend's Watched List */}
        <div>
          <h3 className="text-lg font-medium border-b border-gray-300 pb-2 mb-3">
            {friendData.name}'s Watched List
          </h3>
          
          {/* Top 3 Pedestal (if enabled) */}
          {showPedestal && (
            <div className="flex justify-center items-end mb-4 gap-2">
              {friendData.watchedList.find(item => item.rank === 2) && (
                <div className="flex flex-col items-center">
                  <div 
                    className="relative w-14 h-18 border border-gray-300 rounded overflow-hidden cursor-pointer"
                    onClick={() => {
                      const media = friendData.watchedList.find(item => item.rank === 2);
                      if (media) onMediaClick(media);
                    }}
                  >
                    <img 
                      src={friendData.watchedList.find(item => item.rank === 2)?.image} 
                      alt="2nd place" 
                      className="w-full h-full object-cover" 
                    />
                    <div className="absolute top-0 right-0 bg-gray-300 text-white w-5 h-5 flex items-center justify-center text-xs font-bold">
                      2
                    </div>
                  </div>
                  <div className="bg-gray-300 h-6 w-full rounded-b"></div>
                </div>
              )}
              {friendData.watchedList.find(item => item.rank === 1) && (
                <div className="flex flex-col items-center">
                  <div 
                    className="relative w-16 h-20 border border-gray-300 rounded overflow-hidden cursor-pointer"
                    onClick={() => {
                      const media = friendData.watchedList.find(item => item.rank === 1);
                      if (media) onMediaClick(media);
                    }}
                  >
                    <img 
                      src={friendData.watchedList.find(item => item.rank === 1)?.image} 
                      alt="1st place" 
                      className="w-full h-full object-cover" 
                    />
                    <div className="absolute top-0 right-0 bg-yellow-400 text-white w-5 h-5 flex items-center justify-center text-xs font-bold">
                      1
                    </div>
                  </div>
                  <div className="bg-yellow-400 h-8 w-full rounded-b"></div>
                </div>
              )}
              {friendData.watchedList.find(item => item.rank === 3) && (
                <div className="flex flex-col items-center">
                  <div 
                    className="relative w-14 h-18 border border-gray-300 rounded overflow-hidden cursor-pointer"
                    onClick={() => {
                      const media = friendData.watchedList.find(item => item.rank === 3);
                      if (media) onMediaClick(media);
                    }}
                  >
                    <img 
                      src={friendData.watchedList.find(item => item.rank === 3)?.image} 
                      alt="3rd place" 
                      className="w-full h-full object-cover" 
                    />
                    <div className="absolute top-0 right-0 bg-orange-400 text-white w-5 h-5 flex items-center justify-center text-xs font-bold">
                      3
                    </div>
                  </div>
                  <div className="bg-orange-400 h-4 w-full rounded-b"></div>
                </div>
              )}
            </div>
          )}

          {/* Scrollable Watched List */}
          {nonPedestalItems.length > 0 && (
            <div className="flex items-center gap-2 overflow-hidden">
              {startIndex > 0 && (
                <button
                  onClick={handlePrevWatched}
                  className="h-16 flex items-center justify-center text-gray-500 hover:text-gray-700"
                >
                  <ChevronRightIcon className="transform rotate-180" />
                </button>
              )}
              {nonPedestalItems.slice(startIndex, startIndex + maxVisibleItems).map(media => (
                <div 
                  key={media.id} 
                  className="relative w-16 h-20 border border-gray-300 rounded overflow-hidden cursor-pointer"
                  onClick={() => onMediaClick(media)}
                >
                  <img src={media.image} alt={media.title} className="w-full h-full object-cover" />
                  {media.rank && (
                    <div className="absolute top-0 right-0 bg-gray-500 text-white w-5 h-5 flex items-center justify-center text-xs font-bold">
                      {media.rank}
                    </div>
                  )}
                </div>
              ))}
              {startIndex + maxVisibleItems < nonPedestalItems.length && (
                <button
                  onClick={handleNextWatched}
                  className="h-16 flex items-center justify-center text-gray-500 hover:text-gray-700"
                >
                  <ChevronRightIcon />
                </button>
              )}
            </div>
          )}
          {friendData.watchedList.length === 0 && (
            <div className="text-center py-4 text-gray-500">
              No watched items to display
            </div>
          )}
        </div>

        {/* Friend's Takes */}
        <div>
          <h3 className="text-lg font-medium border-b border-gray-300 pb-2 mb-3">
            {friendData.name}'s Takes
          </h3>
          {friendData.takes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto max-h-64 pr-2">
              {friendData.takes.map(take => (
                <div 
                  key={take.id}
                  className="flex gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded"
                  onClick={() => onTakeClick(take)}
                >
                  <div className="shrink-0 w-12 h-16 border border-gray-300 rounded overflow-hidden">
                    <img src={take.movie?.image || "/api/placeholder/50/70"} alt={take.movie?.title || "Movie"} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <div className="flex mb-1">{renderStars(take.rating)}</div>
                    <p className="text-sm text-gray-700">{take.comment}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">
              No takes to display
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FriendCard;