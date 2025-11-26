
import React, { useState, useEffect } from 'react';
import Questionnaire from './components/Questionnaire';
import NDADisplay from './components/NDADisplay';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Pricing from './components/Pricing';
import { generateNDADocument } from './services/geminiService';
import { loginWithGoogle, logout, getCurrentUser, upgradeUserPlan, incrementFreeDocsUsage } from './services/authService';
import { saveDocument, getUserDocuments, deleteDocument } from './services/storageService';
import { NDAFormData, INITIAL_FORM_DATA, User, SavedDocument, UserPlan } from './types';
import PaymentModal from './components/PaymentModal';

type ViewState = 'login' | 'dashboard' | 'create' | 'view' | 'pricing';
type AccessLevel = 'locked' | 'view-only' | 'full';

const App: React.FC = () => {
  // Auth State
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // App View State
  const [view, setView] = useState<ViewState>('pricing');
  
  // Data State
  const [formData, setFormData] = useState<NDAFormData>(INITIAL_FORM_DATA);
  const [ndaResult, setNdaResult] = useState<string | null>(null);
  const [userDocs, setUserDocs] = useState<SavedDocument[]>([]);
  
  // Payment State
  const [docAccessLevel, setDocAccessLevel] = useState<AccessLevel>('locked');
  const [showPlanPayment, setShowPlanPayment] = useState<{plan: UserPlan, price: number} | null>(null);
  const [pendingPlanSelection, setPendingPlanSelection] = useState<{plan: UserPlan, price: number} | null>(null);
  
  // UI State
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize Auth
  useEffect(() => {
    const storedUser = getCurrentUser();
    if (storedUser) {
      setUser(storedUser);
      setView('dashboard');
    } else {
      setView('pricing');
    }
    setIsAuthLoading(false);
  }, []);

  useEffect(() => {
    if (user) {
      loadDocuments();
    }
  }, [user]);

  const loadDocuments = () => {
    if (user) {
      setUserDocs(getUserDocuments(user.id));
    }
  };

  const handleLogin = async (loggedInUser: User) => {
    setUser(loggedInUser);
    
    // If the user was trying to buy a plan, redirect them to payment now
    if (pendingPlanSelection) {
      setShowPlanPayment(pendingPlanSelection);
      setPendingPlanSelection(null);
      setView('pricing'); // Stay on pricing/dashboard view to show modal
    } else {
      setView('dashboard');
    }
  };

  const handleLogout = async () => {
    await logout();
    setUser(null);
    setView('pricing');
    setFormData(INITIAL_FORM_DATA);
    setNdaResult(null);
    setDocAccessLevel('locked');
    setShowPlanPayment(null);
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);
    
    // Default locked
    let access: AccessLevel = 'locked';

    if (user) {
      if (['Starter', 'Pro', 'Lifetime'].includes(user.plan)) {
        // Paid plans always get full access
        access = 'full';
      } else if (user.plan === 'Free') {
        // Free tier logic: 1 free doc per month (simulated as total usage here)
        if (user.freeDocsUsed < 1) {
          access = 'view-only'; // Can see text, but cannot download PDF
          const updatedUser = incrementFreeDocsUsage();
          if (updatedUser) setUser(updatedUser);
        } else {
          access = 'locked'; // Quota exceeded
        }
      }
    }
    
    setDocAccessLevel(access);

    try {
      const result = await generateNDADocument(formData);
      setNdaResult(result);
      setView('view');
    } catch (err) {
      setError("We encountered an issue connecting to HYRON's core. Please verify your API key and network connection.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = () => {
    if (user && ndaResult) {
      // Logic adjustment: saving a "locked" doc is fine, but when opening it later, 
      // we need to respect if it was paid for. For now, we assume saving assumes ownership 
      // if access was > locked.
      const savedDoc = saveDocument(user.id, formData, ndaResult);
      // Mark as paid in storage if full access was granted
      if (docAccessLevel === 'full') {
        // In a real app we'd update the doc record
      }
      loadDocuments();
    }
  };

  const handleOpenDoc = (doc: SavedDocument) => {
    setFormData(doc.formData);
    setNdaResult(doc.content);
    // If opening a saved doc, we assume full access if they are on a paid plan
    // Or if the doc was previously paid for (needs isPaid flag in doc).
    // For simplicity in this demo:
    if (user && ['Starter', 'Pro', 'Lifetime'].includes(user.plan)) {
        setDocAccessLevel('full');
    } else {
        // If free user opens old doc, they might have used their free credit.
        // Let's grant full access to saved documents for simplicity, 
        // assuming they unlocked it before saving.
        setDocAccessLevel('full');
    }
    setView('view');
  };

  const handleDeleteDoc = (id: string) => {
    if (window.confirm("Are you sure you want to delete this document?")) {
      deleteDocument(id);
      loadDocuments();
    }
  };

  const handleReset = () => {
    setNdaResult(null);
    setFormData(INITIAL_FORM_DATA);
    setDocAccessLevel('locked');
    setError(null);
    setView('create');
  };

  const navigateToDashboard = () => {
    setNdaResult(null);
    setFormData(INITIAL_FORM_DATA);
    setDocAccessLevel('locked');
    setView('dashboard');
  };

  const handleStartDrafting = () => {
    if (user) {
      handleReset();
    } else {
      setView('login');
    }
  };

  const handleSelectPlan = (plan: UserPlan, price: number) => {
    if (plan === 'Free') {
      if (!user) setView('login');
      else navigateToDashboard();
      return;
    }

    if (!user) {
      // User needs to login first, then we show payment
      setPendingPlanSelection({ plan, price });
      setView('login');
    } else {
      setShowPlanPayment({ plan, price });
    }
  };

  const handlePlanPaymentSuccess = () => {
    if (showPlanPayment) {
      if (['Starter', 'Pro', 'Lifetime'].includes(showPlanPayment.plan)) {
        const updatedUser = upgradeUserPlan(showPlanPayment.plan as any);
        if (updatedUser) setUser(updatedUser);
      }
      setShowPlanPayment(null);
      alert(`Successfully subscribed to ${showPlanPayment.plan} Plan!`);
      navigateToDashboard();
    }
  };

  const handleDocPaymentSuccess = () => {
    setDocAccessLevel('full');
  };

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-blue-500/30">
      
      {/* Payment Modal for Plans */}
      {showPlanPayment && (
        <PaymentModal
          amount={showPlanPayment.price}
          description={`${showPlanPayment.plan} Plan Subscription`}
          onClose={() => setShowPlanPayment(null)}
          onSuccess={handlePlanPaymentSuccess}
        />
      )}

      {/* Background Decor */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-900/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-900/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        
        {/* Navigation */}
        <nav className="w-full border-b border-slate-800 bg-slate-950/50 backdrop-blur-md sticky top-0 z-50">
           <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
              <div 
                className="flex items-center space-x-2 cursor-pointer"
                onClick={() => user ? navigateToDashboard() : setView('pricing')}
              >
                 <span className="text-xl font-bold tracking-tighter text-white">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">HYRON</span> AI
                 </span>
                 <span className="text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded border border-slate-700">INDIA</span>
              </div>
              
              <div className="flex items-center space-x-6">
                 {/* Public Nav Items */}
                 <button 
                  onClick={() => setView('pricing')}
                  className={`text-sm font-medium transition-colors ${view === 'pricing' ? 'text-blue-400' : 'text-slate-400 hover:text-white'}`}
                 >
                   Pricing
                 </button>

                 {user ? (
                   <>
                     <button 
                      onClick={navigateToDashboard}
                      className={`text-sm font-medium transition-colors ${view === 'dashboard' ? 'text-blue-400' : 'text-slate-400 hover:text-white'}`}
                     >
                       Dashboard
                     </button>
                     <button 
                      onClick={handleReset}
                      className={`text-sm font-medium transition-colors ${view === 'create' ? 'text-blue-400' : 'text-slate-400 hover:text-white'}`}
                     >
                       New NDA
                     </button>
                     <div className="h-6 w-px bg-slate-800 hidden md:block"></div>
                     <div className="flex items-center space-x-3">
                       <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full border border-slate-700 hidden md:block" />
                       <div className="hidden md:flex flex-col items-end">
                         <span className="text-xs font-semibold text-white">{user.name}</span>
                         <span className="text-[10px] text-blue-400 uppercase tracking-wider flex items-center gap-1">
                            {user.plan}
                            {user.plan === 'Free' && (
                                <span className={`text-[9px] px-1 rounded ${user.freeDocsUsed < 1 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                    {Math.max(0, 1 - (user.freeDocsUsed || 0))} left
                                </span>
                            )}
                         </span>
                       </div>
                       <button 
                          onClick={handleLogout}
                          className="text-xs text-slate-500 hover:text-red-400 transition-colors ml-2"
                       >
                         Sign Out
                       </button>
                     </div>
                   </>
                 ) : (
                    <button 
                      onClick={() => setView('login')}
                      className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      Sign In
                    </button>
                 )}
              </div>
           </div>
        </nav>

        {/* Main Content Area */}
        <main className="flex-grow flex flex-col items-center justify-center p-4 md:p-8">
          
          {error && (
            <div className="w-full max-w-xl bg-red-500/10 border border-red-500/50 text-red-200 px-6 py-4 rounded-lg mb-8 text-center animate-pulse">
              {error}
            </div>
          )}

          {view === 'pricing' && (
            <Pricing 
              onStart={handleStartDrafting} 
              onSelectPlan={handleSelectPlan}
            />
          )}

          {view === 'login' && (
            <Login onLogin={handleLogin} isLoading={isAuthLoading} />
          )}

          {view === 'dashboard' && user && (
            <Dashboard 
              user={user}
              documents={userDocs}
              onNew={handleReset}
              onOpen={handleOpenDoc}
              onDelete={handleDeleteDoc}
            />
          )}

          {view === 'create' && (
            <div className="w-full flex justify-center">
              <Questionnaire 
                formData={formData} 
                setFormData={setFormData} 
                onGenerate={handleGenerate}
                isGenerating={isGenerating}
              />
            </div>
          )}

          {view === 'view' && ndaResult && (
            <NDADisplay 
              content={ndaResult} 
              onReset={handleReset}
              onSave={user ? handleSave : undefined}
              accessLevel={docAccessLevel}
              onPaymentSuccess={handleDocPaymentSuccess}
            />
          )}

        </main>
      </div>
    </div>
  );
};

export default App;
