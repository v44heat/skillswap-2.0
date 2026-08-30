export const colors = {
  bg:         '#0B0F1A',
  bg2:        '#111827',
  card:       '#161e2e',
  card2:      '#1e2a3d',
  border:     'rgba(255,255,255,0.07)',
  border2:    'rgba(255,255,255,0.12)',
  text:       '#f0f4ff',
  text2:      '#8b9cc8',
  text3:      '#5a6b8a',
  accent:     '#4F7FFF',
  accent2:    '#7B5CFF',
  accentGlow: 'rgba(79,127,255,0.18)',
  green:      '#22c55e',
  red:        '#ef4444',
  amber:      '#f59e0b',
  cyan:       '#06b6d4',
};

export const proficiencyColor = (level) =>
  ({ BEGINNER: colors.cyan, INTERMEDIATE: colors.accent, ADVANCED: colors.accent2, EXPERT: colors.amber }[level] || colors.accent);

export const statusColor = (status) =>
  ({ PENDING: colors.amber, ACCEPTED: colors.green, REJECTED: colors.red, CANCELLED: colors.red, CONFIRMED: colors.green, COMPLETED: colors.accent }[status] || colors.accent);

export const categoryColor = (cat) =>
  ({ Programming: colors.accent, Mathematics: colors.amber, Languages: colors.green, Design: colors.accent2, Music: colors.cyan, Writing: colors.red, Science: colors.green, Business: colors.amber }[cat] || colors.text3);

export const initials = (name = '') =>
  name.split(' ').map((w) => w[0] || '').join('').slice(0, 2).toUpperCase() || '??';

export const timeAgo = (dateStr) => {
  if (!dateStr) return '';
  const diff = (Date.now() - new Date(dateStr)) / 1000;
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

export const formatDate = (d) => {
  if (!d) return '—';
  try { return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }); }
  catch { return '—'; }
};

export const formatTime = (t) => {
  if (!t) return '—';
  const [h, m] = t.split(':');
  const hour = parseInt(h, 10);
  return `${hour > 12 ? hour - 12 : hour || 12}:${m || '00'} ${hour >= 12 ? 'PM' : 'AM'}`;
};
