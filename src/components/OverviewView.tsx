import React, { useState } from 'react';
import { 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Plus, 
  Calendar, 
  User, 
  Bell, 
  Activity, 
  ShieldCheck, 
  Server, 
  Zap,
  ArrowUpRight
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';
import { ProjectMilestone, TaskReminder } from '../types';
import { CybershieldStore, saveStore } from '../services/storage';
import { sound } from '../services/audio';

interface OverviewViewProps {
  store: CybershieldStore;
  setStore: React.Dispatch<React.SetStateAction<CybershieldStore>>;
  onNavigateToTab: (tab: any) => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({ store, setStore, onNavigateToTab }) => {
  const { milestones, reminders } = store;
  const [showAddMilestoneModal, setShowAddMilestoneModal] = useState(false);
  const [filterSubsystem, setFilterSubsystem] = useState<string>('ALL');

  const [newMilestone, setNewMilestone] = useState<Partial<ProjectMilestone>>({
    title: '',
    subsystem: 'Network & Domains',
    status: 'IN_PROGRESS',
    progress: 50,
    deadline: '2026-04-30',
    lead: 'SEC-OP: 882',
    notes: '',
  });

  // Calculate status counts
  const completedCount = milestones.filter((m) => m.status === 'COMPLETED').length;
  const inProgressCount = milestones.filter((m) => m.status === 'IN_PROGRESS').length;
  const avgProgress = Math.round(
    milestones.reduce((acc, m) => acc + m.progress, 0) / (milestones.length || 1)
  );

  const handleAddMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMilestone.title) return;

    const item: ProjectMilestone = {
      id: `ms-${Date.now()}`,
      title: newMilestone.title,
      subsystem: newMilestone.subsystem || 'Network & Domains',
      status: (newMilestone.status as any) || 'IN_PROGRESS',
      progress: Number(newMilestone.progress) || 0,
      deadline: newMilestone.deadline || '2026-05-01',
      lead: newMilestone.lead || 'SEC-OP: 882',
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
      subsystem: 'Network & Domains',
      status: 'IN_PROGRESS',
      progress: 50,
      deadline: '2026-04-30',
      lead: 'SEC-OP: 882',
      notes: '',
    });
    sound.playSuccess();
  };

  const filteredMilestones = filterSubsystem === 'ALL'
    ? milestones
    : milestones.filter((m) => m.subsystem.toLowerCase().includes(filterSubsystem.toLowerCase()));

  // Dynamic 7-day Threat Mitigation & Repulsion data for Recharts visualization
  const [timeframe, setTimeframe] = useState<'7d' | '30d'>('7d');

  const threatMitigationData7d = [
    { day: 'Mon', threatBlocked: 42, mitigationRate: 98.4, exploitsNeutralized: 1840, quarantinedPayloads: 142 },
    { day: 'Tue', threatBlocked: 68, mitigationRate: 99.1, exploitsNeutralized: 2410, quarantinedPayloads: 210 },
    { day: 'Wed', threatBlocked: 55, mitigationRate: 98.8, exploitsNeutralized: 2050, quarantinedPayloads: 165 },
    { day: 'Thu', threatBlocked: 89, mitigationRate: 99.6, exploitsNeutralized: 3120, quarantinedPayloads: 295 },
    { day: 'Fri', threatBlocked: 74, mitigationRate: 99.2, exploitsNeutralized: 2780, quarantinedPayloads: 240 },
    { day: 'Sat', threatBlocked: 95, mitigationRate: 99.8, exploitsNeutralized: 3450, quarantinedPayloads: 310 },
    { day: 'Sun', threatBlocked: 99, mitigationRate: 99.9, exploitsNeutralized: 3820, quarantinedPayloads: 345 },
  ];

  const threatMitigationData30d = [
    { day: 'Wk 1', threatBlocked: 62, mitigationRate: 98.6, exploitsNeutralized: 12400, quarantinedPayloads: 1120 },
    { day: 'Wk 2', threatBlocked: 78, mitigationRate: 99.2, exploitsNeutralized: 15800, quarantinedPayloads: 1490 },
    { day: 'Wk 3', threatBlocked: 86, mitigationRate: 99.5, exploitsNeutralized: 17200, quarantinedPayloads: 1630 },
    { day: 'Wk 4', threatBlocked: 97, mitigationRate: 99.9, exploitsNeutralized: 19400, quarantinedPayloads: 1880 },
  ];

  const chartData = timeframe === '7d' ? threatMitigationData7d : threatMitigationData30d;

  return (
    <div className="space-y-6 pb-20">
      
      {/* Top Stat Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 font-mono-code">
        <div className="p-3.5 sm:p-4 rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0e141e] shadow-2xs">
          <div className="text-[10px] text-slate-500 uppercase flex items-center justify-between">
            <span>CLUSTER NODES</span>
            <Server className="w-3.5 h-3.5 text-cyan-500" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">9 / 9 ONLINE</div>
          <div className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-1">100% operational uptime</div>
        </div>

        <div className="p-3.5 sm:p-4 rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0e141e] shadow-2xs">
          <div className="text-[10px] text-slate-500 uppercase flex items-center justify-between">
            <span>THREAT BLOCK RATE</span>
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">99.98%</div>
          <div className="text-[10px] text-cyan-600 dark:text-cyan-400 mt-1">14,280 exploits repelled</div>
        </div>

        <div className="p-3.5 sm:p-4 rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0e141e] shadow-2xs">
          <div className="text-[10px] text-slate-500 uppercase flex items-center justify-between">
            <span>MILESTONE PROGRESS</span>
            <TrendingUp className="w-3.5 h-3.5 text-amber-500" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">{avgProgress}%</div>
          <div className="text-[10px] text-slate-500 mt-1">{completedCount} of {milestones.length} resolved</div>
        </div>

        <div className="p-3.5 sm:p-4 rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0e141e] shadow-2xs">
          <div className="text-[10px] text-slate-500 uppercase flex items-center justify-between">
            <span>CLOUD SYNC CYCLE</span>
            <Activity className="w-3.5 h-3.5 text-cyan-500" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">15s HEARTBEAT</div>
          <div className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-1">Zero pending conflicts</div>
        </div>
      </div>

      {/* Recharts: Dynamic Threat Mitigation Over Time Visualization */}
      <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0e141e] rounded-md p-4 sm:p-5 shadow-2xs font-mono-code">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-cyan-500" />
            <div>
              <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                Threat Mitigation Over Time
              </h3>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                Dynamic telemetry of repelled exploits, heuristic blocks, and containment rate
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Timeframe switch */}
            <div className="flex items-center rounded bg-slate-100 dark:bg-slate-900 p-0.5 border border-slate-200 dark:border-slate-800 text-[11px]">
              <button
                onClick={() => {
                  setTimeframe('7d');
                  sound.playBeep(700, 0.03);
                }}
                className={`px-2 py-0.5 rounded transition ${
                  timeframe === '7d'
                    ? 'bg-cyan-600 text-white font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                7 Days
              </button>
              <button
                onClick={() => {
                  setTimeframe('30d');
                  sound.playBeep(750, 0.03);
                }}
                className={`px-2 py-0.5 rounded transition ${
                  timeframe === '30d'
                    ? 'bg-cyan-600 text-white font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                30 Days
              </button>
            </div>
          </div>
        </div>

        {/* Recharts Responsive Visualization */}
        <div className="h-64 sm:h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 15, left: -15, bottom: 0 }}>
              <defs>
                <linearGradient id="threatFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="mitigationFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-slate-200 dark:text-slate-800/80" />
              <XAxis 
                dataKey="day" 
                stroke="#64748b" 
                tick={{ fontSize: 11, fill: '#64748b' }} 
                tickLine={false}
              />
              <YAxis 
                stroke="#64748b" 
                tick={{ fontSize: 11, fill: '#64748b' }} 
                domain={[30, 105]}
                tickLine={false}
              />
              <Tooltip 
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-slate-900/95 dark:bg-[#070b12]/95 backdrop-blur-sm border border-slate-700 text-slate-100 p-3 rounded shadow-xl text-xs font-mono-code space-y-1.5">
                        <div className="font-bold text-cyan-400 border-b border-slate-800 pb-1 flex items-center justify-between gap-4">
                          <span>TIMEFRAME: {label}</span>
                          <span className="text-[10px] text-emerald-400">ACTIVE SOC</span>
                        </div>
                        <div className="flex items-center justify-between gap-4 text-[11px]">
                          <span className="text-slate-400">Threat Mitigation:</span>
                          <span className="font-bold text-cyan-300">{data.threatBlocked}%</span>
                        </div>
                        <div className="flex items-center justify-between gap-4 text-[11px]">
                          <span className="text-slate-400">Defense Repulsion Rate:</span>
                          <span className="font-bold text-emerald-400">{data.mitigationRate}%</span>
                        </div>
                        <div className="flex items-center justify-between gap-4 text-[10px] text-slate-400 pt-1 border-t border-slate-800/80">
                          <span>Exploits Neutralized:</span>
                          <span className="font-mono text-slate-200">{data.exploitsNeutralized.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center justify-between gap-4 text-[10px] text-slate-400">
                          <span>Quarantined Payloads:</span>
                          <span className="font-mono text-slate-200">{data.quarantinedPayloads.toLocaleString()}</span>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend 
                verticalAlign="top" 
                align="right"
                wrapperStyle={{ paddingBottom: '12px', fontSize: '11px' }}
              />
              <Area 
                type="monotone" 
                dataKey="threatBlocked" 
                name="Threats Mitigated (%)" 
                stroke="#06b6d4" 
                strokeWidth={2.5} 
                fillOpacity={1} 
                fill="url(#threatFill)" 
                activeDot={{ r: 6, fill: '#22d3ee', stroke: '#0e141e', strokeWidth: 2 }}
              />
              <Line 
                type="monotone" 
                dataKey="mitigationRate" 
                name="Heuristic Shielding Rate (%)" 
                stroke="#10b981" 
                strokeWidth={2} 
                strokeDasharray="4 3"
                dot={{ r: 3, fill: '#10b981' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Bottom Metric Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px]">
          <div className="p-2 rounded bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60">
            <div className="text-[10px] text-slate-500 uppercase">Current Block Index</div>
            <div className="font-bold text-cyan-600 dark:text-cyan-400 text-sm mt-0.5">
              {chartData[chartData.length - 1].threatBlocked}%
            </div>
          </div>
          <div className="p-2 rounded bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60">
            <div className="text-[10px] text-slate-500 uppercase">Peak Defense Rate</div>
            <div className="font-bold text-emerald-600 dark:text-emerald-400 text-sm mt-0.5">
              {Math.max(...chartData.map(d => d.mitigationRate))}%
            </div>
          </div>
          <div className="p-2 rounded bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60">
            <div className="text-[10px] text-slate-500 uppercase">Neutralized Exploits</div>
            <div className="font-bold text-slate-900 dark:text-slate-100 text-sm mt-0.5">
              {chartData.reduce((acc, d) => acc + d.exploitsNeutralized, 0).toLocaleString()}
            </div>
          </div>
          <div className="p-2 rounded bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60">
            <div className="text-[10px] text-slate-500 uppercase">Payloads Quarantined</div>
            <div className="font-bold text-amber-600 dark:text-amber-400 text-sm mt-0.5">
              {chartData.reduce((acc, d) => acc + d.quarantinedPayloads, 0).toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* 2-Column: Milestones Tracker & Task Reminders */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 font-mono-code">
        
        {/* Left Column: Project Milestones */}
        <div className="lg:col-span-8 border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0e141e] rounded-md p-4 sm:p-5 shadow-2xs">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
            <div>
              <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                Active Project Milestones
              </h3>
              <p className="text-[11px] text-slate-500">
                Track deliverables across network hardening, security audits, and compliance milestones
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowAddMilestoneModal(true)}
                className="px-2.5 py-1.5 rounded bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold flex items-center gap-1.5 transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Milestone</span>
              </button>
            </div>
          </div>

          {/* Subsystem filter tabs */}
          <div className="flex flex-wrap items-center gap-1 mb-4 text-[11px]">
            {['ALL', 'Network', 'Compliance', 'Science', 'Emergency'].map((filter) => (
              <button
                key={filter}
                onClick={() => setFilterSubsystem(filter)}
                className={`px-2.5 py-1 rounded transition ${
                  filterSubsystem === filter
                    ? 'bg-slate-900 dark:bg-slate-800 text-white font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Milestones List */}
          <div className="space-y-3">
            {filteredMilestones.map((ms) => {
              const statusColor = 
                ms.status === 'COMPLETED' ? 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800' :
                ms.status === 'IN_PROGRESS' ? 'text-cyan-500 bg-cyan-50 dark:bg-cyan-950/40 border-cyan-300 dark:border-cyan-800' :
                ms.status === 'BLOCKED' ? 'text-rose-500 bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800' :
                'text-slate-500 bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700';

              return (
                <div
                  key={ms.id}
                  className="p-3.5 rounded border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 space-y-2 hover:border-slate-400 dark:hover:border-slate-700 transition"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="font-bold text-xs text-slate-900 dark:text-slate-100">
                      {ms.title}
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded border font-semibold ${statusColor}`}>
                      {ms.status}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-600 dark:text-slate-400 font-sans leading-relaxed">
                    {ms.notes}
                  </p>

                  {/* Progress bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] text-slate-500">
                      <span>Progress</span>
                      <span className="font-bold text-slate-900 dark:text-slate-100">{ms.progress}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-cyan-500 transition-all duration-500"
                        style={{ width: `${ms.progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between text-[10px] text-slate-500 pt-1">
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3 text-slate-400" />
                      <span>LEAD: {ms.lead}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      <span>DEADLINE: {ms.deadline}</span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Scheduled Operational Tasks */}
        <div className="lg:col-span-4 border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0e141e] rounded-md p-4 sm:p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-500" />
              <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                Scheduled Operational Tasks
              </h3>
            </div>
            <span className="text-[10px] text-slate-500 bg-slate-100 dark:bg-slate-800/80 px-2 py-0.5 rounded font-mono-code">
              {reminders.length} active
            </span>
          </div>

          <p className="text-[11px] text-slate-500 leading-relaxed font-sans">
            Critical certificate expiries, ISO compliance audits, and biological quarantine deadlines tracked locally.
          </p>

          <div className="space-y-2.5">
            {reminders.map((rem) => {
              const priColor = 
                rem.priority === 'CRITICAL' ? 'text-rose-500 bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-900' :
                rem.priority === 'HIGH' ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-900' :
                'text-slate-500 bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700';

              return (
                <div
                  key={rem.id}
                  className="p-3 rounded border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 space-y-1.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                      {rem.title}
                    </div>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded border font-bold shrink-0 ${priColor}`}>
                      {rem.priority}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{rem.dueTime}</span>
                    </span>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono-code">
                      Scheduled
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Subsystem Jump */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
            <div className="text-[10px] text-slate-500 uppercase mb-2">QUICK ACCESS WORKBENCHES</div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => onNavigateToTab('network')}
                className="p-2 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 text-left"
              >
                Network &amp; DNS &rarr;
              </button>
              <button
                onClick={() => onNavigateToTab('compliance')}
                className="p-2 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 text-left"
              >
                Legal &amp; Compliance &rarr;
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Add Milestone Modal */}
      {showAddMilestoneModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0e141e] border border-slate-300 dark:border-slate-700 rounded-lg max-w-md w-full p-6 shadow-2xl font-mono-code text-xs">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Plus className="w-4 h-4 text-cyan-500" />
              <span>Define New Project Milestone</span>
            </h3>

            <form onSubmit={handleAddMilestone} className="space-y-4">
              <div>
                <label className="block text-[10px] text-slate-500 uppercase mb-1">Milestone Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Edge Ingress Firewall Patch v3"
                  value={newMilestone.title}
                  onChange={(e) => setNewMilestone({ ...newMilestone, title: e.target.value })}
                  className="w-full p-2 rounded bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] text-slate-500 uppercase mb-1">Subsystem</label>
                  <select
                    value={newMilestone.subsystem}
                    onChange={(e) => setNewMilestone({ ...newMilestone, subsystem: e.target.value })}
                    className="w-full p-2 rounded bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                  >
                    <option value="Network & Domains">Network &amp; Domains</option>
                    <option value="Legal & Compliance">Legal &amp; Compliance</option>
                    <option value="Science Lab">Science Lab</option>
                    <option value="Emergency SOS">Emergency SOS</option>
                    <option value="Node Ops">Node Ops</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] text-slate-500 uppercase mb-1">Target Deadline</label>
                  <input
                    type="date"
                    value={newMilestone.deadline}
                    onChange={(e) => setNewMilestone({ ...newMilestone, deadline: e.target.value })}
                    className="w-full p-2 rounded bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] text-slate-500 uppercase mb-1">
                  Initial Progress: {newMilestone.progress}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={newMilestone.progress}
                  onChange={(e) => setNewMilestone({ ...newMilestone, progress: Number(e.target.value) })}
                  className="w-full accent-cyan-500"
                />
              </div>

              <div>
                <label className="block text-[10px] text-slate-500 uppercase mb-1">Technical Notes</label>
                <textarea
                  rows={3}
                  placeholder="Verification parameters and dependencies..."
                  value={newMilestone.notes}
                  onChange={(e) => setNewMilestone({ ...newMilestone, notes: e.target.value })}
                  className="w-full p-2 rounded bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddMilestoneModal(false)}
                  className="px-3 py-1.5 rounded text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-cyan-600 hover:bg-cyan-700 text-white font-bold"
                >
                  Create Milestone
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
