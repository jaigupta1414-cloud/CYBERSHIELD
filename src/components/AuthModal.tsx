import React, { useState } from 'react';
import { 
  User, 
  ShieldCheck, 
  X, 
  Check, 
  Mail, 
  Building2 
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
  const [name, setName] = useState(operator.callsign || 'Security Analyst');
  const [role, setRole] = useState(operator.role || 'Security Analyst');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const updated: OperatorProfile = {
      ...operator,
      callsign: name.trim(),
      role: role.trim(),
      lastActive: 'Just now',
    };

    setOperator(updated);
    setSavedSuccess(true);
    sound.playSuccess();
    notificationService.send('Profile Updated', `Profile saved for ${updated.callsign}.`);

    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 font-sans animate-fadeIn">
      <div 
        className="bg-white dark:bg-[#0e141f] border border-slate-200 dark:border-slate-800 rounded-2xl max-w-sm w-full p-5 sm:p-6 shadow-2xl text-xs relative"
        role="dialog"
        aria-modal="true"
        aria-label="User Profile"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-cyan-600 text-white flex items-center justify-center shadow-xs shrink-0">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              User Profile
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Your name and role on this device
            </p>
          </div>
        </div>

        {savedSuccess && (
          <div className="mb-4 p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 flex items-center gap-2 text-xs font-semibold">
            <Check className="w-4 h-4 shrink-0" />
            <span>Profile saved successfully!</span>
          </div>
        )}

        {/* Simple 2-field form */}
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Your Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Alex Morgan"
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-medium text-xs focus:ring-2 focus:ring-cyan-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Your Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs focus:ring-2 focus:ring-cyan-500 focus:outline-none cursor-pointer"
            >
              <option value="Security Analyst">Security Analyst</option>
              <option value="IT Administrator">IT Administrator</option>
              <option value="Incident Commander">Incident Commander</option>
              <option value="Team Member">Team Member</option>
            </select>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition font-semibold text-xs cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs transition shadow-xs cursor-pointer"
            >
              Save Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
