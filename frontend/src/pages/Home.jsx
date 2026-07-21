import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Ticket, Users, Clock, Sparkles, Gift, ChevronRight, Crown } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Home = () => {
  const [lottery, setLottery] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/lottery/status`);
      setLottery(res.data);
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="spinner-clean mx-auto"></div>
          <p className="mt-4 text-purple-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (!lottery) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="card-clean max-w-md w-full text-center">
          <p className="text-red-500">Failed to load lottery</p>
          <button onClick={fetchStatus} className="btn-primary-clean mt-4">
            Retry
          </button>
        </div>
      </div>
    );
  }

  const isSoldOut = lottery.isSoldOut;
  const isShutdown = lottery.isShutdown;
  const progress = (lottery.ticketsSold / lottery.maxTickets) * 100;

  return (
    <div className="container-mobile">
      <div className="card-clean">
        {/* Header with Purple */}
        <div className="text-center">
          <div className="icon-wrapper-purple mx-auto mb-3">
            <Crown className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            <span className="gradient-text">Lottery</span>
          </h1>
          <p className="text-purple-500 text-sm mt-1 font-medium">Win amazing prizes!</p>
        </div>

        {isShutdown ? (
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 text-center mt-6">
            <div className="text-4xl mb-2">🔴</div>
            <p className="text-red-600 font-bold text-lg">LOTTERY IS OVER</p>
            <p className="text-red-500 text-sm mt-1">No more entries accepted</p>
          </div>
        ) : isSoldOut ? (
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6 text-center mt-6">
            <div className="text-4xl mb-2">🎟️</div>
            <p className="text-yellow-600 font-bold text-lg">SOLD OUT</p>
            <p className="text-yellow-500 text-sm mt-1">All tickets have been sold</p>
          </div>
        ) : (
          <>
            {/* Progress with Purple */}
            <div className="mt-6">
              <div className="flex justify-between text-sm font-medium text-gray-600 mb-2">
                <span className="flex items-center gap-2 text-purple-700">
                  <Users className="w-4 h-4" />
                  Tickets Sold
                </span>
                <span className="font-bold text-purple-700">
                  {lottery.ticketsSold} / {lottery.maxTickets}
                </span>
              </div>
              <div className="progress-clean">
                <div 
                  className="progress-fill-clean"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Stats Grid with Purple */}
            <div className="grid grid-cols-2 gap-3 mt-6">
              <div className="stat-box">
                <p className="stat-number-clean">{lottery.remaining}</p>
                <p className="stat-label-clean">Remaining</p>
              </div>
              <div className="stat-box">
                <p className="text-sm font-semibold text-purple-700 mb-1">Status</p>
                <span className={`badge-clean ${isSoldOut ? 'badge-sold-clean' : 'badge-open-clean'}`}>
                  {isSoldOut ? 'Sold Out' : 'Open'}
                </span>
              </div>
            </div>

            {/* Prize Info with Purple */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 mt-4 border border-purple-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Gift className="w-5 h-5 text-purple-600" />
                  <span className="text-gray-700 font-medium">Grand Prize</span>
                </div>
                <span className="text-purple-700 font-bold">$10,000</span>
              </div>
            </div>

            {/* Buy Button - Purple */}
            <Link to="/buy" className="btn-primary-clean mt-6">
              <Ticket className="w-5 h-5" />
              Buy Ticket
              <Sparkles className="w-4 h-4" />
            </Link>

            {/* Status Check - Purple */}
            <Link to="/status" className="btn-secondary-clean mt-3">
              <Clock className="w-4 h-4" />
              Check Application Status
              <ChevronRight className="w-4 h-4" />
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
