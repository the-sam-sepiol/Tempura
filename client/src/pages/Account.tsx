import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Account: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Fetch user data from the server
    const fetchUserData = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/auth/verify', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = await response.json();
        setUser(data.user);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Search query:', searchQuery);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="flex justify-between items-center mb-4">
        <form onSubmit={handleSearch} className="flex items-center">
          <input
            type="text"
            className="p-2 border rounded-l"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="p-2 bg-blue-500 text-white rounded-r">
            Search
          </button>
        </form>
        <Link to="/friends" className="p-2 bg-blue-500 text-white rounded">
          Friends List
        </Link>
      </div>
      {user && (
        <div className="flex">
          <div className="w-1/4 p-4 bg-white shadow-md rounded">
            <img src={user.avatar} alt="Avatar" className="w-24 h-24 rounded-full mb-4" />
            <h2 className="text-xl font-bold">{user.displayName}</h2>
            <p>{user.email}</p>
          </div>
          <div className="w-3/4 p-4">
            <h2 className="text-2xl font-bold mb-4">My Reviews</h2>
            {/* Render user's reviews here */}
            <h2 className="text-2xl font-bold mb-4">My Watch List</h2>
            {/* Render user's watch list here */}
          </div>
        </div>
      )}
    </div>
  );
};

export default Account;