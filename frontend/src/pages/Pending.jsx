import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Phone, Sparkles, Mail } from 'lucide-react';

const Pending = () => {
  const navigate = useNavigate();

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
        {/* Purple top border */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: 'linear-gradient(90deg, #8b5cf6, #a855f7, #d946ef)',
          borderRadius: '24px 24px 0 0'
        }}></div>

        {/* Icon */}
        <div style={{
          display: 'inline-flex',
          padding: '14px',
          background: 'linear-gradient(135deg, #8b5cf6, #a855f7)',
          borderRadius: '20px',
          color: 'white',
          boxShadow: '0 8px 24px rgba(139, 92, 246, 0.3)',
          marginBottom: '16px'
        }}>
          <Clock className="w-12 h-12" />
        </div>

        {/* Main Message */}
        <h2 style={{ 
          fontSize: '1.5rem', 
          fontWeight: 'bold', 
          color: '#7c3aed',
          marginBottom: '12px'
        }}>
          Your Application is Under Review
        </h2>

        {/* SMS Message Box */}
        <div style={{
          padding: '20px',
          background: 'linear-gradient(135deg, #faf5ff, #f3e8ff)',
          borderRadius: '16px',
          border: '2px solid #ede9fe',
          marginBottom: '16px'
        }}>
          <p style={{ 
            color: '#4c1d95', 
            fontWeight: '500', 
            fontSize: '0.95rem',
            marginBottom: '8px'
          }}>
            We'll send your ticket number to:
          </p>
          <p style={{ 
            fontSize: '1.25rem', 
            fontWeight: 'bold', 
            color: '#7c3aed',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}>
            <Phone className="w-5 h-5" />
            Your Number
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

        {/* Info Box */}
        <div style={{
          padding: '16px',
          background: '#faf5ff',
          borderRadius: '12px',
          marginBottom: '16px'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: '8px',
            color: '#6d28d9'
          }}>
            <Mail className="w-4 h-4" />
            <span style={{ fontWeight: '500' }}>You'll receive an SMS confirmation</span>
          </div>
        </div>

        {/* Animated dots */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          marginBottom: '16px'
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

        {/* Back Button */}
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
            boxShadow: '0 8px 24px rgba(124, 58, 237, 0.3)'
          }}
        >
          🏠 Back to Home
        </button>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
      `}</style>
    </div>
  );
};

export default Pending;
