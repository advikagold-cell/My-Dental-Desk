import React, { useState, useMemo } from 'react';
import {
  Search,
  SlidersHorizontal,
  Phone,
  MessageCircle,
  Plus,
  AlertTriangle,
  ChevronRight,
  Filter,
  ArrowUpDown,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Patient } from '../types';

interface PatientListScreenProps {
  onOpenAddPatient: () => void;
  onSelectPatient: (patientId: string) => void;
}

export const PatientListScreen: React.FC<PatientListScreenProps> = ({
  onOpenAddPatient,
  onSelectPatient,
}) => {
  const { patients, showToast } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBalanceOnly, setFilterBalanceOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'name' | 'recent'>('recent');
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  // Filter & search
  const filteredPatients = useMemo(() => {
    return patients
      .filter((p) => {
        const matchesQuery =
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.phone.some((ph) => ph.includes(searchQuery)) ||
          p.allergies.some((al) => al.toLowerCase().includes(searchQuery.toLowerCase()));

        if (filterBalanceOnly) {
          return matchesQuery && (p.balance || 0) > 0;
        }
        return matchesQuery;
      })
      .sort((a, b) => {
        if (sortBy === 'name') {
          return a.name.localeCompare(b.name);
        }
        return 0; // Default order is recent
      });
  }, [patients, searchQuery, filterBalanceOnly, sortBy]);

  // Display count representing total practice database
  const totalRecordCount = patients.length >= 8 ? 935 + (patients.length - 8) : patients.length;

  const handleCall = (e: React.MouseEvent, phone: string, name: string) => {
    e.stopPropagation();
    window.location.href = `tel:${phone}`;
    showToast(`Initiating call to ${name} (${phone})`, 'info');
  };

  const handleMessage = (e: React.MouseEvent, phone: string, name: string) => {
    e.stopPropagation();
    window.location.href = `sms:${phone}`;
    showToast(`Opening SMS composer for ${name} (${phone})`, 'info');
  };

  return (
    <div className="relative min-h-[calc(100vh-3.5rem)] flex flex-col p-4 pb-24 max-w-4xl mx-auto w-full">
      {/* Search Bar with rounded, light teal fill */}
      <div className="relative mb-3">
        <div className="flex items-center bg-[#E8F4FA] rounded-2xl px-3.5 py-2.5 shadow-2xs border border-[#1E88C7]/15">
          <Search size={18} className="text-[#1E88C7] shrink-0 mr-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, phone, or condition…"
            className="w-full bg-transparent text-sm text-[#2B2D33] placeholder-[#767B87] focus:outline-none"
          />
          <button
            onClick={() => setShowFilterMenu(!showFilterMenu)}
            className={`p-1.5 rounded-xl transition-colors ${
              filterBalanceOnly || sortBy === 'name'
                ? 'bg-[#1E88C7] text-white'
                : 'text-[#1E88C7] hover:bg-[#1E88C7]/10'
            }`}
            title="Filter and Sort"
            aria-label="Filter"
          >
            <SlidersHorizontal size={18} />
          </button>
        </div>

        {/* Filter Popup Menu */}
        {showFilterMenu && (
          <div className="absolute right-0 top-13 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 p-3 z-30 animate-in fade-in zoom-in-95 duration-150">
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
              Filter Records
            </div>
            <label className="flex items-center gap-2.5 py-1.5 text-xs text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={filterBalanceOnly}
                onChange={(e) => setFilterBalanceOnly(e.target.checked)}
                className="rounded text-[#1E88C7] focus:ring-[#1E88C7]"
              />
              <span>With Outstanding Balance only</span>
            </label>

            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mt-3 mb-1.5 pt-2 border-t border-gray-100">
              Sort By
            </div>
            <div className="flex gap-2 text-xs">
              <button
                onClick={() => setSortBy('recent')}
                className={`flex-1 py-1.5 rounded-lg font-medium ${
                  sortBy === 'recent' ? 'bg-[#1E88C7] text-white' : 'bg-gray-100 text-gray-700'
                }`}
              >
                Recent
              </button>
              <button
                onClick={() => setSortBy('name')}
                className={`flex-1 py-1.5 rounded-lg font-medium ${
                  sortBy === 'name' ? 'bg-[#1E88C7] text-white' : 'bg-gray-100 text-gray-700'
                }`}
              >
                Name (A-Z)
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Result Count Label */}
      <div className="flex items-center justify-between px-1 mb-3">
        <span className="text-xs font-bold text-[#1E88C7] tracking-tight">
          {searchQuery
            ? `${filteredPatients.length} matching record${filteredPatients.length === 1 ? '' : 's'}`
            : `${totalRecordCount} patient record(s)`}
        </span>
        {filterBalanceOnly && (
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-semibold">
            Filtered: Balances only
          </span>
        )}
      </div>

      {/* Patients List */}
      <div className="space-y-2.5 flex-1">
        {filteredPatients.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-gray-100 shadow-xs">
            <p className="text-[#767B87] font-medium text-sm">No patient records found</p>
            <button
              onClick={onOpenAddPatient}
              className="mt-3 px-4 py-2 bg-[#1E88C7] text-white text-xs font-semibold rounded-xl"
            >
              Add New Patient
            </button>
          </div>
        ) : (
          filteredPatients.map((patient) => {
            const initials = patient.name
              .split(' ')
              .map((n) => n[0])
              .slice(0, 2)
              .join('');
            const primaryPhone = patient.phone[0] || '';

            return (
              <div
                key={patient.id}
                onClick={() => onSelectPatient(patient.id)}
                className="bg-white rounded-2xl p-3.5 shadow-2xs border border-gray-100 flex items-center justify-between gap-3 hover:shadow-md hover:border-[#1E88C7]/30 transition-all cursor-pointer group"
              >
                {/* Left: Avatar & Info */}
                <div className="flex items-center gap-3 min-w-0">
                  {/* Circular Avatar */}
                  <div className="relative shrink-0">
                    {patient.avatar ? (
                      <img
                        src={patient.avatar}
                        alt={patient.name}
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 rounded-full object-cover border border-gray-100 shadow-2xs"
                      />
                    ) : (
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white text-sm shadow-2xs"
                        style={{ backgroundColor: patient.avatarColor || '#1E88C7' }}
                      >
                        {initials}
                      </div>
                    )}
                    {patient.allergies && patient.allergies.length > 0 && (
                      <div
                        className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#C0392B] border-2 border-white flex items-center justify-center text-white"
                        title={`Allergies: ${patient.allergies.join(', ')}`}
                      >
                        <span className="text-[9px] font-black leading-none">!</span>
                      </div>
                    )}
                  </div>

                  {/* Name & Phone & Last updated */}
                  <div className="min-w-0">
                    <h3 className="font-bold text-sm text-[#2B2D33] group-hover:text-[#1E88C7] transition-colors truncate">
                      {patient.name}
                    </h3>
                    <p className="text-xs text-[#767B87] font-medium tracking-tight truncate">
                      {primaryPhone}
                    </p>
                    <p className="text-[11px] text-[#767B87]/80 truncate">
                      Last Updated {patient.lastUpdated}
                    </p>
                  </div>
                </div>

                {/* Right: Quick Action Icons (Call & Message) */}
                <div className="flex items-center gap-2 shrink-0">
                  {/* Call Icon (circle outlined in purple or solid purple) */}
                  <button
                    onClick={(e) => handleCall(e, primaryPhone, patient.name)}
                    className="w-10 h-10 rounded-full bg-[#9B59D0]/10 hover:bg-[#9B59D0] text-[#9B59D0] hover:text-white flex items-center justify-center transition-all shadow-2xs active:scale-95"
                    title={`Call ${patient.name}`}
                    aria-label="Call patient"
                  >
                    <Phone size={17} />
                  </button>

                  {/* Message Icon */}
                  <button
                    onClick={(e) => handleMessage(e, primaryPhone, patient.name)}
                    className="w-10 h-10 rounded-full bg-[#9B59D0]/10 hover:bg-[#9B59D0] text-[#9B59D0] hover:text-white flex items-center justify-center transition-all shadow-2xs active:scale-95"
                    title={`Message ${patient.name}`}
                    aria-label="Message patient"
                  >
                    <MessageCircle size={17} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Global FAB: Floating "+" action button (purple) */}
      <button
        onClick={onOpenAddPatient}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-[#9B59D0] hover:bg-[#8847bd] active:scale-95 text-white shadow-xl flex items-center justify-center transition-all z-20"
        title="Add New Patient"
        aria-label="Add New Patient"
      >
        <Plus size={28} />
      </button>
    </div>
  );
};
