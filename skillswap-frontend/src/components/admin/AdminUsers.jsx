import React, { useState, useEffect, useCallback } from 'react';
import adminService from '../../services/adminService';
import { useToast } from '../../hooks/useToast';
import { Avatar, Badge, Modal, ConfirmModal, Spinner, ErrorBox } from '../common/UI';
import { formatDate } from '../../utils/helpers';

function ResetPasswordModal({ user, onClose }) {
  const [customPw, setCustomPw] = useState('');
  const [generated, setGenerated] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const generate = () => {
    const pw = `Temp@${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    setGenerated(pw);
    setCustomPw('');
  };

  const handleReset = async () => {
    const password = customPw || generated;
    if (!password) { toast('Generate or enter a password first.', 'error'); return; }
    setLoading(true);
    try {
      await adminService.resetPassword(user.id, { newPassword: password, forceChange: !customPw });
      toast(`Password reset! Temporary password: ${password}`, 'success');
      onClose();
    } catch (err) {
      toast(err.response?.data?.message || 'Failed to reset password.', 'error');
    } finally { setLoading(false); }
  };

  return (
    <Modal title={`Reset Password — ${user.fullName}`} onClose={onClose}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <p style={{ fontSize: 14, color: 'var(--text2)' }}>Choose how to reset the user's password:</p>

        <div className="card2">
          <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Option 1 — Auto-generate</p>
          <button className="btn btn-outline btn-sm" onClick={generate}>Generate random password</button>
          {generated && (
            <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 10 }}>
              <code style={{ background: 'var(--bg)', border: '1px solid var(--border2)', padding: '6px 12px', borderRadius: 6, fontSize: 14, flex: 1 }}>{generated}</code>
              <button className="btn btn-outline btn-sm" onClick={() => { navigator.clipboard.writeText(generated); toast('Copied!'); }}>Copy</button>
            </div>
          )}
        </div>

        <div className="card2">
          <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Option 2 — Set custom password</p>
          <input className="input" type="text" placeholder="Enter new password (min. 6 chars)" value={customPw} onChange={(e) => { setCustomPw(e.target.value); setGenerated(''); }} />
        </div>

        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button className="btn btn-outline" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleReset} disabled={loading || (!customPw && !generated)}>
            {loading ? <Spinner /> : 'Reset password'}
          </button>
        </div>
      </div>
    </Modal>
  );
}

function ViewUserModal({ user, onClose }) {
  return (
    <Modal title="User Details" onClose={onClose} maxWidth={560}>
      <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 20 }}>
        <Avatar name={user.fullName} size={56} />
        <div>
          <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 18 }}>{user.fullName}</h3>
          <p style={{ color: 'var(--text2)', fontSize: 14 }}>{user.email}</p>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {[
          ['Student ID', user.studentId],
          ['Department', user.department || '—'],
          ['Year of Study', user.yearOfStudy ? `Year ${user.yearOfStudy}` : '—'],
          ['Status', user.isActive ? 'Active' : 'Suspended'],
          ['Joined', formatDate(user.createdAt)],
          ['Bio', user.bio || '—'],
        ].map(([label, value]) => (
          <div key={label} style={{ display: 'flex', gap: 12, paddingBottom: 8, borderBottom: '1px solid var(--border)' }}>
            <span style={{ fontSize: 13, color: 'var(--text3)', width: 110, flexShrink: 0 }}>{label}</span>
            <span style={{ fontSize: 14 }}>{value}</span>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 20, display: 'flex', justifyContent: 'flex-end' }}>
        <button className="btn btn-outline" onClick={onClose}>Close</button>
      </div>
    </Modal>
  );
}

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [resetUser, setResetUser] = useState(null);
  const [viewUser, setViewUser] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const toast = useToast();

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminService.getUsers({ search });
      setUsers(res.data);
    } catch { toast('Failed to load users.', 'error'); }
    finally { setLoading(false); }
  }, [search]);

  useEffect(() => {
    const t = setTimeout(fetchUsers, 300);
    return () => clearTimeout(t);
  }, [fetchUsers]);

  const handleToggleStatus = async (user) => {
    try {
      await adminService.suspendUser(user.id);
      setUsers((prev) => prev.map((u) => u.id === user.id ? { ...u, isActive: !u.isActive } : u));
      toast(`User ${user.isActive ? 'suspended' : 'activated'}.`);
    } catch { toast('Failed to update user.', 'error'); }
  };

  const handleDelete = async () => {
    try {
      await adminService.deleteUser(deleteId);
      setUsers((prev) => prev.filter((u) => u.id !== deleteId));
      toast('User deleted.');
    } catch { toast('Failed to delete user.', 'error'); }
    finally { setDeleteId(null); }
  };

  return (
    <div style={{ padding: 28 }}>
      <h1 className="page-title">Manage Users</h1>
      <p className="page-sub">{users.length} student{users.length !== 1 ? 's' : ''}</p>

      <div style={{ marginBottom: 20 }}>
        <div style={{ position: 'relative', maxWidth: 400 }}>
          <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text3)', pointerEvents: 'none' }}>🔍</span>
          <input className="input" style={{ paddingLeft: 36 }} placeholder="Search by name, email, or student ID..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      {loading
        ? <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}><Spinner size={32} /></div>
        : (
          <div style={{ overflowX: 'auto' }}>
            <table className="table">
              <thead>
                <tr>
                  {['Name', 'Student ID', 'Email', 'Department', 'Year', 'Status', 'Joined', 'Actions'].map((h) => <th key={h}>{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <Avatar name={u.fullName} />
                        <span style={{ fontWeight: 500 }}>{u.fullName}</span>
                      </div>
                    </td>
                    <td><code style={{ fontSize: 13 }}>{u.studentId}</code></td>
                    <td style={{ color: 'var(--text2)', fontSize: 13 }}>{u.email}</td>
                    <td>{u.department || '—'}</td>
                    <td>{u.yearOfStudy ? `Year ${u.yearOfStudy}` : '—'}</td>
                    <td><Badge text={u.isActive ? 'Active' : 'Suspended'} color={u.isActive ? 'green' : 'red'} /></td>
                    <td style={{ color: 'var(--text3)', fontSize: 13 }}>{formatDate(u.createdAt)}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                        <button className="btn btn-outline btn-sm" onClick={() => setViewUser(u)}>View</button>
                        <button className="btn btn-outline btn-sm" onClick={() => setResetUser(u)}>Reset PW</button>
                        <button className={`btn btn-sm ${u.isActive ? 'btn-danger' : 'btn-success'}`} onClick={() => handleToggleStatus(u)}>
                          {u.isActive ? 'Suspend' : 'Activate'}
                        </button>
                        <button className="btn btn-danger btn-sm" onClick={() => setDeleteId(u.id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {users.length === 0 && <p style={{ textAlign: 'center', padding: 40, color: 'var(--text3)' }}>No users found.</p>}
          </div>
        )
      }

      {resetUser && <ResetPasswordModal user={resetUser} onClose={() => setResetUser(null)} />}
      {viewUser && <ViewUserModal user={viewUser} onClose={() => setViewUser(null)} />}
      {deleteId && (
        <ConfirmModal
          title="Delete User"
          message="This will permanently delete the user and all their associated data (skills, requests, sessions). This cannot be undone."
          onConfirm={handleDelete}
          onClose={() => setDeleteId(null)}
          danger
          confirmLabel="Delete user"
        />
      )}
    </div>
  );
}
