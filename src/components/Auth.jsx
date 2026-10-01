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
  Briefcase,
  Sparkles,
  ShieldCheck
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
        setSuccessMsg(res.message || 'Registration submitted! Please sign in.');
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
      padding: '28px 20px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Dynamic Aurora Ambient Lights */}
      <div className="ambient-glow-orb" style={{
        top: '12%',
        left: '20%',
        width: 380,
        height: 380,
        background: 'radial-gradient(circle, rgba(99, 102, 241, 0.28) 0%, rgba(99, 102, 241, 0) 70%)',
      }} />
      <div className="ambient-glow-orb" style={{
        bottom: '15%',
        right: '18%',
        width: 420,
        height: 420,
        background: 'radial-gradient(circle, rgba(6, 182, 212, 0.24) 0%, rgba(6, 182, 212, 0) 70%)',
        animationDelay: '-4s',
      }} />
      <div className="ambient-glow-orb" style={{
        top: '25%',
        right: '25%',
        width: 280,
        height: 280,
        background: 'radial-gradient(circle, rgba(236, 72, 153, 0.16) 0%, rgba(236, 72, 153, 0) 70%)',
        animationDelay: '-2s',
      }} />

      {/* Main Glassmorphism Card */}
      <div className="glass-panel" style={{
        width: '100%',
        maxWidth: 450,
        padding: '38px 34px',
        borderRadius: 'var(--radius-xl)',
        boxShadow: 'var(--shadow-floating)',
        background: 'rgba(255, 255, 255, 0.88)',
        backdropFilter: 'blur(28px) saturate(190%)',
        WebkitBackdropFilter: 'blur(28px) saturate(190%)',
        border: '1px solid rgba(255, 255, 255, 0.95)',
        position: 'relative',
        zIndex: 10,
      }}>
        {/* Subtle Top Accent Ribbon */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 32,
          right: 32,
          height: 3,
          background: 'var(--grad-primary)',
          borderRadius: '0 0 4px 4px',
          opacity: 0.9,
        }} />

        {/* Branding Header */}
        <div style={{ textAlign: 'center', marginBottom: 28, marginTop: 4 }}>
          {/* Badge Tag */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '4px 12px',
            borderRadius: 9999,
            background: 'rgba(99, 102, 241, 0.08)',
            border: '1px solid rgba(99, 102, 241, 0.2)',
            color: '#4338ca',
            fontSize: '0.74rem',
            fontWeight: 700,
            letterSpacing: '0.04em',
            marginBottom: 16,
            textTransform: 'uppercase'
          }}>
            <Sparkles size={13} color="#6366f1" /> Next-Gen Campus Platform
          </div>

          <div style={{
            width: 58,
            height: 58,
            borderRadius: 18,
            background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 50%, #06b6d4 100%)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 24px rgba(79, 70, 229, 0.38)',
            marginBottom: 14,
            border: '1.5px solid rgba(255, 255, 255, 0.6)'
          }}>
            <Building2 size={30} color="#ffffff" />
          </div>
          <h2 style={{
            fontSize: '1.68rem',
            marginBottom: 6,
            letterSpacing: '-0.035em',
            color: '#090e1a',
            fontWeight: 800,
          }}>
            Campus Resource Portal
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', margin: 0 }}>
            Conflict-free allocation & intelligent scheduling
          </p>
        </div>

        {/* Tab Toggle Pill Switcher */}
        <div style={{
          display: 'flex',
          background: 'rgba(241, 245, 249, 0.85)',
          borderRadius: 9999,
          padding: 4,
          marginBottom: 24,
          border: '1px solid #e2e8f0',
          boxShadow: 'inset 0 1px 2px rgba(15, 23, 42, 0.05)',
        }}>
          <button
            type="button"
            style={{
              flex: 1,
              padding: '9px 12px',
              border: 'none',
              borderRadius: 9999,
              background: !isRegister ? 'var(--grad-primary)' : 'transparent',
              color: !isRegister ? '#ffffff' : 'var(--text-secondary)',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              transition: 'all 0.24s cubic-bezier(0.16, 1, 0.3, 1)',
              boxShadow: !isRegister ? '0 3px 12px rgba(79, 70, 229, 0.35)' : 'none',
            }}
            onClick={() => { setIsRegister(false); setError(''); setSuccessMsg(''); }}
          >
            Sign In
          </button>
          <button
            type="button"
            style={{
              flex: 1,
              padding: '9px 12px',
              border: 'none',
              borderRadius: 9999,
              background: isRegister ? 'var(--grad-primary)' : 'transparent',
              color: isRegister ? '#ffffff' : 'var(--text-secondary)',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              transition: 'all 0.24s cubic-bezier(0.16, 1, 0.3, 1)',
              boxShadow: isRegister ? '0 3px 12px rgba(79, 70, 229, 0.35)' : 'none',
            }}
            onClick={() => { setIsRegister(true); setError(''); setSuccessMsg(''); }}
          >
            Create Account
          </button>
        </div>

        {/* Feedback Messages */}
        {error && (
          <div style={{
            padding: '12px 16px',
            borderRadius: 'var(--radius-sm)',
            background: 'linear-gradient(135deg, #fff1f2 0%, #ffe4e6 100%)',
            border: '1px solid #fecdd3',
            color: '#be123c',
            fontSize: '0.84rem',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            marginBottom: 20,
            boxShadow: '0 2px 8px rgba(225, 29, 72, 0.08)'
          }}>
            <AlertCircle size={17} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div style={{
            padding: '12px 16px',
            borderRadius: 'var(--radius-sm)',
            background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
            border: '1px solid #bbf7d0',
            color: '#15803d',
            fontSize: '0.84rem',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            marginBottom: 20,
            boxShadow: '0 2px 8px rgba(22, 163, 74, 0.08)'
          }}>
            <CheckCircle2 size={17} style={{ flexShrink: 0 }} />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Login Form */}
        {!isRegister ? (
          <form onSubmit={handleLoginSubmit}>
            <div className="form-group" style={{ marginBottom: 16 }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <UserIcon size={14} color="#6366f1" /> Username
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

            <div className="form-group" style={{ marginBottom: 22 }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Lock size={14} color="#6366f1" /> Password
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
              style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-sm)', fontSize: '0.94rem', fontWeight: 700 }}
            >
              <LogIn size={18} />
              {loading ? 'Authenticating...' : 'Sign In to Portal'}
            </button>
          </form>
        ) : (
          /* Registration Form */
          <form onSubmit={handleRegisterSubmit}>
            <div className="form-group" style={{ marginBottom: 14 }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Briefcase size={14} color="#6366f1" /> Account Role
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
                <UserIcon size={14} color="#6366f1" /> Full Name
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
                <Mail size={14} color="#6366f1" /> Email Address
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
              style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-sm)', fontSize: '0.94rem', fontWeight: 700 }}
            >
              <UserPlus size={18} />
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
