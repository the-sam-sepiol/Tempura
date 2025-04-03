import React, { useEffect, useState } from 'react';

interface Anime{
  mal_id: number;
  title: string;
  imageUrl: string;
}

const Account: React.FC = () => {
  //state for avatar, displayName, and modal visibility
  const [avatar, setAvatar] = useState<string>('/defaultAvatar.png'); //Avatar
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [userSince, setUserSince] = useState<string | null>(null); //User Since
  const [showAvatarModal, setShowAvatarModal] = useState<boolean>(false); //Modal

  const [watchList, setWatchList] = useState<Anime[]>([]);    //for watch list

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setDisplayName(user.displayName);
        if (user.avatar) {
          setAvatar(user.avatar);
        }
        if (user.createdAt) {
          setUserSince(user.createdAt);
        }
        // Assume user.watchList is an array of MAL IDs
        if (user.watchList && Array.isArray(user.watchList)) {
          const malIds: number[] = user.watchList;
          //for each mal_id, fetch details from the Jikan API
          Promise.all(
            malIds.map(async (malId: number) => {
              const res = await fetch(`https://api.jikan.moe/v4/anime/${malId}`);
              if (res.ok) {
                const json = await res.json();
                return {
                  mal_id: json.data.mal_id,
                  title: json.data.title,
                  imageUrl: json.data.images.jpg.image_url
                };
              }
              return null;
            })
          )
            .then(results => {
              const animeList = results.filter((a) => a !== null) as Anime[];
              setWatchList(animeList);
            })
            .catch(error => {
              console.error('Error fetching anime details:', error);
            });
        }
      } catch (error) {
        console.error('Error parsing user from localStorage', error);
      }
    }
  }, []);

  
  //list of avatars for selection
  const avatarOptions = [
    '/octopusAvatar.png', //Octopus
    '/salmonAvatar.png',  //Salmon
    '/sushiAvatar.png',    //Sushi
    '/oniAvatar.png',     //Onigiri
    '/defaultAvatar.png' //Default
  ];

  //function to update the avatar in both state and MongoDB
  const handleSelectAvatar = async (selectedAvatar: string) => {
    try {
      const token = localStorage.getItem('token'); // Get JWT token
      const response = await fetch('http://localhost:3000/api/users/avatar', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` // Include token in header
        },
        body: JSON.stringify({ avatar: selectedAvatar })
      });
      const data = await response.json();
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
        setAvatar(data.user.avatar);
        setShowAvatarModal(false);
      }
    } catch (error) {
      console.error('Error updating avatar', error);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      {/* Profile Section */}
      <div className="bg-white p-6 shadow rounded mb-8 flex flex-col items-center">
        <img 
          src={avatar} 
          alt="Avatar" 
          className="w-32 h-32 rounded-full mb-4" //Avatar
        />
        <div className="flex flex-col items-center">
          <h1 className="text-2xl font-bold mb-2">{displayName}</h1> {/*Name*/}
          <button 
            className="text-blue-500 hover:underline" //Edit
            onClick={() => setShowAvatarModal(true)}
          >
            Edit Avatar
          </button>
          {userSince && (
            <p className="text-gray-500 mt-2">
              User Since: {new Date(userSince).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>
      
      {/* Your Reviews Section */}
      <div className="bg-white p-6 shadow rounded mb-8">
        <h2 className="text-xl font-semibold mb-4">Your Reviews</h2>
        <textarea
          placeholder="Write a brief review..."
          className="w-full border p-3 rounded mb-4 resize-none"
          rows={3}
        />
        <div className="flex items-center mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className="cursor-pointer text-2xl text-gray-300" //Star
            >
              ★
            </span>
          ))}
        </div>
        <button className="py-2 px-4 bg-blue-500 text-white rounded">Submit Review</button>
      </div>
      
      {/* Watch List Section from Local Storage */}
      <div className="bg-white p-6 shadow rounded">
        <h2 className="text-xl font-semibold mb-4">Watch List</h2>
        {watchList.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {watchList.map((anime) => (
              <div key={anime.mal_id} className="bg-gray-100 p-4 rounded flex flex-col items-center">
                <img 
                  src={anime.imageUrl} 
                  alt={anime.title}
                  className="h-24 w-full object-cover rounded mb-2"
                />
                <p className="font-medium mb-2">{anime.title}</p>
                <button className="text-blue-500 hover:underline">Edit</button>
              </div>
            ))}
          </div>
        ) : (
          <p>No anime in your watch list.</p>
        )}
      </div>

      {/* Avatar Selection Modal */}
      {showAvatarModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-xl font-bold mb-4">Select an Avatar</h2>
            <div className="flex space-x-4">
              {avatarOptions.map((option) => (
                <img 
                  key={option}
                  src={option}
                  alt="Avatar option"
                  className="w-24 h-24 rounded-full cursor-pointer hover:opacity-75"
                  onClick={() => handleSelectAvatar(option)}
                />
              ))}
            </div>
            <button 
              className="mt-4 py-2 px-4 bg-red-500 text-white rounded"
              onClick={() => setShowAvatarModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Account;