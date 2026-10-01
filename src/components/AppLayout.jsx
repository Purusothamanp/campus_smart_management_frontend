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
  BarChart3,
  Shield,
  GraduationCap,
  User as UserIcon,
  Sparkles,
  Search,
  Menu,
  X,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Activity,
  Laptop,
  Check,
  ChevronDown
} from 'lucide-react';
import { notificationAPI } from '../services/api';

export const AppLayout = ({ activeTab, setActiveTab, children }) => {
  const { user, logout, notifications, unreadCount, refreshNotifications } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

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

  const getRoleConfig = (role) => {
    switch (role) {
      case 'ADMIN':
        return {
          title: 'System Administrator',
          shortLabel: 'ADMIN',
          icon: <Shield size={16} />,
          badgeBg: 'linear-gradient(135deg, rgba(79, 70, 229, 0.15) 0%, rgba(124, 58, 237, 0.2) 100%)',
          badgeBorder: 'rgba(99, 102, 241, 0.35)',
          badgeColor: '#4f46e5',
          avatarGradient: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
        };
      case 'FACULTY':
        return {
          title: 'Faculty Member',
          shortLabel: 'FACULTY',
          icon: <GraduationCap size={16} />,
          badgeBg: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(5, 150, 105, 0.2) 100%)',
          badgeBorder: 'rgba(16, 185, 129, 0.35)',
          badgeColor: '#059669',
          avatarGradient: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
        };
      default:
        return {
          title: 'Student Scholar',
          shortLabel: 'STUDENT',
          icon: <UserIcon size={16} />,
          badgeBg: 'linear-gradient(135deg, rgba(2, 132, 199, 0.15) 0%, rgba(6, 182, 212, 0.2) 100%)',
          badgeBorder: 'rgba(2, 132, 199, 0.35)',
          badgeColor: '#0284c7',
          avatarGradient: 'linear-gradient(135deg, #0284c7 0%, #06b6d4 100%)',
        };
    }
  };

  const roleConfig = getRoleConfig(user?.role);

  // Nav items based on role
  const getNavSections = () => {
    if (user?.role === 'ADMIN') {
      return [
        {
          heading: 'ANALYTICS & CONTROL',
          items: [
            { id: 'overview', label: 'Command Center', icon: BarChart3, badge: 'Live' },
            { id: 'resources', label: 'Resource Fleet', icon: Layers },
            { id: 'reservations', label: 'Master Bookings', icon: Calendar },
          ]
        },
        {
          heading: 'DIRECTORY & SECURITY',
          items: [
            { id: 'users', label: 'User Directory', icon: Users },
            { id: 'audit', label: 'Audit Security Vault', icon: FileText },
          ]
        }
      ];
    }

    if (user?.role === 'FACULTY') {
      return [
        {
          heading: 'ACADEMIC BOOKING',
          items: [
            { id: 'catalog', label: 'Classrooms & Labs', icon: Layers, badge: 'Priority' },
            { id: 'my-bookings', label: 'My Reservations', icon: Calendar },
          ]
        }
      ];
    }

    // STUDENT
    return [
      {
        heading: 'STUDENT PORTAL',
        items: [
          { id: 'catalog', label: 'Resource Catalog', icon: Layers },
          { id: 'my-bookings', label: 'My Active Passes', icon: Calendar },
        ]
      }
    ];
  };

  const navSections = getNavSections();

  const getPageTitle = (tab) => {
    switch (tab) {
      case 'overview': return 'Command Center & Analytics';
      case 'resources': return 'Campus Resource Fleet';
      case 'reservations': return 'Master Reservations & Approvals';
      case 'users': return 'User Directory & Approvals';
      case 'audit': return 'Security Audit Trail';
      case 'catalog': return user?.role === 'FACULTY' ? 'Academic Spaces & Labs' : 'Campus Resources & Lockers';
      case 'my-bookings': return 'My Active Bookings & Passes';
      default: return 'Campus Smart Resource Portal';
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100%', background: 'var(--bg-main)' }}>
      {/* Mobile Backdrop */}
      {mobileSidebarOpen && (
        <div 
          onClick={() => setMobileSidebarOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.45)',
            backdropFilter: 'blur(4px)',
            zIndex: 998,
          }}
        />
      )}

      {/* Modern Professional Sidebar */}
      <aside className={`app-sidebar ${mobileSidebarOpen ? 'mobile-open' : ''}`} style={{
        width: 280,
        flexShrink: 0,
        background: '#ffffff',
        borderRight: '1px solid rgba(226, 232, 240, 0.85)',
        boxShadow: '4px 0 24px -4px rgba(15, 23, 42, 0.04)',
        display: 'flex',
        flexDirection: 'column',
        position: 'sticky',
        top: 0,
        height: '100vh',
        zIndex: 999,
      }}>
        {/* Brand Header */}
        <div style={{
          padding: '22px 20px',
          borderBottom: '1px solid rgba(241, 245, 249, 1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'linear-gradient(180deg, #ffffff 0%, #f8faff 100%)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 42,
              height: 42,
              borderRadius: 14,
              background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 60%, #06b6d4 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 6px 18px rgba(79, 70, 229, 0.3)',
              color: '#ffffff',
            }}>
              <Building2 size={22} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.15rem',
                  fontWeight: 800,
                  letterSpacing: '-0.02em',
                  background: 'linear-gradient(135deg, #0f172a 0%, #334155 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>
                  KIOT CSRM
                </span>
                <span style={{
                  fontSize: '0.65rem',
                  fontWeight: 800,
                  padding: '2px 6px',
                  borderRadius: 6,
                  background: '#f1f5f9',
                  color: '#475569',
                  border: '1px solid #e2e8f0',
                }}>
                  PRO
                </span>
              </div>
              <p style={{
                fontSize: '0.72rem',
                color: 'var(--text-muted)',
                margin: '2px 0 0',
                fontWeight: 500,
              }}>
                Smart Resource Management
              </p>
            </div>
          </div>

          {/* Mobile Close Button */}
          {window.innerWidth < 1024 && (
            <button
              onClick={() => setMobileSidebarOpen(false)}
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: '#64748b',
                padding: 4,
              }}
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* User Identity Card */}
        <div style={{ padding: '16px 18px', borderBottom: '1px solid rgba(241, 245, 249, 1)' }}>
          <div style={{
            background: 'linear-gradient(135deg, rgba(248, 250, 252, 0.8) 0%, rgba(241, 245, 249, 0.6) 100%)',
            border: '1px solid rgba(226, 232, 240, 0.8)',
            borderRadius: 14,
            padding: '12px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}>
            <div style={{
              width: 38,
              height: 38,
              borderRadius: 12,
              background: roleConfig.avatarGradient,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '0.9rem',
              boxShadow: '0 4px 12px rgba(15, 23, 42, 0.08)',
              flexShrink: 0,
            }}>
              {user?.fullName?.charAt(0) || user?.username?.charAt(0)?.toUpperCase()}
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{
                fontSize: '0.86rem',
                fontWeight: 700,
                color: 'var(--text-primary)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}>
                {user?.fullName || user?.username}
              </div>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                marginTop: 2,
                padding: '2px 7px',
                borderRadius: 9999,
                background: roleConfig.badgeBg,
                border: `1px solid ${roleConfig.badgeBorder}`,
                color: roleConfig.badgeColor,
                fontSize: '0.68rem',
                fontWeight: 700,
              }}>
                {roleConfig.icon}
                <span>{roleConfig.title}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Sections */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 14px' }}>
          {navSections.map((section, idx) => (
            <div key={idx} style={{ marginBottom: 22 }}>
              <div style={{
                fontSize: '0.67rem',
                fontWeight: 800,
                color: '#94a3b8',
                letterSpacing: '0.08em',
                padding: '0 12px 8px',
              }}>
                {section.heading}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isCurrent = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        if (window.innerWidth < 1024) setMobileSidebarOpen(false);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px 14px',
                        borderRadius: 10,
                        border: isCurrent ? '1px solid rgba(99, 102, 241, 0.25)' : '1px solid transparent',
                        background: isCurrent 
                          ? 'linear-gradient(135deg, rgba(79, 70, 229, 0.08) 0%, rgba(99, 102, 241, 0.04) 100%)' 
                          : 'transparent',
                        color: isCurrent ? '#4f46e5' : '#475569',
                        fontWeight: isCurrent ? 700 : 500,
                        fontSize: '0.88rem',
                        cursor: 'pointer',
                        transition: 'all 0.18s ease',
                        textAlign: 'left',
                        width: '100%',
                      }}
                      onMouseEnter={(e) => {
                        if (!isCurrent) {
                          e.currentTarget.style.background = '#f8faff';
                          e.currentTarget.style.color = '#1e293b';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isCurrent) {
                          e.currentTarget.style.background = 'transparent';
                          e.currentTarget.style.color = '#475569';
                        }
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                        <Icon size={18} color={isCurrent ? '#4f46e5' : '#64748b'} />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span style={{
                          fontSize: '0.65rem',
                          fontWeight: 700,
                          padding: '2px 6px',
                          borderRadius: 9999,
                          background: isCurrent ? '#4f46e5' : '#e0e7ff',
                          color: isCurrent ? '#ffffff' : '#4338ca',
                        }}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar Footer: System Status & Logout */}
        <div style={{
          padding: '16px 18px',
          borderTop: '1px solid rgba(241, 245, 249, 1)',
          background: 'linear-gradient(180deg, #f8faff 0%, #ffffff 100%)',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}>
          {/* Live System Indicator */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '8px 12px',
            borderRadius: 8,
            background: 'rgba(16, 185, 129, 0.08)',
            border: '1px solid rgba(16, 185, 129, 0.2)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <span style={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                background: '#10b981',
                boxShadow: '0 0 0 3px rgba(16, 185, 129, 0.2)',
                display: 'inline-block'
              }} />
              <span style={{ fontSize: '0.74rem', fontWeight: 600, color: '#065f46' }}>
                Cloud Services Online
              </span>
            </div>
            <span style={{ fontSize: '0.68rem', color: '#047857', fontWeight: 700 }}>
              Railway Live
            </span>
          </div>

          {/* Logout Button */}
          <button
            onClick={logout}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              padding: '9px 14px',
              borderRadius: 10,
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              color: '#ef4444',
              fontSize: '0.84rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.18s ease',
              width: '100%',
              boxShadow: '0 1px 3px rgba(15, 23, 42, 0.04)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#fef2f2';
              e.currentTarget.style.borderColor = '#fca5a5';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#ffffff';
              e.currentTarget.style.borderColor = '#e2e8f0';
            }}
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, width: '100%' }}>
        {/* Top Header Bar */}
        <header style={{
          height: 68,
          background: 'rgba(255, 255, 255, 0.88)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(226, 232, 240, 0.85)',
          padding: '0 28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 900,
        }}>
          {/* Left: Mobile Toggle & Page Context */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <button
              className="mobile-nav-toggle"
              onClick={() => setMobileSidebarOpen(true)}
              style={{
                background: 'transparent',
                border: '1px solid #e2e8f0',
                borderRadius: 8,
                padding: '6px 8px',
                cursor: 'pointer',
                color: '#475569',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Menu size={20} />
            </button>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <h1 style={{
                  fontSize: '1.25rem',
                  fontWeight: 800,
                  color: 'var(--text-primary)',
                  margin: 0,
                  letterSpacing: '-0.02em',
                }}>
                  {getPageTitle(activeTab)}
                </h1>
                <span style={{
                  fontSize: '0.72rem',
                  padding: '2px 8px',
                  borderRadius: 9999,
                  background: roleConfig.badgeBg,
                  color: roleConfig.badgeColor,
                  fontWeight: 700,
                  border: `1px solid ${roleConfig.badgeBorder}`,
                }}>
                  {roleConfig.shortLabel}
                </span>
              </div>
              <p style={{
                fontSize: '0.75rem',
                color: 'var(--text-muted)',
                margin: 0,
              }}>
                Department: {user?.department || 'General Campus'} • Academic Year 2026
              </p>
            </div>
          </div>

          {/* Right: Quick Search, Notification Bell & User */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            {/* Notifications Dropdown */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 11,
                  background: showNotifications ? '#f1f5f9' : '#ffffff',
                  border: '1px solid #e2e8f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  position: 'relative',
                  color: '#475569',
                  transition: 'all 0.18s ease',
                  boxShadow: '0 1px 3px rgba(15, 23, 42, 0.04)',
                }}
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: -3,
                    right: -3,
                    background: '#ef4444',
                    color: '#ffffff',
                    fontSize: '0.65rem',
                    fontWeight: 800,
                    width: 18,
                    height: 18,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px solid #ffffff',
                    boxShadow: '0 2px 6px rgba(239, 68, 68, 0.4)',
                  }}>
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Popover */}
              {showNotifications && (
                <div style={{
                  position: 'absolute',
                  top: 'calc(100% + 10px)',
                  right: 0,
                  width: 360,
                  background: '#ffffff',
                  borderRadius: 16,
                  border: '1px solid rgba(226, 232, 240, 0.9)',
                  boxShadow: '0 20px 45px -10px rgba(15, 23, 42, 0.16)',
                  padding: 16,
                  zIndex: 1000,
                  animation: 'fadeIn 0.15s ease',
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingBottom: 12,
                    borderBottom: '1px solid #f1f5f9',
                  }}>
                    <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f172a' }}>
                      Notifications ({unreadCount} new)
                    </span>
                    {unreadCount > 0 && (
                      <button
                        onClick={handleMarkAllRead}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#4f46e5',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div style={{ maxHeight: 300, overflowY: 'auto', padding: '8px 0' }}>
                    {notifications.length === 0 ? (
                      <div style={{ padding: '24px 0', textAlign: 'center', color: '#94a3b8', fontSize: '0.82rem' }}>
                        No new notifications
                      </div>
                    ) : (
                      notifications.slice(0, 5).map((n) => (
                        <div
                          key={n.id}
                          onClick={(e) => handleMarkAsRead(n.id, e)}
                          style={{
                            padding: '10px 12px',
                            borderRadius: 10,
                            background: n.isRead ? 'transparent' : 'rgba(99, 102, 241, 0.05)',
                            marginBottom: 6,
                            cursor: 'pointer',
                            display: 'flex',
                            gap: 10,
                            alignItems: 'flex-start',
                          }}
                        >
                          <div style={{ marginTop: 2 }}>
                            {n.type === 'CONFIRMATION' && <CheckCircle2 size={16} color="#059669" />}
                            {n.type === 'CANCELLATION' && <AlertCircle size={16} color="#e11d48" />}
                            {n.type !== 'CONFIRMATION' && n.type !== 'CANCELLATION' && <Info size={16} color="#4f46e5" />}
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#0f172a' }}>
                              {n.title}
                            </div>
                            <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: 2 }}>
                              {n.message}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Quick Info */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '6px 12px 6px 6px',
              borderRadius: 9999,
              background: '#f8faff',
              border: '1px solid #e2e8f0',
            }}>
              <div style={{
                width: 30,
                height: 30,
                borderRadius: '50%',
                background: roleConfig.avatarGradient,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                fontWeight: 800,
                fontSize: '0.78rem',
              }}>
                {user?.fullName?.charAt(0) || user?.username?.charAt(0)?.toUpperCase()}
              </div>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155' }}>
                {user?.username}
              </span>
            </div>
          </div>
        </header>

        {/* Dashboard Body */}
        <main style={{ flex: 1, padding: '24px 28px', maxWidth: 1400, width: '100%', boxSizing: 'border-box' }}>
          {children}
        </main>
      </div>
    </div>
  );
};
