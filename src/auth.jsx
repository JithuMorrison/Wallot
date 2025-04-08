import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const AuthPage = ({ type, login }) => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    try {
      const endpoint = type === 'login' ? '/auth/login' : '/auth/register';
      const { data } = await axios.post(endpoint, formData);
      login(data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.box}>
        <div style={styles.header}>
          <h2 style={{ margin: 0 }}>{type === 'login' ? 'Welcome Back' : 'Join Wallot'}</h2>
          <p style={{ margin: 0 }}>{type === 'login' ? 'Sign in to continue' : 'Create your account'}</p>
        </div>

        <div style={styles.body}>
          {error && <div style={styles.error}>{error}</div>}

          <form onSubmit={handleSubmit} style={styles.form}>
            {type === 'register' && (
              <div style={styles.formGroup}>
                <label style={styles.label}>Username</label>
                <input
                  type="text"
                  name="username"
                  required
                  placeholder="johndoe"
                  value={formData.username}
                  onChange={handleChange}
                  style={styles.input}
                />
              </div>
            )}

            <div style={styles.formGroup}>
              <label style={styles.label}>Email</label>
              <input
                type="email"
                name="email"
                required
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Password</label>
              <input
                type="password"
                name="password"
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                style={styles.input}
              />
            </div>

            {type === 'login' && (
              <div style={styles.forgotLink}>
                <Link to="/forgot-password" style={styles.link}>Forgot password?</Link>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                ...styles.button,
                backgroundColor: isSubmitting ? '#bdbefb' : '#4f46e5',
                cursor: isSubmitting ? 'not-allowed' : 'pointer'
              }}
            >
              {isSubmitting ? 'Processing...' : type === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <div style={styles.footer}>
            <span>{type === 'login' ? 'New to Wallot?' : 'Already have an account?'}</span>
            <Link to={type === 'login' ? '/register' : '/login'} style={styles.link}>
              {type === 'login' ? ' Create an account' : ' Sign in instead'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(to bottom right, #eef2ff, #f5e9ff)',
    padding: '2rem',
    fontFamily: 'Arial, sans-serif'
  },
  box: {
    background: 'white',
    maxWidth: '400px',
    width: '100%',
    borderRadius: '12px',
    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden'
  },
  header: {
    background: 'linear-gradient(to right, #4f46e5, #8b5cf6)',
    padding: '1.5rem',
    textAlign: 'center',
    color: 'white'
  },
  body: {
    padding: '2rem'
  },
  error: {
    backgroundColor: '#fdecea',
    color: '#d32f2f',
    padding: '0.75rem',
    borderLeft: '4px solid #d32f2f',
    marginBottom: '1rem',
    borderRadius: '5px',
    textAlign: 'center'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  formGroup: {
    width: '100%',
    marginBottom: '1.25rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  label: {
    alignSelf: 'flex-start',
    fontSize: '0.9rem',
    marginBottom: '0.4rem'
  },
  input: {
    width: '90%',
    padding: '0.75rem',
    border: '1px solid #ccc',
    borderRadius: '6px',
    fontSize: '0.9rem'
  },
  forgotLink: {
    textAlign: 'center',
    marginBottom: '1rem'
  },
  button: {
    width: '90%',
    padding: '0.75rem',
    color: 'white',
    fontWeight: 'bold',
    border: 'none',
    borderRadius: '6px',
    fontSize: '1rem',
    transition: 'background-color 0.3s ease'
  },
  footer: {
    textAlign: 'center',
    marginTop: '1.5rem',
    fontSize: '0.9rem'
  },
  link: {
    color: '#4f46e5',
    textDecoration: 'none',
    marginLeft: '5px'
  }
};

export default AuthPage;
