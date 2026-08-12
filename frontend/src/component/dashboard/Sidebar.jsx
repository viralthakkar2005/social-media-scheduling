import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  FileText,
  Calendar,
  List,
  Clock,
  CheckCircle2,
  Sliders,
  Plus,
  LogOut,
  CircleUserRound,
} from 'lucide-react';
import logo from '../../assets/logo.png';
import { useAuth } from '../../context/AuthContext';

export default function Sidebar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const navItems = {
    create: [
      { label: 'New post', icon: FileText, path: '/dashboard/new-post' },
    ],
    posts: [
      { label: 'Calendar', icon: Calendar, path: '/dashboard/calendar' },
      { label: 'All', icon: List, path: '/dashboard/posts' },
      { label: 'Scheduled', icon: Clock, path: '/dashboard/scheduled' },
      { label: 'Posted', icon: CheckCircle2, path: '/posted' },
    ],
    config: [
      { label: 'Connections', icon: Sliders, path: '/connections' },
    ],
  };

  const handleLogout = async () => {
    await logout();
    navigate('/sign-in');
  };

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between flex-shrink-0 z-10 h-screen sticky top-0">
      <div className="p-5 flex flex-col gap-6">
        {/* Brand Header */}
        <NavLink
          to="/dashboard/new-post"
          className="flex items-center gap-2 px-1 hover:opacity-90 transition-opacity"
        >
          <img src={logo} alt="Post Bridge Logo" className="h-7 w-auto" />
          <span className="text-xl font-bold text-[#1e293b] tracking-tight">
            post bridge
          </span>
        </NavLink>

        {/* Primary Action Button */}
        <button
          onClick={() => navigate('/dashboard/new-post')}
          className="w-full bg-[#5bc983] hover:bg-[#4eb573] text-white font-medium py-3 px-4 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer text-sm"
        >
          <Plus className="w-5 h-5 stroke-[2.5]" />
          <span>Create post</span>
        </button>

        {/* Nav Categories */}
        <nav className="flex flex-col gap-5 text-sm">
          {/* CATEGORY: CREATE */}
          <div className="flex flex-col gap-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-1">
              Create
            </span>
            {navItems.create.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-colors text-left cursor-pointer ${
                      isActive
                        ? 'bg-slate-100 text-slate-900 font-semibold'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 text-slate-500" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </div>

          {/* CATEGORY: POSTS */}
          <div className="flex flex-col gap-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-1">
              Posts
            </span>
            {navItems.posts.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-colors text-left cursor-pointer ${
                      isActive
                        ? 'bg-slate-100 text-slate-900 font-semibold'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 text-slate-500" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </div>

          {/* CATEGORY: CONFIGURATION */}
          <div className="flex flex-col gap-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-1">
              Configuration
            </span>
            {navItems.config.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-colors text-left cursor-pointer ${
                      isActive
                        ? 'bg-slate-100 text-slate-900 font-semibold'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 text-slate-500" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </div>
        </nav>
      </div>

      {/* User Profile Footer */}
      <div className="p-4 border-t border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3 overflow-hidden">
          {user?.picture ? (
            <img
              src={user.picture}
              alt={`${user.fullName || 'User'} avatar`}
              className="w-9 h-9 rounded-full object-cover flex-shrink-0"
              referrerPolicy="no-referrer"
              onError={(e) => {
                // Google photo URLs can occasionally 429/expire — hide the
                // broken img and let the fallback icon show instead.
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <CircleUserRound
            className="w-9 h-9 text-slate-300 flex-shrink-0"
            style={{ display: user?.picture ? 'none' : 'flex' }}
            strokeWidth={1.5}
          />
          <div className="flex flex-col truncate">
            <span className="text-sm font-semibold text-slate-800 leading-tight truncate">
              {user?.fullName || 'Account'}
            </span>
            <span className="text-xs text-slate-400 truncate">
              {user?.email || ''}
            </span>
          </div>
        </div>
        <button
          title="Log out"
          onClick={handleLogout}
          className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
}
