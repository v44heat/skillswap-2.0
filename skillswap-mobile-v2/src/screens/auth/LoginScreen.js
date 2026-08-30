import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { Button, Input, ErrorBox } from '../../components/UI';
import { colors } from '../../utils/theme';

export default function LoginScreen({ navigation }) {
  const [identifier, setIdentifier] = useState('');
  const [password,   setPassword]   = useState('');
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState('');
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!identifier.trim() || !password) { setError('Please fill in all fields.'); return; }
    setLoading(true); setError('');
    try { await login(identifier.trim(), password); }
    catch (err) { setError(err.response?.data?.message || 'Invalid credentials. Please try again.'); }
    finally { setLoading(false); }
  };

  return (
    <KeyboardAvoidingView style={s.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">

        <View style={s.logoWrap}>
          <View style={s.logoBox}><Text style={s.logoIcon}>⚡</Text></View>
          <Text style={s.appName}>SkillSwap</Text>
          <Text style={s.tagline}>Campus Skill Exchange</Text>
        </View>

        <View style={s.form}>
          <Text style={s.title}>Welcome back</Text>
          <Text style={s.subtitle}>Sign in to your account</Text>
          <ErrorBox message={error} />
          <Input
            label="Email or Student ID"
            placeholder="email@university.edu or STU001"
            value={identifier}
            onChangeText={setIdentifier}
            autoCapitalize="none"
            keyboardType="email-address"
            returnKeyType="next"
          />
          <Input
            label="Password"
            placeholder="••••••••"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            returnKeyType="done"
            onSubmitEditing={handleLogin}
          />
          <Button title="Sign in" onPress={handleLogin} loading={loading} style={{ marginTop: 4 }} />
          <Text style={s.forgot}>
            Forgot password?{' '}
            <Text style={{ color: colors.accent }}>Contact admin@skillswap.com</Text>
          </Text>
        </View>

        <View style={s.footer}>
          <Text style={s.footerText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={s.footerLink}>Create one</Text>
          </TouchableOpacity>
        </View>

        {/* Demo hint */}
        <View style={s.demo}>
          <Text style={s.demoText}>Demo accounts:</Text>
          <Text style={s.demoText}>admin@skillswap.com / Admin@123</Text>
          <Text style={s.demoText}>alex@uni.edu / password123</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  scroll:    { flexGrow: 1, justifyContent: 'center', padding: 24 },
  logoWrap:  { alignItems: 'center', marginBottom: 36 },
  logoBox:   { width: 64, height: 64, backgroundColor: colors.accent, borderRadius: 18, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  logoIcon:  { fontSize: 28 },
  appName:   { fontSize: 26, fontWeight: '800', color: colors.text },
  tagline:   { fontSize: 13, color: colors.text3, marginTop: 4 },
  form:      { backgroundColor: colors.card, borderRadius: 16, padding: 20, borderWidth: 1, borderColor: colors.border, marginBottom: 20 },
  title:     { fontSize: 20, fontWeight: '700', color: colors.text, marginBottom: 4 },
  subtitle:  { fontSize: 14, color: colors.text2, marginBottom: 18 },
  forgot:    { textAlign: 'center', fontSize: 13, color: colors.text3, marginTop: 14 },
  footer:    { flexDirection: 'row', justifyContent: 'center', marginBottom: 16 },
  footerText:{ fontSize: 14, color: colors.text2 },
  footerLink:{ fontSize: 14, color: colors.accent, fontWeight: '600' },
  demo:      { backgroundColor: colors.card2, borderRadius: 10, padding: 12, marginTop: 4 },
  demoText:  { fontSize: 12, color: colors.text3, marginBottom: 2 },
});
