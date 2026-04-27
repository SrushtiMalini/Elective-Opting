import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { loginStudent, registerStudent, adminLogin } from '../utils/api';
import { useAuth } from '../context/AuthContext';

export const Login = ({ onNavigate, onSuccess }) => {
  const [form, setForm] = useState({ usn: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async () => {
    if (!form.usn || !form.password) return toast.error('Fill all fields');
    setLoading(true);
    try {
      const { data } = await loginStudent(form);
      login(data);
      toast.success(`Welcome back, ${data.name}!`);
      onSuccess();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div style={{ fontSize: 40, marginBottom: 16 }}>🎓</div>
        <h1>Student Login</h1>
        <p>Access your elective allocation portal</p>

        <div className="form-group">
          <label>University Serial Number (USN)</label>
          <input className="form-control" placeholder="e.g. 1RV21CS001"
            value={form.usn} onChange={(e) => setForm({ ...form, usn: e.target.value })} />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input className="form-control" type="password" placeholder="Enter password"
            value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()} />
        </div>

        <button className="btn btn-primary" style={{ width: '100%', padding: '14px', marginTop: 8 }}
          onClick={handleSubmit} disabled={loading}>
          {loading ? 'Signing in...' : 'Sign In'}
        </button>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: 'var(--text2)' }}>
          No account?{' '}
          <span style={{ color: 'var(--accent2)', cursor: 'pointer', fontWeight: 600 }}
            onClick={() => onNavigate('register')}>
            Register here
          </span>
        </p>
        <p style={{ textAlign: 'center', marginTop: 8, fontSize: 13, color: 'var(--text3)' }}>
          <span style={{ cursor: 'pointer' }} onClick={() => onNavigate('landing')}>← Back to home</span>
        </p>
      </div>
    </div>
  );
};

export const Register = ({ onNavigate }) => {
  const [form, setForm] = useState({ name: '', usn: '', email: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async () => {
    if (!form.name || !form.usn || !form.email || !form.password) return toast.error('Fill all fields');
    if (form.password !== form.confirm) return toast.error('Passwords do not match');
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    setLoading(true);
    try {
      const { data } = await registerStudent({ name: form.name, usn: form.usn, email: form.email, password: form.password });
      login(data);
      toast.success('Account created! Complete your profile.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div style={{ fontSize: 40, marginBottom: 16 }}>✨</div>
        <h1>Create Account</h1>
        <p>Join the elective allocation portal</p>

        {[
          { key: 'name', label: 'Full Name', placeholder: 'John Doe', type: 'text' },
          { key: 'usn', label: 'USN', placeholder: '1RV21CS001', type: 'text' },
          { key: 'email', label: 'Email', placeholder: 'john@college.edu', type: 'email' },
          { key: 'password', label: 'Password', placeholder: 'Min 6 characters', type: 'password' },
          { key: 'confirm', label: 'Confirm Password', placeholder: 'Re-enter password', type: 'password' },
        ].map((f) => (
          <div className="form-group" key={f.key}>
            <label>{f.label}</label>
            <input className="form-control" type={f.type} placeholder={f.placeholder}
              value={form[f.key]} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} />
          </div>
        ))}

        <button className="btn btn-primary" style={{ width: '100%', padding: '14px', marginTop: 8 }}
          onClick={handleSubmit} disabled={loading}>
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: 'var(--text2)' }}>
          Already registered?{' '}
          <span style={{ color: 'var(--accent2)', cursor: 'pointer', fontWeight: 600 }}
            onClick={() => onNavigate('login')}>
            Sign in
          </span>
        </p>
      </div>
    </div>
  );
};

export const AdminLogin = ({ onNavigate, onSuccess }) => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async () => {
    if (!form.email || !form.password) return toast.error('Fill all fields');
    setLoading(true);
    try {
      const { data } = await adminLogin(form);
      login(data);
      toast.success(`Welcome, ${data.name}!`);
      onSuccess();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div style={{ fontSize: 40, marginBottom: 16 }}>🔐</div>
        <h1>Admin Login</h1>
        <p>Manage electives and run allocation engine</p>

        <div className="form-group">
          <label>Email</label>
          <input className="form-control" type="email" placeholder="admin@elective.com"
            value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input className="form-control" type="password" placeholder="Password"
            value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()} />
        </div>

        <button className="btn btn-primary" style={{ width: '100%', padding: '14px', marginTop: 8 }}
          onClick={handleSubmit} disabled={loading}>
          {loading ? 'Signing in...' : 'Admin Sign In'}
        </button>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: 'var(--text3)' }}>
          Default: admin@elective.com / admin123
          <br />
          <span style={{ cursor: 'pointer', color: 'var(--accent2)', marginTop: 4, display: 'block' }}
            onClick={() => onNavigate('landing')}>← Back to home</span>
        </p>
      </div>
    </div>
  );
};