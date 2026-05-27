import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import userService from '../../services/userService';
import { Spinner, ErrorBox, Badge } from '../common/UI';
import { DEPARTMENTS, YEARS_OF_STUDY } from '../../utils/constants';
import { formatDate } from '../../utils/helpers';

export default function MyProfile() {
  const { user, setUser } = useAuth();
  const toast = useToast();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ fullName: user.fullName, department: user.department || '', yearOfStudy: user.yearOfStudy || 1, bio: user.bio || '' });
  const [saving, setSaving] = useState(false);
  const [profileError, setProfileError] = useState('');

  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [pwLoading, setPwLoading] = useState(false);
  const [pwError, setPwError] = useState('');

  const upd = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));
  const updPw = (k) => (e) => setPwForm((p) => ({ ...p, [k]: e.target.value }));

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!form.fullName.trim()) { setProfileError('Full name is required.'); return; }
    setSaving(true); setProfileError('');
    try {
      const res = await userService.updateProfile(form);
      setUser(res.data);
      toast('Profile updated!');
      setEditing(false);
    } catch (err) {
      setProfileError(err.response?.data?.message || 'Failed to update profile.');
    } finally { setSaving(false); }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!pwForm.currentPassword) { setPwError('Enter your current password.'); return; }
    if (pwForm.newPassword.length < 6) { setPwError('New password must be at least 6 characters.'); return; }
    if (pwForm.newPassword !== pwForm.confirmPassword) { setPwError('New passwords do not match.'); return; }
    setPwLoading(true); setPwError('');
    try {
      await userService.changePassword(pwForm);
      toast('Password changed successfully!');
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setPwError(err.response?.data?.message || 'Failed to change password.');
    } finally { setPwLoading(false); }
  };

  const initials = user.fullName.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div style={{ padding: 28, maxWidth: 660 }}>
      <h1 className="page-title">My Profile</h1>
      <p className="page-sub">Manage your account information</p>

      {/* Profile card */}
      <div className="card" style={{ marginBottom: 20 }}>
        {/* Avatar + name row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, paddingBottom: 20, marginBottom: 20, borderBottom: '1px solid var(--border)' }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--accent-glow)', border: '2px solid var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 700, color: 'var(--accent)', flexShrink: 0 }}>
            {initials}
          </div>
          <div>
            <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 20, fontWeight: 700, marginBottom: 4 }}>{user.fullName}</h2>
            <p style={{ color: 'var(--text2)', fontSize: 14, marginBottom: 6 }}>{user.email}</p>
            <Badge text={user.role} color="blue" />
          </div>
        </div>

        {!editing ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              ['Student ID', user.studentId],
              ['Email', user.email],
              ['Department', user.department || '—'],
              ['Year of Study', user.yearOfStudy ? `Year ${user.yearOfStudy}` : '—'],
              ['Member since', formatDate(user.createdAt)],
              ['Bio', user.bio || '—'],
            ].map(([label, value]) => (
              <div key={label} style={{ display: 'flex', gap: 12 }}>
                <span style={{ fontSize: 13, color: 'var(--text3)', width: 120, flexShrink: 0 }}>{label}</span>
                <span style={{ fontSize: 14, color: 'var(--text)' }}>{value}</span>
              </div>
            ))}
            <button className="btn btn-primary" style={{ alignSelf: 'flex-start', marginTop: 8 }} onClick={() => setEditing(true)}>
              Edit Profile
            </button>
          </div>
        ) : (
          <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <ErrorBox message={profileError} />
            <div>
              <label className="label">Full Name *</label>
              <input className="input" value={form.fullName} onChange={upd('fullName')} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label className="label">Department</label>
                <select className="select" value={form.department} onChange={upd('department')}>
                  <option value="">Select...</option>
                  {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Year of Study</label>
                <select className="select" value={form.yearOfStudy} onChange={upd('yearOfStudy')}>
                  {YEARS_OF_STUDY.map((y) => <option key={y.value} value={y.value}>{y.label}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="label">Bio</label>
              <textarea className="textarea" value={form.bio} onChange={upd('bio')} placeholder="Tell others about yourself..." />
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? <Spinner /> : 'Save changes'}</button>
              <button type="button" className="btn btn-outline" onClick={() => { setEditing(false); setProfileError(''); }}>Cancel</button>
            </div>
          </form>
        )}
      </div>

      {/* Change password */}
      <div className="card">
        <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, marginBottom: 16 }}>Change Password</h3>
        <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <ErrorBox message={pwError} />
          <div>
            <label className="label">Current password</label>
            <input className="input" type="password" value={pwForm.currentPassword} onChange={updPw('currentPassword')} autoComplete="current-password" />
          </div>
          <div>
            <label className="label">New password</label>
            <input className="input" type="password" placeholder="Min. 6 characters" value={pwForm.newPassword} onChange={updPw('newPassword')} autoComplete="new-password" />
          </div>
          <div>
            <label className="label">Confirm new password</label>
            <input className="input" type="password" value={pwForm.confirmPassword} onChange={updPw('confirmPassword')} autoComplete="new-password" />
          </div>
          <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start' }} disabled={pwLoading}>
            {pwLoading ? <Spinner /> : 'Update password'}
          </button>
        </form>
      </div>
    </div>
  );
}
