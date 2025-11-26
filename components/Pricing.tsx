
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
        </p>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        
        {/* Tier 1: Sample */}
        <div className="bg-slate-900/50 border border-slate-700 rounded-2xl p-6 flex flex-col relative overflow-hidden group hover:border-slate-500 transition-all">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-white">Sample Tier</h3>
            <div className="text-3xl font-bold text-white mt-2">₹0</div>
            <p className="text-slate-500 text-sm mt-1">Try before you buy</p>
          </div>
          <ul className="space-y-3 mb-8 flex-1">
            <FeatureItem text="1 NDA per month" />
            <FeatureItem text="Watermarked PDF & DOCX" />
            <FeatureItem text="Phone Verification Req" />
          </ul>
          <button 
            onClick={() => onSelectPlan('Sample', 0)}
            className="w-full py-2 rounded-lg border border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors text-sm font-medium"
          >
            Try Sample
          </button>
        </div>

        {/* Tier 2: Pay-Per-NDA */}
        <div className="bg-slate-900 border border-blue-500/50 rounded-2xl p-6 flex flex-col relative overflow-hidden group hover:shadow-lg hover:shadow-blue-900/20 transition-all transform hover:-translate-y-1">
          <div className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg uppercase tracking-wider">
            Popular
          </div>
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-blue-400">Pay-Per-NDA</h3>
            <div className="text-3xl font-bold text-white mt-2">₹200</div>
            <p className="text-slate-500 text-sm mt-1">per document</p>
          </div>
          <ul className="space-y-3 mb-8 flex-1">
            <FeatureItem text="Professional NDA" highlight />
            <FeatureItem text="No Watermark" highlight />
            <FeatureItem text="PDF + DOCX Export" highlight />
            <FeatureItem text="Commercial Use" highlight />
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
          <ul className="space-y-3 mb-8 flex-1">
            <FeatureItem text="5 NDAs / month" highlight />
            <FeatureItem text="Unbranded Export" />
            <FeatureItem text="Editable Fields" />
            <FeatureItem text="PDF + DOCX Export" />
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
            <FeatureItem text="20 NDAs / month" highlight />
            <FeatureItem text="Custom Templates" />
            <FeatureItem text="Team Access" />
            <FeatureItem text="Priority Generation" />
          </ul>
          <button 
            disabled
            className="w-full py-2 rounded-lg bg-slate-800 text-slate-400 border border-slate-700 text-sm font-medium transition-all cursor-not-allowed opacity-75"
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
          <ul className="space-y-3 mb-8 flex-1">
            <FeatureItem text="Unlimited Access Forever" highlight />
            <FeatureItem text="All Pro Features" />
            <FeatureItem text="Priority Support" />
          </ul>
          <button 
            disabled
            className="w-full py-2 rounded-lg bg-slate-800 text-slate-400 border border-slate-700 text-sm font-medium transition-all cursor-not-allowed opacity-75"
          >
            Claim Spot
          </button>
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
