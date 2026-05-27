export function timeAgo(dateStr) {
  const diff = (Date.now() - new Date(dateStr)) / 1000;
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function formatTime(timeStr) {
  if (!timeStr) return '—';
  const [h, m] = timeStr.split(':');
  const hour = parseInt(h, 10);
  return `${hour > 12 ? hour - 12 : hour || 12}:${m} ${hour >= 12 ? 'PM' : 'AM'}`;
}

export function initials(name = '') {
  return name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
}

export function proficiencyPct(level) {
  return { BEGINNER: 25, INTERMEDIATE: 50, ADVANCED: 75, EXPERT: 100 }[level] || 50;
}

export function proficiencyColor(level) {
  return { BEGINNER: 'cyan', INTERMEDIATE: 'blue', ADVANCED: 'purple', EXPERT: 'amber' }[level] || 'blue';
}

export function statusBadgeColor(status) {
  return {
    PENDING: 'amber', ACCEPTED: 'green', REJECTED: 'red', CANCELLED: 'red',
    CONFIRMED: 'green', COMPLETED: 'blue',
  }[status] || 'blue';
}

export function isFutureDate(dateStr) {
  return new Date(dateStr) > new Date();
}
