import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Clock, CheckCircle, XCircle, Phone, Ticket, Sparkles, Loader2 } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Pending = () => {
  const [status, setStatus] = useState('pending');
  const [application, setApplication] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { applicationId } = location.state || {};

  useEffect(() => {
    if (!applicationId) {
      navigate('/');
      return;
    }

    const checkStatus = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/lottery/application/${applicationId}`);
        if (res.data) {
          setApplication(res.data);
          setStatus(res.data.status);
          
          if (res.data.status === 'approved') {
            // Show success
          } else if (res.data.status === 'rejected') {
            // Show rejection
          }
        }
      } catch (error) {
        console.error('Error checking status:', error);
      }
    };

    checkStatus();
    const interval = setInterval(checkStatus, 10000);
    return () => clearInterval(interval);
  }, [applicationId, navigate]);

  if (!application) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="spinner-premium relative mx-auto"></div>
          <p className="mt-6 text-white/60 font-light">Checking status...</p>
        </div>
      </div>
    );
  }

  if (status === 'approved') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 relative">
        <div className="bg-particles">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="particle"
              style={{
                width: Math.random() * 6 + 2 + 'px',
                height: Math.random() * 6 + 2 + 'px',
                left: Math.random() * 100 + '%',
                animationDuration: Math.random() * 20 + 15 + 's',
                animationDelay: Math.random() * 10 + 's',
                background: `rgba(52, 211, 153, ${Math.random() * 0.2 + 0.05})`
              }}
            />
          ))}
        </div>

        <div className="glass-card w-full max-w-md p-8 relative z-10 hover-lift">
          <div className="text-center">
            <div className="inline-block p-5 bg-green-500/20 rounded-2xl float-animation border border-green-500/20">
              <CheckCircle className="w-16 h-16 text-green-400" />
            </div>
            <h2 className="text-3xl font-bold text-green-400 mt-4">Payment Approved! 🎉</h2>
            <p className="text-white/60 mt-2">Your ticket number is:</p>
            
            <div className="mt-6 p-6 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-2xl border border-white/10">
              <Ticket className="w-8 h-8 text-indigo-400 mx-auto mb-2" />
              <p className="text-4xl font-bold font-mono text-white tracking-wider">
                {application.ticketNumber}
              </p>
            </div>

            <div className="mt-4 flex items-center justify-center gap-2 text-white/40 text-sm">
              <Phone className="w-4 h-4" />
              <span>Check your SMS for confirmation</span>
            </div>

            <button
              onClick={() => navigate('/')}
              className="btn-premium mt-6"
            >
              🏠 Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'rejected') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 relative">
        <div className="glass-card w-full max-w-md p-8 text-center">
          <div className="inline-block p-5 bg-red-500/20 rounded-2xl float-animation border border-red-500/20">
            <XCircle className="w-16 h-16 text-red-400" />
          </div>
          <h2 className="text-3xl font-bold text-red-400 mt-4">Payment Rejected</h2>
          <p className="text-white/60 mt-2">Payment could not be verified.</p>
          <button
            onClick={() => navigate('/')}
            className="btn-premium mt-6"
          >
            🏠 Back to Home
          </button>
        </div>
      </div>
    );
  }

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
        <div className="text-center">
          <div className="inline-block p-5 bg-yellow-500/20 rounded-2xl float-animation border border-yellow-500/20">
            <Clock className="w-16 h-16 text-yellow-400" />
          </div>
          
          <h2 className="text-3xl font-bold text-yellow-400 mt-4">
            Checking Status...
          </h2>
          
          <div className="mt-6 p-6 bg-indigo-500/10 rounded-2xl border border-white/5">
            <p className="text-white/60 font-medium">
              We'll send your ticket number to:
            </p>
            <p className="text-2xl font-bold text-white mt-2 flex items-center justify-center gap-2">
              <Phone className="w-6 h-6 text-indigo-400" />
              {application.phoneNumber}
            </p>
            <div className="mt-3 flex items-center justify-center gap-2 text-white/40">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              <span>Good luck! 🍀</span>
            </div>
          </div>

          <div className="mt-6 bg-white/5 rounded-2xl p-4 text-left text-sm">
            <div className="flex justify-between py-2 border-b border-white/5">
              <span className="text-white/40">Name</span>
              <span className="text-white font-medium">{application.firstName} {application.lastName}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-white/40">Status</span>
              <span className="badge badge-pending text-xs">Pending</span>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-center gap-3">
            <div className="w-3 h-3 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
            <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-3 h-3 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
          </div>

          <p className="text-white/30 text-xs mt-4">
            This page automatically updates
          </p>
        </div>
      </div>
    </div>
  );
};

export default Pending;
