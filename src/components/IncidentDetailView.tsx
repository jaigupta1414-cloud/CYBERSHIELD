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
  Filter
} from 'lucide-react';
import { SecurityIncident, IncidentTimelineItem } from '../types';
import { sound } from '../services/audio';
import { notificationService } from '../services/notifications';

interface IncidentDetailViewProps {
  onBack?: () => void;
  onAskAboutIncident?: (incident: SecurityIncident) => void;
}

export const SAMPLE_INCIDENTS: SecurityIncident[] = [
  {
    id: '87795',
    tenantCode: 'WC-ACME-INC-263223',
    title: "'Gracing' malware was prevented",
    statusBadge: 'Escalated',
    version: 'v1 of 1',
    severityTier: 'L3',
    alertProduct: 'Microsoft Defender Advanced Threat Protection',
    classification: '—',
    aiConfidence: 'High',
    opened: '10 Sep 2026, 10:00 PM',
    closed: '10 Sep 2026, 10:09 PM',
    issued: '10 Sep 2026, 10:10 PM',
    summary: "A malicious executable identified as the 'Gracing' trojan attempted execution on endpoint TH-Windows via an email attachment download. The real-time behavioral protection engine immediately terminated the parent process and quarantined the file before any unauthorized network calls or registry modifications occurred.",
    fullReport: "EXECUTIVE SUMMARY:\nAt 22:00:14 UTC, endpoint TH-Windows registered a high-confidence threat detection trigger. The user opened a compromised attachment purporting to be an invoice. Microsoft Defender EDR triggered an automated heuristic halt within 120 milliseconds.\n\nTECHNICAL SPECS:\n- Hash (SHA-256): e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855\n- Target Host: TH-Windows (192.168.1.104)\n- Defense Action: Blocked & Quarantined\n- Blast Radius: Confined to temporary download folder, zero persistence installed.",
    decisions: "DECISION LOG:\n1. Automatic endpoint isolation was evaluated and deemed unnecessary due to instantaneous pre-execution block.\n2. Threat signatures added to edge firewall blacklist.\n3. User account flagged for mandatory security refresher training.",
    timeline: [
      {
        id: 't-1',
        timestamp: '10 Sep 2026, 10:07:00 PM',
        title: 'Retrieve Incident Context & Metadata',
        plainMeaning: 'The system identified which laptop was involved, who was signed in, and what software was running.',
        triageLevel: 'High triage',
        details: 'Queried host telemetry for machine TH-Windows. Associated user account jaigupta confirmed.'
      },
      {
        id: 't-2',
        timestamp: '10 Sep 2026, 10:08:47 PM',
        title: 'Malware Enrichment',
        plainMeaning: 'Security scanners analyzed the suspicious program to see how it operates and where it came from.',
        triageLevel: 'Medium triage',
        details: 'Extracted strings, PE headers, and dynamic sandbox behavior signatures.'
      },
      {
        id: 't-3',
        timestamp: '10 Sep 2026, 10:08:39 PM',
        title: 'File web search',
        plainMeaning: 'Scanned global threat security databases to see if other companies reported this exact bad file.',
        triageLevel: 'Medium triage',
        details: 'Checked VirusTotal and Microsoft Threat Intelligence Graph. 48/72 vendors flagged signature.'
      },
      {
        id: 't-4',
        timestamp: '10 Sep 2026, 10:07:10 PM',
        title: 'Enumerate Child Alerts',
        plainMeaning: 'Looked for any other alerts or unusual events that happened on the computer at the exact same minute.',
        triageLevel: 'Medium triage',
        details: 'No child processes or secondary alerts detected in the 15-minute observation window.'
      },
      {
        id: 't-5',
        timestamp: '10 Sep 2026, 10:08:47 PM',
        title: 'Malware Defender Details',
        plainMeaning: 'Microsoft Defender matched the file against known viruses in the dangerous Gracing malware family.',
        triageLevel: 'High triage',
        details: 'Signature Win32/Gracing.Trojan.Gen matched with 99.8% confidence heuristics.'
      },
      {
        id: 't-6',
        timestamp: '10 Sep 2026, 10:09:06 PM',
        title: 'Confirm remediation and attack story for the prevented files on TH-Windows',
        plainMeaning: 'Double-checked and confirmed that the bad file was blocked before it could change any of your files or passwords.',
        triageLevel: 'Medium triage',
        details: 'Process killed with ExitCode 0x5. File deleted from Downloads and placed in encrypted quarantine vault.'
      },
      {
        id: 't-7',
        timestamp: '10 Sep 2026, 10:08:57 PM',
        title: 'Check TH-Windows for follow-on malicious behavior after the malware detections',
        plainMeaning: 'Performed a deep system sweep to ensure no hidden backup viruses or sneaky programs remained.',
        triageLevel: 'Medium triage',
        details: 'Memory injection analysis and autorun registry keys showed zero deviations from clean baseline.'
      },
      {
        id: 't-8',
        timestamp: '10 Sep 2026, 10:09:12 PM',
        title: 'Threat neutralized & Incident officially closed',
        plainMeaning: 'All clean! Your computer is completely safe, no files were touched, and normal work can resume.',
        triageLevel: 'Resolved',
        details: 'Automated ticket marked RESOLVED. Notification dispatched to SOC tier 1 queue.'
      }
    ]
  },
  {
    id: '87796',
    tenantCode: 'WC-ACME-INC-263223',
    title: 'Deceptive Phishing Link Quarantined',
    statusBadge: 'Informational',
    version: 'v1 of 1',
    severityTier: 'L2',
    alertProduct: 'Microsoft Defender for Office 365',
    classification: 'Credential Harvesting',
    aiConfidence: 'High',
    opened: '10 Sep 2026, 09:14 PM',
    closed: '10 Sep 2026, 09:18 PM',
    issued: '10 Sep 2026, 09:19 PM',
    summary: 'An inbound email impersonating internal cloud authentication was recognized and dropped by AI content inspection.',
    fullReport: 'The message originated from a spoofed domain in Bulgaria attempting to steal credentials.',
    decisions: 'Sender domain blocked globally. Similar emails quarantined across all tenant mailboxes.',
    timeline: [
      {
        id: 't-96-1',
        timestamp: '10 Sep 2026, 09:14:02 PM',
        title: 'Inbound Mail Transport Inspection',
        plainMeaning: 'The mail server noticed a fake login email trying to reach the inbox.',
        triageLevel: 'Medium triage'
      },
      {
        id: 't-96-2',
        timestamp: '10 Sep 2026, 09:16:30 PM',
        title: 'Deep Link Sandbox Detonation',
        plainMeaning: 'The system secretly opened the link in a safe test room to see if it was a trap.',
        triageLevel: 'High triage'
      },
      {
        id: 't-96-3',
        timestamp: '10 Sep 2026, 09:18:00 PM',
        title: 'Message purged from mailboxes',
        plainMeaning: 'The fake email was safely deleted before anyone could accidentally click on it.',
        triageLevel: 'Resolved'
      }
    ]
  }
];

