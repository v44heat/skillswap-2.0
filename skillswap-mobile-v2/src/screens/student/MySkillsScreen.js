import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  RefreshControl, Modal, Switch, Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { skillService } from '../../services/api';
import { Card, Button, Badge, ProficiencyBadge, EmptyState, ErrorBox, Input } from '../../components/UI';
import { colors } from '../../utils/theme';
import { CATEGORIES, PROFICIENCY_LEVELS } from '../../utils/constants';
import Toast from 'react-native-toast-message';

const EMPTY_FORM = {
  skillName: '', category: 'Programming',
  description: '', proficiency: 'INTERMEDIATE',
  availability: '', isActive: true,
};

export default function MySkillsScreen() {
  const [skills,    setSkills]    = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [refreshing,setRefreshing]= useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editing,   setEditing]   = useState(null);
  const [form,      setForm]      = useState(EMPTY_FORM);
  const [saving,    setSaving]    = useState(false);
  const [error,     setError]     = useState('');

  const load = useCallback(async () => {
    try {
      const res = await skillService.getMy();
      setSkills(res.data);
    } catch {
      Toast.show({ type: 'error', text1: 'Failed to load skills' });
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);
  const onRefresh = async () => { setRefreshing(true); await load(); setRefreshing(false); };

  const openAdd = () => {
    setEditing(null); setForm(EMPTY_FORM); setError(''); setShowModal(true);
  };
  const openEdit = (sk) => {
    setEditing(sk);
    setForm({
      skillName: sk.skillName, category: sk.category,
      description: sk.description, proficiency: sk.proficiency,
      availability: sk.availability || '', isActive: sk.isActive,
    });
    setError(''); setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.skillName.trim() || !form.description.trim()) {
      setError('Skill name and description are required.');
      return;
    }
    setSaving(true); setError('');
    try {
      if (editing) await skillService.update(editing.id, form);
      else         await skillService.create(form);
      Toast.show({ type: 'success', text1: editing ? 'Skill updated!' : 'Skill added!' });
      setShowModal(false);
      load();
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to save skill.');
    } finally { setSaving(false); }
  };

  const handleDelete = (id) => {
    Alert.alert('Delete Skill', 'This cannot be undone. Continue?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
        try {
          await skillService.remove(id);
          Toast.show({ type: 'success', text1: 'Skill deleted.' });
          load();
        } catch { Toast.show({ type: 'error', text1: 'Failed to delete.' }); }
      }},
    ]);
  };

  const handleToggle = async (sk) => {
    try {
      await skillService.update(sk.id, { ...sk, isActive: !sk.isActive });
      setSkills((p) => p.map((x) => x.id === sk.id ? { ...x, isActive: !x.isActive } : x));
    } catch { Toast.show({ type: 'error', text1: 'Failed to update.' }); }
  };

  const upd = (k) => (v) => setForm((p) => ({ ...p, [k]: v }));

  return (
    <View style={s.container}>
      <ScrollView
        contentContainerStyle={s.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.accent} />}
      >
        {skills.length === 0 && !loading
          ? <EmptyState icon="💡" title="No skills added yet" subtitle="Share your expertise with fellow students" action={openAdd} actionLabel="Add your first skill" />
          : skills.map((sk) => (
            <Card key={sk.id}>
              <View style={s.cardTop}>
                <View style={{ flex: 1 }}>
                  <Text style={s.skillName}>{sk.skillName}</Text>
                  <View style={s.badges}>
                    <Badge text={sk.category} color={colors.accent} />
                    <ProficiencyBadge level={sk.proficiency} />
                  </View>
                </View>
                <Switch
                  value={!!sk.isActive}
                  onValueChange={() => handleToggle(sk)}
                  trackColor={{ false: colors.border2, true: colors.green + '66' }}
                  thumbColor={sk.isActive ? colors.green : colors.text3}
                />
              </View>
              <Text style={s.desc} numberOfLines={2}>{sk.description}</Text>
              {sk.availability ? <Text style={s.avail}>📅 {sk.availability}</Text> : null}
              <View style={s.actions}>
                <Button title="Edit"   onPress={() => openEdit(sk)}    variant="outline" style={s.actBtn} />
                <Button title="Delete" onPress={() => handleDelete(sk.id)} variant="danger"  style={s.actBtn} />
              </View>
            </Card>
          ))
        }
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity style={s.fab} onPress={openAdd} activeOpacity={0.85}>
        <Text style={s.fabText}>+ Add Skill</Text>
      </TouchableOpacity>

      {/* Add / Edit Modal */}
      <Modal visible={showModal} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setShowModal(false)}>
        <ScrollView style={s.modal} keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingBottom: 60 }}>
          <View style={s.modalHeader}>
            <Text style={s.modalTitle}>{editing ? 'Edit Skill' : 'Add New Skill'}</Text>
            <TouchableOpacity onPress={() => setShowModal(false)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Text style={s.modalClose}>✕</Text>
            </TouchableOpacity>
          </View>

          <ErrorBox message={error} />

          <Input label="Skill name *" placeholder="e.g. React, Calculus, Guitar" value={form.skillName} onChangeText={upd('skillName')} />

          <Text style={s.label}>Category</Text>
          <View style={s.pickerWrap}>
            <Picker selectedValue={form.category} onValueChange={upd('category')} style={s.picker} dropdownIconColor={colors.text2}>
              {CATEGORIES.map((c) => <Picker.Item key={c} label={c} value={c} color={colors.text} style={{ backgroundColor: colors.bg2 }} />)}
            </Picker>
          </View>

          <Text style={s.label}>Proficiency Level</Text>
          <View style={s.pickerWrap}>
            <Picker selectedValue={form.proficiency} onValueChange={upd('proficiency')} style={s.picker} dropdownIconColor={colors.text2}>
              {PROFICIENCY_LEVELS.map((l) => <Picker.Item key={l} label={l} value={l} color={colors.text} style={{ backgroundColor: colors.bg2 }} />)}
            </Picker>
          </View>

          <Input label="Description *" placeholder="Describe what you can teach..." value={form.description} onChangeText={upd('description')} multiline numberOfLines={4} style={{ minHeight: 90 }} />
          <Input label="Availability"  placeholder="e.g. Weekday evenings"         value={form.availability} onChangeText={upd('availability')} />

          <Button title={saving ? 'Saving…' : editing ? 'Save changes' : 'Add skill'} onPress={handleSave} loading={saving} style={{ marginTop: 8 }} />
          <Button title="Cancel" onPress={() => setShowModal(false)} variant="outline" style={{ marginTop: 10 }} />
        </ScrollView>
      </Modal>
    </View>
  );
}

