import { DnsRecord, ProjectMilestone, TaskReminder, EmergencyContact, OperatorProfile } from '../types';

export interface CybershieldStore {
  dnsRecords: DnsRecord[];
  proxySettings: {
    daemonSocket: string;
    bindHost: string;
    xForwardedFor: boolean;
    xRealIp: boolean;
    xForwardedProto: boolean;
    keepAliveTimeout: number;
    maxConcurrency: number;
  };
  operator: OperatorProfile;
  milestones: ProjectMilestone[];
  reminders: TaskReminder[];
  emergencyContacts: EmergencyContact[];
  lastSyncTimestamp: string;
  isSimulatedOffline: boolean;
}

const DEFAULT_STORE: CybershieldStore = {
  dnsRecords: [
    {
      id: 'rec-1',
      type: 'CNAME',
      host: 'soc',
      ttl: '300s',
      targetValue: 'edge-ingress.cybershield.net',
      status: 'PROPAGATED',
    },
    {
      id: 'rec-2',
      type: 'A',
      host: '@ (root)',
      ttl: '300s',
      targetValue: '192.168.1.104',
      status: 'PROPAGATED',
    },
    {
      id: 'rec-3',
      type: 'TXT',
      host: '_cybershield_challenge',
      ttl: '60s',
      targetValue: 'v=spf1 include:_spf.internal.cybershield.net ~all',
      status: 'PROPAGATED',
    },
  ],
  proxySettings: {
    daemonSocket: '127.0.0.1:4000',
    bindHost: 'LOCALHOST ONLY',
    xForwardedFor: true,
    xRealIp: true,
    xForwardedProto: true,
    keepAliveTimeout: 60,
    maxConcurrency: 8192,
  },
  operator: {
    id: 'op-882',
    callsign: 'KILOBIT-9',
    badgeNumber: 'SEC-OP: 882',
    clearanceLevel: 4,
    role: 'Cyber-Physical Defense Lead',
    station: 'Node-09 Mobile & Laptop Station',
    lastActive: 'Just now',
    authToken: 'CS-TOKEN-882-LEVEL-4-SIG-VALID',
  },
  milestones: [
    {
      id: 'ms-1',
      title: 'VPC Edge Router & 10GbE Ingress Hardening',
      subsystem: 'Network & Domains',
      status: 'COMPLETED',
      progress: 100,
      deadline: '2026-03-28',
      lead: 'SEC-OP: 882',
      notes: 'RFC 6066 OCSP stapling verified and live loopback locked to 127.0.0.1:4000.',
    },
    {
      id: 'ms-2',
      title: 'ISO/IEC-27001 Local-First Telemetry Compliance Audit',
      subsystem: 'Legal & Compliance',
      status: 'COMPLETED',
      progress: 100,
      deadline: '2026-03-30',
      lead: 'SEC-OP: 882',
      notes: 'Daemon signature valid. Zero 3rd party tracker script injections.',
    },
    {
      id: 'ms-3',
      title: 'Bio-Defense Molecular Vault & AlphaFold Synchronization',
      subsystem: 'Science Lab',
      status: 'IN_PROGRESS',
      progress: 78,
      deadline: '2026-04-15',
      lead: 'DR. V. REID',
      notes: 'Ingesting 4-tier pLDDT scoring and PubChem GHS biosafety handling directives.',
    },
    {
      id: 'ms-4',
      title: 'Distributed Emergency SOS & Geo-Beacon Mesh Handshake',
      subsystem: 'Emergency SOS',
      status: 'IN_PROGRESS',
      progress: 85,
      deadline: '2026-04-18',
      lead: 'SEC-OP: 882',
      notes: 'Real-time GPS tracker with audio siren frequency ramp tested on mobile viewports.',
    },
    {
      id: 'ms-5',
      title: 'Safe-Rollback Protocol for Next-Gen 100G Transceivers',
      subsystem: 'Node Ops',
      status: 'SCHEDULED',
      progress: 25,
      deadline: '2026-05-01',
      lead: 'CLUSTER-SYS',
      notes: 'Pending final hardware stress test on rack node 9.',
    },
  ],
  reminders: [
    {
      id: 'rem-1',
      title: 'Rotate Let’s Encrypt RSA 4096 bundle (82 days remaining)',
      dueTime: '2026-06-20',
      priority: 'HIGH',
      notified: false,
      category: 'NETWORK',
    },
    {
      id: 'rem-2',
      title: 'Run periodic ISO-27001 SHA-256 hash validation',
      dueTime: '2026-04-05',
      priority: 'ROUTINE',
      notified: false,
      category: 'COMPLIANCE',
    },
    {
      id: 'rem-3',
      title: 'Audit emergency contact dispatch broadcast line',
      dueTime: 'Tomorrow, 09:00',
      priority: 'CRITICAL',
      notified: false,
      category: 'BIO-DEFENSE',
    },
  ],
  emergencyContacts: [
    {
      id: 'ec-1',
      name: 'SOC Primary Dispatcher',
      role: 'Emergency Tactical Response',
      phone: '+1 (800) 555-0199',
      priority: 1,
    },
    {
      id: 'ec-2',
      name: 'HazMat / Bio-Safety Officer',
      role: 'Level-4 Containment Team',
      phone: '+1 (800) 555-0144',
      priority: 2,
    },
    {
      id: 'ec-3',
      name: 'On-Call Security Supervisor',
      role: 'Station Lead (Node-09)',
      phone: '+1 (800) 555-0182',
      priority: 3,
    },
  ],
  lastSyncTimestamp: new Date().toISOString(),
  isSimulatedOffline: false,
};

const STORAGE_KEY = 'cybershield_unified_store_v1';

export function loadStore(): CybershieldStore {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...DEFAULT_STORE, ...parsed };
    }
  } catch (err) {
    console.warn('Failed to load store from localStorage', err);
  }
  return DEFAULT_STORE;
}

export function saveStore(store: CybershieldStore): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch (err) {
    console.error('Failed to save store', err);
  }
}

export function exportStoreAsJson(store: CybershieldStore): void {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(store, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', `cybershield-backup-${new Date().toISOString().slice(0, 10)}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}
