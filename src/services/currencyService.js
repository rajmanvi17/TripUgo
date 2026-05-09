const API_KEY = import.meta.env.VITE_EXCHANGE_KEY
const CACHE_KEY = 'wanderai_rates'
const CACHE_TTL = 6 * 60 * 60 * 1000 // 6 hours

const MOCK_RATES_USD = {
  USD: 1, EUR: 0.921, GBP: 0.788, JPY: 149.2, INR: 83.4,
  AUD: 1.53, CAD: 1.36, CHF: 0.89, SGD: 1.35, AED: 3.67,
  THB: 35.8, MYR: 4.72, KRW: 1325, CNY: 7.24, MXN: 17.1
}

function loadCached() {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const { data, ts } = JSON.parse(raw)
    if (Date.now() - ts > CACHE_TTL) { localStorage.removeItem(CACHE_KEY); return null }
    return data
  } catch { return null }
}

function saveCache(data) {
  try { localStorage.setItem(CACHE_KEY, JSON.stringify({ data, ts: Date.now() })) } catch {}
}

let ratesPromise = null

export async function getRates(base = 'USD') {
  // Singleton promise — only one fetch at a time
  if (!ratesPromise) {
    ratesPromise = (async () => {
      const cached = loadCached()
      if (cached) return cached

      if (!API_KEY || API_KEY === 'your_exchangerate_api_key_here') {
        return MOCK_RATES_USD
      }

      try {
        const res = await fetch(`https://v6.exchangerate-api.com/v6/${API_KEY}/latest/USD`)
        const json = await res.json()
        if (json.result === 'success') {
          saveCache(json.conversion_rates)
          return json.conversion_rates
        }
        return MOCK_RATES_USD
      } catch { return MOCK_RATES_USD }
    })()
  }

  const rates = await ratesPromise
  if (base === 'USD') return rates

  // Rebase to requested currency
  const baseRate = rates[base] || 1
  const rebased = {}
  for (const [k, v] of Object.entries(rates)) rebased[k] = v / baseRate
  return rebased
}

export function convert(amount, rates, toCurrency) {
  return amount * (rates[toCurrency] || 1)
}

export const DISPLAY_PAIRS = [
  { code: 'JPY', symbol: '¥', flag: '🇯🇵', name: 'Japanese Yen' },
  { code: 'EUR', symbol: '€', flag: '🇪🇺', name: 'Euro' },
  { code: 'GBP', symbol: '£', flag: '🇬🇧', name: 'Brit. Pound' },
  { code: 'INR', symbol: '₹', flag: '🇮🇳', name: 'Indian Rupee' },
  { code: 'AUD', symbol: 'A$', flag: '🇦🇺', name: 'Australian Dollar' },
  { code: 'AED', symbol: 'د.إ', flag: '🇦🇪', name: 'UAE Dirham' },
]
