import { NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useApp } from '../../context/AppContext'
import countries from '../../data/countries.json'
import toast from 'react-hot-toast'

const NAV = [
  { section:'EXPLORE', items:[
    { to:'/dashboard', icon:'🌍', label:'Country Dashboard' },
    { to:'/map',       icon:'🗺',  label:'Map & Places' },
    { to:'/compare',   icon:'🔄', label:'Compare Countries' },
    { to:'/local',     icon:'🍜', label:'Local Experience' },
  ]},
  { section:'PLAN', items:[
    { to:'/itinerary', icon:'📅', label:'Itinerary Builder' },
    { to:'/budget',    icon:'💰', label:'Budget Planner' },
    { to:'/packing',   icon:'🧳', label:'Packing Checklist' },
  ]},
  { section:'TOOLS', items:[
    { to:'/emergency', icon:'🆘', label:'Emergency Info' },
    { to:'/utilities', icon:'📊', label:'Mini Utilities' },
    { to:'/assistant', icon:'🤖', label:'AI Assistant' },
  ]},
]

function CountryModal({ onClose }) {
  const { state, dispatch } = useApp()
  return (
    <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}>
      <motion.div className="absolute inset-0" style={{ background:'rgba(5,10,20,0.7)', backdropFilter:'blur(6px)' }}
        onClick={onClose} initial={{ opacity:0 }} animate={{ opacity:1 }} />
      <motion.div className="relative z-10 w-full max-w-sm"
        style={{ background:'rgba(15,25,42,0.95)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:22, padding:22, boxShadow:'0 24px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.07)' }}
        initial={{ opacity:0, scale:0.93, y:24 }}
        animate={{ opacity:1, scale:1, y:0 }}
        exit={{ opacity:0, scale:0.95, y:12 }}
        transition={{ type:'spring', stiffness:340, damping:30 }}>
        <div className="flex items-center justify-between mb-4">
          <div className="font-bold text-base text-white">🌍 Switch Destination</div>
          <motion.button onClick={onClose} whileTap={{ scale:0.9 }}
            className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-sm"
            style={{ background:'rgba(255,255,255,0.07)', color:'var(--muted)', border:'1px solid rgba(255,255,255,0.1)' }}>✕</motion.button>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(countries).map(([key,c],i) => {
            const active = state.selectedCountry === key
            return (
              <motion.button key={key}
                onClick={() => { dispatch({ type:'SET_COUNTRY', payload:key }); toast.success(`${c.flag} Switched to ${c.name}!`); onClose() }}
                className="flex items-center gap-2.5 p-3 rounded-2xl border text-left transition-all"
                style={active
                  ? { background:'rgba(59,130,246,0.18)', borderColor:'rgba(59,130,246,0.38)', color:'#93C5FD' }
                  : { background:'rgba(255,255,255,0.04)', borderColor:'rgba(255,255,255,0.08)', color:'rgba(255,255,255,0.8)' }}
                initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.05 }}
                whileHover={{ background: active?'rgba(59,130,246,0.22)':'rgba(255,255,255,0.08)', y:-1 }}
                whileTap={{ scale:0.97 }}>
                <span className="text-2xl">{c.flag}</span>
                <div>
                  <div className="text-sm font-bold">{c.name}</div>
                  <div className="text-xs font-medium" style={{ color:'var(--muted)' }}>{c.capital}</div>
                </div>
                {active && <span className="ml-auto text-sm font-bold" style={{ color:'#60A5FA' }}>✓</span>}
              </motion.button>
            )
          })}
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function Sidebar({ onClose }) {
  const { user, logout } = useAuth()
  const { state } = useApp()
  const navigate = useNavigate()
  const country = countries[state.selectedCountry]
  const [showCountry, setShowCountry] = useState(false)

  return (
    <>
      <AnimatePresence>{showCountry && <CountryModal onClose={() => setShowCountry(false)} />}</AnimatePresence>

      <aside className="w-60 h-full flex flex-col relative z-10"
        style={{ background:'var(--sidebar)', borderRight:'1px solid rgba(255,255,255,0.06)' }}>
        {/* Logo */}
        <div className="px-5 py-5 flex items-center justify-between" style={{ borderBottom:'1px solid rgba(255,255,255,0.07)' }}>
          <div className="flex items-center gap-2.5">
            <motion.div className="w-9 h-9 rounded-xl flex items-center justify-center text-base font-bold"
              style={{ background:'var(--g-cyan)', boxShadow:'0 4px 16px rgba(59,130,246,0.35)' }}
              whileHover={{ rotate:[-4,4,0], transition:{ duration:0.4 } }}>⛱</motion.div>
            <div>
              <div className="font-bold text-lg text-white" style={{ letterSpacing:'-0.3px' }}>TripUgo</div>
              <div className="text-[9px] font-bold tracking-widest uppercase" style={{ color:'rgba(255,255,255,0.28)' }}>Smart Travel</div>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background:'rgba(255,255,255,0.07)', color:'var(--muted)' }}>✕</button>
        </div>

        {/* Country switcher */}
        <div className="px-4 py-3" style={{ borderBottom:'1px solid rgba(255,255,255,0.07)' }}>
          <div className="text-[9px] font-bold tracking-widest uppercase mb-2 px-1" style={{ color:'rgba(255,255,255,0.22)' }}>EXPLORING</div>
          <motion.button onClick={() => setShowCountry(true)} className="country-pill" whileHover={{ y:-1 }} whileTap={{ scale:0.98 }}>
            <span className="text-xl">{country?.flag}</span>
            <div className="flex-1 text-left">
              <div className="font-bold text-sm text-white">{country?.name}</div>
              <div className="text-[10px] font-medium" style={{ color:'var(--muted)' }}>{country?.capital}</div>
            </div>
            <span style={{ color:'var(--muted)', fontSize:14 }}>⇅</span>
          </motion.button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-3 px-3">
          {NAV.map(({ section, items }, si) => (
            <motion.div key={section} className="mb-3"
              initial={{ opacity:0, x:-10 }} animate={{ opacity:1, x:0 }} transition={{ delay:si*0.05 }}>
              <div className="text-[9px] font-bold tracking-widest uppercase px-3 mb-1.5" style={{ color:'rgba(255,255,255,0.22)' }}>{section}</div>
              {items.map(({ to, icon, label }) => (
                <NavLink key={to} to={to} onClick={onClose}
                  className={({ isActive }) => `nav-item ${isActive?'active':''}`}>
                  <span className="text-sm w-5 text-center flex-shrink-0">{icon}</span>
                  <span>{label}</span>
                </NavLink>
              ))}
            </motion.div>
          ))}
        </nav>

        {/* User section */}
        <div className="p-4" style={{ borderTop:'1px solid rgba(255,255,255,0.07)' }}>
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
              style={{ background:'linear-gradient(135deg,#3B82F6,#8B5CF6)', color:'#fff' }}>
              {user?.avatar || 'T'}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-bold text-white truncate">{user?.name || 'Traveler'}</div>
              <div className="text-[10px] font-medium truncate" style={{ color:'rgba(255,255,255,0.3)' }}>{user?.email}</div>
            </div>
          </div>
          <motion.button onClick={() => { logout(); navigate('/auth'); toast.success('Logged out') }}
            className="btn btn-ghost w-full justify-center text-xs py-2" style={{ borderRadius:9 }}
            whileTap={{ scale:0.97 }}>
            🚪 Sign Out
          </motion.button>
        </div>
      </aside>
    </>
  )
}
