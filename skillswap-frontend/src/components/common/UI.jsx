import React from 'react';
import { initials, proficiencyColor, statusBadgeColor } from '../../utils/helpers';

/* ── Spinner ── */
export function Spinner({ size = 18 }) {
  return (
    <span
      className="spinner"
      style={{ width: size, height: size }}
      aria-label="Loading"
    />
  );
}

/* ── Avatar ── */
export function Avatar({ name = '', size = 36 }) {
  return (
    <div
      className="avatar"
      style={{ width: size, height: size, fontSize: size * 0.36 }}
      aria-label={name}
    >
      {initials(name)}
    </div>
  );
}

/* ── Badge ── */
export function Badge({ text, color }) {
  const resolvedColor = color || statusBadgeColor(text);
  return <span className={`badge badge-${resolvedColor}`}>{text}</span>;
}

/* ── ProficiencyBadge ── */
export function ProficiencyBadge({ level }) {
  return <Badge text={level} color={proficiencyColor(level)} />;
}

/* ── Toggle ── */
export function Toggle({ on, onChange, label }) {
  return (
    <button
      className={`toggle${on ? ' on' : ''}`}
      onClick={onChange}
      aria-label={label || 'toggle'}
      type="button"
    />
  );
}

/* ── Modal ── */
export function Modal({ title, onClose, children, maxWidth = 520 }) {
  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: 18, fontWeight: 700 }}>{title}</h3>
          <button className="btn btn-outline btn-sm" onClick={onClose} type="button">✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

/* ── ConfirmModal ── */
export function ConfirmModal({ title, message, onConfirm, onClose, danger = false, confirmLabel = 'Confirm' }) {
  return (
    <Modal title={title || 'Confirm action'} onClose={onClose}>
      <p style={{ color: 'var(--text2)', marginBottom: 24, fontSize: 14, lineHeight: 1.6 }}>{message}</p>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
        <button className="btn btn-outline" onClick={onClose} type="button">Cancel</button>
        <button
          className={`btn ${danger ? 'btn-danger' : 'btn-primary'}`}
          onClick={() => { onConfirm(); onClose(); }}
          type="button"
        >
          {confirmLabel}
        </button>
      </div>
    </Modal>
  );
}

/* ── Empty state ── */
export function EmptyState({ icon = '📭', title, subtitle, action, actionLabel }) {
  return (
    <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text3)' }}>
      <div style={{ fontSize: 44, marginBottom: 14 }}>{icon}</div>
      <p style={{ fontSize: 16, color: 'var(--text2)', marginBottom: 6, fontWeight: 500 }}>{title}</p>
      {subtitle && <p style={{ fontSize: 14, marginBottom: 20 }}>{subtitle}</p>}
      {action && (
        <button className="btn btn-primary" onClick={action} type="button">{actionLabel}</button>
      )}
    </div>
  );
}

/* ── LoadingScreen ── */
export function LoadingScreen() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 48, height: 48, background: 'var(--accent)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, margin: '0 auto 16px' }}>⚡</div>
        <Spinner size={24} />
      </div>
    </div>
  );
}

/* ── ErrorBox ── */
export function ErrorBox({ message }) {
  if (!message) return null;
  return <div className="error-box">{message}</div>;
}

/* ── FormField ── */
export function FormField({ label, required, children, hint }) {
  return (
    <div>
      <label className="label">{label}{required && ' *'}</label>
      {children}
      {hint && <p style={{ fontSize: 12, color: 'var(--text3)', marginTop: 4 }}>{hint}</p>}
    </div>
  );
}

/* ── StarRating ── */
export function StarRating({ value, onChange, readonly = false }) {
  return (
    <div style={{ display: 'flex', gap: 4, justifyContent: 'center' }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          className={`star-btn${n <= value ? ' filled' : ''}`}
          onClick={() => !readonly && onChange(n)}
          style={{ cursor: readonly ? 'default' : 'pointer' }}
        >
          ★
        </button>
      ))}
    </div>
  );
}
