import React, { useState } from 'react';
import { loginUser } from '../api';

const Login = ({ onLoginSuccess }) => {
  const [role, setRole] = useState('Staff');
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await loginUser({ ...formData, role: role.toLowerCase() });
      if (res.data.success) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        onLoginSuccess(res.data.user);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      {/* Inject Keyframe Animation for Spinner */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>

      {/* LEFT BRAND HERO PANEL */}
      <div style={styles.leftPanel}>
        <div style={styles.bgImage} />
        <div style={styles.colorOverlay} />

        <div style={styles.leftContent}>
          {/* Top Branding */}
          <div style={styles.brandHeader}>
            <img 
              src="/images/TBS-logo.jpeg" 
              alt="TBS Logo" 
              style={styles.logoBadge}
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <div>
              <h2 style={styles.brandTitle}>The Baking School</h2>
              <p style={styles.brandSubtitle}>Information Management System</p>
            </div>
          </div>

          {/* Center Quote */}
          <div style={styles.quoteBox}>
            <h1 style={styles.mainHeading}>Master the art of baking</h1>
            <p style={styles.subHeading}>
               manage your courses, 
              track attendance, and access exclusive recipes all in one place.
            </p>
          </div>

          {/* Bottom Stats */}
          <div style={styles.statsRow}>
            <div style={styles.statItem}>
              <h3 style={styles.statNumber}>12+</h3>
              <p style={styles.statLabel}>Courses</p>
            </div>
            <div style={styles.statItem}>
              <h3 style={styles.statNumber}>500+</h3>
              <p style={styles.statLabel}>Recipes</p>
            </div>
            <div style={styles.statItem}>
              <h3 style={styles.statNumber}>98%</h3>
              <p style={styles.statLabel}>Completion</p>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT LOGIN FORM PANEL */}
      <div style={styles.rightPanel}>
        <div style={styles.formContainer}>
          <h2 style={styles.welcomeTitle}>Welcome back</h2>
          <p style={styles.welcomeSubtitle}>Sign in to access your dashboard</p>

          {/* Role Toggle Selector */}
          <div style={{ marginTop: '22px' }}>
            <label style={styles.inputLabel}>I am a...</label>
            <div style={styles.toggleGroup}>
              <button
                type="button"
                onClick={() => setRole('Student')}
                style={{
                  ...styles.toggleBtn,
                  ...(role === 'Student' ? styles.toggleBtnActive : styles.toggleBtnInactive)
                }}
              >
                🎓 Student
              </button>
              <button
                type="button"
                onClick={() => setRole('Staff')}
                style={{
                  ...styles.toggleBtn,
                  ...(role === 'Staff' ? styles.toggleBtnActive : styles.toggleBtnInactive)
                }}
              >
                👨‍🍳 Staff
              </button>
            </div>
          </div>

          {error && <div style={styles.errorBox}>{error}</div>}

          <form onSubmit={handleSubmit} style={{ marginTop: '18px' }}>
            <div style={styles.fieldGroup}>
              <label style={styles.inputLabel}>Email Address</label>
              <div style={styles.inputWrapper}>
                <span style={styles.inputIcon}>✉️</span>
                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  style={styles.input}
                />
              </div>
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.inputLabel}>Password</label>
              <div style={styles.inputWrapper}>
                <span style={styles.inputIcon}>🔒</span>
                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  style={styles.input}
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading} 
              style={{
                ...styles.submitBtn,
                opacity: loading ? 0.75 : 1,
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? (
                <div style={styles.loadingContainer}>
                  <div style={styles.spinner} />
                  <span>Signing In...</span>
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <p style={styles.footerText}>
            Don't have an account? <span style={styles.signupLink}>Contact Administration</span>
          </p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    minHeight: '100vh',
    width: '100vw',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    backgroundColor: '#ffffff',
    overflow: 'hidden'
  },
  leftPanel: {
    flex: '1.7',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: '48px 64px',
    color: '#ffffff',
    backgroundColor: '#0f172a'
  },
  bgImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: `url('/images/bg-custom.jpg')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    opacity: 0.35
  },
  colorOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.90) 0%, rgba(30, 58, 138, 0.82) 55%, rgba(202, 138, 4, 0.55) 100%)'
  },
  leftContent: {
    position: 'relative',
    zIndex: 2,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '100%'
  },
  brandHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px'
  },
  logoBadge: {
    width: '46px',
    height: '46px',
    borderRadius: '10px',
    objectFit: 'cover',
    border: '2px solid rgba(253, 224, 71, 0.8)'
  },
  brandTitle: {
    fontSize: '22px',
    fontWeight: '700',
    margin: 0,
    color: '#ffffff'
  },
  brandSubtitle: {
    fontSize: '12px',
    color: '#fde047',
    margin: '2px 0 0 0',
    fontWeight: '600',
    letterSpacing: '0.4px',
    textTransform: 'uppercase'
  },
  quoteBox: {
    maxWidth: '520px',
    margin: 'auto 0'
  },
  mainHeading: {
    fontSize: '40px',
    fontWeight: '800',
    lineHeight: '1.2',
    marginBottom: '16px',
    color: '#ffffff'
  },
  subHeading: {
    fontSize: '15px',
    lineHeight: '1.6',
    color: 'rgba(255, 255, 255, 0.95)',
    fontWeight: '400'
  },
  statsRow: {
    display: 'flex',
    gap: '40px',
    borderTop: '1px solid rgba(255, 255, 255, 0.15)',
    paddingTop: '24px'
  },
  statItem: {
    display: 'flex',
    flexDirection: 'column'
  },
  statNumber: {
    fontSize: '26px',
    fontWeight: '700',
    color: '#fde047',
    margin: 0
  },
  statLabel: {
    fontSize: '13px',
    color: 'rgba(255, 255, 255, 0.85)',
    margin: '4px 0 0 0'
  },
  rightPanel: {
    flex: '0.85',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '30px 40px',
    backgroundColor: '#ffffff'
  },
  formContainer: {
    width: '100%',
    maxWidth: '350px'
  },
  welcomeTitle: {
    fontSize: '26px',
    fontWeight: '700',
    color: '#0f172a',
    margin: '0 0 6px 0'
  },
  welcomeSubtitle: {
    fontSize: '14px',
    color: '#64748b',
    margin: 0
  },
  inputLabel: {
    display: 'block',
    fontSize: '13px',
    fontWeight: '600',
    color: '#334155',
    marginBottom: '6px'
  },
  toggleGroup: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '10px',
    marginBottom: '16px'
  },
  toggleBtn: {
    padding: '10px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    border: '1.5px solid transparent'
  },
  toggleBtnActive: {
    backgroundColor: '#fffbeb',
    borderColor: '#d97706',
    color: '#92400e'
  },
  toggleBtnInactive: {
    backgroundColor: '#f8fafc',
    borderColor: '#e2e8f0',
    color: '#64748b'
  },
  fieldGroup: {
    marginBottom: '16px'
  },
  inputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center'
  },
  inputIcon: {
    position: 'absolute',
    left: '12px',
    fontSize: '14px',
    opacity: 0.6
  },
  input: {
    width: '100%',
    padding: '10px 12px 10px 38px',
    fontSize: '14px',
    borderRadius: '8px',
    border: '1px solid #cbd5e1',
    outline: 'none',
    boxSizing: 'border-box'
  },
  submitBtn: {
    width: '100%',
    padding: '11px',
    fontSize: '15px',
    fontWeight: '700',
    color: '#ffffff',
    backgroundColor: '#d97706',
    border: 'none',
    borderRadius: '8px',
    marginTop: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  loadingContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  spinner: {
    width: '16px',
    height: '16px',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    borderTop: '2px solid #ffffff',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite'
  },
  errorBox: {
    padding: '10px',
    backgroundColor: '#fef2f2',
    color: '#b91c1c',
    borderRadius: '6px',
    fontSize: '13px',
    marginTop: '10px'
  },
  footerText: {
    textAlign: 'center',
    fontSize: '13px',
    color: '#64748b',
    marginTop: '20px'
  },
  signupLink: {
    color: '#1d4ed8',
    fontWeight: '600',
    cursor: 'pointer'
  }
};

export default Login;