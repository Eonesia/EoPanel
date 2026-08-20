export function NotificationBadge({ count }: { count: number }) {
  if (!count) return null;
  return <span className="badge-count">{count > 99 ? "99+" : count}</span>;
}
