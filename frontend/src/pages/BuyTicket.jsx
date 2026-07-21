import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { ArrowLeft, User, Phone, Mail, Sparkles, Shield } from 'lucide-react';

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
      console.error('Error fetching lottery:', error);
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
      newErrors.phoneNumber = 'Phone number must start with 09 and be 10 digits total';
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
          <div className="spinner-premium relative mx-auto"></div>
          <p className="mt-6 text-white/60 font-light">Loading...</p>
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
              background: `rgba(139, 92, 246, ${Math.random() * 0.2 + 0.05})`
            }}
          />
        ))}
      </div>

      <div className="glass-card w-full max-w-md p-8 relative z-10 hover-lift">
        <button
          onClick={() => navigate('/')}
          className="text-white/40 hover:text-white/70 transition-colors mb-6 flex items-center gap-2 text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-2xl float-animation border border-white/10">
            <Ticket className="w-10 h-10 text-indigo-400" />
          </div>
          <h2 className="section-title gradient-text text-3xl mt-4">Buy Ticket</h2>
          <p className="text-white/40 text-sm mt-2">Enter your details to purchase a ticket</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="label-premium">First Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className={`input-premium pl-12 ${errors.firstName ? 'error' : ''}`}
                placeholder="Enter your first name"
                disabled={loading}
              />
            </div>
            {errors.firstName && <p className="error-text">{errors.firstName}</p>}
          </div>

          <div>
            <label className="label-premium">Last Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className={`input-premium pl-12 ${errors.lastName ? 'error' : ''}`}
                placeholder="Enter your last name"
                disabled={loading}
              />
            </div>
            {errors.lastName && <p className="error-text">{errors.lastName}</p>}
          </div>

          <div>
            <label className="label-premium">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className={`input-premium pl-12 ${errors.phoneNumber ? 'error' : ''}`}
                placeholder="09XXXXXXXX"
                disabled={loading}
              />
            </div>
            {errors.phoneNumber && <p className="error-text">{errors.phoneNumber}</p>}
            <p className="text-white/30 text-xs mt-2 flex items-center gap-1">
              <Shield className="w-3 h-3" />
              Must start with 09 and be 10 digits
            </p>
          </div>

          <button
            type="submit"
            className="btn-premium"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Processing...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <Sparkles className="w-5 h-5" />
                Continue
              </span>
            )}
          </button>
        </form>

        <p className="text-center text-white/20 text-xs mt-6">
          By continuing, you agree to our terms and conditions
        </p>
      </div>
    </div>
  );
};

export default BuyTicket;
