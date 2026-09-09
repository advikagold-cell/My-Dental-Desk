import React, { useState } from 'react';
import {
  Calendar,
  Phone,
  MessageSquare,
  FileText,
  MessageCircle,
  AlertTriangle,
  Plus,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Edit2,
  Trash2,
  Clock,
  MapPin,
  Mail,
  User,
  Activity,
  HeartPulse,
  DollarSign,
  Image as ImageIcon,
  CheckCircle,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Patient } from '../types';

interface PatientProfileScreenProps {
  patient: Patient;
  onEditPatient: (patient: Patient) => void;
  onOpenSchedule: (patient: Patient) => void;
  onOpenAddPayment: (patient: Patient) => void;
}

export const PatientProfileScreen: React.FC<PatientProfileScreenProps> = ({
  patient,
  onEditPatient,
  onOpenSchedule,
  onOpenAddPayment,
}) => {
  const {
    setCurrentScreen,
    deletePatient,
    medicalHistory,
    addMedicalHistory,
    deleteMedicalHistory,
    appointments,
    transactions,
    toothRecords,
    settings,
    showToast,
  } = useApp();

  // Accordion state
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    medical: true,
    dental: true,
    appointments: true,
    payments: false,
    photos: false,
  });

  const [showAddMedHistory, setShowAddMedHistory] = useState(false);
  const [newMedCondition, setNewMedCondition] = useState('');
  const [newMedSeverity, setNewMedSeverity] = useState<'Mild' | 'Moderate' | 'Severe'>('Mild');

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  // Calculate age from DOB
  const calculateAge = (dobString: string): number => {
    if (!dobString) return 0;
    const dob = new Date(dobString);
    const diffMs = Date.now() - dob.getTime();
    const ageDate = new Date(diffMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  const patientAge = calculateAge(patient.dob);
  const primaryPhone = patient.phone[0] || '';

  // Filtered data for this patient
  const patientMedHistory = medicalHistory.filter((m) => m.patientId === patient.id);
  const patientAppointments = appointments.filter((a) => a.patientId === patient.id);
  const patientTransactions = transactions.filter((t) => t.patientId === patient.id);
  const patientTeeth = toothRecords.filter((t) => t.patientId === patient.id);

  const handleCall = () => {
    window.location.href = `tel:${primaryPhone}`;
    showToast(`Calling ${patient.name} (${primaryPhone})`, 'info');
  };

  const handleMessage = () => {
    window.location.href = `sms:${primaryPhone}`;
    showToast(`Opening SMS composer for ${patient.name}`, 'info');
  };

  const handleWhatsApp = () => {
    const cleanNumber = primaryPhone.replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${cleanNumber}`, '_blank');
    showToast(`Opening WhatsApp chat for ${patient.name}`, 'info');
  };

  const handleExportPDF = () => {
    // Generate an instant printable summary window
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>DentalDesk Patient Report - ${patient.name}</title>
          <style>
            body { font-family: 'Helvetica Neue', Arial, sans-serif; padding: 40px; color: #2B2D33; line-height: 1.5; }
            .header { border-bottom: 3px solid #1E88C7; padding-bottom: 20px; margin-bottom: 25px; display: flex; justify-content: space-between; }
            h1 { margin: 0; color: #1E88C7; font-size: 24px; }
            .sub { color: #767B87; font-size: 14px; margin-top: 5px; }
            .alert { background: #FDE8E8; color: #C0392B; padding: 10px 15px; border-radius: 6px; font-weight: bold; margin: 15px 0; }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px; }
            .label { font-size: 12px; color: #767B87; text-transform: uppercase; font-weight: bold; }
            .value { font-size: 15px; font-weight: 500; }
            .section-title { font-size: 16px; font-weight: bold; color: #9B59D0; border-bottom: 1px solid #ddd; padding-bottom: 6px; margin-top: 25px; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th, td { padding: 8px 10px; border: 1px solid #E5E7EB; text-align: left; font-size: 13px; }
            th { background: #F9FAFB; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <h1>${settings.clinicName}</h1>
              <div class="sub">${settings.dentistName} • Official Patient Clinical Record</div>
            </div>
            <div style="text-align: right;">
              <div style="font-weight: bold;">Date: ${new Date().toLocaleDateString()}</div>
              <div class="sub">DentalDesk Clinical Export</div>
            </div>
          </div>

          <h2>${patient.name} (${patientAge} yrs)</h2>
          ${
            patient.allergies.length > 0
              ? `<div class="alert">⚠️ Allergies on file: ${patient.allergies.join(', ')}</div>`
              : ''
          }

          <div class="grid">
            <div><div class="label">Date of Birth</div><div class="value">${patient.dob}</div></div>
            <div><div class="label">Gender</div><div class="value">${patient.gender}</div></div>
            <div><div class="label">Primary Phone</div><div class="value">${primaryPhone}</div></div>
            <div><div class="label">Email Address</div><div class="value">${patient.email || 'N/A'}</div></div>
            <div><div class="label">Address</div><div class="value">${patient.address || 'N/A'}</div></div>
            <div><div class="label">Insurance</div><div class="value">${patient.insuranceProvider || 'Private / None'}</div></div>
          </div>

          <div class="section-title">Clinical Notes</div>
          <p style="background: #F9FAFB; padding: 12px; border-radius: 6px;">${patient.notes || 'No notes entered.'}</p>

          <div class="section-title">Dental Charting Summary (${patientTeeth.length} Recorded Conditions)</div>
          <table>
            <thead>
              <tr><th>Tooth #</th><th>Procedure</th><th>Status</th><th>Notes</th></tr>
            </thead>
            <tbody>
              ${patientTeeth
                .map(
                  (t) => `<tr>
                  <td>#${t.toothNumber}</td>
                  <td>${t.procedureName}</td>
                  <td>${t.status.toUpperCase()}</td>
                  <td>${t.notes || '-'}</td>
                </tr>`
                )
                .join('')}
            </tbody>
          </table>

          <div class="section-title">Medical History (${patientMedHistory.length})</div>
          <ul>
            ${patientMedHistory.map((m) => `<li><strong>${m.condition}</strong> (${m.severity}) - Noted: ${m.dateNoted}</li>`).join('')}
          </ul>
        </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
      }, 400);
    }
    showToast('Clinical report summary generated for download/print', 'success');
  };

  const handleSaveMedHistory = () => {
    if (!newMedCondition.trim()) return;
    addMedicalHistory({
      patientId: patient.id,
      condition: newMedCondition.trim(),
      severity: newMedSeverity,
      dateNoted: new Date().toISOString().split('T')[0],
    });
    setNewMedCondition('');
    setShowAddMedHistory(false);
  };

  return (
    <div className="pb-24 max-w-4xl mx-auto w-full">
      {/* 1. Header Banner (Teal gradient) */}
      <div className="relative bg-gradient-to-b from-[#1E88C7] to-[#1678b0] pt-4 pb-14 px-4 text-white text-center rounded-b-3xl shadow-sm">
        {/* Centered Circular Avatar overlapping the banner */}
        <div className="relative inline-block mt-1">
          {patient.avatar ? (
            <img
              src={patient.avatar}
              alt={patient.name}
              referrerPolicy="no-referrer"
              className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md mx-auto"
            />
          ) : (
            <div
              className="w-24 h-24 rounded-full border-4 border-white shadow-md flex items-center justify-center font-bold text-white text-2xl mx-auto"
              style={{ backgroundColor: patient.avatarColor || '#1E88C7' }}
            >
              {patient.name
                .split(' ')
                .map((n) => n[0])
                .slice(0, 2)
                .join('')}
            </div>
          )}
        </div>

        {/* Patient Name + Age */}
        <h2 className="mt-2 text-xl font-extrabold tracking-tight">
          {patient.name}, {patientAge}
        </h2>

        {/* "Edit" Pill Button */}
        <div className="mt-2">
          <button
            onClick={() => onEditPatient(patient)}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#9B59D0] text-white text-xs font-bold hover:bg-[#8847bd] active:scale-95 transition-all shadow-xs"
          >
            <Edit2 size={13} />
            <span>Edit</span>
          </button>
        </div>
      </div>

      {/* 2. Quick Action Row: 5 icons in a light card overlapping the banner */}
      <div className="px-4 -mt-7 relative z-10">
        <div className="bg-white rounded-2xl p-3 shadow-md border border-gray-100 flex items-center justify-around">
          {/* Schedule */}
          <button
            onClick={() => onOpenSchedule(patient)}
            className="flex flex-col items-center gap-1 text-center p-1 rounded-xl hover:bg-purple-50 active:scale-95 transition-all group"
            title="Schedule Appointment"
          >
            <div className="w-10 h-10 rounded-full bg-[#9B59D0] text-white flex items-center justify-center shadow-xs">
              <Calendar size={18} />
            </div>
            <span className="text-[11px] font-medium text-[#767B87] group-hover:text-[#9B59D0]">
              Schedule
            </span>
          </button>

          {/* Call */}
          <button
            onClick={handleCall}
            className="flex flex-col items-center gap-1 text-center p-1 rounded-xl hover:bg-blue-50 active:scale-95 transition-all group"
            title="Call"
          >
            <div className="w-10 h-10 rounded-full bg-[#1E88C7] text-white flex items-center justify-center shadow-xs">
              <Phone size={18} />
            </div>
            <span className="text-[11px] font-medium text-[#767B87] group-hover:text-[#1E88C7]">
              Call
            </span>
          </button>

          {/* Text / Message */}
          <button
            onClick={handleMessage}
            className="flex flex-col items-center gap-1 text-center p-1 rounded-xl hover:bg-purple-50 active:scale-95 transition-all group"
            title="SMS Message"
          >
            <div className="w-10 h-10 rounded-full bg-[#9B59D0] text-white flex items-center justify-center shadow-xs">
              <MessageSquare size={18} />
            </div>
            <span className="text-[11px] font-medium text-[#767B87] group-hover:text-[#9B59D0]">
              Text
            </span>
          </button>

          {/* Download / Export PDF */}
          <button
            onClick={handleExportPDF}
            className="flex flex-col items-center gap-1 text-center p-1 rounded-xl hover:bg-blue-50 active:scale-95 transition-all group"
            title="Export / Download PDF"
          >
            <div className="w-10 h-10 rounded-full bg-[#1E88C7] text-white flex items-center justify-center shadow-xs">
              <FileText size={18} />
            </div>
            <span className="text-[11px] font-medium text-[#767B87] group-hover:text-[#1E88C7]">
              Download
            </span>
          </button>

          {/* WhatsApp */}
          <button
            onClick={handleWhatsApp}
            className="flex flex-col items-center gap-1 text-center p-1 rounded-xl hover:bg-purple-50 active:scale-95 transition-all group"
            title="WhatsApp Chat"
          >
            <div className="w-10 h-10 rounded-full bg-[#9B59D0] text-white flex items-center justify-center shadow-xs">
              <MessageCircle size={18} />
            </div>
            <span className="text-[11px] font-medium text-[#767B87] group-hover:text-[#9B59D0]">
              WhatsApp
            </span>
          </button>
        </div>
      </div>

      {/* 3. Allergy Alert Banner if allergies are on file */}
      {patient.allergies && patient.allergies.length > 0 && (
        <div className="px-4 mt-4">
          <div className="bg-[#FDE8E8] border border-[#F8B4B4] text-[#C0392B] px-4 py-3 rounded-2xl flex items-center gap-2.5 shadow-2xs animate-in fade-in duration-200">
            <AlertTriangle size={20} className="shrink-0 text-[#C0392B]" />
            <div className="text-xs font-bold tracking-tight">
              Allergies: {patient.allergies.join(', ')}
            </div>
          </div>
        </div>
      )}

      {/* 4. Info Fields List */}
      <div className="px-4 mt-4 space-y-3">
        <div className="bg-white rounded-2xl p-4 shadow-2xs border border-gray-100 divide-y divide-gray-100 text-sm">
          {/* Email */}
          <div className="pb-3">
            <span className="text-xs text-[#767B87] font-semibold block">Email</span>
            <span className="font-medium text-[#2B2D33]">
              {patient.email || 'Not provided'}
            </span>
          </div>

          {/* Address */}
          <div className="py-3">
            <span className="text-xs text-[#767B87] font-semibold block">Address</span>
            <span className="font-medium text-[#2B2D33]">
              {patient.address || 'Not provided'}
            </span>
          </div>

          {/* Contact Number & Gender (2-column layout) */}
          <div className="py-3 grid grid-cols-2 gap-4">
            <div>
              <div className="flex items-center gap-1 text-xs text-[#767B87] font-semibold">
                <span>Contact Number</span>
                <button
                  onClick={() => onEditPatient(patient)}
                  className="text-[#1E88C7] hover:bg-blue-50 rounded-full p-0.5"
                  title="Add another phone number"
                >
                  <Plus size={14} />
                </button>
              </div>
              <span className="font-medium text-[#2B2D33] block mt-0.5">
                {patient.phone.join(', ')}
              </span>
            </div>
            <div>
              <span className="text-xs text-[#767B87] font-semibold block">Gender</span>
              <span className="font-medium text-[#2B2D33] block mt-0.5">
                {patient.gender}
              </span>
            </div>
          </div>

          {/* Birthdate & Age */}
          <div className="py-3 grid grid-cols-2 gap-4">
            <div>
              <span className="text-xs text-[#767B87] font-semibold block">Birthdate</span>
              <span className="font-medium text-[#2B2D33] block mt-0.5">
                {new Date(patient.dob).toLocaleDateString('en-US', {
                  month: 'short',
                  day: '2-digit',
                  year: 'numeric',
                })}
              </span>
            </div>
            <div>
              <span className="text-xs text-[#767B87] font-semibold block">Age</span>
              <span className="font-medium text-[#2B2D33] block mt-0.5">
                {patientAge}
              </span>
            </div>
          </div>

          {/* Note */}
          <div className="py-3">
            <span className="text-xs text-[#767B87] font-semibold block">Note</span>
            <p className="font-medium text-[#2B2D33] mt-0.5">
              {patient.notes || 'No clinical notes recorded.'}
            </p>
          </div>

          {/* Date Added */}
          <div className="pt-3">
            <span className="text-xs text-[#767B87] font-semibold block">Date Added</span>
            <span className="font-medium text-[#767B87] text-xs">
              {patient.dateAdded}
            </span>
          </div>
        </div>
      </div>

      {/* 5. Expandable Sections Below the Fold */}
      <div className="px-4 mt-4 space-y-3">
        {/* Dental Chart shortcut card */}
        <div
          onClick={() => setCurrentScreen('dental_chart')}
          className="bg-white rounded-2xl p-4 shadow-2xs border border-gray-100 hover:border-[#1E88C7]/50 transition-all flex items-center justify-between cursor-pointer group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#1E88C7]/10 text-[#1E88C7] flex items-center justify-center font-black">
              🦷
            </div>
            <div>
              <h4 className="font-bold text-sm text-[#2B2D33] group-hover:text-[#1E88C7] transition-colors">
                Dental Chart
              </h4>
              <p className="text-xs text-[#767B87]">
                {patientTeeth.length > 0
                  ? `${patientTeeth.length} tooth conditions logged`
                  : 'Interactive Adult & Pediatric Odontogram'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#1E88C7] text-white">
              Open Chart
            </span>
            <ChevronRight size={18} className="text-[#767B87]" />
          </div>
        </div>

        {/* Medical History Section */}
        <div className="bg-white rounded-2xl shadow-2xs border border-gray-100 overflow-hidden">
          <div
            onClick={() => toggleSection('medical')}
            className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50/70 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <HeartPulse size={18} className="text-[#9B59D0]" />
              <h4 className="font-bold text-sm text-[#2B2D33]">Medical History</h4>
              <span className="w-5 h-5 rounded-full bg-[#9B59D0] text-white text-[11px] font-bold flex items-center justify-center">
                {patientMedHistory.length}
              </span>
            </div>
            {openSections.medical ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </div>

          {openSections.medical && (
            <div className="px-4 pb-4 pt-1 border-t border-gray-100 space-y-2">
              {patientMedHistory.length === 0 ? (
                <p className="text-xs text-[#767B87] italic py-1">No recorded medical conditions.</p>
              ) : (
                patientMedHistory.map((entry) => (
                  <div
                    key={entry.id}
                    className="p-2.5 rounded-xl bg-[#F5F6F8] flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold text-[#2B2D33]">{entry.condition}</span>
                      {entry.medications && (
                        <p className="text-[11px] text-[#767B87]">Medication: {entry.medications}</p>
                      )}
                      <p className="text-[10px] text-[#767B87]/80">Noted on {entry.dateNoted}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          entry.severity === 'Severe'
                            ? 'bg-red-100 text-red-700'
                            : entry.severity === 'Moderate'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {entry.severity || 'Mild'}
                      </span>
                      <button
                        onClick={() => deleteMedicalHistory(entry.id)}
                        className="text-gray-400 hover:text-red-500 p-1"
                        title="Delete"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))
              )}

              {/* Add Medical History Entry inline */}
              {showAddMedHistory ? (
                <div className="mt-2 p-3 bg-blue-50/50 rounded-xl border border-blue-100 space-y-2">
                  <input
                    type="text"
                    placeholder="e.g. Hypertension, Diabetes, Thyroid..."
                    value={newMedCondition}
                    onChange={(e) => setNewMedCondition(e.target.value)}
                    className="w-full text-xs p-2 rounded-lg bg-white border border-gray-200 focus:outline-none focus:border-[#1E88C7]"
                  />
                  <div className="flex gap-2">
                    {(['Mild', 'Moderate', 'Severe'] as const).map((sev) => (
                      <button
                        key={sev}
                        type="button"
                        onClick={() => setNewMedSeverity(sev)}
                        className={`text-[10px] font-bold px-2 py-1 rounded-md ${
                          newMedSeverity === sev
                            ? 'bg-[#1E88C7] text-white'
                            : 'bg-white text-gray-700 border border-gray-200'
                        }`}
                      >
                        {sev}
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-2 justify-end pt-1">
                    <button
                      onClick={() => setShowAddMedHistory(false)}
                      className="text-xs px-2.5 py-1 text-gray-600 hover:bg-gray-100 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveMedHistory}
                      className="text-xs px-3 py-1 bg-[#1E88C7] text-white font-bold rounded-lg"
                    >
                      Save Entry
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowAddMedHistory(true)}
                  className="w-full py-2 text-xs font-semibold text-[#1E88C7] hover:bg-blue-50/60 rounded-xl border border-dashed border-[#1E88C7]/40 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Plus size={14} />
                  <span>Add Medical Condition</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Appointment History */}
        <div className="bg-white rounded-2xl shadow-2xs border border-gray-100 overflow-hidden">
          <div
            onClick={() => toggleSection('appointments')}
            className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50/70 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <Calendar size={18} className="text-[#1E88C7]" />
              <h4 className="font-bold text-sm text-[#2B2D33]">Appointment History</h4>
              <span className="w-5 h-5 rounded-full bg-[#1E88C7] text-white text-[11px] font-bold flex items-center justify-center">
                {patientAppointments.length}
              </span>
            </div>
            {openSections.appointments ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </div>

          {openSections.appointments && (
            <div className="px-4 pb-4 pt-1 border-t border-gray-100 space-y-2">
              {patientAppointments.length === 0 ? (
                <p className="text-xs text-[#767B87] italic py-1">No appointment history.</p>
              ) : (
                patientAppointments.map((a) => (
                  <div
                    key={a.id}
                    className="p-2.5 rounded-xl bg-[#F5F6F8] flex items-center justify-between text-xs"
                  >
                    <div>
                      <p className="font-bold text-[#2B2D33]">{a.reason}</p>
                      <p className="text-[#767B87]">
                        {a.date} • {a.startTime} - {a.endTime}
                      </p>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-[#1E88C7] uppercase">
                      {a.status}
                    </span>
                  </div>
                ))
              )}
              <button
                onClick={() => onOpenSchedule(patient)}
                className="w-full py-2 text-xs font-semibold text-[#1E88C7] hover:bg-blue-50/60 rounded-xl border border-dashed border-[#1E88C7]/40 flex items-center justify-center gap-1.5 transition-colors"
              >
                <Plus size={14} />
                <span>Book New Appointment</span>
              </button>
            </div>
          )}
        </div>

        {/* Payment History */}
        <div className="bg-white rounded-2xl shadow-2xs border border-gray-100 overflow-hidden">
          <div
            onClick={() => toggleSection('payments')}
            className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50/70 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <DollarSign size={18} className="text-[#1E8E5A]" />
              <h4 className="font-bold text-sm text-[#2B2D33]">Payment History</h4>
              {patient.balance && patient.balance > 0 ? (
                <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                  Bal: {settings.currencySymbol}{patient.balance}
                </span>
              ) : null}
            </div>
            {openSections.payments ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </div>

          {openSections.payments && (
            <div className="px-4 pb-4 pt-1 border-t border-gray-100 space-y-2">
              {patientTransactions.length === 0 ? (
                <p className="text-xs text-[#767B87] italic py-1">No payment transactions on record.</p>
              ) : (
                patientTransactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="p-2.5 rounded-xl bg-[#F5F6F8] flex items-center justify-between text-xs"
                  >
                    <div>
                      <p className="font-bold text-[#2B2D33]">{tx.category}</p>
                      <p className="text-[#767B87]">{tx.date} • {tx.paymentMethod}</p>
                    </div>
                    <span className="font-black text-sm text-[#1E8E5A]">
                      +{settings.currencySymbol}{tx.amount.toLocaleString()}
                    </span>
                  </div>
                ))
              )}
              <button
                onClick={() => onOpenAddPayment(patient)}
                className="w-full py-2 text-xs font-semibold text-[#1E8E5A] hover:bg-green-50/60 rounded-xl border border-dashed border-[#1E8E5A]/40 flex items-center justify-center gap-1.5 transition-colors"
              >
                <Plus size={14} />
                <span>Receive Payment / Issue Receipt</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
