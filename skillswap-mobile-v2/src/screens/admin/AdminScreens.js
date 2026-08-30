import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, TextInput,
  TouchableOpacity, Alert, RefreshControl,
} from 'react-native';
import api, { adminService } from '../../services/api';
import { Card, Badge, Button, EmptyState } from '../../components/UI';
import { colors, statusColor, formatDate } from '../../utils/theme';
import Toast from 'react-native-toast-message';

/* ────────────────────────────────────────────
   Admin Skills
──────────────────────────────────────────── */
export function AdminSkillsScreen() {
  const [skills,     setSkills]     = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search,     setSearch]     = useState('');

  const load = useCallback(async () => {
    try { const res = await adminService.getSkills({ search }); setSkills(res.data); }
    catch { } finally { setLoading(false); }
  }, [search]);

  useEffect(() => { const t = setTimeout(load, 400); return () => clearTimeout(t); }, [load]);
  const onRefresh = async () => { setRefreshing(true); await load(); setRefreshing(false); };

  const toggle = async (sk) => {
    try {
      await adminService.toggleSkill(sk.id);
      setSkills((p) => p.map((x) => x.id === sk.id ? { ...x, isActive: !x.isActive } : x));
      Toast.show({ type: 'success', text1: `Skill ${sk.isActive ? 'deactivated' : 'activated'}.` });
    } catch { Toast.show({ type: 'error', text1: 'Failed.' }); }
  };

  const del = (sk) => {
    Alert.alert('Delete Skill', `Delete "${sk.skillName}"?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
        try {
          await adminService.deleteSkill(sk.id);
          setSkills((p) => p.filter((x) => x.id !== sk.id));
          Toast.show({ type: 'success', text1: 'Skill deleted.' });
        } catch { Toast.show({ type: 'error', text1: 'Failed to delete.' }); }
      }},
    ]);
  };

  return (
    <View style={s.container}>
      <View style={s.searchWrap}>
        <TextInput style={s.searchInput} placeholder="Search skills…" placeholderTextColor={colors.text3} value={search} onChangeText={setSearch} />
      </View>
      <FlatList
        data={skills}
        keyExtractor={(sk) => String(sk.id)}
        contentContainerStyle={s.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.accent} />}
        ListEmptyComponent={!loading ? <EmptyState icon="⭐" title="No skills found" /> : null}
        renderItem={({ item: sk }) => (
          <Card>
            <View style={s.itemTop}>
              <View style={{ flex: 1 }}>
                <Text style={s.itemTitle}>{sk.skillName}</Text>
                <Text style={s.itemSub}>{sk.ownerName}  ·  {sk.category}</Text>
              </View>
              <Badge text={sk.isActive ? 'Active' : 'Inactive'} color={sk.isActive ? colors.green : colors.amber} />
            </View>
            <View style={s.rowActions}>
              <Button title={sk.isActive ? 'Deactivate' : 'Activate'} onPress={() => toggle(sk)} variant={sk.isActive ? 'danger' : 'success'} style={s.actBtn} />
              <Button title="Delete" onPress={() => del(sk)} variant="danger" style={s.actBtn} />
            </View>
          </Card>
        )}
      />
    </View>
  );
}

/* ────────────────────────────────────────────
   Admin Requests
──────────────────────────────────────────── */
export function AdminRequestsScreen() {
  const [requests,   setRequests]   = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter,     setFilter]     = useState('');

  const STATUSES = ['', 'PENDING', 'ACCEPTED', 'REJECTED', 'CANCELLED'];

  const load = useCallback(async () => {
    try { const res = await adminService.getRequests(filter || undefined); setRequests(res.data); }
    catch { } finally { setLoading(false); }
  }, [filter]);

  useEffect(() => { load(); }, [load]);
  const onRefresh = async () => { setRefreshing(true); await load(); setRefreshing(false); };

  const cancel = (r) => {
    Alert.alert('Cancel Request', 'Cancel this pending request?', [
      { text: 'No',  style: 'cancel' },
      { text: 'Yes', style: 'destructive', onPress: async () => {
        try {
          await adminService.cancelRequest(r.id);
          setRequests((p) => p.map((x) => x.id === r.id ? { ...x, status: 'CANCELLED' } : x));
          Toast.show({ type: 'success', text1: 'Request cancelled.' });
        } catch { Toast.show({ type: 'error', text1: 'Failed.' }); }
      }},
    ]);
  };

  return (
    <View style={s.container}>
      <View style={s.chipRow}>
        {STATUSES.map((st) => (
          <TouchableOpacity key={st} style={[s.chip, filter === st && s.chipActive]} onPress={() => setFilter(st)}>
            <Text style={[s.chipTxt, filter === st && s.chipTxtActive]}>{st || 'All'}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <FlatList
        data={requests}
        keyExtractor={(r) => String(r.id)}
        contentContainerStyle={s.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.accent} />}
        ListEmptyComponent={!loading ? <EmptyState icon="📬" title="No requests found" /> : null}
        renderItem={({ item: r }) => (
          <Card>
            <View style={s.itemTop}>
              <View style={{ flex: 1 }}>
                <Text style={s.itemTitle}>{r.skillName}</Text>
                <Text style={s.itemSub}>{r.requesterName} → {r.teacherName}</Text>
                <Text style={s.itemMeta}>📅 {formatDate(r.preferredDate)}</Text>
              </View>
              <Badge text={r.status} color={statusColor(r.status)} />
            </View>
            {r.status === 'PENDING' && (
              <Button title="Cancel" onPress={() => cancel(r)} variant="danger" style={{ paddingVertical: 8 }} />
            )}
          </Card>
        )}
      />
    </View>
  );
}

/* ────────────────────────────────────────────
   Admin Sessions
──────────────────────────────────────────── */
export function AdminSessionsScreen() {
  const [sessions,   setSessions]   = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter,     setFilter]     = useState('');

  const STATUSES = ['', 'CONFIRMED', 'COMPLETED', 'CANCELLED'];

  const load = useCallback(async () => {
    try { const res = await adminService.getSessions(filter || undefined); setSessions(res.data); }
    catch { } finally { setLoading(false); }
  }, [filter]);

  useEffect(() => { load(); }, [load]);
  const onRefresh = async () => { setRefreshing(true); await load(); setRefreshing(false); };

  const cancel = (sess) => {
    Alert.alert('Cancel Session', 'Cancel this session? Both parties will be notified.', [
      { text: 'No',  style: 'cancel' },
      { text: 'Yes', style: 'destructive', onPress: async () => {
        try {
          await adminService.cancelSession(sess.id);
          setSessions((p) => p.map((x) => x.id === sess.id ? { ...x, status: 'CANCELLED' } : x));
          Toast.show({ type: 'success', text1: 'Session cancelled.' });
        } catch { Toast.show({ type: 'error', text1: 'Failed.' }); }
      }},
    ]);
  };

  return (
    <View style={s.container}>
      <View style={s.chipRow}>
        {STATUSES.map((st) => (
          <TouchableOpacity key={st} style={[s.chip, filter === st && s.chipActive]} onPress={() => setFilter(st)}>
            <Text style={[s.chipTxt, filter === st && s.chipTxtActive]}>{st || 'All'}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <FlatList
        data={sessions}
        keyExtractor={(sess) => String(sess.id)}
        contentContainerStyle={s.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.accent} />}
        ListEmptyComponent={!loading ? <EmptyState icon="📅" title="No sessions found" /> : null}
        renderItem={({ item: sess }) => (
          <Card>
            <View style={s.itemTop}>
              <View style={{ flex: 1 }}>
                <Text style={s.itemTitle}>{sess.skillName}</Text>
                <Text style={s.itemSub}>{sess.teacherName} → {sess.learnerName}</Text>
                <Text style={s.itemMeta}>📅 {formatDate(sess.sessionDate)}</Text>
              </View>
              <Badge text={sess.status} color={statusColor(sess.status)} />
            </View>
            {sess.status === 'CONFIRMED' && (
              <Button title="Cancel" onPress={() => cancel(sess)} variant="danger" style={{ paddingVertical: 8 }} />
            )}
          </Card>
        )}
      />
    </View>
  );
}

/* ────────────────────────────────────────────
   Activity Logs
──────────────────────────────────────────── */
const ACTION_ICON = {
  USER_REGISTERED: '👤', USER_LOGIN: '🔑',
  SKILL_CREATED: '⭐', FEEDBACK_SUBMITTED: '⭐',
  REQUEST_CREATED: '📬', REQUEST_ACCEPTED: '✅', REQUEST_REJECTED: '❌',
  SESSION_COMPLETED: '🏆', SESSION_CANCELLED: '🚫',
  ADMIN_RESET_PASSWORD: '🔑', ADMIN_SUSPEND_USER: '🔒',
  ADMIN_ACTIVATE_USER: '🔓', ADMIN_DELETE_USER: '🗑️',
};

export function ActivityLogsScreen() {
  const [logs,       setLogs]       = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try { const res = await adminService.getLogs(); setLogs(res.data); }
    catch { } finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);
  const onRefresh = async () => { setRefreshing(true); await load(); setRefreshing(false); };

  return (
    <FlatList
      data={logs}
      keyExtractor={(l, i) => `${l.id}-${i}`}
      style={{ backgroundColor: colors.bg }}
      contentContainerStyle={[s.list, { backgroundColor: colors.bg }]}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.accent} />}
      ListEmptyComponent={!loading ? <EmptyState icon="📋" title="No activity yet" /> : null}
      renderItem={({ item: l }) => (
        <View style={s.logItem}>
          <View style={s.logIcon}>
            <Text style={{ fontSize: 16 }}>{ACTION_ICON[l.action] || '📌'}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={s.logUser}>
              <Text style={{ color: colors.accent }}>{l.userName || 'System'}</Text>
              {'  '}
              <Text style={{ color: colors.text2, fontWeight: '400' }}>
                {(l.action || '').replace(/_/g, ' ').toLowerCase()}
              </Text>
            </Text>
            {l.details ? <Text style={s.logDetail}>{l.details}</Text> : null}
          </View>
          <Text style={s.logTime}>{formatDate(l.createdAt)}</Text>
        </View>
      )}
    />
  );
}

const s = StyleSheet.create({
  container:    { flex: 1, backgroundColor: colors.bg },
  searchWrap:   { padding: 16, paddingBottom: 8 },
  searchInput:  { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border2, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 11, color: colors.text, fontSize: 15 },
  list:         { padding: 16, paddingBottom: 40 },
  chipRow:      { flexDirection: 'row', gap: 8, paddingHorizontal: 12, paddingVertical: 10, flexWrap: 'wrap' },
  chip:         { paddingVertical: 6, paddingHorizontal: 13, borderRadius: 20, backgroundColor: colors.card2, borderWidth: 1, borderColor: colors.border2 },
  chipActive:   { backgroundColor: colors.accent, borderColor: colors.accent },
  chipTxt:      { fontSize: 12, color: colors.text2, fontWeight: '500' },
  chipTxtActive:{ color: '#fff' },
  itemTop:      { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10 },
  itemTitle:    { fontSize: 14, fontWeight: '700', color: colors.text, marginBottom: 3 },
  itemSub:      { fontSize: 13, color: colors.text2, marginBottom: 3 },
  itemMeta:     { fontSize: 12, color: colors.text3 },
  rowActions:   { flexDirection: 'row', gap: 8 },
  actBtn:       { flex: 1, paddingVertical: 8 },
  logItem:      { flexDirection: 'row', gap: 12, paddingVertical: 14, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: colors.border, alignItems: 'flex-start' },
  logIcon:      { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.card2, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  logUser:      { fontSize: 13, fontWeight: '600', color: colors.text, marginBottom: 3 },
  logDetail:    { fontSize: 12, color: colors.text3 },
  logTime:      { fontSize: 11, color: colors.text3, flexShrink: 0, marginTop: 2 },
});
