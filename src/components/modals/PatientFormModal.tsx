import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, User, Phone, Mail, MapPin, AlertTriangle, Shield, Calendar } from 'lucide-react';
import { Patient } from '../../types';
import { useApp } from '../../context/AppContext';

interface PatientFormModalProps {
  patient?: Patient | null; // If provided, edit mode; else create mode
  isOpen: boolean;
  onClose: () => void;
  onSaved: (patientId: string) => void;
}

export const PatientFormModal: React.FC<PatientFormModalProps> = ({
  patient,
  isOpen,
  onClose,
  onSaved,
}) => {
  const { addPatient, updatePatient, showToast } = useApp();

  const [name, setName] = useState('');
  const [dob, setDob] = useState('1990-01-01');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [phones, setPhones] = useState<string[]>(['']);
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [allergiesText, setAllergiesText] = useState('');
  const [notes, setNotes] = useState('');
  const [insurance, setInsurance] = useState('Direct Cash / Private');
  const [balance, setBalance] = useState('0');

  useEffect(() => {
    if (patient) {
      setName(patient.name);
      setDob(patient.dob);
      setGender(patient.gender);
      setPhones(patient.phone && patient.phone.length > 0 ? patient.phone : ['']);
      setEmail(patient.email || '');
      setAddress(patient.address || '');
      setAllergiesText(patient.allergies ? patient.allergies.join(', ') : '');
      setNotes(patient.notes || '');
      setInsurance(patient.insuranceProvider || 'Direct Cash / Private');
      setBalance(String(patient.balance || 0));
    } else {
      setName('');
      setDob('1992-05-15');
      setGender('Male');
      setPhones(['+63 917 ']);
      setEmail('');
      setAddress('');
      setAllergiesText('');
      setNotes('');
      setInsurance('Direct Cash / Private');
      setBalance('0');
    }
  }, [patient, isOpen]);

  if (!isOpen) return null;

  const handleAddPhone = () => {
    setPhones([...phones, '']);
  };

  const handlePhoneChange = (index: number, val: string) => {
    const updated = [...phones];
    updated[index] = val;
    setPhones(updated);
  };

  const handleRemovePhone = (index: number) => {
    if (phones.length <= 1) return;
    setPhones(phones.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const validPhones = phones.map((p) => p.trim()).filter(Boolean);
    const allergiesList = allergiesText
      .split(',')
      .map((a) => a.trim())
      .filter(Boolean);

    if (patient) {
      // Edit existing
      updatePatient({
        ...patient,
        name: name.trim(),
        dob,
        gender,
        phone: validPhones.length > 0 ? validPhones : ['No phone'],
        email: email.trim() || undefined,
        address: address.trim() || undefined,
        allergies: allergiesList,
        notes: notes.trim(),
        insuranceProvider: insurance.trim(),
        balance: parseFloat(balance) || 0,
      });
      onSaved(patient.id);
    } else {
      // Create new
      const colors = ['#1E88C7', '#9B59D0', '#1E8E5A', '#E67E22', '#34495E'];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];

      const newId = addPatient({
        name: name.trim(),
        dob,
        gender,
        phone: validPhones.length > 0 ? validPhones : ['+63 917 000 0000'],
        email: email.trim() || undefined,
        address: address.trim() || undefined,
        allergies: allergiesList,
        notes: notes.trim(),
        insuranceProvider: insurance.trim(),
        balance: parseFloat(balance) || 0,
        avatarColor: randomColor,
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
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-[#9B59D0] flex items-center justify-center">
              <User size={18} />
            </div>
            <h3 className="font-extrabold text-base text-[#2B2D33]">
              {patient ? 'Edit Patient Record' : 'New Patient Record'}
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
          {/* Full Name */}
          <div>
            <label className="font-bold text-[#767B87] uppercase tracking-wider block mb-1">
              Patient Full Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Maria Clara Santos"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-[#F5F6F8] border border-gray-200 text-[#2B2D33] font-semibold focus:outline-none focus:border-[#1E88C7]"
            />
          </div>

          {/* DOB & Gender */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-[#767B87] uppercase tracking-wider block mb-1">
                Date of Birth *
              </label>
              <input
                type="date"
                required
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-[#F5F6F8] border border-gray-200 text-[#2B2D33] font-semibold focus:outline-none focus:border-[#1E88C7]"
              />
            </div>
            <div>
              <label className="font-bold text-[#767B87] uppercase tracking-wider block mb-1">
                Gender *
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as any)}
                className="w-full p-2.5 rounded-xl bg-[#F5F6F8] border border-gray-200 text-[#2B2D33] font-semibold focus:outline-none focus:border-[#1E88C7]"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* Contact Numbers with "+" icon support */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-bold text-[#767B87] uppercase tracking-wider">
                Contact Number(s) *
              </label>
              <button
                type="button"
                onClick={handleAddPhone}
                className="text-[#1E88C7] font-bold hover:bg-blue-50 px-2 py-0.5 rounded-lg flex items-center gap-1"
              >
                <Plus size={12} />
                <span>Add Number</span>
              </button>
            </div>
            <div className="space-y-1.5">
              {phones.map((phoneVal, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    required
                    placeholder="+63 917 123 4567"
                    value={phoneVal}
                    onChange={(e) => handlePhoneChange(idx, e.target.value)}
                    className="flex-1 p-2.5 rounded-xl bg-[#F5F6F8] border border-gray-200 text-[#2B2D33] font-semibold focus:outline-none focus:border-[#1E88C7]"
                  />
                  {phones.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemovePhone(idx)}
                      className="p-2 text-gray-400 hover:text-red-500 rounded-lg"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Email & Insurance */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-[#767B87] uppercase tracking-wider block mb-1">
                Email Address
              </label>
              <input
                type="email"
                placeholder="patient@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-[#F5F6F8] border border-gray-200 text-[#2B2D33] font-semibold focus:outline-none focus:border-[#1E88C7]"
              />
            </div>
            <div>
              <label className="font-bold text-[#767B87] uppercase tracking-wider block mb-1">
                Insurance / HMO
              </label>
              <input
                type="text"
                placeholder="e.g. Maxicare, PhilHealth, None"
                value={insurance}
                onChange={(e) => setInsurance(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-[#F5F6F8] border border-gray-200 text-[#2B2D33] font-semibold focus:outline-none focus:border-[#1E88C7]"
              />
            </div>
          </div>

          {/* Home Address */}
          <div>
            <label className="font-bold text-[#767B87] uppercase tracking-wider block mb-1">
              Home Address
            </label>
            <input
              type="text"
              placeholder="Unit #, Street, City"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-[#F5F6F8] border border-gray-200 text-[#2B2D33] font-semibold focus:outline-none focus:border-[#1E88C7]"
            />
          </div>

          {/* Known Allergies Alert Field */}
          <div>
            <label className="font-bold text-[#C0392B] uppercase tracking-wider flex items-center gap-1 mb-1">
              <AlertTriangle size={13} />
              <span>Known Drug / Dental Allergies</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Penicillin, Latex, Aspirin (comma-separated)"
              value={allergiesText}
              onChange={(e) => setAllergiesText(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-red-50/50 border border-red-200 text-red-900 font-semibold placeholder-red-300 focus:outline-none focus:border-red-500"
            />
          </div>

          {/* Initial Balance */}
          <div>
            <label className="font-bold text-[#767B87] uppercase tracking-wider block mb-1">
              Current Outstanding Balance
            </label>
            <input
              type="number"
              value={balance}
              onChange={(e) => setBalance(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-[#F5F6F8] border border-gray-200 text-[#2B2D33] font-semibold focus:outline-none focus:border-[#1E88C7]"
            />
          </div>

          {/* Clinical Notes */}
          <div>
            <label className="font-bold text-[#767B87] uppercase tracking-wider block mb-1">
              Clinical Treatment Notes
            </label>
            <textarea
              rows={3}
              placeholder="Treatment goals, chief complaint, follow-up preferences..."
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
              className="px-5 py-2 bg-[#9B59D0] hover:bg-[#8847bd] text-white font-bold rounded-xl shadow-xs transition-all"
            >
              {patient ? 'Save Changes' : 'Create Patient'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
