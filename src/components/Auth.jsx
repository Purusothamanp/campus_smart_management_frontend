import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import { 
  Building2, 
  LogIn, 
  UserPlus, 
  CheckCircle2, 
  AlertCircle,
  Lock,
  User as UserIcon,
  Mail,
  Briefcase
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
      setError(err.message || 'Authentication failed. Please check your credentials.');
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
        setSuccessMsg(res.message || 'Registration submitted! Please wait for Administrator approval.');
        setIsRegister(false);
        setLoginData({ username: registerData.username, password: '' });
      } else {
        setError(res.message || 'Registration failed');
      }
    } catch (err) {
      setError(err.message || 'Registration failed. Please verify the information entered.');
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
        maxWidth: 440,
        padding: '36px 32px',
        borderRadius: 'var(--radius-lg)',
        boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.08), 0 0 1px 1px rgba(0, 0, 0, 0.04)',
        background: '#ffffff',
        border: '1px solid #e2e8f0',
      }}>
        {/* Branding Header */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{
            width: 56,
            height: 56,
            borderRadius: 16,
            background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 50%, #0284c7 100%)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 6px 20px rgba(79, 70, 229, 0.35)',
            marginBottom: 14,
            border: '1px solid rgba(255, 255, 255, 0.4)'
          }}>
            <Building2 size={28} color="#ffffff" />
          </div>
          <h2 style={{ fontSize: '1.6rem', marginBottom: 6, letterSpacing: '-0.03em', color: '#0f172a' }}>
            Campus Resource Portal
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
            CSRM Centralized Resource Management System
          </p>
        </div>

        {/* Tab Toggle Pill Switcher */}
        <div style={{
          display: 'flex',
          background: '#f1f5f9',
          borderRadius: 9999,
          padding: 3,
          marginBottom: 24,
          border: '1px solid #e2e8f0',
        }}>
          <button
            type="button"
            style={{
              flex: 1,
              padding: '9px',
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
            onClick={() => { setIsRegister(false); setError(''); setSuccessMsg(''); }}
          >
            Sign In
          </button>
          <button
            type="button"
            style={{
              flex: 1,
              padding: '9px',
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
            onClick={() => { setIsRegister(true); setError(''); setSuccessMsg(''); }}
          >
            Create Account
          </button>
        </div>

        {/* Feedback Messages */}
        {error && (
          <div style={{
            padding: '11px 14px',
            borderRadius: 'var(--radius-sm)',
            background: '#ffe4e6',
            border: '1px solid #fecdd3',
            color: '#be123c',
            fontSize: '0.84rem',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            marginBottom: 20,
          }}>
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div style={{
            padding: '11px 14px',
            borderRadius: 'var(--radius-sm)',
            background: '#d1fae5',
            border: '1px solid #a7f3d0',
            color: '#065f46',
            fontSize: '0.84rem',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            marginBottom: 20,
          }}>
            <CheckCircle2 size={16} style={{ flexShrink: 0 }} />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Login Form */}
        {!isRegister ? (
          <form onSubmit={handleLoginSubmit}>
            <div className="form-group" style={{ marginBottom: 16 }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <UserIcon size={14} color="#64748b" /> Username
              </label>
              <input
                type="text"
                required
                className="form-input"
                placeholder="Enter your username"
                value={loginData.username}
                onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                autoComplete="username"
              />
            </div>

            <div className="form-group" style={{ marginBottom: 20 }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Lock size={14} color="#64748b" /> Password
              </label>
              <input
                type="password"
                required
                className="form-input"
                placeholder="Enter your password"
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-sm)', fontSize: '0.92rem' }}
            >
              <LogIn size={17} />
              {loading ? 'Authenticating...' : 'Sign In to Portal'}
            </button>
          </form>
        ) : (
          /* Registration Form */
          <form onSubmit={handleRegisterSubmit}>
            <div className="form-group" style={{ marginBottom: 14 }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Briefcase size={14} color="#64748b" /> Account Role
              </label>
              <select
                className="form-select"
                value={registerData.role}
                onChange={(e) => setRegisterData({ ...registerData, role: e.target.value })}
              >
                <option value="STUDENT">Student</option>
                <option value="FACULTY">Faculty Member</option>
                <option value="ADMIN">System Administrator (Admin)</option>
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: 14 }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <UserIcon size={14} color="#64748b" /> Full Name
              </label>
              <input
                type="text"
                required
                className="form-input"
                placeholder="e.g. Purusothaman P"
                value={registerData.fullName}
                onChange={(e) => setRegisterData({ ...registerData, fullName: e.target.value })}
              />
            </div>

            <div className="form-group" style={{ marginBottom: 14 }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Mail size={14} color="#64748b" /> Email Address
              </label>
              <input
                type="email"
                required
                className="form-input"
                placeholder="name@campus.edu"
                value={registerData.email}
                onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
              <div className="form-group">
                <label className="form-label">Username</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="Username"
                  value={registerData.username}
                  onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
                  autoComplete="username"
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
                  autoComplete="new-password"
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 18 }}>
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
              style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-sm)', fontSize: '0.92rem' }}
            >
              <UserPlus size={17} />
              {loading ? 'Submitting Registration...' : 'Create Account'}
            </button>
            <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: 12 }}>
              {registerData.role === 'ADMIN'
                ? '✓ Admin accounts are approved immediately upon creation.'
                : '* Student and Faculty accounts can be approved in the Admin Console.'}
            </p>
          </form>
        )}
      </div>
    </div>
  );
};
