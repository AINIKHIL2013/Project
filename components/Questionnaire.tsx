
import React, { useState } from 'react';
import { NDAFormData, NDAType } from '../types';

interface QuestionnaireProps {
  formData: NDAFormData;
  setFormData: React.Dispatch<React.SetStateAction<NDAFormData>>;
  onGenerate: () => void;
  isGenerating: boolean;
}

const STEPS = [
  "Parties",
  "Details",
  "Terms",
  "Clauses"
];

const Questionnaire: React.FC<QuestionnaireProps> = ({ formData, setFormData, onGenerate, isGenerating }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const updateField = (field: keyof NDAFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateClause = (clause: keyof NDAFormData['clauses']) => {
    setFormData(prev => ({
      ...prev,
      clauses: { ...prev.clauses, [clause]: !prev.clauses[clause] }
    }));
  };

  const nextStep = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      onGenerate();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const progress = ((currentStep + 1) / STEPS.length) * 100;

  return (
    <div className="w-full max-w-2xl mx-auto bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden">
      {/* Header & Progress */}
      <div className="bg-slate-800 p-6 border-b border-slate-700">
        <h2 className="text-xl font-semibold text-white mb-2">Configure Your NDA</h2>
        <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
          <span>Step {currentStep + 1} of {STEPS.length}</span>
          <span>{STEPS[currentStep]}</span>
        </div>
        <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
          <div 
            className="bg-blue-500 h-full transition-all duration-300 ease-in-out" 
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Form Content */}
      <div className="p-8 min-h-[400px]">
        {currentStep === 0 && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-3">Is this NDA mutual or one-way?</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => updateField('type', 'Mutual')}
                  className={`p-4 rounded-lg border text-center transition-all ${
                    formData.type === 'Mutual' 
                      ? 'border-blue-500 bg-blue-500/10 text-blue-400' 
                      : 'border-slate-700 hover:border-slate-600 text-slate-400'
                  }`}
                >
                  <div className="font-semibold">Mutual</div>
                  <div className="text-xs mt-1 opacity-75">Both parties share secrets</div>
                </button>
                <button
                  onClick={() => updateField('type', 'One-way')}
                  className={`p-4 rounded-lg border text-center transition-all ${
                    formData.type === 'One-way' 
                      ? 'border-blue-500 bg-blue-500/10 text-blue-400' 
                      : 'border-slate-700 hover:border-slate-600 text-slate-400'
                  }`}
                >
                  <div className="font-semibold">One-way</div>
                  <div className="text-xs mt-1 opacity-75">One party shares secrets</div>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Party A Name</label>
                <input
                  type="text"
                  value={formData.partyA}
                  onChange={(e) => updateField('partyA', e.target.value)}
                  placeholder="e.g. Acme Corp"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Party B Name</label>
                <input
                  type="text"
                  value={formData.partyB}
                  onChange={(e) => updateField('partyB', e.target.value)}
                  placeholder="e.g. John Doe"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>
          </div>
        )}

        {currentStep === 1 && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Purpose of Disclosure</label>
              <textarea
                value={formData.purpose}
                onChange={(e) => updateField('purpose', e.target.value)}
                placeholder="Describe why confidential information is being shared (e.g., 'To evaluate a potential business partnership regarding Project X')."
                rows={4}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Effective Date</label>
              <input
                type="date"
                value={formData.effectiveDate}
                onChange={(e) => updateField('effectiveDate', e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Country</label>
                <input
                  type="text"
                  value={formData.country}
                  onChange={(e) => updateField('country', e.target.value)}
                  placeholder="e.g. United States, UK, Germany"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
                <p className="text-xs text-slate-500 mt-2">The country where this NDA will be enforced.</p>
              </div>
               <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Jurisdiction / State</label>
                <input
                  type="text"
                  value={formData.jurisdiction}
                  onChange={(e) => updateField('jurisdiction', e.target.value)}
                  placeholder="e.g. New York, California, London"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Duration of Confidentiality (Years)</label>
              <div className="flex items-center space-x-4">
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="1"
                  value={formData.duration}
                  onChange={(e) => updateField('duration', e.target.value)}
                  className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                <span className="bg-slate-800 border border-slate-700 text-white px-4 py-2 rounded-lg min-w-[3rem] text-center">
                  {formData.duration}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-2">Standard duration is usually between 2 to 5 years.</p>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-4 animate-fadeIn">
            <label className="block text-sm font-medium text-slate-300 mb-2">Additional Clauses</label>
            
            <div 
              onClick={() => updateClause('nonCompete')}
              className={`flex items-start space-x-3 p-4 rounded-lg border cursor-pointer transition-all ${formData.clauses.nonCompete ? 'bg-blue-500/10 border-blue-500' : 'bg-slate-950 border-slate-700 hover:border-slate-600'}`}
            >
              <div className={`mt-1 w-5 h-5 rounded flex items-center justify-center border ${formData.clauses.nonCompete ? 'bg-blue-500 border-blue-500' : 'border-slate-500'}`}>
                {formData.clauses.nonCompete && <CheckIcon />}
              </div>
              <div>
                <div className={`font-medium ${formData.clauses.nonCompete ? 'text-blue-400' : 'text-slate-300'}`}>Non-Compete</div>
                <div className="text-xs text-slate-500">Prevents parties from entering into competition for a set period.</div>
              </div>
            </div>

            <div 
              onClick={() => updateClause('nonSolicitation')}
              className={`flex items-start space-x-3 p-4 rounded-lg border cursor-pointer transition-all ${formData.clauses.nonSolicitation ? 'bg-blue-500/10 border-blue-500' : 'bg-slate-950 border-slate-700 hover:border-slate-600'}`}
            >
              <div className={`mt-1 w-5 h-5 rounded flex items-center justify-center border ${formData.clauses.nonSolicitation ? 'bg-blue-500 border-blue-500' : 'border-slate-500'}`}>
                {formData.clauses.nonSolicitation && <CheckIcon />}
              </div>
              <div>
                <div className={`font-medium ${formData.clauses.nonSolicitation ? 'text-blue-400' : 'text-slate-300'}`}>Non-Solicitation</div>
                <div className="text-xs text-slate-500">Prevents poaching of employees or clients.</div>
              </div>
            </div>

            <div 
              onClick={() => updateClause('ipOwnership')}
              className={`flex items-start space-x-3 p-4 rounded-lg border cursor-pointer transition-all ${formData.clauses.ipOwnership ? 'bg-blue-500/10 border-blue-500' : 'bg-slate-950 border-slate-700 hover:border-slate-600'}`}
            >
               <div className={`mt-1 w-5 h-5 rounded flex items-center justify-center border ${formData.clauses.ipOwnership ? 'bg-blue-500 border-blue-500' : 'border-slate-500'}`}>
                {formData.clauses.ipOwnership && <CheckIcon />}
              </div>
              <div>
                <div className={`font-medium ${formData.clauses.ipOwnership ? 'text-blue-400' : 'text-slate-300'}`}>IP Ownership</div>
                <div className="text-xs text-slate-500">Clarifies who owns developed Intellectual Property.</div>
              </div>
            </div>

            <div 
              onClick={() => updateClause('dataProtection')}
              className={`flex items-start space-x-3 p-4 rounded-lg border cursor-pointer transition-all ${formData.clauses.dataProtection ? 'bg-blue-500/10 border-blue-500' : 'bg-slate-950 border-slate-700 hover:border-slate-600'}`}
            >
               <div className={`mt-1 w-5 h-5 rounded flex items-center justify-center border ${formData.clauses.dataProtection ? 'bg-blue-500 border-blue-500' : 'border-slate-500'}`}>
                {formData.clauses.dataProtection && <CheckIcon />}
              </div>
              <div>
                <div className={`font-medium ${formData.clauses.dataProtection ? 'text-blue-400' : 'text-slate-300'}`}>Data Protection</div>
                <div className="text-xs text-slate-500">Clauses for handling personal data securely (e.g. GDPR, CCPA).</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Navigation */}
      <div className="bg-slate-800 p-6 border-t border-slate-700 flex justify-between items-center">
        <button
          onClick={prevStep}
          disabled={currentStep === 0 || isGenerating}
          className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors ${
            currentStep === 0 ? 'text-slate-600 cursor-not-allowed' : 'text-slate-300 hover:text-white hover:bg-slate-700'
          }`}
        >
          Back
        </button>
        
        <button
          onClick={nextStep}
          disabled={isGenerating}
          className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-2 rounded-lg text-sm font-semibold shadow-lg shadow-blue-500/20 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          {isGenerating ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Drafting...
            </>
          ) : (
            currentStep === STEPS.length - 1 ? 'Generate NDA' : 'Next'
          )}
        </button>
      </div>
    </div>
  );
};

const CheckIcon = () => (
  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
  </svg>
);

export default Questionnaire;
