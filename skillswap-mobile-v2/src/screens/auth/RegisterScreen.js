import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, KeyboardAvoidingView, Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useAuth } from '../../context/AuthContext';
import { Button, Input, ErrorBox } from '../../components/UI';
import { colors } from '../../utils/theme';
import { DEPARTMENTS, YEARS_OF_STUDY } from '../../utils/constants';

export default function RegisterScreen({ navigation }) {
  const [form, setForm] = useState({
    fullName: '', studentId: '', email: '',
    department: 'Computer Science', yearOfStudy: 1,
    password: '', confirmPassword: '', bio: '',
  });
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');
  const { register } = useAuth();

  const upd = (k) => (v) => setForm((p) => ({ ...p, [k]: v }));

  const validate = () => {
    if (!form.fullName.trim())  return 'Full name is required.';
    if (!form.studentId.trim()) return 'Student ID is required.';
    if (!form.email.trim())     return 'Email is required.';
    if (!/\S+@\S+\.\S+/.test(form.email)) return 'Please enter a valid email address.';
    if (!form.password)         return 'Password is required.';
    if (form.password.length < 6) return 'Password must be at least 6 characters.';
    if (form.password !== form.confirmPassword) return 'Passwords do not match.';
    return null;
  };

  const handleRegister = async () => {
    const err = validate();
    if (err) { setError(err); return; }
    setLoading(true); setError('');
    try { await register(form); }
    catch (e) { setError(e.response?.data?.message || 'Registration failed. Please try again.'); }
    finally { setLoading(false); }
  };

  return (
    <KeyboardAvoidingView style={s.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
        <Text style={s.title}>Join SkillSwap</Text>
        <Text style={s.subtitle}>Create your free student account</Text>

        <View style={s.form}>
          <ErrorBox message={error} />
          <Input label="Full Name *"  placeholder="Your full name"       value={form.fullName}  onChangeText={upd('fullName')} />
          <Input label="Student ID *" placeholder="e.g. STU001"          value={form.studentId} onChangeText={upd('studentId')} autoCapitalize="characters" />
          <Input label="Email *"      placeholder="you@university.edu"   value={form.email}     onChangeText={upd('email')} keyboardType="email-address" autoCapitalize="none" />

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

          <Input label="Password *"         placeholder="Min. 6 characters"  value={form.password}        onChangeText={upd('password')}        secureTextEntry />
          <Input label="Confirm Password *"  placeholder="Repeat password"    value={form.confirmPassword} onChangeText={upd('confirmPassword')} secureTextEntry />
          <Input label="Bio (optional)"      placeholder="Tell others about yourself..." value={form.bio} onChangeText={upd('bio')} multiline numberOfLines={3} />

          <Button title="Create account" onPress={handleRegister} loading={loading} />
        </View>

        <View style={s.footer}>
          <Text style={s.footerText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={s.footerLink}>Sign in</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  container:  { flex: 1, backgroundColor: colors.bg },
  scroll:     { flexGrow: 1, padding: 24, paddingTop: 56 },
  title:      { fontSize: 26, fontWeight: '800', color: colors.text, marginBottom: 4 },
  subtitle:   { fontSize: 14, color: colors.text2, marginBottom: 24 },
  form:       { backgroundColor: colors.card, borderRadius: 16, padding: 20, borderWidth: 1, borderColor: colors.border, marginBottom: 20 },
  label:      { fontSize: 13, color: colors.text2, marginBottom: 6, fontWeight: '500' },
  pickerWrap: { backgroundColor: colors.bg2, borderWidth: 1, borderColor: colors.border2, borderRadius: 10, marginBottom: 14, overflow: 'hidden' },
  picker:     { color: colors.text },
  footer:     { flexDirection: 'row', justifyContent: 'center', paddingBottom: 32 },
  footerText: { fontSize: 14, color: colors.text2 },
  footerLink: { fontSize: 14, color: colors.accent, fontWeight: '600' },
});
