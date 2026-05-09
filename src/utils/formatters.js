export const fmt = {
  currency: (val, symbol = '$', decimals = 2) =>
    `${symbol}${Number(val).toLocaleString('en', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}`,

  percent: (val) => `${Math.round(val)}%`,

  temp: (val, unit = 'C') => `${Math.round(val)}°${unit}`,

  time: (date, tz) =>
    new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: tz }).format(date),

  date: (date) => new Intl.DateTimeFormat('en-US', { weekday: 'short', month: 'short', day: 'numeric' }).format(date),

  stars: (rating) => '★'.repeat(rating) + '☆'.repeat(5 - rating),

  uid: () => Math.random().toString(36).slice(2, 9),
}
