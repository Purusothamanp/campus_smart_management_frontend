import React, { useState, useEffect } from 'react';
import { adminAPI, resourceAPI, bookingAPI, auditAPI } from '../services/api';
import {
  Users,
  Layers,
  Calendar,
  BarChart3,
  FileText,
  CheckCircle2,
  XCircle,
  Plus,
  Edit,
  Trash2,
  Clock,
  Search,
  Filter,
  Activity,
  DollarSign,
  TrendingUp,
  AlertCircle,
  Sparkles,
  ShieldAlert,
  SlidersHorizontal
} from 'lucide-react';

export const AdminDashboard = ({ activeTab, setActiveTab }) => {
  // Stats
  const [analytics, setAnalytics] = useState(null);

  // Users state
  const [users, setUsers] = useState([]);
  const [pendingUsers, setPendingUsers] = useState([]);

  // Resources state
  const [resources, setResources] = useState([]);
  const [resourceModalOpen, setResourceModalOpen] = useState(false);
  const [editingResource, setEditingResource] = useState(null);
  const [resourceForm, setResourceForm] = useState({
    name: '',
    type: 'CLASSROOM',
    location: '',
    capacity: 30,
    availability: true,
    description: '',
    hourlyRate: 0.0,
  });

  // Reservations state
  const [allBookings, setAllBookings] = useState([]);

  // Utilization state
  const [utilizationData, setUtilizationData] = useState([]);

  // Audit logs state
  const [auditLogs, setAuditLogs] = useState([]);
  const [auditSearch, setAuditSearch] = useState('');

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ error: '', success: '' });

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [anRes, uRes, pRes, rRes, bRes, utRes, aRes] = await Promise.all([
        adminAPI.getAnalytics(),
        adminAPI.getUsers(),
        adminAPI.getPendingUsers(),
        resourceAPI.getAll(),
        bookingAPI.getBookings(),
        adminAPI.getUtilizationReport(),
        auditAPI.getLogs(),
      ]);

      if (anRes.success) setAnalytics(anRes.data);
      if (uRes.success) setUsers(uRes.data);
      if (pRes.success) setPendingUsers(pRes.data);
      if (rRes.success) setResources(rRes.data);
      if (bRes.success) setAllBookings(bRes.data);
      if (utRes.success) setUtilizationData(utRes.data);
      if (aRes.success) setAuditLogs(aRes.data);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  // User Actions
  const handleApproveUser = async (id) => {
    try {
      const res = await adminAPI.approveUser(id);
      setMsg({ success: res.message || 'User approved successfully!', error: '' });
      loadAllData();
    } catch (err) {
      setMsg({ error: err.message, success: '' });
    }
  };

  const handleRejectUser = async (id) => {
    try {
      const res = await adminAPI.rejectUser(id);
      setMsg({ success: res.message || 'User rejected', error: '' });
      loadAllData();
    } catch (err) {
      setMsg({ error: err.message, success: '' });
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await adminAPI.updateRole(userId, newRole);
      setMsg({ success: 'Role updated successfully', error: '' });
      loadAllData();
    } catch (err) {
      setMsg({ error: err.message, success: '' });
    }
  };

  // Resource Actions
  const openCreateResource = () => {
    setEditingResource(null);
    setResourceForm({
      name: '',
      type: 'CLASSROOM',
      location: '',
      capacity: 30,
      availability: true,
      description: '',
      hourlyRate: 0.0,
    });
    setResourceModalOpen(true);
  };

  const openEditResource = (r) => {
    setEditingResource(r);
    setResourceForm({
      name: r.name,
      type: r.type,
      location: r.location,
      capacity: r.capacity,
      availability: r.availability,
      description: r.description || '',
      hourlyRate: r.hourlyRate || 0.0,
    });
    setResourceModalOpen(true);
  };

  const handleResourceSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingResource) {
        await adminAPI.updateResource(editingResource.id, resourceForm);
        setMsg({ success: 'Resource updated successfully!', error: '' });
      } else {
        await adminAPI.createResource(resourceForm);
        setMsg({ success: 'Resource created successfully!', error: '' });
      }
      setResourceModalOpen(false);
      loadAllData();
    } catch (err) {
      setMsg({ error: err.message, success: '' });
    }
  };

  const handleDeleteResource = async (id) => {
    if (!window.confirm('Are you sure you want to remove this resource?')) return;
    try {
      await adminAPI.deleteResource(id);
      setMsg({ success: 'Resource deleted', error: '' });
      loadAllData();
    } catch (err) {
      setMsg({ error: err.message, success: '' });
    }
  };

  // Booking Actions
  const handleCancelBooking = async (id) => {
    if (!window.confirm('Cancel this campus reservation?')) return;
    try {
      await bookingAPI.cancel(id);
      setMsg({ success: 'Booking cancelled by Admin', error: '' });
      loadAllData();
    } catch (err) {
      setMsg({ error: err.message, success: '' });
    }
  };

  // Filtered audit logs
  const filteredAuditLogs = auditLogs.filter(
    (l) =>
      l.action.toLowerCase().includes(auditSearch.toLowerCase()) ||
      (l.user?.username && l.user.username.toLowerCase().includes(auditSearch.toLowerCase())) ||
      (l.details && l.details.toLowerCase().includes(auditSearch.toLowerCase()))
  );

  return (
    <div style={{ maxWidth: 1260, width: '100%', margin: '0 auto', padding: '22px 18px', boxSizing: 'border-box' }}>
      {/* Alert Banners */}
      {msg.success && (
        <div style={{
          padding: '10px 16px',
          borderRadius: 'var(--radius-sm)',
          background: '#d1fae5',
          border: '1px solid #a7f3d0',
          color: '#065f46',
          marginBottom: 18,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.84rem'
        }}>
          <span>{msg.success}</span>
          <button style={{ background: 'none', border: 'none', color: '#065f46', cursor: 'pointer' }} onClick={() => setMsg({ ...msg, success: '' })}>✕</button>
        </div>
      )}
      {msg.error && (
        <div style={{
          padding: '10px 16px',
          borderRadius: 'var(--radius-sm)',
          background: '#ffe4e6',
          border: '1px solid #fecdd3',
          color: '#9f1239',
          marginBottom: 18,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.84rem'
        }}>
          <span>{msg.error}</span>
          <button style={{ background: 'none', border: 'none', color: '#9f1239', cursor: 'pointer' }} onClick={() => setMsg({ ...msg, error: '' })}>✕</button>
        </div>
      )}

      {/* KPI Stat Widgets Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 14,
        marginBottom: 24,
      }}>
        <div className="glass-panel stat-card" style={{ borderLeft: '3.5px solid #4f46e5' }}>
          <div className="stat-icon" style={{ background: 'rgba(79, 70, 229, 0.1)', color: '#4f46e5', boxShadow: '0 4px 12px rgba(79, 70, 229, 0.15)' }}>
            <Layers size={22} />
          </div>
          <div>
            <div className="stat-value" style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #4338ca 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              {analytics?.totalResources || resources.length}
            </div>
            <div className="stat-label">Total Resources</div>
          </div>
        </div>

        <div className="glass-panel stat-card" style={{ borderLeft: '3.5px solid #10b981' }}>
          <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#059669', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.15)' }}>
            <Calendar size={22} />
          </div>
          <div>
            <div className="stat-value" style={{ background: 'linear-gradient(135deg, #064e3b 0%, #059669 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              {analytics?.activeBookings || 0}
            </div>
            <div className="stat-label">Active Bookings</div>
          </div>
        </div>

        <div className="glass-panel stat-card" style={{ borderLeft: '3.5px solid #f59e0b' }}>
          <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.12)', color: '#d97706', boxShadow: '0 4px 12px rgba(245, 158, 11, 0.15)' }}>
            <AlertCircle size={22} />
          </div>
          <div>
            <div className="stat-value" style={{ background: 'linear-gradient(135deg, #78350f 0%, #d97706 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              {pendingUsers.length}
            </div>
            <div className="stat-label">Pending Approvals</div>
          </div>
        </div>

        <div className="glass-panel stat-card" style={{ borderLeft: '3.5px solid #06b6d4' }}>
          <div className="stat-icon" style={{ background: 'rgba(6, 182, 212, 0.12)', color: '#0284c7', boxShadow: '0 4px 12px rgba(6, 182, 212, 0.15)' }}>
            <Users size={22} />
          </div>
          <div>
            <div className="stat-value" style={{ background: 'linear-gradient(135deg, #083344 0%, #0284c7 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              {users.length}
            </div>
            <div className="stat-label">Registered Accounts</div>
          </div>
        </div>
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 18 }}>
          {/* Pending Approvals Widget */}
          <div className="glass-panel" style={{ padding: 22 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h2 style={{ fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Users size={18} color="#f59e0b" /> Pending Account Approvals ({pendingUsers.length})
              </h2>
              <button className="btn btn-secondary btn-sm" onClick={() => setActiveTab('users')}>
                View All
              </button>
            </div>

            {pendingUsers.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'center', padding: '28px 0' }}>
                All user accounts are approved. No pending review requests.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {pendingUsers.map((u) => (
                  <div
                    key={u.id}
                    style={{
                      padding: '12px 14px',
                      borderRadius: 'var(--radius-sm)',
                      background: '#f8fafc',
                      border: '1px solid var(--border-subtle)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{u.fullName}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        @{u.username} • {u.email} • <span className="badge badge-primary">{u.role}</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button
                        className="btn btn-success btn-sm"
                        onClick={() => handleApproveUser(u.id)}
                      >
                        <CheckCircle2 size={13} /> Approve
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleRejectUser(u.id)}
                      >
                        <XCircle size={13} /> Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Activity Log Widget */}
          <div className="glass-panel" style={{ padding: 22 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h2 style={{ fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Activity size={18} color="#4f46e5" /> System Activity Stream
              </h2>
              <button className="btn btn-secondary btn-sm" onClick={() => setActiveTab('audit')}>
                Full History
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {auditLogs.slice(0, 5).map((log) => (
                <div
                  key={log.id}
                  style={{
                    padding: '9px 12px',
                    borderRadius: 'var(--radius-xs)',
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderLeft: '3px solid var(--accent-primary)',
                    fontSize: '0.8rem',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                    <span style={{ fontWeight: 700, color: 'var(--accent-primary)' }}>{log.action}</span>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p style={{ color: 'var(--text-secondary)', margin: 0 }}>{log.details}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: User Directory & Approvals */}
      {activeTab === 'users' && (
        <div className="glass-panel" style={{ padding: 22 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
            <div>
              <h2 style={{ fontSize: '1.3rem' }}>User Directory & Approvals</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                Review student and faculty account registrations, manage roles, and control access permissions.
              </p>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={loadAllData}>
              Refresh
            </button>
          </div>

          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Contact Email</th>
                  <th>Department</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>
                      <div style={{ fontWeight: 700 }}>{u.fullName}</div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>@{u.username}</div>
                    </td>
                    <td>{u.email}</td>
                    <td>{u.department || 'General'}</td>
                    <td>
                      <select
                        className="form-select"
                        style={{ padding: '4px 8px', fontSize: '0.78rem', width: 110 }}
                        value={u.role}
                        disabled={u.username === 'admin'}
                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                      >
                        <option value="STUDENT">STUDENT</option>
                        <option value="FACULTY">FACULTY</option>
                        <option value="ADMIN">ADMIN</option>
                      </select>
                    </td>
                    <td>
                      {u.status === 'APPROVED' ? (
                        <span className="badge badge-success">Approved</span>
                      ) : u.status === 'PENDING' ? (
                        <span className="badge badge-warning">Pending</span>
                      ) : (
                        <span className="badge badge-danger">Rejected</span>
                      )}
                    </td>
                    <td style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td>
                      {u.status === 'PENDING' && (
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button
                            className="btn btn-success btn-sm"
                            onClick={() => handleApproveUser(u.id)}
                          >
                            <CheckCircle2 size={12} /> Approve
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleRejectUser(u.id)}
                          >
                            <XCircle size={12} /> Reject
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Resource Management */}
      {activeTab === 'resources' && (
        <div className="glass-panel" style={{ padding: 22 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
            <div>
              <h2 style={{ fontSize: '1.3rem' }}>Resource & Pricing Management</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                Add, modify, or remove classrooms, laboratories, lockers, and lab equipment.
              </p>
            </div>
            <button className="btn btn-primary btn-sm" onClick={openCreateResource}>
              <Plus size={15} /> Add New Resource
            </button>
          </div>

          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Resource Name</th>
                  <th>Type</th>
                  <th>Location</th>
                  <th>Capacity</th>
                  <th>Hourly Rate</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {resources.map((r) => (
                  <tr key={r.id}>
                    <td>
                      <div style={{ fontWeight: 700 }}>{r.name}</div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{r.description}</div>
                    </td>
                    <td>
                      <span className="badge badge-primary">{r.type}</span>
                    </td>
                    <td>{r.location}</td>
                    <td>{r.capacity}</td>
                    <td style={{ fontWeight: 700, color: '#38bdf8' }}>
                      {r.hourlyRate > 0 ? `₹${r.hourlyRate}/hr` : 'Free'}
                    </td>
                    <td>
                      {r.availability ? (
                        <span className="badge badge-success">Available</span>
                      ) : (
                        <span className="badge badge-danger">Maintenance</span>
                      )}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => openEditResource(r)}
                        >
                          <Edit size={13} /> Edit
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDeleteResource(r.id)}
                        >
                          <Trash2 size={13} /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Reservation Overview */}
      {activeTab === 'bookings' && (
        <div className="glass-panel" style={{ padding: 22 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
            <div>
              <h2 style={{ fontSize: '1.3rem' }}>Campus Reservation Overview</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                Live monitor of all active campus bookings with conflict resolution controls.
              </p>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={loadAllData}>
              Refresh
            </button>
          </div>

          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Resource</th>
                  <th>Booked By</th>
                  <th>Time Slot</th>
                  <th>Purpose</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {allBookings.map((b) => (
                  <tr key={b.id}>
                    <td style={{ fontWeight: 800, color: 'var(--accent-primary)' }}>#{b.id}</td>
                    <td style={{ fontWeight: 700 }}>{b.resource?.name}</td>
                    <td>
                      <div>{b.user?.fullName}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{b.user?.role}</div>
                    </td>
                    <td>
                      <div>{new Date(b.startTime).toLocaleDateString()}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        {new Date(b.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(b.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>
                    <td>{b.purpose || 'Campus Resource Reservation'}</td>
                    <td>
                      {b.status === 'CONFIRMED' ? (
                        <span className="badge badge-success">Confirmed</span>
                      ) : b.status === 'CANCELLED' ? (
                        <span className="badge badge-danger">Cancelled</span>
                      ) : (
                        <span className="badge badge-warning">{b.status}</span>
                      )}
                    </td>
                    <td>
                      {b.status === 'CONFIRMED' && (
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleCancelBooking(b.id)}
                        >
                          <Trash2 size={12} /> Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 5: Utilization Reports & Analytics */}
      {activeTab === 'reports' && (
        <div className="glass-panel" style={{ padding: 22 }}>
          <div style={{ marginBottom: 18 }}>
            <h2 style={{ fontSize: '1.3rem' }}>Daily Resource Utilization Report</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>
              Aggregated utilization hours, reservation counts, and resource efficiency insights.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16, marginBottom: 20 }}>
            {utilizationData.map((item, idx) => (
              <div
                key={idx}
                style={{
                  background: '#f8fafc',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  padding: 16,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <span className="badge badge-primary">{item.resourceType}</span>
                  <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>
                    {item.totalHours} hrs booked
                  </span>
                </div>
                <h4 style={{ fontSize: '1.05rem', marginBottom: 4 }}>{item.resourceName}</h4>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 8 }}>
                  <span>Total Reservations: {item.totalBookings}</span>
                </div>
                {/* Modern Progress Bar */}
                <div style={{ width: '100%', height: 6, background: '#e2e8f0', borderRadius: 9999, overflow: 'hidden' }}>
                  <div style={{
                    width: `${Math.min(100, (item.totalHours / 15) * 100)}%`,
                    height: '100%',
                    background: 'var(--grad-primary)',
                    borderRadius: 9999,
                  }} />
                </div>
              </div>
            ))}
          </div>

          {utilizationData.length === 0 && (
            <p style={{ textAlign: 'center', padding: 26, color: 'var(--text-muted)' }}>
              No utilization records accumulated for the period yet.
            </p>
          )}
        </div>
      )}

      {/* Tab 6: Audit Logs */}
      {activeTab === 'audit' && (
        <div className="glass-panel" style={{ padding: 22 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18, flexWrap: 'wrap', gap: 12 }}>
            <div>
              <h2 style={{ fontSize: '1.3rem' }}>Audit Trail & Activity Logs</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                Immutable event trail tracking user registrations, approvals, and resource bookings.
              </p>
            </div>
            <div style={{ position: 'relative', width: 260 }}>
              <Search size={15} color="var(--text-muted)" style={{ position: 'absolute', left: 12, top: 12 }} />
              <input
                type="text"
                className="form-input"
                style={{ paddingLeft: 34, height: 38 }}
                placeholder="Search audit trail..."
                value={auditSearch}
                onChange={(e) => setAuditSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Actor</th>
                  <th>Action</th>
                  <th>Activity Description</th>
                </tr>
              </thead>
              <tbody>
                {filteredAuditLogs.map((log) => (
                  <tr key={log.id}>
                    <td style={{ fontSize: '0.78rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td>
                      <div style={{ fontWeight: 700 }}>{log.user?.fullName || 'System Event'}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>@{log.user?.username || 'system'}</div>
                    </td>
                    <td>
                      <span className="badge badge-primary">{log.action}</span>
                    </td>
                    <td style={{ fontSize: '0.84rem' }}>{log.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Resource Modal */}
      {resourceModalOpen && (
        <div className="modal-overlay" onClick={() => setResourceModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <h2 style={{ fontSize: '1.25rem' }}>
                {editingResource ? 'Edit Resource' : 'Add New Resource'}
              </h2>
              <button className="btn btn-secondary btn-sm" onClick={() => setResourceModalOpen(false)}>
                ✕
              </button>
            </div>

            <form onSubmit={handleResourceSubmit}>
              <div className="form-group">
                <label className="form-label">Resource Name</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="e.g. Smart Seminar Hall B2"
                  value={resourceForm.name}
                  onChange={(e) => setResourceForm({ ...resourceForm, name: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-group">
                  <label className="form-label">Type</label>
                  <select
                    className="form-select"
                    value={resourceForm.type}
                    onChange={(e) => setResourceForm({ ...resourceForm, type: e.target.value })}
                  >
                    <option value="CLASSROOM">Classroom</option>
                    <option value="LAB">Laboratory</option>
                    <option value="LOCKER">Locker</option>
                    <option value="EQUIPMENT">Equipment</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Capacity</label>
                  <input
                    type="number"
                    min={1}
                    className="form-input"
                    value={resourceForm.capacity}
                    onChange={(e) => setResourceForm({ ...resourceForm, capacity: parseInt(e.target.value) || 1 })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Location</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="e.g. Academic Block - 3rd Floor"
                  value={resourceForm.location}
                  onChange={(e) => setResourceForm({ ...resourceForm, location: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-group">
                  <label className="form-label">Hourly Rate (₹)</label>
                  <input
                    type="number"
                    step="0.1"
                    min={0}
                    className="form-input"
                    value={resourceForm.hourlyRate}
                    onChange={(e) => setResourceForm({ ...resourceForm, hourlyRate: parseFloat(e.target.value) || 0 })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Availability</label>
                  <select
                    className="form-select"
                    value={resourceForm.availability ? 'true' : 'false'}
                    onChange={(e) => setResourceForm({ ...resourceForm, availability: e.target.value === 'true' })}
                  >
                    <option value="true">Active / Available</option>
                    <option value="false">Under Maintenance</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Description & Specs</label>
                <textarea
                  rows={3}
                  className="form-textarea"
                  placeholder="Enter equipment details, setup instructions..."
                  value={resourceForm.description}
                  onChange={(e) => setResourceForm({ ...resourceForm, description: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 18 }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setResourceModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingResource ? 'Update Resource' : 'Save Resource'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
