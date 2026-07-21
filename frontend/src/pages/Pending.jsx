import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

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

    // Poll for status update
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

    // Check immediately
    checkStatus();

    // Poll every 10 seconds
    const interval = setInterval(checkStatus, 10000);

    return () => clearInterval(interval);
  }, [applicationId, navigate]);

  if (!application) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Checking status...</p>
        </div>
      </div>
    );
  }

  if (status === 'approved') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="card w-full text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-green-600 mb-2">Payment Approved!</h2>
          <p className="text-gray-600 mb-4">Your ticket number is:</p>
          <p className="text-3xl font-bold text-blue-600 font-mono mb-6">
            {application.ticketNumber}
          </p>
          <p className="text-sm text-gray-500">
            Check your SMS for confirmation          </p>
          <button
            onClick={() => navigate('/')}
            className="mt-6 btn-primary"
          >
            🏠 Home
          </button>
        </div>
      </div>
    );
  }

  if (status === 'rejected') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="card w-full text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-red-600 mb-2">Payment Rejected</h2>
          <p className="text-gray-600 mb-6">
            Payment could not be verified.
          </p>
          <button
            onClick={() => navigate('/')}
            className="btn-primary"
          >
            🏠 Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="card w-full text-center">
        <div className="text-6xl mb-4">⏳</div>
        <h2 className="text-2xl font-bold text-yellow-600 mb-2">
          Waiting for Verification
        </h2>
        <p className="text-gray-600 mb-4">
          Your payment is being verified by the administrator.
        </p>
        <div className="bg-gray-50 rounded-lg p-4 text-left text-sm">
          <p><strong>Name:</strong> {application.firstName} {application.lastName}</p>
          <p><strong>Phone:</strong> {application.phoneNumber}</p>
          <p><strong>Status:</strong> <span className="text-yellow-600">Pending</span></p>
        </div>
        <p className="text-xs text-gray-400 mt-4">
          You will receive your ticket number via SMS once approved.
        </p>
      </div>
    </div>
  );
};

export default Pending;
