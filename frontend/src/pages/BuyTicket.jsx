import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { ArrowLeft, User, Phone, Sparkles, Shield, ChevronRight } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const BuyTicket = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [lottery, setLottery] = useState(null);
  const [loadingLottery, setLoadingLottery] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchLotteryStatus();
  }, []);

  const fetchLotteryStatus = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/lottery/status`);
      if (response.data.status === 'sold_out' || response.data.remaining === 0) {
        toast.error('Lottery is sold out!');
        navigate('/');
        return;
      }
      setLottery(response.data);
      setLoadingLottery(false);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to load lottery status');
      navigate('/');
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^09[0-9]{8}$/.test(formData.phoneNumber.trim())) {
      newErrors.phoneNumber = 'Must start with 09 and be 10 digits';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error('Please fix all errors');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/api/lottery/apply`, formData);
      toast.success('Application created!');
      navigate('/payment', { state: { applicationId: response.data.applicationId } });
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.response?.data?.message || 'Failed to apply');
    } finally {
      setLoading(false);
    }
  };

  if (loadingLottery) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="spinner-clean mx-auto"></div>
          <p className="mt-4 text-purple-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-mobile" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-2 text-purple-500 hover:text-purple-700 transition-colors mb-4 font-medium"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back</span>
      </button>

      <div className="card-clean">
        <div className="text-center mb-6">
          <div className="icon-wrapper-purple mx-auto">
            <Ticket className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mt-3">
            <span className="gradient-text">Buy Ticket</span>
          </h2>
          <p className="text-purple-500 text-sm mt-1 font-medium">Enter your details to purchase</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label-clean">First Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400" />
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className={`input-clean pl-11 ${errors.firstName ? 'error' : ''}`}
                placeholder="Enter your first name"
                disabled={loading}
              />
            </div>
            {errors.firstName && <p className="error-text-clean">{errors.firstName}</p>}
          </div>

          <div>
            <label className="label-clean">Last Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400" />
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className={`input-clean pl-11 ${errors.lastName ? 'error' : ''}`}
                placeholder="Enter your last name"
                disabled={loading}
              />
            </div>
            {errors.lastName && <p className="error-text-clean">{errors.lastName}</p>}
          </div>

          <div>
            <label className="label-clean">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400" />
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className={`input-clean pl-11 ${errors.phoneNumber ? 'error' : ''}`}
                placeholder="09XXXXXXXX"
                disabled={loading}
              />
            </div>
            {errors.phoneNumber && <p className="error-text-clean">{errors.phoneNumber}</p>}
            <div className="help-text">
              <Shield className="w-3 h-3" />
              Must start with 09 and be 10 digits
            </div>
          </div>

          <button
            type="submit"
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
                <Sparkles className="w-5 h-5" />
                Continue
                <ChevronRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BuyTicket;
