import React from 'react';
import {
  LayoutDashboard,
  Users,
  Calendar,
  DollarSign,
  CloudUpload,
  Settings,
  CreditCard,
  MessageSquare,
  X,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Screen } from '../types';

interface NavigationDrawerProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const NavigationDrawer: React.FC<NavigationDrawerProps> = ({ isOpen, onClose }) => {
  const { isDrawerOpen: contextOpen, setIsDrawerOpen, currentScreen, setCurrentScreen, settings } = useApp();

  const isVisible = isOpen !== undefined ? isOpen : contextOpen;
  const handleClose = onClose || (() => setIsDrawerOpen(false));

  if (!isVisible) return null;

  const navItems: { id: Screen; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: 'patients', label: 'Patients', icon: <Users size={20} /> },
    { id: 'appointments', label: 'Appointments', icon: <Calendar size={20} /> },
    { id: 'finance', label: 'Finance', icon: <DollarSign size={20} /> },
    { id: 'backup', label: 'Backup & Restore', icon: <CloudUpload size={20} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={20} /> },
    { id: 'subscription', label: 'Subscription', icon: <CreditCard size={20} />, badge: 'PRO' },
    { id: 'feedback', label: 'Send Feedback', icon: <MessageSquare size={20} /> },
  ];

  const handleSelect = (id: Screen) => {
    setCurrentScreen(id);
    handleClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
        onClick={handleClose}
      />

      {/* Drawer panel */}
      <div className="relative w-80 max-w-[85vw] bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-200">
        {/* Drawer Header with Brand Logo and Practitioner Info */}
        <div className="bg-gradient-to-br from-[#1E88C7] to-[#156ea3] p-5 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              {/* Original D Monogram Logo in soft circular badge */}
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-inner">
                <span className="font-extrabold text-2xl tracking-tighter text-white">D</span>
              </div>
              <div>
                <h2 className="text-xl font-bold tracking-tight leading-tight">DentalDesk</h2>
                <p className="text-xs text-white/80 font-medium italic">"Run your practice, chairside."</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-1.5 rounded-full hover:bg-white/20 text-white/90 transition-colors"
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
          </div>

          <div className="pt-2 border-t border-white/20 flex items-center justify-between text-xs text-white/90">
            <div>
              <p className="font-semibold text-sm">{settings.dentistName}</p>
              <p className="text-white/75">{settings.clinicName}</p>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-[#1E8E5A] text-[10px] font-bold tracking-wider uppercase flex items-center gap-1 text-white shadow-xs">
              <ShieldCheck size={12} />
              Active
            </span>
          </div>
        </div>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto py-3 px-3 space-y-1">
          {navItems.map((item) => {
            const isActive = currentScreen === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-[#1E88C7]/12 text-[#1E88C7] font-bold shadow-xs'
                    : 'text-[#2B2D33] hover:bg-gray-100/80 hover:text-[#1E88C7]'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <span className={isActive ? 'text-[#1E88C7]' : 'text-[#767B87]'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-[#9B59D0] text-white rounded-full">
                    {item.badge}
                  </span>
                )}
                {!item.badge && isActive && (
                  <div className="w-1.5 h-4 rounded-full bg-[#1E88C7]" />
                )}
              </button>
            );
          })}
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-gray-100 bg-[#F5F6F8]/80 text-xs text-[#767B87] flex items-center justify-between">
          <div>
            <p className="font-semibold text-[#2B2D33]">DentalDesk Mobile v2.4</p>
            <p>Solo Practitioner Edition</p>
          </div>
          <button
            onClick={() => handleSelect('settings')}
            className="text-[#1E88C7] hover:underline flex items-center gap-0.5 font-medium"
          >
            Config
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
