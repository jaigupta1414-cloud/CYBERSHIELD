export type SubsystemTab = 
  | 'overview' 
  | 'incident'
  | 'vault' 
  | 'network' 
  | 'compliance' 
  | 'emergency';

export interface IncidentTimelineItem {
  id: string;
  timestamp: string;
  title: string;
  plainMeaning: string;
  triageLevel: 'High triage' | 'Medium triage' | 'Low triage' | 'Resolved';
  details?: string;
}

export interface SecurityIncident {
  id: string;
  tenantCode: string;
  title: string;
  statusBadge: 'Informational' | 'Escalated' | 'Resolved';
  version: string;
  severityTier: 'L1' | 'L2' | 'L3';
  alertProduct: string;
  classification: string;
  aiConfidence: 'High' | 'Medium' | 'Low';
  opened: string;
  closed: string;
  issued: string;
  summary: string;
  fullReport: string;
  decisions: string;
  timeline: IncidentTimelineItem[];
}

export interface DnsRecord {
  id: string;
  type: 'CNAME' | 'A' | 'TXT' | 'AAAA' | 'MX';
  host: string;
  ttl: string;
  targetValue: string;
  status: 'PROPAGATED' | 'PENDING' | 'UPDATING';
}

export interface OperatorProfile {
  id: string;
  callsign: string;
  badgeNumber: string;
  clearanceLevel: number; // 1 to 5
  role: string;
  station: string;
  lastActive: string;
  authToken: string;
}

export interface ProjectMilestone {
  id: string;
  title: string;
  subsystem: string;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'SCHEDULED' | 'BLOCKED';
  progress: number;
  deadline: string;
  lead: string;
  notes: string;
}

export interface TaskReminder {
  id: string;
  title: string;
  dueTime: string;
  priority: 'CRITICAL' | 'HIGH' | 'ROUTINE';
  notified: boolean;
  category: 'NETWORK' | 'COMPLIANCE' | 'BIO-DEFENSE' | 'CLUSTER';
}

export interface EmergencyContact {
  id: string;
  name: string;
  role: string;
  phone: string;
  priority: number;
}

export interface GeoLocationState {
  latitude: number | null;
  longitude: number | null;
  accuracy: number | null;
  altitude: number | null;
  heading: number | null;
  speed: number | null;
  timestamp: number | null;
  error: string | null;
  trackingActive: boolean;
}

export interface ScienceQueryTarget {
  id: string;
  name: string;
  type: 'PROTEIN' | 'CHEMICAL' | 'PATHOGEN';
  identifier: string; // PDB ID, UniProt ID, PubChem CID
  description: string;
  classification: string;
  riskTier: 'BSL-1' | 'BSL-2' | 'BSL-3' | 'BSL-4' | 'BENIGN';
  formula?: string;
  mw?: number;
  plddtAvg?: number;
  provenance: string;
}

export interface SyncStatus {
  isOnline: boolean;
  lastSynced: string;
  syncCycleSeconds: number;
  pendingChanges: number;
  clusterTarget: string;
  safeRollbackActive: boolean;
}
