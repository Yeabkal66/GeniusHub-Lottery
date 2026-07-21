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
    <div className="container-mobile">
      <button
        onClick={() => navigate('/buy')}
        className="flex items-center gap-2 text-purple-500 hover:text-purple-700 transition-colors mb-4 font-medium"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back</span>
      </button>

      <div className="card-clean">
        <div className="text-center mb-6">
          <div className="icon-wrapper-purple mx-auto">
            <CreditCard className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mt-3">
            <span className="gradient-text">Payment</span>
          </h2>
          <p className="text-purple-500 text-sm mt-1 font-medium">Complete your payment</p>
        </div>

        <div className="space-y-4">
          {/* Price with Purple */}
          <div className="bg-purple-50 rounded-xl p-4 border-2 border-purple-100">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 font-medium flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-purple-600" />
                Ticket Price
              </span>
              <span className="text-2xl font-bold text-purple-700">$100</span>
            </div>
          </div>

          {/* Payment Instructions */}
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-5">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-yellow-700 font-semibold text-sm">Payment Instructions</p>
                <p className="text-yellow-600 text-sm mt-1">
                  Send payment to:
                </p>
                <div className="mt-3 p-3 bg-white rounded-xl text-center border-2 border-yellow-200">
                  <Phone className="w-5 h-5 text-yellow-600 inline-block mr-2" />
                  <span className="text-xl font-mono font-bold text-yellow-700 tracking-wider">
                    09XXXXXXXX
                  </span>
                </div>
                <p className="text-yellow-600 text-xs mt-3 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  Use the <strong>SAME phone number</strong> you entered
                </p>
              </div>
            </div>
          </div>

          {/* Confirm Button - Purple Gradient */}
          <button
            onClick={handlePaid}
            className="btn-primary-clean mt-2"
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Processing...
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5" />
                I Have Paid
              </>
            )}
          </button>

          <p className="text-center text-purple-400 text-xs font-medium">
            Your application will be verified manually
          </p>
        </div>
      </div>
    </div>
  );
};

export default Payment;
