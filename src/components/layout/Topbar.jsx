import { useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useApp } from '../../context/AppContext'
import { useAuth } from '../../context/AuthContext'
import countries from '../../data/countries.json'
import { useState, useEffect } from 'react'
import { fmt } from '../../utils/formatters'

const PAGE_META = {
  '/dashboard':['🌍','Country Dashboard'],'/map':['🗺','Map & Places'],
  '/compare':['🔄','Compare Countries'],'/local':['🍜','Local Experience'],
  '/itinerary':['📅','Itinerary Builder'],'/budget':['💰','Budget Planner'],
  '/packing':['🧳','Packing Checklist'],'/emergency':['🆘','Emergency Info'],
  '/utilities':['📊','Mini Utilities'],'/assistant':['🤖','AI Assistant'],
}
function LiveClock({ tz, flag }) {
  const [time, setTime] = useState(() => fmt.time(new Date(), tz))
  useEffect(() => { const id = setInterval(() => setTime(fmt.time(new Date(), tz)), 1000); return () => clearInterval(id) }, [tz])
  return (
    <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold"
      style={{ background:'rgba(59,130,246,0.1)', border:'1px solid rgba(59,130,246,0.2)', color:'#60A5FA' }}>
      <span>{flag}</span> {time}
    </div>
  )
}
export default function Topbar({ onMenuClick }) {
  const { pathname } = useLocation()
  const { state } = useApp()
  const { user } = useAuth()
  const country = countries[state.selectedCountry]
  const [icon, title] = PAGE_META[pathname] || ['✈','TripUgo']
  return (
    <motion.header className="flex items-center justify-between px-5 h-[52px] flex-shrink-0"
      style={{ background:'rgba(10,17,28,0.85)', backdropFilter:'blur(20px)', borderBottom:'1px solid rgba(255,255,255,0.07)', boxShadow:'0 1px 0 rgba(0,0,0,0.3)' }}
      initial={{ opacity:0, y:-8 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.3 }}>
      <div className="flex items-center gap-3">
        <button onClick={onMenuClick} className="lg:hidden p-1.5 rounded-lg" style={{ background:'rgba(255,255,255,0.07)', color:'var(--muted)' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>
        <span className="text-base">{icon}</span>
        <h1 className="font-bold text-sm text-white" style={{ letterSpacing:'-0.2px' }}>{title}</h1>
        <span className="badge badge-green text-[10px]">● Live</span>
      </div>
      <div className="flex items-center gap-3">
        {country && <LiveClock tz={country.timezone} flag={country.flag} />}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium cursor-text"
          style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.08)', color:'var(--muted2)', minWidth:170 }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          Search destinations...
        </div>
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
          style={{ background:'linear-gradient(135deg,#F97316,#F59E0B)', color:'#fff' }}>
          {user?.avatar || 'T'}
        </div>
      </div>
    </motion.header>
  )
}
