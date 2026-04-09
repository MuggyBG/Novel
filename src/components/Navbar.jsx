import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault(); 
    if (searchQuery.trim()) {
      console.log("Searching for:", searchQuery);
      setSearchQuery(''); 
    }
  };

  return (
    <header className="navbar">
      <div className="navbar-logo">
        <Link to="/">NovelHaven</Link>
      </div>
      
      <nav className="navbar-links">
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/browse">Browse</Link></li>
          <li><Link to="/library">Library</Link></li>
        </ul>
      </nav>

      <div className="navbar-actions">
        <form onSubmit={handleSearch} className="search-form">
          <input 
            type="text" 
            placeholder="Search novels..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-btn">🔍</button>
        </form>
        
        <Link to="/login">
          <button className="login-btn">Sign In</button>
        </Link>
      </div>
    </header>
  );
};

export default Navbar;