import React from 'react';
import { Link } from 'react-router-dom';

const About: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto p-8 text-center">
      <h1 className="text-3xl font-bold mb-6">About Tempura</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <p className="text-lg mb-4">
          We are Tempura. We are creating a recommendation system for our users to find and discover new Anime, while keeping in touch with friends.
        </p>
        
        <p className="text-gray-700 mb-6">
          Our platform combines personalized anime recommendations with social features,
          making it easier than ever to track what you're watching and discover your next favorite series.
        </p>

        <Link to="/login" className="mt-4 py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600">
          Back to Login
        </Link>
      </div>
    </div>
  );
};

export default About;