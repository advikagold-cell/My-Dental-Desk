import React, { useState } from 'react';
import {
  Menu,
  ArrowLeft,
  RotateCw,
  Bell,
  MoreVertical,
  Calendar,
  CheckCircle2,
  Trash2,
  Share2,
  Download,
  AlertCircle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Screen } from '../types';

interface TopAppBarProps {
  onAddPatient?: () => void;
  onAddAppointment?: () => void;
  onDeletePatient?: () => void;
}

export const TopAppBar: React.FC<TopAppBarProps> = ({
  onAddPatient,
  onAddAppointment,
  onDeletePatient,
}) => {
  const {
    currentScreen,
    setCurrentScreen,
    setIsDrawerOpen,
    isSyncing,
    triggerSync,
    showToast,
    appointments,
    patients,
    exportDeviceCalendarICS,
  } = useApp();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showOverflow, setShowOverflow] = useState(false);

  // Screen title mapping
  const getScreenTitle = (): string => {
    switch (currentScreen) {
      case 'dashboard':
        return 'DentalDesk';
      case 'patients':
        return 'Patient List';
      case 'patient_profile':
        return 'Patient Profile';
      case 'dental_chart':
        return 'Dental Chart';
      case 'appointments':
        return 'My Appointment List';
      case 'finance':
        return 'Finance';
      case 'backup':
        return 'Backup & Restore';
      case 'settings':
        return 'Settings';
      case 'subscription':
        return 'Subscription Plans';
      case 'feedback':
        return 'Send Feedback';
      default:
        return 'DentalDesk';
    }
  };

  const isDeepScreen = currentScreen === 'patient_profile' || currentScreen === 'dental_chart';

  const handleBack = () => {
    if (currentScreen === 'dental_chart') {
      setCurrentScreen('patient_profile');
    } else {
      setCurrentScreen('patients');
    }
  };

  // Compute unread notifications count (e.g. upcoming appointments today, follow-ups)
  const todayCount = appointments.filter(
    (a) => a.date === new Date().toISOString().split('T')[0] && a.status === 'scheduled'
  ).length;

  return (
    <header className="relative bg-[#1E88C7] text-white shadow-md select-none">
      {/* Top Bar content */}
      <div className="h-14 px-4 flex items-center justify-between">
        {/* Left: Hamburger or Back button */}
        <div className="flex items-center gap-3">
          {isDeepScreen ? (
            <button
              onClick={handleBack}
              className="p-2 -ml-2 rounded-full hover:bg-white/15 active:bg-white/25 transition-colors"
              aria-label="Back"
            >
              <ArrowLeft size={22} />
            </button>
          ) : (
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="p-2 -ml-2 rounded-full hover:bg-white/15 active:bg-white/25 transition-colors"
              aria-label="Open menu drawer"
            >
              <Menu size={22} />
            </button>
          )}

          {/* Title or App Wordmark */}
          <div className="flex items-center gap-2">
            {currentScreen === 'dashboard' && (
              <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center font-bold text-sm text-white shadow-xs border border-white/20">
                D
              </div>
            )}
            <h1 className="text-lg font-bold tracking-tight truncate max-w-[190px] sm:max-w-xs">
              {getScreenTitle()}
            </h1>
          </div>
        </div>

        {/* Right action icons: Notifications, Sync, Overflow */}
        <div className="flex items-center gap-1">
          {/* If Patient Profile, show quick delete icon in header per spec */}
          {currentScreen === 'patient_profile' && onDeletePatient && (
            <button
              onClick={onDeletePatient}
              className="p-2 rounded-full hover:bg-red-500/20 active:bg-red-500/30 text-white/90 hover:text-white transition-colors"
              title="Delete Patient"
            >
              <Trash2 size={20} />
            </button>
          )}

          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-full hover:bg-white/15 active:bg-white/25 transition-colors relative"
              aria-label="Notifications"
            >
              <Bell size={20} />
              {todayCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[#9B59D0] border-2 border-[#1E88C7] rounded-full" />
              )}
            </button>

            {/* Notification Popover Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-xl text-[#2B2D33] p-3 z-50 border border-gray-100 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-2 border-b border-gray-100 mb-2">
                  <span className="font-bold text-sm text-[#2B2D33]">Practice Alerts</span>
                  <span className="text-[11px] font-semibold text-[#1E88C7] bg-[#1E88C7]/10 px-2 py-0.5 rounded-full">
                    {todayCount} today
                  </span>
                </div>
                <div className="space-y-2 max-h-64 overflow-y-auto text-xs">
                  {appointments
                    .filter((a) => a.date === new Date().toISOString().split('T')[0])
                    .map((a) => (
                      <div key={a.id} className="p-2.5 rounded-xl bg-blue-50/70 border border-blue-100 flex items-start gap-2.5">
                        <Calendar size={16} className="text-[#1E88C7] mt-0.5 shrink-0" />
                        <div className="flex-1">
                          <p className="font-bold text-gray-900">{a.patientName}</p>
                          <p className="text-gray-600">{a.reason} • {a.startTime}</p>
                        </div>
                      </div>
                    ))}
                  <div className="p-2.5 rounded-xl bg-purple-50/70 border border-purple-100 flex items-start gap-2.5">
                    <AlertCircle size={16} className="text-[#9B59D0] mt-0.5 shrink-0" />
                    <div className="flex-1">
                      <p className="font-bold text-gray-900">Weekly Backup Scheduled</p>
                      <p className="text-gray-600">Local database auto-backup runs on schedule</p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="w-full mt-2 py-1.5 text-center text-xs font-semibold text-[#1E88C7] hover:bg-gray-50 rounded-lg"
                >
                  Dismiss
                </button>
              </div>
            )}
          </div>

          {/* Sync / Refresh Icon */}
          <button
            onClick={triggerSync}
            disabled={isSyncing}
            className="p-2 rounded-full hover:bg-white/15 active:bg-white/25 transition-colors disabled:opacity-75"
            aria-label="Sync data"
            title="Manual Sync / Refresh"
          >
            <RotateCw size={20} className={`${isSyncing ? 'animate-spin' : ''}`} />
          </button>

          {/* Overflow Menu (⋮) on list screens */}
          {(currentScreen === 'patients' || currentScreen === 'appointments') && (
            <div className="relative">
              <button
                onClick={() => setShowOverflow(!showOverflow)}
                className="p-2 rounded-full hover:bg-white/15 active:bg-white/25 transition-colors"
                aria-label="More options"
              >
                <MoreVertical size={20} />
              </button>

              {showOverflow && (
                <div className="absolute right-0 top-12 w-48 bg-white rounded-xl shadow-xl text-[#2B2D33] py-1.5 z-50 border border-gray-100 text-xs font-medium animate-in fade-in zoom-in-95 duration-150">
                  {currentScreen === 'appointments' && (
                    <button
                      onClick={() => {
                        setShowOverflow(false);
                        exportDeviceCalendarICS();
                      }}
                      className="w-full text-left px-4 py-2.5 hover:bg-gray-100 flex items-center gap-2 text-gray-700"
                    >
                      <Download size={14} className="text-[#1E88C7]" />
                      Sync All to Calendar (.ics)
                    </button>
                  )}
                  {currentScreen === 'patients' && onAddPatient && (
                    <button
                      onClick={() => {
                        setShowOverflow(false);
                        onAddPatient();
                      }}
                      className="w-full text-left px-4 py-2.5 hover:bg-gray-100 flex items-center gap-2 text-gray-700"
                    >
                      <CheckCircle2 size={14} className="text-[#1E8E5A]" />
                      Add New Patient
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setShowOverflow(false);
                      triggerSync();
                    }}
                    className="w-full text-left px-4 py-2.5 hover:bg-gray-100 flex items-center gap-2 text-gray-700"
                  >
                    <RotateCw size={14} className="text-[#1E88C7]" />
                    Force Resync
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
