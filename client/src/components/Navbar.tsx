import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Calendar,
  Compass,
  Ticket,
  LayoutDashboard,
  PlusCircle,
  LogOut,
  LogIn,
  UserCheck,
  Menu,
  X,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout, switchDemoRole } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-md shadow-indigo-200 group-hover:scale-105 transition-transform">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-xl bg-gradient-to-r from-indigo-700 to-purple-600 bg-clip-text text-transparent">
                EventFlow
              </span>
              <span className="hidden sm:inline-block ml-1.5 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-indigo-50 text-indigo-700 rounded border border-indigo-200">
                Cloud EMS
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              to="/events"
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                isActive('/events')
                  ? 'bg-indigo-50 text-indigo-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Compass className="w-4 h-4" />
              Explore Events
            </Link>

            {isAuthenticated && user?.role === 'attendee' && (
              <Link
                to="/my-tickets"
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  isActive('/my-tickets')
                    ? 'bg-indigo-50 text-indigo-700 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Ticket className="w-4 h-4" />
                My Tickets
              </Link>
            )}

            {isAuthenticated && user?.role === 'organizer' && (
              <>
                <Link
                  to="/organizer"
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                    isActive('/organizer')
                      ? 'bg-indigo-50 text-indigo-700 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                <Link
                  to="/organizer/events/new"
                  className="ml-2 px-3.5 py-2 rounded-lg text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <PlusCircle className="w-4 h-4" />
                  Host Event
                </Link>
              </>
            )}
          </nav>

          {/* Demo Role Switcher & Auth Section */}
          <div className="hidden md:flex items-center gap-3">
            {/* Quick Demo Switcher Pill */}
            <div className="flex items-center bg-slate-100 p-1 rounded-full border border-slate-200">
              <span className="text-xs font-medium text-slate-500 pl-2 pr-1 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-500" />
                Demo:
              </span>
              <button
                onClick={() => switchDemoRole('attendee')}
                className={`px-2.5 py-1 text-xs font-medium rounded-full transition-all ${
                  user?.role === 'attendee'
                    ? 'bg-white text-indigo-700 shadow-sm font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Switch to Attendee view to book tickets"
              >
                Attendee
              </button>
              <button
                onClick={() => switchDemoRole('organizer')}
                className={`px-2.5 py-1 text-xs font-medium rounded-full transition-all ${
                  user?.role === 'organizer'
                    ? 'bg-white text-indigo-700 shadow-sm font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Switch to Organizer view to manage & create events"
              >
                Organizer
              </button>
            </div>

            {isAuthenticated && user ? (
              <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-8 h-8 rounded-full border border-indigo-200 object-cover"
                />
                <div className="text-left text-xs">
                  <div className="font-semibold text-slate-800 leading-tight">{user.name}</div>
                  <div className="text-slate-500 capitalize text-[11px] flex items-center gap-1">
                    <UserCheck className="w-3 h-3 text-emerald-600 inline" />
                    {user.role}
                  </div>
                </div>
                <button
                  onClick={() => {
                    logout();
                    navigate('/');
                  }}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors ml-1"
                  title="Log out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-indigo-600 flex items-center gap-1.5"
              >
                <LogIn className="w-4 h-4" />
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-6 space-y-3">
          <div className="p-2 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
            <span className="text-xs font-medium text-slate-600">Switch Demo Perspective:</span>
            <div className="flex gap-1">
              <button
                onClick={() => switchDemoRole('attendee')}
                className={`px-3 py-1 text-xs rounded-md ${
                  user?.role === 'attendee' ? 'bg-indigo-600 text-white font-semibold' : 'bg-white text-slate-700'
                }`}
              >
                Attendee
              </button>
              <button
                onClick={() => switchDemoRole('organizer')}
                className={`px-3 py-1 text-xs rounded-md ${
                  user?.role === 'organizer' ? 'bg-indigo-600 text-white font-semibold' : 'bg-white text-slate-700'
                }`}
              >
                Organizer
              </button>
            </div>
          </div>

          <div className="flex flex-col space-y-1">
            <Link
              to="/events"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-md"
            >
              Explore Events
            </Link>
            {user?.role === 'attendee' && (
              <Link
                to="/my-tickets"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-md"
              >
                My Tickets
              </Link>
            )}
            {user?.role === 'organizer' && (
              <>
                <Link
                  to="/organizer"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-md"
                >
                  Organizer Dashboard
                </Link>
                <Link
                  to="/organizer/events/new"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 text-sm font-medium bg-indigo-600 text-white rounded-md text-center"
                >
                  + Create New Event
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
