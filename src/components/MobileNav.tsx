import { 
  LayoutDashboard, 
  Lock, 
  Globe2, 
  FileCheck2, 
  Radio, 
  ShieldAlert
} from 'lucide-react';
import { SubsystemTab } from '../types';
import { sound } from '../services/audio';

interface MobileNavProps {
  activeTab: SubsystemTab;
  setActiveTab: (tab: SubsystemTab) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ activeTab, setActiveTab }) => {
  const tabs: { id: SubsystemTab; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'incident', label: 'Incidents', icon: <ShieldAlert className="w-4 h-4 text-rose-500" /> },
    { id: 'network', label: 'Network', icon: <Globe2 className="w-4 h-4 text-emerald-500" /> },
    { id: 'emergency', label: 'SOS', icon: <Radio className="w-4 h-4 text-rose-500 animate-pulse" /> },
    { id: 'compliance', label: 'Compliance', icon: <FileCheck2 className="w-4 h-4 text-indigo-500" /> },
    { id: 'vault', label: 'Vault', icon: <Lock className="w-4 h-4 text-amber-500" /> },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#0c1017]/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-1 py-1.5 flex items-center justify-around font-sans text-[10px] safe-area-pb">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              sound.playBeep(isActive ? 600 : 750, 0.04);
            }}
            className={`flex flex-col items-center justify-center p-1.5 rounded-lg transition-all min-w-[46px] cursor-pointer ${
              isActive
                ? 'text-cyan-600 dark:text-cyan-400 font-bold bg-cyan-50/80 dark:bg-cyan-950/40'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <span className="mb-0.5">{tab.icon}</span>
            <span className="truncate max-w-[54px] leading-tight">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
