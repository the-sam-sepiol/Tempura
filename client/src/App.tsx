import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/login.tsx';
import Home from './pages/Home.tsx';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Make the login page render at the root path */}
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </Router>
  );
};

export default App;