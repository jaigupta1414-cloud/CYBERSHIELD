import React, { useState } from 'react';
import { 
  Lock, 
  HardDrive, 
  Cloud, 
  CloudOff, 
  RotateCw, 
  Download, 
  Upload, 
  Laptop, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle,
  FileText,
  Trash2,
  Database
} from 'lucide-react';
import { CybershieldStore, exportStoreAsJson, saveStore, resetStoreToDefaults } from '../services/storage';
import { SyncStatus } from '../types';
import { sound } from '../services/audio';
import { notificationService } from '../services/notifications';

interface VaultViewProps {
  store: CybershieldStore;
  setStore: React.Dispatch<React.SetStateAction<CybershieldStore>>;
  syncStatus: SyncStatus;
  setSyncStatus: React.Dispatch<React.SetStateAction<SyncStatus>>;
}

export const VaultView: React.FC<VaultViewProps> = ({
  store,
  setStore,
  syncStatus,
  setSyncStatus,
}) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Compute storage size in browser
  const storageJson = JSON.stringify(store);
  const storageSizeBytes = new Blob([storageJson]).size;
  const storageSizeKb = (storageSizeBytes / 1024).toFixed(1);

  const handleManualSync = () => {
    setIsSyncing(true);
    sound.playBeep(700, 0.05);

    setTimeout(() => {
      const nowStr = new Date().toISOString();
      const updated = {
        ...store,
        lastSyncTimestamp: nowStr,
      };
      setStore(updated);
      saveStore(updated);

      setSyncStatus((prev) => ({
        ...prev,
        lastSynced: 'Just now',
        pendingChanges: 0,
      }));

      setIsSyncing(false);
      sound.playSuccess();
      notificationService.send('Storage Synced', 'Configuration and security records synchronized successfully.');
    }, 800);
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.dnsRecords && parsed.operator) {
          setStore(parsed);
          saveStore(parsed);
          sound.playSuccess();
          notificationService.send('Backup Restored', 'Imported security configuration bundle successfully applied.');
          setImportError(null);
        } else {
          setImportError('Invalid backup bundle structure. Missing required security records.');
          sound.playWarning();
        }
      } catch {
        setImportError('Failed to parse JSON file. Please ensure it is a valid CyberShield backup.');
        sound.playWarning();
      }
    };
    reader.readAsText(file);
  };

  const handleResetDefaults = () => {
    const fresh = resetStoreToDefaults();
    setStore(fresh);
    setShowResetConfirm(false);
    sound.playSuccess();
    notificationService.send('Defaults Restored', 'Security configuration reset to default baseline.');
  };

  return (
    <div className="space-y-6 pb-20 max-w-5xl mx-auto font-sans text-xs">
      
      {/* Top Banner */}
      <div className="bg-white dark:bg-[#0e141f] border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-cyan-100 dark:bg-cyan-950/80 text-cyan-600 dark:text-cyan-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Security Configuration &amp; Backup Vault
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Manage local configuration backups, data exports, and cloud synchronization
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${
              syncStatus.isOnline
                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
                : 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800'
            }`}>
              {syncStatus.isOnline ? 'Cloud Sync Active' : 'Offline Mode (Local Only)'}
            </span>
          </div>
        </div>

        {/* Sync Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            {syncStatus.isOnline ? (
              <Cloud className="w-5 h-5 text-cyan-500" />
            ) : (
              <CloudOff className="w-5 h-5 text-amber-500" />
            )}
            <div>
              <div className="font-bold text-slate-900 dark:text-slate-100 text-xs">
                {syncStatus.isOnline ? 'Real-Time Storage Synchronization' : 'Local Standalone Isolation'}
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                Last Synced: <strong>{syncStatus.lastSynced}</strong> · Local footprint: <strong>{storageSizeKb} KB</strong>
              </div>
            </div>
          </div>

          <button
            onClick={handleManualSync}
            disabled={isSyncing}
            className="px-3.5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white font-semibold flex items-center gap-2 transition text-xs cursor-pointer shadow-xs"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Syncing...' : 'Sync Now'}</span>
          </button>
        </div>
      </div>

      {/* Configuration Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0e141f] shadow-xs">
          <div className="text-slate-500 text-[11px] font-semibold uppercase">DNS Records</div>
          <div className="text-xl font-black text-slate-900 dark:text-slate-100 mt-1">
            {store.dnsRecords.length} Active
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1">
            CNAME, A, TXT, MX verified
          </div>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0e141f] shadow-xs">
          <div className="text-slate-500 text-[11px] font-semibold uppercase">Security Milestones</div>
          <div className="text-xl font-black text-slate-900 dark:text-slate-100 mt-1">
            {store.milestones.length} Tracked
          </div>
          <div className="text-[11px] text-cyan-600 dark:text-cyan-400 mt-1">
            MFA, EDR, Rate Limiting
          </div>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0e141f] shadow-xs">
          <div className="text-slate-500 text-[11px] font-semibold uppercase">Operational Tasks</div>
          <div className="text-xl font-black text-slate-900 dark:text-slate-100 mt-1">
            {store.reminders.length} Scheduled
          </div>
          <div className="text-[11px] text-amber-600 dark:text-amber-400 mt-1">
            Audits &amp; Cert renewals
          </div>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0e141f] shadow-xs">
          <div className="text-slate-500 text-[11px] font-semibold uppercase">Emergency Contacts</div>
          <div className="text-xl font-black text-slate-900 dark:text-slate-100 mt-1">
            {store.emergencyContacts.length} Configured
          </div>
          <div className="text-[11px] text-rose-600 dark:text-rose-400 mt-1">
            1-touch dialing active
          </div>
        </div>
      </div>

      {/* Export & Import Tools */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Export Card */}
        <div className="bg-white dark:bg-[#0e141f] border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <Download className="w-4 h-4 text-cyan-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Export Configuration Snapshot
            </h3>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Download a portable, complete JSON backup containing all DNS records, security milestones, scheduled tasks, and emergency response settings.
          </p>

          <button
            onClick={() => {
              exportStoreAsJson(store);
              sound.playSuccess();
              notificationService.send('Backup Downloaded', 'Configuration JSON saved to your downloads folder.');
            }}
            className="w-full py-2.5 px-4 rounded-lg bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-800 dark:hover:bg-slate-700 font-semibold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download Backup (.JSON)</span>
          </button>
        </div>

        {/* Import Card */}
        <div className="bg-white dark:bg-[#0e141f] border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <Upload className="w-4 h-4 text-emerald-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Restore from Backup File
            </h3>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Upload an existing CyberShield configuration JSON file to restore your settings, DNS maps, and operational directives.
          </p>

          <label className="w-full py-2.5 px-4 rounded-lg border border-dashed border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600 font-semibold text-xs flex items-center justify-center gap-2 transition cursor-pointer text-slate-700 dark:text-slate-300">
            <Upload className="w-4 h-4 text-emerald-500" />
            <span>Select JSON File to Restore</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImportJson}
              className="hidden"
            />
          </label>

          {importError && (
            <div className="text-xs text-rose-500 flex items-center gap-1.5 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{importError}</span>
            </div>
          )}
        </div>

      </div>

      {/* Danger Zone: Reset to Baseline */}
      <div className="bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/60 rounded-xl p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-xs font-bold text-rose-800 dark:text-rose-300 uppercase tracking-wider">
              Reset Security Configuration
            </h4>
            <p className="text-[11px] text-rose-700/80 dark:text-rose-400 mt-0.5">
              Restore all DNS records, tasks, milestones, and contacts to fresh corporate baseline defaults.
            </p>
          </div>

          {!showResetConfirm ? (
            <button
              onClick={() => setShowResetConfirm(true)}
              className="px-3 py-1.5 rounded-lg border border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/40 text-xs font-semibold transition cursor-pointer"
            >
              Reset Defaults
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-2.5 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleResetDefaults}
                className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition cursor-pointer shadow-xs"
              >
                Confirm Reset
              </button>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};
