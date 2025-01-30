import React, { useState } from 'react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ email, password });
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
          <button className="py-2 px-4 bg-blue-500 text-white rounded" type="submit">
            Log In
          </button>
        </form>
      </div>
    </>
  );
};

export default Login;