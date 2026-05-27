import React, { useState, useEffect, useCallback } from 'react';
import skillService from '../../services/skillService';
import { useToast } from '../../hooks/useToast';
import { Badge, Modal, ConfirmModal, EmptyState, Spinner, Toggle, ErrorBox } from '../common/UI';
import { proficiencyColor } from '../../utils/helpers';
import { CATEGORIES, PROFICIENCY_LEVELS } from '../../utils/constants';

function SkillForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(initial || { skillName: '', category: 'Programming', description: '', proficiency: 'INTERMEDIATE', availability: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const toast = useToast();
  const upd = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.skillName.trim() || !form.description.trim()) { setError('Skill name and description are required.'); return; }
    setLoading(true); setError('');
    try { await onSave(form); }
    catch (err) { setError(err.response?.data?.message || 'Failed to save skill.'); setLoading(false); }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <ErrorBox message={error} />
      <div>
        <label className="label">Skill name *</label>
        <input className="input" placeholder="e.g. React, Calculus, Guitar" value={form.skillName} onChange={upd('skillName')} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div>
          <label className="label">Category</label>
          <select className="select" value={form.category} onChange={upd('category')}>
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Proficiency level</label>
          <select className="select" value={form.proficiency} onChange={upd('proficiency')}>
            {PROFICIENCY_LEVELS.map((l) => <option key={l}>{l}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label className="label">Description *</label>
        <textarea className="textarea" placeholder="Describe what you can teach and your experience..." value={form.description} onChange={upd('description')} maxLength={500} />
        <p style={{ fontSize: 12, color: 'var(--text3)', marginTop: 4 }}>{form.description.length}/500</p>
      </div>
      <div>
        <label className="label">Availability</label>
        <input className="input" placeholder="e.g. Weekday evenings, Saturday mornings" value={form.availability} onChange={upd('availability')} />
      </div>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
        <button type="button" className="btn btn-outline" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? <Spinner /> : (initial ? 'Save changes' : 'Add skill')}</button>
      </div>
    </form>
  );
}

export default function MySkills() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const toast = useToast();

  const fetchSkills = useCallback(async () => {
    try {
      const res = await skillService.getMy();
      setSkills(res.data);
    } catch { toast('Failed to load skills.', 'error'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchSkills(); }, [fetchSkills]);

  const handleAdd = async (data) => {
    await skillService.create(data);
    toast('Skill added!');
    setShowModal(false);
    fetchSkills();
  };

  const handleEdit = async (data) => {
    await skillService.update(editing.id, data);
    toast('Skill updated!');
    setEditing(null); setShowModal(false);
    fetchSkills();
  };

  const handleDelete = async () => {
    await skillService.remove(deleteId);
    toast('Skill deleted.');
    setDeleteId(null);
    fetchSkills();
  };

  const handleToggle = async (skill) => {
    await skillService.update(skill.id, { ...skill, isActive: !skill.isActive });
    setSkills((prev) => prev.map((s) => s.id === skill.id ? { ...s, isActive: !s.isActive } : s));
  };

  const openEdit = (skill) => { setEditing(skill); setShowModal(true); };

  if (loading) return <div style={{ padding: 28, display: 'flex', justifyContent: 'center' }}><Spinner size={32} /></div>;

  return (
    <div style={{ padding: 28 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 className="page-title">My Skills</h1>
          <p className="page-sub" style={{ marginBottom: 0 }}>{skills.length} skill{skills.length !== 1 ? 's' : ''} listed</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setEditing(null); setShowModal(true); }}>+ Add Skill</button>
      </div>

      {skills.length === 0
        ? <EmptyState icon="💡" title="No skills added yet" subtitle="Share your expertise with fellow students" action={() => setShowModal(true)} actionLabel="Add your first skill" />
        : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 16 }}>
            {skills.map((skill) => (
              <div key={skill.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                  <div>
                    <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 8 }}>{skill.skillName}</h3>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      <Badge text={skill.category} color="blue" />
                      <Badge text={skill.proficiency} color={proficiencyColor(skill.proficiency)} />
                    </div>
                  </div>
                  <Toggle on={skill.isActive} onChange={() => handleToggle(skill)} label="Toggle active" />
                </div>
                <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.55, flex: 1 }}>{skill.description}</p>
                {skill.availability && <p style={{ fontSize: 12, color: 'var(--text3)' }}>📅 {skill.availability}</p>}
                <div style={{ height: 4, borderRadius: 2, background: 'var(--border2)', overflow: 'hidden' }}>
                  <div style={{ height: '100%', borderRadius: 2, background: 'var(--accent)', width: `${{ BEGINNER: 25, INTERMEDIATE: 50, ADVANCED: 75, EXPERT: 100 }[skill.proficiency]}%` }} />
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="btn btn-outline btn-sm" onClick={() => openEdit(skill)}>Edit</button>
                  <button className="btn btn-danger btn-sm" onClick={() => setDeleteId(skill.id)}>Delete</button>
                  {!skill.isActive && <span style={{ fontSize: 12, color: 'var(--text3)', alignSelf: 'center', marginLeft: 4 }}>Hidden from browse</span>}
                </div>
              </div>
            ))}
          </div>
        )
      }

      {showModal && (
        <Modal title={editing ? 'Edit Skill' : 'Add New Skill'} onClose={() => { setShowModal(false); setEditing(null); }}>
          <SkillForm
            initial={editing}
            onSave={editing ? handleEdit : handleAdd}
            onCancel={() => { setShowModal(false); setEditing(null); }}
          />
        </Modal>
      )}

      {deleteId && (
        <ConfirmModal
          title="Delete Skill"
          message="Are you sure you want to delete this skill? Any associated data will be affected. This cannot be undone."
          onConfirm={handleDelete}
          onClose={() => setDeleteId(null)}
          danger
          confirmLabel="Delete skill"
        />
      )}
    </div>
  );
}
