import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  CreditCard,
  Plus,
  Eye,
  FileSpreadsheet,
  Users,
  Shield,
  UserCheck,
  ChevronDown,
  ArrowUpRight,
  ArrowDownLeft,
  X,
  Trash2,
  Calendar,
  DollarSign,
  Send,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Transaction } from '../types';

interface FinanceScreenProps {
  onOpenAddPayment: () => void;
  onOpenAddExpense: () => void;
  onSelectPatient: (patientId: string) => void;
}

export const FinanceScreen: React.FC<FinanceScreenProps> = ({
  onOpenAddPayment,
  onOpenAddExpense,
  onSelectPatient,
}) => {
  const { transactions, patients, settings, deleteTransaction, showToast } = useApp();

  // Date filter state: 'week' | 'month' | 'all'
  const [dateFilter, setDateFilter] = useState<'week' | 'month' | 'all'>('week');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  // Active view modal state for "View Revenues" or "View Expenses" or Reports
  const [activeModal, setActiveModal] = useState<
    'none' | 'revenues' | 'expenses' | 'income_report' | 'balances' | 'insurance' | 'provider'
  >('none');

  // Filtered transactions
  const filteredTransactions = useMemo(() => {
    const today = new Date();
    return transactions.filter((tx) => {
      if (dateFilter === 'all') return true;
      const txDate = new Date(tx.date);
      if (dateFilter === 'week') {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(today.getDate() - 7);
        return txDate >= oneWeekAgo;
      }
      if (dateFilter === 'month') {
        return (
          txDate.getMonth() === today.getMonth() &&
          txDate.getFullYear() === today.getFullYear()
        );
      }
      return true;
    });
  }, [transactions, dateFilter]);

  const totalRevenue = useMemo(() => {
    return filteredTransactions
      .filter((t) => t.type === 'revenue')
      .reduce((sum, t) => sum + t.amount, 0);
  }, [filteredTransactions]);

  const totalExpense = useMemo(() => {
    return filteredTransactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
  }, [filteredTransactions]);

  // Patients with balance
  const patientsWithBalance = useMemo(() => {
    return patients.filter((p) => (p.balance || 0) > 0);
  }, [patients]);

  // Insurance breakdown
  const insuranceBreakdown = useMemo(() => {
    const map = new Map<string, number>();
    filteredTransactions
      .filter((t) => t.type === 'revenue')
      .forEach((t) => {
        const ins = t.insuranceProvider || 'Direct Cash / Private';
        map.set(ins, (map.get(ins) || 0) + t.amount);
      });
    return Array.from(map.entries()).map(([name, amount]) => ({ name, amount }));
  }, [filteredTransactions]);

  const filterLabel =
    dateFilter === 'week' ? 'This Week' : dateFilter === 'month' ? 'This Month' : 'All Time';

  return (
    <div className="p-4 pb-24 space-y-4 max-w-4xl mx-auto w-full">
      {/* Date Filter Dropdown (Purple pill button per spec) */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-[#767B87]">Filter by Date:</span>
        <div className="relative">
          <button
            onClick={() => setShowFilterDropdown(!showFilterDropdown)}
            className="px-4 py-2 rounded-xl bg-[#9B59D0] text-white text-xs font-bold flex items-center gap-2 shadow-xs hover:bg-[#8847bd] transition-all"
          >
            <span>{filterLabel}</span>
            <ChevronDown size={14} />
          </button>

          {showFilterDropdown && (
            <div className="absolute right-0 top-11 w-44 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-30 text-xs font-semibold text-[#2B2D33] animate-in fade-in zoom-in-95 duration-150">
              <button
                onClick={() => {
                  setDateFilter('week');
                  setShowFilterDropdown(false);
                }}
                className={`w-full text-left px-4 py-2 hover:bg-purple-50 ${
                  dateFilter === 'week' ? 'text-[#9B59D0] font-bold' : ''
                }`}
              >
                This Week
              </button>
              <button
                onClick={() => {
                  setDateFilter('month');
                  setShowFilterDropdown(false);
                }}
                className={`w-full text-left px-4 py-2 hover:bg-purple-50 ${
                  dateFilter === 'month' ? 'text-[#9B59D0] font-bold' : ''
                }`}
              >
                This Month
              </button>
              <button
                onClick={() => {
                  setDateFilter('all');
                  setShowFilterDropdown(false);
                }}
                className={`w-full text-left px-4 py-2 hover:bg-purple-50 ${
                  dateFilter === 'all' ? 'text-[#9B59D0] font-bold' : ''
                }`}
              >
                All Time
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 1. Revenue Summary Card (Green #1E8E5A) */}
      <div className="bg-[#1E8E5A] text-white rounded-2xl p-5 shadow-sm space-y-4 transition-all hover:shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-white/80">Total Revenue</p>
            <p className="text-2xl sm:text-3xl font-black tracking-tight mt-0.5">
              {settings.currency} {totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center">
            <TrendingUp size={26} className="text-white" />
          </div>
        </div>

        {/* Buttons: View Revenues (outlined) & Add Payment (filled) */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <button
            onClick={() => setActiveModal('revenues')}
            className="py-2.5 px-3 rounded-xl border border-white/80 bg-white/10 hover:bg-white/20 active:scale-98 text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
          >
            <Eye size={15} />
            <span>View Revenues</span>
          </button>
          <button
            onClick={onOpenAddPayment}
            className="py-2.5 px-3 rounded-xl bg-white text-[#1E8E5A] hover:bg-white/90 active:scale-98 text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-xs transition-all"
          >
            <Plus size={16} />
            <span>Add Payment</span>
          </button>
        </div>
      </div>

      {/* 2. Expenses Summary Card (Red #C0392B) */}
      <div className="bg-[#C0392B] text-white rounded-2xl p-5 shadow-sm space-y-4 transition-all hover:shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-white/80">Total Expenses</p>
            <p className="text-2xl sm:text-3xl font-black tracking-tight mt-0.5">
              {settings.currency} {totalExpense.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center">
            <CreditCard size={26} className="text-white" />
          </div>
        </div>

        {/* Buttons: View Expenses (outlined) & Add Expense (filled) */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <button
            onClick={() => setActiveModal('expenses')}
            className="py-2.5 px-3 rounded-xl border border-white/80 bg-white/10 hover:bg-white/20 active:scale-98 text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
          >
            <Eye size={15} />
            <span>View Expenses</span>
          </button>
          <button
            onClick={onOpenAddExpense}
            className="py-2.5 px-3 rounded-xl bg-white text-[#C0392B] hover:bg-white/90 active:scale-98 text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-xs transition-all"
          >
            <Plus size={16} />
            <span>Add Expense</span>
          </button>
        </div>
      </div>

      {/* 3. 2x2 Grid of Report Shortcut Tiles (white cards, purple icon + label) */}
      <div className="pt-2">
        <span className="text-xs font-bold text-[#767B87] uppercase tracking-wider block mb-2 px-1">
          Financial Reports
        </span>
        <div className="grid grid-cols-2 gap-3">
          {/* Tile 1: Income Report */}
          <button
            onClick={() => setActiveModal('income_report')}
            className="bg-white rounded-2xl p-4 shadow-2xs border border-gray-100 flex flex-col items-center justify-center text-center gap-2 hover:border-[#9B59D0]/50 hover:shadow-md transition-all group"
          >
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-[#9B59D0] flex items-center justify-center group-hover:bg-[#9B59D0] group-hover:text-white transition-all">
              <FileSpreadsheet size={24} />
            </div>
            <span className="text-xs font-bold text-[#2B2D33] group-hover:text-[#9B59D0] transition-colors">
              Income Report
            </span>
          </button>

          {/* Tile 2: Patients With Balance */}
          <button
            onClick={() => setActiveModal('balances')}
            className="bg-white rounded-2xl p-4 shadow-2xs border border-gray-100 flex flex-col items-center justify-center text-center gap-2 hover:border-[#9B59D0]/50 hover:shadow-md transition-all group"
          >
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-[#9B59D0] flex items-center justify-center group-hover:bg-[#9B59D0] group-hover:text-white transition-all">
              <Users size={24} />
            </div>
            <span className="text-xs font-bold text-[#2B2D33] group-hover:text-[#9B59D0] transition-colors">
              Patients With Balance
            </span>
          </button>

          {/* Tile 3: Income Report Per Insurance */}
          <button
            onClick={() => setActiveModal('insurance')}
            className="bg-white rounded-2xl p-4 shadow-2xs border border-gray-100 flex flex-col items-center justify-center text-center gap-2 hover:border-[#9B59D0]/50 hover:shadow-md transition-all group"
          >
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-[#9B59D0] flex items-center justify-center group-hover:bg-[#9B59D0] group-hover:text-white transition-all">
              <Shield size={24} />
            </div>
            <span className="text-xs font-bold text-[#2B2D33] group-hover:text-[#9B59D0] transition-colors">
              Income Report Per Insurance
            </span>
          </button>

          {/* Tile 4: Income Report Per Dentist */}
          <button
            onClick={() => setActiveModal('provider')}
            className="bg-white rounded-2xl p-4 shadow-2xs border border-gray-100 flex flex-col items-center justify-center text-center gap-2 hover:border-[#9B59D0]/50 hover:shadow-md transition-all group"
          >
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-[#9B59D0] flex items-center justify-center group-hover:bg-[#9B59D0] group-hover:text-white transition-all">
              <UserCheck size={24} />
            </div>
            <span className="text-xs font-bold text-[#2B2D33] group-hover:text-[#9B59D0] transition-colors">
              Income Report Per Dentist
            </span>
          </button>
        </div>
      </div>

      {/* Modals for viewing Transactions or Detailed Reports */}
      {activeModal !== 'none' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setActiveModal('none')}
          />

          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl p-5 z-10 max-h-[85vh] flex flex-col animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-extrabold text-base text-[#2B2D33]">
                {activeModal === 'revenues'
                  ? 'Revenue Transactions'
                  : activeModal === 'expenses'
                  ? 'Expense Log'
                  : activeModal === 'income_report'
                  ? 'Income Breakdown Report'
                  : activeModal === 'balances'
                  ? 'Patients With Outstanding Balance'
                  : activeModal === 'insurance'
                  ? 'Revenue by Insurance Provider'
                  : 'Revenue by Clinician / Provider'}
              </h3>
              <button
                onClick={() => setActiveModal('none')}
                className="p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="py-4 space-y-3 flex-1 overflow-y-auto">
              {/* REVENUES MODAL */}
              {activeModal === 'revenues' && (
                <div className="space-y-2">
                  {filteredTransactions.filter((t) => t.type === 'revenue').length === 0 ? (
                    <p className="text-xs text-[#767B87] italic text-center py-6">
                      No revenue transactions found for {filterLabel}.
                    </p>
                  ) : (
                    filteredTransactions
                      .filter((t) => t.type === 'revenue')
                      .map((tx) => (
                        <div
                          key={tx.id}
                          className="p-3 rounded-xl bg-[#F5F6F8] flex items-center justify-between text-xs"
                        >
                          <div>
                            <p className="font-bold text-[#2B2D33]">{tx.patientName || 'Direct Revenue'}</p>
                            <p className="text-[#767B87]">{tx.category} • {tx.paymentMethod}</p>
                            <p className="text-[10px] text-[#767B87]/80">{tx.date}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="font-extrabold text-sm text-[#1E8E5A]">
                              +{settings.currencySymbol}{tx.amount.toLocaleString()}
                            </span>
                            <button
                              onClick={() => deleteTransaction(tx.id)}
                              className="text-gray-400 hover:text-red-500"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      ))
                  )}
                </div>
              )}

              {/* EXPENSES MODAL */}
              {activeModal === 'expenses' && (
                <div className="space-y-2">
                  {filteredTransactions.filter((t) => t.type === 'expense').length === 0 ? (
                    <p className="text-xs text-[#767B87] italic text-center py-6">
                      No expense records found for {filterLabel}.
                    </p>
                  ) : (
                    filteredTransactions
                      .filter((t) => t.type === 'expense')
                      .map((tx) => (
                        <div
                          key={tx.id}
                          className="p-3 rounded-xl bg-[#F5F6F8] flex items-center justify-between text-xs"
                        >
                          <div>
                            <p className="font-bold text-[#2B2D33]">{tx.category}</p>
                            <p className="text-[#767B87]">{tx.paymentMethod || 'Cash'} • {tx.date}</p>
                            {tx.note && <p className="text-[10px] text-[#767B87]/80">{tx.note}</p>}
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="font-extrabold text-sm text-[#C0392B]">
                              -{settings.currencySymbol}{tx.amount.toLocaleString()}
                            </span>
                            <button
                              onClick={() => deleteTransaction(tx.id)}
                              className="text-gray-400 hover:text-red-500"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      ))
                  )}
                </div>
              )}

              {/* PATIENTS WITH BALANCE */}
              {activeModal === 'balances' && (
                <div className="space-y-2">
                  {patientsWithBalance.length === 0 ? (
                    <p className="text-xs text-[#767B87] italic text-center py-6">
                      Great job! No patients currently have an outstanding balance.
                    </p>
                  ) : (
                    patientsWithBalance.map((p) => (
                      <div
                        key={p.id}
                        className="p-3 rounded-xl bg-[#F5F6F8] flex items-center justify-between text-xs"
                      >
                        <div>
                          <p className="font-bold text-[#2B2D33]">{p.name}</p>
                          <p className="text-[#767B87]">{p.phone[0] || 'No phone'}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-extrabold text-sm text-amber-700 bg-amber-100 px-2 py-0.5 rounded-lg">
                            {settings.currencySymbol}{p.balance}
                          </span>
                          <button
                            onClick={() => {
                              showToast(`Payment reminder SMS sent to ${p.name}`, 'success');
                            }}
                            className="p-1.5 rounded-lg bg-[#1E88C7] text-white hover:bg-[#186ea3]"
                            title="Send SMS balance reminder"
                          >
                            <Send size={13} />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* INCOME REPORT / INSURANCE / PROVIDER */}
              {(activeModal === 'income_report' ||
                activeModal === 'insurance' ||
                activeModal === 'provider') && (
                <div className="space-y-4 text-xs">
                  <div className="bg-blue-50/60 p-3.5 rounded-2xl border border-blue-100 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-700">Gross Clinic Production</p>
                      <p className="text-lg font-black text-[#1E88C7]">
                        {settings.currency} {totalRevenue.toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-700">Net Profit Margin</p>
                      <p className="text-lg font-black text-[#1E8E5A]">
                        {settings.currency} {Math.max(0, totalRevenue - totalExpense).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="font-bold text-gray-600 uppercase tracking-wider text-[11px]">
                      Breakdown Distribution
                    </span>
                    {insuranceBreakdown.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-xl bg-gray-50 flex items-center justify-between"
                      >
                        <span className="font-semibold text-gray-800">{item.name}</span>
                        <span className="font-bold text-[#1E8E5A]">
                          {settings.currencySymbol}{item.amount.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => setActiveModal('none')}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-xs font-bold text-gray-700 rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
