import React from 'react';
import { FiBell, FiMenu, FiLogOut, FiUser } from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <button className="icon-btn" onClick={onToggleSidebar}>
          <FiMenu size={20} />
        </button>
        <span className="navbar-brand">🐛 BugTracker</span>
      </div>
      <div className="navbar-right">
        <button className="icon-btn"><FiBell size={20} /></button>
        <div className="navbar-user">
          <FiUser size={16} />
          <span>{user?.name}</span>
          <span className={`role-badge role-${user?.role}`}>{user?.role}</span>
        </div>
        <button className="icon-btn logout-btn" onClick={handleLogout}>
          <FiLogOut size={20} />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;