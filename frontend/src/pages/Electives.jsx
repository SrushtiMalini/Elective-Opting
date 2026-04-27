import React, { useEffect, useState } from 'react';
import { getAllElectives } from '../utils/api';
import ElectiveCard from '../components/ElectiveCard';

const Electives = ({ setActivePage }) => {
  const [electives, setElectives] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [diffFilter, setDiffFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllElectives().then(({ data }) => {
      setElectives(data);
      setFiltered(data);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    let list = electives;
    if (search) list = list.filter((e) =>
      e.electiveName.toLowerCase().includes(search.toLowerCase()) ||
      e.faculty.toLowerCase().includes(search.toLowerCase()) ||
      e.careerTag?.toLowerCase().includes(search.toLowerCase())
    );
    if (diffFilter !== 'All') list = list.filter((e) => e.difficulty === diffFilter);
    setFiltered(list);
  }, [search, diffFilter, electives]);

  if (loading) return <div className="loading">⏳ Loading electives...</div>;

  return (
    <div>
      <div className="page-header">
        <h1>📚 Browse Electives</h1>
        <p>{electives.length} electives available this semester</p>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        <input className="form-control" style={{ flex: 1, minWidth: 200 }}
          placeholder="Search by name, faculty, or tag..."
          value={search} onChange={(e) => setSearch(e.target.value)} />
        {['All', 'Easy', 'Medium', 'Hard'].map((d) => (
          <button key={d} className={`btn ${diffFilter === d ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setDiffFilter(d)}>
            {d}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🔍</div>
          <h3>No electives found</h3>
          <p>Try a different search or filter</p>
        </div>
      ) : (
        <div className="grid-3">
          {filtered.map((e) => (
            <ElectiveCard key={e._id} elective={e} />
          ))}
        </div>
      )}

      <div style={{ marginTop: 32, textAlign: 'center' }}>
        <button className="btn btn-primary" style={{ padding: '14px 32px' }}
          onClick={() => setActivePage('preferences')}>
          ⭐ Go Set Your Preferences →
        </button>
      </div>
    </div>
  );
};

export default Electives;