import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Decision: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {

    const token = localStorage.getItem('token');
    if (token) {
      navigate('/home');
    } else {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div className="text-center p-4">
      <h1 className="text-2xl font-bold">Tempura Home</h1>
      <p>Welcome to Tempura!</p>
    </div>
  );
};

export default Decision;