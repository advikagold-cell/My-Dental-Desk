import React, { useState, useMemo } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Phone,
  MessageSquare,
  Edit2,
  Trash2,
  Clock,
  Calendar as CalendarIcon,
  User,
  CheckCircle2,
  Share2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Appointment } from '../types';

interface AppointmentScreenProps {
  onOpenAddAppointment: (date?: string) => void;
  onEditAppointment: (appointment: Appointment) => void;
  onSelectPatient: (patientId: string) => void;
}

export const AppointmentScreen: React.FC<AppointmentScreenProps> = ({
  onOpenAddAppointment,
  onEditAppointment,
  onSelectPatient,
}) => {
  const { appointments, deleteAppointment, showToast, exportDeviceCalendarICS } = useApp();

  // Calendar strip state
  const today = new Date();
  const [currentDate, setCurrentDate] = useState<Date>(today);
  const [selectedDateStr, setSelectedDateStr] = useState<string>(
    today.toISOString().split('T')[0]
  );

  // Month navigation
  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  // Month/Year string
  const monthYearLabel = currentDate.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  // Calendar days grid generation
  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDayIndex = new Date(year, month, 1).getDay(); // 0 = Sunday
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const days: {
      dayNumber: number;
      dateStr: string;
      isCurrentMonth: boolean;
      hasAppointments: boolean;
      appointmentCount: number;
    }[] = [];

    // Prev month padding
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const dayNum = daysInPrevMonth - i;
      const prevDate = new Date(year, month - 1, dayNum);
      const dStr = prevDate.toISOString().split('T')[0];
      const count = appointments.filter((a) => a.date === dStr).length;
      days.push({
        dayNumber: dayNum,
        dateStr: dStr,
        isCurrentMonth: false,
        hasAppointments: count > 0,
        appointmentCount: count,
      });
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      const curDate = new Date(year, month, i);
      const dStr = curDate.toISOString().split('T')[0];
      const count = appointments.filter((a) => a.date === dStr).length;
      days.push({
        dayNumber: i,
        dateStr: dStr,
        isCurrentMonth: true,
        hasAppointments: count > 0,
        appointmentCount: count,
      });
    }

    // Next month padding to fill complete weeks (multiples of 7)
    const remainingDays = (7 - (days.length % 7)) % 7;
    for (let i = 1; i <= remainingDays; i++) {
      const nextDate = new Date(year, month + 1, i);
      const dStr = nextDate.toISOString().split('T')[0];
      const count = appointments.filter((a) => a.date === dStr).length;
      days.push({
        dayNumber: i,
        dateStr: dStr,
        isCurrentMonth: false,
        hasAppointments: count > 0,
        appointmentCount: count,
      });
    }

    return days;
  }, [currentDate, appointments]);

  // Appointments on the selected date
  const filteredAppointments = useMemo(() => {
    return appointments.filter((a) => a.date === selectedDateStr);
  }, [appointments, selectedDateStr]);

  const handleCall = (phone?: string, name?: string) => {
    if (!phone) {
      showToast('No phone number on record for this patient', 'warning');
      return;
    }
    window.location.href = `tel:${phone}`;
    showToast(`Calling ${name} (${phone})`, 'info');
  };

  const handleMessage = (phone?: string, name?: string) => {
    if (!phone) {
      showToast('No phone number on record for this patient', 'warning');
      return;
    }
    window.location.href = `sms:${phone}`;
    showToast(`Messaging ${name} (${phone})`, 'info');
  };

  return (
    <div className="relative min-h-[calc(100vh-3.5rem)] flex flex-col pb-24 max-w-4xl mx-auto w-full">
      {/* 1. Month Calendar Strip with Purple Header */}
      <div className="bg-white shadow-2xs border-b border-gray-100">
        {/* Purple Month Strip Header */}
        <div className="bg-[#9B59D0] text-white px-4 py-2.5 flex items-center justify-between select-none">
          <button
            onClick={handlePrevMonth}
            className="p-1 rounded-full hover:bg-white/20 active:bg-white/30 transition-colors"
            aria-label="Previous Month"
          >
            <ChevronLeft size={20} />
          </button>
          <span className="font-bold text-sm tracking-wide">{monthYearLabel}</span>
          <button
            onClick={handleNextMonth}
            className="p-1 rounded-full hover:bg-white/20 active:bg-white/30 transition-colors"
            aria-label="Next Month"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* 7-column Weekday Headers (Su - Sa) */}
        <div className="bg-[#9B59D0]/10 grid grid-cols-7 py-2 text-center text-xs font-bold text-[#767B87]">
          <span>Su</span>
          <span>Mo</span>
          <span>Tu</span>
          <span>We</span>
          <span>Th</span>
          <span>Fr</span>
          <span>Sa</span>
        </div>

        {/* Days Grid */}
        <div className="p-2 grid grid-cols-7 gap-y-1 text-center select-none">
          {calendarDays.map((item, idx) => {
            const isSelected = item.dateStr === selectedDateStr;
            const isToday = item.dateStr === today.toISOString().split('T')[0];

            return (
              <div
                key={`${item.dateStr}-${idx}`}
                onClick={() => setSelectedDateStr(item.dateStr)}
                className="relative flex flex-col items-center justify-center py-1.5 cursor-pointer rounded-xl hover:bg-blue-50/60 transition-colors group"
              >
                {/* Date bubble */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    isSelected
                      ? 'bg-[#1E88C7] text-white shadow-sm scale-105'
                      : isToday
                      ? 'border border-[#1E88C7] text-[#1E88C7] font-extrabold'
                      : item.isCurrentMonth
                      ? 'text-[#2B2D33]'
                      : 'text-gray-300'
                  }`}
                >
                  {item.dayNumber}
                </div>

                {/* Appointment Dot Indicator */}
                <div className="h-1.5 mt-0.5 flex items-center justify-center">
                  {item.hasAppointments && (
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        isSelected ? 'bg-white' : 'bg-[#1E88C7]'
                      }`}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Count Label */}
      <div className="p-4 pb-2 flex items-center justify-between">
        <span className="text-xs font-bold text-[#1E88C7] tracking-tight">
          {filteredAppointments.length} appointment record(s) on{' '}
          {new Date(selectedDateStr + 'T00:00:00').toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          })}
        </span>
        <button
          onClick={() => exportDeviceCalendarICS()}
          className="text-xs font-semibold text-[#767B87] hover:text-[#1E88C7] flex items-center gap-1"
        >
          <Share2 size={13} />
          <span>Export .ics</span>
        </button>
      </div>

      {/* 3. Appointment Cards List */}
      <div className="p-4 pt-1 space-y-3 flex-1">
        {filteredAppointments.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-gray-100 shadow-2xs">
            <CalendarIcon size={32} className="mx-auto text-gray-300 mb-2" />
            <p className="text-sm font-semibold text-[#2B2D33]">No appointments scheduled</p>
            <p className="text-xs text-[#767B87] mt-1">
              There are no chairside appointments on this date.
            </p>
            <button
              onClick={() => onOpenAddAppointment(selectedDateStr)}
              className="mt-4 px-4 py-2 rounded-xl bg-[#1E88C7] text-white text-xs font-bold shadow-xs hover:bg-[#186ea3] transition-colors"
            >
              Book for This Day
            </button>
          </div>
        ) : (
          filteredAppointments.map((appt) => (
            <div
              key={appt.id}
              className="bg-white rounded-2xl p-4 shadow-2xs border border-gray-100 transition-all hover:shadow-md"
            >
              {/* Header: Patient Name (Link-styled, teal) */}
              <div className="flex items-start justify-between">
                <div>
                  <button
                    onClick={() => onSelectPatient(appt.patientId)}
                    className="text-base font-extrabold text-[#1E88C7] hover:underline text-left block"
                  >
                    {appt.patientName}
                  </button>
                  <p className="text-xs font-semibold text-[#2B2D33] mt-0.5">
                    {appt.providerName}
                  </p>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-[#1E88C7] border border-[#1E88C7]/20 uppercase">
                  {appt.status}
                </span>
              </div>

              {/* Details: Date, Start/End Time, Reason */}
              <div className="mt-2.5 text-xs text-[#767B87] space-y-0.5">
                <p>
                  {new Date(appt.date + 'T00:00:00').toLocaleDateString('en-US', {
                    month: 'short',
                    day: '2-digit',
                    year: 'numeric',
                  })}
                </p>
                <p>
                  Start Time: <span className="font-semibold text-[#2B2D33]">{appt.startTime}</span>
                </p>
                <p>
                  End Time: <span className="font-semibold text-[#2B2D33]">{appt.endTime}</span>
                </p>
                <p className="pt-1 text-[#2B2D33] font-medium">
                  Procedure: <span className="font-bold">{appt.reason}</span>
                </p>
                {appt.notes && (
                  <p className="text-[11px] text-[#767B87] italic">Note: {appt.notes}</p>
                )}
              </div>

              {/* Action Row Under Each Card: Call, Message, Edit, Delete */}
              <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-around text-[#9B59D0]">
                {/* Call */}
                <button
                  onClick={() => handleCall(appt.patientPhone, appt.patientName)}
                  className="p-2 rounded-xl hover:bg-purple-50 active:scale-95 transition-all"
                  title="Call Patient"
                >
                  <Phone size={18} />
                </button>

                {/* Message */}
                <button
                  onClick={() => handleMessage(appt.patientPhone, appt.patientName)}
                  className="p-2 rounded-xl hover:bg-purple-50 active:scale-95 transition-all"
                  title="SMS Message"
                >
                  <MessageSquare size={18} />
                </button>

                {/* Edit */}
                <button
                  onClick={() => onEditAppointment(appt)}
                  className="p-2 rounded-xl hover:bg-purple-50 active:scale-95 transition-all"
                  title="Edit Appointment"
                >
                  <Edit2 size={18} />
                </button>

                {/* Delete */}
                <button
                  onClick={() => deleteAppointment(appt.id)}
                  className="p-2 rounded-xl hover:bg-red-50 text-gray-400 hover:text-[#C0392B] active:scale-95 transition-all"
                  title="Delete Appointment"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Global FAB: Purple floating "+" action button (bottom-right) */}
      <button
        onClick={() => onOpenAddAppointment(selectedDateStr)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-[#9B59D0] hover:bg-[#8847bd] active:scale-95 text-white shadow-xl flex items-center justify-center transition-all z-20"
        title="Add Appointment"
        aria-label="Add Appointment"
      >
        <Plus size={28} />
      </button>
    </div>
  );
};
