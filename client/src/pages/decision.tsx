import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Decision: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check for session cookie
    const hasSessionCookie = document.cookie.includes('session=');
    if (!hasSessionCookie) {
      // Redirect to /login
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div className="text-center p-4">
      <h1 className="text-2xl font-bold">Home Page</h1>
      <p>Welcome to the Home Page!</p>
    </div>
  );
};

export default Decision;