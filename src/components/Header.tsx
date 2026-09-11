import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Stethoscope,
  User,
  Mic,
  FileText,
  CheckCircle2,
  Globe,
  Sparkles,
  LogOut,
  Shield,
  Clock,
  Activity,
  Layers,
  ChevronDown,
  LayoutDashboard,
  Users,
  Menu,
  X,
} from 'lucide-react';
import { AuthUser, CaseTakingSession, LanguageCode, UserRole } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { SUPPORTED_LANGUAGES } from '../i18n/languages';

interface HeaderProps {
  user: AuthUser | null;
  currentSession: CaseTakingSession | null;
  onSelectSampleCase?: (caseId: string) => void;
  onLanguageChange?: (lang: LanguageCode) => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  currentSession,
  onSelectSampleCase,
  onLanguageChange,
  onLogout,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
  const { language, setLanguage, openLanguageSelector } = useLanguage();

  const currentLang =
    SUPPORTED_LANGUAGES.find((l) => l.code === language) ||
    SUPPORTED_LANGUAGES[0];

  const handleSelectLanguage = (code: LanguageCode) => {
    setLanguage(code);
    if (onLanguageChange) {
      onLanguageChange(code);
    }
  };

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const roleBadgeColors: Record<UserRole, string> = {
    patient: 'bg-teal-50 text-teal-700 border-teal-200',
    doctor: 'bg-blue-50 text-blue-700 border-blue-200',
    admin: 'bg-purple-50 text-purple-700 border-purple-200',
  };

