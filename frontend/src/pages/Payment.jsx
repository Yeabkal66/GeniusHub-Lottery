import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { ArrowLeft, CreditCard, Phone, AlertCircle, DollarSign, Send } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Payment = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { applicationId } = location.state || {};

  const handlePaid = async () => {
    if (!applicationId) {
      toast.error('Invalid session');
      navigate('/');
      return;
    }

    setLoading(true);

    try {
      // ✅ Send confirmation to backend
      const response = await axios.post(`${API_URL}/api/lottery/payment-confirm`, {
        applicationId
      });

      console.log('Payment confirmed:', response.data);

      // Navigate to pending page
      navigate('/pending', { 
        state: { 
          applicationId,
          fromPayment: true 
        } 
      });
    } catch (error) {
      console.error('Error confirming payment:', error);
      toast.error(error.response?.data?.message || 'Failed to confirm payment. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      maxWidth: '420px', 
      margin: '0 auto', 
      padding: '16px',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center'
    }}>
      <button
        onClick={() => navigate('/buy')}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          color: '#8b5cf6',
          fontWeight: '500',
          marginBottom: '16px',
          cursor: 'pointer',
          background: 'none',
          border: 'none',
          fontSize: '1rem'
        }}
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back</span>
      </button>

      <div style={{
        background: '#ffffff',
        borderRadius: '24px',
        padding: '28px 24px',
        boxShadow: '0 10px 40px rgba(139, 92, 246, 0.08)',
        border: '1px solid rgba(139, 92, 246, 0.06)',
        position: 'relative'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: 'linear-gradient(90deg, #f59e0b, #d97706, #b45309)',
          borderRadius: '24px 24px 0 0'
        }}></div>

        <div style={{ textAlign: 'center', marginBottom: '24px', paddingTop: '8px' }}>
          <div style={{
            display: 'inline-flex',
            padding: '14px',
            background: 'linear-gradient(135deg, #f59e0b, #d97706)',
            borderRadius: '20px',
            color: 'white',
            boxShadow: '0 8px 24px rgba(245, 158, 11, 0.3)'
          }}>
            <CreditCard className="w-8 h-8" />
          </div>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: '#1e293b',
            marginTop: '12px'
          }}>
            <span style={{
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #b45309 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>Payment</span>
          </h2>
          <p style={{ color: '#d97706', fontSize: '0.875rem', marginTop: '4px', fontWeight: '500' }}>Complete your payment</p>
        </div>

        <div style={{ marginBottom: '16px' }}>
          {/* Price */}
          <div style={{
            background: '#faf5ff',
            borderRadius: '16px',
            padding: '16px',
            border: '2px solid #ede9fe',
            marginBottom: '16px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ color: '#6d28d9', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <DollarSign className="w-5 h-5" />
                Ticket Price
              </span>
              <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#7c3aed' }}>2000 ETB</span>
            </div>
          </div>

          {/* Payment Instructions */}
          <div style={{
            background: '#fffbeb',
            border: '2px solid #fde68a',
            borderRadius: '16px',
            padding: '20px'
          }}>
            <div style={{ display: 'flex', gap: '12px' }}>
              <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0" style={{ marginTop: '2px' }} />
              <div>
                <p style={{ color: '#92400e', fontWeight: '600', fontSize: '0.875rem' }}>Payment Instructions</p>
                <p style={{ color: '#92400e', fontSize: '0.875rem', marginTop: '4px' }}>
                  Send payment to:
                </p>
                <div style={{
                  marginTop: '12px',
                  padding: '12px',
                  background: 'white',
                  borderRadius: '12px',
                  textAlign: 'center',
                  border: '2px solid #fde68a'
                }}>
                  <Phone className="w-5 h-5 text-yellow-600" style={{ display: 'inline-block', marginRight: '8px' }} />
                  <span style={{ fontSize: '1.25rem', fontFamily: 'monospace', fontWeight: 'bold', color: '#92400e', letterSpacing: '1px' }}>
                    09XXXXXXXX
                  </span>
                </div>
                <p style={{ color: '#92400e', fontSize: '0.75rem', marginTop: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <AlertCircle className="w-3 h-3" />
                  Use the <strong>SAME phone number</strong> you entered
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Confirm Button */}
        <button
          onClick={handlePaid}
          style={{
            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #b45309 100%)',
            color: 'white',
            padding: '16px 28px',
            borderRadius: '16px',
            fontWeight: '700',
            fontSize: '1rem',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            width: '100%',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            boxShadow: '0 8px 24px rgba(245, 158, 11, 0.3)',
            opacity: loading ? 0.6 : 1,
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
          disabled={loading}
        >
          {loading ? (
            <>
              <span style={{
                width: '20px',
                height: '20px',
                border: '2px solid rgba(255,255,255,0.3)',
                borderTopColor: 'white',
                borderRadius: '50%',
                display: 'inline-block',
                animation: 'spin 0.8s linear infinite'
              }}></span>
              Processing...
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              I Have Paid
            </>
          )}
        </button>

        <p style={{ textAlign: 'center', color: '#d97706', fontSize: '0.75rem', marginTop: '12px', fontWeight: '500' }}>
          Your application will be verified manually
        </p>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Payment;
