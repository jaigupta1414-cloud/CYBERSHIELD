import React from 'react';
import { 
  LayoutDashboard, 
  Lock, 
  Globe2, 
  FileCheck2, 
  AlertOctagon, 
  Radio, 
  ShieldCheck,
  ShieldAlert,
  Laptop
} from 'lucide-react';
import { SubsystemTab } from '../types';
import { sound } from '../services/audio';

interface SidebarProps {
  activeTab: SubsystemTab;
  setActiveTab: (tab: SubsystemTab) => void;
  clusterLatency: number;
  threatBlockedRate: number;
  onQuickSos: () => void;
  onOpenLaptopProtection?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  onQuickSos,
  onOpenLaptopProtection,
}) => {
  const subsystems: {
    id: SubsystemTab;
    label: string;
    icon: React.ReactNode;
    badge?: string;
  }[] = [
    {
      id: 'overview',
      label: 'Overview',
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      id: 'incident',
      label: 'Security Incidents',
      icon: <ShieldAlert className="w-4 h-4 text-rose-500" />,
      badge: 'Active',
    },
    {
      id: 'network',
      label: 'Network & Domains',
      icon: <Globe2 className="w-4 h-4 text-emerald-500" />,
    },
    {
      id: 'emergency',
      label: 'Emergency SOS',
      icon: <AlertOctagon className="w-4 h-4 text-rose-500" />,
    },
    {
      id: 'compliance',
      label: 'Compliance',
      icon: <FileCheck2 className="w-4 h-4 text-indigo-500" />,
    },
    {
      id: 'vault',
      label: 'Backup Vault',
      icon: <Lock className="w-4 h-4 text-amber-500" />,
    },
  ];

  return (
    <aside className="w-64 shrink-0 hidden md:flex flex-col justify-between border-r border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-[#0c1017]/70 backdrop-blur-sm p-4 h-[calc(100vh-57px)] sticky top-[57px] font-sans">
      <div>
        <div className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3 px-2 flex items-center justify-between">
          <span>Navigation</span>
          <span className="text-[10px] text-emerald-500 font-medium flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Online
          </span>
        </div>

        <nav className="space-y-1 text-xs">
          {subsystems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  sound.playBeep(isActive ? 650 : 800, 0.04);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition text-left cursor-pointer ${
                  isActive
                    ? 'bg-slate-900 text-white dark:bg-cyan-950 dark:text-cyan-300 shadow-xs font-semibold'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <span className={isActive ? 'text-cyan-400' : 'text-slate-400'}>
                    {item.icon}
                  </span>
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                    isActive 
                      ? 'bg-cyan-900 text-cyan-200'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Health & Emergency Quick Button */}
      <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800 text-xs">
        {/* Laptop Protection Status Card */}
        <div 
          onClick={() => {
            if (onOpenLaptopProtection) onOpenLaptopProtection();
            sound.playBeep(700, 0.04);
          }}
          className="bg-slate-50 dark:bg-slate-900/80 rounded-xl border border-slate-200 dark:border-slate-800 p-3 shadow-xs hover:border-emerald-500/50 cursor-pointer transition group"
          title="Click to open Laptop Protection Hub"
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-[11px] font-semibold mb-1">
            <span className="flex items-center gap-1.5">
              <Laptop className="w-3.5 h-3.5 text-emerald-500 group-hover:scale-110 transition-transform" />
              <span>This Laptop</span>
            </span>
            <span className="text-emerald-500 text-[10px] font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Protected
            </span>
          </div>

          <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
            4 Shields Active · Click to run security scan &amp; view test proof
          </p>
        </div>

        {/* Emergency SOS Button */}
        <button
          onClick={onQuickSos}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition shadow-xs cursor-pointer"
        >
          <Radio className="w-3.5 h-3.5 animate-pulse" />
          <span>Emergency SOS</span>
        </button>
      </div>
    </aside>
  );
};
