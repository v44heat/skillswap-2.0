import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, TextInput,
  TouchableOpacity, Modal, Alert, RefreshControl,
} from 'react-native';
import { adminService } from '../../services/api';
import { Card, Avatar, Badge, Button, Input } from '../../components/UI';
import { colors, formatDate } from '../../utils/theme';
import Toast from 'react-native-toast-message';

export default function AdminUsersScreen() {
  const [users,      setUsers]      = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search,     setSearch]     = useState('');
  const [resetUser,  setResetUser]  = useState(null);
  const [newPw,      setNewPw]      = useState('');
  const [pwLoading,  setPwLoading]  = useState(false);

  const load = useCallback(async () => {
    try {
      const res = await adminService.getUsers(search);
      setUsers(res.data);
    } catch { /* silent */ }
    finally { setLoading(false); }
  }, [search]);

  useEffect(() => { const t = setTimeout(load, 400); return () => clearTimeout(t); }, [load]);
  const onRefresh = async () => { setRefreshing(true); await load(); setRefreshing(false); };

  const handleToggle = (u) => {
    Alert.alert(
      u.isActive ? 'Suspend User' : 'Activate User',
      `${u.isActive ? 'Suspend' : 'Activate'} ${u.fullName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Confirm', onPress: async () => {
          try {
            await adminService.toggleSuspend(u.id);
            setUsers((p) => p.map((x) => x.id === u.id ? { ...x, isActive: !x.isActive } : x));
            Toast.show({ type: 'success', text1: `User ${u.isActive ? 'suspended' : 'activated'}.` });
          } catch { Toast.show({ type: 'error', text1: 'Failed to update user.' }); }
        }},
      ]
    );
  };

  const handleDelete = (u) => {
    Alert.alert('Delete User', `Permanently delete ${u.fullName}?\n\nThis cannot be undone.`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
        try {
          await adminService.deleteUser(u.id);
          setUsers((p) => p.filter((x) => x.id !== u.id));
          Toast.show({ type: 'success', text1: 'User deleted.' });
        } catch { Toast.show({ type: 'error', text1: 'Failed to delete user.' }); }
      }},
    ]);
  };

  const handleResetPassword = async () => {
    const password = newPw.trim() || `Temp@${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    setPwLoading(true);
    try {
      await adminService.resetPassword(resetUser.id, { newPassword: password, forceChange: !newPw.trim() });
      Toast.show({ type: 'success', text1: `Password reset!`, text2: `New: ${password}` });
      setResetUser(null); setNewPw('');
    } catch { Toast.show({ type: 'error', text1: 'Failed to reset password.' }); }
    finally { setPwLoading(false); }
  };

  const renderUser = ({ item: u }) => (
    <Card>
      <View style={s.userTop}>
        <Avatar name={u.fullName} size={42} />
        <View style={{ flex: 1 }}>
          <Text style={s.userName}>{u.fullName}</Text>
          <Text style={s.userEmail}>{u.email}</Text>
          <Text style={s.userId}>{u.studentId}  ·  {u.department || '—'}</Text>
        </View>
        <Badge text={u.isActive ? 'Active' : 'Suspended'} color={u.isActive ? colors.green : colors.red} />
      </View>
      <View style={s.userActions}>
        <Button title="Reset PW"                      onPress={() => setResetUser(u)} variant="outline" style={s.userBtn} />
        <Button title={u.isActive ? 'Suspend' : 'Activate'} onPress={() => handleToggle(u)} variant={u.isActive ? 'danger' : 'success'} style={s.userBtn} />
        <Button title="Delete"                         onPress={() => handleDelete(u)} variant="danger"   style={s.userBtn} />
      </View>
    </Card>
  );

  return (
    <View style={s.container}>
      <View style={s.searchWrap}>
        <TextInput
          style={s.searchInput}
          placeholder="Search by name, email, or ID…"
          placeholderTextColor={colors.text3}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <FlatList
        data={users}
        keyExtractor={(u) => String(u.id)}
        renderItem={renderUser}
        contentContainerStyle={s.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.accent} />}
        ListEmptyComponent={!loading ? <Text style={s.empty}>No users found.</Text> : null}
      />

      {/* Reset Password Modal */}
      <Modal visible={!!resetUser} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => { setResetUser(null); setNewPw(''); }}>
        <View style={s.modal}>
          <View style={s.modalHeader}>
            <Text style={s.modalTitle}>Reset Password</Text>
            <TouchableOpacity onPress={() => { setResetUser(null); setNewPw(''); }} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Text style={s.modalClose}>✕</Text>
            </TouchableOpacity>
          </View>
          {resetUser ? (
            <Text style={s.modalUser}>
              For: <Text style={{ color: colors.text, fontWeight: '600' }}>{resetUser.fullName}</Text>
            </Text>
          ) : null}
          <Input
            label="New password (leave blank to auto-generate)"
            placeholder="e.g. TempPass@2025"
            value={newPw}
            onChangeText={setNewPw}
            secureTextEntry
          />
          <Button title={pwLoading ? 'Resetting…' : 'Reset password'} onPress={handleResetPassword} loading={pwLoading} />
          <Button title="Cancel" onPress={() => { setResetUser(null); setNewPw(''); }} variant="outline" style={{ marginTop: 10 }} />
        </View>
      </Modal>
    </View>
  );
}

const s = StyleSheet.create({
  container:   { flex: 1, backgroundColor: colors.bg },
  searchWrap:  { padding: 16, paddingBottom: 8 },
  searchInput: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border2, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 11, color: colors.text, fontSize: 15 },
  list:        { padding: 16, paddingTop: 4, paddingBottom: 40 },
  userTop:     { flexDirection: 'row', gap: 12, alignItems: 'flex-start', marginBottom: 12 },
  userName:    { fontSize: 14, fontWeight: '700', color: colors.text, marginBottom: 2 },
  userEmail:   { fontSize: 12, color: colors.text2, marginBottom: 2 },
  userId:      { fontSize: 12, color: colors.text3 },
  userActions: { flexDirection: 'row', gap: 6 },
  userBtn:     { flex: 1, paddingVertical: 7, paddingHorizontal: 6 },
  empty:       { textAlign: 'center', padding: 40, color: colors.text3, fontSize: 14 },
  modal:       { flex: 1, backgroundColor: colors.bg, padding: 24, paddingTop: 52 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  modalTitle:  { fontSize: 20, fontWeight: '700', color: colors.text },
  modalClose:  { fontSize: 20, color: colors.text2 },
  modalUser:   { fontSize: 14, color: colors.text2, marginBottom: 20 },
});
