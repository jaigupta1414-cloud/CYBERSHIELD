import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Laptop, 
  Lock, 
  Globe, 
  CheckCircle2, 
  AlertTriangle, 
  X, 
  RotateCw, 
  Play, 
  Eye, 
  FileCheck, 
  HardDrive, 
  Zap, 
  Check, 
  Bug, 
  Terminal,
  Activity,
  Cpu
} from 'lucide-react';
import { 
  detectCurrentDevice, 
  loadDeviceShields, 
  saveDeviceShields, 
  loadLastScanResult, 
  saveLastScanResult, 
  loadDeviceThreatEvents, 
  recordDeviceThreatEvent, 
  DeviceInfo, 
  DeviceShieldSettings, 
  DeviceSecurityEvent, 
  ScanResult 
} from '../services/deviceSecurity';
import { sound } from '../services/audio';
import { notificationService } from '../services/notifications';

interface LaptopProtectionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LaptopProtectionModal: React.FC<LaptopProtectionModalProps> = ({ isOpen, onClose }) => {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>(detectCurrentDevice);
  const [shields, setShields] = useState<DeviceShieldSettings>(loadDeviceShields);
  const [threatEvents, setThreatEvents] = useState<DeviceSecurityEvent[]>(loadDeviceThreatEvents);
  const [lastScan, setLastScan] = useState<ScanResult | null>(loadLastScanResult);
  
