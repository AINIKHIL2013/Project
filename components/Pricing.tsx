
import React from 'react';
import { UserPlan } from '../types';

interface PricingProps {
  onStart: () => void;
  onSelectPlan: (plan: UserPlan, price: number) => void;
}

const Pricing: React.FC<PricingProps> = ({ onStart, onSelectPlan }) => {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 animate-fadeIn">
      
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">
          Stop Wasting Money on <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">Expensive Lawyers</span>.
        </h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto">
          Generate lawyer-grade NDAs in seconds. Compliant with the Indian Contract Act, 1872. 
          Choose a plan that scales with your business speed.
        </p>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        
        {/* Tier 1: Free */}
        <div className="bg-slate-900/50 border border-slate-700 rounded-2xl p-6 flex flex-col relative overflow-hidden group hover:border-slate-500 transition-all">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-white">Free Tier</h3>
            <div className="text-3xl font-bold text-white mt-2">₹0</div>
            <p className="text-slate-500 text-sm mt-1">Forever free</p>
          </div>
          <ul className="space-y-3 mb-8 flex-1">
            <FeatureItem text="1 NDA per month" />
            <FeatureItem text="Basic Clause Set" />
            <FeatureItem text="Text-only export" />
            <FeatureItem text="HYRON Branding" />
            <FeatureItem text="Phone Verification" disabled />
          </ul>
          <button 
            onClick={() => onSelectPlan('Free', 0)}
            className="w-full py-2 rounded-lg border border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors text-sm font-medium"
          >
            Try for Free
          </button>
        </div>

        {/* Tier 2: Pay-Per-NDA */}
        <div className="bg-slate-900 border border-blue-500/50 rounded-2xl p-6 flex flex-col relative overflow-hidden group hover:shadow-lg hover:shadow-blue-900/20 transition-all transform hover:-translate-y-1">
          <div className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg uppercase tracking-wider">
            Flexible
          </div>
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-blue-400">Pay-Per-NDA</h3>
            <div className="text-3xl font-bold text-white mt-2">₹200</div>
            <p className="text-slate-500 text-sm mt-1">per document</p>
          </div>
          <p className="text-xs text-slate-400 mb-4 italic">
            "A lawyer charges ₹3,000+. This is a no-brainer."
          </p>
          <ul className="space-y-3 mb-8 flex-1">
            <FeatureItem text="Full Professional NDA" highlight />
            <FeatureItem text="All Clauses Unlocked" highlight />
            <FeatureItem text="PDF Export" highlight />
            <FeatureItem text="Commercial Use Allowed" highlight />
            <FeatureItem text="Instant Download" />
          </ul>
          <button 
            onClick={onStart}
            className="w-full py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-500 transition-colors text-sm font-bold shadow-lg shadow-blue-500/25"
          >
            Draft Now
          </button>
        </div>

        {/* Tier 3: Starter */}
        <div className="bg-slate-900/50 border border-slate-700 rounded-2xl p-6 flex flex-col relative overflow-hidden group hover:border-slate-500 transition-all">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-white">Starter Plan</h3>
            <div className="text-3xl font-bold text-white mt-2">₹499</div>
            <p className="text-slate-500 text-sm mt-1">per month</p>
          </div>
          <p className="text-xs text-slate-400 mb-4">
            Perfect for freelancers & startups.
          </p>
          <ul className="space-y-3 mb-8 flex-1">
            <FeatureItem text="20 NDAs / month" />
            <FeatureItem text="₹25 per NDA (Huge Value)" highlight />
            <FeatureItem text="Editable Fields" />
            <FeatureItem text="PDF + DOCX Export" />
            <FeatureItem text="No Branding" />
          </ul>
          <button 
            onClick={() => onSelectPlan('Starter', 499)}
            className="w-full py-2 rounded-lg bg-slate-800 text-white hover:bg-slate-700 border border-slate-700 hover:border-slate-600 text-sm font-medium transition-all"
          >
            Subscribe
          </button>
        </div>

        {/* Tier 4: Pro Business */}
        <div className="bg-gradient-to-b from-slate-800 to-slate-900 border border-indigo-500/50 rounded-2xl p-6 flex flex-col relative overflow-hidden group hover:shadow-xl hover:shadow-indigo-900/20 transition-all transform hover:-translate-y-2">
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
          <div className="mb-4 pt-2">
            <h3 className="text-lg font-semibold text-indigo-400">Pro Business</h3>
            <div className="text-3xl font-bold text-white mt-2">₹1,999</div>
            <p className="text-slate-500 text-sm mt-1">per month</p>
          </div>
          <ul className="space-y-3 mb-8 flex-1">
            <FeatureItem text="Unlimited NDAs" highlight />
            <FeatureItem text="Custom Templates" />
            <FeatureItem text="Team Access (Multi-user)" />
            <FeatureItem text="Fastest Generation Priority" />
            <FeatureItem text="Audit Logs" />
            <FeatureItem text="Clause Editor" />
          </ul>
          <button 
            disabled
            className="w-full py-2 rounded-lg bg-slate-800 text-slate-400 border border-slate-700 cursor-not-allowed text-sm font-medium transition-all"
          >
            Professional Coming Soon
          </button>
        </div>

        {/* Tier 5: Lifetime */}
        <div className="bg-slate-950 border border-amber-500/30 rounded-2xl p-6 flex flex-col relative overflow-hidden group">
          <div className="absolute -right-8 top-6 bg-amber-500 text-black text-[9px] font-bold px-8 py-1 rotate-45 uppercase tracking-wider shadow-lg">
            Best Value
          </div>
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-amber-500">Lifetime Deal</h3>
            <div className="text-3xl font-bold text-white mt-2">₹9,000</div>
            <p className="text-slate-500 text-sm mt-1">one-time payment</p>
            <p className="text-red-500 text-xs font-bold mt-2 animate-pulse">(only 8 available)</p>
          </div>
          <p className="text-xs text-slate-400 mb-4">
            Never pay for an NDA again.
          </p>
          <ul className="space-y-3 mb-8 flex-1">
            <FeatureItem text="Unlimited Access Forever" highlight />
            <FeatureItem text="No Monthly Fees" highlight />
            <FeatureItem text="All Pro Features Included" />
            <FeatureItem text="Priority Support" />
            <FeatureItem text="Early Access to New Tools" />
          </ul>
          <button 
            onClick={() => onSelectPlan('Lifetime', 9000)}
            className="w-full py-2 rounded-lg bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white border border-amber-600/50 text-sm font-bold shadow-lg shadow-amber-500/20 transition-all"
          >
            Claim Spot
          </button>
        </div>

      </div>

      <div className="mt-16 text-center border-t border-slate-800 pt-10">
        <h3 className="text-xl font-bold text-white mb-4">Why Businesses Trust HYRON AI</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto text-left">
          <div className="p-4">
            <div className="text-blue-500 font-bold mb-2">⚡️ 10x Faster</div>
            <p className="text-sm text-slate-400">Skip the law firm wait times. Get your document immediately when the deal is hot.</p>
          </div>
          <div className="p-4">
            <div className="text-blue-500 font-bold mb-2">🛡️ Legally Robust</div>
            <p className="text-sm text-slate-400">Trained on thousands of Indian contracts to ensure jurisdiction compliance.</p>
          </div>
          <div className="p-4">
            <div className="text-blue-500 font-bold mb-2">💰 90% Cheaper</div>
            <p className="text-sm text-slate-400">Save thousands of rupees per contract compared to traditional legal fees.</p>
          </div>
        </div>
      </div>

    </div>
  );
};

const FeatureItem = ({ text, highlight = false, disabled = false }: { text: string, highlight?: boolean, disabled?: boolean }) => (
  <li className={`flex items-start space-x-3 text-sm ${disabled ? 'opacity-50 line-through' : ''}`}>
    <svg className={`w-5 h-5 flex-shrink-0 ${highlight ? 'text-blue-400' : 'text-slate-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
    <span className={highlight ? 'text-slate-200 font-medium' : 'text-slate-400'}>{text}</span>
  </li>
);

export default Pricing;
