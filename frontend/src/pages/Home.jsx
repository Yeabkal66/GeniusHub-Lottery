import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Sparkles, Ticket, Gift, Users, Clock, Crown, Star, Zap } from 'lucide-react';

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
          <div className="spinner-premium relative mx-auto"></div>
          <p className="mt-6 text-white/60 font-light text-lg">Loading the lottery...</p>
        </div>
      </div>
    );
  }

  if (!lottery) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="glass-card p-8 max-w-md w-full text-center">
          <p className="text-red-400">Failed to load lottery</p>
          <button onClick={fetchStatus} className="btn-premium mt-4">
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
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      {/* Animated particles */}
      <div className="bg-particles">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              width: Math.random() * 6 + 2 + 'px',
              height: Math.random() * 6 + 2 + 'px',
              left: Math.random() * 100 + '%',
              animationDuration: Math.random() * 20 + 15 + 's',
              animationDelay: Math.random() * 10 + 's',
              background: `rgba(99, 102, 241, ${Math.random() * 0.2 + 0.05})`
            }}
          />
        ))}
      </div>

      <div className="glass-card w-full max-w-md p-8 relative z-10 hover-lift">
        {/* Glow effect */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10">
          {/* Header with crown */}
          <div className="text-center">
            <div className="inline-block p-5 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-2xl float-animation border border-white/10">
              <Crown className="w-14 h-14 text-yellow-400" />
            </div>
            <h1 className="section-title gradient-text mt-4">Lottery</h1>
            <p className="text-white/60 text-lg font-light">Win amazing prizes!</p>
          </div>

          {isShutdown ? (
            <div className="mt-8 bg-red-500/10 border border-red-500/20 rounded-2xl p-6 text-center backdrop-blur-sm">
              <div className="text-6xl mb-3">🔴</div>
              <p className="text-red-400 font-bold text-2xl">LOTTERY IS OVER</p>
              <p className="text-red-400/60 text-sm mt-2">No more entries accepted</p>
            </div>
          ) : isSoldOut ? (
            <div className="mt-8 bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-6 text-center backdrop-blur-sm">
              <div className="text-6xl mb-3">🎟️</div>
              <p className="text-yellow-400 font-bold text-2xl">SOLD OUT</p>
              <p className="text-yellow-400/60 text-sm mt-2">All tickets have been sold</p>
            </div>
          ) : (
            <>
              <div className="mt-8 space-y-6">
                {/* Progress section */}
                <div>
                  <div className="flex justify-between text-white/70 text-sm font-medium mb-2">
                    <span className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Tickets Sold
                    </span>
                    <span className="text-white font-bold">
                      {lottery.ticketsSold} / {lottery.maxTickets}
                    </span>
                  </div>
                  <div className="progress-premium">
                    <div 
                      className="progress-fill-premium"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-2xl p-4 text-center border border-white/5">
                    <p className="text-white/40 text-xs uppercase tracking-wider font-semibold">Remaining</p>
                    <p className="stat-number-gold mt-1">{lottery.remaining}</p>
                  </div>
                  <div className="bg-white/5 rounded-2xl p-4 text-center border border-white/5">
                    <p className="text-white/40 text-xs uppercase tracking-wider font-semibold">Status</p>
                    <div className="mt-1">
                      <span className={`badge ${isSoldOut ? 'badge-sold-out' : 'badge-open'}`}>
                        {isSoldOut ? 'Sold Out' : 'Open'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Prize info */}
                <div className="bg-gradient-to-r from-yellow-500/10 to-amber-500/10 rounded-2xl p-4 border border-yellow-500/10 text-center">
                  <Star className="w-5 h-5 text-yellow-400 inline-block mr-2" />
                  <span className="text-white/80 font-medium">Grand Prize: $10,000</span>
                </div>

                {/* Buy button */}
                <Link to="/buy" className="btn-premium block text-center group relative overflow-hidden">
                  <span className="relative z-10 flex items-center justify-center gap-3">
                    <Ticket className="w-5 h-5" />
                    Buy Ticket
                    <Sparkles className="w-4 h-4" />
                  </span>
                </Link>

                {/* Footer links */}
                <div className="flex gap-4 mt-2">
                  <Link to="/status" className="btn-secondary-premium text-center text-sm">
                    <Zap className="w-4 h-4 inline-block mr-2" />
                    Check Status
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
