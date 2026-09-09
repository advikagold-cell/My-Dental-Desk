import React, { useState } from 'react';
import {
  CloudUpload,
  Download,
  Folder,
  FolderDown,
  History,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  Loader2,
  X,
  FileCheck,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const BackupScreen: React.FC = () => {
  const { settings, updateSettings, backups, createBackup, restoreBackup, showToast } = useApp();
  const [showFrequencyDropdown, setShowFrequencyDropdown] = useState(false);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  const frequencies = ['Off', 'Daily', 'Weekly', 'Monthly'] as const;

  const handleSelectFrequency = (freq: (typeof frequencies)[number]) => {
    updateSettings({ autoBackupFrequency: freq });
    setShowFrequencyDropdown(false);
    showToast(`Automatic clinical backup frequency set to ${freq}`, 'success');
  };

  const handleTriggerBackup = () => {
    setIsProcessing('backup');
    setTimeout(() => {
      createBackup();
      setIsProcessing(null);
    }, 750);
  };

  const handleTriggerRestore = () => {
    setIsProcessing('restore');
    setTimeout(() => {
      restoreBackup();
      setIsProcessing(null);
    }, 850);
  };

  return (
    <div className="p-4 pb-24 space-y-4 max-w-4xl mx-auto w-full">
      {/* 1. Auto Backup Frequency Dropdown (Teal Pill Button) */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-[#767B87] block">Auto Backup:</label>
        <div className="relative">
          <button
            onClick={() => setShowFrequencyDropdown(!showFrequencyDropdown)}
            className="w-full py-3 px-4 rounded-xl bg-[#1E88C7] text-white text-sm font-bold flex items-center justify-between shadow-xs hover:bg-[#186ea3] transition-all"
          >
            <span>{settings.autoBackupFrequency}</span>
            <ChevronDown size={18} />
          </button>

          {showFrequencyDropdown && (
            <div className="absolute left-0 right-0 top-13 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-20 text-xs font-semibold text-[#2B2D33] animate-in fade-in zoom-in-95 duration-150">
              {frequencies.map((freq) => (
                <button
                  key={freq}
                  onClick={() => handleSelectFrequency(freq)}
                  className={`w-full text-left px-4 py-2.5 hover:bg-blue-50 flex items-center justify-between ${
                    settings.autoBackupFrequency === freq ? 'text-[#1E88C7] font-bold' : ''
                  }`}
                >
                  <span>{freq}</span>
                  {settings.autoBackupFrequency === freq && <CheckCircle2 size={14} />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 2. Status Info Card */}
      <div className="bg-white rounded-2xl p-5 shadow-2xs border border-gray-100 space-y-3.5">
        {/* Last Auto Backup */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
          <span className="font-semibold text-[#767B87]">Last Auto Backup:</span>
          <span className="font-bold text-[#2B2D33]">{settings.lastBackupDate}</span>
        </div>

        {/* Last Restored */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs pt-2 border-t border-gray-100">
          <span className="font-semibold text-[#767B87]">Last Restored :</span>
          <span className="font-bold text-[#2B2D33]">{settings.lastRestoreDate}</span>
        </div>

        {/* Next Auto Backup */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs pt-2 border-t border-gray-100">
          <span className="font-semibold text-[#767B87]">Next Auto Backup :</span>
          <span className="font-bold text-[#2B2D33]">{settings.nextScheduledBackup}</span>
        </div>
      </div>

      {/* 3. Two Side-by-Side Action Buttons */}
      <div className="grid grid-cols-2 gap-3 pt-1">
        {/* Create Backup Button (Purple, folder-download icon) */}
        <button
          onClick={handleTriggerBackup}
          disabled={isProcessing !== null}
          className="py-4 px-3 rounded-2xl bg-[#9B59D0] text-white hover:bg-[#8847bd] active:scale-98 disabled:opacity-75 flex flex-col items-center justify-center gap-2 text-center shadow-md transition-all"
        >
          {isProcessing === 'backup' ? (
            <Loader2 size={24} className="animate-spin" />
          ) : (
            <div className="w-12 h-12 rounded-full bg-white text-[#9B59D0] flex items-center justify-center shadow-xs">
              <FolderDown size={24} />
            </div>
          )}
          <span className="text-xs font-extrabold leading-tight">Create Backup</span>
        </button>

        {/* Restore Backup Button (Teal, folder icon) */}
        <button
          onClick={handleTriggerRestore}
          disabled={isProcessing !== null}
          className="py-4 px-3 rounded-2xl bg-[#1E88C7] text-white hover:bg-[#186ea3] active:scale-98 disabled:opacity-75 flex flex-col items-center justify-center gap-2 text-center shadow-md transition-all"
        >
          {isProcessing === 'restore' ? (
            <Loader2 size={24} className="animate-spin" />
          ) : (
            <div className="w-12 h-12 rounded-full bg-white text-[#1E88C7] flex items-center justify-center shadow-xs">
              <Folder size={24} />
            </div>
          )}
          <span className="text-xs font-extrabold leading-tight">Restore Backup</span>
        </button>
      </div>

      {/* 4. Full-width Button Below: View Backup History */}
      <div className="pt-2">
        <button
          onClick={() => setShowHistoryModal(true)}
          className="w-full py-3.5 px-4 rounded-2xl bg-[#9B59D0] text-white hover:bg-[#8847bd] active:scale-98 text-xs font-extrabold shadow-sm flex items-center justify-center gap-2 transition-all"
        >
          <History size={16} />
          <span>View Backup History</span>
        </button>
      </div>

      {/* Backup History Modal */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setShowHistoryModal(false)}
          />

          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl p-5 z-10 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <FileCheck size={20} className="text-[#9B59D0]" />
                <h3 className="font-extrabold text-base text-[#2B2D33]">Backup Archives Log</h3>
              </div>
              <button
                onClick={() => setShowHistoryModal(false)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="py-4 space-y-2.5 max-h-[60vh] overflow-y-auto">
              {backups.map((log) => (
                <div
                  key={log.id}
                  className="p-3 rounded-xl bg-[#F5F6F8] flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#2B2D33]">{log.timestamp}</span>
                      <span className="px-2 py-0.2 rounded-full text-[10px] font-bold uppercase bg-purple-100 text-[#9B59D0]">
                        {log.type}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#767B87] mt-0.5">
                      {log.recordCount} clinical records • {log.size}
                    </p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-800">
                    Verified
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => setShowHistoryModal(false)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-xs font-bold text-gray-700 rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
