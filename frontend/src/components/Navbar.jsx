import React, { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Sparkles, Menu, X, User, BarChart3, Info, LogIn, Home, Sun, Moon } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { theme, toggleTheme } = useTheme()
  const { user, logout } = useAuth()

  const toggleMenu = () => setIsOpen(!isOpen)
  const closeMenu = () => setIsOpen(false)

  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Dashboard', path: '/dashboard', icon: BarChart3 },
    { name: 'AI Generator', path: '/ai-generator', icon: Sparkles },
    { name: 'About', path: '/about', icon: Info },
  ]

  const activeClassName = "text-sky-600 dark:text-sky-400 border-b-2 border-sky-600 dark:border-sky-400 py-1"
  const inactiveClassName = "text-slate-600 dark:text-gray-300 hover:text-sky-600 dark:hover:text-sky-400 transition-colors py-1"

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-slate-200 dark:border-white/5 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <Link to="/" onClick={closeMenu} className="flex items-center gap-2 group">
            <div className="bg-gradient-brand p-2 rounded-xl text-white shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform duration-300">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-300 transition-colors">
              Insight<span className="bg-gradient-brand bg-clip-text text-transparent">Stay</span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  isActive ? activeClassName : inactiveClassName
                }
              >
                <span className="font-semibold text-sm">{item.name}</span>
              </NavLink>
            ))}
          </div>

          {/* Desktop Action / Profile Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {/* Theme Toggle Button */}
            <button 
              onClick={toggleTheme}
              className="p-1.5 rounded-xl text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/40 dark:hover:bg-slate-800/80 border border-slate-200 dark:border-white/5 transition-all cursor-pointer"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-4.5 h-4.5 text-amber-400 animate-pulse" /> : <Moon className="w-4.5 h-4.5 text-indigo-600" />}
            </button>

            {!user ? (
              <>
                <Link
                  to="/login"
                  className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-slate-600 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Login</span>
                </Link>
                
                <Link
                  to="/login"
                  className="bg-gradient-brand hover:opacity-95 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-md shadow-indigo-500/10 hover:shadow-sky-500/20"
                >
                  Get Started
                </Link>
              </>
            ) : (
              <>
                <span className="text-xs text-slate-500 dark:text-gray-400 font-medium">Hi, {user.name.split(' ')[0]}</span>
                <button
                  onClick={logout}
                  className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-rose-500 hover:text-rose-600 transition-colors cursor-pointer"
                >
                  <LogIn className="w-4 h-4 rotate-180" />
                  <span>Logout</span>
                </button>
              </>
            )}

            <Link 
              to={user ? "/profile" : "/login"}
              className="p-1.5 rounded-xl text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/40 dark:hover:bg-slate-800/80 border border-slate-200 dark:border-white/5 transition-all cursor-pointer"
            >
              <User className="w-4.5 h-4.5" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            {/* Theme Toggle Button for Mobile */}
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/40 dark:hover:bg-slate-800/80 border border-slate-200 dark:border-white/5 transition-all cursor-pointer"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-indigo-600" />}
            </button>

            <Link
              to={user ? "/profile" : "/login"}
              className="p-2.5 rounded-xl text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white"
              onClick={closeMenu}
            >
              <User className="w-5 h-5" />
            </Link>
            
            <button
              onClick={toggleMenu}
              type="button"
              className="p-2 rounded-xl text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/50 border border-slate-200 dark:border-white/5 transition-colors focus:outline-none cursor-pointer"
              aria-controls="mobile-menu"
              aria-expanded={isOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Overlay / Menu */}
      {isOpen && (
        <div className="md:hidden glass-panel border-t border-slate-200 dark:border-white/5 animate-in slide-in-from-top duration-200" id="mobile-menu">
          <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  onClick={closeMenu}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-xl text-base font-semibold transition-colors ${
                      isActive
                        ? 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-l-4 border-sky-600 dark:border-sky-400'
                        : 'text-slate-600 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white'
                    }`
                  }
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </NavLink>
              )
            })}
            
            <div className="pt-4 pb-2 border-t border-slate-200 dark:border-white/5 px-3 flex flex-col gap-2">
              {!user ? (
                <>
                  <Link
                    to="/login"
                    onClick={closeMenu}
                    className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl text-base font-semibold text-slate-600 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/40 dark:border-white/5 border border-slate-200 transition-all"
                  >
                    <LogIn className="w-5 h-5" />
                    <span>Login</span>
                  </Link>
                  
                  <Link
                    to="/login"
                    onClick={closeMenu}
                    className="flex items-center justify-center gap-2 w-full bg-gradient-brand text-white px-4 py-2.5 rounded-xl text-base font-semibold transition-all shadow-md"
                  >
                    <Sparkles className="w-5 h-5" />
                    <span>Get Started</span>
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/profile"
                    onClick={closeMenu}
                    className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl text-base font-semibold text-slate-600 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/40 dark:border-white/5 border border-slate-200 transition-all"
                  >
                    <User className="w-5 h-5" />
                    <span>View Profile</span>
                  </Link>
                  
                  <button
                    onClick={() => {
                      closeMenu();
                      logout();
                    }}
                    className="flex items-center justify-center gap-2 w-full bg-rose-600 hover:bg-rose-700 text-white px-4 py-2.5 rounded-xl text-base font-semibold transition-all shadow-md cursor-pointer"
                  >
                    <LogIn className="w-5 h-5 rotate-180" />
                    <span>Logout</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
