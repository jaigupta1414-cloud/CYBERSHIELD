import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Globe, 
  Lock, 
  FileCheck2, 
  Radio, 
  Sun, 
  Moon,
  Wifi, 
  X, 
  ShieldAlert,
  LayoutDashboard,
  CornerDownLeft,
  ArrowUp,
  ArrowDown,
  Laptop,
  RotateCw,
  Bug
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
  onOpenLaptopProtection?: () => void;
}

interface CommandItem {
  id: string;
  category: 'Navigation' | 'Quick Actions';
  label: string;
  description: string;
  icon: React.ReactNode;
  run: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onSelectTab,
  onTriggerSos,
  toggleDarkMode,
  toggleOffline,
  onOpenLaptopProtection,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const actions: CommandItem[] = [
    {
      id: 'act-laptop-protection',
      category: 'Quick Actions',
      label: 'This Laptop: Protection Center',
      description: 'Check active shields, scan system files, and view threat defense proof',
      icon: <Laptop className="w-4 h-4 text-emerald-500" />,
      run: () => {
        onClose();
        if (onOpenLaptopProtection) onOpenLaptopProtection();
      },
    },
    {
      id: 'act-laptop-scan',
      category: 'Quick Actions',
      label: 'Run Laptop Security Scan',
      description: 'Analyze browser storage, cryptographic context, and scripts',
      icon: <RotateCw className="w-4 h-4 text-cyan-500" />,
      run: () => {
        onClose();
        if (onOpenLaptopProtection) onOpenLaptopProtection();
      },
    },
    {
      id: 'nav-overview',
      category: 'Navigation',
      label: 'Overview Dashboard',
      description: 'System health, KPIs, and security checklist',
      icon: <LayoutDashboard className="w-4 h-4 text-cyan-500" />,
      run: () => onSelectTab('overview'),
    },
    {
      id: 'nav-incident',
      category: 'Navigation',
      label: 'Security Incidents',
      description: 'View active threat detections and response tickets',
      icon: <ShieldAlert className="w-4 h-4 text-rose-500" />,
      run: () => onSelectTab('incident'),
    },
    {
      id: 'nav-network',
      category: 'Navigation',
      label: 'Network & Domains',
      description: 'Manage DNS records, SSL certificates, and proxy routing',
      icon: <Globe className="w-4 h-4 text-emerald-500" />,
      run: () => onSelectTab('network'),
    },
    {
      id: 'nav-emergency',
      category: 'Navigation',
      label: 'Emergency SOS',
      description: 'One-touch emergency dialling and GPS location sharing',
      icon: <Radio className="w-4 h-4 text-rose-500" />,
      run: () => onTriggerSos(),
    },
    {
      id: 'nav-compliance',
      category: 'Navigation',
      label: 'Legal & Compliance',
      description: 'ISO-27001 controls and security policy documents',
      icon: <FileCheck2 className="w-4 h-4 text-indigo-500" />,
      run: () => onSelectTab('compliance'),
    },
    {
      id: 'nav-vault',
      category: 'Navigation',
      label: 'Backup Vault',
      description: 'Export and restore configuration backups',
      icon: <Lock className="w-4 h-4 text-amber-500" />,
      run: () => onSelectTab('vault'),
    },
    {
      id: 'act-theme',
      category: 'Quick Actions',
      label: 'Switch Theme',
      description: 'Toggle between Dark and Light display modes',
      icon: <Sun className="w-4 h-4 text-amber-500" />,
      run: () => toggleDarkMode(),
    },
    {
      id: 'act-offline',
      category: 'Quick Actions',
      label: 'Simulate Offline Mode',
      description: 'Test local offline caching and sync behavior',
      icon: <Wifi className="w-4 h-4 text-emerald-500" />,
      run: () => toggleOffline(),
    },
    {
      id: 'act-sos',
      category: 'Quick Actions',
      label: 'Open Emergency Dialler',
      description: 'One-touch 911 calling and responder dispatch script',
      icon: <Radio className="w-4 h-4 text-rose-500" />,
      run: () => onTriggerSos(),
    },
  ];

  const filtered = actions.filter((a) => {
    const q = query.toLowerCase().trim();
    if (!q) return true;
    return (
      a.label.toLowerCase().includes(q) ||
      a.description.toLowerCase().includes(q) ||
      a.category.toLowerCase().includes(q)
    );
  });

  // Reset selected index when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % (filtered.length || 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filtered.length) % (filtered.length || 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filtered[selectedIndex]) {
          executeAction(filtered[selectedIndex]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filtered, selectedIndex]);

  if (!isOpen) return null;

  const executeAction = (action: CommandItem) => {
    sound.playBeep(750, 0.04);
    action.run();
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-start justify-center pt-16 sm:pt-24 p-4 font-sans animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-[#0e141f] border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/40">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a command or page name..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none text-sm font-medium"
          />
          <button 
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800 transition cursor-pointer"
            aria-label="Close command console"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Command List */}
        <div className="p-2 max-h-80 overflow-y-auto space-y-1">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-xs">
              No matching pages or actions found for "{query}".
            </div>
          ) : (
            filtered.map((action, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <button
                  key={action.id}
                  onClick={() => executeAction(action)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl transition text-left cursor-pointer ${
                    isSelected
                      ? 'bg-cyan-50 dark:bg-cyan-950/50 border border-cyan-200 dark:border-cyan-800/60'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-900/60 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800/80 shrink-0">
                      {action.icon}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
                        {action.label}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate">
                        {action.description}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 ml-2">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase hidden sm:inline">
                      {action.category}
                    </span>
                    {isSelected && (
                      <span className="p-1 rounded bg-cyan-600 text-white">
                        <CornerDownLeft className="w-3 h-3" />
                      </span>
                    )}
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Simplified Footer with helpful tips */}
        <div className="bg-slate-50 dark:bg-slate-900/70 px-4 py-2.5 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-0.5">
              <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-[10px] font-mono">↑</kbd>
              <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-[10px] font-mono">↓</kbd>
              <span className="ml-1">Navigate</span>
            </span>
            <span className="inline-flex items-center gap-1 ml-2">
              <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-[10px] font-mono">↵</kbd>
              <span>Select</span>
            </span>
          </div>

          <div className="inline-flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-[10px] font-mono">Esc</kbd>
            <span>Close</span>
          </div>
        </div>
      </div>
    </div>
  );
};
