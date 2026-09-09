import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { TopAppBar } from './components/TopAppBar';
import { NavigationDrawer } from './components/NavigationDrawer';
import { DashboardScreen } from './components/DashboardScreen';
import { PatientListScreen } from './components/PatientListScreen';
import { PatientProfileScreen } from './components/PatientProfileScreen';
import { DentalChartScreen } from './components/DentalChartScreen';
import { AppointmentScreen } from './components/AppointmentScreen';
import { FinanceScreen } from './components/FinanceScreen';
import { BackupScreen } from './components/BackupScreen';
import { SettingsScreen } from './components/SettingsScreen';
import { SubscriptionScreen } from './components/SubscriptionScreen';
import { FeedbackScreen } from './components/FeedbackScreen';

// Modals
import { PatientFormModal } from './components/modals/PatientFormModal';
import { AppointmentFormModal } from './components/modals/AppointmentFormModal';
import { TransactionFormModal } from './components/modals/TransactionFormModal';

import { Patient, Appointment } from './types';
import { ArrowLeft, UserPlus, CalendarPlus, Receipt, CheckCircle, AlertCircle, Info } from 'lucide-react';

const MainLayout: React.FC = () => {
  const {
    currentScreen,
    setCurrentScreen,
    patients,
    selectedPatientId,
    setSelectedPatientId,
    deletePatient,
    toast,
  } = useApp();

  // Navigation Drawer state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Modals state
  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);

  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [appointmentDefaultDate, setAppointmentDefaultDate] = useState<string | undefined>(undefined);

  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [transactionType, setTransactionType] = useState<'revenue' | 'expense'>('revenue');

  // Active patient object
  const activePatient = patients.find((p) => p.id === selectedPatientId) || patients[0];

  // Title derivation for TopAppBar
  const getScreenTitle = (): string => {
    switch (currentScreen) {
      case 'dashboard':
        return 'DentalDesk';
      case 'patients':
        return 'Patients';
      case 'patient_profile':
        return 'Patient Profile';
      case 'dental_chart':
        return 'Dental Chart';
      case 'appointments':
        return 'Appointments';
      case 'finance':
        return 'Finance';
      case 'backup':
        return 'Backup & Restore';
      case 'settings':
        return 'Clinic Settings';
      case 'subscription':
        return 'Subscription';
      case 'feedback':
        return 'Send Feedback';
      default:
        return 'DentalDesk';
    }
  };

  const showBackButton =
    currentScreen === 'patient_profile' || currentScreen === 'dental_chart';

  const handleBack = () => {
    if (currentScreen === 'dental_chart') {
      setCurrentScreen('patient_profile');
    } else if (currentScreen === 'patient_profile') {
      setCurrentScreen('patients');
    } else {
      setCurrentScreen('dashboard');
    }
  };

  const handleOpenAddPatient = () => {
    setEditingPatient(null);
    setIsPatientModalOpen(true);
  };

  const handleEditPatient = (p: Patient) => {
    setEditingPatient(p);
    setIsPatientModalOpen(true);
  };

  const handleOpenAddAppointment = (date?: string) => {
    setEditingAppointment(null);
    setAppointmentDefaultDate(date);
    setIsAppointmentModalOpen(true);
  };

  const handleEditAppointment = (appt: Appointment) => {
    setEditingAppointment(appt);
    setIsAppointmentModalOpen(true);
  };

  const handleOpenAddPayment = (patient?: Patient) => {
    setTransactionType('revenue');
    if (patient) {
      setSelectedPatientId(patient.id);
    }
    setIsTransactionModalOpen(true);
  };

  const handleOpenAddExpense = () => {
    setTransactionType('expense');
    setIsTransactionModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#F5F6F8] flex flex-col font-sans text-[#2B2D33] antialiased selection:bg-[#1E88C7]/20 selection:text-[#1E88C7]">
      {/* Global Navigation Drawer */}
      <NavigationDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />

      {/* Top App Bar */}
      <TopAppBar
        title={getScreenTitle()}
        showBack={showBackButton}
        onBack={handleBack}
        onOpenMenu={() => setIsDrawerOpen(true)}
        showDeletePatient={currentScreen === 'patient_profile'}
        onDeletePatient={() => {
          if (activePatient) {
            deletePatient(activePatient.id);
            setCurrentScreen('patients');
          }
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full">
        {/* DASHBOARD */}
        {currentScreen === 'dashboard' && (
          <DashboardScreen
            onOpenAddAppointment={() => handleOpenAddAppointment()}
            onOpenAddPatient={handleOpenAddPatient}
            onOpenAddPayment={() => handleOpenAddPayment()}
          />
        )}

        {/* PATIENTS LIST & MASTER-DETAIL FOR TABLET */}
        {currentScreen === 'patients' && (
          <div className="w-full">
            {/* On wide screens / tablets (lg:), show responsive master-detail */}
            <div className="hidden lg:grid lg:grid-cols-12 max-w-7xl mx-auto h-[calc(100vh-3.5rem)] divide-x divide-gray-200">
              {/* Left Pane (Master): Patient List */}
              <div className="lg:col-span-5 h-full overflow-y-auto">
                <PatientListScreen
                  onOpenAddPatient={handleOpenAddPatient}
                  onSelectPatient={(id) => {
                    setSelectedPatientId(id);
                  }}
                />
              </div>

              {/* Right Pane (Detail): Patient Profile or Odontogram */}
              <div className="lg:col-span-7 h-full overflow-y-auto bg-white/50">
                {activePatient ? (
                  <PatientProfileScreen
                    patient={activePatient}
                    onEditPatient={handleEditPatient}
                    onOpenSchedule={(p) => {
                      setSelectedPatientId(p.id);
                      handleOpenAddAppointment();
                    }}
                    onOpenAddPayment={handleOpenAddPayment}
                  />
                ) : (
                  <div className="h-full flex items-center justify-center p-8 text-center text-gray-400">
                    Select a patient from the master list to review chart & profile.
                  </div>
                )}
              </div>
            </div>

            {/* Mobile / Phone Single View */}
            <div className="lg:hidden">
              <PatientListScreen
                onOpenAddPatient={handleOpenAddPatient}
                onSelectPatient={(id) => {
                  setSelectedPatientId(id);
                  setCurrentScreen('patient_profile');
                }}
              />
            </div>
          </div>
        )}

        {/* PATIENT PROFILE */}
        {currentScreen === 'patient_profile' && (
          <div>
            {activePatient ? (
              <PatientProfileScreen
                patient={activePatient}
                onEditPatient={handleEditPatient}
                onOpenSchedule={(p) => {
                  setSelectedPatientId(p.id);
                  handleOpenAddAppointment();
                }}
                onOpenAddPayment={handleOpenAddPayment}
              />
            ) : (
              <div className="p-8 text-center text-gray-500">
                Patient not found.
                <button
                  onClick={() => setCurrentScreen('patients')}
                  className="mt-3 block mx-auto px-4 py-2 bg-[#1E88C7] text-white rounded-xl text-xs font-bold"
                >
                  Return to Patient List
                </button>
              </div>
            )}
          </div>
        )}

        {/* DENTAL CHART */}
        {currentScreen === 'dental_chart' && (
          <div>
            {activePatient ? (
              <DentalChartScreen patient={activePatient} />
            ) : (
              <div className="p-8 text-center text-gray-500">
                Select a patient to open dental chart.
              </div>
            )}
          </div>
        )}

        {/* APPOINTMENTS */}
        {currentScreen === 'appointments' && (
          <AppointmentScreen
            onOpenAddAppointment={handleOpenAddAppointment}
            onEditAppointment={handleEditAppointment}
            onSelectPatient={(patientId) => {
              setSelectedPatientId(patientId);
              setCurrentScreen('patient_profile');
            }}
          />
        )}

        {/* FINANCE */}
        {currentScreen === 'finance' && (
          <FinanceScreen
            onOpenAddPayment={() => handleOpenAddPayment()}
            onOpenAddExpense={handleOpenAddExpense}
            onSelectPatient={(patientId) => {
              setSelectedPatientId(patientId);
              setCurrentScreen('patient_profile');
            }}
          />
        )}

        {/* BACKUP */}
        {currentScreen === 'backup' && <BackupScreen />}

        {/* SETTINGS */}
        {currentScreen === 'settings' && <SettingsScreen />}

        {/* SUBSCRIPTION */}
        {currentScreen === 'subscription' && <SubscriptionScreen />}

        {/* FEEDBACK */}
        {currentScreen === 'feedback' && <FeedbackScreen />}
      </main>

      {/* Global Toast Notification */}
      {toast && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-3 duration-200 pointer-events-none">
          <div
            className={`px-4 py-2.5 rounded-2xl shadow-xl text-xs font-bold flex items-center gap-2.5 backdrop-blur-md max-w-sm ${
              toast.type === 'success'
                ? 'bg-[#1E8E5A] text-white'
                : toast.type === 'warning'
                ? 'bg-amber-600 text-white'
                : 'bg-[#1E88C7] text-white'
            }`}
          >
            {toast.type === 'success' && <CheckCircle size={16} className="shrink-0" />}
            {toast.type === 'warning' && <AlertCircle size={16} className="shrink-0" />}
            {toast.type === 'info' && <Info size={16} className="shrink-0" />}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* MODALS */}
      <PatientFormModal
        isOpen={isPatientModalOpen}
        patient={editingPatient}
        onClose={() => setIsPatientModalOpen(false)}
        onSaved={(id) => {
          setSelectedPatientId(id);
        }}
      />

      <AppointmentFormModal
        isOpen={isAppointmentModalOpen}
        appointment={editingAppointment}
        defaultDate={appointmentDefaultDate}
        defaultPatient={activePatient}
        onClose={() => setIsAppointmentModalOpen(false)}
        onSaved={() => {}}
      />

      <TransactionFormModal
        isOpen={isTransactionModalOpen}
        initialType={transactionType}
        defaultPatient={activePatient}
        onClose={() => setIsTransactionModalOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
