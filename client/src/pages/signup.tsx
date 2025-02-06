import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const SignUp: React.FC = () => {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try{
        const response = await fetch('http://localhost:3000/api/auth/signup', {
         method : 'POST',
         headers : {
             'Content-Type' : 'application/json'
         },
         body : JSON.stringify({ displayName, email, password }),
    });
    const data = await response.json();
    console.log(data);
    } catch (error){
        console.error('Error:', error);
    }

  };

  return (
    <>
      <h2 className="text-center text-2xl font-bold mb-4">Create a New Account</h2>
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <form onSubmit={handleSubmit} className="p-6 bg-white shadow-md rounded">
          <h1 className="mb-4 text-lg font-bold">Sign Up</h1>
          
          <div className="mb-2">
            <label className="block mb-1">Display Name</label>
            <input
              type="text"
              className="w-full p-2 border"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
            />
          </div>
          
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
          
          <button className="py-2 px-4 bg-blue-500 text-white rounded" type="submit">
            Sign Up
          </button>
          <Link to="/" className="py-2 px-4 border border-blue-500 text-blue-500 rounded ml-2">
            Back to Login
          </Link>
        </form>
      </div>
    </>
  );
};

export default SignUp;