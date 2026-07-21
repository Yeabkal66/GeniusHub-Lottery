import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Instagram, 
  Heart, 
  Shield, 
  Globe,
  GraduationCap,
  Send
} from 'lucide-react';

const Layout = ({ children }) => {
  const location = useLocation();
  const currentYear = new Date().getFullYear();

  // Social Media Links - Add your URLs here
  const socialLinks = {
    instagram: 'https://instagram.com/your_username',
    telegram: 'https://t.me/your_username',
    tiktok: 'https://tiktok.com/@your_username'
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: 'linear-gradient(145deg, #faf5ff 0%, #f3e8ff 50%, #ede9fe 100%)'
    }}>
      {/* Main Content */}
      <div style={{ flex: 1 }}>
        {children}
      </div>

      {/* ========== FOOTER ========== */}
      <footer style={{
        marginTop: '40px',
        background: 'linear-gradient(135deg, #1a0a2e 0%, #2d1b69 50%, #1a1a4e 100%)',
        borderTop: '4px solid #7c3aed',
        padding: '40px 20px 20px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Decorative purple glow */}
        <div style={{
          position: 'absolute',
          top: '-100px',
          right: '-100px',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(124, 58, 237, 0.15), transparent 70%)',
          borderRadius: '50%',
          pointerEvents: 'none'
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: '-100px',
          left: '-100px',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.1), transparent 70%)',
          borderRadius: '50%',
          pointerEvents: 'none'
        }}></div>

        <div style={{
          maxWidth: '420px',
          margin: '0 auto',
          position: 'relative',
          zIndex: 1
        }}>
          {/* Company Name & Logo */}
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 20px',
              background: 'rgba(124, 58, 237, 0.15)',
              borderRadius: '16px',
              border: '1px solid rgba(124, 58, 237, 0.2)',
              marginBottom: '8px'
            }}>
              <GraduationCap className="w-6 h-6" style={{ color: '#a78bfa' }} />
              <span style={{
                fontSize: '1.1rem',
                fontWeight: '800',
                background: 'linear-gradient(135deg, #a78bfa, #c084fc, #e879f9)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                GeniusHub Educational Consultancy
              </span>
            </div>
            <p style={{
              fontSize: '0.75rem',
              color: 'rgba(167, 139, 250, 0.7)',
              marginTop: '4px',
              fontStyle: 'italic'
            }}>
              Ethiopia • China • Global
            </p>
          </div>

          {/* Social Media Links */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '12px',
            marginBottom: '28px',
            flexWrap: 'wrap'
          }}>
            {/* Instagram */}
            <a 
              href={socialLinks.instagram}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                background: 'rgba(255,255,255,0.06)',
                borderRadius: '12px',
                color: '#c4b5fd',
                textDecoration: 'none',
                fontSize: '0.8rem',
                fontWeight: '500',
                transition: 'all 0.3s ease',
                border: '1px solid rgba(255,255,255,0.06)'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(124, 58, 237, 0.25)';
                e.target.style.borderColor = '#7c3aed';
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 24px rgba(124, 58, 237, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(255,255,255,0.06)';
                e.target.style.borderColor = 'rgba(255,255,255,0.06)';
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
            >
              <Instagram className="w-4 h-4" />
              Instagram
            </a>

            {/* Telegram */}
            <a 
              href={socialLinks.telegram}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                background: 'rgba(255,255,255,0.06)',
                borderRadius: '12px',
                color: '#c4b5fd',
                textDecoration: 'none',
                fontSize: '0.8rem',
                fontWeight: '500',
                transition: 'all 0.3s ease',
                border: '1px solid rgba(255,255,255,0.06)'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(124, 58, 237, 0.25)';
                e.target.style.borderColor = '#7c3aed';
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 24px rgba(124, 58, 237, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(255,255,255,0.06)';
                e.target.style.borderColor = 'rgba(255,255,255,0.06)';
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
            >
              <Send className="w-4 h-4" />
              Telegram
            </a>

            {/* TikTok */}
            <a 
              href={socialLinks.tiktok}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                background: 'rgba(255,255,255,0.06)',
                borderRadius: '12px',
                color: '#c4b5fd',
                textDecoration: 'none',
                fontSize: '0.8rem',
                fontWeight: '500',
                transition: 'all 0.3s ease',
                border: '1px solid rgba(255,255,255,0.06)'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(124, 58, 237, 0.25)';
                e.target.style.borderColor = '#7c3aed';
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 24px rgba(124, 58, 237, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(255,255,255,0.06)';
                e.target.style.borderColor = 'rgba(255,255,255,0.06)';
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
            >
              <Globe className="w-4 h-4" />
              TikTok
            </a>
          </div>

          {/* Divider */}
          <div style={{
            height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(124, 58, 237, 0.3), transparent)',
            marginBottom: '20px'
          }}></div>

          {/* Disclaimer */}
          <div style={{
            background: 'rgba(255,255,255,0.04)',
            borderRadius: '16px',
            padding: '16px 18px',
            border: '1px solid rgba(124, 58, 237, 0.1)',
            marginBottom: '20px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px'
            }}>
              <Shield className="w-4 h-4" style={{ 
                color: '#a78bfa', 
                flexShrink: 0, 
                marginTop: '1px' 
              }} />
              <p style={{
                fontSize: '0.7rem',
                lineHeight: '1.6',
                color: 'rgba(196, 181, 253, 0.7)',
                margin: 0
              }}>
                <strong style={{ color: '#c4b5fd' }}>Disclaimer:</strong> GeniusHub Educational Consultancy, with operations in Ethiopia and China, is an independent agency dedicated to guiding ambitious students toward their dream of studying in China through Diploma, Bachelor's, Master's, and PhD programs. We provide professional, up-to-date advisory services on admissions, scholarships, and visas based on the latest available information. However, we are not affiliated with any university or government body, and final decisions on admissions, scholarships, and visas rest solely with the respective authorities. While we strive to maximize your success, outcomes cannot be guaranteed as they depend on individual profiles and official evaluations. We encourage you to verify all details directly with official sources for the most accurate guidance.
              </p>
            </div>
          </div>

          {/* Copyright */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            flexWrap: 'wrap'
          }}>
            <span style={{
              fontSize: '0.7rem',
              color: 'rgba(167, 139, 250, 0.5)'
            }}>
              © {currentYear} GeniusHub Educational Consultancy
            </span>
            <span style={{
              color: 'rgba(167, 139, 250, 0.2)',
              fontSize: '0.5rem'
            }}>•</span>
            <span style={{
              fontSize: '0.7rem',
              color: 'rgba(167, 139, 250, 0.4)'
            }}>
              Ethiopia • China
            </span>
            <span style={{
              color: 'rgba(167, 139, 250, 0.2)',
              fontSize: '0.5rem'
            }}>•</span>
            <span style={{
              fontSize: '0.65rem',
              color: 'rgba(167, 139, 250, 0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              Made with <Heart className="w-3 h-3" style={{ color: '#e879f9' }} /> for students
            </span>
          </div>

          {/* Bottom purple glow */}
          <div style={{
            textAlign: 'center',
            marginTop: '12px'
          }}>
            <span style={{
              fontSize: '0.55rem',
              color: 'rgba(167, 139, 250, 0.2)',
              letterSpacing: '2px',
              textTransform: 'uppercase'
            }}>
              Guiding Dreams • Building Futures
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
