import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useAuth } from '../../context/AuthContext';
import { Card, Avatar, Badge, Button, Input, ErrorBox } from '../../components/UI';
import { colors } from '../../utils/theme';
import { DEPARTMENTS, YEARS_OF_STUDY } from '../../utils/constants';
import api from '../../services/api';
import Toast from 'react-native-toast-message';

export default function ProfileScreen() {
  const { user, setUser, logout } = useAuth();

  const [editing,      setEditing]      = useState(false);
  const [form,         setForm]         = useState({
    fullName:    user?.fullName    || '',
    department:  user?.department  || 'Computer Science',
    yearOfStudy: user?.yearOfStudy || 1,
    bio:         user?.bio         || '',
  });
  const [saving,       setSaving]       = useState(false);
  const [profileError, setProfileError] = useState('');

  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [pwLoading, setPwLoading] = useState(false);
  const [pwError,   setPwError]   = useState('');

  const upd    = (k) => (v) => setForm((p)   => ({ ...p, [k]: v }));
  const updPw  = (k) => (v) => setPwForm((p) => ({ ...p, [k]: v }));

  const handleSaveProfile = async () => {
    if (!form.fullName.trim()) { setProfileError('Full name is required.'); return; }
    setSaving(true); setProfileError('');
    try {
      const res = await api.put('/users/profile', form);
      setUser(res.data);
      Toast.show({ type: 'success', text1: 'Profile updated!' });
      setEditing(false);
    } catch (e) {
      setProfileError(e.response?.data?.message || 'Failed to update profile.');
    } finally { setSaving(false); }
  };

  const handleChangePassword = async () => {
    if (!pwForm.currentPassword)        { setPwError('Enter your current password.');        return; }
    if (pwForm.newPassword.length < 6)  { setPwError('New password must be at least 6 chars.'); return; }
    if (pwForm.newPassword !== pwForm.confirmPassword) { setPwError('Passwords do not match.'); return; }
    setPwLoading(true); setPwError('');
    try {
      await api.put('/users/password', pwForm);
      Toast.show({ type: 'success', text1: 'Password changed!' });
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (e) {
      setPwError(e.response?.data?.message || 'Failed to change password.');
    } finally { setPwLoading(false); }
  };

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign out', style: 'destructive', onPress: logout },
    ]);
  };

  return (
    <ScrollView style={s.container} contentContainerStyle={s.content}>
      {/* Avatar + name */}
      <View style={s.topRow}>
        <Avatar name={user?.fullName} size={68} />
        <View style={{ flex: 1 }}>
          <Text style={s.name}>{user?.fullName}</Text>
          <Text style={s.email}>{user?.email}</Text>
          <Badge text={user?.role} color={colors.accent} />
        </View>
      </View>

      {/* Profile info / edit */}
      <Card>
        {!editing ? (
          <>
            {[
              ['Student ID',    user?.studentId],
              ['Department',    user?.department   || '—'],
              ['Year of Study', user?.yearOfStudy  ? `Year ${user.yearOfStudy}` : '—'],
              ['Bio',           user?.bio          || '—'],
            ].map(([label, value]) => (
              <View key={label} style={s.infoRow}>
                <Text style={s.infoLabel}>{label}</Text>
                <Text style={s.infoValue}>{value}</Text>
              </View>
            ))}
            <Button title="Edit Profile" onPress={() => setEditing(true)} style={{ marginTop: 10 }} />
          </>
        ) : (
          <>
            <ErrorBox message={profileError} />
            <Input label="Full Name *" value={form.fullName} onChangeText={upd('fullName')} />

            <Text style={s.label}>Department</Text>
            <View style={s.pickerWrap}>
              <Picker selectedValue={form.department} onValueChange={upd('department')} style={s.picker} dropdownIconColor={colors.text2}>
                {DEPARTMENTS.map((d) => <Picker.Item key={d} label={d} value={d} color={colors.text} style={{ backgroundColor: colors.bg2 }} />)}
              </Picker>
            </View>

            <Text style={s.label}>Year of Study</Text>
            <View style={s.pickerWrap}>
              <Picker selectedValue={form.yearOfStudy} onValueChange={upd('yearOfStudy')} style={s.picker} dropdownIconColor={colors.text2}>
                {YEARS_OF_STUDY.map((y) => <Picker.Item key={y.value} label={y.label} value={y.value} color={colors.text} style={{ backgroundColor: colors.bg2 }} />)}
              </Picker>
            </View>

            <Input label="Bio" placeholder="Tell others about yourself…" value={form.bio} onChangeText={upd('bio')} multiline numberOfLines={3} />

            <View style={{ flexDirection: 'row', gap: 10 }}>
              <Button title="Save"   onPress={handleSaveProfile} loading={saving} style={{ flex: 1 }} />
              <Button title="Cancel" onPress={() => { setEditing(false); setProfileError(''); }} variant="outline" style={{ flex: 1 }} />
            </View>
          </>
        )}
      </Card>

      {/* Change password */}
      <Card>
        <Text style={s.sectionTitle}>Change Password</Text>
        <ErrorBox message={pwError} />
        <Input label="Current password"      value={pwForm.currentPassword} onChangeText={updPw('currentPassword')} secureTextEntry />
        <Input label="New password"          value={pwForm.newPassword}     onChangeText={updPw('newPassword')}     secureTextEntry placeholder="Min. 6 characters" />
        <Input label="Confirm new password"  value={pwForm.confirmPassword} onChangeText={updPw('confirmPassword')} secureTextEntry />
        <Button title="Update password" onPress={handleChangePassword} loading={pwLoading} />
      </Card>

      {/* Sign out */}
      <Button title="🚪  Sign out" onPress={handleLogout} variant="danger" style={{ marginBottom: 40 }} />
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container:    { flex: 1, backgroundColor: colors.bg },
  content:      { padding: 20, paddingBottom: 40 },
  topRow:       { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 20 },
  name:         { fontSize: 19, fontWeight: '800', color: colors.text, marginBottom: 4 },
  email:        { fontSize: 13, color: colors.text2, marginBottom: 8 },
  infoRow:      { flexDirection: 'row', paddingVertical: 9, borderBottomWidth: 1, borderBottomColor: colors.border },
  infoLabel:    { fontSize: 13, color: colors.text3, width: 110, flexShrink: 0 },
  infoValue:    { fontSize: 14, color: colors.text, flex: 1 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: colors.text, marginBottom: 14 },
  label:        { fontSize: 13, color: colors.text2, marginBottom: 6, fontWeight: '500' },
  pickerWrap:   { backgroundColor: colors.bg2, borderWidth: 1, borderColor: colors.border2, borderRadius: 10, marginBottom: 14, overflow: 'hidden' },
  picker:       { color: colors.text },
});
