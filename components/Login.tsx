
import React, { useState } from 'react';
import { User } from '../types';
import { loginWithGoogle, loginWithEmail, signupWithEmail, sendPhoneOTP, verifyPhoneOTP } from '../services/authService';

interface LoginProps {
  onLogin: (user: User) => void;
  isLoading: boolean;
}

type AuthView = 'main' | 'login' | 'signup' | 'google';

const Login: React.FC<LoginProps> = ({ onLogin, isLoading }) => {
  const [view, setView] = useState<AuthView>('main');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form States
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: ''
  });
  
  // Phone Verification State
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [phoneVerified, setPhoneVerified] = useState(false);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      const user = await loginWithEmail(formData.email, formData.password);
      onLogin(user);
    } catch (err: any) {
      setError(err.message || "Login failed");
      setIsSubmitting(false);
    }
  };

  const handleSendOTP = async () => {
    if (!formData.phone || formData.phone.length < 10) {
      setError("Please enter a valid phone number");
      return;
    }
    setIsSubmitting(true);
    setError(null);
    try {
      await sendPhoneOTP(formData.phone);
      setOtpSent(true);
      setIsSubmitting(false);
    } catch (err) {
      setError("Failed to send OTP");
      setIsSubmitting(false);
    }
  };

  const handleVerifyOTP = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      const isValid = await verifyPhoneOTP(otp);
      if (isValid) {
        setPhoneVerified(true);
        setOtpSent(false); // Hide OTP field
      } else {
        setError("Invalid OTP code");
      }
      setIsSubmitting(false);
    } catch (err) {
      setError("Verification failed");
      setIsSubmitting(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneVerified) {
      setError("Please verify your phone number first.");
      return;
    }
    setError(null);
    setIsSubmitting(true);
    try {
      const user = await signupWithEmail(formData);
      onLogin(user);
    } catch (err: any) {
      setError(err.message || "Signup failed");
      setIsSubmitting(false);
    }
  };

  const handleGoogleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.name) {
      setError("Please provide both name and email.");
      return;
    }
    
    setIsSubmitting(true);
    try {
      const user = await loginWithGoogle({ name: formData.name, email: formData.email });
      onLogin(user);
    } catch (error) {
      setError("Google authentication failed");
      setIsSubmitting(false);
    }
  };

  const resetView = (newView: AuthView) => {
    setError(null);
    setFormData({ name: '', email: '', password: '', phone: '' });
    setOtpSent(false);
    setPhoneVerified(false);
    setOtp('');
    setView(newView);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto p-6 animate-fadeIn">
      <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-700 rounded-2xl p-8 shadow-2xl w-full relative overflow-hidden">
        
        {/* Header Branding */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white tracking-tight">
            <span className="text-blue-500">HYRON</span> ACCOUNT
          </h2>
          <p className="text-slate-400 text-xs mt-1 uppercase tracking-widest">Secure Access</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-200 text-sm p-3 rounded-lg mb-6 text-center">
            {error}
          </div>
        )}

        {/* --- MAIN VIEW (3 BUTTONS) --- */}
        {view === 'main' && (
          <div className="space-y-4">
            <button
              onClick={() => resetView('login')}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-blue-500/20"
            >
              Log In
            </button>
            <button
              onClick={() => resetView('signup')}
              className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 rounded-xl transition-all border border-slate-700"
            >
              Sign Up
            </button>
            
            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-slate-900 text-slate-500">or</span>
              </div>
            </div>

            <button
              onClick={() => resetView('google')}
              className="w-full bg-white hover:bg-slate-100 text-slate-900 font-bold py-3 rounded-xl transition-all flex items-center justify-center space-x-2"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.26.81-.58z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span>Sign in with Google</span>
            </button>
          </div>
        )}

        {/* --- LOGIN VIEW --- */}
        {view === 'login' && (
          <form onSubmit={handleEmailLogin} className="space-y-4 animate-fadeIn">
            <h3 className="text-xl text-white font-semibold text-center mb-4">Welcome Back</h3>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1 ml-1">Email</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white focus:border-blue-500 outline-none"
                placeholder="name@example.com"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1 ml-1">Password</label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white focus:border-blue-500 outline-none"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl mt-4 transition-all disabled:opacity-50"
            >
              {isSubmitting ? 'Logging in...' : 'Log In'}
            </button>
            <button type="button" onClick={() => resetView('main')} className="w-full text-sm text-slate-500 hover:text-white mt-2">Back</button>
          </form>
        )}

        {/* --- SIGN UP VIEW --- */}
        {view === 'signup' && (
          <form onSubmit={handleSignup} className="space-y-4 animate-fadeIn">
            <h3 className="text-xl text-white font-semibold text-center mb-4">Create Account</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1 ml-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white focus:border-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1 ml-1">Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white focus:border-blue-500 outline-none"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1 ml-1">Password</label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white focus:border-blue-500 outline-none"
              />
            </div>

            {/* PHONE VERIFICATION MODULE */}
            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
               <label className="block text-xs font-medium text-slate-400 mb-1 ml-1">Phone Number (Required)</label>
               <div className="flex gap-2">
                 <input
                   type="tel"
                   placeholder="+91"
                   disabled={phoneVerified || otpSent}
                   value={formData.phone}
                   onChange={e => setFormData({...formData, phone: e.target.value})}
                   className={`flex-1 bg-slate-950 border border-slate-600 rounded-lg px-4 py-2 text-white focus:border-blue-500 outline-none ${phoneVerified ? 'text-green-400 border-green-500' : ''}`}
                 />
                 {!phoneVerified && !otpSent && (
                   <button 
                    type="button" 
                    onClick={handleSendOTP}
                    disabled={isSubmitting}
                    className="bg-slate-700 hover:bg-slate-600 text-white px-3 py-2 rounded-lg text-sm transition-colors"
                   >
                     {isSubmitting ? '...' : 'Verify'}
                   </button>
                 )}
                 {phoneVerified && (
                   <div className="flex items-center justify-center px-3 text-green-400">
                     <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                     </svg>
                   </div>
                 )}
               </div>

               {otpSent && !phoneVerified && (
                 <div className="mt-3 animate-fadeIn">
                   <p className="text-xs text-blue-400 mb-2">Code sent to your phone (Simulated: 8859)</p>
                   <div className="flex gap-2">
                     <input
                       type="text"
                       placeholder="Enter OTP"
                       value={otp}
                       onChange={e => setOtp(e.target.value)}
                       className="flex-1 bg-slate-950 border border-blue-500 rounded-lg px-4 py-2 text-white outline-none"
                     />
                     <button 
                      type="button" 
                      onClick={handleVerifyOTP}
                      className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm"
                     >
                       Confirm
                     </button>
                   </div>
                 </div>
               )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !phoneVerified}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl mt-4 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Creating Account...' : 'Create Account'}
            </button>
            <button type="button" onClick={() => resetView('main')} className="w-full text-sm text-slate-500 hover:text-white mt-2">Back</button>
          </form>
        )}

        {/* --- GOOGLE MOCK VIEW --- */}
        {view === 'google' && (
           <form onSubmit={handleGoogleSubmit} className="space-y-4 animate-fadeIn">
             <h3 className="text-xl text-white font-semibold text-center mb-4">Google Sign-In</h3>
             <div className="p-4 bg-white rounded-lg text-slate-900 mb-4 shadow-inner">
               <div className="flex items-center space-x-3 mb-4 pb-4 border-b border-gray-200">
                 <svg className="w-6 h-6" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/></svg>
                 <span className="font-medium text-gray-700">Continue with Google</span>
               </div>
               <div className="space-y-3">
                 <div>
                   <label className="block text-xs font-bold text-gray-500 mb-1">Name (Simulated)</label>
                   <input
                     type="text"
                     required
                     value={formData.name}
                     onChange={e => setFormData({...formData, name: e.target.value})}
                     className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-blue-500 outline-none"
                     placeholder="Your Name"
                   />
                 </div>
                 <div>
                   <label className="block text-xs font-bold text-gray-500 mb-1">Email (Simulated)</label>
                   <input
                     type="email"
                     required
                     value={formData.email}
                     onChange={e => setFormData({...formData, email: e.target.value})}
                     className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-blue-500 outline-none"
                     placeholder="email@gmail.com"
                   />
                 </div>
               </div>
             </div>
             
             <button
               type="submit"
               disabled={isSubmitting}
               className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-blue-500/20"
             >
               {isSubmitting ? 'Authenticating...' : 'Continue as User'}
             </button>
             <button type="button" onClick={() => resetView('main')} className="w-full text-sm text-slate-500 hover:text-white mt-2">Cancel</button>
           </form>
        )}

        {/* Footer */}
        <div className="mt-8 border-t border-slate-800 pt-4 text-center">
           <p className="text-[10px] text-slate-600">
             By continuing, you agree to HYRON's Terms & Conditions.
           </p>
        </div>

      </div>
    </div>
  );
};

export default Login;
