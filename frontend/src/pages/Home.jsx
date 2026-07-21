import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Ticket, Users, Clock, Sparkles, Gift, ChevronRight, Crown, Shield, CheckCircle, XCircle } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Home = () => {
  const [lottery, setLottery] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPolicies, setShowPolicies] = useState(false);
  const [agreed, setAgreed] = useState(false);

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
        {/* Header */}
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
            {/* Progress */}
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

            {/* Stats Grid */}
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

            {/* Prize Info */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 mt-4 border border-purple-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Gift className="w-5 h-5 text-purple-600" />
                  <span className="text-gray-700 font-medium">Grand Prize</span>
                </div>
                <span className="text-purple-700 font-bold">Over 1 million ETB worth prizes</span>
              </div>
            </div>

            {/* Prizes & Policies Button */}
            <button
              onClick={() => setShowPolicies(!showPolicies)}
              className="btn-secondary-clean mt-4"
              style={{
                background: showPolicies ? '#ede9fe' : '#faf5ff',
                borderColor: showPolicies ? '#8b5cf6' : '#e9d5ff'
              }}
            >
              <Shield className="w-4 h-4" />
              {showPolicies ? 'Hide' : 'View'} Prizes & Policies
              <ChevronRight className={`w-4 h-4 transition-transform ${showPolicies ? 'rotate-90' : ''}`} />
            </button>

            {/* Prizes & Policies Section */}
            {showPolicies && (
              <div className="mt-4 space-y-4 animate-slideDown">
                {/* Policies */}
                <div className="bg-red-50 rounded-xl p-4 border-2 border-red-200">
                  <h3 className="text-sm font-bold text-red-700 mb-3 flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    📋 Policies
                  </h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2 text-sm text-red-700">
                      <span className="text-red-500 font-bold">1.</span>
                      <span>Full payment (2000 ETB) must be paid to be qualified</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-red-700">
                      <span className="text-red-500 font-bold">2.</span>
                      <span>Payment must be done within 2 hours after application</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-red-700">
                      <span className="text-red-500 font-bold">3.</span>
                      <span>Payment must be done only via Telebirr</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-red-700">
                      <span className="text-red-500 font-bold">4.</span>
                      <span>Payment must be done with the phone number you'll fill on the next page</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-red-700">
                      <span className="text-red-500 font-bold">5.</span>
                      <span>The phone number, the name on Telebirr and the name on the form must match</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-red-700">
                      <span className="text-red-500 font-bold">6.</span>
                      <span>In every condition, the payment is <strong>non-refundable</strong></span>
                    </li>
                  </ul>
                </div>

                {/* Prizes */}
                <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl p-4 border-2 border-yellow-200">
                  <h3 className="text-sm font-bold text-amber-700 mb-3 flex items-center gap-2">
                    <Crown className="w-4 h-4" />
                    🏆 Prizes
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3 bg-white/50 rounded-lg p-3 border border-yellow-200">
                      <span className="text-2xl">🥇</span>
                      <div>
                        <span className="font-bold text-amber-700">1st Winner:</span>
                        <p className="text-sm text-gray-700">Service fee, 1 year tuition and dorm fee, ticket fee covered</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3 bg-white/50 rounded-lg p-3 border border-yellow-200">
                      <span className="text-2xl">🥈</span>
                      <div>
                        <span className="font-bold text-amber-700">2nd Winner:</span>
                        <p className="text-sm text-gray-700">1 year tuition fee covered</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3 bg-white/50 rounded-lg p-3 border border-yellow-200">
                      <span className="text-2xl">🥉</span>
                      <div>
                        <span className="font-bold text-amber-700">3rd Winner:</span>
                        <p className="text-sm text-gray-700">Service fee covered</p>
                      </div>
                    </li>
                  </ul>
                </div>

                {/* Agreement Checkbox */}
                <div className="bg-purple-50 rounded-xl p-4 border-2 border-purple-200">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agreed}
                      onChange={(e) => setAgreed(e.target.checked)}
                      className="mt-1 w-5 h-5 text-purple-600 border-2 border-purple-300 rounded focus:ring-purple-500 cursor-pointer"
                    />
                    <div>
                      <span className="text-sm font-medium text-purple-700">
                        I have read and agree to all policies and terms
                      </span>
                      <p className="text-xs text-purple-500 mt-1">
                        By checking this box, you confirm that you understand and accept all the rules above
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            )}

            {/* Buy Ticket Button - Disabled unless agreed */}
            {!agreed ? (
              <div className="mt-4">
                <div 
                  className="btn-primary-clean opacity-50 cursor-not-allowed"
                  style={{ pointerEvents: 'none' }}
                >
                  <Ticket className="w-5 h-5" />
                  Agree to policies first
                </div>
                <p className="text-xs text-purple-400 text-center mt-2">
                  ⚠️ Please read and agree to the policies above
                </p>
              </div>
            ) : (
              <Link to="/buy" className="btn-primary-clean mt-4">
                <Ticket className="w-5 h-5" />
                Buy Ticket
                <Sparkles className="w-4 h-4" />
              </Link>
            )}

            {/* Check Status Button */}
            <Link to="/status" className="btn-secondary-clean mt-3">
              <Clock className="w-4 h-4" />
              Check Application Status
              <ChevronRight className="w-4 h-4" />
            </Link>
          </>
        )}
      </div>

      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Home;
