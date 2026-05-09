import { useState, useEffect } from 'react'
import { getWeather } from '../services/weatherService'

export function useWeather(city) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!city) return
    let cancelled = false
    setLoading(true)
    setError(null)
    getWeather(city).then(d => {
      if (!cancelled) { setData(d); setLoading(false) }
    }).catch(e => {
      if (!cancelled) { setError(e); setLoading(false) }
    })
    return () => { cancelled = true }
  }, [city])

  return { data, loading, error }
}
