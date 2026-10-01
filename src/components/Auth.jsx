import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import { 
  Building2, 
  LogIn, 
  UserPlus, 
  User, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Shield, 
  GraduationCap 
} from 'lucide-react';

export const Auth = () => {
  const { login } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Form states
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [registerData, setRegisterData] = useState({
    username: '',
    password: '',
    email: '',
    fullName: '',
    department: 'Computer Science',
    role: 'STUDENT',
  });

  const handleQuickFill = (u, p) => {
    setLoginData({ username: u, password: p });
    setError('');
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const res = await authAPI.login(loginData);
      if (res.success && res.data) {
        login(res.data);
      } else {
        setError(res.message || 'Login failed');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const res = await authAPI.register(registerData);
      if (res.success) {
        setSuccessMsg(res.message || 'Registration submitted! Please wait for Admin approval.');
        setIsRegister(false);
      } else {
        setError(res.message || 'Registration failed');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      position: 'relative',
    }}>
      <div className="glass-panel" style={{
        width: '100%',
        maxWidth: 460,
        padding: '36px 32px',
        position: 'relative',
        overflow: 'hidden',
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: 'var(--radius-xl)',
        boxShadow: '0 20px 40px -10px rgba(15, 23, 42, 0.1), 0 0 0 1px rgba(226, 232, 240, 0.6)'
      }}>
        {/* Top Radiant Accent Line */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background: 'linear-gradient(90deg, #4f46e5, #7c3aed, #0284c7, #059669)',
        }} />

        {/* Logo and Brand Title */}
        <div style={{ textAlign: 'center', marginBottom: 26 }}>
          <div style={{
            width: 54,
            height: 54,
            borderRadius: 16,
            background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 50%, #0284c7 100%)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 6px 20px rgba(79, 70, 229, 0.35)',
            marginBottom: 12,
            border: '1px solid rgba(255, 255, 255, 0.4)'
          }}>
            <Building2 size={28} color="#ffffff" />
          </div>
          <h2 style={{ fontSize: '1.6rem', marginBottom: 4, letterSpacing: '-0.03em', color: '#0f172a' }}>
            Smart Resource Management
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.86rem' }}>
            CSRM Centralized Operations Portal
          </p>
        </div>

        {/* Quick Demo Login Pill Bar */}
        {!isRegister && (
          <div style={{
            background: '#f8fafc',
            borderRadius: 'var(--radius-md)',
            padding: '12px 14px',
            marginBottom: 22,
            border: '1px solid #e2e8f0',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8, fontSize: '0.74rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <Sparkles size={13} color="#d97706" /> Fast Evaluation Logins:
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                style={{ flex: 1, fontSize: '0.78rem', padding: '6px 4px', borderRadius: 9999, background: '#ffffff' }}
                onClick={() => handleQuickFill('admin', 'admin123')}
              >
                <Shield size={12} color="#7c3aed" /> Admin
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                style={{ flex: 1, fontSize: '0.78rem', padding: '6px 4px', borderRadius: 9999, background: '#ffffff' }}
                onClick={() => handleQuickFill('faculty', 'faculty123456')}
              >
                <GraduationCap size={12} color="#0284c7" /> Faculty
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                style={{ flex: 1, fontSize: '0.78rem', padding: '6px 4px', borderRadius: 9999, background: '#ffffff' }}
                onClick={() => handleQuickFill('student', 'password123456')}
              >
                <User size={12} color="#059669" /> Student
              </button>
            </div>
          </div>
        )}

        {/* Tab Toggle Pill Switcher */}
        <div style={{
          display: 'flex',
          background: '#f1f5f9',
          borderRadius: 9999,
          padding: 3,
          marginBottom: 22,
          border: '1px solid #e2e8f0',
        }}>
          <button
            type="button"
            style={{
              flex: 1,
              padding: '8px',
              border: 'none',
              borderRadius: 9999,
              background: !isRegister ? 'var(--grad-primary)' : 'transparent',
              color: !isRegister ? '#fff' : 'var(--text-secondary)',
              fontWeight: 700,
              fontSize: '0.84rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: !isRegister ? '0 2px 8px rgba(79, 70, 229, 0.3)' : 'none'
            }}
            onClick={() => { setIsRegister(false); setError(''); }}
          >
            Sign In
          </button>
          <button
            type="button"
            style={{
              flex: 1,
              padding: '8px',
              border: 'none',
              borderRadius: 9999,
              background: isRegister ? 'var(--grad-primary)' : 'transparent',
              color: isRegister ? '#fff' : 'var(--text-secondary)',
              fontWeight: 700,
              fontSize: '0.84rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: isRegister ? '0 2px 8px rgba(79, 70, 229, 0.3)' : 'none'
            }}
            onClick={() => { setIsRegister(true); setError(''); }}
          >
            Register
          </button>
        </div>

        {/* Feedback Messages */}
        {error && (
          <div style={{
            padding: '10px 14px',
            borderRadius: 'var(--radius-sm)',
            background: '#ffe4e6',
            border: '1px solid #fecdd3',
            color: '#be123c',
            fontSize: '0.82rem',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            marginBottom: 18,
          }}>
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div style={{
            padding: '10px 14px',
            borderRadius: 'var(--radius-sm)',
            background: '#d1fae5',
            border: '1px solid #a7f3d0',
            color: '#065f46',
            fontSize: '0.82rem',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            marginBottom: 18,
          }}>
            <CheckCircle2 size={16} style={{ flexShrink: 0 }} />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Login Form */}
        {!isRegister ? (
          <form onSubmit={handleLoginSubmit}>
            <div className="form-group">
              <label className="form-label">Username</label>
              <input
                type="text"
                required
                className="form-input"
                placeholder="Enter username"
                value={loginData.username}
                onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                required
                className="form-input"
                placeholder="Enter password"
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%', marginTop: 10, padding: '11px', borderRadius: 'var(--radius-sm)' }}
            >
              <LogIn size={17} />
              {loading ? 'Authenticating...' : 'Sign In to Portal'}
            </button>
          </form>
        ) : (
          /* Registration Form */
          <form onSubmit={handleRegisterSubmit}>
            <div className="form-group">
              <label className="form-label">Select Account Role</label>
              <select
                className="form-select"
                value={registerData.role}
                onChange={(e) => setRegisterData({ ...registerData, role: e.target.value })}
              >
                <option value="STUDENT">Student</option>
                <option value="FACULTY">Faculty Member</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                required
                className="form-input"
                placeholder="e.g. John Doe"
                value={registerData.fullName}
                onChange={(e) => setRegisterData({ ...registerData, fullName: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                required
                className="form-input"
                placeholder="name@campus.edu"
                value={registerData.email}
                onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div className="form-group">
                <label className="form-label">Username</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="Username"
                  value={registerData.username}
                  onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  required
                  className="form-input"
                  placeholder="Password"
                  value={registerData.password}
                  onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Department</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Computer Science, Mechanical"
                value={registerData.department}
                onChange={(e) => setRegisterData({ ...registerData, department: e.target.value })}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%', marginTop: 10, padding: '11px', borderRadius: 'var(--radius-sm)' }}
            >
              <UserPlus size={17} />
              {loading ? 'Submitting Registration...' : 'Register Account'}
            </button>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: 10 }}>
              * New accounts require Administrator approval before logging in.
            </p>
          </form>
        )}
      </div>
    </div>
  );
};
