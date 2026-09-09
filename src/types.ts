export type Screen =
  | 'dashboard'
  | 'patients'
  | 'patient_profile'
  | 'dental_chart'
  | 'appointments'
  | 'finance'
  | 'backup'
  | 'settings'
  | 'subscription'
  | 'feedback';

export type ToothStatus =
  | 'healthy'
  | 'planned'
  | 'in_progress'
  | 'completed'
  | 'needs_attention'
  | 'missing';

export interface ToothRecord {
  id: string;
  patientId: string;
  toothNumber: number; // 1-32 (Adult) or 1-20 (Pediatric)
  chartType: 'adult' | 'pediatric';
  status: ToothStatus;
  procedureName: string;
  notes: string;
  dateUpdated: string;
  surface?: string; // O, M, D, B, L
}

export interface MedicalHistoryEntry {
  id: string;
  patientId: string;
  condition: string;
  dateNoted: string;
  severity?: 'Mild' | 'Moderate' | 'Severe';
  medications?: string;
}

export interface PatientPhoto {
  id: string;
  patientId: string;
  url: string;
  title: string;
  date: string;
  category: 'X-Ray' | 'Intraoral' | 'Before/After' | 'Document';
}

export interface Patient {
  id: string;
  name: string;
  avatar?: string;
  avatarColor?: string;
  dob: string; // YYYY-MM-DD
  gender: 'Female' | 'Male' | 'Other';
  email: string;
  address: string;
  phone: string[];
  allergies: string[];
  notes: string;
  dateAdded: string;
  lastUpdated: string;
  balance?: number;
  insuranceProvider?: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  patientPhone?: string;
  providerName: string;
  date: string; // YYYY-MM-DD
  startTime: string; // e.g. "10:00 AM"
  endTime: string; // e.g. "11:00 AM"
  reason: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no_show';
  notes?: string;
  syncToCalendar?: boolean;
}

export interface Transaction {
  id: string;
  patientId?: string;
  patientName?: string;
  type: 'revenue' | 'expense';
  amount: number;
  category: string;
  date: string; // YYYY-MM-DD
  paymentMethod?: string;
  insuranceProvider?: string;
  providerName?: string;
  note: string;
}

export interface BackupLog {
  id: string;
  timestamp: string;
  type: 'auto' | 'manual';
  status: 'success' | 'failed';
  recordCount: number;
  size: string;
}

export interface ClinicSettings {
  clinicName: string;
  dentistName: string;
  currency: string;
  currencySymbol: string;
  language: 'English' | 'Español' | 'Português' | 'العربية';
  pinLockEnabled: boolean;
  pinCode: string;
  autoBackupFrequency: 'Off' | 'Daily' | 'Weekly' | 'Monthly';
  lastBackupDate: string;
  lastRestoreDate: string;
  nextScheduledBackup: string;
  notifications: {
    appointments: boolean;
    recalls: boolean;
    birthdays: boolean;
  };
}
