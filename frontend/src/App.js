import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import './index.css';

// Pages
import Landing from './pages/Landing';
import { Login, Register, AdminLogin } from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Electives from './pages/Electives';
import Preferences from './pages/Preferences';
import Result from './pages/Result';
import AdminDashboard from './pages/AdminDashboard';
import AdminElectives from './pages/AdminElectives';
import AdminStudents from './pages/AdminStudents';
import AdminAllocation from './pages/AdminAllocation';
import AdminResults from './pages/AdminResults';

// Components
import Sidebar from './components/Sidebar';

const AppContent = () => {
  const { user, loading } = useAuth();
  const [page, setPage] = useState('landing');

  useEffect(() => {
    if (!loading) {
      if (user) {
        setPage(user.role === 'admin' ? 'admin-dashboard' : 'dashboard');
      } else {
        setPage('landing');
      }
    }
  }, [user, loading]);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', gap: 12, color: 'var(--text2)' }}>
        <div style={{ width: 20, height: 20, border: '2px solid var(--accent)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        Loading...
      </div>
    );
  }

  // Public pages (no sidebar)
  if (!user) {
    const publicPages = {
      landing: <Landing onNavigate={setPage} />,
      login: <Login onNavigate={setPage} onSuccess={() => {}} />,
      register: <Register onNavigate={setPage} />,
      'admin-login': <AdminLogin onNavigate={setPage} onSuccess={() => {}} />,
    };
    return publicPages[page] || <Landing onNavigate={setPage} />;
  }

  // Authenticated pages (with sidebar)
  const studentPages = {
    dashboard: <Dashboard setActivePage={setPage} />,
    profile: <Profile />,
    electives: <Electives setActivePage={setPage} />,
    preferences: <Preferences />,
    result: <Result />,
  };

  const adminPages = {
    'admin-dashboard': <AdminDashboard setActivePage={setPage} />,
    'admin-electives': <AdminElectives />,
    'admin-students': <AdminStudents />,
    'admin-allocation': <AdminAllocation setActivePage={setPage} />,
    'admin-results': <AdminResults />,
  };

  const allPages = user.role === 'admin' ? adminPages : studentPages;
  const currentPage = allPages[page];

  return (
    <div className="app-layout">
      <Sidebar activePage={page} setActivePage={setPage} />
      <main className="main-content">
        {currentPage || (user.role === 'admin' ? <AdminDashboard setActivePage={setPage} /> : <Dashboard setActivePage={setPage} />)}
      </main>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1a1a26',
            color: '#f0f0ff',
            border: '1px solid #2a2a3e',
            borderRadius: 12,
            fontSize: 14,
          },
          success: { iconTheme: { primary: '#34d399', secondary: '#1a1a26' } },
          error: { iconTheme: { primary: '#f87171', secondary: '#1a1a26' } },
        }}
      />
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </AuthProvider>
  );
}

export default App;