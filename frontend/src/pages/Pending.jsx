import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Clock, CheckCircle, XCircle, Phone, Ticket } from 'lucide-react';

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
          <div className="w-20 h-20 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Checking status...</p>
        </div>
      </div>
    );
  }

  if (status === 'approved') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="card w-full max-w-md text-center relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-green-200/30 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-emerald-200/30 rounded-full blur-3xl"></div>
          
          <div className="relative z-10">
            <div className="inline-block p-4 bg-green-100 rounded-full floating">
              <CheckCircle className="w-16 h-16 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-green-600 mt-4">Payment Approved!</h2>
            <p className="text-gray-600 mt-2">Your ticket number is:</p>
            <div className="mt-4 p-4 bg-indigo-50 rounded-xl border-2 border-indigo-200">
              <p className="text-4xl font-bold text-indigo-600 font-mono">
                {application.ticketNumber}
              </p>
            </div>
            <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-500">
              <Phone className="w-4 h-4" />
              <span>Check your SMS for confirmation</span>
            </div>
            <button
              onClick={() => navigate('/')}
              className="btn-primary mt-6"
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
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="card w-full max-w-md text-center">
          <div className="inline-block p-4 bg-red-100 rounded-full floating">
            <XCircle className="w-16 h-16 text-red-600" />
          </div>
          <h2 className="text-3xl font-bold text-red-600 mt-4">Payment Rejected</h2>
          <p className="text-gray-600 mt-2">Payment could not be verified.</p>
          <button
            onClick={() => navigate('/')}
            className="btn-primary mt-6"
          >
            🏠 Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="card w-full max-w-md text-center relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-yellow-200/30 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-orange-200/30 rounded-full blur-3xl"></div>
        
        <div className="relative z-10">
          <div className="inline-block p-4 bg-yellow-100 rounded-full floating">
            <Clock className="w-16 h-16 text-yellow-600" />
          </div>
          
          <h2 className="text-3xl font-bold text-yellow-600 mt-4">
            Checking Status...
          </h2>
          
          <div className="mt-6 p-6 bg-indigo-50/80 backdrop-blur-sm rounded-xl border border-indigo-100">
            <p className="text-gray-700 text-lg font-medium">
              We'll send your ticket number to:
            </p>
            <p className="text-2xl font-bold text-indigo-600 mt-2 flex items-center justify-center gap-2">
              <Phone className="w-6 h-6" />
              {application.phoneNumber}
            </p>
            <div className="mt-3 flex items-center justify-center gap-2 text-sm text-gray-500">
              <Ticket className="w-4 h-4" />
              <span>Good luck! 🍀</span>
            </div>
          </div>

          <div className="mt-6 bg-gray-50/80 backdrop-blur-sm rounded-xl p-4 text-left text-sm">
            <p><strong className="text-gray-700">Name:</strong> {application.firstName} {application.lastName}</p>
            <p><strong className="text-gray-700">Status:</strong> <span className="status-badge status-pending text-sm">Pending</span></p>
          </div>

          <div className="mt-4 animate-pulse">
            <div className="flex items-center justify-center gap-2 text-gray-500">
              <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pending;
