import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Menu, X, LogOut, Bell, Trophy, Shield, User as UserIcon } from 'lucide-react';

export default function Navbar() {
  const { user, logout, notifications, api, fetchNotifications } = useApp();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);

  const unreadNotifications = notifications.filter(n => !n.is_read);

  const markAllNotificationsRead = async () => {
    try {
      await api.post('/notifications/');
      fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  const getDashboardPath = (role) => {
    switch (role) {
      case 'donor': return '/donor-dashboard';
      case 'ngo': return '/ngo-dashboard';
      case 'volunteer': return '/volunteer-dashboard';
      case 'admin': return '/admin-dashboard';
      default: return '/';
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-40 bg-white/85 backdrop-blur-md border-b border-eco-border px-4 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        
        {/* Cinematic Premium Eco Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-2xl">🍱</span>
          <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-eco-sage via-eco-emerald to-eco-teal bg-clip-text text-transparent">
            SmartFood
          </span>
          <span className="text-xs uppercase bg-eco-mint/10 text-eco-emerald px-2 py-0.5 rounded-full font-bold tracking-widest">
            AI
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-slate-500 hover:text-eco-sage transition-colors font-semibold text-sm">Home</Link>
          
          {user && (
            <Link 
              to={getDashboardPath(user.role)} 
              className="text-eco-emerald hover:text-eco-sage transition-colors font-bold text-sm"
            >
              Control Center
            </Link>
          )}

          {/* User Specific Metrics */}
          {user && user.role === 'volunteer' && (
            <div className="flex items-center bg-eco-mint/10 text-eco-emerald px-3 py-1 rounded-full border border-eco-mint/20 space-x-1">
              <Trophy className="w-4 h-4 text-eco-emerald" />
              <span className="text-sm font-extrabold">{user.volunteer_points} XP</span>
            </div>
          )}
        </div>

        {/* User Session Info / Notifications */}
        <div className="hidden md:flex items-center space-x-4">
          {user ? (
            <>
              {/* Notification Popover Icon */}
              <div className="relative">
                <button 
                  onClick={() => {
                    setBellOpen(!bellOpen);
                    if (!bellOpen && unreadNotifications.length > 0) {
                      markAllNotificationsRead();
                    }
                  }}
                  className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors relative"
                >
                  <Bell className="w-5 h-5" />
                  {unreadNotifications.length > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-eco-rose rounded-full animate-ping" />
                  )}
                </button>

                {/* Notifications Dropdown Panel */}
                {bellOpen && (
                  <div className="absolute right-0 mt-3 w-80 glass-panel rounded-xl shadow-xl z-50 p-4 max-h-[350px] overflow-y-auto">
                    <div className="flex justify-between items-center pb-2 border-b border-gray-100 mb-2">
                      <h4 className="font-extrabold text-sm text-slate-700">Live Alerts</h4>
                      <span className="text-xs text-slate-400">{notifications.length} alerts</span>
                    </div>
                    {notifications.length === 0 ? (
                      <p className="text-slate-400 text-xs text-center py-4">No new alerts.</p>
                    ) : (
                      <div className="space-y-2.5">
                        {notifications.map((notif, idx) => (
                          <div 
                            key={idx} 
                            className={`p-2.5 rounded-lg text-xs leading-relaxed ${
                              notif.type === 'urgent' ? 'bg-red-50 border-l-2 border-red-500 text-slate-700' :
                              notif.type === 'success' ? 'bg-emerald-50 border-l-2 border-emerald-500 text-slate-700' :
                              'bg-slate-50 border-l-2 border-eco-emerald text-slate-700'
                            }`}
                          >
                            <div className="font-extrabold mb-0.5 text-slate-800">{notif.title}</div>
                            <div className="text-[11px] text-slate-600">{notif.message}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* User Identity Details */}
              <div className="flex items-center space-x-3 bg-slate-50 px-4 py-2 rounded-full border border-slate-100">
                <UserIcon className="w-4 h-4 text-eco-emerald" />
                <span className="text-sm font-bold text-slate-700">{user.username}</span>
                <span className="text-[10px] uppercase font-bold text-eco-emerald bg-eco-mint/10 px-2 py-0.5 rounded">
                  {user.role}
                </span>
              </div>

              <button 
                onClick={() => {
                  logout();
                  navigate('/');
                }}
                className="p-2.5 bg-red-50 text-red-600 rounded-full hover:bg-red-100 transition-all"
                title="Log Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </>
          ) : (
            <>
              <Link 
                to="/auth" 
                className="text-slate-500 hover:text-eco-sage transition-colors font-bold text-sm px-4 py-2"
              >
                Sign In
              </Link>
              <Link 
                to="/auth" 
                className="px-5 py-2.5 bg-gradient-to-r from-eco-emerald to-eco-teal text-white hover:scale-105 transition-all rounded-full font-extrabold text-sm"
              >
                Launch Network
              </Link>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden flex items-center space-x-3">
          {user && (
            <div className="text-xs bg-eco-mint/10 text-eco-emerald font-bold px-2.5 py-1 rounded-full border border-eco-mint/15">
              {user.role}
            </div>
          )}
          <button 
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 text-slate-500 hover:text-slate-700"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer Menu */}
      {mobileOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-white/95 backdrop-blur-lg border-b border-gray-100 py-6 px-4 space-y-4 shadow-lg">
          <Link to="/" onClick={() => setMobileOpen(false)} className="block text-slate-600 hover:text-eco-sage font-semibold">Home</Link>
          {user && (
            <>
              <Link 
                to={getDashboardPath(user.role)} 
                onClick={() => setMobileOpen(false)} 
                className="block text-eco-emerald hover:text-eco-sage font-bold"
              >
                Dashboard Control
              </Link>
              {user.role === 'volunteer' && (
                <div className="inline-flex items-center bg-eco-mint/10 text-eco-emerald px-3 py-1 rounded-full text-sm font-bold">
                  Points: {user.volunteer_points} XP
                </div>
              )}
              <div className="border-t border-gray-100 pt-4 space-y-4">
                <div className="text-sm text-slate-500">Logged in as {user.username}</div>
                <button 
                  onClick={() => {
                    logout();
                    setMobileOpen(false);
                    navigate('/');
                  }}
                  className="w-full py-2 bg-red-50 text-red-600 font-bold rounded-lg"
                >
                  Log Out
                </button>
              </div>
            </>
          )}
          {!user && (
            <Link 
              to="/auth" 
              onClick={() => setMobileOpen(false)}
              className="block w-full text-center py-2.5 bg-gradient-to-r from-eco-emerald to-eco-teal text-white font-extrabold rounded-lg"
            >
              Get Started
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
