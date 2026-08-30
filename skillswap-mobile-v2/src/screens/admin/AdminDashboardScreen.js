import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { adminService } from '../../services/api';
import { Card } from '../../components/UI';
import { colors } from '../../utils/theme';

function StatCard({ icon, value, label, color }) {
  return (
    <View style={s.statCard}>
      <Text style={s.statIcon}>{icon}</Text>
      <Text style={[s.statNum, { color }]}>{value ?? '—'}</Text>
      <Text style={s.statLabel}>{label}</Text>
    </View>
  );
}

export default function AdminDashboardScreen() {
  const [stats,      setStats]      = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const res = await adminService.getStats();
      setStats(res.data);
    } catch { /* silent */ }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);
  const onRefresh = async () => { setRefreshing(true); await load(); setRefreshing(false); };

  const maxCat = stats?.skillsByCategory
    ? Math.max(...Object.values(stats.skillsByCategory), 1)
    : 1;

  return (
    <ScrollView
      style={s.container}
      contentContainerStyle={s.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.accent} />}
    >
      <Text style={s.pageTitle}>Admin Dashboard</Text>
      <Text style={s.pageSub}>System overview and statistics</Text>

      <View style={s.grid}>
        <StatCard icon="👥" value={stats?.totalStudents}     label="Students"   color={colors.accent} />
        <StatCard icon="⭐" value={stats?.activeSkills}      label="Skills"     color={colors.green}  />
        <StatCard icon="✅" value={stats?.completedSessions} label="Completed"  color={colors.cyan}   />
        <StatCard icon="⏳" value={stats?.pendingRequests}   label="Pending"    color={colors.amber}  />
      </View>

      {stats?.skillsByCategory && Object.keys(stats.skillsByCategory).length > 0 && (
        <Card style={{ marginTop: 8 }}>
          <Text style={s.sectionTitle}>Skills by Category</Text>
          {Object.entries(stats.skillsByCategory)
            .sort(([, a], [, b]) => b - a)
            .map(([cat, count]) => (
              <View key={cat} style={s.catRow}>
                <View style={s.catLabelRow}>
                  <Text style={s.catLabel}>{cat}</Text>
                  <Text style={s.catCount}>{count}</Text>
                </View>
                <View style={s.barBg}>
                  <View style={[s.barFill, { width: `${(count / maxCat) * 100}%` }]} />
                </View>
              </View>
            ))
          }
        </Card>
      )}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container:    { flex: 1, backgroundColor: colors.bg },
  content:      { padding: 20, paddingBottom: 40 },
  pageTitle:    { fontSize: 24, fontWeight: '800', color: colors.text, marginBottom: 4 },
  pageSub:      { fontSize: 14, color: colors.text2, marginBottom: 20 },
  grid:         { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 },
  statCard:     { width: '47%', backgroundColor: colors.card, borderRadius: 14, padding: 16, alignItems: 'center', borderWidth: 1, borderColor: colors.border },
  statIcon:     { fontSize: 24, marginBottom: 6 },
  statNum:      { fontSize: 28, fontWeight: '800' },
  statLabel:    { fontSize: 12, color: colors.text3, marginTop: 4 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: colors.text, marginBottom: 16 },
  catRow:       { marginBottom: 12 },
  catLabelRow:  { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  catLabel:     { fontSize: 13, color: colors.text2 },
  catCount:     { fontSize: 13, fontWeight: '600', color: colors.text },
  barBg:        { height: 6, backgroundColor: colors.border2, borderRadius: 3, overflow: 'hidden' },
  barFill:      { height: '100%', backgroundColor: colors.accent, borderRadius: 3 },
});
