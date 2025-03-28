import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/login.tsx";
import Home from "./pages/Home.tsx";
import SignUp from "./pages/signup.tsx";
import Decision from "./pages/decision.tsx";
import Account from "./pages/Account.tsx";
import About from "./pages/About.tsx";
import Friends from "./pages/Friends.tsx";
import MainLayout from "./components/MainLayout.tsx";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route element={<MainLayout />}>
          <Route path="/" element={<Decision />} />
          <Route path="/home" element={<Home />} />
          <Route path="/account" element={<Account />} />
          <Route path="/about" element={<About />} />
          <Route path="/friends" element={<Friends />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
