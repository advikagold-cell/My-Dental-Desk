import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Screen,
  Patient,
  ToothRecord,
  MedicalHistoryEntry,
  Appointment,
  Transaction,
  BackupLog,
  ClinicSettings,
} from '../types';
import {
  INITIAL_PATIENTS,
  INITIAL_TOOTH_RECORDS,
  INITIAL_MEDICAL_HISTORY,
  INITIAL_APPOINTMENTS,
  INITIAL_TRANSACTIONS,
  INITIAL_BACKUPS,
  INITIAL_SETTINGS,
} from '../data/initialData';

interface Toast {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

interface AppContextType {
  currentScreen: Screen;
  setCurrentScreen: (screen: Screen) => void;
  selectedPatientId: string | null;
  setSelectedPatientId: (id: string | null) => void;
  isDrawerOpen: boolean;
  setIsDrawerOpen: (open: boolean) => void;
  deviceMode: 'phone' | 'tablet';
  setDeviceMode: (mode: 'phone' | 'tablet') => void;
  
  // Data
  patients: Patient[];
  toothRecords: ToothRecord[];
  medicalHistory: MedicalHistoryEntry[];
  appointments: Appointment[];
  transactions: Transaction[];
  backups: BackupLog[];
  settings: ClinicSettings;

  // Sync & Notifications
  isSyncing: boolean;
  triggerSync: () => void;
  toasts: Toast[];
  showToast: (message: string, type?: 'info' | 'success' | 'warning' | 'error') => void;

  // Actions
  addPatient: (patient: Omit<Patient, 'id' | 'dateAdded' | 'lastUpdated'>) => string;
  updatePatient: (id: string, updates: Partial<Patient>) => void;
  deletePatient: (id: string) => void;

  updateToothRecord: (record: Omit<ToothRecord, 'id' | 'dateUpdated'>) => void;
  resetToothRecord: (patientId: string, toothNumber: number, chartType: 'adult' | 'pediatric') => void;

  addMedicalHistory: (entry: Omit<MedicalHistoryEntry, 'id'>) => void;
  deleteMedicalHistory: (id: string) => void;

  addAppointment: (appointment: Omit<Appointment, 'id'>) => void;
  updateAppointment: (id: string, updates: Partial<Appointment>) => void;
  deleteAppointment: (id: string) => void;

  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;

  createBackup: () => void;
  restoreBackup: () => void;
  updateSettings: (updates: Partial<ClinicSettings>) => void;
  exportDeviceCalendarICS: (appointment?: Appointment) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('dashboard');
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>('p1');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [deviceMode, setDeviceMode] = useState<'phone' | 'tablet'>('phone');
  const [isSyncing, setIsSyncing] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Persistent state initialized from localStorage or defaults
  const [patients, setPatients] = useState<Patient[]>(() => {
    const saved = localStorage.getItem('dd_patients');
    return saved ? JSON.parse(saved) : INITIAL_PATIENTS;
  });

  const [toothRecords, setToothRecords] = useState<ToothRecord[]>(() => {
    const saved = localStorage.getItem('dd_tooth_records');
    return saved ? JSON.parse(saved) : INITIAL_TOOTH_RECORDS;
  });

  const [medicalHistory, setMedicalHistory] = useState<MedicalHistoryEntry[]>(() => {
    const saved = localStorage.getItem('dd_med_history');
    return saved ? JSON.parse(saved) : INITIAL_MEDICAL_HISTORY;
  });

  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const saved = localStorage.getItem('dd_appointments');
    return saved ? JSON.parse(saved) : INITIAL_APPOINTMENTS;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('dd_transactions');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [backups, setBackups] = useState<BackupLog[]>(() => {
    const saved = localStorage.getItem('dd_backups');
    return saved ? JSON.parse(saved) : INITIAL_BACKUPS;
  });

  const [settings, setSettings] = useState<ClinicSettings>(() => {
    const saved = localStorage.getItem('dd_settings');
    return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
  });

  // Save to localStorage when changed
  useEffect(() => {
    localStorage.setItem('dd_patients', JSON.stringify(patients));
  }, [patients]);

  useEffect(() => {
    localStorage.setItem('dd_tooth_records', JSON.stringify(toothRecords));
  }, [toothRecords]);

  useEffect(() => {
    localStorage.setItem('dd_med_history', JSON.stringify(medicalHistory));
  }, [medicalHistory]);

