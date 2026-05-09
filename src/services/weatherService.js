const API_KEY = import.meta.env.VITE_OPENWEATHER_KEY
const BASE = 'https://api.openweathermap.org/data/2.5'
const CACHE_TTL = 30 * 60 * 1000 // 30 minutes

// In-memory cache (resets on page refresh — no localStorage bloat)
const cache = new Map()

function getCached(key) {
  const entry = cache.get(key)
  if (!entry) return null
  if (Date.now() - entry.ts > CACHE_TTL) { cache.delete(key); return null }
  return entry.data
}
function setCache(key, data) { cache.set(key, { data, ts: Date.now() }) }

// Mock fallback when no API key
const MOCK = {
  Tokyo:    { temp: 22, feels_like: 20, humidity: 65, wind: 12, uv: 4, desc: 'Partly Cloudy', icon: '⛅', forecast: [{ day:'Mon',icon:'⛅',high:22,low:16 },{ day:'Tue',icon:'🌧',high:18,low:14 },{ day:'Wed',icon:'🌤',high:24,low:17 },{ day:'Thu',icon:'☀️',high:27,low:19 },{ day:'Fri',icon:'⛅',high:23,low:17 }] },
  Paris:    { temp: 16, feels_like: 14, humidity: 72, wind: 18, uv: 2, desc: 'Cloudy',       icon: '☁️', forecast: [{ day:'Mon',icon:'🌧',high:16,low:11 },{ day:'Tue',icon:'⛅',high:18,low:12 },{ day:'Wed',icon:'☀️',high:21,low:13 },{ day:'Thu',icon:'☀️',high:22,low:14 },{ day:'Fri',icon:'⛅',high:19,low:12 }] },
  Delhi:    { temp: 28, feels_like: 32, humidity: 45, wind: 8,  uv: 8, desc: 'Sunny',        icon: '☀️', forecast: [{ day:'Mon',icon:'☀️',high:30,low:22 },{ day:'Tue',icon:'☀️',high:31,low:23 },{ day:'Wed',icon:'🌤',high:28,low:20 },{ day:'Thu',icon:'⛅',high:27,low:19 },{ day:'Fri',icon:'☀️',high:29,low:21 }] },
  'New York':{ temp: 18, feels_like: 17, humidity: 50, wind: 15, uv: 5, desc: 'Clear',       icon: '🌤', forecast: [{ day:'Mon',icon:'🌤',high:20,low:13 },{ day:'Tue',icon:'⛅',high:18,low:12 },{ day:'Wed',icon:'🌧',high:15,low:10 },{ day:'Thu',icon:'⛅',high:17,low:11 },{ day:'Fri',icon:'☀️',high:21,low:14 }] },
}

const OW_ICON_MAP = {
  '01d':'☀️','01n':'🌙','02d':'🌤','02n':'🌤','03d':'⛅','03n':'⛅',
  '04d':'☁️','04n':'☁️','09d':'🌧','09n':'🌧','10d':'🌦','10n':'🌦',
  '11d':'⛈','11n':'⛈','13d':'❄️','13n':'❄️','50d':'🌫','50n':'🌫'
}

export async function getWeather(city) {
  const cacheKey = `weather_${city}`
  const cached = getCached(cacheKey)
  if (cached) return cached

  if (!API_KEY || API_KEY === 'your_openweathermap_api_key_here') {
    return MOCK[city] || MOCK['Tokyo']
  }

  try {
    const [current, forecast] = await Promise.all([
      fetch(`${BASE}/weather?q=${city}&units=metric&appid=${API_KEY}`).then(r => r.json()),
      fetch(`${BASE}/forecast?q=${city}&units=metric&cnt=5&appid=${API_KEY}`).then(r => r.json())
    ])
    const result = {
      temp: Math.round(current.main.temp),
      feels_like: Math.round(current.main.feels_like),
      humidity: current.main.humidity,
      wind: Math.round(current.wind.speed * 3.6),
      uv: 0,
      desc: current.weather[0].description,
      icon: OW_ICON_MAP[current.weather[0].icon] || '🌤',
      forecast: forecast.list.map((item, i) => ({
        day: new Date(item.dt * 1000).toLocaleDateString('en', { weekday: 'short' }),
        icon: OW_ICON_MAP[item.weather[0].icon] || '🌤',
        high: Math.round(item.main.temp_max),
        low: Math.round(item.main.temp_min)
      }))
    }
    setCache(cacheKey, result)
    return result
  } catch {
    return MOCK[city] || MOCK['Tokyo']
  }
}
