import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Clock, CheckCircle, XCircle, Phone, Ticket, Sparkles, Mail, Send } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Pending = () => {
  const [status, setStatus] = useState('pending');
  const [application, setApplication] = useState(null);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const { applicationId, fromPayment } = location.state || {};

  useEffect(() => {
    if (!applicationId) {
      navigate('/');
      return;
    }

    // Start timer
    const timer = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);

    const checkStatus = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/lottery/application/${applicationId}`);
        if (res.data) {
          setApplication(res.data);
          setStatus(res.data.status);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    checkStatus();
    const interval = setInterval(checkStatus, 10000);
    
    return () => {
      clearInterval(interval);
      clearInterval(timer);
    };
  }, [applicationId, navigate]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins > 0) {
      return `${mins}m ${secs}s`;
    }
    return `${secs}s`;
  };

  if (!application) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'linear-gradient(145deg, #faf5ff 0%, #f3e8ff 50%, #ede9fe 100%)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div className="spinner" style={{ margin: '0 auto' }}></div>
          <p style={{ marginTop: '16px', color: '#7c3aed', fontWeight: '500' }}>Loading...</p>
        </div>
      </div>
    );
  }

  if (status === 'approved') {
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
        <div style={{
          background: '#ffffff',
          borderRadius: '24px',
          padding: '28px 24px',
          boxShadow: '0 10px 40px rgba(139, 92, 246, 0.08)',
          border: '1px solid rgba(139, 92, 246, 0.06)',
          position: 'relative',
          textAlign: 'center'
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, #22c55e, #16a34a, #15803d)',
            borderRadius: '24px 24px 0 0'
          }}></div>

          <div style={{
            display: 'inline-flex',
            padding: '14px',
            background: 'linear-gradient(135deg, #22c55e, #16a34a)',
            borderRadius: '20px',
            color: 'white',
            boxShadow: '0 8px 24px rgba(34, 197, 94, 0.3)'
          }}>
            <CheckCircle className="w-12 h-12" />
          </div>

          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#16a34a', marginTop: '16px' }}>
            Payment Approved! 🎉
          </h2>
          <p style={{ color: '#8b5cf6', marginTop: '8px', fontWeight: '500' }}>Your ticket number is:</p>
          
          <div style={{
            marginTop: '16px',
            padding: '20px',
            background: '#faf5ff',
            borderRadius: '16px',
            border: '2px solid #ede9fe'
          }}>
            <Ticket className="w-8 h-8" style={{ color: '#7c3aed', margin: '0 auto 8px' }} />
            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#7c3aed', fontFamily: 'monospace', letterSpacing: '2px' }}>
              {application.ticketNumber}
            </p>
          </div>

          <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#8b5cf6', fontSize: '0.875rem' }}>
            <Phone className="w-4 h-4" />
            <span>Check your SMS for confirmation</span>
          </div>

          <button
            onClick={() => navigate('/')}
            style={{
              background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #d946ef 100%)',
              color: 'white',
              padding: '16px 28px',
              borderRadius: '16px',
              fontWeight: '700',
              border: 'none',
              cursor: 'pointer',
              width: '100%',
              marginTop: '20px',
              boxShadow: '0 8px 24px rgba(124, 58, 237, 0.3)'
            }}
          >
            🏠 Back to Home
          </button>
        </div>
      </div>
    );
  }

  if (status === 'rejected') {
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
        <div style={{
          background: '#ffffff',
          borderRadius: '24px',
          padding: '28px 24px',
          boxShadow: '0 10px 40px rgba(139, 92, 246, 0.08)',
          border: '1px solid rgba(139, 92, 246, 0.06)',
          position: 'relative',
          textAlign: 'center'
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, #ef4444, #dc2626, #b91c1c)',
            borderRadius: '24px 24px 0 0'
          }}></div>

          <div style={{
            display: 'inline-flex',
            padding: '14px',
            background: 'linear-gradient(135deg, #ef4444, #dc2626)',
            borderRadius: '20px',
            color: 'white',
            boxShadow: '0 8px 24px rgba(239, 68, 68, 0.3)'
          }}>
            <XCircle className="w-12 h-12" />
          </div>

          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#dc2626', marginTop: '16px' }}>
            Payment Rejected
          </h2>
          <p style={{ color: '#6b7280', marginTop: '8px' }}>Payment could not be verified.</p>

          <button
            onClick={() => navigate('/')}
            style={{
              background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #d946ef 100%)',
              color: 'white',
              padding: '16px 28px',
              borderRadius: '16px',
              fontWeight: '700',
              border: 'none',
              cursor: 'pointer',
              width: '100%',
              marginTop: '20px',
              boxShadow: '0 8px 24px rgba(124, 58, 237, 0.3)'
            }}
          >
            🏠 Back to Home
          </button>
        </div>
      </div>
    );
  }

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
      <div style={{
        background: '#ffffff',
        borderRadius: '24px',
        padding: '28px 24px',
        boxShadow: '0 10px 40px rgba(139, 92, 246, 0.08)',
        border: '1px solid rgba(139, 92, 246, 0.06)',
        position: 'relative',
        textAlign: 'center'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: 'linear-gradient(90deg, #8b5cf6, #a855f7, #d946ef)',
          borderRadius: '24px 24px 0 0'
        }}></div>

        <div style={{
          display: 'inline-flex',
          padding: '14px',
          background: 'linear-gradient(135deg, #8b5cf6, #a855f7)',
          borderRadius: '20px',
          color: 'white',
          boxShadow: '0 8px 24px rgba(139, 92, 246, 0.3)',
          animation: 'pulse 2s infinite'
        }}>
          <Clock className="w-12 h-12" />
        </div>

        <h2 style={{ 
          fontSize: '1.5rem', 
          fontWeight: 'bold', 
          color: '#7c3aed', 
          marginTop: '16px'
        }}>
          Your Application is Under Review
        </h2>

        <div style={{
          marginTop: '16px',
          padding: '20px',
          background: 'linear-gradient(135deg, #faf5ff, #f3e8ff)',
          borderRadius: '16px',
          border: '2px solid #ede9fe'
        }}>
          <p style={{ color: '#4c1d95', fontWeight: '500', fontSize: '0.95rem' }}>
            We'll send your ticket number to:
          </p>
          <p style={{ 
            fontSize: '1.25rem', 
            fontWeight: 'bold', 
            color: '#7c3aed', 
            marginTop: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}>
            <Phone className="w-5 h-5" />
            {application.phoneNumber}
          </p>
          <div style={{
            marginTop: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            color: '#8b5cf6',
            fontWeight: '500'
          }}>
            <Sparkles className="w-4 h-4 text-yellow-500" />
            <span>Good luck! 🍀</span>
          </div>
        </div>

        <div style={{
          marginTop: '16px',
          padding: '16px',
          background: '#faf5ff',
          borderRadius: '12px',
          textAlign: 'left'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #ede9fe' }}>
            <span style={{ color: '#6d28d9', fontWeight: '500' }}>Name</span>
            <span style={{ color: '#1e293b', fontWeight: '600' }}>{application.firstName} {application.lastName}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
            <span style={{ color: '#6d28d9', fontWeight: '500' }}>Status</span>
            <span style={{
              display: 'inline-block',
              padding: '4px 12px',
              background: '#fef3c7',
              color: '#d97706',
              borderRadius: '100px',
              fontWeight: '600',
              fontSize: '0.75rem',
              textTransform: 'uppercase'
            }}>Pending</span>
          </div>
        </div>

        <div style={{
          marginTop: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          color: '#8b5cf6',
          fontSize: '0.875rem'
        }}>
          <Mail className="w-4 h-4" />
          <span>You'll receive an SMS confirmation</span>
        </div>

        <div style={{
          marginTop: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px'
        }}>
          <div style={{
            width: '10px',
            height: '10px',
            background: '#7c3aed',
            borderRadius: '50%',
            animation: 'bounce 1s infinite'
          }}></div>
          <div style={{
            width: '10px',
            height: '10px',
            background: '#7c3aed',
            borderRadius: '50%',
            animation: 'bounce 1s infinite 0.2s'
          }}></div>
          <div style={{
            width: '10px',
            height: '10px',
            background: '#7c3aed',
            borderRadius: '50%',
            animation: 'bounce 1s infinite 0.4s'
          }}></div>
        </div>

        <p style={{ 
          color: '#a78bfa', 
          fontSize: '0.75rem', 
          marginTop: '12px',
          fontWeight: '500'
        }}>
          ⏱️ {formatTime(timeElapsed)} • Page auto-refreshes
        </p>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
      `}</style>
    </div>
  );
};

export default Pending;
