import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { Spinner, ErrorBox } from '../common/UI';
import { DEPARTMENTS, YEARS_OF_STUDY } from '../../utils/constants';

export default function Register() {
  const [form, setForm] = useState({
    fullName: '', studentId: '', email: '',
    department: '', yearOfStudy: 1,
    password: '', confirmPassword: '', bio: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { register } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const upd = (key) => (e) => setForm((p) => ({ ...p, [key]: e.target.value }));

  const validate = () => {
    if (!form.fullName || !form.studentId || !form.email || !form.password) return 'Please fill in all required fields.';
    if (!/\S+@\S+\.\S+/.test(form.email)) return 'Please enter a valid email address.';
    if (form.password.length < 6) return 'Password must be at least 6 characters.';
    if (form.password !== form.confirmPassword) return 'Passwords do not match.';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) { setError(err); return; }
    setLoading(true);
    setError('');
    try {
      await register(form);
      toast('Account created! Welcome to SkillSwap!', 'success');
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', background: 'var(--bg)' }}>
      <div style={{ width: '100%', maxWidth: 500 }}>

        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 20, color: 'var(--text2)', fontSize: 14 }}>
            ← Back to home
          </Link>
          <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: 26, fontWeight: 800, marginBottom: 6 }}>Join SkillSwap</h1>
          <p style={{ color: 'var(--text2)', fontSize: 14 }}>Create your free student account</p>
        </div>

        <form className="card" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <ErrorBox message={error} />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label className="label">Full Name *</label>
              <input className="input" placeholder="Your full name" value={form.fullName} onChange={upd('fullName')} />
            </div>
            <div>
              <label className="label">Student ID *</label>
              <input className="input" placeholder="e.g. STU001" value={form.studentId} onChange={upd('studentId')} />
            </div>
          </div>

          <div>
            <label className="label">Email *</label>
            <input className="input" type="email" placeholder="you@university.edu" value={form.email} onChange={upd('email')} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label className="label">Department</label>
              <select className="select" value={form.department} onChange={upd('department')}>
                <option value="">Select department...</option>
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

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label className="label">Password *</label>
              <input className="input" type="password" placeholder="Min. 6 characters" value={form.password} onChange={upd('password')} autoComplete="new-password" />
            </div>
            <div>
              <label className="label">Confirm Password *</label>
              <input className="input" type="password" placeholder="Repeat password" value={form.confirmPassword} onChange={upd('confirmPassword')} autoComplete="new-password" />
            </div>
          </div>

          <div>
            <label className="label">Bio (optional)</label>
            <textarea className="textarea" placeholder="Tell other students a bit about yourself..." value={form.bio} onChange={upd('bio')} style={{ minHeight: 70 }} />
          </div>

          <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: 12 }} type="submit" disabled={loading}>
            {loading ? <Spinner /> : 'Create account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 16, fontSize: 14, color: 'var(--text2)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--accent)', fontWeight: 500 }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}
