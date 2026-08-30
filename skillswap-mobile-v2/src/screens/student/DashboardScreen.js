import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { skillService, sessionService, requestService, notificationService } from '../../services/api';
import { Card, Card2, Avatar, EmptyState, SectionHeader } from '../../components/UI';
import { colors, timeAgo, formatDate, formatTime } from '../../utils/theme';

function StatCard({ icon, value, label, color }) {
  return (
    <View style={s.statCard}>
      <Text style={s.statIcon}>{icon}</Text>
      <Text style={[s.statNum, { color }]}>{value ?? '—'}</Text>
      <Text style={s.statLabel}>{label}</Text>
    </View>
  );
}

export default function DashboardScreen({ navigation }) {
  const { user } = useAuth();
  const [stats,         setStats]         = useState({});
  const [upcomingSess,  setUpcomingSess]  = useState([]);
  const [recentNotifs,  setRecentNotifs]  = useState([]);
  const [refreshing,    setRefreshing]    = useState(false);

  const load = useCallback(async () => {
    try {
      const [skillRes, sessRes, reqRes, notifRes] = await Promise.all([
        skillService.getMy(),
        sessionService.getUpcoming(),
        requestService.getReceived(),
        notificationService.getAll(),
      ]);
      setStats({
        skills:   skillRes.data.filter((s) => s.isActive).length,
        sessions: sessRes.data.length,
        pending:  reqRes.data.filter((r) => r.status === 'PENDING').length,
        unread:   notifRes.data.filter((n) => !n.isRead).length,
      });
      setUpcomingSess(sessRes.data.slice(0, 3));
      setRecentNotifs(notifRes.data.slice(0, 5));
    } catch { /* silent — user sees stale data */ }
  }, []);

  useEffect(() => { load(); }, [load]);
  const onRefresh = async () => { setRefreshing(true); await load(); setRefreshing(false); };

  return (
    <ScrollView
      style={s.container}
      contentContainerStyle={s.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.accent} />}
    >
      {/* Greeting */}
      <View style={s.greeting}>
        <View>
          <Text style={s.greetSub}>Good to see you,</Text>
          <Text style={s.greetName}>{user?.fullName?.split(' ')[0]} 👋</Text>
        </View>
        <Avatar name={user?.fullName} size={46} />
      </View>

      {/* Stats */}
      <View style={s.statsRow}>
        <StatCard icon="⭐" value={stats.skills}   label="My Skills"  color={colors.accent} />
        <StatCard icon="📅" value={stats.sessions} label="Upcoming"   color={colors.cyan}   />
        <StatCard icon="📬" value={stats.pending}  label="Pending"    color={colors.amber}  />
        <StatCard icon="🔔" value={stats.unread}   label="Unread"     color={colors.red}    />
      </View>

      {/* Upcoming Sessions */}
      <SectionHeader title="Upcoming Sessions" action={() => navigation.navigate('Sessions')} actionLabel="See all" />
      {upcomingSess.length === 0
        ? (
          <Card>
            <Text style={s.emptyMsg}>No upcoming sessions.</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Browse')}>
              <Text style={s.link}>Browse skills to get started →</Text>
            </TouchableOpacity>
          </Card>
        )
        : upcomingSess.map((sess) => (
          <Card2 key={sess.id} style={{ marginBottom: 10 }}>
            <Text style={s.sessSkill}>{sess.skillName}</Text>
            <Text style={s.sessWith}>
              {sess.teacherId === user?.id ? `Teaching ${sess.learnerName}` : `Learning from ${sess.teacherName}`}
            </Text>
            <Text style={s.sessMeta}>📅 {formatDate(sess.sessionDate)}  🕐 {formatTime(sess.startTime)}</Text>
          </Card2>
        ))
      }

      {/* Recent Notifications */}
      <SectionHeader title="Recent Notifications" action={() => navigation.navigate('Notifications')} actionLabel="See all" />
      {recentNotifs.length === 0
        ? <Card><Text style={s.emptyMsg}>No notifications yet.</Text></Card>
        : recentNotifs.map((n) => (
          <Card key={n.id} style={{ marginBottom: 8, opacity: n.isRead ? 0.55 : 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 10 }}>
              {!n.isRead && <View style={s.dot} />}
              <View style={{ flex: 1 }}>
                <Text style={[s.notifTitle, { fontWeight: n.isRead ? '400' : '600' }]}>{n.title}</Text>
                <Text style={s.notifTime}>{timeAgo(n.createdAt)}</Text>
              </View>
            </View>
          </Card>
        ))
      }
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container:  { flex: 1, backgroundColor: colors.bg },
  content:    { padding: 20, paddingBottom: 40 },
  greeting:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  greetSub:   { fontSize: 13, color: colors.text2 },
  greetName:  { fontSize: 22, fontWeight: '800', color: colors.text, marginTop: 2 },
  statsRow:   { flexDirection: 'row', gap: 10, marginBottom: 24 },
  statCard:   { flex: 1, backgroundColor: colors.card, borderRadius: 12, padding: 12, alignItems: 'center', borderWidth: 1, borderColor: colors.border },
  statIcon:   { fontSize: 18, marginBottom: 4 },
  statNum:    { fontSize: 22, fontWeight: '800' },
  statLabel:  { fontSize: 10, color: colors.text3, marginTop: 2, textAlign: 'center' },
  emptyMsg:   { color: colors.text3, fontSize: 14, marginBottom: 8 },
  link:       { color: colors.accent, fontSize: 13, fontWeight: '500' },
  sessSkill:  { fontSize: 14, fontWeight: '700', color: colors.text, marginBottom: 4 },
  sessWith:   { fontSize: 13, color: colors.text2, marginBottom: 4 },
  sessMeta:   { fontSize: 12, color: colors.text3 },
  dot:        { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.red, marginTop: 5, flexShrink: 0 },
  notifTitle: { fontSize: 13, color: colors.text },
  notifTime:  { fontSize: 12, color: colors.text3, marginTop: 2 },
});
