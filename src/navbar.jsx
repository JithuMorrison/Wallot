import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = ({ logout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeLink, setActiveLink] = useState(location.pathname);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setActiveLink(location.pathname);
  }, [location]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Add Google Fonts link to your HTML head:
  // <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@700&display=swap" rel="stylesheet" />

  return (
    <nav style={{
      background: scrolled ? 'rgba(255, 255, 255, 0.98)' : 'rgba(255, 255, 255, 0.92)',
      boxShadow: scrolled ? '0 4px 30px rgba(0, 0, 0, 0.1)' : 'none',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(229, 231, 235, 0.5)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
    }}>
      <div style={{
        maxWidth: '1440px',
        margin: '0 auto',
        padding: '0 2rem'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: '5rem'
        }}>
          {/* Logo/Brand */}
          <Link 
            to="/" 
            style={{
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
              transition: 'transform 0.3s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.03)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: '700',
                fontSize: '1.1rem',
                boxShadow: '0 4px 20px rgba(99, 102, 241, 0.3)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease'
              }}>
                $
              </div>
              <span style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                fontFamily: "'Playfair Display', serif",
                background: 'linear-gradient(90deg, #7c3aed 0%, #6366f1 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '-0.5px'
              }}>
                Wallot
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '2rem'
          }}>
            {[
              { path: '/', name: 'Dashboard' },
              { path: '/expenses', name: 'Expenses' },
              { path: '/budgets', name: 'Budgets' },
              { path: '/reports', name: 'Reports' }
            ].map((item) => (
              <Link 
                key={item.path}
                to={item.path}
                style={{
                  textDecoration: 'none',
                  position: 'relative',
                  padding: '1rem 0',
                  color: activeLink === item.path ? '#111827' : '#4b5563',
                  fontWeight: '600',
                  fontSize: '0.95rem',
                  fontFamily: "'Inter', sans-serif",
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
                onMouseEnter={(e) => {
                  if (activeLink !== item.path) {
                    e.currentTarget.style.color = '#111827';
                    e.currentTarget.querySelector('span').style.width = '100%';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeLink !== item.path) {
                    e.currentTarget.style.color = '#4b5563';
                    e.currentTarget.querySelector('span').style.width = '0%';
                  }
                }}
              >
                {item.name}
                <span style={{
                  position: 'absolute',
                  bottom: '0.75rem',
                  left: '0',
                  width: activeLink === item.path ? '100%' : '0%',
                  height: '2px',
                  background: 'linear-gradient(90deg, #8b5cf6 0%, #6366f1 100%)',
                  transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  borderRadius: '2px'
                }}></span>
              </Link>
            ))}

            {/* Logout Button */}
            <button 
              onClick={handleLogout}
              style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.25rem',
                borderRadius: '10px',
                color: '#ef4444',
                fontWeight: '600',
                fontSize: '0.95rem',
                fontFamily: "'Inter', sans-serif",
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(239, 68, 68, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <span>Logout</span>
              <svg 
                width="18" 
                height="18" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor"
                style={{
                  transition: 'transform 0.3s ease'
                }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;