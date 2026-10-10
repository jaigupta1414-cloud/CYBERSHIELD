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

export const DEFAULT_STORE: CybershieldStore = {
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
      targetValue: 'v=spf1 include:_spf.google.com ~all',
      status: 'PROPAGATED',
    },
    {
      id: 'rec-4',
      type: 'MX',
      host: '@ (root)',
      ttl: '3600s',
      targetValue: 'aspmx.l.google.com (Priority 1)',
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
    id: 'op-401',
    callsign: 'Security Analyst',
    badgeNumber: 'SEC-ADMIN: 401',
    clearanceLevel: 4,
    role: 'Senior Cybersecurity Analyst & Incident Commander',
    station: 'Primary Security Operations Center',
    lastActive: 'Just now',
    authToken: 'CS-AUTH-TOKEN-SEC-401',
  },
  milestones: [
    {
      id: 'ms-1',
      title: 'Company-Wide Multi-Factor Authentication (MFA) Enforcement',
      subsystem: 'Security Operations',
      status: 'COMPLETED',
      progress: 100,
      deadline: '2026-03-28',
      lead: 'SEC-ADMIN: 401',
      notes: 'FIDO2 & Authenticator app enforcement verified across all 180 corporate accounts.',
    },
    {
      id: 'ms-2',
      title: 'VPC Ingress Rate Limiting & Web Application Firewall Rules',
      subsystem: 'Network & Domains',
      status: 'COMPLETED',
      progress: 100,
      deadline: '2026-03-30',
      lead: 'NET-ENG: 104',
      notes: 'Blocked abusive HTTP scraping patterns and established 100 req/min rate limits per IP.',
    },
    {
      id: 'ms-3',
      title: 'Endpoint Detection & Response (EDR) Agent Rollout',
      subsystem: 'Security Operations',
      status: 'IN_PROGRESS',
      progress: 88,
      deadline: '2026-04-15',
      lead: 'SEC-ADMIN: 401',
      notes: 'Deployed next-gen behavioral monitoring to 142/160 macOS and Windows laptops.',
    },
    {
      id: 'ms-4',
      title: 'ISO/IEC-27001 Annual Third-Party Security Audit',
      subsystem: 'Compliance',
      status: 'IN_PROGRESS',
      progress: 65,
      deadline: '2026-04-30',
      lead: 'AUDIT-LEAD',
      notes: 'Access control matrices, encryption in transit, and offline backup procedures undergoing review.',
    },
    {
      id: 'ms-5',
      title: 'Disaster Recovery & Redundant DNS Failover Drill',
      subsystem: 'Network & Domains',
      status: 'SCHEDULED',
      progress: 30,
      deadline: '2026-05-15',
      lead: 'NET-ENG: 104',
      notes: 'Simulated primary datacenter outage and validated automatic route shifting.',
    },
  ],
  reminders: [
    {
      id: 'rem-1',
      title: 'Renew Let’s Encrypt wildcard SSL certificate (64 days remaining)',
      dueTime: '2026-06-15',
      priority: 'HIGH',
      notified: false,
      category: 'NETWORK',
    },
    {
      id: 'rem-2',
      title: 'Audit privileged administrator accounts & remove inactive API tokens',
      dueTime: '2026-04-12',
      priority: 'CRITICAL',
      notified: false,
      category: 'SECURITY',
    },
    {
      id: 'rem-3',
      title: 'Conduct monthly emergency contact line & SMS notification drill',
      dueTime: 'Tomorrow, 10:00 AM',
      priority: 'HIGH',
      notified: false,
      category: 'INCIDENT',
    },
    {
      id: 'rem-4',
      title: 'Verify offline immutable database backup integrity checksums',
      dueTime: 'Weekly on Friday',
      priority: 'ROUTINE',
      notified: false,
      category: 'INFRASTRUCTURE',
    },
  ],
  emergencyContacts: [
    {
      id: 'ec-1',
      name: '24/7 Security Operations Center (SOC)',
      role: 'Primary Emergency & Incident Dispatch',
      phone: '+1 (800) 555-0199',
      priority: 1,
    },
    {
      id: 'ec-2',
      name: 'Corporate IT & Infrastructure Helpdesk',
      role: 'Network & System Outages',
      phone: '+1 (800) 555-0120',
      priority: 2,
    },
    {
      id: 'ec-3',
      name: 'Facility & Building Physical Security',
      role: 'On-Site Security, Lockouts & Access',
      phone: '+1 (800) 555-0182',
      priority: 3,
    },
    {
      id: 'ec-4',
      name: 'Employee Safety & Crisis Coordinator',
      role: 'Staff Welfare, Medical & Field Safety',
      phone: '+1 (800) 555-0155',
      priority: 4,
    },
  ],
  lastSyncTimestamp: new Date().toISOString(),
  isSimulatedOffline: false,
};

const STORAGE_KEY = 'cybershield_unified_store_v2';

export function loadStore(): CybershieldStore {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Cleanse any old obsolete sci-fi milestones or reminders
      const sanitizedMilestones = (parsed.milestones || DEFAULT_STORE.milestones).filter(
        (m: any) => !m.subsystem.toLowerCase().includes('science') && !m.subsystem.toLowerCase().includes('node ops')
      );
      const sanitizedReminders = (parsed.reminders || DEFAULT_STORE.reminders).filter(
        (r: any) => r.category !== 'BIO-DEFENSE' && r.category !== 'CLUSTER'
      );
      const sanitizedContacts = (parsed.emergencyContacts || DEFAULT_STORE.emergencyContacts).filter(
        (c: any) => !c.role.toLowerCase().includes('containment') && !c.role.toLowerCase().includes('hazmat')
      );

      return {
        ...DEFAULT_STORE,
        ...parsed,
        milestones: sanitizedMilestones.length > 0 ? sanitizedMilestones : DEFAULT_STORE.milestones,
        reminders: sanitizedReminders.length > 0 ? sanitizedReminders : DEFAULT_STORE.reminders,
        emergencyContacts: sanitizedContacts.length > 0 ? sanitizedContacts : DEFAULT_STORE.emergencyContacts,
      };
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

export function resetStoreToDefaults(): CybershieldStore {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_STORE));
  } catch (err) {
    console.error('Failed to reset store', err);
  }
  return DEFAULT_STORE;
}

export function exportStoreAsJson(store: CybershieldStore): void {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(store, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', `cybershield-security-backup-${new Date().toISOString().slice(0, 10)}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}
