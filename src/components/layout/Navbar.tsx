import React, { useEffect, useState } from 'react';
import { useAcuarelaStore } from '../../store/useAcuarelaStore';
import { Palette, Moon, Sun, BookOpen, Clock } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { currentUser, currentView, setCurrentView } = useAcuarelaStore();
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return document.documentElement.classList.contains('dark') || 
      localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleNavigate = (viewType: 'dashboard' | 'pending') => {
    setCurrentView({ type: viewType });
  };

  return (
    <header className="sticky top-0 z-30 w-full glass-panel border-b border-gray-200/40 dark:border-slate-800/40 bg-white/70 dark:bg-slate-950/70 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand / Logo */}
        <div 
          onClick={() => handleNavigate('dashboard')} 
          className="flex items-center gap-2 cursor-pointer group"
        >
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-400 via-purple-400 to-indigo-400 dark:from-rose-500 dark:via-purple-500 dark:to-cyan-500 shadow-md group-hover:scale-105 transition-transform duration-300">
            <Palette className="w-5 h-5 text-white" />
            <div className="absolute inset-0 rounded-xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
          <span className="font-display font-extrabold text-xl tracking-tight bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 dark:from-rose-400 dark:via-purple-400 dark:to-cyan-400 bg-clip-text text-transparent">
            Acuarela
            <span className="font-light text-gray-500 dark:text-gray-400 ml-1 text-sm tracking-normal">LMS</span>
          </span>
        </div>

        {/* Navigation Tabs */}
        {currentUser && (
          <nav className="hidden md:flex items-center gap-2">
            <button
              onClick={() => handleNavigate('dashboard')}
              className={`px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all duration-300 ${
                currentView.type === 'dashboard'
                  ? 'bg-purple-100/80 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-slate-800/50'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              Tablero
            </button>

            {currentUser.role === 'ESTUDIANTE' && (
              <button
                onClick={() => handleNavigate('pending')}
                className={`px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all duration-300 ${
                  currentView.type === 'pending'
                    ? 'bg-purple-100/80 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-slate-800/50'
                }`}
              >
                <Clock className="w-4 h-4" />
                Mis Pendientes
              </button>
            )}
          </nav>
        )}

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2.5 rounded-xl border border-gray-200/55 dark:border-slate-800/80 bg-white/50 dark:bg-slate-900/50 hover:bg-gray-50 dark:hover:bg-slate-800/80 transition-all duration-300 text-gray-600 dark:text-gray-300 cursor-pointer"
            aria-label="Toggle Theme"
          >
            {darkMode ? <Sun className="w-4.5 h-4.5 text-amber-400" /> : <Moon className="w-4.5 h-4.5 text-indigo-500" />}
          </button>

          {/* User Profile Info */}
          {currentUser && (
            <div className="flex items-center gap-2.5 pl-3 border-l border-gray-200/60 dark:border-slate-800/80">
              <div className="hidden lg:flex flex-col text-right">
                <span className="text-sm font-bold text-gray-800 dark:text-slate-100 leading-tight">{currentUser.name}</span>
                <span className="text-[10px] text-gray-400 font-semibold">{currentUser.email}</span>
              </div>
              <img
                src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                alt={currentUser.name}
                className="w-9 h-9 rounded-full border border-purple-500/20 object-cover"
              />
            </div>
          )}
        </div>
      </div>

      {/* Mobile Nav Tabs (Underneath header on small screens) */}
      {currentUser && (
        <div className="md:hidden flex items-center justify-around border-t border-gray-200/30 dark:border-slate-800/20 py-2 px-4 bg-white/40 dark:bg-slate-950/40">
          <button
            onClick={() => handleNavigate('dashboard')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
              currentView.type === 'dashboard'
                ? 'bg-purple-100/70 text-purple-700 dark:bg-purple-950/30 dark:text-purple-300'
                : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Tablero
          </button>
          
          {currentUser.role === 'ESTUDIANTE' && (
            <button
              onClick={() => handleNavigate('pending')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                currentView.type === 'pending'
                  ? 'bg-purple-100/70 text-purple-700 dark:bg-purple-950/30 dark:text-purple-300'
                  : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              <Clock className="w-4 h-4" />
              Mis Pendientes
            </button>
          )}
        </div>
      )}
    </header>
  );
};
