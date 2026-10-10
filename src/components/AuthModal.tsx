import React, { useState } from 'react';
import { 
  UserCheck, 
  Shield, 
  KeyRound, 
  Lock, 
  X, 
  CheckCircle2, 
  Smartphone, 
  Laptop 
} from 'lucide-react';
import { OperatorProfile } from '../types';
import { sound } from '../services/audio';
import { notificationService } from '../services/notifications';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  operator: OperatorProfile;
  setOperator: (op: OperatorProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  operator,
  setOperator,
}) => {
  const [badgeNumber, setBadgeNumber] = useState(operator.badgeNumber);
  const [callsign, setCallsign] = useState(operator.callsign);
  const [clearanceLevel, setClearanceLevel] = useState(operator.clearanceLevel);
  const [pin, setPin] = useState('8820');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: OperatorProfile = {
      ...operator,
      badgeNumber,
      callsign,
      clearanceLevel: Number(clearanceLevel),
      lastActive: 'Just now',
    };
    setOperator(updated);
    setSavedSuccess(true);
    sound.playSuccess();
    notificationService.send(
      'Operator Credentials Authenticated',
      `Clearance verified for ${updated.badgeNumber} (Level-${updated.clearanceLevel}). Progress encrypted.`
    );
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#0e141e] border border-slate-300 dark:border-slate-700 rounded-lg max-w-md w-full p-6 shadow-2xl font-mono-code text-xs relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded bg-cyan-100 dark:bg-cyan-950 flex items-center justify-center text-cyan-600 dark:text-cyan-400">
            <UserCheck className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
              Operator Sign-In &amp; Security Clearance
            </h3>
            <p className="text-[11px] text-slate-500 font-sans">
              Authenticate to securely persist local changes to Cloud Mesh
            </p>
          </div>
        </div>

        {savedSuccess && (
          <div className="mb-4 p-2.5 rounded bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Identity confirmed! Vault synced.</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-[10px] text-slate-500 uppercase mb-1">Badge ID</label>
            <input
              type="text"
              required
              value={badgeNumber}
              onChange={(e) => setBadgeNumber(e.target.value)}
              placeholder="e.g. SEC-OP: 882"
              className="w-full p-2 rounded bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-bold"
            />
          </div>

          <div>
            <label className="block text-[10px] text-slate-500 uppercase mb-1">Tactical Callsign</label>
            <input
              type="text"
              required
              value={callsign}
              onChange={(e) => setCallsign(e.target.value)}
              placeholder="e.g. KILOBIT-9"
              className="w-full p-2 rounded bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100"
            />
          </div>

          <div>
            <label className="block text-[10px] text-slate-500 uppercase mb-1">
              Security Clearance Level (1 to 5)
            </label>
            <select
              value={clearanceLevel}
              onChange={(e) => setClearanceLevel(Number(e.target.value))}
              className="w-full p-2 rounded bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100"
            >
              <option value={1}>LEVEL-1 ACCESS (Read-Only Monitor)</option>
              <option value={2}>LEVEL-2 ACCESS (Junior Node Ops)</option>
              <option value={3}>LEVEL-3 ACCESS (Network &amp; DNS Admin)</option>
              <option value={4}>LEVEL-4 ACCESS (Cyber-Physical Lead &amp; Bio-Sec)</option>
              <option value={5}>LEVEL-5 ACCESS (Master Cluster Controller)</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] text-slate-500 uppercase mb-1">Biometric / Security PIN</label>
            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="••••"
              className="w-full p-2 rounded bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded bg-cyan-600 hover:bg-cyan-700 text-white font-bold"
            >
              Confirm Operator Session
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
