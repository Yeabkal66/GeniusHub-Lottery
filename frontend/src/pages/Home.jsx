import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!lottery) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="card text-center">
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

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="card w-full">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
          🎰 Lottery
        </h1>
        <p className="text-center text-gray-600 mb-6">Buy your ticket now!</p>

        {isShutdown ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-4xl mb-2">🔴</p>
            <p className="text-red-600 font-bold text-xl">LOTTERY IS OVER</p>
            <p className="text-red-500 text-sm mt-2">No more entries accepted</p>
          </div>
        ) : isSoldOut ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
            <p className="text-4xl mb-2">🎟️</p>
            <p className="text-yellow-600 font-bold text-xl">SOLD OUT</p>
            <p className="text-yellow-500 text-sm mt-2">All tickets have been sold</p>
          </div>
        ) : (
          <>
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Tickets Sold</span>
                <span className="font-bold">
                  {lottery.ticketsSold} / {lottery.maxTickets}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-blue-600 h-3 rounded-full transition-all"
                  style={{ width: `${(lottery.ticketsSold / lottery.maxTickets) * 100}%` }}
                ></div>
              </div>
              <p className="text-center text-gray-500 text-sm">
                {lottery.remaining} tickets remaining
              </p>
            </div>

            <Link to="/buy" className="btn-primary block text-center">
              🎫 Buy Ticket
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
