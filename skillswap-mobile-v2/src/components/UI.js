import React from 'react';
import {
  View, Text, TouchableOpacity, ActivityIndicator,
  StyleSheet, TextInput, Modal,
} from 'react-native';
import { colors, initials, statusColor, proficiencyColor } from '../utils/theme';

/* ── Avatar ── */
export function Avatar({ name = '', size = 40 }) {
  return (
    <View style={[s.avatar, { width: size, height: size, borderRadius: size / 2 }]}>
      <Text style={[s.avatarText, { fontSize: size * 0.35 }]}>{initials(name)}</Text>
    </View>
  );
}

/* ── Badge ── */
export function Badge({ text, color }) {
  const c = color || statusColor(String(text));
  return (
    <View style={[s.badge, { backgroundColor: c + '22', borderColor: c + '55' }]}>
      <Text style={[s.badgeText, { color: c }]}>{text}</Text>
    </View>
  );
}

/* ── ProficiencyBadge ── */
export function ProficiencyBadge({ level }) {
  const c = proficiencyColor(level);
  return (
    <View style={[s.badge, { backgroundColor: c + '22', borderColor: c + '55' }]}>
      <Text style={[s.badgeText, { color: c }]}>{level}</Text>
    </View>
  );
}

/* ── Button ── */
export function Button({ title, onPress, variant = 'primary', loading = false, disabled = false, style }) {
  const bg =
    variant === 'primary' ? colors.accent :
    variant === 'danger'  ? 'rgba(239,68,68,0.15)' :
    variant === 'success' ? 'rgba(34,197,94,0.15)' :
    'transparent';
  const tc =
    variant === 'primary' ? '#fff' :
    variant === 'danger'  ? colors.red :
    variant === 'success' ? colors.green :
    colors.text2;
  const bc =
    variant === 'danger'  ? 'rgba(239,68,68,0.4)' :
    variant === 'success' ? 'rgba(34,197,94,0.4)' :
    variant === 'outline' ? colors.border2 :
    'transparent';

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={loading || disabled}
      activeOpacity={0.75}
      style={[
        s.btn,
        { backgroundColor: bg, borderColor: bc, borderWidth: variant !== 'primary' ? 1 : 0 },
        style,
        (loading || disabled) && { opacity: 0.55 },
      ]}
    >
      {loading
        ? <ActivityIndicator color={tc} size="small" />
        : <Text style={[s.btnText, { color: tc }]}>{title}</Text>}
    </TouchableOpacity>
  );
}

/* ── Input ── */
export function Input({ label, error, style, ...props }) {
  return (
    <View style={s.inputWrap}>
      {label ? <Text style={s.inputLabel}>{label}</Text> : null}
      <TextInput
        style={[s.input, error ? { borderColor: colors.red } : null, style]}
        placeholderTextColor={colors.text3}
        {...props}
      />
      {error ? <Text style={s.inputErr}>{error}</Text> : null}
    </View>
  );
}

/* ── Card ── */
export function Card({ children, style }) {
  return <View style={[s.card, style]}>{children}</View>;
}

/* ── Card2 ── */
export function Card2({ children, style }) {
  return <View style={[s.card2, style]}>{children}</View>;
}

/* ── SectionHeader ── */
export function SectionHeader({ title, action, actionLabel }) {
  return (
    <View style={s.secHead}>
      <Text style={s.secTitle}>{title}</Text>
      {action
        ? <TouchableOpacity onPress={action}><Text style={s.secAction}>{actionLabel}</Text></TouchableOpacity>
        : null}
    </View>
  );
}

/* ── EmptyState ── */
export function EmptyState({ icon = '📭', title, subtitle, action, actionLabel }) {
  return (
    <View style={s.empty}>
      <Text style={s.emptyIcon}>{icon}</Text>
      <Text style={s.emptyTitle}>{title}</Text>
      {subtitle ? <Text style={s.emptySub}>{subtitle}</Text> : null}
      {action
        ? <Button title={actionLabel} onPress={action} style={{ marginTop: 16, paddingHorizontal: 28 }} />
        : null}
    </View>
  );
}

/* ── LoadingScreen ── */
export function LoadingScreen() {
  return (
    <View style={s.loadWrap}>
      <View style={s.loadLogo}><Text style={{ fontSize: 32 }}>⚡</Text></View>
      <ActivityIndicator color={colors.accent} size="large" style={{ marginTop: 24 }} />
    </View>
  );
}

