
import React, { useState } from 'react';

interface PaymentModalProps {
  amount: number;
  description?: string;
  onSuccess: () => void;
  onClose: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ amount, description = "Legal Document Generation Fee", onSuccess, onClose }) => {
  const [processing, setProcessing] = useState(false);

  const handlePay = () => {
    setProcessing(true);
    // Simulate payment processing time
    setTimeout(() => {
      setProcessing(false);
      onSuccess();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-white text-slate-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-slate-100 p-6 border-b border-slate-200 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold tracking-tight text-slate-800">
               HYRON <span className="text-blue-600">PAY</span>
            </span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-8">
          <div className="text-center mb-8">
            <p className="text-slate-500 text-sm uppercase tracking-wide font-semibold mb-2">Total Amount</p>
            <h2 className="text-4xl font-bold text-slate-900">₹{amount}</h2>
            <p className="text-slate-400 text-sm mt-2">{description}</p>
          </div>

          <div className="space-y-4 mb-8">
            <div className="flex items-center p-4 border border-slate-200 rounded-lg cursor-pointer hover:border-blue-500 transition-colors bg-slate-50">
              <div className="w-6 h-6 rounded-full border-2 border-blue-500 flex items-center justify-center mr-3">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              </div>
              <div>
                <p className="font-semibold text-sm">UPI / QR Code</p>
                <p className="text-xs text-slate-500">Google Pay, PhonePe, Paytm</p>
              </div>
            </div>
            <div className="flex items-center p-4 border border-slate-200 rounded-lg cursor-pointer hover:border-slate-300 transition-colors opacity-60">
              <div className="w-6 h-6 rounded-full border-2 border-slate-300 mr-3"></div>
              <div>
                <p className="font-semibold text-sm">Credit / Debit Card</p>
                <p className="text-xs text-slate-500">Visa, Mastercard, RuPay</p>
              </div>
            </div>
          </div>

          <button
            onClick={handlePay}
            disabled={processing}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/20 transition-all transform active:scale-95 disabled:opacity-70 flex items-center justify-center"
          >
            {processing ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing Payment...
              </>
            ) : (
              `Pay ₹${amount}`
            )}
          </button>
          
          <div className="mt-4 flex items-center justify-center space-x-2 text-xs text-slate-400">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span>Secured by 256-bit encryption</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