  return (
    <div className="sticky top-3 z-40 px-3 sm:px-6 max-w-7xl mx-auto w-full transition-all">
      <header className="rounded-full bg-white/95 backdrop-blur-2xl border border-slate-200/80 shadow-[0_12px_35px_rgba(15,23,42,0.07)] px-4 sm:px-6 py-2.5 flex items-center justify-between transition-all">
        {/* Logo & Healthcare Branding */}
        <Link
          id="navbar-logo-link"
          to={user ? (user.role === 'doctor' ? '/doctor-dashboard' : user.role === 'admin' ? '/admin-dashboard' : '/patient-dashboard') : '/'}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-teal-500 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-teal-500/25 group-hover:scale-105 transition-transform">
            <Stethoscope className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg sm:text-xl text-slate-900 tracking-tight">
                Swasthya <span className="text-blue-600 font-black">AI</span>
              </span>
              {user && (
                <span
                  className={`hidden sm:inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                    roleBadgeColors[user.role]
                  }`}
                >
                  {user.role}
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400 font-medium hidden md:block">
              Clinical Intelligence for Better Care
            </p>
          </div>
        </Link>

        {/* Middle Navigation Links (Swasthya AI | Home | Features | About | Contact | Login) */}
        <nav className="hidden lg:flex items-center gap-1 text-xs sm:text-sm font-semibold text-slate-600">
          <Link
            id="nav-link-home"
            to="/"
            className={`px-4 py-1.5 rounded-full transition-all cursor-pointer ${
              isActive('/')
                ? 'bg-blue-50 text-blue-600 font-bold'
                : 'hover:text-blue-600 hover:bg-slate-50'
            }`}
          >
            Home
          </Link>
          <Link
            id="nav-link-features"
            to="/features"
            className={`px-4 py-1.5 rounded-full transition-all cursor-pointer ${
              isActive('/features')
                ? 'bg-blue-50 text-blue-600 font-bold'
                : 'hover:text-blue-600 hover:bg-slate-50'
            }`}
          >
            Features
          </Link>
          <Link
            id="nav-link-about"
            to="/about"
            className={`px-4 py-1.5 rounded-full transition-all cursor-pointer ${
              isActive('/about')
                ? 'bg-blue-50 text-blue-600 font-bold'
                : 'hover:text-blue-600 hover:bg-slate-50'
            }`}
          >
            About
          </Link>
          <Link
            id="nav-link-contact"
            to="/contact"
            className={`px-4 py-1.5 rounded-full transition-all cursor-pointer ${
              isActive('/contact')
                ? 'bg-blue-50 text-blue-600 font-bold'
                : 'hover:text-blue-600 hover:bg-slate-50'
            }`}
          >
            Contact
          </Link>

          {/* Authenticated user links */}
          {user && (
            <div className="h-4 w-px bg-slate-200 mx-1.5" />
          )}

          {user && user.role === 'patient' && (
            <>
              <Link
                to="/patient-dashboard"
                className={`px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5 cursor-pointer ${
                  isActive('/patient-dashboard')
                    ? 'bg-teal-50 text-teal-700 font-bold'
                    : 'hover:text-teal-700 hover:bg-slate-50'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Portal</span>
              </Link>
              <Link
                to="/voice-intake"
                className={`px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5 cursor-pointer ${
                  isActive('/voice-intake')
                    ? 'bg-blue-50 text-blue-600 font-bold'
                    : 'hover:text-blue-600 hover:bg-slate-50'
                }`}
              >
                <Mic className="w-3.5 h-3.5 text-blue-600" />
                <span>Voice Flow</span>
              </Link>
              <Link
                to="/documents"
                className={`px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5 cursor-pointer ${
                  isActive('/documents')
                    ? 'bg-blue-50 text-blue-600 font-bold'
                    : 'hover:text-blue-600 hover:bg-slate-50'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Records</span>
              </Link>
            </>
          )}

          {user && user.role === 'doctor' && (
            <>
              <Link
                to="/doctor-dashboard"
                className={`px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5 cursor-pointer ${
                  isActive('/doctor-dashboard')
                    ? 'bg-blue-50 text-blue-600 font-bold'
                    : 'hover:text-blue-600 hover:bg-slate-50'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>OPD Queue</span>
              </Link>
              <Link
                to="/voice-intake"
                className={`px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5 cursor-pointer ${
                  isActive('/voice-intake')
                    ? 'bg-teal-50 text-teal-700 font-bold'
                    : 'hover:text-teal-700 hover:bg-slate-50'
                }`}
              >
                <Mic className="w-3.5 h-3.5 text-teal-600" />
                <span>Live Intake</span>
              </Link>
            </>
          )}

          {user && user.role === 'admin' && (
            <Link
              to="/admin-dashboard"
              className={`px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5 cursor-pointer ${
                isActive('/admin-dashboard')
                  ? 'bg-purple-50 text-purple-700 font-bold'
                  : 'hover:text-purple-700 hover:bg-slate-50'
              }`}
            >
              <Shield className="w-3.5 h-3.5 text-purple-600" />
              <span>Admin Console</span>
            </Link>
          )}
        </nav>

        {/* Right Controls Area */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Case Switcher for Doctor / Admin */}
          {user && user.role !== 'patient' && onSelectSampleCase && (
            <div className="hidden xl:flex items-center bg-slate-50 px-2 py-1 rounded-full border border-slate-200 text-xs">
              <span className="text-slate-400 font-bold text-[10px] mr-1">Case:</span>
              {[
                { id: 'session-rahul-28', label: 'Rahul (28M)' },
                { id: 'session-savitri-72', label: 'Savitri (72F)' },
                { id: 'session-gurpreet-70', label: 'Gurpreet (70M)' },
              ].map((c) => (
                <button
                  key={c.id}
                  onClick={() => onSelectSampleCase(c.id)}
                  className={`px-2 py-0.5 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                    currentSession?.id === c.id
                      ? 'bg-white text-blue-600 shadow-xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          )}

          {/* Regional Language Switcher Dropdown */}
          <div className="relative">
            <button
              id="navbar-language-btn"
              type="button"
              onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 transition cursor-pointer shadow-xs"
            >
              <Globe className="w-3.5 h-3.5 text-teal-600 shrink-0" />
              <span className="font-bold text-slate-800 hidden sm:inline">{currentLang.nativeName}</span>
              <span className="font-bold text-slate-800 sm:hidden">{currentLang.code.toUpperCase()}</span>
              <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
            </button>

            {isLangDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-40 bg-black/20 backdrop-blur-2xs"
                  onClick={() => setIsLangDropdownOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 z-50 animate-in fade-in duration-150 max-h-80 overflow-y-auto">
                  <div className="px-3.5 py-1.5 border-b border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] uppercase font-extrabold text-slate-400">
                      Languages (13 Regional)
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setIsLangDropdownOpen(false);
                        openLanguageSelector();
                      }}
                      className="text-[10px] font-bold text-blue-600 hover:underline cursor-pointer"
                    >
                      More ↗
                    </button>
                  </div>
                  <div className="py-1">
                    {SUPPORTED_LANGUAGES.map((l) => {
                      const isSelected = l.code === language;
                      return (
                        <button
                          key={l.code}
                          type="button"
                          onClick={() => {
                            handleSelectLanguage(l.code);
                            setIsLangDropdownOpen(false);
                          }}
                          className={`w-full px-3.5 py-2 text-left flex items-center justify-between text-xs transition cursor-pointer ${
                            isSelected
                              ? 'bg-teal-50 text-teal-800 font-bold'
                              : 'text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          <div>
                            <span className="font-bold text-slate-900">{l.nativeName}</span>
                            <span className="text-[11px] text-slate-400 ml-1.5">({l.englishName})</span>
                          </div>
                          {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* User Profile or Login CTA */}
          {!user ? (
            <div className="flex items-center gap-2">
              <Link
                id="navbar-login-btn"
                to="/login"
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 sm:px-5 py-2 rounded-full font-bold text-xs sm:text-sm shadow-md shadow-blue-500/25 flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <User className="w-4 h-4" />
                <span>Login</span>
              </Link>
            </div>
          ) : (
            <div className="relative">
              <button
                id="navbar-profile-btn"
                type="button"
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center gap-2 p-1.5 pl-2.5 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 transition cursor-pointer shadow-xs"
              >
                <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                  {user.fullName.charAt(0)}
                </div>
                <span className="max-w-[100px] truncate hidden sm:inline">{user.fullName}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 mr-1" />
              </button>

              {isProfileMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40 bg-black/20 backdrop-blur-2xs"
                    onClick={() => setIsProfileMenuOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 z-50 animate-in fade-in duration-150 text-xs space-y-1">
                    <div className="p-2 border-b border-slate-100">
                      <p className="font-bold text-slate-900 truncate">{user.fullName}</p>
                      <p className="text-[10px] text-slate-400 capitalize">{user.role} Portal</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        navigate(
                          user.role === 'doctor'
                            ? '/doctor-dashboard'
                            : user.role === 'admin'
                            ? '/admin-dashboard'
                            : '/patient-dashboard'
                        );
                      }}
                      className="w-full text-left p-2 rounded-xl hover:bg-slate-50 font-semibold text-slate-700 flex items-center gap-2 cursor-pointer"
                    >
                      <LayoutDashboard className="w-4 h-4 text-blue-600" />
                      <span>My Dashboard</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        setIsLogoutConfirmOpen(true);
                      }}
                      className="w-full text-left p-2 rounded-xl hover:bg-rose-50 text-rose-600 font-semibold flex items-center gap-2 cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 text-rose-500" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Mobile Hamburger Toggle */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-full hover:bg-slate-100 text-slate-700 cursor-pointer"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden mt-2 p-4 bg-white/95 backdrop-blur-xl rounded-3xl border border-slate-200 shadow-xl space-y-2 text-left">
          <Link
            to="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className={`block px-4 py-2 rounded-xl text-sm font-bold ${
              isActive('/') ? 'bg-blue-50 text-blue-600' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            Home
          </Link>
          <Link
            to="/features"
            onClick={() => setIsMobileMenuOpen(false)}
            className={`block px-4 py-2 rounded-xl text-sm font-bold ${
              isActive('/features') ? 'bg-blue-50 text-blue-600' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            Features
          </Link>
          <Link
            to="/about"
            onClick={() => setIsMobileMenuOpen(false)}
            className={`block px-4 py-2 rounded-xl text-sm font-bold ${
              isActive('/about') ? 'bg-blue-50 text-blue-600' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            About
          </Link>
          <Link
            to="/contact"
            onClick={() => setIsMobileMenuOpen(false)}
            className={`block px-4 py-2 rounded-xl text-sm font-bold ${
              isActive('/contact') ? 'bg-blue-50 text-blue-600' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            Contact
          </Link>

          {!user ? (
            <div className="pt-2 border-t border-slate-100 flex gap-2">
              <Link
                to="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex-1 py-2 text-center rounded-xl bg-blue-600 text-white font-bold text-sm"
              >
                Login
              </Link>
              <Link
                to="/signup"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex-1 py-2 text-center rounded-xl bg-slate-100 text-slate-700 font-bold text-sm"
              >
                Sign Up
              </Link>
            </div>
          ) : (
            <div className="pt-2 border-t border-slate-100 space-y-1">
              <Link
                to={user.role === 'doctor' ? '/doctor-dashboard' : user.role === 'admin' ? '/admin-dashboard' : '/patient-dashboard'}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-4 py-2 rounded-xl text-sm font-bold text-blue-600 hover:bg-blue-50"
              >
                My Dashboard
              </Link>
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onLogout();
                }}
                className="w-full text-left px-4 py-2 rounded-xl text-sm font-bold text-rose-600 hover:bg-rose-50"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      )}

      {/* Logout Confirmation Dialog */}
      {isLogoutConfirmOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-100 space-y-4 text-left">
            <h4 className="font-bold text-base text-slate-900">Confirm Sign Out</h4>
            <p className="text-xs text-slate-500">
              Are you sure you want to end your clinical session? Your entries have been synced.
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setIsLogoutConfirmOpen(false)}
                className="flex-1 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsLogoutConfirmOpen(false);
                  onLogout();
                }}
                className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs cursor-pointer shadow-sm"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