/* ── ErrorBox ── */
export function ErrorBox({ message }) {
  if (!message) return null;
  return (
    <View style={s.errBox}>
      <Text style={s.errText}>{message}</Text>
    </View>
  );
}

/* ── ConfirmModal ── */
export function ConfirmModal({ visible, title, message, onConfirm, onCancel, danger = false }) {
  return (
    <Modal visible={!!visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={s.modalOverlay}>
        <View style={s.modalBox}>
          <Text style={s.modalTitle}>{title}</Text>
          <Text style={s.modalMsg}>{message}</Text>
          <View style={{ flexDirection: 'row', gap: 10, marginTop: 20 }}>
            <Button title="Cancel"  onPress={onCancel}  variant="outline" style={{ flex: 1 }} />
            <Button title="Confirm" onPress={onConfirm} variant={danger ? 'danger' : 'primary'} style={{ flex: 1 }} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

/* ── StarRating ── */
export function StarRating({ value = 0, onChange, size = 32 }) {
  return (
    <View style={{ flexDirection: 'row', gap: 6, justifyContent: 'center' }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <TouchableOpacity key={n} onPress={() => onChange && onChange(n)} hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}>
          <Text style={{ fontSize: size, color: n <= value ? colors.amber : colors.text3 }}>★</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

/* ── Divider ── */
export function Divider({ style }) {
  return <View style={[{ height: 1, backgroundColor: colors.border, marginVertical: 12 }, style]} />;
}

const s = StyleSheet.create({
  avatar:     { backgroundColor: 'rgba(79,127,255,0.18)', borderWidth: 2, borderColor: colors.accent, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: colors.accent, fontWeight: '700' },
  badge:      { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20, borderWidth: 1, alignSelf: 'flex-start' },
  badgeText:  { fontSize: 11, fontWeight: '600' },
  btn:        { paddingVertical: 13, paddingHorizontal: 20, borderRadius: 10, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' },
  btnText:    { fontSize: 15, fontWeight: '600' },
  inputWrap:  { marginBottom: 14 },
  inputLabel: { fontSize: 13, color: colors.text2, marginBottom: 6, fontWeight: '500' },
  input:      { backgroundColor: colors.bg2, borderWidth: 1, borderColor: colors.border2, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, color: colors.text, fontSize: 15 },
  inputErr:   { color: colors.red, fontSize: 12, marginTop: 4 },
  card:       { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: 14, padding: 16, marginBottom: 12 },
  card2:      { backgroundColor: colors.card2, borderWidth: 1, borderColor: colors.border, borderRadius: 12, padding: 12 },
  secHead:    { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  secTitle:   { fontSize: 16, fontWeight: '700', color: colors.text },
  secAction:  { fontSize: 13, color: colors.accent, fontWeight: '500' },
  empty:      { alignItems: 'center', paddingVertical: 52, paddingHorizontal: 24 },
  emptyIcon:  { fontSize: 48, marginBottom: 14 },
  emptyTitle: { fontSize: 16, fontWeight: '600', color: colors.text2, marginBottom: 6, textAlign: 'center' },
  emptySub:   { fontSize: 14, color: colors.text3, textAlign: 'center', lineHeight: 20 },
  loadWrap:   { flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' },
  loadLogo:   { width: 72, height: 72, backgroundColor: colors.accent, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  errBox:     { backgroundColor: 'rgba(239,68,68,0.1)', borderWidth: 1, borderColor: 'rgba(239,68,68,0.3)', borderRadius: 10, padding: 12, marginBottom: 12 },
  errText:    { color: colors.red, fontSize: 13, lineHeight: 18 },
  modalOverlay:{ flex: 1, backgroundColor: 'rgba(0,0,0,0.65)', justifyContent: 'center', alignItems: 'center', padding: 24 },
  modalBox:   { backgroundColor: colors.bg2, borderRadius: 16, padding: 24, width: '100%', borderWidth: 1, borderColor: colors.border2 },
  modalTitle: { fontSize: 18, fontWeight: '700', color: colors.text, marginBottom: 8 },
  modalMsg:   { fontSize: 14, color: colors.text2, lineHeight: 20 },
});