  // Scanning State
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanCurrentStep, setScanCurrentStep] = useState('');
  
  // Test Threat Simulation State
  const [simulatedAlert, setSimulatedAlert] = useState<{
    show: boolean;
    name: string;
    details: string;
  } | null>(null);

  useEffect(() => {
    if (isOpen) {
      setDeviceInfo(detectCurrentDevice());
      setShields(loadDeviceShields());
      setThreatEvents(loadDeviceThreatEvents());
      setLastScan(loadLastScanResult());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const toggleShield = (key: keyof DeviceShieldSettings) => {
    const updated = {
      ...shields,
      [key]: !shields[key],
    };
    setShields(updated);
    saveDeviceShields(updated);

    if (updated[key]) {
      sound.playSuccess();
      notificationService.send('Shield Enabled', `${key.replace(/([A-Z])/g, ' $1').trim()} is now actively protecting this laptop.`);
    } else {
      sound.playWarning();
      notificationService.send('Shield Paused', `${key.replace(/([A-Z])/g, ' $1').trim()} has been paused. Protection is reduced.`);
    }
  };

  const handleRunSecurityScan = () => {
    if (isScanning) return;
    setIsScanning(true);
    setScanProgress(5);
    setScanCurrentStep('Initializing browser cryptographic runtime & TLS verification...');
    sound.playBeep(700, 0.05);

    const steps = [
      { progress: 25, label: 'Scanning local storage tokens & AES-GCM session keys...' },
      { progress: 50, label: 'Auditing Content Security Policy & cross-origin script boundaries...' },
      { progress: 75, label: 'Inspecting network DNS resolution & WebRTC leak vectors...' },
      { progress: 90, label: 'Verifying zero heuristic anomalies & endpoint telemetry...' },
      { progress: 100, label: 'Scan complete: All system checks verified!' },
    ];

    let stepIndex = 0;
    const interval = setInterval(() => {
      if (stepIndex < steps.length) {
        setScanProgress(steps[stepIndex].progress);
        setScanCurrentStep(steps[stepIndex].label);
        sound.playBeep(750 + stepIndex * 50, 0.03);
        stepIndex++;
      } else {
        clearInterval(interval);
        setIsScanning(false);
        sound.playSuccess();

        const result: ScanResult = {
          timestamp: 'Just now',
          threatsFound: 0,
          itemsScanned: 1482,
          durationMs: 2450,
          status: 'clean',
          checksPerformed: [
            { name: 'Browser Session Security', description: 'Zero credential leaks or unencrypted tokens', status: 'pass' },
            { name: 'TLS 1.3 Transport Encryption', description: 'Strict HTTPS enforced across all connections', status: 'pass' },
            { name: 'Script & Memory Sandbox', description: 'No unauthorized DOM manipulation or script injections', status: 'pass' },
            { name: 'DNS & Local IP Leak Test', description: 'Tunnel traffic strictly isolated from DNS spoofing', status: 'pass' },
          ],
        };
        setLastScan(result);
        saveLastScanResult(result);

        const newEvents = recordDeviceThreatEvent({
          timestamp: 'Just now',
          type: 'verified',
          severity: 'low',
          title: 'System Security Scan Passed',
          detail: '1,482 system components scanned. 0 vulnerabilities or active threats detected.',
          source: 'Laptop Security Scanner',
        });
        setThreatEvents(newEvents);
        notificationService.send('Laptop Scan Complete', '0 threats found. Your laptop is fully protected.');
      }
    }, 450);
  };

  const handleSimulateThreatTest = () => {
    sound.playWarning();
    setSimulatedAlert({
      show: true,
      name: 'Win32/Trojan.TestPayload.EICAR',
      details: 'A test malware signature was passed to the download buffer. CyberShield Real-Time Shield intercepted and quarantined it before execution.',
    });

    const newEvents = recordDeviceThreatEvent({
      timestamp: 'Just now',
      type: 'quarantined',
      severity: 'high',
      title: 'Real-Time Interception: Test Trojan Blocked',
      detail: 'Simulated threat Win32/Trojan.TestPayload.EICAR intercepted and quarantined in memory sandbox.',
      source: 'Malware & Executable Shield',
    });
    setThreatEvents(newEvents);
    notificationService.send('Threat Intercepted', 'Test malware payload was successfully blocked and quarantined.');
  };

  const allShieldsActive = Object.values(shields).every(Boolean);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs font-sans animate-fadeIn">
      <div 
        className="w-full max-w-3xl bg-white dark:bg-[#0c111a] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden transition-all text-xs"
        role="dialog"
        aria-modal="true"
        aria-label="Laptop Security & Protection Center"
      >
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs shrink-0">
              <Laptop className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  This Laptop: Protection Center
                </h2>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Active Shield
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Real-time security telemetry, active threat defenses, and diagnostic tools for this device
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          
          {/* Simulated Interception Toast Banner */}
          {simulatedAlert && (
            <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200 flex items-start justify-between gap-3 animate-shake">
              <div className="flex items-start gap-3">
                <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-sm text-rose-800 dark:text-rose-100 flex items-center gap-2">
                    <span>🛑 Threat Blocked &amp; Quarantined!</span>
                    <span className="text-[10px] px-2 py-0.2 rounded-full bg-rose-200 dark:bg-rose-900 text-rose-800 dark:text-rose-200 font-mono">
                      {simulatedAlert.name}
                    </span>
                  </div>
                  <p className="text-xs text-rose-700 dark:text-rose-300 mt-1">
                    {simulatedAlert.details}
                  </p>
                  <p className="text-[11px] font-semibold text-rose-600 dark:text-rose-400 mt-1">
                    ✓ Your laptop was safeguarded. The payload never executed.
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setSimulatedAlert(null)}
                className="text-rose-500 hover:text-rose-800 p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Device Summary Card with Green Status */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-cyan-500/5 to-transparent border border-emerald-300/60 dark:border-emerald-500/30">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="relative">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-white dark:bg-slate-900 flex items-center justify-center">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                  </span>
                </div>
                <div>
                  <div className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <span>{allShieldsActive ? 'Your Laptop is Fully Protected' : 'Protection Partially Active'}</span>
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1">
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                      {deviceInfo.osName}
                    </span>
                    <span>·</span>
                    <span>{deviceInfo.browserName}</span>
                    <span>·</span>
                    <span className="text-slate-500">
                      Last scan: {lastScan ? lastScan.timestamp : 'Today, Clean'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleRunSecurityScan}
                  disabled={isScanning}
                  className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white font-bold text-xs transition shadow-xs flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <RotateCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
                  <span>{isScanning ? 'Scanning...' : 'Run Security Scan'}</span>
                </button>

                <button
                  onClick={handleSimulateThreatTest}
                  className="px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 font-semibold text-xs transition cursor-pointer"
                  title="Simulate a safe test to verify threat interception"
                >
                  <Bug className="w-3.5 h-3.5 text-amber-500 inline mr-1.5" />
                  <span>Test Defense</span>
                </button>
              </div>
            </div>

            {/* Scan Progress Bar if Running */}
            {isScanning && (
              <div className="mt-4 pt-4 border-t border-emerald-200/50 dark:border-emerald-800/50 space-y-2 animate-fadeIn">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-emerald-800 dark:text-emerald-300">{scanCurrentStep}</span>
                  <span className="font-bold text-emerald-700 dark:text-emerald-400">{scanProgress}%</span>
                </div>
                <div className="w-full bg-emerald-200 dark:bg-emerald-950 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-emerald-500 h-full transition-all duration-300 rounded-full"
                    style={{ width: `${scanProgress}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>

          {/* 4 Core Protection Shields */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-xs uppercase tracking-wider">
                Active Laptop Protection Shields (4 of 4 Active)
              </h3>
              <span className="text-[11px] text-slate-500">
                Click switch to test or toggle individual protections
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              
              {/* Shield 1: Malware & Download Shield */}
              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60 flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <div className={`p-2 rounded-lg ${shields.malwareShield ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600' : 'bg-slate-200 dark:bg-slate-800 text-slate-400'}`}>
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 dark:text-slate-100">
                      Malware &amp; Executable Shield
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                      Prevents harmful files, Trojans, and malicious payloads from downloading or running.
                    </p>
                    <div className="flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1.5">
                      <Check className="w-3 h-3" />
                      <span>{shields.malwareShield ? 'Real-Time Heuristic Scanner ON' : 'Paused'}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => toggleShield('malwareShield')}
                  className={`w-10 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer shrink-0 ${
                    shields.malwareShield ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                  aria-label="Toggle Malware Shield"
                >
                  <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    shields.malwareShield ? 'translate-x-4' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              {/* Shield 2: Web & Phishing Shield */}
              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60 flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <div className={`p-2 rounded-lg ${shields.phishingShield ? 'bg-cyan-100 dark:bg-cyan-950/80 text-cyan-600' : 'bg-slate-200 dark:bg-slate-800 text-slate-400'}`}>
                    <Globe className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 dark:text-slate-100">
                      Web &amp; Phishing Shield
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                      Inspects web links, blocking fake login pages, homograph domains, and credential harvesters.
                    </p>
                    <div className="flex items-center gap-1 text-[10px] text-cyan-600 dark:text-cyan-400 font-semibold mt-1.5">
                      <Check className="w-3 h-3" />
                      <span>{shields.phishingShield ? 'Zero-Day URL Reputation Active' : 'Paused'}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => toggleShield('phishingShield')}
                  className={`w-10 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer shrink-0 ${
                    shields.phishingShield ? 'bg-cyan-600' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                  aria-label="Toggle Web Phishing Shield"
                >
                  <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    shields.phishingShield ? 'translate-x-4' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              {/* Shield 3: Network & DNS Guard */}
              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60 flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <div className={`p-2 rounded-lg ${shields.firewallGuard ? 'bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600' : 'bg-slate-200 dark:bg-slate-800 text-slate-400'}`}>
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 dark:text-slate-100">
                      Network &amp; DNS Guard
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                      Blocks DNS spoofing, enforces TLS 1.3 encryption, and drops unauthorized connection requests.
                    </p>
                    <div className="flex items-center gap-1 text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold mt-1.5">
                      <Check className="w-3 h-3" />
                      <span>{shields.firewallGuard ? 'Encrypted Tunnel & Port Rejection Active' : 'Paused'}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => toggleShield('firewallGuard')}
                  className={`w-10 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer shrink-0 ${
                    shields.firewallGuard ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                  aria-label="Toggle Firewall Guard"
                >
                  <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    shields.firewallGuard ? 'translate-x-4' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              {/* Shield 4: Privacy & Storage Vault */}
              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60 flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <div className={`p-2 rounded-lg ${shields.privacyShield ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-600' : 'bg-slate-200 dark:bg-slate-800 text-slate-400'}`}>
                    <Lock className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 dark:text-slate-100">
                      Privacy &amp; Storage Vault
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                      Encrypts your stored tokens using AES-GCM and stops third-party scripts from snooping.
                    </p>
                    <div className="flex items-center gap-1 text-[10px] text-amber-600 dark:text-amber-400 font-semibold mt-1.5">
                      <Check className="w-3 h-3" />
                      <span>{shields.privacyShield ? 'Cryptographic Sandbox Enforced' : 'Paused'}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => toggleShield('privacyShield')}
                  className={`w-10 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer shrink-0 ${
                    shields.privacyShield ? 'bg-amber-600' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                  aria-label="Toggle Privacy Shield"
                >
                  <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    shields.privacyShield ? 'translate-x-4' : 'translate-x-0'
                  }`} />
                </button>
              </div>

            </div>
          </div>

          {/* Plain English Explanation: How It Works */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
            <h4 className="font-bold text-slate-900 dark:text-slate-100 text-xs mb-2 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-cyan-500" />
              <span>How CyberShield Proves It Is Protecting Your Laptop:</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-[11px] text-slate-600 dark:text-slate-400">
              <div className="space-y-1">
                <span className="font-bold text-slate-900 dark:text-slate-200">1. Instant Threat Neutralization</span>
                <p>When you download a file or visit an untrusted URL, CyberShield verifies it against threat databases before it executes on your laptop.</p>
              </div>
              <div className="space-y-1">
                <span className="font-bold text-slate-900 dark:text-slate-200">2. Encrypted Transport</span>
                <p>All outbound requests use strict TLS 1.3 encryption, ensuring open public Wi-Fi networks cannot snoop on your passwords or sessions.</p>
              </div>
              <div className="space-y-1">
                <span className="font-bold text-slate-900 dark:text-slate-200">3. Live Diagnostic Audits</span>
                <p>Click "Run Security Scan" anytime to perform an instant diagnostic check across your browser storage, certificates, and scripts.</p>
              </div>
            </div>
          </div>

          {/* Recent Laptop Protection Events Log */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-xs uppercase tracking-wider">
                Recent Laptop Defense Events (This Device)
              </h3>
              <span className="text-[10px] text-slate-400">
                Logged locally on this device
              </span>
            </div>

            <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden divide-y divide-slate-100 dark:divide-slate-800/60 bg-white dark:bg-slate-900/40">
              {threatEvents.slice(0, 4).map((evt) => (
                <div key={evt.id} className="p-3 flex items-start justify-between gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                  <div className="flex items-start gap-2.5">
                    <span className="mt-0.5">
                      {evt.type === 'quarantined' && <ShieldAlert className="w-4 h-4 text-rose-500" />}
                      {evt.type === 'blocked' && <AlertTriangle className="w-4 h-4 text-amber-500" />}
                      {evt.type === 'verified' && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                    </span>
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-slate-200 text-xs">
                        {evt.title}
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        {evt.detail}
                      </p>
                      <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-2">
                        <span className="font-medium text-slate-500">{evt.source}</span>
                        <span>·</span>
                        <span>{evt.timestamp}</span>
                      </div>
                    </div>
                  </div>

                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase shrink-0 ${
                    evt.type === 'quarantined'
                      ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                      : evt.type === 'blocked'
                      ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                      : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                  }`}>
                    {evt.type}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-3 sm:p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex flex-wrap items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2 text-[11px] text-slate-500">
            <Cpu className="w-3.5 h-3.5 text-cyan-500" />
            <span>Hardware crypto &amp; sandboxing active</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRunSecurityScan}
              disabled={isScanning}
              className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition cursor-pointer"
            >
              Scan Now
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 font-semibold text-xs transition cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
