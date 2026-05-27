import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useNotifications } from '../../hooks/useNotifications';
import skillService from '../../services/skillService';
import sessionService from '../../services/sessionService';
import requestService from '../../services/requestService';
import { Spinner, EmptyState } from '../common/UI';
import { timeAgo, formatDate, formatTime } from '../../utils/helpers';

function StatCard({ label, value, color, icon }) {
  return (
    <div className="stat-card">
      <span style={{ fontSize: 22 }}>{icon}</span>
      <div className="stat-num" style={{ color }}>{value ?? <Spinner size={20} />}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

export default function DashboardHome() {
  const { user } = useAuth();
  const { notifications } = useNotifications();
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      skillService.getMy(),
      sessionService.getUpcoming(),
      requestService.getReceived(),
    ]).then(([skillsRes, sessionsRes, requestsRes]) => {
      setStats({
        skillsOffered: skillsRes.data.filter((s) => s.isActive).length,
        upcoming: sessionsRes.data.length,
        pendingReceived: requestsRes.data.filter((r) => r.status === 'PENDING').length,
      });
      setUpcomingSessions(sessionsRes.data.slice(0, 3));
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const recentNotifs = notifications.slice(0, 5);

  return (
    <div style={{ padding: 28, maxWidth: 1100 }}>
      <h1 className="page-title">Good to see you, {user?.fullName?.split(' ')[0]}! 👋</h1>
      <p className="page-sub">Here's what's happening on your account today.</p>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: 16, marginBottom: 28 }}>
        <StatCard label="Skills I offer"     value={stats?.skillsOffered}     color="var(--accent)" icon="⭐" />
        <StatCard label="Upcoming sessions"  value={stats?.upcoming}          color="var(--cyan)"   icon="📅" />
        <StatCard label="Pending requests"   value={stats?.pendingReceived}   color="var(--amber)"  icon="📬" />
        <StatCard label="Unread notifications" value={notifications.filter((n) => !n.isRead).length} color="var(--red)" icon="🔔" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

        {/* Recent Notifications */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 15 }}>Recent Notifications</h3>
            <button className="btn btn-outline btn-sm" onClick={() => navigate('/dashboard/notifications')}>View all</button>
          </div>
          {recentNotifs.length === 0
            ? <p style={{ color: 'var(--text3)', fontSize: 14 }}>No notifications yet.</p>
            : recentNotifs.map((n) => (
              <div key={n.id} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 12 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: n.isRead ? 'transparent' : 'var(--red)', marginTop: 6, flexShrink: 0 }} />
                <div>
                  <p style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.4, fontWeight: n.isRead ? 400 : 500 }}>{n.title}</p>
                  <p style={{ fontSize: 12, color: 'var(--text3)' }}>{timeAgo(n.createdAt)}</p>
                </div>
              </div>
            ))
          }
        </div>

        {/* Upcoming Sessions */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 15 }}>Upcoming Sessions</h3>
            <button className="btn btn-outline btn-sm" onClick={() => navigate('/dashboard/sessions')}>View all</button>
          </div>
          {loading
            ? <div style={{ display: 'flex', justifyContent: 'center', padding: 20 }}><Spinner /></div>
            : upcomingSessions.length === 0
            ? (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <p style={{ color: 'var(--text3)', fontSize: 14, marginBottom: 12 }}>No upcoming sessions</p>
                <button className="btn btn-primary btn-sm" onClick={() => navigate('/dashboard/skills/browse')}>Browse skills</button>
              </div>
            )
            : upcomingSessions.map((s) => (
              <div key={s.id} className="card2" style={{ marginBottom: 10 }}>
                <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>{s.skillName}</p>
                <p style={{ fontSize: 12, color: 'var(--text2)', marginBottom: 2 }}>
                  {s.teacherId === user.id ? `Teaching ${s.learnerName}` : `Learning from ${s.teacherName}`}
                </p>
                <p style={{ fontSize: 12, color: 'var(--text3)' }}>{formatDate(s.sessionDate)} at {formatTime(s.startTime)}</p>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
}
