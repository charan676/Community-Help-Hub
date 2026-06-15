import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useAuth from '../hooks/useAuth';
import ChatbotWidget from '../components/chatbot/ChatbotWidget';

export const DefaultLayout = ({ children }) => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  
  // Theme state
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [language, setLanguage] = useState(localStorage.getItem('language') || 'en');

  useEffect(() => {
    document.body.className = `${theme}-theme`;
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const handleLanguageChange = (e) => {
    const selectedLang = e.target.value;
    setLanguage(selectedLang);
    i18n.changeLanguage(selectedLang);
    localStorage.setItem('language', selectedLang);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-brand" style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
          <h1>{t('title')}</h1>
          <p>{t('subtitle')}</p>
        </div>

        <nav className="nav-links">
          <Link to="/" className={location.pathname === '/' ? 'active' : ''}>{t('home')}</Link>
          <Link to="/emergency" className={location.pathname === '/emergency' ? 'active' : ''}>{t('emergency')}</Link>
          <Link to="/healthcare" className={location.pathname === '/healthcare' ? 'active' : ''}>{t('healthcare')}</Link>
          <Link to="/schemes" className={location.pathname === '/schemes' ? 'active' : ''}>{t('schemes')}</Link>
          <Link to="/education" className={location.pathname === '/education' ? 'active' : ''}>{t('education')}</Link>
          <Link to="/contact" className={location.pathname === '/contact' ? 'active' : ''}>{t('contact')}</Link>
        </nav>

        <div className="header-controls">
          {/* Language Selector */}
          <select 
            value={language} 
            onChange={handleLanguageChange}
            className="form-control"
            style={{ padding: '6px 12px', fontSize: '0.85rem' }}
          >
            <option value="en">English</option>
            <option value="te">తెలుగు (Telugu)</option>
          </select>

          {/* Theme Toggle Button */}
          <button 
            className="btn btn-secondary btn-circle" 
            onClick={toggleTheme}
            title="Toggle theme"
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>

          {/* Auth Button */}
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>
                👤 {user?.name} {user?.role === 'admin' && '(Admin)'}
              </span>
              {user?.role === 'admin' && (
                <button 
                  className="btn btn-secondary" 
                  onClick={() => navigate('/admin')}
                  style={{ padding: '6px 12px', fontSize: '0.85rem' }}
                >
                  {t('admin')}
                </button>
              )}
              <button 
                className="btn btn-danger" 
                onClick={handleLogout}
                style={{ padding: '6px 12px', fontSize: '0.85rem' }}
              >
                {t('logout')}
              </button>
            </div>
          ) : (
            <button 
              className="btn btn-primary" 
              onClick={() => navigate('/login')}
              style={{ padding: '6px 16px', fontSize: '0.85rem' }}
            >
              {t('login')}
            </button>
          )}
        </div>
      </header>

      <main className="main-content">
        {children}
      </main>

      <footer className="app-footer">
        <h3>{t('title')}</h3>
        <p>{t('subtitle')}</p>
        <p style={{ marginTop: '16px' }}>
          {t('emergency')}: 🚨 112 | 🚑 108 | 🔥 101 | 👩 181
        </p>
        <p style={{ marginTop: '24px', fontSize: '0.8rem' }}>
          © {new Date().getFullYear()} Community Help Hub | Modernized Digital Public Infrastructure Portal
        </p>
      </footer>

      {/* Floating Chatbot assistant */}
      <ChatbotWidget />
    </div>
  );
};

export default DefaultLayout;
