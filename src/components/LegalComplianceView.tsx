import React, { useState } from 'react';
import { 
  FileCheck2, 
  Download, 
  FileText, 
  Check, 
  CheckCircle2, 
  ShieldCheck,
  Printer,
  Copy
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
    const mdContent = `# CYBERSHIELD ISO/IEC-27001 LEGAL & COMPLIANCE SPECIFICATION
REVISION: v2.4.0-AUDIT
EFFECTIVE: 2026-03-30
STATUS: Verified Compliant
AUDIT_HASH: ${auditHash}

## 1. Local-First Data Privacy & Isolation
CyberShield processes endpoint telemetry, process identifiers, and network packet records locally on authorized workstations. Raw system data is retained in encrypted browser sandbox storage and is never transferred to unauthorized external analytics servers.

## 2. External Threat Intelligence & Data Sanitization
Reputation queries against threat intelligence graphs (such as hash lookups and domain blacklists) operate strictly on cryptographic hashes. Internal RFC1918 private IP addresses (10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16) and user identity variables are sanitized before external lookups.

## 3. Zero Third-Party Advertising Trackers
The CyberShield client contains zero behavioral heatmaps, zero commercial marketing trackers, and zero third-party ad beacons. All features serve direct operational cybersecurity and employee life-safety purposes.
`;

    const blob = new Blob([mdContent], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `cybershield-iso27001-compliance-audit.md`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    sound.playSuccess();
    notificationService.send('Policy Exported', 'ISO/IEC-27001 Markdown specification downloaded.');
  };

  const handleDownloadPdf = () => {
    sound.playSuccess();
    window.print();
    notificationService.send('Printing Policy', 'Formatted compliance document sent to print driver.');
  };

  return (
    <div className="space-y-6 pb-20 max-w-4xl mx-auto font-sans text-xs">
      
      {/* Header Banner */}
      <div className="bg-white dark:bg-[#0e141f] border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Legal &amp; Regulatory Compliance
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Official privacy mandates, terms of service, and ISO/IEC-27001 specifications
              </p>
            </div>
          </div>

          <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 font-semibold border border-emerald-200 dark:border-emerald-800 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>ISO/IEC-27001 Verified</span>
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-y-2 text-xs text-slate-600 dark:text-slate-400">
          <div>Revision: <strong className="text-slate-900 dark:text-slate-200">v2.4.0 (Enterprise)</strong></div>
          <div>Effective Date: <strong className="text-slate-900 dark:text-slate-200">2026-03-30</strong></div>
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-[11px] text-slate-500">{auditHash.slice(0, 12)}...</span>
            <button
              onClick={handleCopyHash}
              className="p-1 text-slate-400 hover:text-cyan-500 transition cursor-pointer"
              title="Copy verification hash"
            >
              {copiedAuditHash ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Tabs Row */}
      <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold">
        <button
          onClick={() => {
            setActiveSubTab('privacy');
            sound.playBeep(700, 0.04);
          }}
          className={`flex-1 py-2 px-3 rounded-lg text-center transition cursor-pointer ${
            activeSubTab === 'privacy'
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          Privacy Policy
        </button>
        <button
          onClick={() => {
            setActiveSubTab('terms');
            sound.playBeep(700, 0.04);
          }}
          className={`flex-1 py-2 px-3 rounded-lg text-center transition cursor-pointer ${
            activeSubTab === 'terms'
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          Terms of Service
        </button>
        <button
          onClick={() => {
            setActiveSubTab('telemetry');
            sound.playBeep(700, 0.04);
          }}
          className={`flex-1 py-2 px-3 rounded-lg text-center transition cursor-pointer ${
            activeSubTab === 'telemetry'
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          Data Handling &amp; Security
        </button>
      </div>

      {/* Content Card */}
      <div className="bg-white dark:bg-[#0e141f] border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs space-y-4 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
        
        {activeSubTab === 'privacy' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Enterprise Privacy &amp; Data Minimization Policy
            </h3>
            <p>
              CyberShield is designed with a <strong>privacy-by-default architecture</strong>. All security incident logs, network telemetry, and emergency contacts are stored securely within your organization's managed browser storage and authorized cloud tenancy.
            </p>
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2">
              <h4 className="font-bold text-slate-900 dark:text-slate-100">Key Principles:</h4>
              <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-400">
                <li><strong>No Commercial Tracking:</strong> We never sell, rent, or monetize security telemetry or user location data.</li>
                <li><strong>Encrypted in Transit &amp; at Rest:</strong> All records are protected using TLS 1.3 and industry-standard AES-256 encryption.</li>
                <li><strong>Controlled Access:</strong> Only authenticated personnel with designated clearance levels can access incident tickets and network settings.</li>
              </ul>
            </div>
          </div>
        )}

        {activeSubTab === 'terms' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Acceptable Use &amp; Service Directives
            </h3>
            <p>
              By accessing CyberShield Operations, operators agree to adhere to corporate security guidelines and the principle of least privilege.
            </p>
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2">
              <h4 className="font-bold text-slate-900 dark:text-slate-100">Operator Commitments:</h4>
              <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-400">
                <li>Use emergency dispatch lines solely for genuine life-safety, physical security, or critical cyber crises.</li>
                <li>Do not share authentication credentials or bypass multi-factor authentication controls.</li>
                <li>Report discovered software vulnerabilities or compromised credentials immediately to the SOC lead.</li>
              </ul>
            </div>
          </div>
        )}

        {activeSubTab === 'telemetry' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Security Telemetry &amp; Sanitization Standard
            </h3>
            <p>
              CyberShield automatically strips internal network addresses (RFC 1918) and confidential employee metadata before executing threat hash verifications against public databases.
            </p>
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2">
              <h4 className="font-bold text-slate-900 dark:text-slate-100">Audit Standards:</h4>
              <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-400">
                <li>Compliant with <strong>ISO/IEC 27001:2022</strong> Information Security Management standards.</li>
                <li>Follows <strong>NIST SP 800-61</strong> Computer Security Incident Handling Guide recommendations.</li>
                <li>Fully supports <strong>GDPR Article 33</strong> 72-hour regulatory breach notification timelines.</li>
              </ul>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <span className="text-slate-500 text-[11px]">
            Official corporate audit reference specification
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadMarkdown}
              className="px-3.5 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs flex items-center gap-1.5 transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-cyan-500" />
              <span>Download (.MD)</span>
            </button>

            <button
              onClick={handleDownloadPdf}
              className="px-3.5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white font-semibold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Document</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
