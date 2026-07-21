import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const BuyTicket = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'Required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Required';
    if (!formData.phoneNumber.trim()) {
  newErrors.phoneNumber = 'Required';
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

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="card w-full">
        <h2 className="text-2xl font-bold text-center mb-6">📝 Buy Ticket</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              First Name
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className={`input-field ${errors.firstName ? 'border-red-500' : ''}`}
              placeholder="Enter first name"
              disabled={loading}
            />
            {errors.firstName && (
              <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Last Name
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className={`input-field ${errors.lastName ? 'border-red-500' : ''}`}
              placeholder="Enter last name"
              disabled={loading}
            />
            {errors.lastName && (
              <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className={`input-field ${errors.phoneNumber ? 'border-red-500' : ''}`}
              placeholder="09XXXXXXXX"
              disabled={loading}
            />
            {errors.phoneNumber && (
              <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>
            )}
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Processing...' : 'Continue →'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BuyTicket;
