import React, { useState, useEffect } from 'react';
import adminService from '../../services/adminService';
import { Spinner } from '../common/UI';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService.getStats()
      .then((res) => setStats(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const StatCard = ({ label, value, color, icon }) => (
    <div className="stat-card">
      <span style={{ fontSize: 24 }}>{icon}</span>
      <div className="stat-num" style={{ color }}>{loading ? <Spinner size={22} /> : value ?? 0}</div>
      <div className="stat-label">{label}</div>
    </div>
  );

  return (
    <div style={{ padding: 28 }}>
      <h1 className="page-title">Admin Dashboard</h1>
      <p className="page-sub">System overview and statistics</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: 16, marginBottom: 32 }}>
        <StatCard label="Total students"       value={stats?.totalStudents}        color="var(--accent)" icon="👥" />
        <StatCard label="Active skills"         value={stats?.activeSkills}          color="var(--green)"  icon="⭐" />
        <StatCard label="Completed sessions"    value={stats?.completedSessions}     color="var(--cyan)"   icon="✅" />
        <StatCard label="Pending requests"      value={stats?.pendingRequests}       color="var(--amber)"  icon="⏳" />
      </div>

      {stats?.skillsByCategory && (
        <div className="card">
          <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, marginBottom: 20 }}>Skills by Category</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {Object.entries(stats.skillsByCategory)
              .sort(([, a], [, b]) => b - a)
              .map(([cat, count]) => {
                const max = Math.max(...Object.values(stats.skillsByCategory), 1);
                return (
                  <div key={cat}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontSize: 13, color: 'var(--text2)' }}>{cat}</span>
                      <span style={{ fontSize: 13, fontWeight: 600 }}>{count}</span>
                    </div>
                    <div style={{ height: 6, background: 'var(--border2)', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ width: `${(count / max) * 100}%`, height: '100%', background: 'var(--accent)', borderRadius: 3 }} />
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {stats?.recentActivity && (
        <div className="card" style={{ marginTop: 20 }}>
          <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, marginBottom: 16 }}>Recent Activity</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {stats.recentActivity.map((a, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                <span style={{ fontSize: 16 }}>{a.icon || '📌'}</span>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 13 }}>{a.description}</p>
                </div>
                <span style={{ fontSize: 12, color: 'var(--text3)' }}>{a.time}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
