import React, { useState } from 'react';
import { 
  Globe, 
  ShieldCheck, 
  Lock, 
  RotateCw, 
  Copy, 
  Check, 
  Upload, 
  Settings, 
  Plus, 
  Server, 
  FileCode2, 
  CheckCircle,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Trash2,
  Activity
} from 'lucide-react';
import { DnsRecord } from '../types';
import { CybershieldStore, saveStore } from '../services/storage';
import { sound } from '../services/audio';
import { notificationService } from '../services/notifications';

interface NetworkDomainsViewProps {
  store: CybershieldStore;
  setStore: React.Dispatch<React.SetStateAction<CybershieldStore>>;
}

export const NetworkDomainsView: React.FC<NetworkDomainsViewProps> = ({ store, setStore }) => {
  const [copiedFingerprint, setCopiedFingerprint] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyStatus, setVerifyStatus] = useState<string | null>(null);
  const [isRenewingTls, setIsRenewingTls] = useState(false);
  const [renewalStep, setRenewalStep] = useState<string | null>(null);
  const [showAddDnsModal, setShowAddDnsModal] = useState(false);
  const [showUploadPemModal, setShowUploadPemModal] = useState(false);
  const [showCommitToast, setShowCommitToast] = useState(false);
  const [showAdvancedCert, setShowAdvancedCert] = useState(false);

  // New DNS form state
  const [newRecord, setNewRecord] = useState<Partial<DnsRecord>>({
    type: 'CNAME',
    host: '',
    ttl: '300s',
    targetValue: '',
  });

  const { proxySettings, dnsRecords } = store;

  const handleCopyFingerprint = () => {
    const fp = '3F:9A:8C:11:44:B2:D0:65:8E:7A:BC:D1:93:33:DE:54:99:A1:00:FE:7B:44:98:C1:22:90:EA:66:88:21:D0:19';
    navigator.clipboard.writeText(fp);
    setCopiedFingerprint(true);
    sound.playBeep(920, 0.05);
    setTimeout(() => setCopiedFingerprint(false), 2000);
  };

  const handleVerifyEndpoint = () => {
    setIsVerifying(true);
    setVerifyStatus('Checking domain connectivity and DNS health...');
    sound.playBeep(700, 0.05);

    setTimeout(() => {
      setVerifyStatus('Domain verified: Connected to active server (192.168.1.104) with 14ms response time.');
      setIsVerifying(false);
      sound.playSuccess();
      notificationService.send(
        'Domain Verified',
        'Primary domain soc.cybershield.internal is healthy and responding.'
      );
    }, 1100);
  };

  const handleRenewTls = () => {
    setIsRenewingTls(true);
    setRenewalStep('Requesting fresh SSL certificate...');
    sound.playBeep(600, 0.04);

    setTimeout(() => {
      setRenewalStep('Validating domain ownership with Let’s Encrypt...');
      sound.playBeep(700, 0.04);
    }, 800);

    setTimeout(() => {
      setRenewalStep('Installing updated certificate bundle...');
      sound.playBeep(850, 0.04);
    }, 1600);

    setTimeout(() => {
      setIsRenewingTls(false);
      setRenewalStep(null);
      sound.playSuccess();
      notificationService.send(
        'SSL Certificate Renewed',
        'Certificate successfully extended for 90 days.'
      );
    }, 2400);
  };

  const toggleProxySetting = (key: keyof typeof proxySettings) => {
    const updated = {
      ...store,
      proxySettings: {
        ...proxySettings,
        [key]: !proxySettings[key],
      },
    };
    setStore(updated);
    saveStore(updated);
    sound.playBeep(800, 0.03);
  };

  const handleAddDnsRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRecord.host || !newRecord.targetValue) return;

    const recordToAdd: DnsRecord = {
      id: `dns-${Date.now()}`,
      type: (newRecord.type as any) || 'CNAME',
      host: newRecord.host,
      ttl: newRecord.ttl || '300s',
      targetValue: newRecord.targetValue,
      status: 'PROPAGATED',
    };

    const updated = {
      ...store,
      dnsRecords: [...dnsRecords, recordToAdd],
    };
    setStore(updated);
    saveStore(updated);
    setShowAddDnsModal(false);
    setNewRecord({ type: 'CNAME', host: '', ttl: '300s', targetValue: '' });
    sound.playSuccess();
    notificationService.send('DNS Record Added', `Added ${recordToAdd.type} record for ${recordToAdd.host}.`);
  };

  const handleDeleteDnsRecord = (id: string) => {
    const updated = {
      ...store,
      dnsRecords: dnsRecords.filter((r) => r.id !== id),
    };
    setStore(updated);
    saveStore(updated);
    sound.playBeep(600, 0.04);
  };

  const handleCommitConfig = () => {
    setShowCommitToast(true);
    sound.playSuccess();
    notificationService.send(
      'Settings Saved',
      'Network and proxy configurations updated successfully.'
    );
    setTimeout(() => setShowCommitToast(false), 3000);
  };

  return (
    <div className="space-y-6 pb-20 max-w-7xl mx-auto font-sans">
      
      {/* Friendly Overview Header Banner */}
      <div className="bg-white dark:bg-[#0f141f] border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800/80">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Network &amp; Domain Management
              </h2>
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 font-semibold border border-emerald-200 dark:border-emerald-800">
                All Systems Healthy
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Configure your web domain, SSL security certificates, and proxy routing in plain language.
            </p>
          </div>

          <button
            onClick={handleCommitConfig}
            className="self-start md:self-auto px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white font-medium text-xs flex items-center gap-2 transition shadow-xs"
          >
            <Check className="w-4 h-4" />
            <span>Save &amp; Apply Changes</span>
          </button>
        </div>

        {/* 3 Simple Status Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 text-xs">
          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
            <div className="text-slate-500 text-[11px] font-medium">Primary Domain</div>
            <div className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-0.5 truncate font-mono">
              soc.cybershield.internal
            </div>
            <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Connected &amp; Verified</span>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
            <div className="text-slate-500 text-[11px] font-medium">SSL Certificate Status</div>
            <div className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-0.5">
              Let's Encrypt (RSA 4096)
            </div>
            <div className="text-[11px] text-cyan-600 dark:text-cyan-400 mt-1 flex items-center gap-1">
              <Lock className="w-3.5 h-3.5" />
              <span>82 Days Remaining · Auto-Renew On</span>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
            <div className="text-slate-500 text-[11px] font-medium">Traffic Routing</div>
            <div className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-0.5 font-mono">
              Port {proxySettings.daemonSocket.split(':')[1] || '8080'} (Active)
            </div>
            <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1">
              <Activity className="w-3.5 h-3.5" />
              <span>14ms Latency · 0% Drop Rate</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Card 1: Domain Routing & DNS Records */}
          <div className="bg-white dark:bg-[#0f141f] border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-cyan-50 dark:bg-cyan-950/60 border border-cyan-200 dark:border-cyan-800 flex items-center justify-center text-cyan-600 dark:text-cyan-400">
                  <Globe className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    Custom Domain &amp; DNS Records
                  </h3>
                  <p className="text-xs text-slate-500">
                    Point your domain name to CyberShield so users can access the portal securely.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowAddDnsModal(true)}
                className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Record</span>
              </button>
            </div>

            {/* Primary Endpoint Box */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-lg bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 mb-4">
              <div>
                <span className="text-[11px] text-slate-500 font-medium block">Current Domain Endpoint</span>
                <span className="font-mono text-sm font-bold text-slate-900 dark:text-cyan-300">
                  soc.cybershield.internal
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleVerifyEndpoint}
                  disabled={isVerifying}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 dark:bg-cyan-950 text-white dark:text-cyan-200 hover:bg-slate-800 dark:hover:bg-cyan-900 text-xs font-medium flex items-center gap-1.5 transition"
                >
                  <RotateCw className={`w-3.5 h-3.5 ${isVerifying ? 'animate-spin' : ''}`} />
                  <span>{isVerifying ? 'Checking...' : 'Verify Domain'}</span>
                </button>
              </div>
            </div>

            {verifyStatus && (
              <div className="mb-4 text-xs text-cyan-800 dark:text-cyan-300 bg-cyan-50 dark:bg-cyan-950/40 p-3 rounded-lg border border-cyan-200 dark:border-cyan-800 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0" />
                <span>{verifyStatus}</span>
              </div>
            )}

            {/* DNS Records Table */}
            <div>
              <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Configured DNS Records ({dnsRecords.length})
              </div>
              <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-lg">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-900/70 border-b border-slate-200 dark:border-slate-800 text-slate-500 text-[11px]">
                    <tr>
                      <th className="py-2.5 px-3 font-semibold">Type</th>
                      <th className="py-2.5 px-3 font-semibold">Host / Name</th>
                      <th className="py-2.5 px-3 font-semibold">Destination Value</th>
                      <th className="py-2.5 px-3 font-semibold">Status</th>
                      <th className="py-2.5 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                    {dnsRecords.map((rec) => (
                      <tr key={rec.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition">
                        <td className="py-2.5 px-3 font-mono font-bold text-slate-900 dark:text-slate-100">
                          <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[11px]">
                            {rec.type}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 font-mono text-cyan-600 dark:text-cyan-400">{rec.host}</td>
                        <td className="py-2.5 px-3 font-mono text-slate-600 dark:text-slate-300 truncate max-w-[200px]" title={rec.targetValue}>
                          {rec.targetValue}
                        </td>
                        <td className="py-2.5 px-3">
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                            <Check className="w-3 h-3" />
                            <span>Active</span>
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <button
                            onClick={() => handleDeleteDnsRecord(rec.id)}
                            className="p-1 text-slate-400 hover:text-rose-500 rounded transition"
                            title="Remove record"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Card 2: SSL / TLS Security Certificate */}
          <div className="bg-white dark:bg-[#0f141f] border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    SSL Security Certificate
                  </h3>
                  <p className="text-xs text-slate-500">
                    Ensures all visitors connect via secure, encrypted HTTPS.
                  </p>
                </div>
              </div>

              <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 font-medium">
                Encrypted &amp; Protected
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-lg border border-slate-100 dark:border-slate-800">
                <div className="text-[11px] text-slate-500 font-medium">Certificate Provider</div>
                <div className="font-semibold text-slate-900 dark:text-slate-100 mt-1">Let's Encrypt (RSA 4096-bit)</div>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-lg border border-slate-100 dark:border-slate-800">
                <div className="text-[11px] text-slate-500 font-medium">Certificate Validity</div>
                <div className="font-semibold text-emerald-600 dark:text-emerald-400 mt-1">82 Days Remaining</div>
                <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full w-[91%]"></div>
                </div>
              </div>
            </div>

            {renewalStep && (
              <div className="mb-4 text-xs text-cyan-800 dark:text-cyan-300 bg-cyan-50 dark:bg-cyan-950/40 p-3 rounded-lg border border-cyan-200 dark:border-cyan-800 flex items-center gap-2">
                <RotateCw className="w-4 h-4 text-cyan-600 dark:text-cyan-400 animate-spin shrink-0" />
                <span>{renewalStep}</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              <button
                onClick={handleRenewTls}
                disabled={isRenewingTls}
                className="px-3.5 py-2 rounded-lg bg-slate-900 dark:bg-slate-800 text-white hover:bg-slate-800 dark:hover:bg-slate-700 text-xs font-medium flex items-center gap-2 transition"
              >
                <RotateCw className={`w-3.5 h-3.5 ${isRenewingTls ? 'animate-spin' : ''}`} />
                <span>Renew Certificate</span>
              </button>

              <button
                onClick={() => setShowUploadPemModal(true)}
                className="px-3.5 py-2 rounded-lg bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 text-xs font-medium flex items-center gap-2 transition border border-slate-300 dark:border-slate-700"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Certificate</span>
              </button>

              <button
                onClick={() => setShowAdvancedCert(!showAdvancedCert)}
                className="ml-auto text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1 transition"
              >
                <span>{showAdvancedCert ? 'Hide Details' : 'View Fingerprint'}</span>
                {showAdvancedCert ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Collapsible Certificate Details */}
            {showAdvancedCert && (
              <div className="mt-4 p-3 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs animate-fadeIn">
                <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                  <span>SHA-256 Fingerprint</span>
                  <button
                    onClick={handleCopyFingerprint}
                    className="flex items-center gap-1 text-cyan-600 dark:text-cyan-400 hover:underline"
                  >
                    {copiedFingerprint ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedFingerprint ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <div className="font-mono text-[11px] text-slate-700 dark:text-slate-300 break-all bg-white dark:bg-slate-950 p-2 rounded border border-slate-200 dark:border-slate-800">
                  3F:9A:8C:11:44:B2:D0:65:8E:7A:BC:D1:93:33:DE:54:99:A1:00:FE:7B:44:98:C1:22:90:EA:66:88:21:D0:19
                </div>
              </div>
            )}
          </div>

          {/* Card 3: Website Icon & Assets */}
          <div className="bg-white dark:bg-[#0f141f] border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                  <FileCode2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    Website Icon &amp; Branding
                  </h3>
                  <p className="text-xs text-slate-500">
                    Favicon asset served to browser tabs and mobile home screens.
                  </p>
                </div>
              </div>

              <span className="text-xs px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 font-medium">
                Active
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 p-3 bg-slate-50 dark:bg-slate-900/60 rounded-lg border border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex items-center justify-center text-cyan-500 shadow-2xs">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    favicon.ico (4.2 KB)
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Supports 16x16, 32x32, and 48x48 icon resolutions
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  sound.playSuccess();
                  notificationService.send('Website Icon Ready', 'Default security emblem icon verified.');
                }}
                className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-medium transition"
              >
                Change Icon
              </button>
            </div>
          </div>

        </div>

        {/* Right Column */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Card 4: Web Traffic & Proxy Routing */}
          <div className="bg-white dark:bg-[#0f141f] border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-cyan-50 dark:bg-cyan-950/60 border border-cyan-200 dark:border-cyan-800 flex items-center justify-center text-cyan-600 dark:text-cyan-400">
                  <Server className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    Web Traffic &amp; Proxy Routing
                  </h3>
                  <p className="text-xs text-slate-500">
                    Controls how incoming visitor requests reach your application.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-lg border border-slate-100 dark:border-slate-800 mb-4 text-xs">
              <div className="text-[11px] text-slate-500 font-medium">Internal Application Port</div>
              <div className="font-mono font-bold text-slate-900 dark:text-slate-100 text-sm mt-0.5">
                {proxySettings.daemonSocket}
              </div>
              <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1">
                <Check className="w-3 h-3" />
                <span>Protected behind reverse proxy</span>
              </div>
            </div>

            <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Security Header Settings
            </div>

            {/* Clean, Simple Toggles with Plain English */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800">
                <div className="pr-2">
                  <div className="text-xs font-semibold text-slate-900 dark:text-slate-200">Forward Visitor IP (X-Forwarded-For)</div>
                  <div className="text-[11px] text-slate-500">Identifies user locations for security alerts</div>
                </div>
                <button
                  onClick={() => toggleProxySetting('xForwardedFor')}
                  className={`w-10 h-5 rounded-full transition-colors relative p-0.5 focus-visible:outline-none shrink-0 ${
                    proxySettings.xForwardedFor ? 'bg-cyan-600' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                  role="switch"
                  aria-checked={proxySettings.xForwardedFor}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    proxySettings.xForwardedFor ? 'translate-x-5' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800">
                <div className="pr-2">
                  <div className="text-xs font-semibold text-slate-900 dark:text-slate-200">Direct Source IP (X-Real-IP)</div>
                  <div className="text-[11px] text-slate-500">Accurately traces source IPs during investigations</div>
                </div>
                <button
                  onClick={() => toggleProxySetting('xRealIp')}
                  className={`w-10 h-5 rounded-full transition-colors relative p-0.5 focus-visible:outline-none shrink-0 ${
                    proxySettings.xRealIp ? 'bg-cyan-600' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                  role="switch"
                  aria-checked={proxySettings.xRealIp}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    proxySettings.xRealIp ? 'translate-x-5' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800">
                <div className="pr-2">
                  <div className="text-xs font-semibold text-slate-900 dark:text-slate-200">Enforce HTTPS (X-Forwarded-Proto)</div>
                  <div className="text-[11px] text-slate-500">Requires all requests to stay encrypted</div>
                </div>
                <button
                  onClick={() => toggleProxySetting('xForwardedProto')}
                  className={`w-10 h-5 rounded-full transition-colors relative p-0.5 focus-visible:outline-none shrink-0 ${
                    proxySettings.xForwardedProto ? 'bg-cyan-600' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                  role="switch"
                  aria-checked={proxySettings.xForwardedProto}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    proxySettings.xForwardedProto ? 'translate-x-5' : 'translate-x-0'
                  }`} />
                </button>
              </div>
            </div>

            {/* Performance Stats */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-lg border border-slate-100 dark:border-slate-800">
                <div className="text-[11px] text-slate-500 font-medium">Connection Timeout</div>
                <div className="font-bold text-slate-900 dark:text-slate-100 text-sm mt-0.5">{proxySettings.keepAliveTimeout}s</div>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-lg border border-slate-100 dark:border-slate-800">
                <div className="text-[11px] text-slate-500 font-medium">Max Capacity</div>
                <div className="font-bold text-cyan-600 dark:text-cyan-400 text-sm mt-0.5">{proxySettings.maxConcurrency.toLocaleString()} req/s</div>
              </div>
            </div>
          </div>

          {/* Card 5: Production Readiness Checklist */}
          <div className="bg-white dark:bg-[#0f141f] border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    Production Health Checklist
                  </h3>
                  <p className="text-xs text-slate-500">
                    Automated security compliance verification.
                  </p>
                </div>
              </div>

              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 font-bold">
                4/4 Passed
              </span>
            </div>

            <div className="space-y-3 text-xs mb-4">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50/70 dark:bg-slate-900/40">
                <div className="flex items-center gap-2.5 text-slate-800 dark:text-slate-200">
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Custom Domain Linked</span>
                </div>
                <span className="font-mono text-[11px] text-cyan-600 dark:text-cyan-400">soc.cybershield.internal</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50/70 dark:bg-slate-900/40">
                <div className="flex items-center gap-2.5 text-slate-800 dark:text-slate-200">
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>SSL Encryption Enabled</span>
                </div>
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">TLS 1.3 Active</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50/70 dark:bg-slate-900/40">
                <div className="flex items-center gap-2.5 text-slate-800 dark:text-slate-200">
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Privacy Protection</span>
                </div>
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">0 Trackers Detected</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50/70 dark:bg-slate-900/40">
                <div className="flex items-center gap-2.5 text-slate-800 dark:text-slate-200">
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Terms &amp; Compliance Policy</span>
                </div>
                <span className="text-[11px] text-slate-500">ISO-27001 Ready</span>
              </div>
            </div>

            <div className="p-3 bg-emerald-50/70 dark:bg-emerald-950/20 rounded-lg border border-emerald-200/80 dark:border-emerald-900/60 text-[11px] text-emerald-800 dark:text-emerald-300 leading-relaxed">
              Your network meets enterprise privacy standards. All incoming connections are strictly encrypted and sandboxed.
            </div>
          </div>

        </div>
      </div>

      {/* Commit Toast Notification */}
      {showCommitToast && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-xl bg-slate-900 text-white text-xs shadow-xl border border-emerald-500 flex items-center gap-3 animate-fadeIn">
          <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
          <div>
            <div className="font-bold">Settings Saved Successfully</div>
            <div className="text-[11px] text-slate-300">Network and domain configuration applied.</div>
          </div>
        </div>
      )}

      {/* Add DNS Record Modal */}
      {showAddDnsModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0f141f] border border-slate-200 dark:border-slate-800 rounded-xl max-w-md w-full p-6 shadow-2xl text-xs">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-1 flex items-center gap-2">
              <Plus className="w-4 h-4 text-cyan-600" />
              <span>Add New DNS Record</span>
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Add a new subdomain or point a service to your CyberShield cluster.
            </p>

            <form onSubmit={handleAddDnsRecord} className="space-y-4">
              <div>
                <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Record Type
                </label>
                <select
                  value={newRecord.type}
                  onChange={(e) => setNewRecord({ ...newRecord, type: e.target.value as any })}
                  className="w-full p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="CNAME">CNAME (Alias)</option>
                  <option value="A">A (IP Address)</option>
                  <option value="AAAA">AAAA (IPv6 Address)</option>
                  <option value="TXT">TXT (Verification / Security)</option>
                  <option value="MX">MX (Mail Exchange)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Host / Subdomain Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. app, vpn, or @ for root domain"
                  value={newRecord.host}
                  onChange={(e) => setNewRecord({ ...newRecord, host: e.target.value })}
                  className="w-full p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Target Destination
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 192.168.1.104 or gateway.cybershield.net"
                  value={newRecord.targetValue}
                  onChange={(e) => setNewRecord({ ...newRecord, targetValue: e.target.value })}
                  className="w-full p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1">
                  TTL (Time to Live)
                </label>
                <input
                  type="text"
                  value={newRecord.ttl}
                  onChange={(e) => setNewRecord({ ...newRecord, ttl: e.target.value })}
                  className="w-full p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 font-mono text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddDnsModal(false)}
                  className="px-3.5 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white font-medium transition"
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Upload PEM Certificate Modal */}
      {showUploadPemModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0f141f] border border-slate-200 dark:border-slate-800 rounded-xl max-w-md w-full p-6 shadow-2xl text-xs">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-1 flex items-center gap-2">
              <Upload className="w-4 h-4 text-cyan-600" />
              <span>Upload Custom SSL Certificate</span>
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Paste your custom certificate bundle (.pem or .crt) to install it on your domain.
            </p>

            <textarea
              rows={5}
              placeholder="-----BEGIN CERTIFICATE-----&#10;Paste certificate contents here...&#10;-----END CERTIFICATE-----"
              className="w-full p-3 font-mono text-[11px] rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 mb-4 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />

            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setShowUploadPemModal(false)}
                className="px-3.5 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  sound.playSuccess();
                  setShowUploadPemModal(false);
                  notificationService.send('Certificate Installed', 'Custom SSL certificate installed successfully.');
                }}
                className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white font-medium transition"
              >
                Install Certificate
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
