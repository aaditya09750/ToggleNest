import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiHome, FiFolder, FiUser } from 'react-icons/fi';

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: FiHome },
    { name: 'Projects', path: '/projects', icon: FiFolder },
    { name: 'Profile', path: '/profile', icon: FiUser },
  ];

  return (
    <div className="w-64 bg-surface shadow-xl border-r border-border-dark sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto custom-scrollbar">
      {/* <div className="p-6 border-b border-border-dark">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
            <FiActivity className="text-white" size={20} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-text-primary">Menu</h2>
            <p className="text-xs text-text-secondary font-medium">
              Navigation
            </p>
          </div>
        </div>
      </div> */}

      <nav className="mt-6 px-3 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`group flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-primary to-secondary text-white'
                  : 'text-text-secondary hover:bg-border-dark hover:text-secondary'
              }`}
            >
              <Icon
                className={
                  isActive
                    ? 'text-white mr-3'
                    : 'text-text-secondary group-hover:text-secondary mr-3 transition-colors'
                }
                size={20}
              />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;
