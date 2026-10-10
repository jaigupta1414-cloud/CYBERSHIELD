import React from 'react';
import { 
  LayoutDashboard, 
  Lock, 
  Globe2, 
  FileCheck2, 
  AlertOctagon, 
  Radio,
  Activity,
  CheckCircle2,
  ShieldAlert
} from 'lucide-react';
import { SubsystemTab } from '../types';
import { sound } from '../services/audio';

interface SidebarProps {
  activeTab: SubsystemTab;
  setActiveTab: (tab: SubsystemTab) => void;
  clusterLatency: number;
  threatBlockedRate: number;
  onQuickSos: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  clusterLatency,
  threatBlockedRate,
  onQuickSos,
}) => {
  const subsystems: {
    id: SubsystemTab;
    label: string;
    icon: React.ReactNode;
    badge?: string;
  }[] = [
    {
      id: 'incident',
      label: 'Incident #87795',
      icon: <ShieldAlert className="w-4 h-4 text-rose-500" />,
      badge: 'Resolved',
    },
    {
      id: 'overview',
      label: 'Overview & Tasks',
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      id: 'vault',
      label: 'Secure Vault',
      icon: <Lock className="w-4 h-4" />,
    },
    {
      id: 'network',
      label: 'Network & Domains',
      icon: <Globe2 className="w-4 h-4" />,
    },
    {
      id: 'compliance',
      label: 'Legal & Compliance',
      icon: <FileCheck2 className="w-4 h-4" />,
      badge: 'ISO-27001',
    },
    {
      id: 'emergency',
      label: 'Emergency SOS',
      icon: <AlertOctagon className="w-4 h-4 text-rose-500" />,
    },
  ];

  return (
    <aside className="w-64 shrink-0 hidden md:flex flex-col justify-between border-r border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-[#0c1017]/70 backdrop-blur-sm p-4 h-[calc(100vh-57px)] sticky top-[57px] font-sans">
      <div>
        <div className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3 px-2 flex items-center justify-between">
          <span>Main Menu</span>
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
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all text-left ${
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

      {/* Bottom Telemetry / System Health Card */}
      <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800 text-xs">
        <div className="bg-slate-50 dark:bg-slate-900/80 rounded-xl border border-slate-200 dark:border-slate-800 p-3 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-[11px] font-semibold mb-2">
            <span className="flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-cyan-500" />
              <span>System Health</span>
            </span>
            <span className="flex items-center gap-1 text-emerald-500 text-[10px] font-bold">
              <CheckCircle2 className="w-3 h-3" />
              100% OK
            </span>
          </div>

          <div className="space-y-1.5 text-[11px]">
            <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
              <span className="text-slate-500">Latency</span>
              <span className="font-semibold text-cyan-600 dark:text-cyan-400">{clusterLatency} ms</span>
            </div>
            <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
              <span className="text-slate-500">Protection</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">{threatBlockedRate}% Blocked</span>
            </div>
          </div>
        </div>

        {/* Emergency SOS Button */}
        <button
          onClick={onQuickSos}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold transition shadow-xs hover:shadow-rose-900/30"
        >
          <Radio className="w-3.5 h-3.5 animate-pulse" />
          <span>Emergency SOS</span>
        </button>
      </div>
    </aside>
  );
};
