import React from 'react';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <NavLink to="/" className="nav-logo">
          <span className="nav-logo-icon">📸</span>
          <span>PixelShare</span>
        </NavLink>
        <div className="nav-links">
          <NavLink 
            to="/" 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            end
          >
            Feed
          </NavLink>
          <NavLink 
            to="/upload" 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            Upload Post
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
