import React, { useState, useEffect, useCallback } from 'react';
import skillService from '../../services/skillService';
import requestService from '../../services/requestService';
import { useToast } from '../../hooks/useToast';
import { Badge, Modal, Spinner, EmptyState, ErrorBox } from '../common/UI';
import { Avatar } from '../common/UI';
import { proficiencyColor } from '../../utils/helpers';
import { CATEGORIES, PROFICIENCY_LEVELS } from '../../utils/constants';

function RequestModal({ skill, onClose }) {
  const [form, setForm] = useState({ preferredDate: '', preferredTime: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const toast = useToast();

  const today = new Date().toISOString().split('T')[0];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.preferredDate || !form.preferredTime) { setError('Please select a date and time.'); return; }
    if (form.preferredDate < today) { setError('Please select a future date.'); return; }
    setLoading(true); setError('');
    try {
      await requestService.create({ skillId: skill.id, ...form });
      toast('Session request sent!');
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send request.');
      setLoading(false);
    }
  };

  return (
    <Modal title="Request Session" onClose={onClose}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div className="card2">
          <p style={{ fontSize: 12, color: 'var(--text3)', marginBottom: 2 }}>Skill</p>
          <p style={{ fontWeight: 700, marginBottom: 8 }}>{skill.skillName}</p>
          <p style={{ fontSize: 12, color: 'var(--text3)', marginBottom: 2 }}>Teacher</p>
          <p style={{ fontWeight: 600 }}>{skill.ownerName} · {skill.ownerDepartment}</p>
        </div>
        <ErrorBox message={error} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            <label className="label">Preferred date *</label>
            <input className="input" type="date" min={today} value={form.preferredDate} onChange={(e) => setForm((p) => ({ ...p, preferredDate: e.target.value }))} />
          </div>
          <div>
            <label className="label">Preferred time *</label>
            <input className="input" type="time" value={form.preferredTime} onChange={(e) => setForm((p) => ({ ...p, preferredTime: e.target.value }))} />
          </div>
        </div>
        <div>
          <label className="label">Message to teacher (optional)</label>
          <textarea className="textarea" placeholder="Any specific topics or questions you'd like to cover..." value={form.message} onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))} />
        </div>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? <Spinner /> : 'Send request'}</button>
        </div>
      </form>
    </Modal>
  );
}

export default function BrowseSkills() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [proficiency, setProficiency] = useState('');
  const [requestSkill, setRequestSkill] = useState(null);

  const fetchSkills = useCallback(async () => {
    setLoading(true);
    try {
      const res = await skillService.browse({ search, category, proficiency });
      setSkills(res.data);
    } catch { /* silent */ }
    finally { setLoading(false); }
  }, [search, category, proficiency]);

  useEffect(() => {
    const timer = setTimeout(fetchSkills, 300);
    return () => clearTimeout(timer);
  }, [fetchSkills]);

  return (
    <div style={{ padding: 28 }}>
      <h1 className="page-title">Browse Skills</h1>
      <p className="page-sub">Discover skills offered by your fellow students</p>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        <div className="search-bar" style={{ flex: 2, minWidth: 200 }}>
          <span className="search-icon" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text3)', pointerEvents: 'none' }}>🔍</span>
          <input className="input" style={{ paddingLeft: 36 }} placeholder="Search skills..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <select className="select" style={{ width: 180 }} value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All categories</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select className="select" style={{ width: 180 }} value={proficiency} onChange={(e) => setProficiency(e.target.value)}>
          <option value="">All levels</option>
          {PROFICIENCY_LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
        </select>
      </div>

      {loading
        ? <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}><Spinner size={32} /></div>
        : skills.length === 0
        ? <EmptyState icon="🔍" title="No skills found" subtitle="Try adjusting your search or filters." />
        : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 16 }}>
            {skills.map((skill) => (
              <div key={skill.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div>
                  <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 8 }}>{skill.skillName}</h3>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    <Badge text={skill.category} color="blue" />
                    <Badge text={skill.proficiency} color={proficiencyColor(skill.proficiency)} />
                  </div>
                </div>
                <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.55, flex: 1 }}>
                  {skill.description.length > 120 ? skill.description.slice(0, 120) + '...' : skill.description}
                </p>
                {skill.availability && <p style={{ fontSize: 12, color: 'var(--text3)' }}>📅 {skill.availability}</p>}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingTop: 10, borderTop: '1px solid var(--border)' }}>
                  <Avatar name={skill.ownerName} size={34} />
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 13, fontWeight: 600 }}>{skill.ownerName}</p>
                    <p style={{ fontSize: 12, color: 'var(--text3)' }}>{skill.ownerDepartment}</p>
                  </div>
                  <button className="btn btn-primary btn-sm" onClick={() => setRequestSkill(skill)}>Request</button>
                </div>
              </div>
            ))}
          </div>
        )
      }

      {requestSkill && <RequestModal skill={requestSkill} onClose={() => setRequestSkill(null)} />}
    </div>
  );
}
