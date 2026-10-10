export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'security' | 'task' | 'sos' | 'sync' | 'compliance' | 'vault';
}

class NotificationService {
  private listeners: ((notifications: AppNotification[]) => void)[] = [];
  private items: AppNotification[] = [
    {
      id: 'notif-1',
      title: 'TLS Certificate Renewal Window',
      message: 'Let’s Encrypt RSA 4096 bundle has 82 days remaining. Auto-renewal verified.',
      timestamp: '10m ago',
      read: false,
      type: 'security',
    },
    {
      id: 'notif-2',
      title: 'Scheduled ISO/IEC-27001 Audit',
      message: 'Daemon signature valid. Local sandbox confirmed zero 3rd-party trackers.',
      timestamp: '35m ago',
      read: false,
      type: 'compliance',
    },
    {
      id: 'notif-3',
      title: 'Cryptographic Vault Snapshot Synced',
      message: 'Active DNS records and proxy configs backed up securely to persistent storage.',
      timestamp: '2h ago',
      read: true,
      type: 'vault',
    },
  ];

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const stored = localStorage.getItem('cybershield_notifications');
      if (stored) {
        this.items = JSON.parse(stored);
      }
    } catch {
      // Local storage fallback
    }
  }

  private saveToStorage() {
    try {
      localStorage.setItem('cybershield_notifications', JSON.stringify(this.items));
      this.notifyListeners();
    } catch {
      // ignore
    }
  }

  private notifyListeners() {
    this.listeners.forEach((fn) => fn([...this.items]));
  }

  subscribe(listener: (notifications: AppNotification[]) => void) {
    this.listeners.push(listener);
    listener([...this.items]);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  getNotifications(): AppNotification[] {
    return [...this.items];
  }

  markAllAsRead() {
    this.items = this.items.map((i) => ({ ...i, read: true }));
    this.saveToStorage();
  }

  markAsRead(id: string) {
    this.items = this.items.map((i) => (i.id === id ? { ...i, read: true } : i));
    this.saveToStorage();
  }

  clearAll() {
    this.items = [];
    this.saveToStorage();
  }

  async requestPermission(): Promise<NotificationPermission> {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      const perm = await Notification.requestPermission();
      return perm;
    }
    return 'denied';
  }

  async send(title: string, message: string, type: AppNotification['type'] = 'task') {
    const newItem: AppNotification = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      title,
      message,
      timestamp: 'Just now',
      read: false,
      type,
    };

    this.items = [newItem, ...this.items];
    this.saveToStorage();

    // Native browser push notifications are disabled per user preference
    // Only in-app notifications are stored if enabled
  }
}

export const notificationService = new NotificationService();
