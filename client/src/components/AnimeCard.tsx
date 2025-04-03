import React from 'react';

//This is a component that will be used to display anime details in the home page
//It will display the anime image, title, description, score, and some action buttons
//The action buttons will be used to add the anime to the watch list, add a review, etc.
//This component will be used across the webiste to display anime details

export interface AnimeCardProps {
    mal_id: number;
    title: string;
    description: string;
    score: number;
    imageUrl: string;
}

const AnimeCard: React.FC<AnimeCardProps> = ({
    mal_id,
    title,
    description,
    score,
    imageUrl,
}) => {

const handleAddToWatchList = async () => {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:3000/api/users/watchlist', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ malId: mal_id })
        });
        const data = await response.json();
        if (data.success) {
            localStorage.setItem('user', JSON.stringify(data.user));
            alert(`${title} has been added to your watch list!`);
        } else {
            alert(`Failed to add to watch list: ${data.error}`);
        }
    } catch (error) {
        console.error('Error adding to watch list', error);
        alert('An error occurred while adding to watch list.');
    }
    };

  return (
    <div className="max-w-4xl bg-white rounded overflow-hidden shadow-lg p-4 flex">
      {/* Left section: Cover Image */}
      <img
        crossOrigin="anonymous"         //fixes CORS issue in firefox inspector
        className="w-1/3 h-auto object-cover rounded"
        src={imageUrl}
        alt={`${title} cover`}
      />
      {/* right section: Details, Friends Review, and Buttons */}
      <div className="w-2/3 pl-4 flex flex-col">
        {/* anime details */}
        <div>
          <div className="font-bold text-2xl mb-2">{title}</div>
          <p className="text-gray-700 text-base mb-2">{description}</p>
          <p className="mt-2 text-lg font-semibold">Score: {score}</p>
        </div>
        {/* friends review section */}
        <div className="mt-4">
          <h3 className="font-bold text-xl mb-2">Friends Review</h3>
          <p className="text-gray-600">No friends reviews available.</p>    {/* WIP will add later */}
        </div>
        {/* Action Buttons - Yet to be implemented */}
        <div className="mt-4 flex space-x-4">
          <button className="py-2 px-4 bg-blue-500 text-white rounded">
            Already Watched?
          </button>
          <button 
            onClick={handleAddToWatchList}
            className="py-2 px-4 bg-green-500 text-white rounded">
            Add to watch list?
          </button>
          <button className="py-2 px-4 bg-purple-500 text-white rounded">
            Add a review?
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnimeCard;