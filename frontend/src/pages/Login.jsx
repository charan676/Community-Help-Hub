import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DefaultLayout from '../layouts/DefaultLayout';
import useAuth from '../hooks/useAuth';

export const Login = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, isAdmin, error, loading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formValidation, setFormValidation] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      if (isAdmin) {
        navigate('/admin');
      } else {
        navigate('/');
      }
    }
  }, [isAuthenticated, isAdmin, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormValidation('');

    if (!email || !password) {
      setFormValidation('Please provide all credentials.');
      return;
    }

    if (password.length < 8) {
      setFormValidation('Password must be at least 8 characters long.');
      return;
    }

    try {
      await login({ email, password });
    } catch {
      // Handled by hook error slice
    }
  };

  return (
    <DefaultLayout>
      <div style={{ maxWidth: '400px', margin: '60px auto 100px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '24px' }}>🔑 Portal Login</h2>
        
        <form onSubmit={handleSubmit} className="card-item" style={{ gap: '16px' }}>
          {(formValidation || error) && (
            <div style={{ color: 'var(--error)', backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: '12px', borderRadius: 'var(--radius-sm)', fontSize: '0.9rem' }}>
              {formValidation || error}
            </div>
          )}

          <div className="form-group" style={{ marginBottom: '0' }}>
            <label>Username</label>
            <input 
              type="text" 
              className="form-control" 
              placeholder="e.g. admin"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: '0' }}>
            <label>Password</label>
            <input 
              type="password" 
              className="form-control" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', padding: '12px', marginTop: '12px' }}
            disabled={loading}
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

      </div>
    </DefaultLayout>
  );
};

export default Login;
