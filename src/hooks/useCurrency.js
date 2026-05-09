import { useState, useEffect } from 'react'
import { getRates } from '../services/currencyService'

export function useCurrency(base = 'USD') {
  const [rates, setRates] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    getRates(base).then(r => {
      if (!cancelled) { setRates(r); setLoading(false) }
    }).catch(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [base])

  return { rates, loading }
}
