import React from 'react';

const Landing = ({ onNavigate }) => {
  return (
    <div className="landing">
      {/* Navbar */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '20px 40px', borderBottom: '1px solid var(--border)',
        position: 'sticky', top: 0, background: 'rgba(255,255,255,0.9)',
        backdropFilter: 'blur(12px)', zIndex: 10,
      }}>
        <span style={{
          fontFamily: 'Syne', fontWeight: 800, fontSize: 22,
          background: 'linear-gradient(135deg, #6366f1, #818cf8)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>ElectiveHub</span>
        <div style={{ display: 'flex', gap: 12 }}>
          <button className="btn btn-ghost" onClick={() => onNavigate('login')}>Student Login</button>
          <button className="btn btn-primary" onClick={() => onNavigate('admin-login')}>Admin</button>
        </div>
      </nav>

      {/* Hero */}
      <div className="hero">
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.3)',
          borderRadius: 99, padding: '6px 16px', fontSize: 13,
          color: 'var(--accent)', marginBottom: 32, fontWeight: 600,
        }}>
          ✨ Fair. Transparent. Priority-Based.
        </div>

        <h1>
          Elective Selection,<br />
          <span>Reimagined</span>
        </h1>

        <p>
          A smart allocation system that ensures every student gets their best-fit elective
          based on CGPA, preferences, and seat availability. Transparent and fair.
        </p>

        <div className="hero-actions">
          <button className="btn btn-primary" style={{ padding: '14px 32px', fontSize: 15 }}
            onClick={() => onNavigate('register')}>
            🎓 Get Started
          </button>
          <button className="btn btn-ghost" style={{ padding: '14px 32px', fontSize: 15 }}
            onClick={() => onNavigate('login')}>
            Sign In
          </button>
        </div>
      </div>

      {/* Features */}
      <div style={{ padding: '80px 40px', background: 'var(--bg2)', borderTop: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: 36, marginBottom: 8 }}>How It Works</h2>
          <p style={{ textAlign: 'center', color: 'var(--text2)', marginBottom: 48 }}>
            A simple, three-step process from registration to allocation
          </p>
          <div className="grid-3">
            {[
              { icon: '📝', title: 'Register & Profile', desc: 'Create your account. Fill in your CGPA, branch, and semester details to complete your profile.' },
              { icon: '⭐', title: 'Set Preferences', desc: 'Browse all available electives and select your top 3 preferences in order of priority.' },
              { icon: '🎯', title: 'Get Allocated', desc: 'The smart engine allocates electives based on CGPA ranking, preference order, and seat availability.' },
            ].map((f) => (
              <div key={f.title} className="card" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 40, marginBottom: 16 }}>{f.icon}</div>
                <h3 style={{ marginBottom: 8 }}>{f.title}</h3>
                <p style={{ color: 'var(--text2)', fontSize: 14, lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ padding: '60px 40px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24, textAlign: 'center' }}>
          {[
            { val: '100%', label: 'Transparent' },
            { val: 'CGPA', label: 'Merit-Based' },
            { val: '3 Pref', label: 'Choices Per Student' },
          ].map((s) => (
            <div key={s.label}>
              <div style={{ fontFamily: 'Syne', fontSize: 40, fontWeight: 800, color: 'var(--accent)' }}>{s.val}</div>
              <div style={{ color: 'var(--text2)', marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <footer style={{ padding: '20px', textAlign: 'center', color: 'var(--text3)', fontSize: 13, borderTop: '1px solid var(--border)' }}>
        © 2024 ElectiveHub — Priority-Based Elective Allocation System
      </footer>
    </div>
  );
};

export default Landing;