import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Sparkles, Ticket, Gift, Users, Clock } from 'lucide-react';

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
          <div className="w-20 h-20 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading Lottery...</p>
        </div>
      </div>
    );
  }

  if (!lottery) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="card w-full max-w-md text-center">
          <p className="text-red-600">Failed to load lottery</p>
          <button onClick={fetchStatus} className="mt-4 btn-primary">
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
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="card w-full max-w-md relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-indigo-200/30 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-purple-200/30 rounded-full blur-3xl"></div>
        
        <div className="relative z-10">
          <div className="text-center floating">
            <div className="inline-block p-4 gradient-bg rounded-full shadow-lg">
              <Ticket className="w-12 h-12 text-white" />
            </div>
          </div>

          <h1 className="section-title text-center mt-4">Lottery Draw</h1>
          <p className="text-center text-gray-600 mt-2">Win amazing prizes!</p>

          {isShutdown ? (
            <div className="mt-6 bg-red-50/80 backdrop-blur-sm border border-red-200 rounded-xl p-6 text-center">
              <div className="text-5xl mb-3">🔴</div>
              <p className="text-red-600 font-bold text-xl">LOTTERY IS OVER</p>
              <p className="text-red-500 text-sm mt-2">No more entries accepted</p>
            </div>
          ) : isSoldOut ? (
            <div className="mt-6 bg-yellow-50/80 backdrop-blur-sm border border-yellow-200 rounded-xl p-6 text-center">
              <div className="text-5xl mb-3">🎟️</div>
              <p className="text-yellow-600 font-bold text-xl">SOLD OUT</p>
              <p className="text-yellow-500 text-sm mt-2">All tickets have been sold</p>
            </div>
          ) : (
            <>
              <div className="mt-6 space-y-4">
                <div className="flex justify-between text-gray-600 font-medium">
                  <span className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Tickets Sold
                  </span>
                  <span className="font-bold text-indigo-600">
                    {lottery.ticketsSold} / {lottery.maxTickets}
                  </span>
                </div>
                
                <div className="progress-bar">
                  <div 
                    className="progress-fill"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500">Remaining</p>
                    <p className="text-3xl font-bold text-indigo-600">
                      {lottery.remaining}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Status</p>
                    <span className={`status-badge ${isSoldOut ? 'status-sold-out' : 'status-open'}`}>
                      {isSoldOut ? 'Sold Out' : 'Open'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
                  <Clock className="w-4 h-4" />
                  <span>Get your ticket now!</span>
                </div>
              </div>

              <Link to="/buy" className="btn-primary mt-6 block text-center group">
                <span className="flex items-center justify-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Buy Ticket
                  <Gift className="w-5 h-5" />
                </span>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
