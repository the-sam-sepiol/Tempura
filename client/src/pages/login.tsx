import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {    //change to server
        method: 'POST',   
        credentials: 'include', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) {
        throw new Error('Invalid email or password');
      }
      const data = await response.json();
      console.log(data);
      
      //save token to local storage
      localStorage.setItem('token', data.token);
      
      //redirect home
      navigate('/home');
      
    } catch (error) {
      console.error('Error', error);
    }
  };

  return (
    <>
      <h2 className="text-center text-2xl font-bold mb-4">Welcome to Tempura!</h2>
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <form onSubmit={handleSubmit} className="p-6 bg-white shadow-md rounded">
          <h1 className="mb-4 text-lg font-bold">Login</h1>
          <div className="mb-2">
            <label className="block mb-1">Email</label>
            <input
              type="email"
              className="w-full p-2 border"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Password</label>
            <input
              type="password"
              className="w-full p-2 border"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            className="py-2 px-4 bg-blue-500 text-white rounded ml-2"
            type="submit"
          >
            Log In
          </button>
          <Link
            to="/signup"
            className="py-2 px-4 border border-blue-500 text-blue-500 rounded ml-2"
          >
            Sign Up
          </Link>
          <div className="mt-4 text-center">
            <Link to="/about" className="text-blue-500 hover:underline">
              About Tempura
            </Link>
          </div>
        </form>
      </div>
    </>
  );
};

export default Login;