import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  TextInput, Modal, ScrollView, RefreshControl,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { skillService, requestService } from '../../services/api';
import { Card, Avatar, Badge, ProficiencyBadge, Button, EmptyState, ErrorBox, Input } from '../../components/UI';
import { colors, categoryColor, proficiencyColor } from '../../utils/theme';
import { CATEGORIES, PROFICIENCY_LEVELS } from '../../utils/constants';
import Toast from 'react-native-toast-message';

function RequestModal({ skill, onClose, onSuccess }) {
  const [date,    setDate]    = useState('');
  const [time,    setTime]    = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  const submit = async () => {
    if (!date.trim() || !time.trim()) { setError('Date and time are required.'); return; }
    setLoading(true); setError('');
    try {
      await requestService.create({ skillId: skill.id, preferredDate: date.trim(), preferredTime: time.trim(), message });
      onSuccess();
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to send request. Check date format YYYY-MM-DD.');
    } finally { setLoading(false); }
  };

  return (
    <Modal visible animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <ScrollView style={s.reqModal} keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingBottom: 60 }}>
        <View style={s.reqHeader}>
          <Text style={s.reqTitle}>Request Session</Text>
          <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Text style={s.reqClose}>✕</Text>
          </TouchableOpacity>
        </View>

        <View style={s.skillInfo}>
          <Text style={s.infoLabel}>Skill</Text>
          <Text style={s.infoVal}>{skill.skillName}</Text>
          <Text style={s.infoLabel}>Teacher</Text>
          <Text style={s.infoVal}>{skill.ownerName}  ·  {skill.ownerDepartment}</Text>
        </View>

        <ErrorBox message={error} />
        <Input label="Preferred Date *" placeholder="YYYY-MM-DD  e.g. 2025-03-20" value={date} onChangeText={setDate} keyboardType="numbers-and-punctuation" />
        <Input label="Preferred Time *" placeholder="HH:MM  e.g. 14:00"           value={time} onChangeText={setTime} keyboardType="numbers-and-punctuation" />
        <Input label="Message (optional)" placeholder="Any specific topics or questions…" value={message} onChangeText={setMessage} multiline numberOfLines={3} />

        <Button title="Send request" onPress={submit} loading={loading} />
        <Button title="Cancel" onPress={onClose} variant="outline" style={{ marginTop: 10 }} />
      </ScrollView>
    </Modal>
  );
}

export default function BrowseSkillsScreen() {
  const [skills,      setSkills]      = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [refreshing,  setRefreshing]  = useState(false);
  const [search,      setSearch]      = useState('');
  const [category,    setCategory]    = useState('');
  const [proficiency, setProficiency] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [reqSkill,    setReqSkill]    = useState(null);

  const load = useCallback(async () => {
    try {
      const res = await skillService.browse({ search, category, proficiency });
      setSkills(res.data);
    } catch { /* silent */ } finally { setLoading(false); }
  }, [search, category, proficiency]);

  useEffect(() => { const t = setTimeout(load, 400); return () => clearTimeout(t); }, [load]);
  const onRefresh = async () => { setRefreshing(true); await load(); setRefreshing(false); };

  const renderSkill = ({ item: sk }) => (
    <Card>
      <Text style={s.skillName}>{sk.skillName}</Text>
      <View style={s.badges}>
        <Badge text={sk.category} color={categoryColor(sk.category)} />
        <ProficiencyBadge level={sk.proficiency} />
      </View>
      <Text style={s.desc} numberOfLines={2}>{sk.description}</Text>
      {sk.availability ? <Text style={s.avail}>📅 {sk.availability}</Text> : null}
      <View style={s.footer}>
        <Avatar name={sk.ownerName} size={32} />
        <View style={{ flex: 1 }}>
          <Text style={s.ownerName}>{sk.ownerName}</Text>
          <Text style={s.ownerDept}>{sk.ownerDepartment}</Text>
        </View>
        <Button title="Request" onPress={() => setReqSkill(sk)} style={{ paddingVertical: 8, paddingHorizontal: 14 }} />
      </View>
    </Card>
  );

  return (
    <View style={s.container}>
      {/* Search row */}
      <View style={s.searchRow}>
        <TextInput
          style={s.searchInput}
          placeholder="Search skills…"
          placeholderTextColor={colors.text3}
          value={search}
          onChangeText={setSearch}
        />
        <TouchableOpacity style={s.filterBtn} onPress={() => setShowFilters(true)}>
          <Text style={s.filterBtnTxt}>⚙ Filter</Text>
        </TouchableOpacity>
      </View>

      {/* Active filters */}
      {(category || proficiency) ? (
        <View style={s.activeFilters}>
          {category    ? <Badge text={category}    color={colors.accent}              /> : null}
          {proficiency ? <Badge text={proficiency} color={proficiencyColor(proficiency)} /> : null}
          <TouchableOpacity onPress={() => { setCategory(''); setProficiency(''); }}>
            <Text style={s.clearFilters}>Clear</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      <FlatList
        data={skills}
        keyExtractor={(sk) => String(sk.id)}
        renderItem={renderSkill}
        contentContainerStyle={s.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.accent} />}
        ListEmptyComponent={!loading ? <EmptyState icon="🔍" title="No skills found" subtitle="Try adjusting your search or filters." /> : null}
      />

      {/* Filter modal */}
      <Modal visible={showFilters} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setShowFilters(false)}>
        <View style={s.filterModal}>
          <View style={s.filterHeader}>
            <Text style={s.filterTitle}>Filters</Text>
            <TouchableOpacity onPress={() => setShowFilters(false)}>
              <Text style={s.filterDone}>Done</Text>
            </TouchableOpacity>
          </View>

          <Text style={s.filterLabel}>Category</Text>
          <View style={s.pickerWrap}>
            <Picker selectedValue={category} onValueChange={setCategory} style={s.picker} dropdownIconColor={colors.text2}>
              <Picker.Item label="All categories" value="" color={colors.text} style={{ backgroundColor: colors.bg2 }} />
              {CATEGORIES.map((c) => <Picker.Item key={c} label={c} value={c} color={colors.text} style={{ backgroundColor: colors.bg2 }} />)}
            </Picker>
          </View>

          <Text style={s.filterLabel}>Proficiency Level</Text>
          <View style={s.pickerWrap}>
            <Picker selectedValue={proficiency} onValueChange={setProficiency} style={s.picker} dropdownIconColor={colors.text2}>
              <Picker.Item label="All levels" value="" color={colors.text} style={{ backgroundColor: colors.bg2 }} />
              {PROFICIENCY_LEVELS.map((l) => <Picker.Item key={l} label={l} value={l} color={colors.text} style={{ backgroundColor: colors.bg2 }} />)}
            </Picker>
          </View>

          <Button title="Apply" onPress={() => setShowFilters(false)} />
          <Button title="Clear all" onPress={() => { setCategory(''); setProficiency(''); }} variant="outline" style={{ marginTop: 10 }} />
        </View>
      </Modal>

      {/* Request modal */}
      {reqSkill ? (
        <RequestModal
          skill={reqSkill}
          onClose={() => setReqSkill(null)}
          onSuccess={() => {
            setReqSkill(null);
            Toast.show({ type: 'success', text1: 'Request sent!' });
          }}
        />
      ) : null}
    </View>
  );
}

const s = StyleSheet.create({
  container:     { flex: 1, backgroundColor: colors.bg },
  searchRow:     { flexDirection: 'row', gap: 10, padding: 16, paddingBottom: 8 },
  searchInput:   { flex: 1, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border2, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 11, color: colors.text, fontSize: 15 },
  filterBtn:     { backgroundColor: colors.card2, borderRadius: 10, paddingHorizontal: 14, justifyContent: 'center', borderWidth: 1, borderColor: colors.border2 },
  filterBtnTxt:  { color: colors.text2, fontSize: 14, fontWeight: '500' },
  activeFilters: { flexDirection: 'row', gap: 8, paddingHorizontal: 16, paddingBottom: 8, alignItems: 'center', flexWrap: 'wrap' },
  clearFilters:  { color: colors.red, fontSize: 13, fontWeight: '500' },
  list:          { padding: 16, paddingTop: 4, paddingBottom: 40 },
  skillName:     { fontSize: 15, fontWeight: '700', color: colors.text, marginBottom: 8 },
  badges:        { flexDirection: 'row', gap: 6, flexWrap: 'wrap', marginBottom: 8 },
  desc:          { fontSize: 13, color: colors.text2, lineHeight: 19, marginBottom: 6 },
  avail:         { fontSize: 12, color: colors.text3, marginBottom: 10 },
  footer:        { flexDirection: 'row', alignItems: 'center', gap: 10, borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 12 },
  ownerName:     { fontSize: 13, fontWeight: '600', color: colors.text },
  ownerDept:     { fontSize: 12, color: colors.text3 },
  filterModal:   { flex: 1, backgroundColor: colors.bg, padding: 24, paddingTop: 52 },
  filterHeader:  { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  filterTitle:   { fontSize: 20, fontWeight: '700', color: colors.text },
  filterDone:    { fontSize: 16, color: colors.accent, fontWeight: '600' },
  filterLabel:   { fontSize: 13, color: colors.text2, marginBottom: 6, fontWeight: '500' },
  pickerWrap:    { backgroundColor: colors.bg2, borderWidth: 1, borderColor: colors.border2, borderRadius: 10, marginBottom: 16, overflow: 'hidden' },
  picker:        { color: colors.text },
  reqModal:      { flex: 1, backgroundColor: colors.bg, padding: 24, paddingTop: 52 },
  reqHeader:     { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  reqTitle:      { fontSize: 20, fontWeight: '700', color: colors.text },
  reqClose:      { fontSize: 20, color: colors.text2, padding: 4 },
  skillInfo:     { backgroundColor: colors.card2, borderRadius: 12, padding: 14, marginBottom: 16, borderWidth: 1, borderColor: colors.border },
  infoLabel:     { fontSize: 12, color: colors.text3, marginBottom: 2 },
  infoVal:       { fontSize: 15, fontWeight: '600', color: colors.text, marginBottom: 10 },
});
