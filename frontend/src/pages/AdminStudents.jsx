import React, { useEffect, useState } from 'react';
import { getAllStudents } from '../utils/api';

const AdminStudents = () => {
  const [students, setStudents] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllStudents().then(({ data }) => {
      setStudents(data);
      setFiltered(data);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(students.filter((s) =>
      s.name.toLowerCase().includes(q) ||
      s.usn.toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q) ||
      (s.branch || '').toLowerCase().includes(q)
    ));
  }, [search, students]);

  if (loading) return <div className="loading">⏳ Loading students...</div>;

  return (
    <div>
      <div className="page-header">
        <h1>👥 All Students</h1>
        <p>{students.length} registered students</p>
      </div>

      <div style={{ marginBottom: 20, display: 'flex', gap: 12, alignItems: 'center' }}>
        <input className="form-control" style={{ flex: 1 }} placeholder="Search by name, USN, email, branch..."
          value={search} onChange={(e) => setSearch(e.target.value)} />
        <div style={{ fontSize: 14, color: 'var(--text2)', whiteSpace: 'nowrap' }}>{filtered.length} found</div>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>USN</th>
              <th>Branch</th>
              <th>Sem</th>
              <th>CGPA</th>
              <th>Backlog</th>
              <th>Profile</th>
              <th>Preferences</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={9} style={{ textAlign: 'center', color: 'var(--text3)', padding: 32 }}>No students found</td></tr>
            ) : filtered.map((s, i) => (
              <tr key={s._id}>
                <td style={{ color: 'var(--text3)' }}>{i + 1}</td>
                <td style={{ fontWeight: 600 }}>{s.name}</td>
                <td style={{ fontFamily: 'monospace', fontSize: 13 }}>{s.usn}</td>
                <td><span className="badge" style={{ background: 'rgba(108,99,255,0.1)', color: 'var(--accent2)' }}>{s.branch || '—'}</span></td>
                <td>{s.semester || '—'}</td>
                <td style={{ fontWeight: 600 }}>{s.cgpa ?? '—'}</td>
                <td>
                  {s.backlog
                    ? <span style={{ color: 'var(--red)', fontWeight: 600 }}>Yes</span>
                    : <span style={{ color: 'var(--green)' }}>No</span>}
                </td>
                <td>
                  {s.profileComplete
                    ? <span className="badge badge-approved">Complete</span>
                    : <span className="badge badge-pending">Pending</span>}
                </td>
                <td>
                  {s.preferences?.length > 0
                    ? <div style={{ fontSize: 12 }}>
                        {s.preferences.map((p, pi) => (
                          <div key={pi} style={{ color: 'var(--text2)' }}>{pi + 1}. {p}</div>
                        ))}
                      </div>
                    : <span style={{ color: 'var(--text3)', fontSize: 13 }}>Not submitted</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminStudents;