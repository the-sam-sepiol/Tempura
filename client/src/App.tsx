import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/login.tsx';
import Home from './pages/Home.tsx';
import SignUp from './pages/signup.tsx'; 
import Decision from './pages/decision.tsx';
import Account from './pages/Account.tsx';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Make the login page render at the root path */}
        <Route path="/" element={<Decision />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/account" element ={<Account />} />
      </Routes>
    </Router>
  );
};

export default App;