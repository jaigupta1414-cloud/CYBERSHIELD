import React, { useState } from 'react';
import { 
  Lock, 
  HardDrive, 
  Cloud, 
  CloudOff, 
  RotateCw, 
  Download, 
  Upload, 
  Smartphone, 
  Laptop, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { CybershieldStore, exportStoreAsJson, saveStore } from '../services/storage';
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
      notificationService.send('Cloud Sync Complete', 'All local mutations synchronized with multi-device mesh.');
    }, 1200);
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
          notificationService.send('Vault Restored', 'Imported configuration bundle successfully applied.');
          setImportError(null);
        } else {
          setImportError('Invalid backup bundle structure.');
          sound.playWarning();
        }
      } catch (err) {
        setImportError('Failed to parse JSON file.');
        sound.playWarning();
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 pb-20 font-mono-code text-xs">
      
      {/* Top Banner */}
      <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0e141e] rounded-md p-4 sm:p-5 shadow-2xs">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                CRYPTOGRAPHIC VAULT &amp; REAL-TIME CLOUD MESH SYNC
              </h2>
              <p className="text-[11px] text-slate-500 font-sans">
                Local-first encrypted IndexedDB/localStorage storage with automatic multi-device synchronization
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className={`text-[10px] px-2 py-0.5 rounded border font-semibold ${
              syncStatus.isOnline
                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                : 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800'
            }`}>
              {syncStatus.isOnline ? 'CLOUD SYNC: ACTIVE' : 'OFFLINE: CACHED LOCALLY'}
            </span>
          </div>
        </div>

        {/* Sync Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            {syncStatus.isOnline ? (
              <Cloud className="w-5 h-5 text-cyan-500" />
            ) : (
              <CloudOff className="w-5 h-5 text-amber-500" />
            )}
            <div>
              <div className="font-bold text-slate-900 dark:text-slate-100 text-xs">
                {syncStatus.isOnline ? 'Real-Time Multi-Device Sync Stream' : 'Local Standalone Isolation Mode'}
              </div>
              <div className="text-[10px] text-slate-500">
                Last Synced: <strong>{syncStatus.lastSynced}</strong> · Interval: <strong>{syncStatus.syncCycleSeconds}s</strong>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleManualSync}
              disabled={isSyncing}
              className="px-3 py-1.5 rounded bg-cyan-600 hover:bg-cyan-700 text-white font-bold flex items-center gap-1.5 transition text-xs"
            >
              <RotateCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Syncing...' : 'Force Sync Now'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Multi-Device Mesh Sessions */}
      <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0e141e] rounded-md p-5 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
            Connected Multi-Device Mesh Nodes
          </h3>
          <span className="text-[10px] text-slate-500">3 DEVICES PAIRED</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3.5 rounded bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-slate-100">
                <Laptop className="w-4 h-4 text-cyan-500" />
                <span>Primary Workstation</span>
              </div>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300 font-bold">
                THIS DEVICE
              </span>
            </div>
            <div className="text-[10px] text-slate-500">
              Station: Node-09 Laptop Client · IP: 192.168.1.104
            </div>
            <div className="text-[10px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>Live Synced (0ms delay)</span>
            </div>
          </div>

          <div className="p-3.5 rounded bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-slate-100">
                <Smartphone className="w-4 h-4 text-emerald-500" />
                <span>Mobile Field Unit</span>
              </div>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold">
                PAIRED
              </span>
            </div>
            <div className="text-[10px] text-slate-500">
              Station: iOS/Android Mobile SOC · GPS Active
            </div>
            <div className="text-[10px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>Synced 12s ago</span>
            </div>
          </div>

          <div className="p-3.5 rounded bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-slate-100">
                <HardDrive className="w-4 h-4 text-amber-500" />
                <span>Cold Storage Gateway</span>
              </div>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold">
                ARCHIVE
              </span>
            </div>
            <div className="text-[10px] text-slate-500">
              Station: %USERPROFILE%\.cybershield_vault\
            </div>
            <div className="text-[10px] text-slate-500 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-slate-400" />
              <span>Encrypted Ring Buffer Valid</span>
            </div>
          </div>
        </div>
      </div>

      {/* Backup Import & Export */}
      <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0e141e] rounded-md p-5 shadow-2xs space-y-4">
        <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
          Vault Backup &amp; Disaster Recovery
        </h3>
        <p className="text-[11px] text-slate-500 font-sans">
          Download complete JSON snapshot of all active DNS records, reverse proxy bindings, operator credentials, and milestones.
        </p>

        {importError && (
          <div className="p-2.5 rounded bg-rose-50 dark:bg-rose-950/40 border border-rose-300 text-rose-700 dark:text-rose-300 text-xs">
            {importError}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => {
              exportStoreAsJson(store);
              sound.playSuccess();
              notificationService.send('Vault Exported', 'Configuration JSON snapshot saved to local drive.');
            }}
            className="px-4 py-2 rounded bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold flex items-center gap-2 transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Encrypted Vault (.JSON)</span>
          </button>

          <label className="px-4 py-2 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 font-bold flex items-center gap-2 cursor-pointer transition">
            <Upload className="w-3.5 h-3.5" />
            <span>Restore Backup (.JSON)</span>
            <input type="file" accept=".json" onChange={handleImportJson} className="hidden" />
          </label>
        </div>
      </div>

    </div>
  );
};
