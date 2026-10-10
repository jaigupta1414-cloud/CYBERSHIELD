import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Copy, 
  Check, 
  BookOpen, 
  FileText, 
  ShieldAlert, 
  Clock, 
  Download, 
  MessageSquare, 
  X, 
  ChevronRight, 
  ChevronDown, 
  CheckCircle2, 
  AlertTriangle,
  FileCheck2,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  Search,
  Filter,
  Plus,
  Send,
  User
} from 'lucide-react';
import { SecurityIncident, IncidentTimelineItem } from '../types';
import { sound } from '../services/audio';
import { notificationService } from '../services/notifications';

interface IncidentDetailViewProps {
  onBack?: () => void;
  onAskAboutIncident?: (incident: SecurityIncident) => void;
}

export const INITIAL_INCIDENTS: SecurityIncident[] = [
  {
    id: '87795',
    tenantCode: 'CORP-PROD-US-WEST',
    title: "Trojan executable halted on employee workstation TH-Windows",
    statusBadge: 'Resolved',
    version: 'v1 of 1',
    severityTier: 'L3',
    alertProduct: 'Microsoft Defender Endpoint Protection',
    classification: 'Malware Execution Prevention',
    aiConfidence: 'High',
    opened: '10 Sep 2026, 10:00 PM',
    closed: '10 Sep 2026, 10:09 PM',
    issued: '10 Sep 2026, 10:10 PM',
    summary: "A malicious executable identified as Win32/Gracing trojan attempted execution on endpoint TH-Windows via an invoice download. The real-time behavioral protection engine terminated the parent process in 120ms and quarantined the file before unauthorized network calls or registry modifications could occur.",
    fullReport: "EXECUTIVE SUMMARY:\nAt 22:00:14 UTC, employee workstation TH-Windows registered a high-confidence threat detection trigger. The user opened an attachment titled 'Invoice_Q3_Statement.pdf.exe'. Defender EDR triggered an automated heuristic halt within 120 milliseconds.\n\nTECHNICAL SPECS:\n- Hash (SHA-256): e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855\n- Target Host: TH-Windows (192.168.1.104)\n- Defense Action: Blocked & Quarantined\n- Blast Radius: Confined to user temporary download folder, zero persistence installed.",
    decisions: "DECISION LOG:\n1. Automatic endpoint network isolation was evaluated and deemed unnecessary due to instantaneous pre-execution block.\n2. Threat binary SHA-256 signature pushed to enterprise edge firewall blacklist.\n3. User account scheduled for email attachment security refresher module.",
    timeline: [
      {
        id: 't-1',
        timestamp: '10 Sep 2026, 10:07:00 PM',
        title: 'Endpoint Threat Detection Triggered',
        plainMeaning: 'Security software detected a suspicious program attempting to launch on laptop TH-Windows.',
        triageLevel: 'High triage',
        details: 'Queried host telemetry for machine TH-Windows. Associated user account jaigupta confirmed.'
      },
      {
        id: 't-2',
        timestamp: '10 Sep 2026, 10:07:45 PM',
        title: 'Behavioral Process Termination',
        plainMeaning: 'The antivirus immediately killed the suspicious file before it could alter files or connect to the internet.',
        triageLevel: 'High triage',
        details: 'Process killed with ExitCode 0x5. File deleted from Downloads and placed in quarantine vault.'
      },
      {
        id: 't-3',
        timestamp: '10 Sep 2026, 10:08:30 PM',
        title: 'Global Threat Intelligence Verification',
        plainMeaning: 'Cross-referenced global security databases to verify malware family signatures.',
        triageLevel: 'Medium triage',
        details: 'Checked VirusTotal and Microsoft Threat Intelligence Graph. 48/72 vendors flagged signature.'
      },
      {
        id: 't-4',
        timestamp: '10 Sep 2026, 10:09:12 PM',
        title: 'Endpoint Integrity Verification & Ticket Closed',
        plainMeaning: 'Verified laptop memory, background services, and autorun keys. No secondary viruses found.',
        triageLevel: 'Resolved',
        details: 'Deep memory injection sweep clean. Automated ticket marked RESOLVED.'
      }
    ]
  },
  {
    id: '87796',
    tenantCode: 'CORP-PROD-US-WEST',
    title: 'Credential Harvesting Phishing Email Quarantined',
    statusBadge: 'Resolved',
    version: 'v1 of 1',
    severityTier: 'L2',
    alertProduct: 'Google Workspace & Defender for Office 365',
    classification: 'Credential Phishing Attempt',
    aiConfidence: 'High',
    opened: '10 Sep 2026, 09:14 PM',
    closed: '10 Sep 2026, 09:18 PM',
    issued: '10 Sep 2026, 09:19 PM',
    summary: 'An inbound email impersonating internal HR payroll authentication was recognized and dropped by email inspection. Sender domain was spoofed from an unauthorized mail relay.',
    fullReport: "DETECTION SUMMARY:\nInbound message with subject 'URGENT: Review Updated Benefit Deductions' contained a malicious hyperlink directing to a fake login portal. Inbound link detonation engine confirmed credential harvesting intent.\n\nACTION:\nSender IP address blocked and message purged from all 24 employee inboxes before opening.",
    decisions: 'DECISION LOG:\n1. Sender domain added to global email spam and phish blocklist.\n2. Security awareness notification sent to Finance & HR distribution lists.',
    timeline: [
      {
        id: 't-96-1',
        timestamp: '10 Sep 2026, 09:14:02 PM',
        title: 'Inbound Mail Transport Inspection',
        plainMeaning: 'Email filters flagged an email pretending to be from internal HR.',
        triageLevel: 'Medium triage'
      },
      {
        id: 't-96-2',
        timestamp: '10 Sep 2026, 09:16:30 PM',
        title: 'Deep Link Sandbox Detonation',
        plainMeaning: 'Security sandbox opened the link safely and identified a fake login page designed to steal passwords.',
        triageLevel: 'High triage'
      },
      {
        id: 't-96-3',
        timestamp: '10 Sep 2026, 09:18:00 PM',
        title: 'Message Purged Across All Mailboxes',
        plainMeaning: 'The email was deleted from inboxes before any employee could open it.',
        triageLevel: 'Resolved'
      }
    ]
  },
  {
    id: '87797',
    tenantCode: 'CORP-PROD-US-WEST',
    title: 'SSH Root Brute-Force Spike Dropped on Production Gateway',
    statusBadge: 'Escalated',
    version: 'v1 of 1',
    severityTier: 'L2',
    alertProduct: 'Cloud Firewall & Fail2Ban Monitor',
    classification: 'Unauthorized Access Attempt',
    aiConfidence: 'High',
    opened: '10 Sep 2026, 08:30 PM',
    closed: 'Under Active Investigation',
    issued: '10 Sep 2026, 08:31 PM',
    summary: 'Over 850 failed SSH authentication attempts detected from IP range 198.51.100.44 over a 3-minute window attempting dictionary attack on root accounts. IP was automatically blacklisted by firewall rules.',
    fullReport: "FIREWALL INCIDENT REPORT:\nAutomated brute force attack targeted port 22 on bastion host. Password authentication is disabled on production bastions (SSH keys only), so no authentication succeeded.\n\nMITIGATION:\nFail2Ban triggered a 7-day IP ban on the entire /24 subnet.",
    decisions: 'DECISION LOG:\n1. Bastion SSH port listening restricted to corporate VPN IP pool only.\n2. Reviewed authentication logs for any successful sessions: zero found.',
    timeline: [
      {
        id: 't-97-1',
        timestamp: '10 Sep 2026, 08:30:15 PM',
        title: 'High-Frequency SSH Authentication Failures',
        plainMeaning: 'An unknown computer tried hundreds of passwords in seconds trying to guess the server password.',
        triageLevel: 'High triage',
        details: 'Threshold of 10 failures in 60s exceeded. Originating IP: 198.51.100.44.'
      },
      {
        id: 't-97-2',
        timestamp: '10 Sep 2026, 08:30:20 PM',
        title: 'Firewall IP Blacklist Triggered',
        plainMeaning: 'The firewall automatically blocked the attacker from making any more connection attempts.',
        triageLevel: 'Medium triage',
        details: 'IPTables rule DROP added for subnet 198.51.100.0/24.'
      }
    ]
  }
];

