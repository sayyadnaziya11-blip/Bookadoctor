import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Calendar, 
  UserPlus, 
  LogOut, 
  Users, 
  Stethoscope, 
  Bell, 
  Home, 
  User as UserIcon,
  CheckCircle2,
  FileText
} from 'lucide-react';

export const Layout = ({ children, alertMessage, alertType = 'success' }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Determine user role and navigation items
  const userRole = user?.isAdmin ? 'admin' : user?.isDoctor ? 'doctor' : 'user';

  const userMenuItems = [
    { name: 'Doctors', path: '/', icon: Home },
    { name: 'Appointments', path: '/appointments', icon: Calendar },
    { name: 'Apply doctor', path: '/apply-doctor', icon: UserPlus },
  ];

  const adminMenuItems = [
    { name: 'Doctors', path: '/admin/doctors', icon: Stethoscope },
    { name: 'Users', path: '/admin/users', icon: Users },
  ];

  const doctorMenuItems = [
    { name: 'Doctors', path: '/', icon: Home },
    { name: 'Appointments', path: '/doctor/appointments', icon: Calendar },
    { name: 'Profile', path: '/doctor/profile', icon: UserIcon },
  ];

  const menuItems = user?.isAdmin
    ? adminMenuItems
    : user?.isDoctor
    ? doctorMenuItems
    : userMenuItems;

  const unseenCount = user?.unseenNotifications?.length || 0;

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>{user?.isAdmin ? 'MediCareBook' : 'Book A Doctor'}</h2>
        </div>
        <nav className="sidebar-nav">
          <ul>
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `nav-item ${isActive ? 'active' : ''}`
                    }
                  >
                    <Icon size={18} className="nav-icon" />
                    <span>{item.name}</span>
                  </NavLink>
                </li>
              );
            })}
            <li>
              <button onClick={handleLogout} className="nav-item logout-btn">
                <LogOut size={18} className="nav-icon" />
                <span>Logout</span>
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="main-wrapper">
        {/* Top Header */}
        <header className="top-header">
          <div className="header-left">
            {/* Top alert badge if any */}
            {alertMessage && (
              <div className={`top-alert-pill ${alertType}`}>
                <CheckCircle2 size={16} className="pill-icon" />
                <span>{alertMessage}</span>
              </div>
            )}
          </div>
          <div className="header-right">
            <div 
              className="notification-bell-container"
              onClick={() => navigate('/notifications')}
              title="Notifications"
            >
              <Bell size={20} className="bell-icon" />
              {unseenCount > 0 && (
                <span className="notification-badge">{unseenCount}</span>
              )}
            </div>
            <div 
              className="user-greeting"
              onClick={() => navigate('/notifications')}
            >
              <span>{user?.name || 'User'}</span>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="content-area">
          <div className="content-card">
            {children}
          </div>
        </main>

        {/* Footer */}
        <footer className="app-footer">
          <p>© 2023 Copyright: MediCareBook</p>
        </footer>
      </div>
    </div>
  );
};
