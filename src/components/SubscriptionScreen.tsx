import React, { useState } from 'react';
import { Check, Sparkles, Zap, Shield, Star, CreditCard } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const SubscriptionScreen: React.FC = () => {
  const { showToast, settings } = useApp();
  const [selectedBilling, setSelectedBilling] = useState<'monthly' | 'annual'>('annual');
  const [currentPlan, setCurrentPlan] = useState<'pro'>('pro');

  const plans = [
    {
      id: 'starter',
      name: 'Starter Practice',
      priceMonthly: 'Free',
      priceAnnual: 'Free',
      description: 'Essential chairside tools for dental residents and new solo dentists.',
      features: [
        'Up to 100 Patient Records',
        'Basic Odontogram Charting',
        'Appointment Booking',
        'Manual Device Backups',
      ],
      current: false,
    },
    {
      id: 'pro',
      name: 'Solo Practice Pro',
      priceMonthly: `${settings.currencySymbol}990/mo`,
      priceAnnual: `${settings.currencySymbol}790/mo`,
      billingNote: 'Billed annually or ₱990 monthly',
      description: 'The complete chairside management engine built for modern solo practitioners.',
      features: [
        'Unlimited Patient Records',
        'Full Adult & Pediatric Odontogram',
        'Device Calendar Integration & .ics export',
        'Direct SMS & WhatsApp Patient Recalls',
        'Financial Bookkeeping & Revenue Reports',
        'Automated Cloud & Local Backups',
        'Priority Technical Support',
      ],
      current: true,
      popular: true,
    },
    {
      id: 'multi',
      name: 'Multi-Chair Clinic',
      priceMonthly: `${settings.currencySymbol}1,990/mo`,
      priceAnnual: `${settings.currencySymbol}1,590/mo`,
      billingNote: 'Billed annually',
      description: 'For growing dental practices with associate dentists and hygienists.',
      features: [
        'Everything in Solo Pro',
        'Multiple Provider Accounts',
        'Dentist-Specific Revenue Allocation',
        'Chair Utilization Analytics',
        'Multi-device Real-Time Sync',
      ],
      current: false,
    },
  ];

  const handleUpgrade = (planName: string) => {
    showToast(`DentalDesk subscription active for ${planName} plan!`, 'success');
  };

  return (
    <div className="p-4 pb-24 space-y-5 max-w-4xl mx-auto w-full">
      {/* Header card */}
      <div className="bg-gradient-to-r from-[#1E88C7] to-[#9B59D0] rounded-3xl p-6 text-white text-center shadow-md">
        <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-xs font-extrabold uppercase tracking-wider inline-block mb-2">
          Practitioner Subscription
        </span>
        <h2 className="text-2xl font-black tracking-tight">Run your practice, chairside.</h2>
        <p className="text-xs text-white/90 max-w-md mx-auto mt-1">
          Simple, transparent pricing tailored for independent solo dentists and clinical practices.
        </p>

        {/* Billing cycle toggle */}
        <div className="mt-5 inline-flex items-center bg-black/20 p-1 rounded-full backdrop-blur-xs">
          <button
            onClick={() => setSelectedBilling('monthly')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
              selectedBilling === 'monthly' ? 'bg-white text-[#2B2D33] shadow-xs' : 'text-white/80'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setSelectedBilling('annual')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
              selectedBilling === 'annual' ? 'bg-white text-[#2B2D33] shadow-xs' : 'text-white/80'
            }`}
          >
            Annual (Save 20%)
          </button>
        </div>
      </div>

      {/* Plans List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`bg-white rounded-3xl p-5 shadow-2xs border transition-all flex flex-col justify-between ${
              plan.popular
                ? 'border-[#9B59D0] ring-2 ring-[#9B59D0]/20 shadow-md relative'
                : 'border-gray-100 hover:border-gray-200'
            }`}
          >
            {plan.popular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[#9B59D0] text-white text-[10px] font-extrabold tracking-wider uppercase shadow-xs">
                Practitioner Choice
              </span>
            )}

            <div>
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-base text-[#2B2D33]">{plan.name}</h3>
                {plan.current && (
                  <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-800 text-[10px] font-bold">
                    Active
                  </span>
                )}
              </div>
              <p className="text-xs text-[#767B87] mt-1">{plan.description}</p>

              <div className="my-4">
                <span className="text-2xl font-black text-[#1E88C7]">
                  {selectedBilling === 'annual' ? plan.priceAnnual : plan.priceMonthly}
                </span>
                {plan.billingNote && (
                  <p className="text-[10px] text-[#767B87] mt-0.5">{plan.billingNote}</p>
                )}
              </div>

              <div className="space-y-2 text-xs text-[#2B2D33] pt-2 border-t border-gray-100">
                {plan.features.map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <Check size={15} className="text-[#1E8E5A] shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6">
              <button
                onClick={() => handleUpgrade(plan.name)}
                className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all shadow-xs active:scale-98 ${
                  plan.current
                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    : plan.popular
                    ? 'bg-[#9B59D0] hover:bg-[#8847bd] text-white'
                    : 'bg-[#1E88C7] hover:bg-[#186ea3] text-white'
                }`}
              >
                {plan.current ? 'Current Plan Active' : `Switch to ${plan.name}`}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