export const IncidentDetailView: React.FC<IncidentDetailViewProps> = ({
  onBack,
  onAskAboutIncident,
}) => {
  const [incidents, setIncidents] = useState<SecurityIncident[]>(INITIAL_INCIDENTS);
  const [selectedIncidentId, setSelectedIncidentId] = useState<string>('87795');
  const [activeSection, setActiveSection] = useState<'SUMMARY' | 'FULL REPORT' | 'DECISIONS' | 'TIMELINE'>('SUMMARY');
  const [showTimelineModal, setShowTimelineModal] = useState<boolean>(false);
  const [showRemediationGuide, setShowRemediationGuide] = useState<boolean>(false);
  const [showNewIncidentModal, setShowNewIncidentModal] = useState<boolean>(false);
  const [tipsDispatched, setTipsDispatched] = useState<boolean>(false);
  const [expandedTimelineItems, setExpandedTimelineItems] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<boolean>(false);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  // Analyst Note Form State
  const [analystNote, setAnalystNote] = useState<string>('');

  // New Incident Form State
  const [newIncidentForm, setNewIncidentForm] = useState({
    title: '',
    tenantCode: 'CORP-PROD-US-WEST',
    severityTier: 'L2' as 'L1' | 'L2' | 'L3',
    alertProduct: 'Endpoint Protection Agent',
    summary: '',
  });

  const currentIncident = incidents.find(i => i.id === selectedIncidentId) || incidents[0];

  const handleCopyId = () => {
    navigator.clipboard.writeText(currentIncident.id);
    setCopiedId(true);
    sound.playBeep(900, 0.05);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleToggleExpandItem = (id: string) => {
    sound.playBeep(700, 0.04);
    setExpandedTimelineItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleToggleExpandAll = () => {
    const allExpanded = currentIncident.timeline.every(item => expandedTimelineItems[item.id]);
    const newState: Record<string, boolean> = {};
    currentIncident.timeline.forEach(item => {
      newState[item.id] = !allExpanded;
    });
    setExpandedTimelineItems(newState);
    sound.playBeep(750, 0.04);
  };

  const handleStatusChange = (newStatus: 'Escalated' | 'Resolved' | 'Informational') => {
    setIncidents(prev => prev.map(inc => {
      if (inc.id === currentIncident.id) {
        return {
          ...inc,
          statusBadge: newStatus,
          closed: newStatus === 'Resolved' ? new Date().toLocaleTimeString() + ', ' + new Date().toLocaleDateString() : 'Active Investigation',
        };
      }
      return inc;
    }));
    sound.playSuccess();
    notificationService.send('Incident Status Updated', `Incident #${currentIncident.id} set to ${newStatus}.`);
  };

  const handleAddAnalystNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!analystNote.trim()) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dateStr = new Date().toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
    const fullTimeStr = `${dateStr}, ${timeStr}`;

    const newTimelineItem: IncidentTimelineItem = {
      id: `t-note-${Date.now()}`,
      timestamp: fullTimeStr,
      title: `Analyst Note: ${analystNote.slice(0, 45)}${analystNote.length > 45 ? '...' : ''}`,
      plainMeaning: analystNote,
      triageLevel: 'Low triage',
      details: `Logged by authenticated SOC operator. Full entry: ${analystNote}`,
    };

    setIncidents(prev => prev.map(inc => {
      if (inc.id === currentIncident.id) {
        return {
          ...inc,
          timeline: [...inc.timeline, newTimelineItem],
          decisions: `${inc.decisions}\n- [${fullTimeStr}] ${analystNote}`,
        };
      }
      return inc;
    }));

    setAnalystNote('');
    sound.playSuccess();
    notificationService.send('Analyst Note Logged', `Appended update to Incident #${currentIncident.id}.`);
  };

  const handleCreateNewIncident = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIncidentForm.title || !newIncidentForm.summary) return;

    const newId = String(Math.floor(88000 + Math.random() * 1000));
    const nowStr = new Date().toLocaleString();

    const created: SecurityIncident = {
      id: newId,
      tenantCode: newIncidentForm.tenantCode,
      title: newIncidentForm.title,
      statusBadge: 'Escalated',
      version: 'v1 of 1',
      severityTier: newIncidentForm.severityTier,
      alertProduct: newIncidentForm.alertProduct,
      classification: 'Operator Reported Event',
      aiConfidence: 'High',
      opened: nowStr,
      closed: 'Under Active Investigation',
      issued: nowStr,
      summary: newIncidentForm.summary,
      fullReport: `OPERATOR INCIDENT REPORT:\nTitle: ${newIncidentForm.title}\nSeverity: ${newIncidentForm.severityTier}\nReported by SOC Operator at ${nowStr}.\n\nDetails:\n${newIncidentForm.summary}`,
      decisions: `DECISION LOG:\n1. Initial ticket created and flagged for tier-1 triage investigation.`,
      timeline: [
        {
          id: `t-${Date.now()}-1`,
          timestamp: nowStr,
          title: 'Manual Incident Report Filed',
          plainMeaning: 'Incident logged and placed in active investigation queue.',
          triageLevel: 'High triage',
        }
      ]
    };

    setIncidents([created, ...incidents]);
    setSelectedIncidentId(newId);
    setShowNewIncidentModal(false);
    setNewIncidentForm({
      title: '',
      tenantCode: 'CORP-PROD-US-WEST',
      severityTier: 'L2',
      alertProduct: 'Endpoint Protection Agent',
      summary: '',
    });
    sound.playSuccess();
    notificationService.send('New Incident Logged', `Created Incident #${newId}: ${created.title}`);
  };

  const handleDownload = (format: 'PDF' | 'DOCX') => {
    sound.playSuccess();
    setDownloadSuccess(`Generating ${format} report for Incident #${currentIncident.id}...`);
    
    const reportText = `=====================================================
CYBERSHIELD SECURITY INCIDENT REPORT #${currentIncident.id}
TENANT: ${currentIncident.tenantCode}
TITLE: ${currentIncident.title}
PRODUCT: ${currentIncident.alertProduct}
STATUS: ${currentIncident.statusBadge} (SEVERITY: ${currentIncident.severityTier})
TIMESTAMPS: Opened: ${currentIncident.opened} | Closed: ${currentIncident.closed}
=====================================================

SUMMARY:
${currentIncident.summary}

DECISIONS & ACTIONS:
${currentIncident.decisions}

DETAILED EVENT TIMELINE:
${currentIncident.timeline.map((t, idx) => `${idx + 1}. [${t.timestamp}] ${t.title} (${t.triageLevel})\n   Explanation: ${t.plainMeaning}`).join('\n\n')}

=====================================================
Official Audit Record - CyberShield SOC Operations
`;
    const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Incident_${currentIncident.id}_Official_Report.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    notificationService.send('Report Exported', `Saved report for Incident #${currentIncident.id}.`);
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto pb-24 px-2 sm:px-4 pt-2 font-sans">
      
      {/* Top Header Card */}
      <div className="relative rounded-t-xl bg-[#0e1117] dark:bg-[#0b0e14] border border-slate-800 dark:border-slate-800/80 overflow-hidden shadow-xl">
        
        {/* Top Accent Line */}
        <div className={`h-[2px] w-full ${
          currentIncident.statusBadge === 'Resolved'
            ? 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.8)]'
            : 'bg-rose-500 shadow-[0_0_12px_rgba(239,68,68,0.8)]'
        }`} />

        {/* Top Bar with Back Arrow and Incident Picker */}
        <div className="px-4 py-3 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/60 bg-[#12151d]/90">
          <div className="flex items-center gap-3">
            {onBack && (
              <button 
                onClick={onBack}
                className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
                title="Go back"
                aria-label="Back"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <div className="flex items-center gap-2 text-white font-bold text-base sm:text-lg tracking-tight">
              <span>Incident #{currentIncident.id}</span>
              <button 
                onClick={handleCopyId}
                className="p-1 text-slate-400 hover:text-white rounded transition cursor-pointer"
                title="Copy Incident Number"
                aria-label="Copy Incident Number"
              >
                {copiedId ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Quick Actions: Select Incident & Log New Event */}
          <div className="flex items-center gap-2">
            <select
              value={selectedIncidentId}
              onChange={(e) => {
                setSelectedIncidentId(e.target.value);
                sound.playBeep(700, 0.04);
              }}
              className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-cyan-500"
              title="Switch incident"
            >
              {incidents.map((inc) => (
                <option key={inc.id} value={inc.id}>
                  #{inc.id} - {inc.title.slice(0, 32)}...
                </option>
              ))}
            </select>

            <button
              onClick={() => setShowNewIncidentModal(true)}
              className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Report Event</span>
            </button>
          </div>
        </div>

        {/* Incident Metadata Badges & Subtitle */}
        <div className="p-4 sm:p-6 bg-[#0e1117] dark:bg-[#0b0e14]">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            
            {/* Status change interactive toggle */}
            <div className="flex items-center bg-slate-900 rounded-full border border-slate-700 p-0.5 text-xs font-bold">
              <button
                onClick={() => handleStatusChange('Escalated')}
                className={`px-3 py-1 rounded-full transition cursor-pointer ${
                  currentIncident.statusBadge === 'Escalated'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Active Investigation
              </button>
              <button
                onClick={() => handleStatusChange('Resolved')}
                className={`px-3 py-1 rounded-full transition cursor-pointer ${
                  currentIncident.statusBadge === 'Resolved'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Resolved
              </button>
            </div>

            {/* Severity Tier */}
            <span className="px-2.5 py-1 rounded-md text-xs font-bold text-amber-400 bg-amber-950/60 border border-amber-800">
              Severity: {currentIncident.severityTier}
            </span>

            {/* Product */}
            <span className="px-2.5 py-1 rounded-md text-xs text-slate-300 bg-slate-900/60 border border-slate-800">
              {currentIncident.alertProduct}
            </span>
          </div>

          {/* Account Code */}
          <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">
            {currentIncident.tenantCode} · Opened: {currentIncident.opened}
          </div>

          {/* Primary Headline */}
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug">
            {currentIncident.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Status: {currentIncident.statusBadge === 'Resolved' ? 'Threat mitigated. Systems operating normally.' : 'Investigation ongoing by Security Operations Center.'}
          </p>

          {/* REPORT SECTIONS Card Carousel */}
          <div className="mt-6">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              REPORT SECTIONS
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
              {/* Card 1: SUMMARY */}
              <button
                onClick={() => {
                  setActiveSection('SUMMARY');
                  sound.playBeep(700, 0.04);
                }}
                className={`flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl border text-center transition-all cursor-pointer ${
                  activeSection === 'SUMMARY'
                    ? 'bg-[#1a1f2c] border-cyan-500/80 text-white shadow-md'
                    : 'bg-[#151922] border-slate-800/80 text-slate-300 hover:bg-[#1a1e29]'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-cyan-950/60 border border-cyan-800/40 flex items-center justify-center mb-2 text-cyan-400">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div className="text-xs font-bold">SUMMARY</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Threat Overview</div>
              </button>

              {/* Card 2: FULL REPORT */}
              <button
                onClick={() => {
                  setActiveSection('FULL REPORT');
                  sound.playBeep(700, 0.04);
                }}
                className={`flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl border text-center transition-all cursor-pointer ${
                  activeSection === 'FULL REPORT'
                    ? 'bg-[#1a1f2c] border-cyan-500/80 text-white shadow-md'
                    : 'bg-[#151922] border-slate-800/80 text-slate-300 hover:bg-[#1a1e29]'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-cyan-950/60 border border-cyan-800/40 flex items-center justify-center mb-2 text-cyan-400">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="text-xs font-bold">FULL REPORT</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Forensic Specs</div>
              </button>

              {/* Card 3: DECISIONS */}
              <button
                onClick={() => {
                  setActiveSection('DECISIONS');
                  sound.playBeep(700, 0.04);
                }}
                className={`flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl border text-center transition-all cursor-pointer ${
                  activeSection === 'DECISIONS'
                    ? 'bg-[#1a1f2c] border-cyan-500/80 text-white shadow-md'
                    : 'bg-[#151922] border-slate-800/80 text-slate-300 hover:bg-[#1a1e29]'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-cyan-950/60 border border-cyan-800/40 flex items-center justify-center mb-2 text-cyan-400">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div className="text-xs font-bold">DECISIONS</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Actions Taken</div>
              </button>

              {/* Card 4: TIMELINE */}
              <button
                onClick={() => {
                  setShowTimelineModal(true);
                  sound.playBeep(750, 0.04);
                }}
                className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl border border-slate-800 bg-[#151922] hover:bg-[#1a1e29] text-slate-300 text-center transition-all cursor-pointer"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-950/60 border border-emerald-800/40 flex items-center justify-center mb-2 text-emerald-400">
                  <Clock className="w-4 h-4" />
                </div>
                <div className="text-xs font-bold">TIMELINE</div>
                <div className="text-[10px] text-emerald-400 mt-0.5">{currentIncident.timeline.length} Events Logged</div>
              </button>
            </div>
          </div>

          {/* Active Section Content Display */}
          <div className="mt-6 p-4 sm:p-5 rounded-xl bg-[#141824] border border-slate-800 text-slate-200">
            <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-2">
              {activeSection} CONTENT
            </h3>

            {activeSection === 'SUMMARY' && (
              <p className="text-sm leading-relaxed text-slate-300">
                {currentIncident.summary}
              </p>
            )}

            {activeSection === 'FULL REPORT' && (
              <pre className="text-xs font-mono whitespace-pre-wrap text-slate-300 leading-relaxed overflow-x-auto">
                {currentIncident.fullReport}
              </pre>
            )}

            {activeSection === 'DECISIONS' && (
              <pre className="text-xs font-mono whitespace-pre-wrap text-slate-300 leading-relaxed overflow-x-auto">
                {currentIncident.decisions}
              </pre>
            )}
          </div>

          {/* Analyst Note Quick Logger */}
          <div className="mt-6 p-4 rounded-xl bg-[#12151d] border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-4 h-4 text-cyan-400" />
              <span>Add Real-Time Analyst Investigation Note</span>
            </h4>
            <form onSubmit={handleAddAnalystNote} className="flex gap-2">
              <input
                type="text"
                value={analystNote}
                onChange={e => setAnalystNote(e.target.value)}
                placeholder="Log containment action, hash verification, or host restart..."
                className="flex-1 px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs flex items-center gap-1.5 transition cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Log Note</span>
              </button>
            </form>
          </div>

          {/* Download this report row */}
          <div className="mt-6 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div className="text-xs text-slate-400 font-medium">
              Official audit documentation
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleDownload('PDF')}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#151922] hover:bg-[#1c2230] border border-slate-800 text-white text-xs font-medium transition cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-cyan-400" />
                <span>Download Report Text</span>
              </button>
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#151922] hover:bg-[#1c2230] border border-slate-800 text-white text-xs font-medium transition cursor-pointer"
              >
                <FileCheck2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Print Document</span>
              </button>
            </div>
          </div>

          {downloadSuccess && (
            <div className="mt-2 text-xs text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{downloadSuccess}</span>
            </div>
          )}

        </div>

        {/* Big Bottom Action Button */}
        <div className="p-4 bg-[#12151d] border-t border-slate-800">
          <button
            onClick={() => {
              if (onAskAboutIncident) {
                onAskAboutIncident(currentIncident);
              } else {
                setShowRemediationGuide(true);
                sound.playBeep(850, 0.05);
              }
            }}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg transition cursor-pointer"
          >
            <ShieldCheck className="w-5 h-5" />
            <span>Recommended Actions &amp; Next Steps</span>
          </button>
        </div>

      </div>

      {/* ============================================================ */}
      {/* TIMELINE MODAL                                               */}
      {/* ============================================================ */}
      {showTimelineModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-xs p-3">
          <div className="w-full max-w-lg bg-[#141822] text-white rounded-2xl border border-slate-700 max-h-[85vh] flex flex-col shadow-2xl overflow-hidden font-sans">
            
            <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-[#11141c]">
              <div>
                <h3 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
                  <span>Incident Timeline</span>
                  <span className="text-xs text-slate-400 font-mono">#{currentIncident.id}</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Chronological event chain and remediation steps
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleToggleExpandAll}
                  className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition cursor-pointer"
                >
                  Expand All
                </button>
                <button
                  onClick={() => setShowTimelineModal(false)}
                  className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="overflow-y-auto p-4 sm:p-6 space-y-4">
              {currentIncident.timeline.map((item, idx) => {
                const isExpanded = !!expandedTimelineItems[item.id];
                const isHigh = item.triageLevel.includes('High');
                const isResolved = item.triageLevel.includes('Resolved');

                return (
                  <div key={item.id} className="relative flex items-start gap-3">
                    {idx < currentIncident.timeline.length - 1 && (
                      <div className="absolute left-[7px] top-4 bottom-[-16px] w-[2px] bg-slate-800" />
                    )}

                    <div className={`w-3.5 h-3.5 rounded-full mt-1 shrink-0 z-10 ${
                      isResolved 
                        ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]' 
                        : isHigh 
                          ? 'bg-rose-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]' 
                          : 'bg-cyan-500'
                    }`} />

                    <div 
                      onClick={() => handleToggleExpandItem(item.id)}
                      className="flex-1 bg-[#181d29]/80 hover:bg-[#181d29] rounded-xl p-3 border border-slate-800 transition cursor-pointer"
                    >
                      <div className="text-[11px] text-slate-400 mb-1 font-mono">
                        {item.timestamp}
                      </div>

                      <div className="text-xs sm:text-sm font-semibold text-slate-100">
                        {item.title}
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          isResolved 
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' 
                            : isHigh 
                              ? 'bg-rose-950 text-rose-400 border border-rose-800' 
                              : 'bg-cyan-950 text-cyan-400 border border-cyan-800'
                        }`}>
                          {item.triageLevel}
                        </span>

                        <div className="text-slate-400">
                          {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="mt-2.5 pt-2 border-t border-slate-800 text-xs text-slate-300 space-y-1">
                          <p className="bg-slate-900/60 p-2 rounded text-xs leading-relaxed">
                            {item.plainMeaning}
                          </p>
                          {item.details && (
                            <div className="text-[10px] font-mono text-slate-400 pt-0.5">
                              Telemetry: {item.details}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-3 bg-[#11141c] border-t border-slate-800 text-center">
              <button
                onClick={() => setShowTimelineModal(false)}
                className="w-full py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer"
              >
                Close Timeline
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL: REPORT NEW INCIDENT                                   */}
      {/* ============================================================ */}
      {showNewIncidentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="w-full max-w-md bg-[#141822] text-white rounded-2xl border border-slate-700 p-6 shadow-2xl space-y-4 font-sans">
            <h3 className="text-base font-bold">
              Report Security Event / Incident
            </h3>
            
            <form onSubmit={handleCreateNewIncident} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Incident Title
                </label>
                <input
                  type="text"
                  required
                  value={newIncidentForm.title}
                  onChange={e => setNewIncidentForm({ ...newIncidentForm, title: e.target.value })}
                  placeholder="e.g. Lost company laptop in transit (Finance Dept)"
                  className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-slate-900 text-white text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Severity Tier
                  </label>
                  <select
                    value={newIncidentForm.severityTier}
                    onChange={e => setNewIncidentForm({ ...newIncidentForm, severityTier: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-slate-900 text-white text-xs"
                  >
                    <option value="L1">L1 - Critical / Urgent</option>
                    <option value="L2">L2 - High Priority</option>
                    <option value="L3">L3 - Standard / Routine</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Detection Product
                  </label>
                  <input
                    type="text"
                    value={newIncidentForm.alertProduct}
                    onChange={e => setNewIncidentForm({ ...newIncidentForm, alertProduct: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-slate-900 text-white text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Incident Description &amp; Scope
                </label>
                <textarea
                  rows={4}
                  required
                  value={newIncidentForm.summary}
                  onChange={e => setNewIncidentForm({ ...newIncidentForm, summary: e.target.value })}
                  placeholder="Describe what occurred, affected usernames, machines, or observed suspicious activity..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-slate-900 text-white text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewIncidentModal(false)}
                  className="px-4 py-2 rounded-lg border border-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold cursor-pointer"
                >
                  Submit Incident Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* REMEDIATION ACTION PLAN MODAL                                */}
      {/* ============================================================ */}
      {showRemediationGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg bg-[#141822] text-white rounded-2xl border border-slate-700 shadow-2xl overflow-hidden font-sans">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-[#11141c]">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <span>Incident Action Plan &amp; Resolution</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Remediation checklist for Incident #{currentIncident.id}
                </p>
              </div>
              <button
                onClick={() => setShowRemediationGuide(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto text-xs">
              <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-800/60 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-emerald-300 text-sm">Threat Containment Active</div>
                  <div className="text-emerald-200/80 text-xs mt-0.5 leading-relaxed">
                    Automated perimeter blocks and host protections are running. Follow the verification steps below to close this incident ticket.
                  </div>
                </div>
              </div>

              <div className="space-y-2.5">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Remediation Checklist
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <div>
                      <div className="font-semibold text-slate-200">Host Scanned &amp; Verified</div>
                      <div className="text-[11px] text-slate-400">Zero active autoruns or secondary processes detected</div>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-400">Passed</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <div>
                      <div className="font-semibold text-slate-200">Edge Firewall Rules Synchronized</div>
                      <div className="text-[11px] text-slate-400">Threat signatures updated on ingress router</div>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-400">Blocked</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center ${tipsDispatched ? 'bg-emerald-500 text-slate-950' : 'border border-slate-600'}`}>
                      {tipsDispatched && <Check className="w-3 h-3 font-bold" />}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-200">Notify Reporter &amp; Affected Staff</div>
                      <div className="text-[11px] text-slate-400">Send resolution summary to employee email</div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setTipsDispatched(true);
                      sound.playSuccess();
                      notificationService.send('Security Briefing Sent', 'Notification dispatched to affected employee.');
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                      tipsDispatched
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : 'bg-cyan-600 hover:bg-cyan-500 text-white'
                    }`}
                  >
                    {tipsDispatched ? 'Sent' : 'Dispatch Email'}
                  </button>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  onClick={() => {
                    handleDownload('PDF');
                    sound.playSuccess();
                  }}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <Download className="w-4 h-4 text-cyan-400" />
                  <span>Download Report</span>
                </button>

                <button
                  onClick={() => {
                    handleStatusChange('Resolved');
                    setShowRemediationGuide(false);
                  }}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-2 transition shadow-md cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Close Ticket</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
