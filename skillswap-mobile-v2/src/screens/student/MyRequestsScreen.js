import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  RefreshControl, Modal, Alert,
} from 'react-native';
import { requestService } from '../../services/api';
import { Card, Badge, Button, EmptyState, Input, ErrorBox } from '../../components/UI';
import { colors, statusColor, formatDate, formatTime } from '../../utils/theme';
import Toast from 'react-native-toast-message';

export default function MyRequestsScreen() {
  const [tab,           setTab]           = useState('sent');
  const [sent,          setSent]          = useState([]);
  const [received,      setReceived]      = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [refreshing,    setRefreshing]    = useState(false);
  const [rejectModal,   setRejectModal]   = useState(null);
  const [rejectReason,  setRejectReason]  = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const load = useCallback(async () => {
    try {
      const [sentRes, recRes] = await Promise.all([requestService.getSent(), requestService.getReceived()]);
      setSent(sentRes.data);
      setReceived(recRes.data);
    } catch { Toast.show({ type: 'error', text1: 'Failed to load requests' }); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);
  const onRefresh = async () => { setRefreshing(true); await load(); setRefreshing(false); };

  const handleCancel = (id) => {
    Alert.alert('Cancel Request', 'Cancel this request?', [
      { text: 'No',  style: 'cancel' },
      { text: 'Yes', style: 'destructive', onPress: async () => {
        try {
          await requestService.cancel(id);
          Toast.show({ type: 'success', text1: 'Request cancelled.' });
          load();
        } catch { Toast.show({ type: 'error', text1: 'Failed to cancel.' }); }
      }},
    ]);
  };

  const handleAccept = async (req) => {
    setActionLoading(true);
    try {
      await requestService.accept(req.id);
      Toast.show({ type: 'success', text1: 'Request accepted! Session created.' });
      load();
    } catch (e) {
      Toast.show({ type: 'error', text1: e.response?.data?.message || 'Failed to accept.' });
    } finally { setActionLoading(false); }
  };

  const handleReject = async () => {
    setActionLoading(true);
    try {
      await requestService.reject(rejectModal.id, rejectReason);
      Toast.show({ type: 'success', text1: 'Request rejected.' });
      setRejectModal(null); setRejectReason('');
      load();
    } catch { Toast.show({ type: 'error', text1: 'Failed to reject.' }); }
    finally { setActionLoading(false); }
  };

  const list = tab === 'sent' ? sent : received;

  const renderCard = (r) => (
    <Card key={r.id}>
      <View style={s.cardTop}>
        <View style={{ flex: 1 }}>
          <Text style={s.skillName}>{r.skillName}</Text>
          <Text style={s.person}>
            {tab === 'sent'
              ? `Teacher: ${r.teacherName}`
              : `From: ${r.requesterName} (${r.requesterStudentId})`}
          </Text>
        </View>
        <Badge text={r.status} color={statusColor(r.status)} />
      </View>

      <View style={s.metaRow}>
        <Text style={s.meta}>📅 {formatDate(r.preferredDate)}</Text>
        <Text style={s.meta}>🕐 {formatTime(r.preferredTime)}</Text>
      </View>

      {r.message ? (
        <View style={s.msgBox}><Text style={s.msgText}>"{r.message}"</Text></View>
      ) : null}

      <View style={s.actions}>
        {tab === 'sent' && r.status === 'PENDING' && (
          <Button title="Cancel request" onPress={() => handleCancel(r.id)} variant="danger" style={s.actBtn} />
        )}
        {tab === 'received' && r.status === 'PENDING' && (
          <>
            <Button title="✓ Accept" onPress={() => handleAccept(r)} variant="success" loading={actionLoading} style={s.actBtn} />
            <Button title="✕ Reject" onPress={() => setRejectModal(r)} variant="danger"  style={s.actBtn} />
          </>
        )}
      </View>
    </Card>
  );

  return (
    <View style={s.container}>
      {/* Tabs */}
      <View style={s.tabBar}>
        <TouchableOpacity style={[s.tab, tab === 'sent'     && s.tabActive]} onPress={() => setTab('sent')}>
          <Text style={[s.tabTxt, tab === 'sent'     && s.tabTxtActive]}>Sent ({sent.length})</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[s.tab, tab === 'received' && s.tabActive]} onPress={() => setTab('received')}>
          <Text style={[s.tabTxt, tab === 'received' && s.tabTxtActive]}>
            Received ({received.filter((r) => r.status === 'PENDING').length} pending)
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={s.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.accent} />}
      >
        {list.length === 0 && !loading
          ? <EmptyState
              icon="📭"
              title={tab === 'sent' ? 'No sent requests' : 'No received requests'}
              subtitle={tab === 'sent' ? 'Browse skills and request a session.' : 'Requests for your skills appear here.'}
            />
          : list.map(renderCard)
        }
      </ScrollView>

      {/* Reject Modal */}
      <Modal visible={!!rejectModal} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => { setRejectModal(null); setRejectReason(''); }}>
        <View style={s.rejectModal}>
          <View style={s.rejectHeader}>
            <Text style={s.rejectTitle}>Reject Request</Text>
            <TouchableOpacity onPress={() => { setRejectModal(null); setRejectReason(''); }}>
              <Text style={s.rejectClose}>✕</Text>
            </TouchableOpacity>
          </View>
          {rejectModal ? (
            <Text style={s.rejectInfo}>
              Rejecting <Text style={{ color: colors.text, fontWeight: '600' }}>{rejectModal.requesterName}</Text>'s
              request for <Text style={{ color: colors.text, fontWeight: '600' }}>{rejectModal.skillName}</Text>.
            </Text>
          ) : null}
          <Input label="Reason (optional)" placeholder="Let them know why…" value={rejectReason} onChangeText={setRejectReason} multiline numberOfLines={3} />
          <Button title="Reject request" onPress={handleReject} variant="danger" loading={actionLoading} />
          <Button title="Cancel" onPress={() => { setRejectModal(null); setRejectReason(''); }} variant="outline" style={{ marginTop: 10 }} />
        </View>
      </Modal>
    </View>
  );
}

