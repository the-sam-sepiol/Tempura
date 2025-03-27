import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';



const Header: React.FC = () => {
    const [displayName, setDisplayName] = useState<string | null>(null);

    useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
        try {
        const user = JSON.parse(storedUser);
        setDisplayName(user.displayName);
        } catch (error) {
        console.error('Error parsing user from localStorage', error);
        }
    }
    }, []);

return (
    <header className="bg-gray-800 text-white p-4 flex items-center justify-between">
      {/* Left group: Search bar and Logo */}
      <div className="flex items-center space-x-4">
        {/* Search bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            className="bg-gray-700 text-white rounded pl-10 pr-4 py-2 focus:outline-none"
          />
          <svg
            className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            {/* These are vector instructions for drawing the search icon */}
            <path d="M12.9 14.32a8 8 0 111.414-1.414l4.3 4.29a1 1 0 01-1.414 1.42l-4.3-4.3zM14 8a6 6 0 11-12 0 6 6 0 0112 0z" />
          </svg>
        </div>

        {/* Logo */}
        <div className="flex-shrink-0">
          <img
            src="/icon.png"
            alt="Logo"
            className="w-25 h-20"  // adjust as needed
          />
        </div>

      {displayName && (
        <div className="ml-4 text-lg">
            Hello {displayName}!
        </div>
      )}
      </div>

      {/* Right: Friends link and Account icon */}
      <div className="flex items-center space-x-4">
        <Link to="/friends" className="hover:text-gray-300">
          Friends
        </Link>
        <Link to="/account" className="flex items-center hover:text-gray-300">
          <img
            src="/account.png"
            alt="Account"
            className="w-10 h-10 rounded-full"
          />
        </Link>
      </div>
    </header>
  );
};

export default Header;