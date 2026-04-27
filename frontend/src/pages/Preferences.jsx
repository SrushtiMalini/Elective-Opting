import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { getAllElectives, getProfile, updatePreferences } from '../utils/api';
import ElectiveCard from '../components/ElectiveCard';

const Preferences = () => {
  const { user } = useAuth();
  const [electives, setElectives] = useState([]);
  const [selected, setSelected] = useState([]); // array of electiveName strings
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    Promise.all([getAllElectives(), getProfile(user._id)]).then(([e, p]) => {
      setElectives(e.data);
      setProfile(p.data);
      setSelected(p.data.preferences || []);
      setLoading(false);
    });
  }, [user._id]);

  const toggleElective = (name) => {
    if (selected.includes(name)) {
      setSelected(selected.filter((s) => s !== name));
    } else if (selected.length < 3) {
      setSelected([...selected, name]);
    } else {
      toast.error('You can only select 3 preferences. Remove one first.');
    }
  };

  const moveUp = (idx) => {
    if (idx === 0) return;
    const arr = [...selected];
    [arr[idx - 1], arr[idx]] = [arr[idx], arr[idx - 1]];
    setSelected(arr);
  };

  const moveDown = (idx) => {
    if (idx === selected.length - 1) return;
    const arr = [...selected];
    [arr[idx], arr[idx + 1]] = [arr[idx + 1], arr[idx]];
    setSelected(arr);
  };

  const handleSubmit = async () => {
    if (selected.length === 0) return toast.error('Select at least one preference');
    if (!profile?.profileComplete) return toast.error('Complete your profile first');
    setSaving(true);
    try {
      await updatePreferences(user._id, { preferences: selected });
      toast.success('Preferences saved successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const filteredElectives = search
    ? electives.filter((e) => e.electiveName.toLowerCase().includes(search.toLowerCase()) || e.faculty.toLowerCase().includes(search.toLowerCase()))
    : electives;

  if (loading) return <div className="loading">⏳ Loading...</div>;

  if (!profile?.profileComplete) {
    return (
      <div>
        <div className="page-header"><h1>⭐ My Preferences</h1></div>
        <div className="card" style={{ textAlign: 'center', padding: 48 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
          <h3 style={{ marginBottom: 8 }}>Profile Incomplete</h3>
          <p style={{ color: 'var(--text2)', marginBottom: 24 }}>Please complete your profile (CGPA, branch, semester) before setting preferences.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <h1>⭐ Set Preferences</h1>
        <p>Select up to 3 electives in your order of preference</p>
      </div>

      <div className="grid-2" style={{ gap: 32 }}>
        {/* Left: Selected preferences */}
        <div>
          <div className="card" style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3>Your Preferences ({selected.length}/3)</h3>
              <button className="btn btn-primary" onClick={handleSubmit} disabled={saving || selected.length === 0}>
                {saving ? 'Saving...' : '💾 Save'}
              </button>
            </div>

            {selected.length === 0 ? (
              <div style={{ color: 'var(--text3)', textAlign: 'center', padding: '24px 0', fontSize: 14 }}>
                Click electives on the right to add them →
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {selected.map((name, idx) => {
                  const elective = electives.find((e) => e.electiveName === name);
                  return (
                    <div key={name} style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      padding: '12px 16px',
                      background: 'var(--card2)', border: '1px solid var(--border)',
                      borderRadius: 'var(--radius-sm)',
                    }}>
                      <div style={{
                        width: 28, height: 28, borderRadius: '50%',
                        background: 'var(--accent)', color: '#fff',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 700, fontSize: 14, flexShrink: 0,
                      }}>{idx + 1}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>{name}</div>
                        {elective && <div style={{ fontSize: 12, color: 'var(--text3)' }}>{elective.faculty}</div>}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <button onClick={() => moveUp(idx)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text2)', fontSize: 14 }}>▲</button>
                        <button onClick={() => moveDown(idx)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text2)', fontSize: 14 }}>▼</button>
                      </div>
                      <button onClick={() => toggleElective(name)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--red)', fontSize: 18 }}>✕</button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="card" style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.7 }}>
            <h4 style={{ marginBottom: 10, color: 'var(--text)' }}>ℹ️ How Allocation Works</h4>
            <ul style={{ paddingLeft: 16 }}>
              <li>Higher CGPA students are processed first</li>
              <li>Students with no backlogs get priority</li>
              <li>Preference 1 is tried first, then 2, then 3</li>
              <li>Branch eligibility is always checked</li>
              <li>Remaining students go to waitlist</li>
            </ul>
          </div>
        </div>

        {/* Right: All electives */}
        <div>
          <input className="form-control" style={{ marginBottom: 16 }}
            placeholder="Search electives..."
            value={search} onChange={(e) => setSearch(e.target.value)} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxHeight: '70vh', overflowY: 'auto', paddingRight: 4 }}>
            {filteredElectives.map((e) => {
              const rank = selected.indexOf(e.electiveName) + 1;
              return (
                <ElectiveCard key={e._id} elective={e}
                  selected={selected.includes(e.electiveName)}
                  rank={rank || null}
                  onClick={() => toggleElective(e.electiveName)} />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Preferences;