import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header.tsx';
import Login from './pages/login.tsx';
import Home from './pages/Home.tsx';
import SignUp from './pages/signup.tsx'; 
import Decision from './pages/decision.tsx';
import Account from './pages/Account.tsx';
import About from './pages/About.tsx';

const App: React.FC = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Decision />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/account" element ={<Account />} />
        <Route path="/about" element = {<About />} />
      </Routes>
    </Router>
  );
};

export default App;