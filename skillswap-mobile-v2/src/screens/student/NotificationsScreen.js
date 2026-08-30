import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  TouchableOpacity, RefreshControl,
} from 'react-native';
import { notificationService } from '../../services/api';
import { Button, EmptyState } from '../../components/UI';
import { colors, timeAgo } from '../../utils/theme';
import Toast from 'react-native-toast-message';

const TYPE_ICON = {
  REQUEST: '📬', ACCEPTED: '✅', REJECTED: '❌',
  FEEDBACK: '⭐', ADMIN: '🔧', INFO: '🔔',
};

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [refreshing,    setRefreshing]    = useState(false);

  const load = useCallback(async () => {
    try {
      const res = await notificationService.getAll();
      setNotifications(res.data);
    } catch { /* silent */ }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);
  const onRefresh = async () => { setRefreshing(true); await load(); setRefreshing(false); };

  const markRead = async (id) => {
    try {
      await notificationService.markRead(id);
      setNotifications((p) => p.map((n) => n.id === id ? { ...n, isRead: true } : n));
    } catch { /* silent */ }
  };

  const markAllRead = async () => {
    try {
      await notificationService.markAllRead();
      setNotifications((p) => p.map((n) => ({ ...n, isRead: true })));
      Toast.show({ type: 'success', text1: 'All marked as read.' });
    } catch { /* silent */ }
  };

  const remove = async (id) => {
    try {
      await notificationService.remove(id);
      setNotifications((p) => p.filter((n) => n.id !== id));
    } catch { /* silent */ }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const renderItem = ({ item: n }) => (
    <TouchableOpacity
      style={[s.item, !n.isRead && s.itemUnread]}
      onPress={() => !n.isRead && markRead(n.id)}
      activeOpacity={0.75}
    >
      <View style={s.iconWrap}>
        <Text style={s.icon}>{TYPE_ICON[n.type] || TYPE_ICON.INFO}</Text>
      </View>

      <View style={{ flex: 1 }}>
        <View style={s.titleRow}>
          {!n.isRead && <View style={s.dot} />}
          <Text style={[s.title, { fontWeight: n.isRead ? '400' : '600' }]} numberOfLines={1}>
            {n.title}
          </Text>
        </View>
        <Text style={s.message} numberOfLines={2}>{n.message}</Text>
        <Text style={s.time}>{timeAgo(n.createdAt)}</Text>
      </View>

      <TouchableOpacity
        onPress={() => remove(n.id)}
        style={s.deleteBtn}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Text style={s.deleteTxt}>✕</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={s.container}>
      {unreadCount > 0 && (
        <View style={s.header}>
          <Text style={s.unreadTxt}>{unreadCount} unread</Text>
          <Button
            title="Mark all read"
            onPress={markAllRead}
            variant="outline"
            style={{ paddingVertical: 7, paddingHorizontal: 14 }}
          />
        </View>
      )}

      <FlatList
        data={notifications}
        keyExtractor={(n) => String(n.id)}
        renderItem={renderItem}
        contentContainerStyle={s.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.accent} />
        }
        ListEmptyComponent={
          !loading
            ? <EmptyState icon="🔔" title="No notifications yet" subtitle="Activity on your account will appear here." />
            : null
        }
      />
    </View>
  );
}

const s = StyleSheet.create({
  container:   { flex: 1, backgroundColor: colors.bg },
  header:      { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, paddingBottom: 8 },
  unreadTxt:   { fontSize: 14, color: colors.text2, fontWeight: '500' },
  list:        { paddingBottom: 40 },
  item:        { flexDirection: 'row', gap: 12, padding: 16, borderBottomWidth: 1, borderBottomColor: colors.border, alignItems: 'flex-start' },
  itemUnread:  { backgroundColor: 'rgba(79,127,255,0.05)' },
  iconWrap:    { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.card2, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  icon:        { fontSize: 18 },
  titleRow:    { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 3 },
  dot:         { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.red, flexShrink: 0 },
  title:       { fontSize: 14, color: colors.text, flex: 1 },
  message:     { fontSize: 13, color: colors.text2, lineHeight: 18, marginBottom: 4 },
  time:        { fontSize: 12, color: colors.text3 },
  deleteBtn:   { padding: 4, flexShrink: 0 },
  deleteTxt:   { fontSize: 16, color: colors.text3 },
});
