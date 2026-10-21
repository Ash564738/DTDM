export function formatDate(isoString: string): string {
  try {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  } catch {
    return isoString;
  }
}

export function formatTime(isoString: string): string {
  try {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(date);
  } catch {
    return isoString;
  }
}

export function formatDateTime(isoString: string): string {
  return `${formatDate(isoString)} at ${formatTime(isoString)}`;
}

export function formatPrice(price: number, currency = 'USD'): string {
  if (price === 0) return 'Free';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(price);
}

export function getCategoryBadgeClass(category: string): string {
  switch (category) {
    case 'Technology':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'Music & Concerts':
      return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'Business & Networking':
      return 'bg-amber-100 text-amber-800 border-amber-200';
    case 'Workshops & Education':
      return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    case 'Sports & Fitness':
      return 'bg-rose-100 text-rose-800 border-rose-200';
    case 'Arts & Culture':
      return 'bg-indigo-100 text-indigo-800 border-indigo-200';
    default:
      return 'bg-slate-100 text-slate-800 border-slate-200';
  }
}
