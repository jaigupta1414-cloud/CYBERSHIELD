# CyberShield: Mission-Critical Security Operations & Incident Response Center

CyberShield is an enterprise-grade Security Operations Center (SOC), Threat Intelligence, and Domain Management platform. It delivers real-time incident triage, automated remediation workflows, regulatory compliance tracking, and bio-defense scientific intelligence in a responsive, accessible interface designed for both seasoned security analysts and non-technical stakeholders.

---

## 🌟 Key Subsystems & Features

### 1. Incident Response & Threat Intelligence (`Incident #87795`)
* **Incident Header & Identifiers**: Visual badges (`Informational`, `Escalated`, `v1 of 1`, `L3`), tenant tracking (`WC-ACME-INC-263223`), and one-tap incident number copying.
* **Plain-Language Incident Translation**: Automatic translation of complex telemetry into clear, jargon-free explanations (e.g., *"‘Gracing’ malware was prevented — the threat was stopped before any files could be damaged or stolen"*).
* **Report Sections**:
  * **Summary**: Executive overview of malware containment and heuristic triggers.
  * **Full Report**: Technical security engineering log with SHA-256 hashes, host vectors, and quarantine status.
  * **Decisions**: SOC triage logs, automated firewall blacklisting, and compliance directives.
  * **Timeline**: Interactive chronological slide-up sheet with expandable nodes, triage levels (`High triage`, `Medium triage`, `Resolved`), and granular event details.
* **Report Downloads**: Generate and export reports in **PDF** or **DOCX** format.
* **Incident AI Q&A**: One-click *"Ask about this incident"* button that opens the AI assistant with pre-loaded context.

---

### 2. Network & Domain Infrastructure (`DNS / SSL`)
* **Active DNS Zone Management**: Add, update, and remove `A`, `CNAME`, `TXT`, `AAAA`, and `MX` records with propagation timers.
* **Real-time DNS & SSL Health Checks**: Visual checks for TLS 1.3 encryption, proxy shielding, and DNSSEC validation.
* **Search & Filters**: Instant record filtering by hostname, record type, or propagation status.

---

### 3. Legal & Regulatory Compliance
* **Standard Audits**: Real-time status trackers for **ISO-27001**, **GDPR**, **SOC 2 Type II**, and **HIPAA**.
* **Audit Trail & Evidence**: Logged compliance milestones, risk matrices, and cryptographic verification logs.

---

### 4. Cryptographic Vault & Disaster Recovery
* **Secure Vault Storage**: Local-first encrypted key-value vault with safe rollback protection and Firebase Firestore synchronization.
* **Offline Resilience**: Full functionality in low-connectivity or offline scenarios using `localStorage` caching.
* **Disaster Recovery**: Export and import complete snapshots of DNS records, reverse proxy bindings, and operator credentials.

---

### 5. Emergency SOS & Distress Beacon
* **Live GPS Tracking**: Real-time browser geolocation tracking with latitude, longitude, altitude, and heading telemetry.
* **5-Second Countdown Beacon**: Emergency activation mechanism with siren audio built on the Web Audio API.
* **Emergency Dispatch**: Automated contact priority notifications and pre-formatted SOS distress dispatches.

---

### 6. Recharts Threat Mitigation Visualization
* **Dynamic Timeframe Telemetry**: Interactive 7-Day and 30-Day trend graphs comparing threats mitigated against heuristic repulsion rate.
* **Detailed Hover Tooltips**: Real-time breakdown of neutralized exploits, quarantined payloads, and active SOC defense score.
* **Summary Performance Badges**: Fast-glance indices for current block rates and total neutralized vectors.

---

## 🎨 Accessibility & Theme Support

* **Tactical Dark Mode & Clean Light Mode**: Bulletproof dual-theme engine synchronized across `<html>`, `<body>`, `data-theme`, and `localStorage`.
* **High Contrast Mode**: One-click high-contrast mode for visibility in high-glare environments.
* **Tactical Sound Engine**: Synthesizer audio feedback for tactical alerts, button clicks, and warnings generated via Web Audio API.

---

## 🛠️ Tech Stack & Architecture

* **Framework**: React 19 (TypeScript)
* **Data Visualization**: Recharts (Responsive Area and Line charts)
* **Bundler & Tooling**: Vite 6, Tailwind CSS v4
* **Icons**: Lucide React
* **Tactical Audio**: Web Audio API
* **Cloud Sync & Persistence**: Firebase Firestore (`ai-studio-cybershield-*`), Google Authentication

---

## 🚀 Getting Started

### Prerequisites
* Node.js (v18 or higher recommended)
* npm or pnpm

### Installation & Development
```bash
# Install dependencies
npm install

# Start local development server (runs on port 3000)
npm run dev

# Run linter and type-checker
npm run lint

# Build production bundle
npm run build
```

---

## 🔒 Security & Privacy

* **Offline-First Resilience**: All configurations and state persist securely in browser storage.
* **Client-Side Privacy**: Synthesizer audio and interactive visual telemetry process directly on-device.
* **Encrypted Storage**: Critical node configurations can be locked behind clearance credentials in the Vault.
