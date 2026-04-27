import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getProfile, getMyResult } from '../utils/api';

const Dashboard = ({ setActivePage }) => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [p, r] = await Promise.all([
          getProfile(user._id),
          getMyResult(user._id),
        ]);
        setProfile(p.data);
        setResult(r.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user._id]);

  if (loading) return <div className="loading">⏳ Loading dashboard...</div>;

  const steps = [
    { label: 'Account Created', done: true },
    { label: 'Profile Completed', done: profile?.profileComplete },
    { label: 'Preferences Submitted', done: profile?.preferences?.length > 0 },
    { label: 'Allocation Done', done: result?.status === 'Approved' || result?.status === 'Waitlisted' },
  ];

  return (
    <div>
      <div className="page-header">
        <h1>Welcome back, {user.name?.split(' ')[0]} 👋</h1>
        <p>{user.usn} • {profile?.branch || 'Branch not set'} • Semester {profile?.semester || '—'}</p>
      </div>

      {/* Progress Steps */}
      <div className="card" style={{ marginBottom: 24 }}>
        <h3 style={{ marginBottom: 20 }}>Your Progress</h3>
        <div style={{ display: 'flex', gap: 0 }}>
          {steps.map((step, i) => (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
              <div style={{
                width: 36, height: 36, borderRadius: '50%',
                background: step.done ? 'var(--accent)' : 'var(--card2)',
                border: `2px solid ${step.done ? 'var(--accent)' : 'var(--border)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 16, color: step.done ? '#fff' : 'var(--text3)',
                fontWeight: 700, zIndex: 1,
              }}>
                {step.done ? '✓' : i + 1}
              </div>
              <span style={{ fontSize: 12, color: step.done ? 'var(--text)' : 'var(--text3)', textAlign: 'center' }}>
                {step.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid-4" style={{ marginBottom: 24 }}>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(108,99,255,0.1)' }}>📊</div>
          <div className="stat-value">{profile?.cgpa ?? '—'}</div>
          <div className="stat-label">Your CGPA</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(52,211,153,0.1)' }}>📌</div>
          <div className="stat-value">{profile?.preferences?.length ?? 0}</div>
          <div className="stat-label">Preferences Set</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(56,189,248,0.1)' }}>🏛️</div>
          <div className="stat-value">{profile?.branch || '—'}</div>
          <div className="stat-label">Branch</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(251,191,36,0.1)' }}>📅</div>
          <div className="stat-value">Sem {profile?.semester || '—'}</div>
          <div className="stat-label">Semester</div>
        </div>
      </div>

      <div className="grid-2">
        {/* Allocation Result */}
        <div className="card">
          <h3 style={{ marginBottom: 16 }}>🎯 Allocation Status</h3>
          {result?.status === 'Approved' && (
            <div>
              <span className="badge badge-approved" style={{ marginBottom: 12 }}>✅ Approved</span>
              <div style={{ marginTop: 12 }}>
                <div style={{ fontSize: 18, fontWeight: 700 }}>{result.assignedElective}</div>
                <div style={{ fontSize: 13, color: 'var(--text2)', marginTop: 4 }}>
                  Preference #{result.preferenceRank} allocated
                </div>
              </div>
            </div>
          )}
          {result?.status === 'Waitlisted' && (
            <div>
              <span className="badge badge-waitlisted" style={{ marginBottom: 12 }}>⏳ Waitlisted</span>
              <div style={{ marginTop: 12 }}>
                <div style={{ fontSize: 18, fontWeight: 700 }}>{result.assignedElective}</div>
                <div style={{ fontSize: 13, color: 'var(--yellow)', marginTop: 4 }}>
                  Waitlist Position: #{result.waitlistPosition}
                </div>
              </div>
            </div>
          )}
          {(!result?.status || result?.message) && (
            <div style={{ color: 'var(--text2)', fontSize: 14 }}>
              <span className="badge badge-pending" style={{ marginBottom: 12 }}>⏸ Pending</span>
              <p style={{ marginTop: 12 }}>Allocation has not been run yet. Set your preferences and wait for the admin to run the allocation engine.</p>
            </div>
          )}
        </div>

        {/* Quick actions */}
        <div className="card">
          <h3 style={{ marginBottom: 16 }}>⚡ Quick Actions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {!profile?.profileComplete && (
              <button className="btn btn-primary" onClick={() => setActivePage('profile')}>
                👤 Complete Your Profile
              </button>
            )}
            <button className="btn btn-ghost" onClick={() => setActivePage('electives')}>
              📚 Browse Electives
            </button>
            <button className="btn btn-ghost" onClick={() => setActivePage('preferences')}>
              ⭐ Manage Preferences
            </button>
            <button className="btn btn-ghost" onClick={() => setActivePage('result')}>
              🎯 View Full Result
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;