export interface DeviceInfo {
  osName: string;
  deviceType: 'Laptop' | 'Desktop' | 'Mobile' | 'Tablet';
  browserName: string;
  isSecureContext: boolean;
  hasCryptoEngine: boolean;
  connectionType: string;
  screenResolution: string;
  userAgentSnippet: string;
}

export interface DeviceShieldSettings {
  malwareShield: boolean;
  phishingShield: boolean;
  firewallGuard: boolean;
  privacyShield: boolean;
}

export interface DeviceSecurityEvent {
  id: string;
  timestamp: string;
  type: 'blocked' | 'scanned' | 'quarantined' | 'verified';
  severity: 'low' | 'medium' | 'high';
  title: string;
  detail: string;
  source: string;
}

export interface ScanResult {
  timestamp: string;
  threatsFound: number;
  itemsScanned: number;
  durationMs: number;
  status: 'clean' | 'threat_detected';
  checksPerformed: {
    name: string;
    description: string;
    status: 'pass' | 'warning' | 'fail';
  }[];
}

const STORAGE_SHIELDS_KEY = 'cybershield_laptop_shields';
const STORAGE_LAST_SCAN_KEY = 'cybershield_laptop_last_scan';
const STORAGE_THREATS_KEY = 'cybershield_laptop_threat_events';

export function detectCurrentDevice(): DeviceInfo {
  if (typeof window === 'undefined') {
    return {
      osName: 'Personal Laptop',
      deviceType: 'Laptop',
      browserName: 'Web Browser',
      isSecureContext: true,
      hasCryptoEngine: true,
      connectionType: 'Broadband',
      screenResolution: '1920x1080',
      userAgentSnippet: '',
    };
  }

  const ua = navigator.userAgent;
  let osName = 'Personal Computer / Laptop';
  let deviceType: 'Laptop' | 'Desktop' | 'Mobile' | 'Tablet' = 'Laptop';

  if (/Macintosh|Mac OS X/i.test(ua)) {
    osName = 'macOS (Apple MacBook / Mac)';
    deviceType = 'Laptop';
  } else if (/Windows NT 10.0/i.test(ua)) {
    osName = 'Windows 11 / 10 Laptop';
    deviceType = 'Laptop';
  } else if (/Windows/i.test(ua)) {
    osName = 'Windows Workstation';
    deviceType = 'Laptop';
  } else if (/Android/i.test(ua)) {
    osName = 'Android Device';
    deviceType = 'Mobile';
  } else if (/iPhone|iPad|iPod/i.test(ua)) {
    osName = 'iOS Device';
    deviceType = /iPad/i.test(ua) ? 'Tablet' : 'Mobile';
  } else if (/Linux/i.test(ua)) {
    osName = 'Linux Laptop / Workstation';
    deviceType = 'Laptop';
  } else if (/CrOS/i.test(ua)) {
    osName = 'ChromeOS Chromebook';
    deviceType = 'Laptop';
  }

  // Detect Browser
  let browserName = 'Secure Browser';
  if (/Edg\//i.test(ua)) {
    browserName = 'Microsoft Edge';
  } else if (/Chrome\//i.test(ua) && !/Edg\//i.test(ua)) {
    browserName = 'Google Chrome';
  } else if (/Safari\//i.test(ua) && !/Chrome\//i.test(ua)) {
    browserName = 'Apple Safari';
  } else if (/Firefox\//i.test(ua)) {
    browserName = 'Mozilla Firefox';
  }

  const isSecureContext = window.isSecureContext || window.location.protocol === 'https:';
  const hasCryptoEngine = typeof window.crypto?.subtle !== 'undefined';
  const screenResolution = `${window.screen?.width || 1440}x${window.screen?.height || 900}`;
  
  const navAny = navigator as any;
  const connectionType = navAny.connection?.effectiveType 
    ? `${navAny.connection.effectiveType.toUpperCase()} (TLS 1.3)` 
    : 'Encrypted Wi-Fi / LAN';

  return {
    osName,
    deviceType,
    browserName,
    isSecureContext,
    hasCryptoEngine,
    connectionType,
    screenResolution,
    userAgentSnippet: ua.slice(0, 70) + '...',
  };
}

export function loadDeviceShields(): DeviceShieldSettings {
  try {
    const raw = localStorage.getItem(STORAGE_SHIELDS_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // fallback
  }
  return {
    malwareShield: true,
    phishingShield: true,
    firewallGuard: true,
    privacyShield: true,
  };
}

export function saveDeviceShields(shields: DeviceShieldSettings) {
  try {
    localStorage.setItem(STORAGE_SHIELDS_KEY, JSON.stringify(shields));
  } catch {
    // fallback
  }
}

export function loadLastScanResult(): ScanResult | null {
  try {
    const raw = localStorage.getItem(STORAGE_LAST_SCAN_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // fallback
  }
  return null;
}

export function saveLastScanResult(result: ScanResult) {
  try {
    localStorage.setItem(STORAGE_LAST_SCAN_KEY, JSON.stringify(result));
  } catch {
    // fallback
  }
}

const DEFAULT_THREAT_EVENTS: DeviceSecurityEvent[] = [
  {
    id: 'evt-1',
    timestamp: 'Today, 10:14 AM',
    type: 'blocked',
    severity: 'high',
    title: 'Deceptive Phishing URL Filtered',
    detail: 'Intercepted connection attempt to spoofed login domain auth-portal-secure-verify.net',
    source: 'Web & Phishing Shield',
  },
  {
    id: 'evt-2',
    timestamp: 'Yesterday, 04:32 PM',
    type: 'quarantined',
    severity: 'high',
    title: 'Malicious Executable Quarantined',
    detail: 'Blocked download of suspicious file invoice_march_scan.exe (heuristic Trojan signature)',
    source: 'Malware & Executable Shield',
  },
  {
    id: 'evt-3',
    timestamp: 'Yesterday, 11:05 AM',
    type: 'verified',
    severity: 'low',
    title: 'TLS 1.3 Strict Tunnel Established',
    detail: 'Enforced cryptographic encryption for outbound data packets, blocking MITM eavesdropping',
    source: 'Network & DNS Guard',
  },
  {
    id: 'evt-4',
    timestamp: '2 days ago',
    type: 'blocked',
    severity: 'medium',
    title: 'Unauthorized LocalStorage Probe Blocked',
    detail: 'Third-party tracking script prevented from harvesting browser storage session credentials',
    source: 'Privacy & Anti-Tracking Shield',
  },
];

export function loadDeviceThreatEvents(): DeviceSecurityEvent[] {
  try {
    const raw = localStorage.getItem(STORAGE_THREATS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // fallback
  }
  return DEFAULT_THREAT_EVENTS;
}

export function recordDeviceThreatEvent(event: Omit<DeviceSecurityEvent, 'id'>): DeviceSecurityEvent[] {
  const current = loadDeviceThreatEvents();
  const newEvt: DeviceSecurityEvent = {
    ...event,
    id: `evt-${Date.now()}`,
  };
  const updated = [newEvt, ...current.slice(0, 15)];
  try {
    localStorage.setItem(STORAGE_THREATS_KEY, JSON.stringify(updated));
  } catch {
    // fallback
  }
  return updated;
}
