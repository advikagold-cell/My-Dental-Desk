import React, { useState, useEffect } from 'react';
import { X, DollarSign, Plus, CheckCircle2, TrendingUp, CreditCard } from 'lucide-react';
import { Transaction, Patient } from '../../types';
import { useApp } from '../../context/AppContext';

interface TransactionFormModalProps {
  initialType?: 'revenue' | 'expense';
  defaultPatient?: Patient | null;
  isOpen: boolean;
  onClose: () => void;
}

export const TransactionFormModal: React.FC<TransactionFormModalProps> = ({
  initialType = 'revenue',
  defaultPatient,
  isOpen,
  onClose,
}) => {
  const { patients, addTransaction, settings, showToast } = useApp();

  const [type, setType] = useState<'revenue' | 'expense'>(initialType);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Tooth Extraction / Restorative');
  const [patientId, setPatientId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [note, setNote] = useState('');

  useEffect(() => {
    setType(initialType);
    if (initialType === 'revenue') {
      setCategory('Dental Cleaning & Scaling');
    } else {
      setCategory('Dental Supplies & Composite Materials');
    }
    if (defaultPatient) {
      setPatientId(defaultPatient.id);
    } else if (patients.length > 0) {
      setPatientId(patients[0].id);
    }
    setAmount('');
    setNote('');
  }, [initialType, defaultPatient, isOpen, patients]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) return;

    const patient = patients.find((p) => p.id === patientId);

    addTransaction({
      patientId: type === 'revenue' ? patientId : undefined,
      patientName: type === 'revenue' && patient ? patient.name : undefined,
      type,
      amount: numAmount,
      category,
      paymentMethod,
      date,
      insuranceProvider: patient?.insuranceProvider,
      note: note.trim() || undefined,
    });

    onClose();
  };

  const revenueCategories = [
    'Dental Cleaning & Scaling',
    'Class II Composite Restoration',
    'Tooth Extraction',
    'Root Canal Therapy',
    'Crown & Bridge Fitting',
    'Teeth Whitening Procedure',
    'Consultation & Diagnostics',
  ];

  const expenseCategories = [
    'Dental Supplies & Composite Materials',
    'Dental Lab Fees (Crowns/Dentures)',
    'Sterilization & Autoclave Consumables',
    'Clinic Space Rental / Chair Maintenance',
    'Staff / Dental Assistant Allowance',
    'Utility & Medical Waste Disposal',
  ];

  const paymentMethods = ['Cash', 'GCash / Mobile Wallet', 'Credit Card', 'Bank Transfer', 'HMO / Insurance'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={onClose} />

      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl p-5 z-10 max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center text-white ${
                type === 'revenue' ? 'bg-[#1E8E5A]' : 'bg-[#C0392B]'
              }`}
            >
              {type === 'revenue' ? <TrendingUp size={18} /> : <CreditCard size={18} />}
            </div>
            <h3 className="font-extrabold text-base text-[#2B2D33]">
              {type === 'revenue' ? 'Record Revenue / Payment' : 'Record Practice Expense'}
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
          {/* Type Toggle */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 rounded-xl">
            <button
              type="button"
              onClick={() => {
                setType('revenue');
                setCategory('Dental Cleaning & Scaling');
              }}
              className={`py-2 rounded-lg font-bold transition-all ${
                type === 'revenue' ? 'bg-[#1E8E5A] text-white shadow-xs' : 'text-gray-600'
              }`}
            >
              Revenue (+)
            </button>
            <button
              type="button"
              onClick={() => {
                setType('expense');
                setCategory('Dental Supplies & Composite Materials');
              }}
              className={`py-2 rounded-lg font-bold transition-all ${
                type === 'expense' ? 'bg-[#C0392B] text-white shadow-xs' : 'text-gray-600'
              }`}
            >
              Expense (-)
            </button>
          </div>

          {/* Amount */}
          <div>
            <label className="font-bold text-[#767B87] uppercase tracking-wider block mb-1">
              Amount ({settings.currencySymbol}) *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 font-bold text-gray-500">
                {settings.currencySymbol}
              </span>
              <input
                type="number"
                step="0.01"
                required
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-8 pr-3 py-2.5 rounded-xl bg-[#F5F6F8] border border-gray-200 text-[#2B2D33] font-bold text-base focus:outline-none focus:border-[#1E88C7]"
              />
            </div>
          </div>

          {/* Patient Association (for revenue) */}
          {type === 'revenue' && (
            <div>
              <label className="font-bold text-[#767B87] uppercase tracking-wider block mb-1">
                Patient Record
              </label>
              <select
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-[#F5F6F8] border border-gray-200 text-[#2B2D33] font-semibold focus:outline-none focus:border-[#1E88C7]"
              >
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} {p.balance ? `(Bal: ${settings.currencySymbol}${p.balance})` : ''}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Category */}
          <div>
            <label className="font-bold text-[#767B87] uppercase tracking-wider block mb-1">
              Category / Classification *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-[#F5F6F8] border border-gray-200 text-[#2B2D33] font-semibold focus:outline-none focus:border-[#1E88C7]"
            >
              {(type === 'revenue' ? revenueCategories : expenseCategories).map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Payment Method & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-[#767B87] uppercase tracking-wider block mb-1">
                Payment Method
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-[#F5F6F8] border border-gray-200 text-[#2B2D33] font-semibold focus:outline-none focus:border-[#1E88C7]"
              >
                {paymentMethods.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-bold text-[#767B87] uppercase tracking-wider block mb-1">
                Transaction Date *
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-[#F5F6F8] border border-gray-200 text-[#2B2D33] font-semibold focus:outline-none focus:border-[#1E88C7]"
              />
            </div>
          </div>

          {/* Receipt / Invoice Notes */}
          <div>
            <label className="font-bold text-[#767B87] uppercase tracking-wider block mb-1">
              Receipt / Remarks (Optional)
            </label>
            <input
              type="text"
              placeholder="OR #, Supplier Invoice #, or procedure note..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
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
              className={`px-5 py-2 font-bold text-white rounded-xl shadow-xs transition-all ${
                type === 'revenue'
                  ? 'bg-[#1E8E5A] hover:bg-[#166d45]'
                  : 'bg-[#C0392B] hover:bg-[#962d22]'
              }`}
            >
              Save Transaction
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
