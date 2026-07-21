import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ArrowLeft, CreditCard, Phone, CheckCircle, AlertCircle, DollarSign } from 'lucide-react';

const Payment = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { applicationId } = location.state || {};

  const handlePaid = () => {
    if (!applicationId) {
      toast.error('Invalid session');
      navigate('/');
      return;
    }
    setLoading(true);
    navigate('/pending', { state: { applicationId } });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      <div className="bg-particles">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              width: Math.random() * 4 + 2 + 'px',
              height: Math.random() * 4 + 2 + 'px',
              left: Math.random() * 100 + '%',
              animationDuration: Math.random() * 20 + 15 + 's',
              animationDelay: Math.random() * 10 + 's',
              background: `rgba(251, 191, 36, ${Math.random() * 0.2 + 0.05})`
            }}
          />
        ))}
      </div>

      <div className="glass-card w-full max-w-md p-8 relative z-10 hover-lift">
        <button
          onClick={() => navigate('/buy')}
          className="text-white/40 hover:text-white/70 transition-colors mb-6 flex items-center gap-2 text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-gradient-to-br from-yellow-500/20 to-amber-500/20 rounded-2xl float-animation border border-yellow-500/10">
            <CreditCard className="w-10 h-10 text-yellow-400" />
          </div>
          <h2 className="section-title gradient-text-gold text-3xl mt-4">Payment</h2>
          <p className="text-white/40 text-sm mt-2">Complete your payment to secure your ticket</p>
        </div>

        <div className="space-y-5">
          {/* Price Card */}
          <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-2xl p-5 border border-white/5">
            <div className="flex items-center justify-between">
              <span className="text-white/60 flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Ticket Price
              </span>
              <span className="text-3xl font-bold text-white">$100</span>
            </div>
          </div>

          {/* Payment Instructions */}
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-5 backdrop-blur-sm">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-yellow-400 font-semibold text-sm">Payment Instructions</p>
                <p className="text-yellow-400/70 text-sm mt-1">
                  Send payment to the following number:
                </p>
                <div className="mt-3 p-3 bg-black/20 rounded-xl text-center">
                  <Phone className="w-5 h-5 text-yellow-400 inline-block mr-2" />
                  <span className="text-2xl font-mono font-bold text-yellow-400 tracking-wider">
                    09XXXXXXXX
                  </span>
                </div>
                <p className="text-yellow-400/50 text-xs mt-3 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  Use the <strong>SAME phone number</strong> you entered
                </p>
              </div>
            </div>
          </div>

          {/* Confirm Button */}
          <button
            onClick={handlePaid}
            className="btn-premium"
            disabled={loading}
            style={{
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #b45309 100%)',
              boxShadow: '0 10px 30px -10px rgba(245, 158, 11, 0.4)'
            }}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Processing...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <CheckCircle className="w-5 h-5" />
                I Have Paid
              </span>
            )}
          </button>

          <p className="text-center text-white/20 text-xs">
            Your application will be verified manually
          </p>
        </div>
      </div>
    </div>
  );
};

export default Payment;
