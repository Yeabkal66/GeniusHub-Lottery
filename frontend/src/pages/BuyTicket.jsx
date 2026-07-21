import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { ArrowLeft, User, Phone, Sparkles, Shield, ChevronRight, Ticket } from 'lucide-react';

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
        onClick={() => navigate('/')}
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

        <div style={{ textAlign: 'center', marginBottom: '24px', paddingTop: '8px' }}>
          <div style={{
            display: 'inline-flex',
            padding: '14px',
            background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
            borderRadius: '20px',
            color: 'white',
            boxShadow: '0 8px 24px rgba(124, 58, 237, 0.3)'
          }}>
            <Ticket className="w-8 h-8" />
          </div>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: '#1e293b',
            marginTop: '12px'
          }}>
            <span style={{
              background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #d946ef 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>Buy Ticket</span>
          </h2>
          <p style={{ color: '#a855f7', fontSize: '0.875rem', marginTop: '4px', fontWeight: '500' }}>Enter your details to purchase</p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* First Name */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'block',
              fontSize: '0.85rem',
              fontWeight: '600',
              color: '#6d28d9',
              marginBottom: '6px'
            }}>First Name</label>
            <div style={{ position: 'relative' }}>
              <User style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '20px',
                height: '20px',
                color: '#a78bfa'
              }} />
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '14px 16px 14px 44px',
                  background: '#faf5ff',
                  border: errors.firstName ? '2px solid #ef4444' : '2px solid #e9d5ff',
                  borderRadius: '14px',
                  color: '#1e293b',
                  fontSize: '1rem',
                  transition: 'all 0.3s ease',
                  outline: 'none'
                }}
                placeholder="Enter your first name"
                disabled={loading}
              />
            </div>
            {errors.firstName && (
              <p style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '4px', fontWeight: '500' }}>{errors.firstName}</p>
            )}
          </div>

          {/* Last Name */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'block',
              fontSize: '0.85rem',
              fontWeight: '600',
              color: '#6d28d9',
              marginBottom: '6px'
            }}>Last Name</label>
            <div style={{ position: 'relative' }}>
              <User style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '20px',
                height: '20px',
                color: '#a78bfa'
              }} />
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '14px 16px 14px 44px',
                  background: '#faf5ff',
                  border: errors.lastName ? '2px solid #ef4444' : '2px solid #e9d5ff',
                  borderRadius: '14px',
                  color: '#1e293b',
                  fontSize: '1rem',
                  transition: 'all 0.3s ease',
                  outline: 'none'
                }}
                placeholder="Enter your last name"
                disabled={loading}
              />
            </div>
            {errors.lastName && (
              <p style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '4px', fontWeight: '500' }}>{errors.lastName}</p>
            )}
          </div>

          {/* Phone Number */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'block',
              fontSize: '0.85rem',
              fontWeight: '600',
              color: '#6d28d9',
              marginBottom: '6px'
            }}>Phone Number</label>
            <div style={{ position: 'relative' }}>
              <Phone style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '20px',
                height: '20px',
                color: '#a78bfa'
              }} />
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '14px 16px 14px 44px',
                  background: '#faf5ff',
                  border: errors.phoneNumber ? '2px solid #ef4444' : '2px solid #e9d5ff',
                  borderRadius: '14px',
                  color: '#1e293b',
                  fontSize: '1rem',
                  transition: 'all 0.3s ease',
                  outline: 'none'
                }}
                placeholder="09XXXXXXXX"
                disabled={loading}
              />
            </div>
            {errors.phoneNumber && (
              <p style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '4px', fontWeight: '500' }}>{errors.phoneNumber}</p>
            )}
            <div style={{
              fontSize: '0.75rem',
              color: '#8b5cf6',
              marginTop: '4px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <Shield className="w-3 h-3" />
              Must start with 09 and be 10 digits
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            style={{
              background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #d946ef 100%)',
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
              boxShadow: '0 8px 24px rgba(124, 58, 237, 0.3)',
              marginTop: '8px',
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
