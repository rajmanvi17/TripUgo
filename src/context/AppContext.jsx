import { createContext, useContext, useReducer, useEffect } from 'react'

const AppContext = createContext(null)

const STORAGE_KEY = 'wanderai_v1'

const defaultState = {
  selectedCountry: 'japan',
  baseCurrency: 'USD',
  savedItineraries: {},   // { countryKey: [{ id, day, places }] }
  savedCountries: [],     // offline saved country slugs
  expenses: [],           // [{ id, label, category, amount, date }]
  checklist: {},          // { countryKey: { itemId: checked } }
  budget: 2000,
  tripDays: 3,
}

function reducer(state, action) {
  switch (action.type) {
    case 'SET_COUNTRY':        return { ...state, selectedCountry: action.payload }
    case 'SET_CURRENCY':       return { ...state, baseCurrency: action.payload }
    case 'SET_BUDGET':         return { ...state, budget: action.payload }
    case 'SET_TRIP_DAYS':      return { ...state, tripDays: action.payload }
    case 'SAVE_ITINERARY':     return { ...state, savedItineraries: { ...state.savedItineraries, [action.key]: action.payload } }
    case 'ADD_EXPENSE':        return { ...state, expenses: [...state.expenses, action.payload] }
    case 'REMOVE_EXPENSE':     return { ...state, expenses: state.expenses.filter(e => e.id !== action.payload) }
    case 'TOGGLE_CHECK':       return {
      ...state,
      checklist: {
        ...state.checklist,
        [action.country]: { ...state.checklist[action.country], [action.item]: !state.checklist[action.country]?.[action.item] }
      }
    }
    case 'SAVE_COUNTRY': {
      const already = state.savedCountries.includes(action.payload)
      return { ...state, savedCountries: already ? state.savedCountries.filter(c => c !== action.payload) : [...state.savedCountries, action.payload] }
    }
    case 'LOAD_STORED':        return { ...defaultState, ...action.payload }
    default:                   return state
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, defaultState, () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? { ...defaultState, ...JSON.parse(stored) } : defaultState
    } catch { return defaultState }
  })

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)) } catch {}
  }, [state])

  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>
}

export const useApp = () => {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used inside AppProvider')
  return ctx
}
