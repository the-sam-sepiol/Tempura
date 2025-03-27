import React, { useEffect, useState } from 'react';

const Account: React.FC = () => {
  //state for avatar, displayName, and modal visibility
  const [avatar, setAvatar] = useState<string>('/defaultAvatar.png'); //Avatar
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [userSince, setUserSince] = useState<string | null>(null); //User Since
  const [showAvatarModal, setShowAvatarModal] = useState<boolean>(false); //Modal


  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setDisplayName(user.displayName);
        //if the user has an avatar stored from the DB, use it
        if (user.avatar) {
          setAvatar(user.avatar);
        }
        if (user.createdAt){
          setUserSince(user.createdAt);
        }
      } catch (error) {
        console.error('Error parsing user from localStorage', error);
      }
    }
  }, []);

  //placeholder for later
  const watchedList = [1, 2, 3, 4, 5, 6]; //Watched
  const watchList = [1, 2, 3]; //Watch

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
      
      {/* Watched List Section */}
      <div className="bg-white p-6 shadow rounded mb-8">
        <h2 className="text-xl font-semibold mb-4">Watched List</h2>
        <div className="overflow-x-auto">
          <div className="flex space-x-4">
            {watchedList.map((item) => (
              <div key={item} className="min-w-[150px] bg-gray-100 p-4 rounded text-center">
                <div className="h-24 bg-gray-300 flex items-center justify-center rounded mb-2">
                  <span>Item {item}</span>
                </div>
                <p className="font-medium">Title {item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Watch List Section */}
      <div className="bg-white p-6 shadow rounded">
        <h2 className="text-xl font-semibold mb-4">Watch List</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {watchList.map((item) => (
            <div key={item} className="bg-gray-100 p-4 rounded flex flex-col items-center">
              <div className="h-24 w-full bg-gray-300 flex items-center justify-center rounded mb-2">
                <span>Item {item}</span>
              </div>
              <p className="font-medium mb-2">
                Priority: <span className="text-yellow-500">★</span> {/*Priority*/}
              </p>
              <button className="text-blue-500 hover:underline">Edit</button>
            </div>
          ))}
        </div>
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