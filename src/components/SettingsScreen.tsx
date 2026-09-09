import React, { useState } from 'react';
import {
  Building,
  User,
  Phone,
  MapPin,
  DollarSign,
  Save,
  RotateCcw,
  Download,
  Upload,
  Calendar,
  Shield,
  Moon,
  Sun,
  Trash2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const SettingsScreen: React.FC = () => {
  const { settings, updateSettings, showToast, patients, appointments, transactions } = useApp();

  const [clinicName, setClinicName] = useState(settings.clinicName);
  const [dentistName, setDentistName] = useState(settings.dentistName);
  const [dentistDegree, setDentistDegree] = useState(settings.dentistDegree);
  const [phone, setPhone] = useState(settings.phone);
  const [email, setEmail] = useState(settings.email);
  const [address, setAddress] = useState(settings.address);
  const [currency, setCurrency] = useState(settings.currency);
  const [currencySymbol, setCurrencySymbol] = useState(settings.currencySymbol);
  const [calendarSyncEnabled, setCalendarSyncEnabled] = useState(settings.calendarSyncEnabled);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      clinicName,
      dentistName,
      dentistDegree,
      phone,
      email,
      address,
      currency,
      currencySymbol,
      calendarSyncEnabled,
    });
    showToast('Clinic settings updated successfully', 'success');
  };

  const handleExportDataJSON = () => {
    const backupData = {
      exportDate: new Date().toISOString(),
      clinic: { clinicName, dentistName, phone, email },
      patients,
      appointments,
      transactions,
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `DentalDesk_Backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
    showToast('Complete practice database exported as JSON', 'success');
  };

  const handleResetData = () => {
    if (window.confirm('Reset all records to default demo practice data?')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="p-4 pb-24 space-y-5 max-w-4xl mx-auto w-full">
      {/* Clinic Profile Form */}
      <form onSubmit={handleSave} className="space-y-4">
        <div className="bg-white rounded-2xl p-5 shadow-2xs border border-gray-100 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-gray-100 text-[#1E88C7]">
            <Building size={20} />
            <h3 className="font-extrabold text-sm text-[#2B2D33]">Practice & Practitioner Info</h3>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="font-bold text-[#767B87] uppercase tracking-wider block mb-1">
                Clinic Name
              </label>
              <input
                type="text"
                value={clinicName}
                onChange={(e) => setClinicName(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-[#F5F6F8] border border-gray-200 text-[#2B2D33] font-semibold focus:outline-none focus:border-[#1E88C7]"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-[#767B87] uppercase tracking-wider block mb-1">
                  Lead Dentist Name
                </label>
                <input
                  type="text"
                  value={dentistName}
                  onChange={(e) => setDentistName(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#F5F6F8] border border-gray-200 text-[#2B2D33] font-semibold focus:outline-none focus:border-[#1E88C7]"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-[#767B87] uppercase tracking-wider block mb-1">
                  Qualifications / Title
                </label>
                <input
                  type="text"
                  value={dentistDegree}
                  onChange={(e) => setDentistDegree(e.target.value)}
                  placeholder="e.g. D.M.D., Orthodontics"
                  className="w-full p-2.5 rounded-xl bg-[#F5F6F8] border border-gray-200 text-[#2B2D33] font-semibold focus:outline-none focus:border-[#1E88C7]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-[#767B87] uppercase tracking-wider block mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#F5F6F8] border border-gray-200 text-[#2B2D33] font-semibold focus:outline-none focus:border-[#1E88C7]"
                />
              </div>

              <div>
                <label className="font-bold text-[#767B87] uppercase tracking-wider block mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#F5F6F8] border border-gray-200 text-[#2B2D33] font-semibold focus:outline-none focus:border-[#1E88C7]"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-[#767B87] uppercase tracking-wider block mb-1">
                Clinic Address
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-[#F5F6F8] border border-gray-200 text-[#2B2D33] font-semibold focus:outline-none focus:border-[#1E88C7]"
              />
            </div>
          </div>
        </div>

        {/* Currency & Preferences */}
        <div className="bg-white rounded-2xl p-5 shadow-2xs border border-gray-100 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-gray-100 text-[#1E88C7]">
            <DollarSign size={20} />
            <h3 className="font-extrabold text-sm text-[#2B2D33]">Financial & Device Integration</h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-[#767B87] uppercase tracking-wider block mb-1">
                  Currency Code
                </label>
                <select
                  value={currency}
                  onChange={(e) => {
                    const c = e.target.value;
                    setCurrency(c);
                    if (c === 'PHP') setCurrencySymbol('₱');
                    else if (c === 'USD') setCurrencySymbol('$');
                    else if (c === 'EUR') setCurrencySymbol('€');
                    else if (c === 'GBP') setCurrencySymbol('£');
                    else setCurrencySymbol('$');
                  }}
                  className="w-full p-2.5 rounded-xl bg-[#F5F6F8] border border-gray-200 text-[#2B2D33] font-semibold focus:outline-none focus:border-[#1E88C7]"
                >
                  <option value="PHP">PHP (Philippine Peso)</option>
                  <option value="USD">USD (US Dollar)</option>
                  <option value="EUR">EUR (Euro)</option>
                  <option value="GBP">GBP (British Pound)</option>
                  <option value="AUD">AUD (Australian Dollar)</option>
                  <option value="CAD">CAD (Canadian Dollar)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-[#767B87] uppercase tracking-wider block mb-1">
                  Symbol Display
                </label>
                <input
                  type="text"
                  value={currencySymbol}
                  onChange={(e) => setCurrencySymbol(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#F5F6F8] border border-gray-200 text-[#2B2D33] font-semibold focus:outline-none focus:border-[#1E88C7]"
                />
              </div>
            </div>

            <div className="pt-2">
              <label className="flex items-center gap-3 cursor-pointer p-2 rounded-xl hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={calendarSyncEnabled}
                  onChange={(e) => setCalendarSyncEnabled(e.target.checked)}
                  className="w-4 h-4 rounded text-[#1E88C7] focus:ring-[#1E88C7]"
                />
                <div>
                  <span className="font-bold text-[#2B2D33] block">
                    Sync Appointments to Native Device Calendar
                  </span>
                  <span className="text-[11px] text-[#767B87]">
                    Allows exporting calendar .ics files and two-way integration
                  </span>
                </div>
              </label>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-[#1E88C7] hover:bg-[#186ea3] text-white text-xs font-bold shadow-xs flex items-center justify-center gap-2 active:scale-98 transition-all"
            >
              <Save size={16} />
              <span>Save Practice Settings</span>
            </button>
          </div>
        </div>
      </form>

      {/* Data Management & Export */}
      <div className="bg-white rounded-2xl p-5 shadow-2xs border border-gray-100 space-y-3">
        <div className="flex items-center gap-2 pb-2 border-b border-gray-100 text-[#767B87]">
          <Shield size={20} />
          <h3 className="font-extrabold text-sm text-[#2B2D33]">Data Management & Portability</h3>
        </div>

        <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
          <button
            onClick={handleExportDataJSON}
            className="flex-1 py-2.5 px-3 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2 transition-colors"
          >
            <Download size={15} />
            <span>Export Practice JSON</span>
          </button>

          <button
            onClick={handleResetData}
            className="flex-1 py-2.5 px-3 rounded-xl border border-red-200 text-xs font-bold text-[#C0392B] hover:bg-red-50 flex items-center justify-center gap-2 transition-colors"
          >
            <RotateCcw size={15} />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </div>
    </div>
  );
};
