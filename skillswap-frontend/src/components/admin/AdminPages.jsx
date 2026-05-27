import React, { useState, useEffect, useCallback } from 'react';
import adminService from '../../services/adminService';
import { useToast } from '../../hooks/useToast';
import { Badge, ConfirmModal, Spinner, EmptyState } from '../common/UI';
import { formatDate } from '../../utils/helpers';
import { CATEGORIES, PROFICIENCY_LEVELS } from '../../utils/constants';

/* ─── Admin Skills ─── */
export function AdminSkills() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('');
  const [deleteId, setDeleteId] = useState(null);
  const toast = useToast();

  const fetchSkills = useCallback(async () => {
    setLoading(true);
    try { const res = await adminService.getSkills({ search, category: catFilter }); setSkills(res.data); }
    catch { toast('Failed to load skills.', 'error'); }
    finally { setLoading(false); }
  }, [search, catFilter]);

  useEffect(() => { const t = setTimeout(fetchSkills, 300); return () => clearTimeout(t); }, [fetchSkills]);

  const handleToggle = async (id) => {
    try {
      await adminService.toggleSkill(id);
      setSkills((prev) => prev.map((s) => s.id === id ? { ...s, isActive: !s.isActive } : s));
      toast('Skill status updated.');
    } catch { toast('Failed to update skill.', 'error'); }
  };

  const handleDelete = async () => {
    try {
      await adminService.deleteSkill(deleteId);
      setSkills((prev) => prev.filter((s) => s.id !== deleteId));
      toast('Skill deleted.');
    } catch { toast('Failed to delete skill.', 'error'); }
    finally { setDeleteId(null); }
  };

  return (
    <div style={{ padding: 28 }}>
      <h1 className="page-title">Manage Skills</h1>
      <p className="page-sub">{skills.length} total skills</p>
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 2, minWidth: 200 }}>
          <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text3)', pointerEvents: 'none' }}>🔍</span>
          <input className="input" style={{ paddingLeft: 36 }} placeholder="Search skills..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <select className="select" style={{ width: 180 }} value={catFilter} onChange={(e) => setCatFilter(e.target.value)}>
          <option value="">All categories</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      {loading
        ? <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}><Spinner size={32} /></div>
        : (
          <div style={{ overflowX: 'auto' }}>
            <table className="table">
              <thead><tr>{['Skill', 'Category', 'Offered By', 'Proficiency', 'Status', 'Created', 'Actions'].map((h) => <th key={h}>{h}</th>)}</tr></thead>
              <tbody>
                {skills.map((s) => (
                  <tr key={s.id}>
                    <td style={{ fontWeight: 600 }}>{s.skillName}</td>
                    <td><Badge text={s.category} color="blue" /></td>
                    <td>{s.ownerName}</td>
                    <td><Badge text={s.proficiency} color="purple" /></td>
                    <td><Badge text={s.isActive ? 'Active' : 'Inactive'} color={s.isActive ? 'green' : 'amber'} /></td>
                    <td style={{ color: 'var(--text3)', fontSize: 13 }}>{formatDate(s.createdAt)}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button className="btn btn-outline btn-sm" onClick={() => handleToggle(s.id)}>{s.isActive ? 'Deactivate' : 'Activate'}</button>
                        <button className="btn btn-danger btn-sm" onClick={() => setDeleteId(s.id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {skills.length === 0 && <p style={{ textAlign: 'center', padding: 40, color: 'var(--text3)' }}>No skills found.</p>}
          </div>
        )
      }
      {deleteId && <ConfirmModal title="Delete Skill" message="Delete this skill and all associated requests? This cannot be undone." onConfirm={handleDelete} onClose={() => setDeleteId(null)} danger confirmLabel="Delete skill" />}
    </div>
  );
}

/* ─── Admin Requests ─── */
export function AdminRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [cancelId, setCancelId] = useState(null);
  const toast = useToast();

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    try { const res = await adminService.getRequests({ status: statusFilter }); setRequests(res.data); }
    catch { toast('Failed to load requests.', 'error'); }
    finally { setLoading(false); }
  }, [statusFilter]);

  useEffect(() => { fetchRequests(); }, [fetchRequests]);

  const handleCancel = async () => {
    try {
      await adminService.cancelRequest(cancelId);
      setRequests((prev) => prev.map((r) => r.id === cancelId ? { ...r, status: 'CANCELLED' } : r));
      toast('Request cancelled.');
    } catch { toast('Failed to cancel.', 'error'); }
    finally { setCancelId(null); }
  };

  const BADGE_COLOR = { PENDING: 'amber', ACCEPTED: 'green', REJECTED: 'red', CANCELLED: 'red' };

  return (
    <div style={{ padding: 28 }}>
      <h1 className="page-title">Manage Requests</h1>
      <p className="page-sub">{requests.length} total requests</p>
      <div style={{ marginBottom: 20 }}>
        <select className="select" style={{ width: 200 }} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All statuses</option>
          {['PENDING', 'ACCEPTED', 'REJECTED', 'CANCELLED'].map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      {loading
        ? <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}><Spinner size={32} /></div>
        : (
          <div style={{ overflowX: 'auto' }}>
            <table className="table">
              <thead><tr>{['Requester', 'Skill', 'Teacher', 'Preferred Date', 'Status', 'Created', 'Actions'].map((h) => <th key={h}>{h}</th>)}</tr></thead>
              <tbody>
                {requests.map((r) => (
                  <tr key={r.id}>
                    <td>{r.requesterName}</td>
                    <td style={{ fontWeight: 600 }}>{r.skillName}</td>
                    <td>{r.teacherName}</td>
                    <td style={{ fontSize: 13 }}>{formatDate(r.preferredDate)}</td>
                    <td><Badge text={r.status} color={BADGE_COLOR[r.status] || 'blue'} /></td>
                    <td style={{ color: 'var(--text3)', fontSize: 13 }}>{formatDate(r.createdAt)}</td>
                    <td>{r.status === 'PENDING' && <button className="btn btn-danger btn-sm" onClick={() => setCancelId(r.id)}>Cancel</button>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {requests.length === 0 && <p style={{ textAlign: 'center', padding: 40, color: 'var(--text3)' }}>No requests found.</p>}
          </div>
        )
      }
      {cancelId && <ConfirmModal title="Cancel Request" message="Cancel this pending request? Both parties will be notified." onConfirm={handleCancel} onClose={() => setCancelId(null)} danger confirmLabel="Cancel request" />}
    </div>
  );
}

/* ─── Admin Sessions ─── */
export function AdminSessions() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [cancelId, setCancelId] = useState(null);
  const toast = useToast();

  const fetchSessions = useCallback(async () => {
    setLoading(true);
    try { const res = await adminService.getSessions({ status: statusFilter }); setSessions(res.data); }
    catch { toast('Failed to load sessions.', 'error'); }
    finally { setLoading(false); }
  }, [statusFilter]);

  useEffect(() => { fetchSessions(); }, [fetchSessions]);

  const handleCancel = async () => {
    try {
      await adminService.cancelSession(cancelId);
      setSessions((prev) => prev.map((s) => s.id === cancelId ? { ...s, status: 'CANCELLED' } : s));
      toast('Session cancelled.');
    } catch { toast('Failed to cancel.', 'error'); }
    finally { setCancelId(null); }
  };

  const BADGE_COLOR = { CONFIRMED: 'green', COMPLETED: 'blue', CANCELLED: 'red' };

  return (
    <div style={{ padding: 28 }}>
      <h1 className="page-title">Manage Sessions</h1>
      <p className="page-sub">{sessions.length} total sessions</p>
      <div style={{ marginBottom: 20 }}>
        <select className="select" style={{ width: 200 }} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All statuses</option>
          {['CONFIRMED', 'COMPLETED', 'CANCELLED'].map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      {loading
        ? <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}><Spinner size={32} /></div>
        : (
          <div style={{ overflowX: 'auto' }}>
            <table className="table">
              <thead><tr>{['Skill', 'Teacher', 'Learner', 'Date', 'Status', 'Created', 'Actions'].map((h) => <th key={h}>{h}</th>)}</tr></thead>
              <tbody>
                {sessions.map((s) => (
                  <tr key={s.id}>
                    <td style={{ fontWeight: 600 }}>{s.skillName}</td>
                    <td>{s.teacherName}</td>
                    <td>{s.learnerName}</td>
                    <td style={{ fontSize: 13 }}>{formatDate(s.sessionDate)}</td>
                    <td><Badge text={s.status} color={BADGE_COLOR[s.status] || 'blue'} /></td>
                    <td style={{ color: 'var(--text3)', fontSize: 13 }}>{formatDate(s.createdAt)}</td>
                    <td>{s.status === 'CONFIRMED' && <button className="btn btn-danger btn-sm" onClick={() => setCancelId(s.id)}>Cancel</button>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {sessions.length === 0 && <p style={{ textAlign: 'center', padding: 40, color: 'var(--text3)' }}>No sessions found.</p>}
          </div>
        )
      }
      {cancelId && <ConfirmModal title="Cancel Session" message="Cancel this session? Both the teacher and learner will be notified." onConfirm={handleCancel} onClose={() => setCancelId(null)} danger confirmLabel="Cancel session" />}
    </div>
  );
}

/* ─── Activity Logs ─── */
export function ActivityLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const ACTION_ICON = {
    USER_REGISTERED: '👤', SKILL_CREATED: '⭐', SKILL_DELETED: '🗑️',
    REQUEST_CREATED: '📬', REQUEST_ACCEPTED: '✅', REQUEST_REJECTED: '❌',
    SESSION_COMPLETED: '🏆', SESSION_CANCELLED: '🚫',
    ADMIN_RESET_PASSWORD: '🔑', ADMIN_SUSPEND_USER: '🔒',
  };

  useEffect(() => {
    adminService.getLogs()
      .then((res) => setLogs(res.data))
      .catch(() => toast('Failed to load logs.', 'error'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ padding: 28 }}>
      <h1 className="page-title">Activity Logs</h1>
      <p className="page-sub">Recent system activity</p>
      {loading
        ? <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}><Spinner size={32} /></div>
        : logs.length === 0
        ? <EmptyState icon="📋" title="No activity yet" subtitle="System events will appear here." />
        : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {logs.map((log, i) => (
              <div key={log.id || i} style={{ display: 'flex', gap: 16, padding: '14px 0', borderBottom: '1px solid var(--border)', alignItems: 'flex-start' }}>
                <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'var(--card2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>
                  {ACTION_ICON[log.action] || '📌'}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 14, fontWeight: 500 }}>
                    <span style={{ color: 'var(--accent)' }}>{log.userName || 'System'}</span>
                    {' '}<span style={{ color: 'var(--text2)', fontWeight: 400 }}>· {log.action?.replace(/_/g, ' ').toLowerCase()}</span>
                  </p>
                  {log.details && <p style={{ fontSize: 13, color: 'var(--text3)', marginTop: 2 }}>{log.details}</p>}
                </div>
                <span style={{ fontSize: 12, color: 'var(--text3)', flexShrink: 0 }}>{formatDate(log.createdAt)}</span>
              </div>
            ))}
          </div>
        )
      }
    </div>
  );
}
