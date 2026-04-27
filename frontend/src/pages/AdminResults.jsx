import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { getAllResults, runAllocation, updateAllocationStatus } from '../utils/api';

const AdminResults = () => {
  const [results, setResults] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);

  const load = async () => {
    try {
      const { data } = await getAllResults();
      setResults(data);
      setFiltered(data);
    } catch (e) {
      toast.error('Failed to load results');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  useEffect(() => {
    let list = results;
    if (statusFilter !== 'All') list = list.filter((r) => r.status === statusFilter);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((r) =>
        r.studentId?.name?.toLowerCase().includes(q) ||
        r.studentId?.usn?.toLowerCase().includes(q) ||
        r.assignedElective?.toLowerCase().includes(q)
      );
    }
    setFiltered(list);
  }, [search, statusFilter, results]);

  const handleStatusUpdate = async (id, status) => {
    try {
      await updateAllocationStatus(id, { status });
      toast.success(`Status updated to ${status}`);
      load();
    } catch (e) {
      toast.error('Update failed');
    }
  };

  const handleRunAllocation = async () => {
    if (!window.confirm('Run allocation engine? Previous results will be cleared.')) return;
    setRunning(true);
    try {
      const { data } = await runAllocation();
      toast.success(`Allocation done — Approved: ${data.approved}, Waitlisted: ${data.waitlisted}`);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    } finally {
      setRunning(false);
    }
  };

  if (loading) return <div className="loading">⏳ Loading results...</div>;

  const counts = {
    Approved: results.filter((r) => r.status === 'Approved').length,
    Waitlisted: results.filter((r) => r.status === 'Waitlisted').length,
    Rejected: results.filter((r) => r.status === 'Rejected').length,
  };

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1>📋 Allocation Results</h1>
          <p>{results.length} total allocations</p>
        </div>
        <button className="btn btn-primary" onClick={handleRunAllocation} disabled={running}>
          {running ? '⏳ Running...' : '🚀 Re-run Allocation'}
        </button>
      </div>

      {/* Summary */}
      <div className="grid-3" style={{ marginBottom: 24 }}>
        {[
          { label: 'Approved', val: counts.Approved, cls: 'badge-approved', icon: '✅' },
          { label: 'Waitlisted', val: counts.Waitlisted, cls: 'badge-waitlisted', icon: '⏳' },
          { label: 'Rejected', val: counts.Rejected, cls: 'badge-rejected', icon: '❌' },
        ].map((s) => (
          <div key={s.label} className="stat-card">
            <div className="stat-icon" style={{ background: 'var(--card2)', fontSize: 20 }}>{s.icon}</div>
            <div className="stat-value">{s.val}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      {results.length > 0 && (
        <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
          <input className="form-control" style={{ flex: 1, minWidth: 200 }}
            placeholder="Search student, USN, elective..."
            value={search} onChange={(e) => setSearch(e.target.value)} />
          {['All', 'Approved', 'Waitlisted', 'Rejected'].map((s) => (
            <button key={s} className={`btn ${statusFilter === s ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setStatusFilter(s)}>{s}</button>
          ))}
        </div>
      )}

      {results.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🎯</div>
          <h3>No allocations yet</h3>
          <p>Run the allocation engine from the dashboard</p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Student</th>
                <th>USN</th>
                <th>CGPA</th>
                <th>Backlog</th>
                <th>Allocated Elective</th>
                <th>Pref #</th>
                <th>Status</th>
                <th>Waitlist</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r, i) => (
                <tr key={r._id}>
                  <td style={{ color: 'var(--text3)' }}>{i + 1}</td>
                  <td style={{ fontWeight: 600 }}>{r.studentId?.name || '—'}</td>
                  <td style={{ fontFamily: 'monospace', fontSize: 12 }}>{r.studentId?.usn || '—'}</td>
                  <td style={{ fontWeight: 600 }}>{r.studentId?.cgpa ?? '—'}</td>
                  <td>{r.studentId?.backlog ? <span style={{ color: 'var(--red)' }}>Yes</span> : <span style={{ color: 'var(--green)' }}>No</span>}</td>
                  <td style={{ fontWeight: 500 }}>{r.assignedElective}</td>
                  <td style={{ textAlign: 'center' }}>
                    {r.preferenceRank ? <span style={{ color: 'var(--accent2)', fontWeight: 600 }}>#{r.preferenceRank}</span> : '—'}
                  </td>
                  <td><span className={`badge badge-${r.status?.toLowerCase()}`}>{r.status}</span></td>
                  <td>{r.waitlistPosition ? `#${r.waitlistPosition}` : '—'}</td>
                  <td>
                    <select
                      value={r.status}
                      onChange={(e) => handleStatusUpdate(r._id, e.target.value)}
                      style={{ background: 'var(--card2)', border: '1px solid var(--border)', color: 'var(--text)', borderRadius: 8, padding: '4px 8px', fontSize: 12 }}>
                      {['Approved', 'Waitlisted', 'Rejected', 'Pending'].map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminResults;