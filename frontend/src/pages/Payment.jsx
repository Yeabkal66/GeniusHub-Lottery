import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';

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
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="card w-full">
        <h2 className="text-2xl font-bold text-center mb-6">💳 Payment</h2>

        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <p className="text-center text-gray-700">
            Ticket Price: <span className="font-bold text-xl">$100</span>
          </p>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-yellow-800 font-semibold mb-2">
            📱 Payment Instructions
          </p>
          <p className="text-sm text-yellow-800">
            Send payment to:
          </p>
          <p className="text-xl font-mono font-bold text-yellow-900 text-center py-2">
            09XXXXXXXX
          </p>
          <p className="text-xs text-yellow-700 mt-2">
            ⚠️ Use the <strong>SAME phone number</strong> you entered
          </p>
        </div>

        <button
          onClick={handlePaid}
          className="btn-primary"
          disabled={loading}
        >
          {loading ? 'Processing...' : '✅ I Have Paid'}
        </button>

        <p className="text-center text-xs text-gray-400 mt-4">
          Your application will be verified manually
        </p>
      </div>
    </div>
  );
};

export default Payment;
