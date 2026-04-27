import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { getAnalytics, runAllocation } from '../utils/api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const AdminDashboard = ({ setActivePage }) => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);

  const load = async () => {
    try {
      const { data } = await getAnalytics();
      setAnalytics(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleRunAllocation = async () => {
    if (!window.confirm('Run allocation engine? This will clear previous results.')) return;
    setRunning(true);
    try {
      const { data } = await runAllocation();
      toast.success(`✅ ${data.message} — Approved: ${data.approved}, Waitlisted: ${data.waitlisted}`);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Allocation failed');
    } finally {
      setRunning(false);
    }
  };

  if (loading) return <div className="loading">⏳ Loading analytics...</div>;

  const stats = [
    { icon: '👥', label: 'Total Students', value: analytics?.totalStudents, color: 'rgba(108,99,255,0.1)' },
    { icon: '✅', label: 'Profile Complete', value: analytics?.profileComplete, color: 'rgba(52,211,153,0.1)' },
    { icon: '📋', label: 'Preferences Submitted', value: analytics?.submitted, color: 'rgba(56,189,248,0.1)' },
    { icon: '🎯', label: 'Approved', value: analytics?.approved, color: 'rgba(52,211,153,0.1)' },
    { icon: '⏳', label: 'Waitlisted', value: analytics?.waitlisted, color: 'rgba(251,191,36,0.1)' },
    { icon: '📚', label: 'Total Electives', value: analytics?.totalElectives, color: 'rgba(167,139,250,0.1)' },
  ];

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1>📊 Admin Dashboard</h1>
          <p>Overview of the elective allocation system</p>
        </div>
        <button className="btn btn-primary" style={{ padding: '12px 24px' }}
          onClick={handleRunAllocation} disabled={running}>
          {running ? '⏳ Running...' : '🚀 Run Allocation Engine'}
        </button>
      </div>

      {/* Stats */}
      <div className="grid-3" style={{ marginBottom: 28 }}>
        {stats.map((s) => (
          <div key={s.label} className="stat-card">
            <div className="stat-icon" style={{ background: s.color }}>{s.icon}</div>
            <div className="stat-value">{s.value ?? 0}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Chart */}
      {analytics?.electiveBreakdown?.length > 0 && (
        <div className="card" style={{ marginBottom: 24 }}>
          <h3 style={{ marginBottom: 20 }}>Seat Allocation by Elective</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={analytics.electiveBreakdown} margin={{ left: -10 }}>
              <XAxis dataKey="name" tick={{ fill: 'var(--text2)', fontSize: 11 }} />
              <YAxis tick={{ fill: 'var(--text2)', fontSize: 11 }} />
              <Tooltip
                contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10, color: 'var(--text)', fontSize: 13 }}
              />
              <Bar dataKey="filled" name="Filled" fill="var(--accent)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="available" name="Available" fill="var(--border)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Quick actions */}
      <div className="grid-2">
        <div className="card">
          <h3 style={{ marginBottom: 16 }}>⚡ Quick Actions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <button className="btn btn-ghost" onClick={() => setActivePage('admin-electives')}>📚 Manage Electives</button>
            <button className="btn btn-ghost" onClick={() => setActivePage('admin-students')}>👥 View All Students</button>
            <button className="btn btn-ghost" onClick={() => setActivePage('admin-results')}>📋 View Results</button>
          </div>
        </div>
        <div className="card">
          <h3 style={{ marginBottom: 16 }}>📊 Allocation Summary</h3>
          {[
            { label: 'Approved', val: analytics?.approved, cls: 'badge-approved' },
            { label: 'Waitlisted', val: analytics?.waitlisted, cls: 'badge-waitlisted' },
          ].map((item) => (
            <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <span className={`badge ${item.cls}`}>{item.label}</span>
              <span style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 20 }}>{item.val || 0}</span>
            </div>
          ))}
          <div style={{ marginTop: 16, fontSize: 13, color: 'var(--text3)' }}>
            Total processed: {(analytics?.approved || 0) + (analytics?.waitlisted || 0)} of {analytics?.submitted || 0} students
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;