import React from 'react';
import { useAuth } from '../context/AuthContext';

const studentLinks = [
  { icon: '🏠', label: 'Dashboard', path: 'dashboard' },
  { icon: '📚', label: 'Electives', path: 'electives' },
  { icon: '⭐', label: 'My Preferences', path: 'preferences' },
  { icon: '🎯', label: 'My Result', path: 'result' },
  { icon: '👤', label: 'Profile', path: 'profile' },
];

const adminLinks = [
  { icon: '📊', label: 'Dashboard', path: 'admin-dashboard' },
  { icon: '📚', label: 'Manage Electives', path: 'admin-electives' },
  { icon: '👥', label: 'Students', path: 'admin-students' },
  { icon: '🎯', label: 'Run Allocation', path: 'admin-allocation' },
  { icon: '📋', label: 'Results', path: 'admin-results' },
];

const Sidebar = ({ activePage, setActivePage }) => {
  const { user, logout } = useAuth();
  const isAdmin = user?.role === 'admin';
  const links = isAdmin ? adminLinks : studentLinks;

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <span>ElectiveHub</span>
        <small>{isAdmin ? 'Admin Panel' : `Hi, ${user?.name?.split(' ')[0]}`}</small>
      </div>

      <nav className="sidebar-nav">
        {links.map((link) => (
          <button
            key={link.path}
            className={`nav-item ${activePage === link.path ? 'active' : ''}`}
            onClick={() => setActivePage(link.path)}
          >
            <span className="nav-icon">{link.icon}</span>
            {link.label}
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div style={{ padding: '0 4px 12px', fontSize: 12, color: 'var(--text3)' }}>
          {user?.usn || user?.email}
        </div>
        <button className="btn btn-ghost" style={{ width: '100%' }} onClick={logout}>
          🚪 Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;