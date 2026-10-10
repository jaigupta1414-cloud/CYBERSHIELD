import React from 'react';
import { 
  Shield, 
  Terminal, 
  Sun, 
  Moon, 
  Eye, 
  UserCheck, 
  Wifi, 
  WifiOff, 
  Radio, 
  Menu, 
  X,
  LogOut
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
  toggleSimulatedOffline,
  mobileMenuOpen,
  setMobileMenuOpen,
  firebaseUser,
  onGoogleSignIn,
  onGoogleSignOut,
}) => {
  const tabs: { id: SubsystemTab; label: string }[] = [
    { id: 'incident', label: 'Incident #87795' },
    { id: 'overview', label: 'Overview' },
    { id: 'vault', label: 'Vault' },
    { id: 'network', label: 'Network & Domains' },
    { id: 'compliance', label: 'Legal & Compliance' },
    { id: 'emergency', label: 'SOS Alert' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-[#0c1017]/95 backdrop-blur-md px-3 sm:px-6 py-2.5 transition-colors">
      <div className="flex items-center justify-between gap-3 max-w-[1700px] mx-auto">
        
        {/* Brand & Node Status (Exact match to screenshot) */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <button
            onClick={() => {
              setActiveTab('network');
              sound.playBeep(700, 0.05);
            }}
            className="flex items-center gap-2.5 text-left group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 rounded px-1"
          >
            <div className="w-8 h-8 rounded bg-slate-900 dark:bg-cyan-950/80 border border-slate-700 dark:border-cyan-500/40 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition-transform shadow-xs">
              <Shield className="w-4 h-4 fill-cyan-400/20" />
            </div>
            <div>
              <div className="font-mono-code font-bold text-sm tracking-wider text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <span>CYBERSHIELD</span>
                <span className="hidden xl:inline-block text-[10px] uppercase px-1.5 py-0.2 bg-cyan-100 dark:bg-cyan-950/60 text-cyan-800 dark:text-cyan-300 font-semibold rounded border border-cyan-300 dark:border-cyan-800">
                  SECURE_SSL
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] font-mono-code text-slate-500 dark:text-slate-400">
                <span className="relative flex h-2 w-2">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${syncStatus.isOnline ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
                  <span className={`relative inline-flex rounded-full h-2 w-2 ${syncStatus.isOnline ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                </span>
                <span className="hidden sm:inline">NODE-09 ::</span>
                <span className={syncStatus.isOnline ? 'text-emerald-600 dark:text-emerald-400 font-medium' : 'text-amber-600 dark:text-amber-400 font-medium'}>
                  {syncStatus.isOnline ? 'ONLINE' : 'CACHED'}
                </span>
                <span className="hidden sm:inline text-slate-400 dark:text-slate-600">192.168.1.104</span>
                <span className="hidden lg:inline text-slate-300 dark:text-slate-700">|</span>
                <span className="hidden lg:inline text-[10px] text-cyan-600 dark:text-cyan-400 font-semibold">TLS 1.3 / ENCRYPTED</span>
              </div>
            </div>
          </button>
        </div>

        {/* Desktop Navigation Tabs (Exact match to middle screenshot) */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-100/80 dark:bg-slate-900/80 p-1 rounded-md border border-slate-200 dark:border-slate-800 font-mono-code text-xs">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  sound.playBeep(isActive ? 600 : 750, 0.04);
                }}
                className={`px-3 py-1.5 rounded transition-all font-medium flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-slate-900 text-white dark:bg-cyan-950 dark:text-cyan-300 shadow-xs border border-slate-800 dark:border-cyan-500/30'
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

        {/* Right Tools & Operator Profile */}
        <div className="flex items-center gap-1.5 sm:gap-2">

          {/* Offline / Online indicator */}
          <button
            onClick={() => {
              toggleSimulatedOffline();
              sound.playBeep(500, 0.05);
            }}
            title={syncStatus.isOnline ? 'Online (Click to simulate offline)' : 'Offline (Click to restore online)'}
            className="hidden md:flex items-center gap-1 p-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
          >
            {syncStatus.isOnline ? (
              <Wifi className="w-4 h-4 text-emerald-500" />
            ) : (
              <WifiOff className="w-4 h-4 text-amber-500" />
            )}
          </button>

          {/* Command Terminal Trigger */}
          <button
            onClick={() => {
              onOpenCommandPalette();
              sound.playBeep(800, 0.04);
            }}
            title="Command Console (Ctrl+K or ⌘K)"
            className="p-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
            aria-label="Open Command Console"
          >
            <Terminal className="w-4 h-4" />
          </button>

          {/* High Contrast Toggle */}
          <button
            onClick={() => {
              toggleHighContrast();
              sound.playBeep(650, 0.04);
            }}
            title={isHighContrast ? 'Disable High Contrast' : 'Enable High Contrast'}
            className={`p-1.5 rounded transition border ${
              isHighContrast 
                ? 'bg-amber-400 text-slate-950 border-amber-500 font-bold' 
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border-transparent hover:border-slate-200 dark:hover:border-slate-700'
            }`}
            aria-label="Toggle High Contrast"
          >
            <Eye className="w-4 h-4" />
          </button>

          {/* Theme Switcher - High-Visibility Toggle */}
          <button
            onClick={() => {
              toggleDarkMode();
              sound.playBeep(isDarkMode ? 750 : 950, 0.05);
            }}
            title={isDarkMode ? 'Theme: Dark Mode (Click to switch to Light Mode)' : 'Theme: Light Mode (Click to switch to Dark Mode)'}
            className="flex items-center gap-1.5 px-2 py-1 rounded-md border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-850 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100 font-mono-code text-xs font-semibold shadow-xs transition"
            aria-label="Toggle Theme"
          >
            {isDarkMode ? (
              <>
                <Moon className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden sm:inline text-[11px] text-slate-300">Dark</span>
              </>
            ) : (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-500" />
                <span className="hidden sm:inline text-[11px] text-slate-700">Light</span>
              </>
            )}
          </button>

          {/* Google Sign-In with Firebase or Operator Badge */}
          {firebaseUser ? (
            <div className="flex items-center gap-1.5 pl-1.5 pr-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 font-mono-code text-[11px]">
              {firebaseUser.photoURL ? (
                <img src={firebaseUser.photoURL} alt="Profile" className="w-5 h-5 rounded-full" />
              ) : (
                <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[9px] font-bold">
                  {firebaseUser.displayName?.charAt(0) || 'G'}
                </div>
              )}
              <span className="hidden sm:inline font-bold text-emerald-800 dark:text-emerald-200 truncate max-w-[80px]">
                {firebaseUser.displayName?.split(' ')[0] || 'User'}
              </span>
              <button
                onClick={onGoogleSignOut}
                title="Sign out of Google"
                className="text-slate-400 hover:text-rose-500 p-0.5"
              >
                <LogOut className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <button
              onClick={onGoogleSignIn}
              title="Sign in with Google Account to save to Firebase"
              className="hidden sm:flex items-center gap-1 px-2 py-1 rounded bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-50 font-mono-code text-[11px] font-semibold transition"
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

          {/* Operator Profile Pill (Matches middle screenshot top-right) */}
          <button
            onClick={() => {
              onOpenAuth();
              sound.playBeep(850, 0.04);
            }}
            className="flex items-center gap-2 pl-2 pr-2.5 py-1 rounded bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700 text-left transition group"
            title="Operator Security Profile & Access Level"
          >
            <div className="w-6 h-6 rounded-full bg-cyan-700 dark:bg-cyan-900 border border-cyan-400/40 flex items-center justify-center text-[10px] font-mono-code font-bold text-white shrink-0">
              882
            </div>
            <div className="hidden xl:block">
              <div className="text-[10px] font-mono-code font-bold text-slate-800 dark:text-slate-200 leading-none">
                {operator.badgeNumber}
              </div>
              <div className="text-[9px] font-mono-code text-cyan-600 dark:text-cyan-400 font-semibold leading-tight flex items-center gap-1">
                <UserCheck className="w-2.5 h-2.5" />
                <span>LEVEL-{operator.clearanceLevel} ACCESS</span>
              </div>
            </div>
          </button>

        </div>
      </div>

      {/* Mobile Drawer (Visible when hamburger is toggled) */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-2 pt-3 border-t border-slate-200 dark:border-slate-800 space-y-3 animate-fadeIn">
          
          {/* Mobile Theme Toggle Card */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              {isDarkMode ? <Moon className="w-5 h-5 text-cyan-400" /> : <Sun className="w-5 h-5 text-amber-500" />}
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">Appearance Theme</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  Current: {isDarkMode ? 'Dark Tactical' : 'Light Clean'}
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                toggleDarkMode();
                sound.playBeep(isDarkMode ? 750 : 950, 0.05);
              }}
              className="px-3 py-1.5 rounded-lg bg-slate-900 dark:bg-cyan-950 text-white dark:text-cyan-300 text-xs font-bold border border-slate-700 dark:border-cyan-600/40 shadow-sm"
            >
              {isDarkMode ? '☀️ Switch to Light' : '🌙 Switch to Dark'}
            </button>
          </div>

          {/* High Contrast Controls */}
          <div>
            <button
              onClick={() => {
                toggleHighContrast();
                sound.playBeep(650, 0.04);
              }}
              className={`w-full flex items-center justify-center gap-2 p-2.5 rounded-lg border text-xs font-semibold ${
                isHighContrast
                  ? 'bg-amber-400 text-slate-950 border-amber-500 font-bold'
                  : 'bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800'
              }`}
            >
              <Eye className="w-4 h-4" />
              <span>{isHighContrast ? 'High Contrast Active' : 'Enable High Contrast'}</span>
            </button>
          </div>

          {/* Mobile Navigation Shortcuts */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 font-mono-code text-xs pt-1">
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
                  className={`p-2 rounded text-left transition truncate ${
                    isActive
                      ? 'bg-slate-900 text-white dark:bg-cyan-950 dark:text-cyan-300 font-bold border border-slate-800 dark:border-cyan-500/40'
                      : 'bg-slate-50 dark:bg-slate-900/60 text-slate-600 dark:text-slate-400 hover:bg-slate-200/50'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Google Sign-in on mobile if not signed in */}
          {!firebaseUser && (
            <button
              onClick={() => {
                onGoogleSignIn();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold"
            >
              <span>Sign in with Google to Sync</span>
            </button>
          )}

        </div>
      )}
    </header>
  );
};
