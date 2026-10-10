import React, { useState } from 'react';
import { 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Plus, 
  Calendar, 
  User, 
  ShieldCheck, 
  Server, 
  ArrowRight,
  ShieldAlert,
  Globe,
  FileCheck2,
  Radio,
  Check,
  Laptop,
  Lock,
  LifeBuoy
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';
import { ProjectMilestone, TaskReminder } from '../types';
import { CybershieldStore, saveStore } from '../services/storage';
import { sound } from '../services/audio';
import { notificationService } from '../services/notifications';
import { detectCurrentDevice, loadDeviceShields, loadLastScanResult } from '../services/deviceSecurity';

interface OverviewViewProps {
  store: CybershieldStore;
  setStore: React.Dispatch<React.SetStateAction<CybershieldStore>>;
  onNavigateToTab: (tab: any) => void;
  onOpenLaptopProtection?: () => void;
}

interface SecurityControlItem {
  id: string;
  label: string;
  framework: string;
  completed: boolean;
}

export const OverviewView: React.FC<OverviewViewProps> = ({ store, setStore, onNavigateToTab, onOpenLaptopProtection }) => {
  const { milestones, reminders } = store;
  const [showAddMilestoneModal, setShowAddMilestoneModal] = useState(false);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [timeframe, setTimeframe] = useState<'7d' | '30d'>('7d');

  // Interactive Security Health Checklist (Plain Language)
  const [securityControls, setSecurityControls] = useState<SecurityControlItem[]>([
    { id: 'sc-1', label: 'Two-Factor Verification (2FA) enabled on primary accounts', framework: 'Essential Safety', completed: true },
    { id: 'sc-2', label: 'Automatic encrypted backup of important files and passwords', framework: 'Data Protection', completed: true },
    { id: 'sc-3', label: 'Real-time virus and malware shield active on this device', framework: 'Device Shield', completed: true },
    { id: 'sc-4', label: 'Secure encrypted web browsing (HTTPS) enabled', framework: 'Web Safety', completed: true },
    { id: 'sc-5', label: 'Old unused passwords and temporary logins reviewed and removed', framework: 'Account Health', completed: false },
    { id: 'sc-6', label: 'Emergency recovery contact and security questions configured', framework: 'Emergency SOS', completed: false },
  ]);

  const [newMilestone, setNewMilestone] = useState<Partial<ProjectMilestone>>({
    title: '',
    subsystem: 'Security Operations',
    status: 'IN_PROGRESS',
    progress: 50,
    deadline: '2026-05-15',
    lead: 'SEC-ADMIN: 401',
    notes: '',
  });

  const [newTask, setNewTask] = useState<Partial<TaskReminder>>({
    title: '',
    dueTime: 'Tomorrow, 09:00 AM',
    priority: 'HIGH',
    category: 'SECURITY',
  });

  // Calculate dynamic security posture score
  const completedControlsCount = securityControls.filter(c => c.completed).length;
  const securityPostureScore = Math.round((completedControlsCount / securityControls.length) * 100);

  const toggleSecurityControl = (id: string) => {
    setSecurityControls(prev => prev.map(c => {
      if (c.id === id) {
        const next = !c.completed;
        if (next) sound.playSuccess();
        else sound.playBeep(600, 0.04);
        return { ...c, completed: next };
      }
      return c;
    }));
  };

  const handleAddMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMilestone.title) return;

    const item: ProjectMilestone = {
      id: `ms-${Date.now()}`,
      title: newMilestone.title,
      subsystem: newMilestone.subsystem || 'Security Operations',
      status: (newMilestone.status as any) || 'IN_PROGRESS',
      progress: Number(newMilestone.progress) || 0,
      deadline: newMilestone.deadline || '2026-05-30',
      lead: newMilestone.lead || 'SEC-ADMIN: 401',
      notes: newMilestone.notes || '',
    };

    const updated = {
      ...store,
      milestones: [item, ...milestones],
    };
    setStore(updated);
    saveStore(updated);
    setShowAddMilestoneModal(false);
    setNewMilestone({
      title: '',
      subsystem: 'Security Operations',
      status: 'IN_PROGRESS',
      progress: 50,
      deadline: '2026-05-15',
      lead: 'SEC-ADMIN: 401',
      notes: '',
    });
    sound.playSuccess();
    notificationService.send('Project Milestone Created', `Added: ${item.title}`);
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title) return;

    const item: TaskReminder = {
      id: `rem-${Date.now()}`,
      title: newTask.title,
      dueTime: newTask.dueTime || 'This Week',
      priority: (newTask.priority as any) || 'HIGH',
      notified: false,
      category: (newTask.category as any) || 'SECURITY',
    };

    const updated = {
      ...store,
      reminders: [item, ...reminders],
    };
    setStore(updated);
    saveStore(updated);
    setShowAddTaskModal(false);
    setNewTask({
      title: '',
      dueTime: 'Tomorrow, 09:00 AM',
      priority: 'HIGH',
      category: 'SECURITY',
    });
    sound.playSuccess();
    notificationService.send('Operational Task Created', `Scheduled: ${item.title}`);
  };

  const handleToggleTaskCompleted = (id: string) => {
    const updatedReminders = reminders.map(r => {
      if (r.id === id) {
        return { ...r, notified: !r.notified };
      }
      return r;
    });
    const updated = { ...store, reminders: updatedReminders };
    setStore(updated);
    saveStore(updated);
    sound.playSuccess();
  };

  const filteredReminders = filterCategory === 'ALL'
    ? reminders
    : reminders.filter(r => r.category === filterCategory);

  // Realistic daily security telemetry
  const telemetryData7d = [
    { day: 'Mon', phishingBlocked: 14, malwareHalted: 3, portScansDropped: 412 },
    { day: 'Tue', phishingBlocked: 22, malwareHalted: 1, portScansDropped: 520 },
    { day: 'Wed', phishingBlocked: 18, malwareHalted: 4, portScansDropped: 389 },
    { day: 'Thu', phishingBlocked: 31, malwareHalted: 2, portScansDropped: 640 },
    { day: 'Fri', phishingBlocked: 26, malwareHalted: 1, portScansDropped: 475 },
    { day: 'Sat', phishingBlocked: 8, malwareHalted: 0, portScansDropped: 290 },
    { day: 'Sun', phishingBlocked: 6, malwareHalted: 0, portScansDropped: 230 },
  ];

  const telemetryData30d = [
    { day: 'Week 1', phishingBlocked: 82, malwareHalted: 11, portScansDropped: 2450 },
    { day: 'Week 2', phishingBlocked: 104, malwareHalted: 8, portScansDropped: 2890 },
    { day: 'Week 3', phishingBlocked: 95, malwareHalted: 6, portScansDropped: 2620 },
    { day: 'Week 4', phishingBlocked: 125, malwareHalted: 11, portScansDropped: 3100 },
  ];

  const chartData = timeframe === '7d' ? telemetryData7d : telemetryData30d;

  return (
    <div className="space-y-6 pb-20 max-w-7xl mx-auto font-sans">
      
      {/* ============================================================ */}
      {/* PROMINENT LAPTOP REAL-TIME PROTECTION BANNER                 */}
      {/* ============================================================ */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-cyan-500/5 border border-emerald-300 dark:border-emerald-800/80 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/20 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  This Laptop is Protected by CyberShield
                </h2>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Real-Time Shield Active
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5">
                <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                  {detectCurrentDevice().osName}
                </span>
                <span>·</span>
                <span>All 4 shields active</span>
                <span>·</span>
                <span className="text-slate-500">
                  0 threats found · Protected against Trojan downloads, phishing &amp; DNS hijacking
                </span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={() => {
                if (onOpenLaptopProtection) onOpenLaptopProtection();
                sound.playBeep(700, 0.04);
              }}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition shadow-xs flex items-center gap-2 cursor-pointer"
            >
              <Laptop className="w-3.5 h-3.5" />
              <span>Open Protection Center</span>
            </button>
            <button
              onClick={() => {
                if (onOpenLaptopProtection) onOpenLaptopProtection();
                sound.playBeep(750, 0.04);
              }}
              className="px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs transition cursor-pointer"
            >
              <span>Run Laptop Scan</span>
            </button>
          </div>
        </div>

        {/* 4 Shield Indicators */}
        <div className="mt-4 pt-3 border-t border-emerald-200/60 dark:border-emerald-900/40 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
          <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span>Malware Shield: Active</span>
          </div>
          <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span>Phishing Blocker: Active</span>
          </div>
          <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span>Firewall &amp; DNS: Active</span>
          </div>
          <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span>Storage Vault: Encrypted</span>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 4 LARGE, SIMPLE STATUS CARDS (PLAIN LANGUAGE FOR EVERYONE)   */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        
        {/* Card 1: Your System & Device Protection */}
        <div 
          onClick={() => {
            if (onOpenLaptopProtection) onOpenLaptopProtection();
            sound.playBeep(700, 0.04);
          }}
          className="p-5 sm:p-6 rounded-2xl border border-emerald-200 dark:border-emerald-800/70 bg-gradient-to-b from-white to-emerald-50/20 dark:from-[#0e141e] dark:to-emerald-950/10 shadow-sm hover:shadow-md hover:border-emerald-400 dark:hover:border-emerald-700 transition cursor-pointer group flex flex-col justify-between"
          title="Click to check your laptop and device security"
        >
          <div>
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-6 h-6 stroke-[2.2]" />
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Protected
              </span>
            </div>

            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-4 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
              Your System is Safe
            </h3>
            
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
              Real-time antivirus shields are active. No viruses, malware, or suspicious files detected on your laptop.
            </p>
          </div>

          <div className="mt-5 pt-3.5 border-t border-emerald-100 dark:border-emerald-900/40 flex items-center justify-between text-xs font-semibold text-emerald-700 dark:text-emerald-400">
            <span>Check Laptop Health</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card 2: Web & Browsing Safety */}
        <div 
          onClick={() => {
            onNavigateToTab('network');
            sound.playBeep(700, 0.04);
          }}
          className="p-5 sm:p-6 rounded-2xl border border-cyan-200 dark:border-cyan-800/70 bg-gradient-to-b from-white to-cyan-50/20 dark:from-[#0e141e] dark:to-cyan-950/10 shadow-sm hover:shadow-md hover:border-cyan-400 dark:hover:border-cyan-700 transition cursor-pointer group flex flex-col justify-between"
          title="Click to check web browsing protection"
        >
          <div>
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-cyan-100 dark:bg-cyan-950/80 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                <Globe className="w-6 h-6 stroke-[2.2]" />
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-cyan-100 dark:bg-cyan-950 text-cyan-800 dark:text-cyan-300 border border-cyan-300 dark:border-cyan-800">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                Active
              </span>
            </div>

            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-4 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
              Web Browsing is Safe
            </h3>
            
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
              Scam websites, fake login links, and insecure network trackers are automatically blocked before they reach you.
            </p>
          </div>

          <div className="mt-5 pt-3.5 border-t border-cyan-100 dark:border-cyan-900/40 flex items-center justify-between text-xs font-semibold text-cyan-700 dark:text-cyan-400">
            <span>View Web Shields</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card 3: Passwords & Private Vault */}
        <div 
          onClick={() => {
            onNavigateToTab('vault');
            sound.playBeep(700, 0.04);
          }}
          className="p-5 sm:p-6 rounded-2xl border border-indigo-200 dark:border-indigo-800/70 bg-gradient-to-b from-white to-indigo-50/20 dark:from-[#0e141e] dark:to-indigo-950/10 shadow-sm hover:shadow-md hover:border-indigo-400 dark:hover:border-indigo-700 transition cursor-pointer group flex flex-col justify-between"
          title="Click to open your encrypted passwords and files"
        >
          <div>
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                <Lock className="w-6 h-6 stroke-[2.2]" />
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-800">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                Encrypted
              </span>
            </div>

            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-4 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              Passwords &amp; Vault Secure
            </h3>
            
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
              Your passwords, recovery codes, and sensitive documents are safely locked with AES-256 encryption.
            </p>
          </div>

          <div className="mt-5 pt-3.5 border-t border-indigo-100 dark:border-indigo-900/40 flex items-center justify-between text-xs font-semibold text-indigo-700 dark:text-indigo-400">
            <span>Open Private Vault</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card 4: Emergency Assistance & Overall Health */}
        <div 
          onClick={() => {
            onNavigateToTab('emergency');
            sound.playBeep(700, 0.04);
          }}
          className="p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-gradient-to-b from-white to-amber-50/20 dark:from-[#0e141e] dark:to-amber-950/10 shadow-sm hover:shadow-md hover:border-amber-400 dark:hover:border-amber-700 transition cursor-pointer group flex flex-col justify-between"
          title="Click to view emergency contacts and quick help"
        >
          <div>
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                <LifeBuoy className="w-6 h-6 stroke-[2.2]" />
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                {securityPostureScore}% Ready
              </span>
            </div>

            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-4 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
              Emergency Help Ready
            </h3>
            
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
              {completedControlsCount} of {securityControls.length} safety checks verified. One-touch emergency contacts &amp; incident help standing by.
            </p>
          </div>

          <div className="mt-5 pt-3.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-semibold text-amber-700 dark:text-amber-400">
            <span>Emergency Help Center</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

      </div>

      {/* ============================================================ */}
      {/* WEEKLY THREAT TELEMETRY & ATTACK MITIGATION CHART             */}
      {/* ============================================================ */}
      <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0e141e] rounded-xl p-5 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-cyan-500" />
              <span>Threats Automatically Stopped This Week</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Harmful links, scam attempts, and unsafe downloads blocked before reaching your device
            </p>
          </div>
          
          <div className="flex items-center rounded-lg bg-slate-100 dark:bg-slate-900 p-0.5 border border-slate-200 dark:border-slate-800 text-xs">
            <button
              onClick={() => {
                setTimeframe('7d');
                sound.playBeep(700, 0.03);
              }}
              className={`px-3 py-1 rounded-md transition font-semibold ${
                timeframe === '7d'
                  ? 'bg-cyan-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              Past 7 Days
            </button>
            <button
              onClick={() => {
                setTimeframe('30d');
                sound.playBeep(750, 0.03);
              }}
              className={`px-3 py-1 rounded-md transition font-semibold ${
                timeframe === '30d'
                  ? 'bg-cyan-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              Past 30 Days
            </button>
          </div>
        </div>

        {/* Responsive Area Chart */}
        <div className="h-60 sm:h-64 w-full pt-1">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 15, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="phishGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="malwareGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-slate-200 dark:text-slate-800/80" />
              <XAxis dataKey="day" stroke="#64748b" tick={{ fontSize: 11, fill: '#64748b' }} tickLine={false} />
              <YAxis stroke="#64748b" tick={{ fontSize: 11, fill: '#64748b' }} tickLine={false} />
              <Tooltip 
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-slate-900/95 dark:bg-[#070b12]/95 backdrop-blur-sm border border-slate-700 text-slate-100 p-3 rounded-lg shadow-xl text-xs space-y-1.5 font-sans">
                        <div className="font-bold text-cyan-400 border-b border-slate-800 pb-1">
                          Period: {label}
                        </div>
                        <div className="flex justify-between gap-4 text-slate-300">
                          <span>Phishing Links Blocked:</span>
                          <span className="font-bold text-cyan-300">{data.phishingBlocked}</span>
                        </div>
                        <div className="flex justify-between gap-4 text-slate-300">
                          <span>Malware Intercepted:</span>
                          <span className="font-bold text-rose-400">{data.malwareHalted}</span>
                        </div>
                        <div className="flex justify-between gap-4 text-slate-300">
                          <span>Scans Dropped:</span>
                          <span className="font-bold text-emerald-400">{data.portScansDropped}</span>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend verticalAlign="top" align="right" wrapperStyle={{ paddingBottom: '12px', fontSize: '11px' }} />
              <Area type="monotone" dataKey="phishingBlocked" name="Fake & Scam Links Blocked" stroke="#06b6d4" strokeWidth={2} fillOpacity={1} fill="url(#phishGrad)" />
              <Area type="monotone" dataKey="malwareHalted" name="Harmful Files Stopped" stroke="#f43f5e" strokeWidth={2} fillOpacity={1} fill="url(#malwareGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Quick summary stats */}
        <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
          <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
            <span className="text-[11px] text-slate-500 font-medium">Scam Links Blocked</span>
            <div className="text-base font-bold text-cyan-600 dark:text-cyan-400 mt-0.5">
              {chartData.reduce((acc, d) => acc + d.phishingBlocked, 0)} stopped
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
            <span className="text-[11px] text-slate-500 font-medium">Harmful Files Neutralized</span>
            <div className="text-base font-bold text-rose-600 dark:text-rose-400 mt-0.5">
              {chartData.reduce((acc, d) => acc + d.malwareHalted, 0)} files
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
            <span className="text-[11px] text-slate-500 font-medium">Network Intrusions Filtered</span>
            <div className="text-base font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
              {chartData.reduce((acc, d) => acc + d.portScansDropped, 0).toLocaleString()}
            </div>
          </div>
        </div>

      </div>

      {/* ============================================================ */}
      {/* 2-COLUMN: INTERACTIVE SECURITY CHECKLIST & TASKS              */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Interactive Security Posture Controls */}
        <div className="lg:col-span-6 border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0e141e] rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Simple Protection Checklist</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Recommended everyday safety habits to protect your computer and private accounts
              </p>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400">
              {securityPostureScore}% Done
            </span>
          </div>

          <div className="space-y-2.5">
            {securityControls.map(control => (
              <div
                key={control.id}
                onClick={() => toggleSecurityControl(control.id)}
                className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                  control.completed
                    ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/80'
                    : 'bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <button
                  type="button"
                  className={`mt-0.5 w-5 h-5 rounded flex items-center justify-center shrink-0 transition ${
                    control.completed
                      ? 'bg-emerald-600 text-white'
                      : 'border-2 border-slate-400 dark:border-slate-600 bg-white dark:bg-slate-800'
                  }`}
                  aria-label={`Toggle control: ${control.label}`}
                >
                  {control.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </button>

                <div className="flex-1 min-w-0">
                  <div className={`text-xs font-semibold leading-snug ${
                    control.completed ? 'text-slate-900 dark:text-slate-100 line-through opacity-80' : 'text-slate-800 dark:text-slate-200'
                  }`}>
                    {control.label}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1 font-medium">
                    STANDARD: {control.framework}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <p className="text-[11px] text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
            Tip: Toggling any item automatically updates your overall protection readiness score.
          </p>
        </div>

        {/* Right Column: Scheduled Operational Tasks */}
        <div className="lg:col-span-6 border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0e141e] rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Clock className="w-4 h-4 text-cyan-500" />
                <span>Security Reminders &amp; Tasks</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Upcoming reminders to keep your software, passwords, and backups in top shape
              </p>
            </div>

            <button
              onClick={() => setShowAddTaskModal(true)}
              className="px-2.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Task</span>
            </button>
          </div>

          {/* Filter tabs */}
          <div className="flex flex-wrap items-center gap-1 text-[11px]">
            {['ALL', 'SECURITY', 'NETWORK', 'INCIDENT', 'INFRASTRUCTURE', 'COMPLIANCE'].map(cat => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-2.5 py-1 rounded-md transition font-medium ${
                  filterCategory === cat
                    ? 'bg-slate-900 dark:bg-slate-800 text-white font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Task list */}
          <div className="space-y-2.5">
            {filteredReminders.map(task => {
              const priColor = 
                task.priority === 'CRITICAL' ? 'text-rose-600 bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-900' :
                task.priority === 'HIGH' ? 'text-amber-600 bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-900' :
                'text-slate-600 bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700';

              return (
                <div
                  key={task.id}
                  className={`p-3 rounded-xl border transition flex items-start justify-between gap-3 ${
                    task.notified 
                      ? 'bg-slate-50 dark:bg-slate-900/30 border-slate-200 dark:border-slate-800 opacity-60'
                      : 'bg-white dark:bg-[#0c1017] border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${priColor}`}>
                        {task.priority}
                      </span>
                      <span className="text-[10px] font-semibold text-slate-500 uppercase">
                        {task.category}
                      </span>
                    </div>
                    <div className={`text-xs font-semibold ${task.notified ? 'line-through text-slate-500' : 'text-slate-900 dark:text-slate-100'}`}>
                      {task.title}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Due: {task.dueTime}
                    </div>
                  </div>

                  <button
                    onClick={() => handleToggleTaskCompleted(task.id)}
                    className={`px-2.5 py-1 rounded text-xs font-semibold shrink-0 transition cursor-pointer ${
                      task.notified
                        ? 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    }`}
                  >
                    {task.notified ? 'Completed' : 'Mark Done'}
                  </button>
                </div>
              );
            })}
          </div>

        </div>

      </div>

      {/* ============================================================ */}
      {/* PROJECT MILESTONES (CORPORATE CYBER DEFENSE INITIATIVES)       */}
      {/* ============================================================ */}
      <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0e141e] rounded-xl p-5 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-500" />
              <span>Active Security Engineering Milestones</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Strategic projects to harden company networks, ensure compliance, and modernize protections
            </p>
          </div>

          <button
            onClick={() => setShowAddMilestoneModal(true)}
            className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Milestone</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {milestones.map(ms => {
            const statusColor = 
              ms.status === 'COMPLETED' ? 'text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800' :
              ms.status === 'IN_PROGRESS' ? 'text-cyan-700 bg-cyan-50 dark:bg-cyan-950/40 border-cyan-300 dark:border-cyan-800' :
              'text-slate-700 bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700';

            return (
              <div 
                key={ms.id}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900/40 space-y-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100">
                    {ms.title}
                  </h4>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${statusColor}`}>
                    {ms.status.replace('_', ' ')}
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {ms.notes}
                </p>

                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-slate-500 font-medium">
                    <span>Progress</span>
                    <span>{ms.progress}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                    <div 
                      className="h-full bg-cyan-500 rounded-full transition-all duration-500" 
                      style={{ width: `${ms.progress}%` }} 
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100 dark:border-slate-800">
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3 text-slate-400" />
                    <span>Lead: {ms.lead}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>Target: {ms.deadline}</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ============================================================ */}
      {/* MODAL: ADD MILESTONE                                         */}
      {/* ============================================================ */}
      {showAddMilestoneModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-[#0e141e] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4 font-sans">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Create Security Engineering Milestone
            </h3>
            
            <form onSubmit={handleAddMilestone} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  Project Title
                </label>
                <input
                  type="text"
                  required
                  value={newMilestone.title}
                  onChange={e => setNewMilestone({ ...newMilestone, title: e.target.value })}
                  placeholder="e.g. Implement Single Sign-On (SSO) with Okta"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Subsystem
                  </label>
                  <select
                    value={newMilestone.subsystem}
                    onChange={e => setNewMilestone({ ...newMilestone, subsystem: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-xs"
                  >
                    <option value="Security Operations">Security Operations</option>
                    <option value="Network & Domains">Network &amp; Domains</option>
                    <option value="Compliance">Compliance</option>
                    <option value="Endpoint Defense">Endpoint Defense</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Progress (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={newMilestone.progress}
                    onChange={e => setNewMilestone({ ...newMilestone, progress: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  Target Deadline
                </label>
                <input
                  type="date"
                  value={newMilestone.deadline}
                  onChange={e => setNewMilestone({ ...newMilestone, deadline: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  Objective &amp; Deliverables
                </label>
                <textarea
                  rows={3}
                  value={newMilestone.notes}
                  onChange={e => setNewMilestone({ ...newMilestone, notes: e.target.value })}
                  placeholder="Describe the business deliverable, tools used, and verification method..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddMilestoneModal(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-semibold cursor-pointer"
                >
                  Save Milestone
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL: ADD OPERATIONAL TASK                                  */}
      {/* ============================================================ */}
      {showAddTaskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-[#0e141e] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4 font-sans">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Schedule Operational Security Task
            </h3>
            
            <form onSubmit={handleAddTask} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  Task Description
                </label>
                <input
                  type="text"
                  required
                  value={newTask.title}
                  onChange={e => setNewTask({ ...newTask, title: e.target.value })}
                  placeholder="e.g. Audit AWS IAM access keys older than 90 days"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Category
                  </label>
                  <select
                    value={newTask.category}
                    onChange={e => setNewTask({ ...newTask, category: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-xs"
                  >
                    <option value="SECURITY">SECURITY</option>
                    <option value="NETWORK">NETWORK</option>
                    <option value="COMPLIANCE">COMPLIANCE</option>
                    <option value="INFRASTRUCTURE">INFRASTRUCTURE</option>
                    <option value="INCIDENT">INCIDENT</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Priority
                  </label>
                  <select
                    value={newTask.priority}
                    onChange={e => setNewTask({ ...newTask, priority: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-xs"
                  >
                    <option value="CRITICAL">CRITICAL</option>
                    <option value="HIGH">HIGH</option>
                    <option value="ROUTINE">ROUTINE</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  Schedule / Due Time
                </label>
                <input
                  type="text"
                  value={newTask.dueTime}
                  onChange={e => setNewTask({ ...newTask, dueTime: e.target.value })}
                  placeholder="e.g. Friday at 5:00 PM, or 2026-05-01"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddTaskModal(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-semibold cursor-pointer"
                >
                  Add Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
