import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { resourceAPI, bookingAPI } from '../services/api';
import {
  Layers,
  Calendar,
  Clock,
  MapPin,
  Users,
  Search,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Edit,
  Trash2,
  Wrench,
  DollarSign,
  ChevronRight,
  ShieldCheck,
  Sparkles,
  BookOpen
} from 'lucide-react';

export const UserDashboard = ({ activeTab, setActiveTab }) => {
  const { user, refreshNotifications } = useAuth();

  // Resource list state
  const [resources, setResources] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  // My bookings state
  const [myBookings, setMyBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);

  // Booking Modal state
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editBookingId, setEditBookingId] = useState(null);

  // Form fields for booking
  const [bookingForm, setBookingForm] = useState({
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0], // tomorrow
    startTime: '10:00',
    endTime: '12:00',
    purpose: '',
    requestedServices: 'None',
  });

  const [conflictState, setConflictState] = useState({ checking: false, checked: false, hasConflict: false, message: '' });
  const [actionError, setActionError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  // Initial loads
  useEffect(() => {
    fetchResources();
    fetchMyBookings();
  }, []);

  const fetchResources = async () => {
    setLoading(true);
    try {
      const res = await resourceAPI.getAll();
      if (res.success && res.data) {
        setResources(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyBookings = async () => {
    setBookingsLoading(true);
    try {
      const res = await bookingAPI.getMyBookings();
      if (res.success && res.data) {
        setMyBookings(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setBookingsLoading(false);
    }
  };

  const openBookModal = (resource) => {
    setSelectedResource(resource);
    setIsEditMode(false);
    setEditBookingId(null);
    setBookingForm({
      date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      startTime: '10:00',
      endTime: '12:00',
      purpose: '',
      requestedServices: 'None',
    });
    setConflictState({ checking: false, checked: false, hasConflict: false, message: '' });
    setActionError('');
    setActionSuccess('');
    setBookingModalOpen(true);
  };

  const openEditModal = (booking) => {
    setSelectedResource(booking.resource);
    setIsEditMode(true);
    setEditBookingId(booking.id);

    const start = new Date(booking.startTime);
    const end = new Date(booking.endTime);
    const dateStr = start.toISOString().split('T')[0];
    const startTimeStr = start.toTimeString().substring(0, 5);
    const endTimeStr = end.toTimeString().substring(0, 5);

    setBookingForm({
      date: dateStr,
      startTime: startTimeStr,
      endTime: endTimeStr,
      purpose: booking.purpose || '',
      requestedServices: booking.requestedServices || 'None',
    });
    setConflictState({ checking: false, checked: false, hasConflict: false, message: '' });
    setActionError('');
    setActionSuccess('');
    setBookingModalOpen(true);
  };

  // Perform quick real-time conflict check
  const handleCheckConflict = async () => {
    if (!selectedResource) return;
    const startIso = `${bookingForm.date}T${bookingForm.startTime}:00`;
    const endIso = `${bookingForm.date}T${bookingForm.endTime}:00`;

    if (new Date(startIso) >= new Date(endIso)) {
      setActionError('Start time must be before end time');
      return;
    }

    setConflictState({ checking: true, checked: false, hasConflict: false, message: '' });
    try {
      const params = {
        resourceId: selectedResource.id,
        startTime: startIso,
        endTime: endIso,
      };
      if (isEditMode && editBookingId) {
        params.excludeBookingId = editBookingId;
      }
      const res = await bookingAPI.checkConflict(params);
      if (res.data?.hasConflict) {
        setConflictState({ checking: false, checked: true, hasConflict: true, message: 'Conflict detected: Resource is already booked in this slot!' });
      } else {
        setConflictState({ checking: false, checked: true, hasConflict: false, message: 'Slot is completely available!' });
      }
    } catch (err) {
      setConflictState({ checking: false, checked: false, hasConflict: false, message: err.message });
    }
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setActionError('');
    setActionSuccess('');

    const startIso = `${bookingForm.date}T${bookingForm.startTime}:00`;
    const endIso = `${bookingForm.date}T${bookingForm.endTime}:00`;

    if (new Date(startIso) >= new Date(endIso)) {
      setActionError('Start time must be before end time');
      return;
    }

    const payload = {
      resourceId: selectedResource.id,
      startTime: startIso,
      endTime: endIso,
      purpose: bookingForm.purpose,
      requestedServices: bookingForm.requestedServices,
    };

    try {
      if (isEditMode) {
        await bookingAPI.modify(editBookingId, payload);
        setActionSuccess('Booking updated successfully!');
      } else {
        await bookingAPI.create(payload);
        setActionSuccess('Booking confirmed! Alert notification dispatched.');
      }
      fetchMyBookings();
      fetchResources();
      refreshNotifications();
      setTimeout(() => {
        setBookingModalOpen(false);
      }, 1200);
    } catch (err) {
      setActionError(err.message);
    }
  };

  const handleCancelBooking = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    try {
      await bookingAPI.cancel(id);
      fetchMyBookings();
      fetchResources();
      refreshNotifications();
    } catch (err) {
      alert(err.message);
    }
  };

  const filteredResources = resources.filter((r) => {
    const matchType = selectedCategory === 'ALL' || r.type === selectedCategory;
    const matchSearch =
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.description && r.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchType && matchSearch;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'CONFIRMED':
        return <span className="badge badge-success"><CheckCircle2 size={12} /> Confirmed</span>;
      case 'CANCELLED':
        return <span className="badge badge-danger"><XCircle size={12} /> Cancelled</span>;
      case 'COMPLETED':
        return <span className="badge badge-info"><CheckCircle2 size={12} /> Completed</span>;
      default:
        return <span className="badge badge-warning"><Clock size={12} /> {status}</span>;
    }
  };

  return (
    <div style={{ maxWidth: 1260, width: '100%', margin: '0 auto', padding: '22px 18px', boxSizing: 'border-box' }}>
      {/* Welcome Hero Banner */}
      <div className="glass-panel" style={{
        padding: '28px 32px',
        marginBottom: 24,
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(240, 245, 255, 0.9) 50%, rgba(245, 243, 255, 0.9) 100%)',
        border: '1px solid rgba(255, 255, 255, 0.95)',
        boxShadow: 'var(--shadow-card)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 18,
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Iridescent Accent Bar */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background: 'var(--grad-primary)',
        }} />

        {/* Ambient Aurora Glow */}
        <div style={{
          position: 'absolute',
          top: -30,
          right: -30,
          width: 180,
          height: 180,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.16) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <span className="badge badge-primary">{user?.role} PORTAL</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Campus Operations</span>
          </div>
          <h1 style={{ fontSize: '1.75rem', marginBottom: 6, letterSpacing: '-0.03em' }}>
            Welcome back, {user?.fullName}!
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: 640 }}>
            {user?.role === 'FACULTY'
              ? 'Reserve smart lecture halls, specialized laboratories, and audio-visual equipment for your sessions.'
              : 'Reserve digital lockers, research lab setups, and collaborative equipment with real-time conflict verification.'}
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button
            className={`btn ${activeTab === 'catalog' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('catalog')}
          >
            <Layers size={16} /> Browse Catalog
          </button>
          <button
            className={`btn ${activeTab === 'my-bookings' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('my-bookings')}
          >
            <Calendar size={16} /> My Reservations ({myBookings.filter(b => b.status === 'CONFIRMED').length})
          </button>
        </div>
      </div>

      {/* Tab 1: Catalog & Booking */}
      {activeTab === 'catalog' && (
        <div>
          {/* Filter Bar */}
          <div className="glass-panel" style={{
            padding: '14px 18px',
            marginBottom: 20,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 14,
          }}>
            {/* Category Pills */}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {['ALL', 'CLASSROOM', 'LAB', 'LOCKER', 'EQUIPMENT'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: 9999,
                    border: selectedCategory === cat ? '1px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                    background: selectedCategory === cat ? 'var(--grad-primary)' : '#ffffff',
                    color: selectedCategory === cat ? '#ffffff' : 'var(--text-secondary)',
                    fontWeight: 700,
                    fontSize: '0.78rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    boxShadow: selectedCategory === cat ? '0 2px 10px rgba(79, 70, 229, 0.35)' : 'none'
                  }}
                >
                  {cat === 'ALL' ? 'All Shared Resources' : cat + 'S'}
                </button>
              ))}
            </div>

            {/* Search Box */}
            <div style={{ position: 'relative', width: 260 }}>
              <Search size={15} color="var(--text-muted)" style={{ position: 'absolute', left: 12, top: 12 }} />
              <input
                type="text"
                className="form-input"
                style={{ paddingLeft: 34, height: 38 }}
                placeholder="Search resources, labs, hall..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Resources Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
            gap: 18,
          }}>
            {filteredResources.map((res) => (
              <div
                key={res.id}
                className="glass-panel"
                style={{
                  padding: 20,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  position: 'relative',
                  borderTop: `3px solid ${
                    res.type === 'CLASSROOM' ? '#6366f1' :
                    res.type === 'LAB' ? '#06b6d4' :
                    res.type === 'LOCKER' ? '#10b981' : '#a855f7'
                  }`,
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                    <span className="badge badge-primary">{res.type}</span>
                    {res.hourlyRate > 0 ? (
                      <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>
                        ₹{res.hourlyRate}/hr
                      </span>
                    ) : (
                      <span className="badge badge-success">Free for Campus</span>
                    )}
                  </div>

                  <h3 style={{ fontSize: '1.15rem', marginBottom: 6, letterSpacing: '-0.02em' }}>{res.name}</h3>

                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: 14, minHeight: 38 }}>
                    {res.description || 'Dedicated campus facility with verified access control.'}
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 5, fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 18 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <MapPin size={14} color="#94a3b8" />
                      <span>{res.location}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Users size={14} color="#94a3b8" />
                      <span>Capacity: {res.capacity} {res.capacity === 1 ? 'Slot' : 'Persons'}</span>
                    </div>
                  </div>
                </div>

                <button
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '9px', borderRadius: 'var(--radius-sm)' }}
                  onClick={() => openBookModal(res)}
                >
                  <Calendar size={15} /> Reserve Now
                </button>
              </div>
            ))}
          </div>

          {filteredResources.length === 0 && (
            <div className="glass-panel" style={{ padding: 36, textAlign: 'center', color: 'var(--text-muted)' }}>
              No campus resources match your filter criteria.
            </div>
          )}
        </div>
      )}

      {/* Tab 2: My Bookings & History */}
      {activeTab === 'my-bookings' && (
        <div className="glass-panel" style={{ padding: 22 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
            <div>
              <h2 style={{ fontSize: '1.3rem' }}>My Reservations & Bookings</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                Track scheduled slots, modify times, or cancel active reservations.
              </p>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={fetchMyBookings}>
              Refresh
            </button>
          </div>

          {bookingsLoading ? (
            <p style={{ textAlign: 'center', padding: 20, color: 'var(--text-muted)' }}>Loading reservations...</p>
          ) : myBookings.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
              <Calendar size={44} style={{ opacity: 0.3, marginBottom: 10 }} />
              <p style={{ fontSize: '0.9rem' }}>You haven't made any resource reservations yet.</p>
              <button
                className="btn btn-primary btn-sm"
                style={{ marginTop: 10 }}
                onClick={() => setActiveTab('catalog')}
              >
                Browse Resources
              </button>
            </div>
          ) : (
            <div className="table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Booking ID</th>
                    <th>Resource</th>
                    <th>Type & Location</th>
                    <th>Time Slot</th>
                    <th>Purpose / Services</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {myBookings.map((b) => (
                    <tr key={b.id}>
                      <td style={{ fontWeight: 800, color: 'var(--accent-primary)' }}>
                        #{b.id}
                      </td>
                      <td style={{ fontWeight: 700 }}>
                        {b.resource.name}
                      </td>
                      <td>
                        <span className="badge badge-primary" style={{ fontSize: '0.68rem', marginRight: 6 }}>
                          {b.resource.type}
                        </span>
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                          {b.resource.location}
                        </span>
                      </td>
                      <td>
                        <div style={{ fontWeight: 700, fontSize: '0.84rem' }}>
                          {new Date(b.startTime).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                        <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                          {new Date(b.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(b.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>
                      <td>
                        <div style={{ fontSize: '0.84rem' }}>{b.purpose || 'Campus Resource Reservation'}</div>
                        {b.requestedServices && b.requestedServices !== 'None' && (
                          <div style={{ fontSize: '0.74rem', color: 'var(--accent-cyan)', marginTop: 2 }}>
                            Services: {b.requestedServices}
                          </div>
                        )}
                      </td>
                      <td>{getStatusBadge(b.status)}</td>
                      <td>
                        {b.status === 'CONFIRMED' && (
                          <div style={{ display: 'flex', gap: 6 }}>
                            <button
                              className="btn btn-secondary btn-sm"
                              title="Modify booking"
                              onClick={() => openEditModal(b)}
                            >
                              <Edit size={13} /> Modify
                            </button>
                            <button
                              className="btn btn-danger btn-sm"
                              title="Cancel booking"
                              onClick={() => handleCancelBooking(b.id)}
                            >
                              <Trash2 size={13} /> Cancel
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Booking Modal */}
      {bookingModalOpen && selectedResource && (
        <div className="modal-overlay" onClick={() => setBookingModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <div>
                <span className="badge badge-primary">{selectedResource.type}</span>
                <h2 style={{ fontSize: '1.3rem', marginTop: 4 }}>
                  {isEditMode ? 'Modify Reservation' : 'Reserve ' + selectedResource.name}
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                  {selectedResource.location} • Capacity: {selectedResource.capacity}
                </p>
              </div>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setBookingModalOpen(false)}
              >
                ✕
              </button>
            </div>

            {actionError && (
              <div style={{
                padding: '9px 12px',
                borderRadius: 'var(--radius-xs)',
                background: '#ffe4e6',
                border: '1px solid #fecdd3',
                color: '#9f1239',
                fontSize: '0.82rem',
                marginBottom: 14,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}>
                <AlertCircle size={15} /> {actionError}
              </div>
            )}

            {actionSuccess && (
              <div style={{
                padding: '9px 12px',
                borderRadius: 'var(--radius-xs)',
                background: '#d1fae5',
                border: '1px solid #a7f3d0',
                color: '#065f46',
                fontSize: '0.82rem',
                marginBottom: 14,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}>
                <CheckCircle2 size={15} /> {actionSuccess}
              </div>
            )}

            <form onSubmit={handleBookingSubmit}>
              <div className="form-group">
                <label className="form-label">Reservation Date</label>
                <input
                  type="date"
                  required
                  className="form-input"
                  value={bookingForm.date}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setBookingForm({ ...bookingForm, date: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-group">
                  <label className="form-label">Start Time</label>
                  <input
                    type="time"
                    required
                    className="form-input"
                    value={bookingForm.startTime}
                    onChange={(e) => setBookingForm({ ...bookingForm, startTime: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">End Time</label>
                  <input
                    type="time"
                    required
                    className="form-input"
                    value={bookingForm.endTime}
                    onChange={(e) => setBookingForm({ ...bookingForm, endTime: e.target.value })}
                  />
                </div>
              </div>

              {/* Slot Conflict Check Live Tool */}
              <div style={{
                background: 'rgba(11, 15, 26, 0.9)',
                padding: 12,
                borderRadius: 'var(--radius-sm)',
                marginBottom: 16,
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
                <div style={{ fontSize: '0.8rem' }}>
                  {conflictState.checking ? (
                    <span style={{ color: 'var(--accent-primary)' }}>Checking schedule slots...</span>
                  ) : conflictState.checked ? (
                    conflictState.hasConflict ? (
                      <span style={{ color: 'var(--accent-rose)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <XCircle size={14} /> {conflictState.message}
                      </span>
                    ) : (
                      <span style={{ color: 'var(--accent-emerald)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <CheckCircle2 size={14} /> {conflictState.message}
                      </span>
                    )
                  ) : (
                    <span style={{ color: 'var(--text-muted)' }}>
                      Verify slot availability before confirming.
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={handleCheckConflict}
                  disabled={conflictState.checking}
                >
                  <ShieldCheck size={13} /> Verify Slot
                </button>
              </div>

              <div className="form-group">
                <label className="form-label">Purpose / Notes</label>
                <textarea
                  rows={2}
                  className="form-textarea"
                  placeholder="e.g. Distributed Systems Lab Practice, Semester Review Lecture"
                  value={bookingForm.purpose}
                  onChange={(e) => setBookingForm({ ...bookingForm, purpose: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Request Campus Services</label>
                <select
                  className="form-select"
                  value={bookingForm.requestedServices}
                  onChange={(e) => setBookingForm({ ...bookingForm, requestedServices: e.target.value })}
                >
                  <option value="None">None (Standard Access)</option>
                  <option value="Lab Assistant Support">Lab Assistant Support</option>
                  <option value="4K Projector & Audio Setup">4K Projector & Audio Setup</option>
                  <option value="High-Speed LAN Calibration">High-Speed LAN Calibration</option>
                  <option value="Smart Locker RFID Master Card">Smart Locker RFID Master Card</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 18 }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setBookingModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={conflictState.hasConflict}
                >
                  <CheckCircle2 size={15} />
                  {isEditMode ? 'Save Changes' : 'Confirm Reservation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