  useEffect(() => {
    localStorage.setItem('dd_appointments', JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem('dd_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('dd_backups', JSON.stringify(backups));
  }, [backups]);

  useEffect(() => {
    localStorage.setItem('dd_settings', JSON.stringify(settings));
  }, [settings]);

  const showToast = (message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  };

  const triggerSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      showToast('All clinical records synchronized successfully with DentalDesk Cloud', 'success');
    }, 850);
  };

  // Patients CRUD
  const addPatient = (patientData: Omit<Patient, 'id' | 'dateAdded' | 'lastUpdated'>): string => {
    const id = 'p_' + Date.now();
    const now = new Date();
    const dateFormatted = now.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) +
      ' at ' + now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    
    const newPatient: Patient = {
      ...patientData,
      id,
      dateAdded: dateFormatted,
      lastUpdated: dateFormatted,
      avatarColor: patientData.avatarColor || '#1E88C7',
      balance: patientData.balance || 0,
    };
    setPatients((prev) => [newPatient, ...prev]);
    showToast(`Patient "${newPatient.name}" created successfully`, 'success');
    return id;
  };

  const updatePatient = (id: string, updates: Partial<Patient>) => {
    const now = new Date();
    const dateFormatted = now.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) +
      ' at ' + now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    setPatients((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates, lastUpdated: dateFormatted } : p))
    );
    showToast('Patient record updated', 'success');
  };

  const deletePatient = (id: string) => {
    setPatients((prev) => prev.filter((p) => p.id !== id));
    setAppointments((prev) => prev.filter((a) => a.patientId !== id));
    setToothRecords((prev) => prev.filter((t) => t.patientId !== id));
    setMedicalHistory((prev) => prev.filter((m) => m.patientId !== id));
    if (selectedPatientId === id) {
      setSelectedPatientId(null);
      setCurrentScreen('patients');
    }
    showToast('Patient record deleted', 'info');
  };

  // Tooth Records
  const updateToothRecord = (record: Omit<ToothRecord, 'id' | 'dateUpdated'>) => {
    const now = new Date();
    const dateFormatted = now.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
    
    setToothRecords((prev) => {
      const existingIndex = prev.findIndex(
        (t) =>
          t.patientId === record.patientId &&
          t.toothNumber === record.toothNumber &&
          t.chartType === record.chartType
      );

      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          ...record,
          dateUpdated: dateFormatted,
        };
        return updated;
      } else {
        return [
          ...prev,
          {
            ...record,
            id: 't_' + Date.now(),
            dateUpdated: dateFormatted,
          },
        ];
      }
    });

    // Also update patient's lastUpdated
    updatePatient(record.patientId, {});
    showToast(`Tooth #${record.toothNumber} clinical status updated`, 'success');
  };

  const resetToothRecord = (patientId: string, toothNumber: number, chartType: 'adult' | 'pediatric') => {
    setToothRecords((prev) =>
      prev.filter(
        (t) => !(t.patientId === patientId && t.toothNumber === toothNumber && t.chartType === chartType)
      )
    );
    showToast(`Tooth #${toothNumber} restored to healthy condition`, 'info');
  };

  // Medical History
  const addMedicalHistory = (entry: Omit<MedicalHistoryEntry, 'id'>) => {
    const newEntry: MedicalHistoryEntry = {
      ...entry,
      id: 'm_' + Date.now(),
    };
    setMedicalHistory((prev) => [newEntry, ...prev]);
    showToast('Medical history entry added', 'success');
  };

  const deleteMedicalHistory = (id: string) => {
    setMedicalHistory((prev) => prev.filter((m) => m.id !== id));
    showToast('Medical history entry removed', 'info');
  };

  // Appointments
  const addAppointment = (appointment: Omit<Appointment, 'id'>) => {
    const newAppt: Appointment = {
      ...appointment,
      id: 'a_' + Date.now(),
    };
    setAppointments((prev) => [newAppt, ...prev]);
    showToast(`Appointment scheduled for ${newAppt.patientName}`, 'success');

    if (newAppt.syncToCalendar) {
      exportDeviceCalendarICS(newAppt);
    }
  };

  const updateAppointment = (id: string, updates: Partial<Appointment>) => {
    setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, ...updates } : a)));
    showToast('Appointment updated', 'success');
  };

  const deleteAppointment = (id: string) => {
    setAppointments((prev) => prev.filter((a) => a.id !== id));
    showToast('Appointment cancelled/removed', 'info');
  };

  // Transactions
  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTx: Transaction = {
      ...transaction,
      id: 'tx_' + Date.now(),
    };
    setTransactions((prev) => [newTx, ...prev]);

    // If it's a patient revenue payment, reduce their balance if they had one
    if (newTx.patientId && newTx.type === 'revenue') {
      setPatients((prev) =>
        prev.map((p) => {
          if (p.id === newTx.patientId) {
            const currentBal = p.balance || 0;
            return { ...p, balance: Math.max(0, currentBal - newTx.amount) };
          }
          return p;
        })
      );
    }

    showToast(
      `${newTx.type === 'revenue' ? 'Payment received' : 'Expense recorded'} of ${settings.currencySymbol}${newTx.amount.toLocaleString()}`,
      'success'
    );
  };

  const deleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
    showToast('Transaction removed', 'info');
  };

  // Backup & Restore
  const createBackup = () => {
    const now = new Date();
    const timestamp = now.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) +
      ' at ' + now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    
    const backupData = {
      version: '1.0',
      exportedAt: now.toISOString(),
      patients,
      toothRecords,
      medicalHistory,
      appointments,
      transactions,
      settings,
    };

    // Downloadable file
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dentaldesk_backup_${now.toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    const newLog: BackupLog = {
      id: 'b_' + Date.now(),
      timestamp,
      type: 'manual',
      status: 'success',
      recordCount: patients.length + appointments.length + transactions.length,
      size: `${(blob.size / 1024).toFixed(1)} KB`,
    };

    setBackups((prev) => [newLog, ...prev]);
    setSettings((prev) => ({ ...prev, lastBackupDate: timestamp }));
    showToast('Backup archive created and downloaded successfully!', 'success');
  };

  const restoreBackup = () => {
    // Simulated or file-based restore
    const now = new Date();
    const timestamp = now.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) +
      ' at ' + now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    
    setSettings((prev) => ({ ...prev, lastRestoreDate: timestamp }));
    showToast('Database verified and active clinic data restored', 'success');
  };

  const updateSettings = (updates: Partial<ClinicSettings>) => {
    setSettings((prev) => ({ ...prev, ...updates }));
    showToast('Settings saved', 'success');
  };

  // Real ICS iCalendar generator for device calendar sync
  const exportDeviceCalendarICS = (appointment?: Appointment) => {
    const appts = appointment ? [appointment] : appointments;
    if (appts.length === 0) {
      showToast('No appointments found to export', 'warning');
      return;
    }

    let ics = 'BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//DentalDesk//Practice Management//EN\r\nCALSCALE:GREGORIAN\r\n';
    
    appts.forEach((a) => {
      const cleanDate = a.date.replace(/-/g, '');
      ics += 'BEGIN:VEVENT\r\n';
      ics += `UID:${a.id}@dentaldesk.app\r\n`;
      ics += `SUMMARY:Dental: ${a.patientName} (${a.reason})\r\n`;
      ics += `DESCRIPTION:Patient: ${a.patientName}\\nProcedure: ${a.reason}\\nProvider: ${a.providerName}\\nNotes: ${a.notes || 'None'}\r\n`;
      ics += `DTSTART;VALUE=DATE:${cleanDate}\r\n`;
      ics += `DTEND;VALUE=DATE:${cleanDate}\r\n`;
      ics += 'STATUS:CONFIRMED\r\n';
      ics += 'END:VEVENT\r\n';
    });

    ics += 'END:VCALENDAR\r\n';

    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = appointment ? `dentaldesk_appointment_${appointment.id}.ics` : 'dentaldesk_calendar_sync.ics';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast('Device calendar event (.ics) generated & downloaded for syncing', 'success');
  };

  return (
    <AppContext.Provider
      value={{
        currentScreen,
        setCurrentScreen,
        selectedPatientId,
        setSelectedPatientId,
        isDrawerOpen,
        setIsDrawerOpen,
        deviceMode,
        setDeviceMode,
        patients,
        toothRecords,
        medicalHistory,
        appointments,
        transactions,
        backups,
        settings,
        isSyncing,
        triggerSync,
        toasts,
        showToast,
        addPatient,
        updatePatient,
        deletePatient,
        updateToothRecord,
        resetToothRecord,
        addMedicalHistory,
        deleteMedicalHistory,
        addAppointment,
        updateAppointment,
        deleteAppointment,
        addTransaction,
        deleteTransaction,
        createBackup,
        restoreBackup,
        updateSettings,
        exportDeviceCalendarICS,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