export const IncidentDetailView: React.FC<IncidentDetailViewProps> = ({
  onBack,
  onAskAboutIncident,
}) => {
  const [selectedIncidentId, setSelectedIncidentId] = useState<string>('87795');
  const [activeSection, setActiveSection] = useState<'SUMMARY' | 'FULL REPORT' | 'DECISIONS' | 'TIMELINE'>('SUMMARY');
  const [showTimelineModal, setShowTimelineModal] = useState<boolean>(false);
  const [showRemediationGuide, setShowRemediationGuide] = useState<boolean>(false);
  const [tipsDispatched, setTipsDispatched] = useState<boolean>(false);
  const [isFullyResolved, setIsFullyResolved] = useState<boolean>(false);
  const [expandedTimelineItems, setExpandedTimelineItems] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<boolean>(false);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const currentIncident = SAMPLE_INCIDENTS.find(i => i.id === selectedIncidentId) || SAMPLE_INCIDENTS[0];

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

  const handleDownload = (format: 'PDF' | 'DOCX') => {
    sound.playSuccess();
    setDownloadSuccess(`Generating ${format} report for Incident #${currentIncident.id}...`);
    
    // Create actual downloadable text file representing the report
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

DECISIONS:
${currentIncident.decisions}

DETAILED TIMELINE:
${currentIncident.timeline.map((t, idx) => `${idx + 1}. [${t.timestamp}] ${t.title} (${t.triageLevel})\n   Plain Explanation: ${t.plainMeaning}`).join('\n\n')}

=====================================================
Generated by CyberShield Security Operations Center
`;
    const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Incident_${currentIncident.id}_Report.${format.toLowerCase() === 'pdf' ? 'txt' : 'doc'}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    notificationService.send('Report Downloaded', `Saved official report for Incident #${currentIncident.id} (${format}).`);
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto pb-24 px-2 sm:px-4 pt-2">
      
      {/* Top Header matching exact screenshot WhatsApp Image 2026-10-10 at 2.30.48 PM.jpeg */}
      <div className="relative rounded-t-xl bg-[#0e1117] dark:bg-[#0b0e14] border border-slate-800 dark:border-slate-800/80 overflow-hidden shadow-xl">
        
        {/* Glowing Red Top Accent Line */}
        <div className="h-[2px] w-full bg-gradient-to-r from-red-600 via-rose-500 to-red-600 shadow-[0_0_12px_rgba(239,68,68,0.8)]" />

        {/* Top Bar with Back Arrow and Incident # */}
        <div className="px-4 py-3 flex items-center justify-between border-b border-slate-800/60 bg-[#12151d]/90">
          <div className="flex items-center gap-3">
            <button 
              onClick={onBack}
              className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition"
              title="Go back"
              aria-label="Back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 text-white font-medium text-base sm:text-lg tracking-tight">
              <span>Incident # {currentIncident.id}</span>
              <button 
                onClick={handleCopyId}
                className="p-1 text-slate-400 hover:text-white rounded transition"
                title="Copy Incident Number"
                aria-label="Copy Incident Number"
              >
                {copiedId ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Quick Incident Switcher Dropdown */}
          <div className="flex items-center gap-2">
            <select
              value={selectedIncidentId}
              onChange={(e) => {
                setSelectedIncidentId(e.target.value);
                sound.playBeep(700, 0.04);
              }}
              className="bg-slate-900 border border-slate-700 text-slate-300 text-xs rounded px-2 py-1 font-mono-code focus:outline-none focus:border-red-500"
              title="Switch incident"
            >
              {SAMPLE_INCIDENTS.map((inc) => (
                <option key={inc.id} value={inc.id}>
                  #{inc.id} - {inc.title.slice(0, 24)}...
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Incident Metadata Badges & Subtitle */}
        <div className="p-4 sm:p-6 bg-[#0e1117] dark:bg-[#0b0e14]">
          <div className="flex flex-wrap items-center gap-2 mb-2 font-sans">
            {/* Informational badge */}
            <span className="px-3 py-1 rounded-full text-xs font-medium text-slate-300 bg-slate-800/80 border border-slate-700">
              {currentIncident.statusBadge === 'Escalated' ? 'Informational' : currentIncident.statusBadge}
            </span>

            {/* Escalated badge (filled red) */}
            <span className="px-3 py-1 rounded-full text-xs font-semibold text-white bg-red-600 shadow-[0_0_8px_rgba(220,38,38,0.5)]">
              {currentIncident.statusBadge}
            </span>

            {/* v1 of 1 badge */}
            <span className="px-2.5 py-0.5 rounded-md text-[11px] font-mono-code text-slate-400 bg-slate-900/60 border border-slate-800">
              {currentIncident.version}
            </span>

            {/* L3 Tier badge */}
            <span className="px-2.5 py-0.5 rounded-md text-[11px] font-mono-code text-slate-400 bg-slate-900/60 border border-slate-800">
              {currentIncident.severityTier}
            </span>
          </div>

          {/* Account Code */}
          <div className="text-xs font-mono-code text-slate-400 uppercase tracking-wider mb-2">
            {currentIncident.tenantCode}
          </div>

          {/* Primary Headline */}
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-snug">
            {currentIncident.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Plain language status: Threat was caught and blocked before any files or information could be stolen.
          </p>

          {/* REPORT SECTIONS Card Carousel */}
          <div className="mt-6">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">
              REPORT SECTIONS
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 sm:gap-3">
              {/* Card 1: SUMMARY */}
              <button
                onClick={() => {
                  setActiveSection('SUMMARY');
                  sound.playBeep(700, 0.04);
                }}
                className={`flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl border text-center transition-all ${
                  activeSection === 'SUMMARY'
                    ? 'bg-[#1a1f2c] border-red-500/80 text-white shadow-[0_0_12px_rgba(239,68,68,0.2)] scale-[1.02]'
                    : 'bg-[#151922] border-slate-800/80 text-slate-300 hover:bg-[#1a1e29] hover:border-slate-700'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-red-950/60 border border-red-800/40 flex items-center justify-center mb-2 text-red-500">
                  <BookOpen className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-bold tracking-wider">SUMMARY</span>
              </button>

              {/* Card 2: FULL REPORT */}
              <button
                onClick={() => {
                  setActiveSection('FULL REPORT');
                  sound.playBeep(700, 0.04);
                }}
                className={`flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl border text-center transition-all ${
                  activeSection === 'FULL REPORT'
                    ? 'bg-[#1a1f2c] border-red-500/80 text-white shadow-[0_0_12px_rgba(239,68,68,0.2)] scale-[1.02]'
                    : 'bg-[#151922] border-slate-800/80 text-slate-300 hover:bg-[#1a1e29] hover:border-slate-700'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-red-950/60 border border-red-800/40 flex items-center justify-center mb-2 text-red-500">
                  <FileText className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-bold tracking-wider">FULL REPORT</span>
              </button>

              {/* Card 3: DECISIONS */}
              <button
                onClick={() => {
                  setActiveSection('DECISIONS');
                  sound.playBeep(700, 0.04);
                }}
                className={`flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl border text-center transition-all ${
                  activeSection === 'DECISIONS'
                    ? 'bg-[#1a1f2c] border-red-500/80 text-white shadow-[0_0_12px_rgba(239,68,68,0.2)] scale-[1.02]'
                    : 'bg-[#151922] border-slate-800/80 text-slate-300 hover:bg-[#1a1e29] hover:border-slate-700'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-red-950/60 border border-red-800/40 flex items-center justify-center mb-2 text-red-500">
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-bold tracking-wider">DECISIONS</span>
              </button>

              {/* Card 4: TIMELINE (Launches Timeline sheet matching Image 2) */}
              <button
                onClick={() => {
                  setShowTimelineModal(true);
                  sound.playBeep(800, 0.04);
                }}
                className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl border border-slate-800/80 bg-[#151922] text-slate-300 hover:bg-[#1a1e29] hover:border-red-500/50 hover:text-white transition-all group"
              >
                <div className="w-8 h-8 rounded-lg bg-red-950/60 border border-red-800/40 flex items-center justify-center mb-2 text-red-500 group-hover:scale-105 transition-transform">
                  <Clock className="w-4 h-4" />
                </div>
                <div className="flex items-center gap-1 text-[11px] font-bold tracking-wider">
                  <span>TIMELINE</span>
                  <ChevronRight className="w-3 h-3 text-red-400" />
                </div>
              </button>
            </div>
          </div>

          {/* Active Report Section Content Box */}
          <div className="mt-4 p-4 rounded-xl bg-[#141822] border border-slate-800 text-sm text-slate-300 leading-relaxed font-sans">
            {activeSection === 'SUMMARY' && (
              <div>
                <div className="flex items-center gap-2 text-red-400 font-semibold mb-2 text-xs uppercase tracking-wider">
                  <BookOpen className="w-4 h-4" />
                  <span>Executive Incident Summary</span>
                </div>
                <p>{currentIncident.summary}</p>
                <div className="mt-3 pt-3 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
                  <span>Action taken: Terminated & Quarantined</span>
                  <button 
                    onClick={() => setShowTimelineModal(true)} 
                    className="text-red-400 hover:text-red-300 font-semibold flex items-center gap-1"
                  >
                    <span>View full chronological timeline</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )}

            {activeSection === 'FULL REPORT' && (
              <div>
                <div className="flex items-center gap-2 text-red-400 font-semibold mb-2 text-xs uppercase tracking-wider">
                  <FileText className="w-4 h-4" />
                  <span>Comprehensive Security Engineering Log</span>
                </div>
                <pre className="font-mono-code text-xs text-slate-300 whitespace-pre-wrap leading-relaxed">
                  {currentIncident.fullReport}
                </pre>
              </div>
            )}

            {activeSection === 'DECISIONS' && (
              <div>
                <div className="flex items-center gap-2 text-red-400 font-semibold mb-2 text-xs uppercase tracking-wider">
                  <ShieldAlert className="w-4 h-4" />
                  <span>SOC Triage & Mitigation Directives</span>
                </div>
                <pre className="font-sans text-xs sm:text-sm text-slate-300 whitespace-pre-wrap leading-relaxed">
                  {currentIncident.decisions}
                </pre>
              </div>
            )}
          </div>

          {/* DETAILS Section Table (Exact match to screenshot) */}
          <div className="mt-6">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              DETAILS
            </div>

            <div className="divide-y divide-slate-800/80 text-xs sm:text-sm">
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-slate-400 uppercase text-[11px] font-semibold tracking-wider">ALERT PRODUCT</span>
                <span className="text-white font-medium text-right">{currentIncident.alertProduct}</span>
              </div>

              <div className="py-2.5 flex items-center justify-between">
                <span className="text-slate-400 uppercase text-[11px] font-semibold tracking-wider">CLASSIFICATION</span>
                <span className="text-slate-400 font-medium">{currentIncident.classification}</span>
              </div>

              <div className="py-2.5 flex items-center justify-between">
                <span className="text-slate-400 uppercase text-[11px] font-semibold tracking-wider">AI CONFIDENCE</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 inline" />
                  {currentIncident.aiConfidence}
                </span>
              </div>

              <div className="py-2.5 flex items-center justify-between">
                <span className="text-slate-400 uppercase text-[11px] font-semibold tracking-wider">OPENED</span>
                <span className="text-slate-200 font-mono-code text-xs">{currentIncident.opened}</span>
              </div>

              <div className="py-2.5 flex items-center justify-between">
                <span className="text-slate-400 uppercase text-[11px] font-semibold tracking-wider">CLOSED</span>
                <span className="text-slate-200 font-mono-code text-xs">{currentIncident.closed}</span>
              </div>

              <div className="py-2.5 flex items-center justify-between">
                <span className="text-slate-400 uppercase text-[11px] font-semibold tracking-wider">ISSUED</span>
                <span className="text-slate-200 font-mono-code text-xs">{currentIncident.issued}</span>
              </div>
            </div>
          </div>

          {/* Download this report (PDF / DOCX buttons matching screenshot) */}
          <div className="mt-6 pt-4 border-t border-slate-800">
            <div className="text-xs text-slate-400 mb-3 font-medium">
              Download this report
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => handleDownload('PDF')}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#151922] hover:bg-[#1c2230] border border-slate-800 text-white font-medium text-xs transition group"
              >
                <Download className="w-4 h-4 text-red-500 group-hover:scale-110 transition-transform" />
                <span>PDF</span>
              </button>

              <button
                onClick={() => handleDownload('DOCX')}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#151922] hover:bg-[#1c2230] border border-slate-800 text-white font-medium text-xs transition group"
              >
                <Download className="w-4 h-4 text-red-500 group-hover:scale-110 transition-transform" />
                <span>DOCX</span>
              </button>
            </div>

            {downloadSuccess && (
              <div className="mt-2 text-xs text-emerald-400 flex items-center gap-1.5 animate-fadeIn">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{downloadSuccess}</span>
              </div>
            )}
          </div>

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
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(225,29,72,0.4)] transition transform active:scale-[0.99]"
          >
            <CheckCircle2 className="w-5 h-5 fill-white/20" />
            <span>Recommended Actions &amp; Next Steps</span>
          </button>
        </div>

      </div>

      {/* ============================================================ */}
      {/* TIMELINE BOTTOM SHEET / MODAL MATCHING WhatsApp Image 2026-10-10 at 2.30.49 PM.jpeg */}
      {/* ============================================================ */}
      {showTimelineModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg bg-[#141822] text-white rounded-t-2xl sm:rounded-2xl border border-slate-700/80 max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            
            {/* Top red header trim */}
            <div className="h-[2px] w-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]" />

            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-[#11141c]">
              <div>
                <h3 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                  <span>Timeline</span>
                  <span className="text-xs font-mono-code text-slate-400 font-normal">#{currentIncident.id}</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  What happened, in the order it happened.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleToggleExpandAll}
                  className="text-xs font-semibold text-orange-400 hover:text-orange-300 transition"
                >
                  Expand all
                </button>
                <button
                  onClick={() => setShowTimelineModal(false)}
                  className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition"
                  aria-label="Close timeline"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Timeline Events List */}
            <div className="overflow-y-auto p-4 sm:p-6 space-y-6">
              {currentIncident.timeline.map((item, idx) => {
                const isExpanded = !!expandedTimelineItems[item.id];
                const isHighTriage = item.triageLevel.includes('High');
                const isResolved = item.triageLevel.includes('Resolved');

                return (
                  <div key={item.id} className="relative flex items-start gap-3">
                    
                    {/* Connecting line between timeline nodes */}
                    {idx < currentIncident.timeline.length - 1 && (
                      <div className="absolute left-[7px] top-4 bottom-[-24px] w-[2px] bg-slate-800" />
                    )}

                    {/* Timeline Node Dot */}
                    <div className={`w-3.5 h-3.5 rounded-full mt-1 shrink-0 z-10 ${
                      isResolved 
                        ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]' 
                        : isHighTriage 
                          ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]' 
                          : 'bg-slate-400'
                    }`} />

                    {/* Timeline Event Content */}
                    <div className="flex-1 bg-[#181d29]/60 hover:bg-[#181d29] rounded-xl p-3 border border-slate-800/80 transition cursor-pointer"
                         onClick={() => handleToggleExpandItem(item.id)}>
                      
                      {/* Timestamp */}
                      <div className="text-[11px] font-mono-code text-slate-400 mb-1">
                        {item.timestamp}
                      </div>

                      {/* Event Title */}
                      <div className="text-sm font-semibold text-slate-100 leading-snug">
                        {item.title}
                      </div>

                      {/* Badge row */}
                      <div className="flex items-center justify-between mt-2">
                        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                          isResolved 
                            ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/60'
                            : isHighTriage
                              ? 'bg-red-950/80 text-red-400 border border-red-800/60'
                              : 'bg-amber-950/80 text-amber-400 border border-amber-800/60'
                        }`}>
                          {item.triageLevel}
                        </span>

                        <div className="text-slate-400">
                          {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                        </div>
                      </div>

                      {/* Expandable Plain Meaning for Non-Technical Users */}
                      {isExpanded && (
                        <div className="mt-3 pt-2.5 border-t border-slate-800 text-xs text-slate-300 space-y-1.5 animate-fadeIn">
                          <div className="text-[11px] text-cyan-400 font-semibold uppercase">
                            What this means in plain words:
                          </div>
                          <p className="leading-relaxed bg-slate-900/60 p-2 rounded border border-slate-800">
                            {item.plainMeaning}
                          </p>
                          {item.details && (
                            <div className="font-mono-code text-[10px] text-slate-400 pt-1">
                              Raw telemetry: {item.details}
                            </div>
                          )}
                        </div>
                      )}

                    </div>

                  </div>
                );
              })}
            </div>

            {/* Bottom Close Bar */}
            <div className="p-3 bg-[#11141c] border-t border-slate-800 text-center">
              <button
                onClick={() => setShowTimelineModal(false)}
                className="w-full py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
              >
                Close Timeline
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* ACTION PLAN & REMEDIATION MODAL */}
      {/* ============================================================ */}
      {showRemediationGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="w-full max-w-lg bg-[#141822] text-white rounded-2xl border border-slate-700/80 shadow-2xl overflow-hidden font-sans">
            <div className="h-[2px] w-full bg-gradient-to-r from-emerald-500 via-cyan-500 to-emerald-500" />
            
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
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto text-xs">
              <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-800/60 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-emerald-300 text-sm">Threat Neutralized</div>
                  <div className="text-emerald-200/80 text-[11px] mt-0.5 leading-relaxed">
                    The malicious Trojan file was terminated in 120ms by Defender EDR before modifying any files or network connections.
                  </div>
                </div>
              </div>

              <div className="space-y-2.5">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Verification Checklist
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <div>
                      <div className="font-semibold text-slate-200">Device TH-Windows Scanned</div>
                      <div className="text-[11px] text-slate-400">Zero persistent autoruns or secondary processes found</div>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-400">Passed</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <div>
                      <div className="font-semibold text-slate-200">Firewall Rules Synchronized</div>
                      <div className="text-[11px] text-slate-400">Malware hash added to edge threat database</div>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-400">Blocked</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center ${tipsDispatched ? 'bg-emerald-500 text-slate-950' : 'border border-slate-600'}`}>
                      {tipsDispatched && <Check className="w-3 h-3 font-bold" />}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-200">User Phishing Awareness Briefing</div>
                      <div className="text-[11px] text-slate-400">Notify user jaigupta regarding email attachment safety</div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setTipsDispatched(true);
                      sound.playSuccess();
                      notificationService.send('Security Briefing Sent', 'Safety tips dispatched to jaigupta@organization.com.');
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                      tipsDispatched
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : 'bg-cyan-600 hover:bg-cyan-500 text-white'
                    }`}
                  >
                    {tipsDispatched ? 'Sent' : 'Send Email'}
                  </button>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  onClick={() => {
                    handleDownload('PDF');
                    sound.playSuccess();
                  }}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium flex items-center justify-center gap-2 transition"
                >
                  <Download className="w-4 h-4 text-cyan-400" />
                  <span>Download Audit PDF</span>
                </button>

                <button
                  onClick={() => {
                    setIsFullyResolved(true);
                    sound.playSuccess();
                    notificationService.send('Incident Resolved', `Incident #${currentIncident.id} marked closed by operator.`);
                    setTimeout(() => setShowRemediationGuide(false), 800);
                  }}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-2 transition shadow-md"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isFullyResolved ? 'Resolved' : 'Close Ticket'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
