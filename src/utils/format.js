function isMissing(value) {
  return value === null || value === undefined || Number.isNaN(Number(value));
}

export function formatCurrency(value, currency = 'brl') {
  if (isMissing(value)) {
    return '—';
  }

  const number = Number(value);
  const isSmall = Math.abs(number) > 0 && Math.abs(number) < 1;

  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: currency.toUpperCase(),
    minimumFractionDigits: 2,
    maximumFractionDigits: isSmall ? 8 : 2,
  }).format(number);
}

export function formatCompact(value, currency = 'brl') {
  if (isMissing(value)) {
    return '—';
  }

  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: currency.toUpperCase(),
    notation: 'compact',
    maximumFractionDigits: 2,
  }).format(Number(value));
}

export function formatCompactNumber(value) {
  if (isMissing(value)) {
    return '—';
  }

  return new Intl.NumberFormat('pt-BR', {
    notation: 'compact',
    maximumFractionDigits: 2,
  }).format(Number(value));
}

export function formatPercent(value) {
  if (isMissing(value)) {
    return '—';
  }

  const number = Number(value);
  const formatted = new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Math.abs(number));

  if (number === 0) {
    return '0,00%';
  }

  return `${number > 0 ? '+' : '-'}${formatted}%`;
}

export function formatDate(value) {
  if (!value) {
    return '—';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}

export function formatTime(value) {
  if (!value) {
    return '—';
  }

  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '—';
  }

  return new Intl.DateTimeFormat('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}
