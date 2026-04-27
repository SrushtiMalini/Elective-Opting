import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { getAllElectives, addElective, updateElective, deleteElective } from '../utils/api';
import ElectiveCard from '../components/ElectiveCard';

const BRANCHES = ['CSE', 'ISE', 'ECE', 'EEE', 'ME', 'CV', 'AI/ML', 'DS'];

const defaultForm = {
  electiveName: '', code: '', faculty: '', department: '',
  totalSeats: '', difficulty: 'Medium', careerTag: '', description: '',
  eligibleBranches: BRANCHES, minCGPA: 0,
};

const AdminElectives = () => {
  const [electives, setElectives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(defaultForm);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const { data } = await getAllElectives();
    setElectives(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => { setForm(defaultForm); setEditId(null); setShowModal(true); };

  const openEdit = (e) => {
    setForm({
      electiveName: e.electiveName, code: e.code, faculty: e.faculty, department: e.department,
      totalSeats: e.totalSeats, difficulty: e.difficulty, careerTag: e.careerTag || '',
      description: e.description || '', eligibleBranches: e.eligibleBranches, minCGPA: e.minCGPA,
    });
    setEditId(e._id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this elective?')) return;
    try {
      await deleteElective(id);
      toast.success('Elective deleted');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    }
  };

  const handleSave = async () => {
    if (!form.electiveName || !form.code || !form.faculty || !form.department || !form.totalSeats) {
      return toast.error('Fill all required fields');
    }
    setSaving(true);
    try {
      if (editId) {
        await updateElective(editId, form);
        toast.success('Elective updated!');
      } else {
        await addElective(form);
        toast.success('Elective added!');
      }
      setShowModal(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const toggleBranch = (b) => {
    const branches = form.eligibleBranches.includes(b)
      ? form.eligibleBranches.filter((x) => x !== b)
      : [...form.eligibleBranches, b];
    setForm({ ...form, eligibleBranches: branches });
  };

  if (loading) return <div className="loading">⏳ Loading...</div>;

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1>📚 Manage Electives</h1>
          <p>{electives.length} electives in the system</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>+ Add Elective</button>
      </div>

      {electives.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📚</div>
          <h3>No electives yet</h3>
          <p>Add your first elective to get started</p>
          <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={openAdd}>+ Add Elective</button>
        </div>
      ) : (
        <div className="grid-3">
          {electives.map((e) => (
            <ElectiveCard key={e._id} elective={e} showActions
              onEdit={() => openEdit(e)} onDelete={() => handleDelete(e._id)} />
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>{editId ? 'Edit Elective' : 'Add New Elective'}</h2>

            {[
              { key: 'electiveName', label: 'Elective Name *', placeholder: 'e.g. Machine Learning', type: 'text' },
              { key: 'code', label: 'Code *', placeholder: 'e.g. CS601', type: 'text' },
              { key: 'faculty', label: 'Faculty *', placeholder: 'Dr. John Smith', type: 'text' },
              { key: 'department', label: 'Department *', placeholder: 'Computer Science', type: 'text' },
              { key: 'totalSeats', label: 'Total Seats *', placeholder: '60', type: 'number' },
              { key: 'careerTag', label: 'Career Tag', placeholder: 'e.g. Data Science, Cloud, Security', type: 'text' },
            ].map((f) => (
              <div className="form-group" key={f.key}>
                <label>{f.label}</label>
                <input className="form-control" type={f.type} placeholder={f.placeholder}
                  value={form[f.key]} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} />
              </div>
            ))}

            <div className="form-group">
              <label>Difficulty</label>
              <select className="form-control" value={form.difficulty}
                onChange={(e) => setForm({ ...form, difficulty: e.target.value })}>
                {['Easy', 'Medium', 'Hard'].map((d) => <option key={d}>{d}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label>Min CGPA Required</label>
              <input className="form-control" type="number" step="0.1" min="0" max="10"
                value={form.minCGPA} onChange={(e) => setForm({ ...form, minCGPA: e.target.value })} />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea className="form-control" rows={3} placeholder="Brief description..."
                value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>

            <div className="form-group">
              <label>Eligible Branches</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {BRANCHES.map((b) => (
                  <button key={b} type="button"
                    className={`btn ${form.eligibleBranches.includes(b) ? 'btn-primary' : 'btn-ghost'}`}
                    style={{ padding: '6px 14px', fontSize: 13 }}
                    onClick={() => toggleBranch(b)}>{b}</button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
              <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" style={{ flex: 2 }} onClick={handleSave} disabled={saving}>
                {saving ? 'Saving...' : editId ? 'Update' : 'Add Elective'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminElectives;