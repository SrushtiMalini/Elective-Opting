import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getMyResult, getProfile } from '../utils/api';

const Result = () => {
  const { user } = useAuth();
  const [result, setResult] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getMyResult(user._id), getProfile(user._id)]).then(([r, p]) => {
      setResult(r.data);
      setProfile(p.data);
      setLoading(false);
    });
  }, [user._id]);

  if (loading) return <div className="loading">⏳ Loading result...</div>;

  const statusConfig = {
    Approved: { icon: '✅', color: 'var(--green)', badgeClass: 'badge-approved', msg: 'Congratulations! You have been allocated your elective.' },
    Waitlisted: { icon: '⏳', color: 'var(--yellow)', badgeClass: 'badge-waitlisted', msg: 'You are on the waitlist. You will be notified if a seat becomes available.' },
    Rejected: { icon: '❌', color: 'var(--red)', badgeClass: 'badge-rejected', msg: 'Unfortunately, you could not be allocated any elective in this round.' },
  };

  const config = result?.status ? statusConfig[result.status] : null;

  return (
    <div>
      <div className="page-header">
        <h1>🎯 My Allocation Result</h1>
        <p>Your elective allocation status for this semester</p>
      </div>

      {!config ? (
        <div className="card" style={{ textAlign: 'center', padding: 60 }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>⏸</div>
          <h2 style={{ marginBottom: 8 }}>Allocation Pending</h2>
          <p style={{ color: 'var(--text2)', maxWidth: 400, margin: '0 auto', lineHeight: 1.6 }}>
            The admin has not yet run the allocation engine. Make sure you have submitted your preferences.
          </p>
          <div style={{ marginTop: 24, padding: 16, background: 'var(--card2)', borderRadius: 'var(--radius-sm)', display: 'inline-block' }}>
            <div style={{ fontSize: 13, color: 'var(--text3)' }}>Preferences submitted</div>
            <div style={{ fontWeight: 700, color: profile?.preferences?.length > 0 ? 'var(--green)' : 'var(--red)' }}>
              {profile?.preferences?.length > 0 ? `${profile.preferences.length} preference(s) saved ✓` : 'Not submitted yet'}
            </div>
          </div>
        </div>
      ) : (
        <div>
          {/* Result card */}
          <div className="card" style={{ marginBottom: 24, borderColor: config.color, borderWidth: 2 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
              <div style={{ fontSize: 64 }}>{config.icon}</div>
              <div style={{ flex: 1 }}>
                <span className={`badge ${config.badgeClass}`} style={{ marginBottom: 12 }}>
                  {result.status}
                </span>
                <h2 style={{ fontSize: 28, marginBottom: 6 }}>{result.assignedElective}</h2>
                {result.electiveId && (
                  <div style={{ color: 'var(--text2)', fontSize: 14 }}>
                    Faculty: {result.electiveId.faculty} • {result.electiveId.department} • Code: {result.electiveId.code}
                  </div>
                )}
                <p style={{ color: 'var(--text2)', marginTop: 12, fontSize: 14 }}>{config.msg}</p>
                {result.preferenceRank && (
                  <div style={{ marginTop: 8, fontSize: 13, color: 'var(--text3)' }}>
                    This was your Preference #{result.preferenceRank}
                  </div>
                )}
                {result.status === 'Waitlisted' && (
                  <div style={{ marginTop: 8, fontSize: 14, color: 'var(--yellow)', fontWeight: 600 }}>
                    Waitlist Position: #{result.waitlistPosition}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Student summary */}
          <div className="card">
            <h3 style={{ marginBottom: 20 }}>Your Submission Summary</h3>
            <div className="grid-3">
              <div>
                <div style={{ fontSize: 12, color: 'var(--text3)', textTransform: 'uppercase', marginBottom: 4 }}>Name</div>
                <div style={{ fontWeight: 600 }}>{user.name}</div>
              </div>
              <div>
                <div style={{ fontSize: 12, color: 'var(--text3)', textTransform: 'uppercase', marginBottom: 4 }}>USN</div>
                <div style={{ fontWeight: 600 }}>{user.usn}</div>
              </div>
              <div>
                <div style={{ fontSize: 12, color: 'var(--text3)', textTransform: 'uppercase', marginBottom: 4 }}>CGPA</div>
                <div style={{ fontWeight: 600 }}>{profile?.cgpa}</div>
              </div>
            </div>
            <div style={{ marginTop: 20 }}>
              <div style={{ fontSize: 12, color: 'var(--text3)', textTransform: 'uppercase', marginBottom: 10 }}>Submitted Preferences</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {profile?.preferences?.map((p, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 16px', background: 'var(--card2)', borderRadius: 'var(--radius-sm)' }}>
                    <span style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--card)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700 }}>{i + 1}</span>
                    <span>{p}</span>
                    {result.assignedElective === p && <span className={`badge ${config.badgeClass}`} style={{ marginLeft: 'auto' }}>Allocated</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Result;