import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Building2, 
  Bell, 
  LogOut, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Info,
  Calendar,
  Layers,
  FileText,
  Users,
  BarChart3
} from 'lucide-react';
import { notificationAPI } from '../services/api';

export const Navbar = ({ activeTab, setActiveTab }) => {
  const { user, logout, notifications, unreadCount, refreshNotifications } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);

  const handleMarkAsRead = async (id, e) => {
    e.stopPropagation();
    try {
      await notificationAPI.markAsRead(id);
      refreshNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationAPI.markAllAsRead();
      refreshNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'CONFIRMATION':
        return <CheckCircle2 size={15} color="#059669" />;
      case 'CANCELLATION':
        return <AlertCircle size={15} color="#e11d48" />;
      case 'REMINDER':
        return <Clock size={15} color="#d97706" />;
      default:
        return <Info size={15} color="#4f46e5" />;
    }
  };

  return (
    <header style={{
      width: '100%',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'rgba(255, 255, 255, 0.86)',
      backdropFilter: 'blur(24px) saturate(190%)',
      WebkitBackdropFilter: 'blur(24px) saturate(190%)',
      borderBottom: '1px solid rgba(226, 232, 240, 0.85)',
      boxShadow: '0 4px 20px -2px rgba(15, 23, 42, 0.04), inset 0 1px 0 rgba(255, 255, 255, 1)',
      boxSizing: 'border-box'
    }}>
      {/* Dynamic Iridescent Top Stripe */}
      <div style={{
        height: 2.5,
        width: '100%',
        background: 'linear-gradient(90deg, #4f46e5 0%, #06b6d4 35%, #8b5cf6 70%, #ec4899 100%)',
      }} />
      <div style={{
        maxWidth: 1260,
        margin: '0 auto',
        padding: '11px 18px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        flexWrap: 'wrap',
        boxSizing: 'border-box'
      }}>
        {/* Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 38,
            height: 38,
            borderRadius: 12,
            background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 50%, #0284c7 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(79, 70, 229, 0.35)',
            border: '1px solid rgba(255, 255, 255, 0.4)'
          }}>
            <Building2 size={20} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{
                fontFamily: 'var(--font-heading)',
                fontWeight: 900,
                fontSize: '1.2rem',
                letterSpacing: '-0.03em',
                color: '#1e1b4b'
              }}>
                CSRM
              </span>
              <span style={{
                fontSize: '0.62rem',
                fontWeight: 700,
                padding: '2px 7px',
                borderRadius: 9999,
                background: '#ede9fe',
                color: '#5b21b6',
                border: '1px solid #ddd6fe',
                letterSpacing: '0.04em'
              }}>
                PORTAL
              </span>
            </div>
            <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)', margin: 0, fontWeight: 500 }}>
              Campus Smart Resources
            </p>
          </div>
        </div>

        {/* Navigation Tabs - Modern Pill Bar Light */}
        <nav style={{
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          background: '#f1f5f9',
          padding: '4px 6px',
          borderRadius: 9999,
          border: '1px solid #e2e8f0',
          boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.04)'
        }}>
          {user?.role === 'ADMIN' ? (
            <>
              <button
                className={`btn btn-sm ${activeTab === 'overview' ? 'btn-primary' : 'btn-outline'}`}
                style={{
                  border: 'none',
                  borderRadius: 9999,
                  padding: '6px 12px',
                  background: activeTab === 'overview' ? 'var(--grad-primary)' : 'transparent',
                  color: activeTab === 'overview' ? '#fff' : 'var(--text-secondary)'
                }}
                onClick={() => setActiveTab('overview')}
              >
                <BarChart3 size={14} /> Dashboard
              </button>
              <button
                className={`btn btn-sm ${activeTab === 'users' ? 'btn-primary' : 'btn-outline'}`}
                style={{
                  border: 'none',
                  borderRadius: 9999,
                  padding: '6px 12px',
                  background: activeTab === 'users' ? 'var(--grad-primary)' : 'transparent',
                  color: activeTab === 'users' ? '#fff' : 'var(--text-secondary)'
                }}
                onClick={() => setActiveTab('users')}
              >
                <Users size={14} /> Approvals
              </button>
              <button
                className={`btn btn-sm ${activeTab === 'resources' ? 'btn-primary' : 'btn-outline'}`}
                style={{
                  border: 'none',
                  borderRadius: 9999,
                  padding: '6px 12px',
                  background: activeTab === 'resources' ? 'var(--grad-primary)' : 'transparent',
                  color: activeTab === 'resources' ? '#fff' : 'var(--text-secondary)'
                }}
                onClick={() => setActiveTab('resources')}
              >
                <Layers size={14} /> Resources
              </button>
              <button
                className={`btn btn-sm ${activeTab === 'bookings' ? 'btn-primary' : 'btn-outline'}`}
                style={{
                  border: 'none',
                  borderRadius: 9999,
                  padding: '6px 12px',
                  background: activeTab === 'bookings' ? 'var(--grad-primary)' : 'transparent',
                  color: activeTab === 'bookings' ? '#fff' : 'var(--text-secondary)'
                }}
                onClick={() => setActiveTab('bookings')}
              >
                <Calendar size={14} /> Bookings
              </button>
              <button
                className={`btn btn-sm ${activeTab === 'reports' ? 'btn-primary' : 'btn-outline'}`}
                style={{
                  border: 'none',
                  borderRadius: 9999,
                  padding: '6px 12px',
                  background: activeTab === 'reports' ? 'var(--grad-primary)' : 'transparent',
                  color: activeTab === 'reports' ? '#fff' : 'var(--text-secondary)'
                }}
                onClick={() => setActiveTab('reports')}
              >
                <BarChart3 size={14} /> Utilization
              </button>
              <button
                className={`btn btn-sm ${activeTab === 'audit' ? 'btn-primary' : 'btn-outline'}`}
                style={{
                  border: 'none',
                  borderRadius: 9999,
                  padding: '6px 12px',
                  background: activeTab === 'audit' ? 'var(--grad-primary)' : 'transparent',
                  color: activeTab === 'audit' ? '#fff' : 'var(--text-secondary)'
                }}
                onClick={() => setActiveTab('audit')}
              >
                <FileText size={14} /> Audit Logs
              </button>
            </>
          ) : (
            <>
              <button
                className={`btn btn-sm ${activeTab === 'catalog' ? 'btn-primary' : 'btn-outline'}`}
                style={{
                  border: 'none',
                  borderRadius: 9999,
                  padding: '6px 14px',
                  background: activeTab === 'catalog' ? 'var(--grad-primary)' : 'transparent',
                  color: activeTab === 'catalog' ? '#fff' : 'var(--text-secondary)'
                }}
                onClick={() => setActiveTab('catalog')}
              >
                <Layers size={14} /> Browse Resources
              </button>
              <button
                className={`btn btn-sm ${activeTab === 'my-bookings' ? 'btn-primary' : 'btn-outline'}`}
                style={{
                  border: 'none',
                  borderRadius: 9999,
                  padding: '6px 14px',
                  background: activeTab === 'my-bookings' ? 'var(--grad-primary)' : 'transparent',
                  color: activeTab === 'my-bookings' ? '#fff' : 'var(--text-secondary)'
                }}
                onClick={() => setActiveTab('my-bookings')}
              >
                <Calendar size={14} /> My Reservations
              </button>
            </>
          )}
        </nav>

        {/* User Card & Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* Notification Button */}
          <div style={{ position: 'relative' }}>
            <button
              className="btn btn-secondary btn-sm"
              style={{
                width: 36,
                height: 36,
                padding: 0,
                borderRadius: '50%',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#ffffff',
                border: '1px solid #e2e8f0'
              }}
              onClick={() => {
                setShowNotifications(!showNotifications);
                refreshNotifications();
              }}
              title="Notifications"
            >
              <Bell size={16} color="var(--text-secondary)" />
              {unreadCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: -2,
                  right: -2,
                  width: 16,
                  height: 16,
                  borderRadius: '50%',
                  background: 'var(--accent-rose)',
                  color: '#fff',
                  fontSize: '0.62rem',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 8px rgba(225, 29, 72, 0.4)'
                }}>
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Menu Light */}
            {showNotifications && (
              <div
                className="glass-panel"
                style={{
                  position: 'absolute',
                  top: '125%',
                  right: 0,
                  width: 330,
                  maxWidth: '90vw',
                  maxHeight: 400,
                  overflowY: 'auto',
                  background: '#ffffff',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: '0 20px 45px -10px rgba(15, 23, 42, 0.18), 0 0 0 1px #e2e8f0',
                  padding: 14,
                  zIndex: 200,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, borderBottom: '1px solid #f1f5f9', paddingBottom: 6 }}>
                  <span style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-primary)' }}>Notifications ({notifications.length})</span>
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllRead}
                      style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', fontSize: '0.74rem', cursor: 'pointer', fontWeight: 600 }}
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                {notifications.length === 0 ? (
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textAlign: 'center', padding: '14px 0' }}>
                    No alerts at this moment.
                  </p>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={(e) => !n.isRead && handleMarkAsRead(n.id, e)}
                      style={{
                        padding: '9px 11px',
                        borderRadius: 8,
                        marginBottom: 6,
                        background: n.isRead ? '#f8fafc' : '#eef2ff',
                        borderLeft: `3px solid ${n.type === 'CONFIRMATION' ? '#059669' : n.type === 'CANCELLATION' ? '#e11d48' : '#4f46e5'}`,
                        cursor: 'pointer',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                        {getNotificationIcon(n.type)}
                        <span style={{ fontWeight: 600, fontSize: '0.8rem', color: 'var(--text-primary)' }}>
                          {n.title}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', margin: '2px 0 0 20px' }}>
                        {n.message}
                      </p>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* User Profile Badge Light */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '4px 12px 4px 6px',
            borderRadius: 9999,
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)'
          }}>
            <div style={{
              width: 28,
              height: 28,
              borderRadius: '50%',
              background: user?.role === 'ADMIN' ? 'linear-gradient(135deg, #7c3aed, #4f46e5)' : user?.role === 'FACULTY' ? 'linear-gradient(135deg, #0284c7, #2563eb)' : 'linear-gradient(135deg, #059669, #0284c7)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '0.78rem'
            }}>
              {user?.fullName?.charAt(0) || 'U'}
            </div>
            <div style={{ textAlign: 'left', lineHeight: 1.15 }}>
              <div style={{ fontWeight: 700, fontSize: '0.8rem', color: 'var(--text-primary)' }}>
                {user?.fullName}
              </div>
              <div style={{ fontSize: '0.66rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                {user?.role}
              </div>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={logout}
            className="btn btn-secondary btn-sm"
            style={{ width: 36, height: 36, padding: 0, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            title="Sign out"
          >
            <LogOut size={15} color="var(--text-secondary)" />
          </button>
        </div>
      </div>
    </header>
  );
};
