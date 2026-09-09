import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, User, FileText, CheckCircle2 } from 'lucide-react';
import { Appointment, Patient } from '../../types';
import { useApp } from '../../context/AppContext';

interface AppointmentFormModalProps {
  appointment?: Appointment | null;
  defaultDate?: string;
  defaultPatient?: Patient | null;
  isOpen: boolean;
  onClose: () => void;
  onSaved: (appointmentId: string) => void;
}

export const AppointmentFormModal: React.FC<AppointmentFormModalProps> = ({
  appointment,
  defaultDate,
  defaultPatient,
  isOpen,
  onClose,
  onSaved,
}) => {
  const { patients, addAppointment, updateAppointment, settings, showToast } = useApp();

  const [patientId, setPatientId] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('10:00 AM');
  const [endTime, setEndTime] = useState('11:00 AM');
  const [providerName, setProviderName] = useState(
    `${settings.dentistName}, ${settings.dentistDegree}`
  );
  const [reason, setReason] = useState('Dental Examination & Cleaning');
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<Appointment['status']>('scheduled');

  const commonProcedures = [
    'Dental Examination & Cleaning',
    'Class II Composite Restoration',
    'Root Canal Therapy (RCT)',
    'Surgical Tooth Extraction',
    'Porcelain Crown Placement',
    'Periodontal Scaling & Root Planing',
    'In-Office Teeth Whitening',
    'Orthodontic Bracket Adjustment',
    'Emergency Toothache Consult',
  ];

  useEffect(() => {
    if (appointment) {
      setPatientId(appointment.patientId);
      setDate(appointment.date);
      setStartTime(appointment.startTime);
      setEndTime(appointment.endTime);
      setProviderName(appointment.providerName);
      setReason(appointment.reason);
      setNotes(appointment.notes || '');
      setStatus(appointment.status);
    } else {
      const todayStr = new Date().toISOString().split('T')[0];
      setDate(defaultDate || todayStr);
      setPatientId(defaultPatient ? defaultPatient.id : (patients[0]?.id || ''));
      setStartTime('10:00 AM');
      setEndTime('11:00 AM');
      setProviderName(`${settings.dentistName}, ${settings.dentistDegree}`);
      setReason('Dental Examination & Cleaning');
      setNotes('');
      setStatus('scheduled');
    }
  }, [appointment, defaultDate, defaultPatient, isOpen, patients, settings]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientId || !date) return;

    const selectedPatient = patients.find((p) => p.id === patientId);
    if (!selectedPatient) return;

    if (appointment) {
      updateAppointment({
        ...appointment,
        patientId,
        patientName: selectedPatient.name,
        patientPhone: selectedPatient.phone[0] || '',
        date,
        startTime,
        endTime,
        providerName,
        reason,
        notes,
        status,
      });
      onSaved(appointment.id);
    } else {
      const newId = addAppointment({
        patientId,
        patientName: selectedPatient.name,
        patientPhone: selectedPatient.phone[0] || '',
        date,
        startTime,
        endTime,
        providerName,
        reason,
        notes,
        status,
      });
      onSaved(newId);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={onClose} />

      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl p-5 z-10 max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#1E88C7] flex items-center justify-center">
              <Calendar size={18} />
            </div>
            <h3 className="font-extrabold text-base text-[#2B2D33]">
              {appointment ? 'Edit Appointment' : 'Book Chairside Appointment'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="py-4 space-y-3.5 flex-1 overflow-y-auto text-xs">
          {/* Patient Selection */}
          <div>
            <label className="font-bold text-[#767B87] uppercase tracking-wider block mb-1">
              Select Patient *
            </label>
            <select
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-[#F5F6F8] border border-gray-200 text-[#2B2D33] font-semibold focus:outline-none focus:border-[#1E88C7]"
              required
            >
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.phone[0] || 'No phone'})
                </option>
              ))}
            </select>
          </div>

          {/* Date & Provider */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-[#767B87] uppercase tracking-wider block mb-1">
                Appointment Date *
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-[#F5F6F8] border border-gray-200 text-[#2B2D33] font-semibold focus:outline-none focus:border-[#1E88C7]"
              />
            </div>

            <div>
              <label className="font-bold text-[#767B87] uppercase tracking-wider block mb-1">
                Attending Dentist
              </label>
              <input
                type="text"
                value={providerName}
                onChange={(e) => setProviderName(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-[#F5F6F8] border border-gray-200 text-[#2B2D33] font-semibold focus:outline-none focus:border-[#1E88C7]"
              />
            </div>
          </div>

          {/* Start Time & End Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-[#767B87] uppercase tracking-wider block mb-1">
                Start Time *
              </label>
              <input
                type="text"
                placeholder="e.g. 10:00 AM"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-[#F5F6F8] border border-gray-200 text-[#2B2D33] font-semibold focus:outline-none focus:border-[#1E88C7]"
                required
              />
            </div>
            <div>
              <label className="font-bold text-[#767B87] uppercase tracking-wider block mb-1">
                End Time *
              </label>
              <input
                type="text"
                placeholder="e.g. 11:00 AM"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-[#F5F6F8] border border-gray-200 text-[#2B2D33] font-semibold focus:outline-none focus:border-[#1E88C7]"
                required
              />
            </div>
          </div>

          {/* Procedure / Treatment Reason */}
          <div>
            <label className="font-bold text-[#767B87] uppercase tracking-wider block mb-1">
              Procedure / Reason *
            </label>
            <input
              type="text"
              list="procedures-datalist"
              required
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-[#F5F6F8] border border-gray-200 text-[#2B2D33] font-semibold focus:outline-none focus:border-[#1E88C7]"
            />
            <datalist id="procedures-datalist">
              {commonProcedures.map((proc) => (
                <option key={proc} value={proc} />
              ))}
            </datalist>
          </div>

          {/* Status */}
          <div>
            <label className="font-bold text-[#767B87] uppercase tracking-wider block mb-1">
              Status
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(['scheduled', 'completed', 'cancelled', 'no_show'] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStatus(s)}
                  className={`py-2 rounded-xl font-bold uppercase text-[10px] tracking-wider transition-all border ${
                    status === s
                      ? 'bg-[#1E88C7] text-white border-[#1E88C7]'
                      : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {s.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Clinical Notes */}
          <div>
            <label className="font-bold text-[#767B87] uppercase tracking-wider block mb-1">
              Chairside Notes (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Advised 30 min before anesthesia, patient requested morning slot..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-[#F5F6F8] border border-gray-200 text-[#2B2D33] focus:outline-none focus:border-[#1E88C7]"
            />
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 font-bold hover:bg-gray-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#1E88C7] hover:bg-[#186ea3] text-white font-bold rounded-xl shadow-xs transition-all"
            >
              {appointment ? 'Update Appointment' : 'Confirm Booking'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
