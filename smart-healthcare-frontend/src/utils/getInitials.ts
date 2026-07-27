const TITLE_PREFIXES = new Set(['dr', 'mr', 'mrs', 'ms', 'prof']);

export function getInitials(username: string | undefined): string {
  if (!username) return '?';
  const parts = username
    .split(/[\s_.-]+/)
    .filter(Boolean)
    .filter((part) => !TITLE_PREFIXES.has(part.toLowerCase()));

  if (parts.length === 0) return username.slice(0, 2).toUpperCase();
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}