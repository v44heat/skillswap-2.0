import React, { useState } from 'react';
import { useToast } from '../../hooks/useToast';
import { Toggle } from '../common/UI';

export default function Settings() {
  const toast = useToast();
  const [prefs, setPrefs] = useState({
    emailNotifs: true,
    sessionReminders: true,
    requestNotifs: true,
    showEmail: false,
    defaultLocation: '',
  });
  const [saving, setSaving] = useState(false);

  const tog = (k) => () => setPrefs((p) => ({ ...p, [k]: !p[k] }));

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 400)); // optimistic save
    setSaving(false);
    toast('Settings saved!');
  };

  const ToggleRow = ({ label, desc, k }) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
      <div>
        <p style={{ fontSize: 14, fontWeight: 500 }}>{label}</p>
        <p style={{ fontSize: 13, color: 'var(--text3)' }}>{desc}</p>
      </div>
      <Toggle on={prefs[k]} onChange={tog(k)} label={label} />
    </div>
  );

  return (
    <div style={{ padding: 28, maxWidth: 580 }}>
      <h1 className="page-title">Settings</h1>
      <p className="page-sub">Customise your SkillSwap experience</p>

      <div className="card" style={{ marginBottom: 16 }}>
        <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, marginBottom: 4 }}>Notification Preferences</h3>
        <ToggleRow k="emailNotifs"      label="Email notifications"   desc="Receive email updates about activity on your account" />
        <ToggleRow k="sessionReminders" label="Session reminders"      desc="Get reminded 24 hours before an upcoming session" />
        <ToggleRow k="requestNotifs"    label="Request notifications"  desc="Alerts when someone requests a session with you" />
      </div>

      <div className="card" style={{ marginBottom: 16 }}>
        <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, marginBottom: 4 }}>Privacy</h3>
        <ToggleRow k="showEmail" label="Show my email" desc="Make your email visible in session details to the other party" />
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, marginBottom: 12 }}>Session Preferences</h3>
        <div>
          <label className="label">Default session location</label>
          <input className="input" placeholder="e.g. Library Room 204, Online (Zoom), Cafeteria" value={prefs.defaultLocation} onChange={(e) => setPrefs((p) => ({ ...p, defaultLocation: e.target.value }))} />
          <p style={{ fontSize: 12, color: 'var(--text3)', marginTop: 4 }}>This will be suggested when you accept session requests.</p>
        </div>
      </div>

      <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
        {saving ? 'Saving...' : 'Save settings'}
      </button>
    </div>
  );
}
