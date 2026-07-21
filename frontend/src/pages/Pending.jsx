import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Clock, CheckCircle, XCircle, Phone, Ticket, Sparkles } from 'lucide-react';

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
        }
      } catch (error) {
        console.error('Error:', error);
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
          <div className="spinner-clean mx-auto"></div>
          <p className="mt-4 text-purple-600 font-medium">Checking status...</p>
        </div>
      </div>
    );
  }

  if (status === 'approved') {
    return (
      <div className="container-mobile">
        <div className="card-clean text-center">
          <div className="icon-wrapper-purple mx-auto">
            <CheckCircle className="w-12 h-12" />
          </div>
          <h2 className="text-2xl font-bold text-green-600 mt-4">Payment Approved!</h2>
          <p className="text-purple-500 mt-2 font-medium">Your ticket number is:</p>
          
          <div className="mt-6 p-6 bg-purple-50 rounded-xl border-2 border-purple-200">
            <Ticket className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <p className="text-3xl font-bold text-purple-700 font-mono tracking-wider">
              {application.ticketNumber}
            </p>
          </div>

          <div className="mt-4 flex items-center justify-center gap-2 text-purple-500 text-sm font-medium">
            <Phone className="w-4 h-4" />
            <span>Check your SMS for confirmation</span>
          </div>

          <button
            onClick={() => navigate('/')}
            className="btn-primary-clean mt-6"
          >
            🏠 Back to Home
          </button>
        </div>
      </div>
    );
  }

  if (status === 'rejected') {
    return (
      <div className="container-mobile">
        <div className="card-clean text-center">
          <div className="icon-wrapper mx-auto bg-red-50 text-red-600">
            <XCircle className="w-12 h-12" />
          </div>
          <h2 className="text-2xl font-bold text-red-600 mt-4">Payment Rejected</h2>
          <p className="text-gray-500 mt-2">Payment could not be verified.</p>
          <button
            onClick={() => navigate('/')}
            className="btn-primary-clean mt-6"
          >
            🏠 Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container-mobile">
      <div className="card-clean text-center">
        <div className="icon-wrapper-purple mx-auto">
          <Clock className="w-12 h-12" />
        </div>
        
        <h2 className="text-2xl font-bold text-purple-600 mt-4">
          Checking Status...
        </h2>
        
        <div className="mt-6 p-6 bg-purple-50 rounded-xl border-2 border-purple-100">
          <p className="text-gray-600 font-medium">
            We'll send your ticket number to:
          </p>
          <p className="text-xl font-bold text-purple-700 mt-2 flex items-center justify-center gap-2">
            <Phone className="w-5 h-5" />
            {application.phoneNumber}
          </p>
          <div className="mt-3 flex items-center justify-center gap-2 text-purple-500 font-medium">
            <Sparkles className="w-4 h-4 text-yellow-500" />
            <span>Good luck! 🍀</span>
          </div>
        </div>

        <div className="mt-6 bg-purple-50 rounded-xl p-4 text-left text-sm">
          <div className="flex justify-between py-2 border-b border-purple-100">
            <span className="text-purple-600">Name</span>
            <span className="text-gray-900 font-medium">{application.firstName} {application.lastName}</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-purple-600">Status</span>
            <span className="badge-status badge-pending">Pending</span>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-center gap-3">
          <div className="w-2.5 h-2.5 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
          <div className="w-2.5 h-2.5 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-2.5 h-2.5 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
        </div>

        <p className="text-purple-400 text-xs mt-4 font-medium">
          This page automatically updates
        </p>
      </div>
    </div>
  );
};

export default Pending;
