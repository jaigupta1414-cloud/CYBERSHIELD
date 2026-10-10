import React, { useState } from 'react';
import { 
  FileCheck2, 
  ShieldAlert, 
  Download, 
  FileText, 
  Copy, 
  Check, 
  CheckCircle2, 
  HardDrive, 
  Filter, 
  Lock 
} from 'lucide-react';
import { sound } from '../services/audio';
import { notificationService } from '../services/notifications';

export const LegalComplianceView: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'privacy' | 'terms' | 'telemetry'>('privacy');
  const [copiedAuditHash, setCopiedAuditHash] = useState(false);

  const auditHash = '4c9c7a2b904d92419cf2a9f8bfdfcb7778857fa33ccc4bcfbd661bc1d9189cf';

  const handleCopyHash = () => {
    navigator.clipboard.writeText(auditHash);
    setCopiedAuditHash(true);
    sound.playBeep(900, 0.04);
    setTimeout(() => setCopiedAuditHash(false), 2000);
  };

  const handleDownloadMarkdown = () => {
    const mdContent = `# CYBERSHIELD ISO/IEC-27001 LEGAL SPECIFICATION
REVISION: v2.4.0-REV8
EFFECTIVE: 2026-03-30
INTEGRITY: SIGNED
TARGET_SYSTEM: CYBERSHIELD Local Daemon & Standalone Client
AUDIT_HASH: ${auditHash}
TIMESTAMP: 2026-03-30T08:00:00Z
DAEMON_SIG: VALID

## § 01 LOCAL-FIRST TELEMETRY [MANDATE]
CYBERSHIELD AI enforces an unyielding local-first execution model. Raw memory allocations, process identifiers (PIDs), dynamic thread handles, and raw binary file hashes generated during automated heuristics are written exclusively to isolated encrypted ring buffers on the local workstation:
%USERPROFILE%\\.cybershield_vault\\

Under no operational scenario are raw snapshot payloads exported off the host perimeter without programmatic operator clearance.

## § 02 EXTERNAL INTELLIGENCE & SANITIZATION [RFC1918 FILTER]
External reputation queries (including VirusTotal API hooks and public malware hashes) operate on a strictly opt-in flag. Prior to the egress transmission of any packet:
- [01] RFC1918 private IPv4 subnets (10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16) are stripped and zero-masked.
- [02] Unique machine IDs and host environment variables are truncated before hashing.

## § 03 ZERO THIRD-PARTY TRACKING [HARDENED]
The runtime binary package contains zero tracking beacons, zero behavioral heatmaps, zero commercial telemetry sinks, and zero LLM training telemetry feedback loops. No external diagnostic analytics run in the background.
`;

    const blob = new Blob([mdContent], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `cybershield-iso27001-compliance-rev8.md`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    sound.playSuccess();
    notificationService.send('Compliance Exported', 'ISO/IEC-27001 Markdown specification downloaded.');
  };

  const handleDownloadPdf = () => {
    sound.playSuccess();
    // Generate clean styled printable window or notification
    window.print();
    notificationService.send('Compliance PDF Generated', 'Formatted specification sent to print / PDF driver.');
  };

  return (
    <div className="space-y-6 pb-20 max-w-4xl mx-auto">
      
      {/* Header Banner (Matches Right Screen in Screenshot) */}
      <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0e141e] rounded-md p-4 sm:p-5 font-mono-code shadow-2xs">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3 mb-3">
          <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100 font-bold text-sm">
            <span className="w-2.5 h-2.5 bg-cyan-500 rounded-xs inline-block"></span>
            <span>LEGAL_SPECIFICATION_INDEX</span>
          </div>
          <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-semibold border border-emerald-200 dark:border-emerald-800">
            ISO/IEC-27001-COMPLIANT
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-y-2 text-xs text-slate-600 dark:text-slate-400">
          <div>REVISION: <strong className="text-slate-900 dark:text-slate-200">v2.4.0-REV8</strong></div>
          <div>EFFECTIVE: <strong className="text-slate-900 dark:text-slate-200">2026-03-30</strong></div>
          <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>INTEGRITY: SIGNED</span>
          </div>
        </div>
      </div>

      {/* Tabs Row (Matches Screenshot: PRIVACY POLICY | TERMS OF SERVICE | TELEMETRY DISCLOSURE) */}
      <div className="flex items-center gap-1 bg-slate-100/90 dark:bg-slate-900/90 p-1 rounded-md border border-slate-200 dark:border-slate-800 font-mono-code text-xs">
        <button
          onClick={() => {
            setActiveSubTab('privacy');
            sound.playBeep(700, 0.04);
          }}
          className={`flex-1 py-2 px-3 rounded text-center transition font-semibold ${
            activeSubTab === 'privacy'
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-cyan-300 shadow-xs border border-slate-200 dark:border-cyan-500/30'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          PRIVACY POLICY
        </button>
        <button
          onClick={() => {
            setActiveSubTab('terms');
            sound.playBeep(700, 0.04);
          }}
          className={`flex-1 py-2 px-3 rounded text-center transition font-semibold ${
            activeSubTab === 'terms'
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-cyan-300 shadow-xs border border-slate-200 dark:border-cyan-500/30'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          TERMS OF SERVICE
        </button>
        <button
          onClick={() => {
            setActiveSubTab('telemetry');
            sound.playBeep(700, 0.04);
          }}
          className={`flex-1 py-2 px-3 rounded text-center transition font-semibold ${
            activeSubTab === 'telemetry'
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-cyan-300 shadow-xs border border-slate-200 dark:border-cyan-500/30'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          TELEMETRY DISCLOSURE
        </button>
      </div>

      {/* Main Spec Content (Exact text from screenshot) */}
      <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0e141e] rounded-md p-5 sm:p-6 shadow-2xs font-mono-code text-xs space-y-6">
        
        <div className="flex items-center justify-between text-slate-500 text-[11px] border-b border-slate-100 dark:border-slate-800 pb-2">
          <span>TARGET_SYSTEM:</span>
          <span className="font-semibold text-slate-900 dark:text-slate-200">
            CYBERSHIELD Local Daemon &amp; Standalone Client
          </span>
        </div>

        {/* Section 01 */}
        <section className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-slate-900 dark:text-slate-100 font-bold flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-cyan-500" />
              <span>§ 01 LOCAL-FIRST TELEMETRY</span>
            </h4>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-100 dark:bg-cyan-950 text-cyan-800 dark:text-cyan-300 font-bold">
              MANDATE
            </span>
          </div>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-sans text-xs">
            CYBERSHIELD AI enforces an unyielding local-first execution model. Raw memory allocations, process identifiers (PIDs), dynamic thread handles, and raw binary file hashes generated during automated heuristics are written exclusively to isolated encrypted ring buffers on the local workstation:
          </p>
          <div className="p-2.5 rounded bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-cyan-700 dark:text-cyan-300 font-mono text-[11px] flex items-center justify-between">
            <span>%USERPROFILE%\.cybershield_vault\</span>
            <Lock className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-sans text-xs">
            Under no operational scenario are raw snapshot payloads exported off the host perimeter without programmatic operator clearance.
          </p>
        </section>

        {/* Section 02 */}
        <section className="space-y-2 border-t border-slate-100 dark:border-slate-800 pt-5">
          <div className="flex items-center justify-between">
            <h4 className="text-slate-900 dark:text-slate-100 font-bold flex items-center gap-2">
              <Filter className="w-4 h-4 text-cyan-500" />
              <span>§ 02 EXTERNAL INTELLIGENCE &amp; SANITIZATION</span>
            </h4>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold">
              RFC1918 FILTER
            </span>
          </div>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-sans text-xs">
            External reputation queries (including VirusTotal API hooks and public malware hashes) operate on a strictly opt-in flag. Prior to the egress transmission of any packet:
          </p>
          <div className="space-y-1.5 pl-2 text-slate-700 dark:text-slate-300 text-[11px]">
            <div><strong>[01]</strong> RFC1918 private IPv4 subnets (10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16) are stripped and zero-masked.</div>
            <div><strong>[02]</strong> Unique machine IDs and host environment variables are truncated before hashing.</div>
          </div>
        </section>

        {/* Section 03 */}
        <section className="space-y-2 border-t border-slate-100 dark:border-slate-800 pt-5">
          <div className="flex items-center justify-between">
            <h4 className="text-slate-900 dark:text-slate-100 font-bold flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-emerald-500" />
              <span>§ 03 ZERO THIRD-PARTY TRACKING</span>
            </h4>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold">
              HARDENED
            </span>
          </div>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-sans text-xs">
            The runtime binary package contains zero tracking beacons, zero behavioral heatmaps, zero commercial telemetry sinks, and zero LLM training telemetry feedback loops. No external diagnostic analytics run in the background.
          </p>
        </section>

        {/* Export & Compliance Audit Box (Matches Screenshot) */}
        <div className="border border-slate-200 dark:border-slate-800 rounded bg-slate-50 dark:bg-slate-900/80 p-4 space-y-3">
          <div className="text-[10px] text-slate-500 uppercase font-semibold">
            EXPORT &amp; COMPLIANCE AUDIT
          </div>
          <div className="text-[10px] text-slate-700 dark:text-slate-300 break-all flex items-center justify-between gap-2">
            <span>SHA-256: {auditHash}</span>
            <button
              onClick={handleCopyHash}
              className="text-cyan-600 dark:text-cyan-400 hover:underline shrink-0 text-[10px]"
            >
              {copiedAuditHash ? 'COPIED' : 'COPY'}
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-2">
            <button
              onClick={handleDownloadPdf}
              className="px-3 py-1.5 rounded bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>DOWNLOAD SIGNED COMPLIANCE PDF</span>
            </button>
            <button
              onClick={handleDownloadMarkdown}
              className="px-3 py-1.5 rounded bg-slate-200 dark:bg-slate-800/80 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>EXPORT FORMATTED MARKDOWN (.MD)</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-between text-[10px] text-slate-500 pt-2 border-t border-slate-200 dark:border-slate-800">
            <span>TIMESTAMP: 2026-03-30T08:00:00Z</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">DAEMON_SIG: VALID</span>
          </div>
        </div>

      </div>

    </div>
  );
};
