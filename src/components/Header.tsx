import React from 'react';
import { 
  Shield, 
  Terminal, 
  Sun, 
  Moon, 
  Eye, 
  UserCheck, 
  Radio, 
  Menu, 
  X,
  LogOut,
  Search,
  Laptop
} from 'lucide-react';
import { SubsystemTab, OperatorProfile, SyncStatus } from '../types';
import { sound } from '../services/audio';

interface HeaderProps {
  activeTab: SubsystemTab;
  setActiveTab: (tab: SubsystemTab) => void;
  operator: OperatorProfile;
  syncStatus: SyncStatus;
  onOpenAuth: () => void;
  onOpenCommandPalette: () => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  isHighContrast: boolean;
  toggleHighContrast: () => void;
  toggleSimulatedOffline: () => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  firebaseUser: any;
  onGoogleSignIn: () => void;
  onGoogleSignOut: () => void;
  onOpenLaptopProtection?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  operator,
  syncStatus,
  onOpenAuth,
  onOpenCommandPalette,
  isDarkMode,
  toggleDarkMode,
  isHighContrast,
  toggleHighContrast,
  mobileMenuOpen,
  setMobileMenuOpen,
  firebaseUser,
  onGoogleSignIn,
  onGoogleSignOut,
  onOpenLaptopProtection,
}) => {
  const tabs: { id: SubsystemTab; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'incident', label: 'Incidents' },
    { id: 'network', label: 'Network' },
    { id: 'emergency', label: 'Emergency SOS' },
    { id: 'compliance', label: 'Compliance' },
    { id: 'vault', label: 'Vault' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-[#0c1017]/95 backdrop-blur-md px-3 sm:px-6 py-2.5 transition-colors font-sans">
      <div className="flex items-center justify-between gap-3 max-w-[1700px] mx-auto">
        
        {/* Simple & Clean Brand Header */}
        <div className="flex items-center gap-3 shrink-0">
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <button
            onClick={() => {
              setActiveTab('overview');
              sound.playBeep(700, 0.05);
            }}
            className="flex items-center gap-2.5 text-left group focus-visible:outline-none rounded-lg cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-cyan-600 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-sm tracking-tight text-slate-900 dark:text-slate-100 leading-tight">
                CyberShield
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
                <span className="font-medium text-emerald-600 dark:text-emerald-400">
                  {syncStatus.isOnline ? 'Online' : 'Offline'}
                </span>
                <span className="text-slate-300 dark:text-slate-700">·</span>
                <span>Protected</span>
              </div>
            </div>
          </button>

          {/* This Laptop Protection Pill */}
          <button
            onClick={() => {
              if (onOpenLaptopProtection) onOpenLaptopProtection();
              sound.playBeep(700, 0.04);
            }}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition cursor-pointer shadow-2xs"
            title="Check real-time laptop protection shields, run scan, and view threat defense"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
            <Laptop className="w-3.5 h-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
            <span>This Laptop: Protected</span>
          </button>
        </div>

        {/* Clean Navigation Tabs */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-100 dark:bg-slate-900/80 p-1 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-medium">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  sound.playBeep(isActive ? 600 : 750, 0.04);
                }}
                className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800/40'
                }`}
              >
                {tab.id === 'emergency' && (
                  <Radio className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
                )}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Tools & User Profile */}
        <div className="flex items-center gap-2">

          {/* Quick Search / Command Console button */}
          <button
            onClick={() => {
              onOpenCommandPalette();
              sound.playBeep(800, 0.04);
            }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 text-xs transition cursor-pointer shadow-2xs"
            title="Search commands and pages (Ctrl+K)"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Search</span>
            <kbd className="hidden sm:inline px-1 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-[10px] font-mono text-slate-500">
              ⌘K
            </kbd>
          </button>

          {/* Theme Switcher Toggle */}
          <button
            onClick={() => {
              toggleDarkMode();
              sound.playBeep(isDarkMode ? 750 : 950, 0.05);
            }}
            className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle Theme"
          >
            {isDarkMode ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-600" />
            )}
          </button>

          {/* Google Sign-In with Firebase or Operator Badge */}
          {firebaseUser ? (
            <div className="flex items-center gap-2 pl-2 pr-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-xs">
              {firebaseUser.photoURL ? (
                <img src={firebaseUser.photoURL} alt="Profile" className="w-5 h-5 rounded-full" />
              ) : (
                <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold">
                  {firebaseUser.displayName?.charAt(0) || 'U'}
                </div>
              )}
              <span className="hidden sm:inline font-semibold text-emerald-800 dark:text-emerald-200 truncate max-w-[90px]">
                {firebaseUser.displayName?.split(' ')[0] || 'User'}
              </span>
              <button
                onClick={onGoogleSignOut}
                title="Sign out of Google"
                className="text-slate-400 hover:text-rose-500 p-0.5 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={onGoogleSignIn}
              title="Sign in with Google to sync data"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold transition cursor-pointer shadow-2xs"
            >
              <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Sign in</span>
            </button>
          )}

          {/* User Profile Pill */}
          <button
            onClick={() => {
              onOpenAuth();
              sound.playBeep(850, 0.04);
            }}
            className="flex items-center gap-2 pl-2 pr-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-left transition cursor-pointer"
            title="Security Profile"
          >
            <div className="w-6 h-6 rounded-full bg-cyan-700 text-white flex items-center justify-center text-xs font-bold shrink-0">
              {operator.callsign.charAt(0)}
            </div>
            <div className="hidden xl:block">
              <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-tight">
                {operator.callsign || 'Analyst'}
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium leading-tight">
                {operator.role || 'Security Analyst'}
              </div>
            </div>
          </button>

        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-2 pt-3 border-t border-slate-200 dark:border-slate-800 space-y-3 animate-fadeIn">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs pt-1">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setMobileMenuOpen(false);
                    sound.playBeep(isActive ? 600 : 750, 0.04);
                  }}
                  className={`p-2.5 rounded-lg text-left transition truncate cursor-pointer ${
                    isActive
                      ? 'bg-cyan-600 text-white font-bold'
                      : 'bg-slate-50 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {!firebaseUser && (
            <button
              onClick={() => {
                onGoogleSignIn();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold cursor-pointer"
            >
              <span>Sign in with Google</span>
            </button>
          )}
        </div>
      )}
    </header>
  );
};
