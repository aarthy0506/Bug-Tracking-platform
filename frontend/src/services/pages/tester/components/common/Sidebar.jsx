import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from "../../../../../hooks/useAuth";
import {
  FiHome, FiUsers, FiFolder, FiBarChart2,
  FiBug, FiPlusCircle, FiList, FiCheckSquare,
} from 'react-icons/fi';
import './Sidebar.css';

const menuByRole = {
  admin: [
    { path: '/admin/dashboard', label: 'Dashboard', icon: <FiHome /> },
    { path: '/admin/users', label: 'Manage Users', icon: <FiUsers /> },
    { path: '/admin/projects', label: 'Projects', icon: <FiFolder /> },
    { path: '/admin/reports', label: 'Reports', icon: <FiBarChart2 /> },
  ],
  tester: [
    { path: '/tester/dashboard', label: 'Dashboard', icon: <FiHome /> },
    { path: '/tester/create-bug', label: 'Report Bug', icon: <FiPlusCircle /> },
    { path: '/tester/my-bugs', label: 'My Bug Reports', icon: <FiBug /> },
  ],
  developer: [
    { path: '/developer/dashboard', label: 'Dashboard', icon: <FiHome /> },
    { path: '/developer/assigned-bugs', label: 'Assigned Bugs', icon: <FiList /> },
  ],
  manager: [
    { path: '/manager/dashboard', label: 'Dashboard', icon: <FiHome /> },
    { path: '/manager/projects', label: 'Project Tracking', icon: <FiFolder /> },
    { path: '/manager/analytics', label: 'Analytics', icon: <FiBarChart2 /> },
  ],
};

const Sidebar = ({ isOpen }) => {
  const { user } = useAuth();
  const menu = menuByRole[user?.role] || [];

  return (
    <aside className={`sidebar ${isOpen ? 'open' : 'collapsed'}`}>
      {menu.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
        >
          <span className="sidebar-icon">{item.icon}</span>
          {isOpen && <span className="sidebar-label">{item.label}</span>}
        </NavLink>
      ))}
    </aside>
  );
};

export default Sidebar;