const s = StyleSheet.create({
  container:   { flex: 1, backgroundColor: colors.bg },
  content:     { padding: 20, paddingBottom: 100 },
  cardTop:     { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10 },
  skillName:   { fontSize: 15, fontWeight: '700', color: colors.text, marginBottom: 8 },
  badges:      { flexDirection: 'row', gap: 6, flexWrap: 'wrap' },
  desc:        { fontSize: 13, color: colors.text2, lineHeight: 19, marginBottom: 8 },
  avail:       { fontSize: 12, color: colors.text3, marginBottom: 10 },
  actions:     { flexDirection: 'row', gap: 8 },
  actBtn:      { flex: 1, paddingVertical: 8 },
  fab:         { position: 'absolute', bottom: 24, right: 20, backgroundColor: colors.accent, borderRadius: 28, paddingVertical: 13, paddingHorizontal: 22, elevation: 8, shadowColor: colors.accent, shadowOpacity: 0.45, shadowRadius: 10, shadowOffset: { width: 0, height: 4 } },
  fabText:     { color: '#fff', fontWeight: '700', fontSize: 15 },
  modal:       { flex: 1, backgroundColor: colors.bg, padding: 24, paddingTop: 52 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 },
  modalTitle:  { fontSize: 20, fontWeight: '700', color: colors.text },
  modalClose:  { fontSize: 20, color: colors.text2, padding: 4 },
  label:       { fontSize: 13, color: colors.text2, marginBottom: 6, fontWeight: '500' },
  pickerWrap:  { backgroundColor: colors.bg2, borderWidth: 1, borderColor: colors.border2, borderRadius: 10, marginBottom: 14, overflow: 'hidden' },
  picker:      { color: colors.text },
});
