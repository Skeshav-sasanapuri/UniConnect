import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { EmailProvider } from './context/EmailContext'; // Import EmailProvider
import Login from './components/Login';
import Profile from './components/Profile';
import Chat from './components/Chat';
import MyPosts from './components/MyPosts';
import Feed from './components/Feed';
import { Navigate } from 'react-router-dom';

function App() {
  return (
      <EmailProvider>
        <Router>
          <div>
            {/* Conditionally render the Navbar */}
            <Navbar />

            {/* Page Content */}
            <div className="container mt-3">
              <Routes>
                <Route path="/" element={<Navigate to="/login"/>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path="/profile" element={<Profile/>}/>
                <Route path="/feed" element={<Feed/>}/>
                <Route path="/chat" element={<Chat/>}/>
                <Route path="/myposts" element={<MyPosts/>}/>
              </Routes>
            </div>
          </div>
        </Router>
      </EmailProvider>
  );
}

// Navbar component for better structure
const Navbar = () => {
  const location = useLocation();
  if (location.pathname === '/login') return null; // Hide navbar on login page

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid justify-content-center">
        {/* Logo */}
        <Link className="navbar-brand d-flex align-items-center" to="/feed">
          <img
            src="/logo.png"
            alt="Logo"
            style={{ width: '40px', marginRight: '10px' }}
          />
          Uni Connect
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse justify-content-center" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link" to="/profile">Profile</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/MyPosts">MyPosts</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/feed">Feed</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/chat">Chat</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default App;