const s = StyleSheet.create({
  container:    { flex: 1, backgroundColor: colors.bg },
  tabBar:       { flexDirection: 'row', backgroundColor: colors.card2, margin: 16, borderRadius: 10, padding: 4 },
  tab:          { flex: 1, paddingVertical: 9, borderRadius: 8, alignItems: 'center' },
  tabActive:    { backgroundColor: colors.accent },
  tabTxt:       { fontSize: 13, fontWeight: '500', color: colors.text2 },
  tabTxtActive: { color: '#fff' },
  content:      { paddingHorizontal: 16, paddingBottom: 40 },
  cardTop:      { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 },
  skillName:    { fontSize: 15, fontWeight: '700', color: colors.text, marginBottom: 4 },
  person:       { fontSize: 13, color: colors.text2 },
  metaRow:      { flexDirection: 'row', gap: 16, marginBottom: 8 },
  meta:         { fontSize: 13, color: colors.text2 },
  msgBox:       { backgroundColor: colors.card2, padding: 10, borderRadius: 8, marginBottom: 10 },
  msgText:      { fontSize: 13, color: colors.text2, fontStyle: 'italic' },
  actions:      { flexDirection: 'row', gap: 8 },
  actBtn:       { flex: 1, paddingVertical: 8 },
  rejectModal:  { flex: 1, backgroundColor: colors.bg, padding: 24, paddingTop: 52 },
  rejectHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  rejectTitle:  { fontSize: 20, fontWeight: '700', color: colors.text },
  rejectClose:  { fontSize: 20, color: colors.text2 },
  rejectInfo:   { fontSize: 14, color: colors.text2, marginBottom: 20, lineHeight: 20 },
});
