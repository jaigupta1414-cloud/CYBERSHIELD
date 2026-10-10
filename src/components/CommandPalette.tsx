import React, { useState, useEffect } from 'react';
import { 
  Terminal, 
  Search, 
  Globe, 
  Lock, 
  FileCheck2, 
  Radio, 
  RotateCw, 
  Sun, 
  Wifi, 
  X, 
  ShieldAlert
} from 'lucide-react';
import { SubsystemTab } from '../types';
import { sound } from '../services/audio';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab: (tab: SubsystemTab) => void;
  onTriggerSos: () => void;
  toggleDarkMode: () => void;
  toggleOffline: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onSelectTab,
  onTriggerSos,
  toggleDarkMode,
  toggleOffline,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        // Handled by parent or toggle
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const actions = [
    { id: 'tab-incident', label: 'Navigate: Incident #87795 (Malware Prevented Report)', icon: <ShieldAlert className="w-4 h-4 text-rose-500" />, run: () => onSelectTab('incident') },
    { id: 'tab-network', label: 'Navigate: Network & Domains (DNS / Proxy)', icon: <Globe className="w-4 h-4 text-cyan-500" />, run: () => onSelectTab('network') },
    { id: 'tab-overview', label: 'Navigate: Overview (Milestones & Trends)', icon: <RotateCw className="w-4 h-4 text-cyan-500" />, run: () => onSelectTab('overview') },
    { id: 'tab-vault', label: 'Navigate: Secure Vault (Backups & Credentials)', icon: <Lock className="w-4 h-4 text-cyan-500" />, run: () => onSelectTab('vault') },
    { id: 'tab-compliance', label: 'Navigate: Legal & Compliance (ISO-27001)', icon: <FileCheck2 className="w-4 h-4 text-cyan-500" />, run: () => onSelectTab('compliance') },
    { id: 'tab-sos', label: 'Trigger: Emergency SOS & GPS Beacon', icon: <Radio className="w-4 h-4 text-rose-500 animate-pulse" />, run: () => onTriggerSos() },
    { id: 'action-theme', label: 'Toggle: Dark / Light Tactical Theme', icon: <Sun className="w-4 h-4 text-amber-500" />, run: () => toggleDarkMode() },
    { id: 'action-offline', label: 'Toggle: Network Offline Simulation', icon: <Wifi className="w-4 h-4 text-emerald-500" />, run: () => toggleOffline() },
  ];

  const filtered = actions.filter((a) => a.label.toLowerCase().includes(query.toLowerCase()));

  const executeAction = (action: typeof actions[0]) => {
    sound.playBeep(800, 0.04);
    action.run();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-start justify-center pt-20 p-4">
      <div className="bg-white dark:bg-[#0e141e] border border-slate-300 dark:border-slate-700 rounded-lg max-w-lg w-full shadow-2xl font-mono-code text-xs overflow-hidden">
        
        {/* Search header */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-200 dark:border-slate-800">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Type a command or jump to subsystem... (Esc to close)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden text-xs"
          />
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Command list */}
        <div className="p-2 max-h-72 overflow-y-auto space-y-1">
          {filtered.length === 0 ? (
            <div className="p-4 text-center text-slate-400">No matching commands found.</div>
          ) : (
            filtered.map((action) => (
              <button
                key={action.id}
                onClick={() => executeAction(action)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800/80 text-left text-slate-700 dark:text-slate-200 transition"
              >
                {action.icon}
                <span className="font-medium">{action.label}</span>
              </button>
            ))
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="bg-slate-50 dark:bg-slate-900/60 px-4 py-2 border-t border-slate-200 dark:border-slate-800 text-[10px] text-slate-500 flex justify-between">
          <span>Navigate with mouse or keyboard</span>
          <span>Shortcut: <strong>Ctrl+K</strong> or <strong>⌘K</strong></span>
        </div>
      </div>
    </div>
  );
};
