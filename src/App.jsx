import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Auth } from './components/Auth';
import { AdminDashboard } from './components/AdminDashboard';
import { UserDashboard } from './components/UserDashboard';

const MainApp = () => {
  const { user, token, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: 16,
      }}>
        <div style={{
          width: 48,
          height: 48,
          borderRadius: '50%',
          border: '3px solid rgba(99, 102, 241, 0.2)',
          borderTopColor: '#6366f1',
          animation: 'spin 0.8s linear infinite',
        }} />
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Loading CSRM System...
        </p>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!token || !user) {
    return <Auth />;
  }

  return (
    <div style={{ minHeight: '100vh', width: '100%', maxWidth: '100vw', overflowX: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <Navbar
        activeTab={user.role === 'ADMIN' ? (activeTab === 'catalog' ? 'overview' : activeTab) : (activeTab === 'overview' ? 'catalog' : activeTab)}
        setActiveTab={setActiveTab}
      />
      <main style={{ flex: 1 }}>
        {user.role === 'ADMIN' ? (
          <AdminDashboard
            activeTab={activeTab === 'catalog' ? 'overview' : activeTab}
            setActiveTab={setActiveTab}
          />
        ) : (
          <UserDashboard
            activeTab={activeTab === 'overview' ? 'catalog' : activeTab}
            setActiveTab={setActiveTab}
          />
        )}
      </main>
      <footer style={{
        borderTop: '1px solid var(--border-color)',
        padding: '20px 24px',
        textAlign: 'center',
        color: 'var(--text-dim)',
        fontSize: '0.8rem',
      }}>
        Campus Smart Resource Management System (CSRM) • Fullstack Assessment 01
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
