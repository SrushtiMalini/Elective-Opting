import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { runAllocation } from '../utils/api';

const AdminAllocation = ({ setActivePage }) => {
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(null);

  const handleRun = async () => {
    setRunning(true);
    try {
      const { data } = await runAllocation();
      setDone(data);
      toast.success('Allocation engine completed!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Allocation failed');
    } finally {
      setRunning(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>🚀 Run Allocation Engine</h1>
        <p>Executes the priority-based allocation algorithm for all students</p>
      </div>

      <div className="grid-2">
        <div className="card">
          <h3 style={{ marginBottom: 16 }}>Algorithm Overview</h3>
          <div style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 2 }}>
            {[
              ['1.', 'Filter students with complete profiles & preferences'],
              ['2.', 'Sort: No-backlog students first, then by CGPA (descending)'],
              ['3.', 'For each student, check Preference 1 → 2 → 3'],
              ['4.', 'Check: Branch eligibility + Min CGPA + Seat availability'],
              ['5.', 'If seat available → Allocate (Approved)'],
              ['6.', 'If no seat in any preference → Waitlist on best match'],
              ['7.', 'Update seat counts in database'],
            ].map(([num, text]) => (
              <div key={num} style={{ display: 'flex', gap: 12, marginBottom: 8 }}>
                <span style={{ color: 'var(--accent)', fontWeight: 700, minWidth: 20 }}>{num}</span>
                <span>{text}</span>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 20, padding: 16, background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.2)', borderRadius: 12 }}>
            <div style={{ color: 'var(--yellow)', fontWeight: 600, marginBottom: 4 }}>⚠️ Warning</div>
            <div style={{ fontSize: 13, color: 'var(--text2)' }}>Running allocation will clear all previous allocation records and reset seat counts before re-running.</div>
          </div>
        </div>

        <div>
          <div className="card" style={{ marginBottom: 20 }}>
            {!done ? (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ fontSize: 64, marginBottom: 20 }}>⚙️</div>
                <h3 style={{ marginBottom: 8 }}>Ready to Run</h3>
                <p style={{ color: 'var(--text2)', marginBottom: 28 }}>Click the button to start the priority-based allocation process</p>
                <button className="btn btn-primary" style={{ padding: '16px 40px', fontSize: 16 }}
                  onClick={handleRun} disabled={running}>
                  {running ? '⏳ Processing...' : '🚀 Run Allocation Now'}
                </button>
              </div>
            ) : (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 56, marginBottom: 16 }}>✅</div>
                <h3 style={{ marginBottom: 20 }}>Allocation Complete!</h3>
                <div className="grid-2" style={{ marginBottom: 20 }}>
                  <div className="stat-card">
                    <div className="stat-value" style={{ color: 'var(--green)' }}>{done.approved}</div>
                    <div className="stat-label">Approved</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-value" style={{ color: 'var(--yellow)' }}>{done.waitlisted}</div>
                    <div className="stat-label">Waitlisted</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                  <button className="btn btn-ghost" style={{ flex: 1 }} onClick={handleRun} disabled={running}>
                    🔄 Re-run
                  </button>
                  <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => setActivePage('admin-results')}>
                    📋 View Results
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAllocation;