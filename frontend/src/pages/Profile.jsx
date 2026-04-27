import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { getProfile, updateProfile } from '../utils/api';

const BRANCHES = ['CSE', 'ISE', 'ECE', 'EEE', 'ME', 'CV', 'AI/ML', 'DS'];

const Profile = () => {
  const { user, login } = useAuth();
  const [form, setForm] = useState({ branch: '', semester: '', cgpa: '', backlog: false, phone: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getProfile(user._id).then(({ data }) => {
      setForm({
        branch: data.branch || '',
        semester: data.semester || '',
        cgpa: data.cgpa ?? '',
        backlog: data.backlog || false,
        phone: data.phone || '',
      });
      setLoading(false);
    });
  }, [user._id]);

  const handleSave = async () => {
    if (!form.branch || !form.semester || form.cgpa === '') return toast.error('Branch, semester and CGPA are required');
    if (form.cgpa < 0 || form.cgpa > 10) return toast.error('CGPA must be between 0 and 10');
    setSaving(true);
    try {
      const { data } = await updateProfile(user._id, form);
      // Update local user if needed
      login({ ...user, profileComplete: data.profileComplete });
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="loading">⏳ Loading profile...</div>;

  return (
    <div>
      <div className="page-header">
        <h1>👤 My Profile</h1>
        <p>Keep your academic details up to date for accurate allocation</p>
      </div>

      <div className="grid-2">
        {/* Read-only info */}
        <div className="card">
          <h3 style={{ marginBottom: 20 }}>Account Details</h3>
          {[
            { label: 'Full Name', value: user.name },
            { label: 'USN', value: user.usn },
            { label: 'Email', value: user.email },
          ].map((f) => (
            <div key={f.label} style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 12, color: 'var(--text3)', fontWeight: 600, textTransform: 'uppercase', marginBottom: 4 }}>{f.label}</div>
              <div style={{ fontWeight: 500 }}>{f.value}</div>
            </div>
          ))}
        </div>

        {/* Editable form */}
        <div className="card">
          <h3 style={{ marginBottom: 20 }}>Academic Details</h3>

          <div className="form-group">
            <label>Branch</label>
            <select className="form-control" value={form.branch} onChange={(e) => setForm({ ...form, branch: e.target.value })}>
              <option value="">Select Branch</option>
              {BRANCHES.map((b) => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label>Semester</label>
            <select className="form-control" value={form.semester} onChange={(e) => setForm({ ...form, semester: e.target.value })}>
              <option value="">Select Semester</option>
              {[1,2,3,4,5,6,7,8].map((s) => <option key={s} value={s}>Semester {s}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label>CGPA</label>
            <input className="form-control" type="number" step="0.01" min="0" max="10"
              placeholder="e.g. 8.5"
              value={form.cgpa} onChange={(e) => setForm({ ...form, cgpa: e.target.value })} />
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            <input className="form-control" type="tel" placeholder="10-digit number"
              value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <input type="checkbox" id="backlog" style={{ width: 18, height: 18, cursor: 'pointer' }}
              checked={form.backlog} onChange={(e) => setForm({ ...form, backlog: e.target.checked })} />
            <label htmlFor="backlog" style={{ cursor: 'pointer', fontSize: 14, color: 'var(--text2)' }}>
              I have active backlogs
            </label>
          </div>

          <button className="btn btn-primary" style={{ width: '100%', padding: '14px' }}
            onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : '💾 Save Profile'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;