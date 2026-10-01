import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppLayout } from './components/AppLayout';
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
        background: 'var(--bg-main)',
      }}>
        <div style={{
          width: 48,
          height: 48,
          borderRadius: '50%',
          border: '3px solid rgba(99, 102, 241, 0.2)',
          borderTopColor: '#6366f1',
          animation: 'spin 0.8s linear infinite',
        }} />
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600 }}>
          Loading CSRM Enterprise System...
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

  const currentTab = user.role === 'ADMIN' 
    ? (activeTab === 'catalog' ? 'overview' : activeTab) 
    : (activeTab === 'overview' ? 'catalog' : activeTab);

  return (
    <AppLayout activeTab={currentTab} setActiveTab={setActiveTab}>
      {user.role === 'ADMIN' ? (
        <AdminDashboard
          activeTab={currentTab}
          setActiveTab={setActiveTab}
        />
      ) : (
        <UserDashboard
          activeTab={currentTab}
          setActiveTab={setActiveTab}
        />
      )}
    </AppLayout>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
