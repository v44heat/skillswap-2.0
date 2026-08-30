import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  RefreshControl, Modal, Alert,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { sessionService, feedbackService } from '../../services/api';
import { Card, Badge, Button, EmptyState, StarRating, Input } from '../../components/UI';
import { colors, statusColor, formatDate, formatTime } from '../../utils/theme';
import Toast from 'react-native-toast-message';

export default function MySessionsScreen() {
  const { user }                        = useAuth();
  const [tab,         setTab]           = useState('upcoming');
  const [upcoming,    setUpcoming]      = useState([]);
  const [past,        setPast]          = useState([]);
  const [loading,     setLoading]       = useState(true);
  const [refreshing,  setRefreshing]    = useState(false);
  const [rateModal,   setRateModal]     = useState(null);
  const [rating,      setRating]        = useState(0);
  const [comment,     setComment]       = useState('');
  const [rateLoading, setRateLoading]   = useState(false);

  const load = useCallback(async () => {
    try {
      const [upRes, pastRes] = await Promise.all([sessionService.getUpcoming(), sessionService.getPast()]);
      setUpcoming(upRes.data);
      setPast(pastRes.data);
    } catch { Toast.show({ type: 'error', text1: 'Failed to load sessions' }); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);
  const onRefresh = async () => { setRefreshing(true); await load(); setRefreshing(false); };

  const handleCancel = (id) => {
    Alert.alert('Cancel Session', 'Both parties will be notified. Continue?', [
      { text: 'No',  style: 'cancel' },
      { text: 'Yes', style: 'destructive', onPress: async () => {
        try { await sessionService.cancel(id); Toast.show({ type: 'success', text1: 'Session cancelled.' }); load(); }
        catch { Toast.show({ type: 'error', text1: 'Failed to cancel.' }); }
      }},
    ]);
  };

  const handleComplete = (id) => {
    Alert.alert('Mark as Completed', 'Mark this session as completed?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Complete', onPress: async () => {
        try { await sessionService.complete(id); Toast.show({ type: 'success', text1: 'Session completed!' }); load(); }
        catch { Toast.show({ type: 'error', text1: 'Failed to complete.' }); }
      }},
    ]);
  };

  const handleRate = async () => {
    if (rating === 0) { Toast.show({ type: 'error', text1: 'Please select a rating.' }); return; }
    setRateLoading(true);
    try {
      await feedbackService.submit({ sessionId: rateModal.id, rating, comment });
      Toast.show({ type: 'success', text1: 'Feedback submitted! Thank you.' });
      setRateModal(null); setRating(0); setComment('');
      load();
    } catch (e) {
      Toast.show({ type: 'error', text1: e.response?.data?.message || 'Failed to submit feedback.' });
    } finally { setRateLoading(false); }
  };

  const renderSession = (sess) => {
    const isTeacher = sess.teacherId === user?.id;
    return (
      <Card key={sess.id}>
        <View style={s.cardTop}>
          <View style={{ flex: 1 }}>
            <Text style={s.skillName}>{sess.skillName}</Text>
            <Text style={s.person}>
              {isTeacher ? `Teaching ${sess.learnerName}` : `Learning from ${sess.teacherName}`}
            </Text>
          </View>
          <Badge text={sess.status} color={statusColor(sess.status)} />
        </View>

        <View style={s.metaRow}>
          <Text style={s.meta}>📅 {formatDate(sess.sessionDate)}</Text>
          <Text style={s.meta}>🕐 {formatTime(sess.startTime)}</Text>
        </View>
        {sess.location && sess.location !== 'TBD'
          ? <Text style={s.meta}>📍 {sess.location}</Text> : null}

        <View style={s.actions}>
          {sess.status === 'CONFIRMED' && (
            <Button title="Cancel" onPress={() => handleCancel(sess.id)} variant="danger" style={s.actBtn} />
          )}
          {sess.status === 'CONFIRMED' && isTeacher && (
            <Button title="✓ Complete" onPress={() => handleComplete(sess.id)} variant="success" style={s.actBtn} />
          )}
          {sess.status === 'COMPLETED' && !isTeacher && !sess.hasRated && (
            <Button title="⭐ Rate & Feedback" onPress={() => setRateModal(sess)} style={s.actBtn} />
          )}
          {sess.status === 'COMPLETED' && !isTeacher && sess.hasRated && (
            <Badge text="Rated ✓" color={colors.green} />
          )}
        </View>
      </Card>
    );
  };

  const list = tab === 'upcoming' ? upcoming : past;

  return (
    <View style={s.container}>
      <View style={s.tabBar}>
        <TouchableOpacity style={[s.tab, tab === 'upcoming' && s.tabActive]} onPress={() => setTab('upcoming')}>
          <Text style={[s.tabTxt, tab === 'upcoming' && s.tabTxtActive]}>Upcoming ({upcoming.length})</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[s.tab, tab === 'past' && s.tabActive]} onPress={() => setTab('past')}>
          <Text style={[s.tabTxt, tab === 'past' && s.tabTxtActive]}>Past ({past.length})</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={s.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.accent} />}
      >
        {list.length === 0 && !loading
          ? <EmptyState
              icon={tab === 'upcoming' ? '📅' : '🕰️'}
              title={tab === 'upcoming' ? 'No upcoming sessions' : 'No past sessions'}
              subtitle={tab === 'upcoming' ? 'Accept a request or browse skills.' : 'Completed sessions will appear here.'}
            />
          : list.map(renderSession)
        }
      </ScrollView>

      {/* Rate Modal */}
      <Modal visible={!!rateModal} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => { setRateModal(null); setRating(0); setComment(''); }}>
        <View style={s.rateModal}>
          <View style={s.rateHeader}>
            <Text style={s.rateTitle}>Rate & Feedback</Text>
            <TouchableOpacity onPress={() => { setRateModal(null); setRating(0); setComment(''); }}>
              <Text style={s.rateClose}>✕</Text>
            </TouchableOpacity>
          </View>
          {rateModal ? (
            <Text style={s.rateInfo}>
              How was your session learning{' '}
              <Text style={{ color: colors.text, fontWeight: '600' }}>{rateModal.skillName}</Text>
              {' '}from{' '}
              <Text style={{ color: colors.text, fontWeight: '600' }}>{rateModal.teacherName}</Text>?
            </Text>
          ) : null}
          <View style={s.starsWrap}>
            <Text style={s.starsLabel}>Tap to rate</Text>
            <StarRating value={rating} onChange={setRating} size={38} />
          </View>
          <Input label="Comment (optional)" placeholder="Share your experience…" value={comment} onChangeText={setComment} multiline numberOfLines={4} />
          <Button title="Submit feedback" onPress={handleRate} loading={rateLoading} />
          <Button title="Cancel" onPress={() => { setRateModal(null); setRating(0); setComment(''); }} variant="outline" style={{ marginTop: 10 }} />
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
  metaRow:      { flexDirection: 'row', gap: 16, marginBottom: 6 },
  meta:         { fontSize: 13, color: colors.text2, marginBottom: 4 },
  actions:      { flexDirection: 'row', gap: 8, marginTop: 8, flexWrap: 'wrap' },
  actBtn:       { flex: 1, paddingVertical: 8 },
  rateModal:    { flex: 1, backgroundColor: colors.bg, padding: 24, paddingTop: 52 },
  rateHeader:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  rateTitle:    { fontSize: 20, fontWeight: '700', color: colors.text },
  rateClose:    { fontSize: 20, color: colors.text2 },
  rateInfo:     { fontSize: 14, color: colors.text2, marginBottom: 24, lineHeight: 20 },
  starsWrap:    { alignItems: 'center', marginBottom: 24 },
  starsLabel:   { fontSize: 13, color: colors.text3, marginBottom: 10 },
});
