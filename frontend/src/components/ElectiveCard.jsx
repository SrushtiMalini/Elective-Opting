import React from 'react';

const ElectiveCard = ({ elective, selected, rank, onClick, showActions, onEdit, onDelete }) => {
  const fillPercent = Math.round(((elective.totalSeats - elective.availableSeats) / elective.totalSeats) * 100);

  return (
    <div className={`elective-card ${selected ? 'selected' : ''}`} onClick={onClick}>
      {rank && <div className="pref-rank">{rank}</div>}

      <div className="card-top">
        <div>
          <div style={{ fontSize: 11, color: 'var(--text3)', fontWeight: 600, marginBottom: 4 }}>
            {elective.code}
          </div>
          <h3>{elective.electiveName}</h3>
          <p className="faculty">👤 {elective.faculty}</p>
          <p style={{ fontSize: 12, color: 'var(--text3)', marginTop: 4 }}>🏛️ {elective.department}</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-end' }}>
          <span className={`badge badge-${elective.difficulty?.toLowerCase()}`}>
            {elective.difficulty}
          </span>
        </div>
      </div>

      {elective.careerTag && (
        <div style={{ marginBottom: 12 }}>
          <span className="badge" style={{ background: 'rgba(56,189,248,0.1)', color: 'var(--accent3)', border: '1px solid rgba(56,189,248,0.2)' }}>
            🚀 {elective.careerTag}
          </span>
        </div>
      )}

      {elective.description && (
        <p style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 12, lineHeight: 1.5 }}>
          {elective.description}
        </p>
      )}

      <div className="seats">
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Seats: {elective.availableSeats} / {elective.totalSeats}</span>
          <span>{fillPercent}% filled</span>
        </div>
        <div className="seats-bar">
          <div className="seats-bar-fill" style={{ width: `${fillPercent}%` }} />
        </div>
      </div>

      {elective.minCGPA > 0 && (
        <div style={{ marginTop: 10, fontSize: 12, color: 'var(--yellow)' }}>
          ⚡ Min CGPA: {elective.minCGPA}
        </div>
      )}

      {showActions && (
        <div style={{ display: 'flex', gap: 8, marginTop: 16 }} onClick={(e) => e.stopPropagation()}>
          <button className="btn btn-ghost" style={{ flex: 1, padding: '8px' }} onClick={onEdit}>
            ✏️ Edit
          </button>
          <button className="btn btn-danger" style={{ flex: 1, padding: '8px' }} onClick={onDelete}>
            🗑️ Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default ElectiveCard;