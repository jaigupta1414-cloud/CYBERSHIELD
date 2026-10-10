import React, { useState, useEffect } from 'react';
import { SubsystemTab, SyncStatus } from './types';
import { loadStore, saveStore, CybershieldStore } from './services/storage';
import { notificationService, AppNotification } from './services/notifications';
import { sound } from './services/audio';
import { 
  subscribeAuth, 
  loginWithGoogle, 
  logoutUser, 
  saveUserCloudVault, 
  loadUserCloudVault 
} from './services/firebase';

import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { MobileNav } from './components/MobileNav';
import { NetworkDomainsView } from './components/NetworkDomainsView';
import { LegalComplianceView } from './components/LegalComplianceView';
import { OverviewView } from './components/OverviewView';
import { EmergencySosView } from './components/EmergencySosView';
import { VaultView } from './components/VaultView';
import { AuthModal } from './components/AuthModal';
import { CommandPalette } from './components/CommandPalette';
import { LaptopProtectionModal } from './components/LaptopProtectionModal';
import { IncidentDetailView } from './components/IncidentDetailView';
import { SecurityIncident } from './types';

export default function App() {
  const [store, setStore] = useState<CybershieldStore>(() => loadStore());
  const [activeTab, setActiveTab] = useState<SubsystemTab>('overview');

  // Theming & Accessibility - Simple Mode defaults to TRUE for non-technical users!
  const [simpleMode, setSimpleMode] = useState<boolean>(true);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('cybershield_theme');
      if (saved) return saved === 'dark';
      return true; // Default to tactical dark mode matching high-tech SOC
    }
    return true;
  });

  const [isHighContrast, setIsHighContrast] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Firebase Auth state
  const [firebaseUser, setFirebaseUser] = useState<any>(null);

  // Sync & Online state
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    isOnline: true,
    lastSynced: 'Just now',
    syncCycleSeconds: 15,
    pendingChanges: 0,
    clusterTarget: 'NODE-09',
    safeRollbackActive: true,
  });

  // Modals & Palette
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [showLaptopProtectionModal, setShowLaptopProtectionModal] = useState(false);

  // Cluster Telemetry live simulation
  const [clusterLatency, setClusterLatency] = useState(14);
  const [threatBlockedRate, setThreatBlockedRate] = useState(99.98);

  // Subscribe to Firebase Auth
  useEffect(() => {
    const unsubAuth = subscribeAuth(async (user) => {
      setFirebaseUser(user);
      if (user) {
        // Load cloud vault if exists
        try {
          const cloudData = await loadUserCloudVault(user.uid);
          if (cloudData && cloudData.dnsRecords) {
            setStore((prev) => ({ ...prev, ...cloudData }));
            notificationService.send('Cloud Vault Loaded', `Welcome back, ${user.displayName || 'Operator'}! Your progress was restored.`);
          }
        } catch {
          // Fallback to local
        }
      }
    });

    // Online / Offline listener
    const handleOnline = () => {
      setSyncStatus((prev) => ({ ...prev, isOnline: true }));
      notificationService.send('Network Connected', 'Connected to cloud servers. Sync active.');
    };
    const handleOffline = () => {
      setSyncStatus((prev) => ({ ...prev, isOnline: false }));
      notificationService.send('Working Offline', 'Changes will be saved locally on your device.');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Periodic 15s sync heartbeat simulation & Cloud backup
    const syncInterval = setInterval(() => {
      if (syncStatus.isOnline && !store.isSimulatedOffline) {
        setSyncStatus((prev) => ({
          ...prev,
          lastSynced: 'Just now',
          pendingChanges: 0,
        }));
        setClusterLatency(Math.floor(12 + Math.random() * 4));

        // Sync to Firebase if authenticated
        if (firebaseUser) {
          saveUserCloudVault(firebaseUser.uid, {
            dnsRecords: store.dnsRecords,
            milestones: store.milestones,
            reminders: store.reminders,
          }).catch(() => {});
        }
      }
    }, 15000);

    // Global keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setShowCommandPalette((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      unsubAuth();
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(syncInterval);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [store.isSimulatedOffline, syncStatus.isOnline, firebaseUser, store.dnsRecords, store.milestones, store.reminders]);

  // Persist dark mode class to html element, body and localStorage
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    if (isDarkMode) {
      root.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
      body.classList.add('dark');
      body.setAttribute('data-theme', 'dark');
      localStorage.setItem('cybershield_theme', 'dark');
    } else {
      root.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
      body.classList.remove('dark');
      body.setAttribute('data-theme', 'light');
      localStorage.setItem('cybershield_theme', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  const toggleHighContrast = () => {
    setIsHighContrast((prev) => !prev);
  };

  const toggleSimpleMode = () => {
    setSimpleMode((prev) => !prev);
  };

  const toggleSimulatedOffline = () => {
    const nextVal = !store.isSimulatedOffline;
    const updated = { ...store, isSimulatedOffline: nextVal };
    setStore(updated);
    saveStore(updated);
    setSyncStatus((prev) => ({ ...prev, isOnline: !nextVal }));
    notificationService.send(
      nextVal ? 'Offline Test Active' : 'Online Mode Restored',
      nextVal ? 'All data is now kept safely inside this device.' : 'Connected to cloud backup.'
    );
  };

  const handleGoogleSignIn = async () => {
    sound.playBeep(750, 0.05);
    try {
      const user = await loginWithGoogle();
      if (user) {
        sound.playSuccess();
        notificationService.send('Google Sign-in Successful', `Identified as ${user.displayName || user.email}. Progress synced to Firestore.`);
      }
    } catch (err: any) {
      sound.playWarning();
      notificationService.send('Sign-in Notice', err.message || 'Google Sign-in popup closed.');
    }
  };

  const handleGoogleSignOut = async () => {
    sound.playBeep(600, 0.04);
    await logoutUser();
    notificationService.send('Signed Out', 'Your session has ended safely.');
  };

  return (
    <div className={`${isDarkMode ? 'dark' : ''} min-h-screen flex flex-col bg-slate-100 dark:bg-[#070a0f] text-slate-800 dark:text-slate-200 transition-colors ${
      isHighContrast ? 'contrast-125 saturate-150' : ''
    }`}>
      
      {/* Top Header matching sketches */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        operator={store.operator}
        syncStatus={syncStatus}
        onOpenAuth={() => setShowAuthModal(true)}
        onOpenCommandPalette={() => setShowCommandPalette(true)}
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
        isHighContrast={isHighContrast}
        toggleHighContrast={toggleHighContrast}
        toggleSimulatedOffline={toggleSimulatedOffline}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        firebaseUser={firebaseUser}
        onGoogleSignIn={handleGoogleSignIn}
        onGoogleSignOut={handleGoogleSignOut}
        onOpenLaptopProtection={() => setShowLaptopProtectionModal(true)}
      />

      {/* Main Layout Area */}
      <div className="flex-1 flex max-w-[1700px] w-full mx-auto">
        
        {/* Desktop Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          clusterLatency={clusterLatency}
          threatBlockedRate={threatBlockedRate}
          onQuickSos={() => {
            setActiveTab('emergency');
            sound.playWarning();
          }}
          onOpenLaptopProtection={() => setShowLaptopProtectionModal(true)}
        />

        {/* Central Workspace Content */}
        <main className="flex-1 p-3 sm:p-6 lg:p-8 min-w-0 overflow-y-auto">
          
          {/* Active Subsystem View */}
          {activeTab === 'incident' && (
            <IncidentDetailView
              onBack={() => setActiveTab('overview')}
            />
          )}

          {activeTab === 'network' && (
            <NetworkDomainsView 
              store={store} 
              setStore={setStore} 
            />
          )}

          {activeTab === 'compliance' && (
            <LegalComplianceView />
          )}

          {activeTab === 'overview' && (
            <OverviewView
              store={store}
              setStore={setStore}
              onNavigateToTab={(tab) => setActiveTab(tab)}
              onOpenLaptopProtection={() => setShowLaptopProtectionModal(true)}
            />
          )}

          {activeTab === 'emergency' && (
            <EmergencySosView
              operator={store.operator}
              emergencyContacts={store.emergencyContacts}
              onAddContact={(contact) => {
                const updated = { ...store, emergencyContacts: [...store.emergencyContacts, contact] };
                setStore(updated);
                saveStore(updated);
              }}
              onDeleteContact={(id) => {
                const updated = { ...store, emergencyContacts: store.emergencyContacts.filter(c => c.id !== id) };
                setStore(updated);
                saveStore(updated);
              }}
            />
          )}

          {activeTab === 'vault' && (
            <VaultView
              store={store}
              setStore={setStore}
              syncStatus={syncStatus}
              setSyncStatus={setSyncStatus}
            />
          )}

        </main>
      </div>

      {/* Mobile Bottom Navigation Bar (Matches sketch bottom bar) */}
      <MobileNav activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Modals */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        operator={store.operator}
        setOperator={(op) => {
          const updated = { ...store, operator: op };
          setStore(updated);
          saveStore(updated);
        }}
      />

      <CommandPalette
        isOpen={showCommandPalette}
        onClose={() => setShowCommandPalette(false)}
        onSelectTab={(tab) => setActiveTab(tab)}
        onTriggerSos={() => {
          setActiveTab('emergency');
          sound.playWarning();
        }}
        toggleDarkMode={toggleDarkMode}
        toggleOffline={toggleSimulatedOffline}
        onOpenLaptopProtection={() => setShowLaptopProtectionModal(true)}
      />

      {/* Dedicated Laptop Protection Center Modal */}
      <LaptopProtectionModal
        isOpen={showLaptopProtectionModal}
        onClose={() => setShowLaptopProtectionModal(false)}
      />

    </div>
  );
}
