import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useApp } from '../context/AppContext'
import countries from '../data/countries.json'
import { useWeather } from '../hooks/useWeather'
import { useCurrency } from '../hooks/useCurrency'
import { convert, DISPLAY_PAIRS } from '../services/currencyService'
import CountrySelector from '../components/ui/CountrySelector'
import { WeatherSkeleton, Skeleton } from '../components/ui/Skeleton'
import { fmt } from '../utils/formatters'
import toast from 'react-hot-toast'

const anim = i => ({ initial:{opacity:0,y:16}, animate:{opacity:1,y:0}, transition:{delay:i*0.07,duration:0.35,ease:'easeOut'} })

function LocalTime({ tz }) {
  const [t, setT] = useState(() => fmt.time(new Date(), tz))
  useEffect(() => { const id = setInterval(() => setT(fmt.time(new Date(), tz)), 1000); return () => clearInterval(id) }, [tz])
  return <>{t}</>
}

function WeatherCard({ city, country }) {
  const { data, loading } = useWeather(city)
  if (loading) return <WeatherSkeleton />
  if (!data) return null
  return (
    <motion.div className="weather-card" {...anim(0)}>
      <div className="relative z-10">
        <div className="text-xs font-semibold mb-1" style={{ color:'rgba(255,255,255,0.5)' }}>{city}, {country.name}</div>
        <div className="font-bold text-white leading-none" style={{ fontSize:60, letterSpacing:'-2px' }}>{data.temp}°C</div>
        <div className="mt-2 text-sm font-medium" style={{ color:'rgba(255,255,255,0.6)' }}>{data.desc} · Feels like {data.feels_like}°C</div>
        <div className="flex flex-wrap gap-2 mt-4">
          {[`💧 ${data.humidity}%`,`💨 ${data.wind} km/h`,`☀️ UV ${data.uv}`].map(t => (
            <span key={t} className="w-tag">{t}</span>
          ))}
        </div>
        {data.forecast && (
          <div className="grid grid-cols-5 gap-1.5 mt-4">
            {data.forecast.map((d,i) => (
              <motion.div key={i} className="fc-day"
                initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.3+i*0.05 }}>
                <div className="text-[9px] uppercase tracking-wide mb-1 font-bold" style={{ color:'rgba(255,255,255,0.4)' }}>{d.day}</div>
                <div className="text-lg">{d.icon}</div>
                <div className="text-xs font-bold mt-1 text-white">{d.high}°</div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}

function CurrencyCard() {
  const { state, dispatch } = useApp()
  const [amount, setAmount] = useState(100)
  const { rates, loading } = useCurrency(state.baseCurrency)
  return (
    <motion.div className="card h-full" {...anim(1)}>
      <div className="card-title">💱 Currency Converter</div>
      <div className="flex gap-2 mb-4">
        <input type="number" value={amount} onChange={e=>setAmount(Number(e.target.value))} className="input flex-1" min={0}/>
        <select value={state.baseCurrency} onChange={e=>dispatch({type:'SET_CURRENCY',payload:e.target.value})} className="input w-24 cursor-pointer">
          {['USD','EUR','GBP','INR','JPY','AUD'].map(c=><option key={c}>{c}</option>)}
        </select>
      </div>
      {loading
        ? <div className="space-y-2">{[1,2,3,4].map(i=><Skeleton key={i} className="h-11"/>)}</div>
        : DISPLAY_PAIRS.filter(p=>p.code!==state.baseCurrency).slice(0,5).map(({code,symbol,flag,name})=>(
            <div key={code} className="curr-row">
              <div className="flex items-center gap-2.5">
                <span className="text-xl">{flag}</span>
                <div>
                  <div className="text-sm font-bold text-white">{name}</div>
                  <div className="text-xs font-medium" style={{color:'var(--muted)'}}>{code}</div>
                </div>
              </div>
              <div className="font-bold text-sm" style={{color:'var(--blue2)'}}>
                {symbol}{rates?convert(amount,rates,code).toLocaleString('en',{maximumFractionDigits:2}):'—'}
              </div>
            </div>
          ))
      }
    </motion.div>
  )
}

export default function DashboardPage() {
  const { state, dispatch } = useApp()
  const country = countries[state.selectedCountry]
  const saved = state.savedCountries.includes(state.selectedCountry)
  return (
    <div className="light-theme min-h-screen space-y-5">
      <motion.div className="flex flex-wrap items-center gap-2.5" initial={{opacity:0,y:-8}} animate={{opacity:1,y:0}}>
        <CountrySelector/>
        <span className="badge badge-sky">🏛 {country.capital}</span>
        <span className="badge badge-amber">👥 {country.population}</span>
        <span className="badge badge-green">🗣 {country.language}</span>
        <motion.button onClick={()=>{dispatch({type:'SAVE_COUNTRY',payload:state.selectedCountry});toast.success(saved?'Removed.':country.name+' saved! 📥')}}
          className="btn ml-auto text-xs" whileTap={{scale:0.96}}>{saved?'✅ Saved':'📥 Save Offline'}</motion.button>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          {label:'LOCAL TIME',value:<LocalTime tz={country.timezone}/>,sub:country.timezone.split('/')[1]?.replace('_',' '),icon:'🕐'},
          {label:'SAFETY INDEX',value:country.safetyIndex+'/10',sub:'Safety Score',icon:'🛡'},
          {label:'COST LEVEL',value:country.costLevel,sub:'Best: '+country.bestSeason,icon:'💰'},
          {label:'VISA INFO',value:'ℹ️',sub:country.visaInfo,icon:'📋'},
        ].map((s,i)=>(
          <motion.div key={s.label} className="stat-card" {...anim(i)}>
            <div className="text-xl mb-2">{s.icon}</div>
            <div className="text-[9px] font-bold tracking-widest uppercase mb-1" style={{color:'var(--muted2)'}}>{s.label}</div>
            <div className="font-bold text-xl text-white" style={{letterSpacing:'-0.3px'}}>{s.value}</div>
            {s.sub&&<div className="text-xs font-medium mt-1" style={{color:'var(--muted)'}}>{s.sub}</div>}
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-3"><WeatherCard city={country.defaultCity} country={country}/></div>
        <div className="lg:col-span-2"><CurrencyCard/></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div className="card" {...anim(3)}>
          <div className="card-title">🗣 Basic Phrases</div>
          {country.phrases.map((p,i)=>(
            <motion.div key={i} className="phrase-card"
              initial={{opacity:0,x:-10}} animate={{opacity:1,x:0}} transition={{delay:0.3+i*0.06}}>
              <div className="text-[10px] font-bold uppercase tracking-wide mb-0.5" style={{color:'var(--muted)'}}>{p.en}</div>
              <div className="font-bold text-white">{p.local}</div>
              <div className="text-xs font-bold mt-0.5" style={{color:'var(--cyan)'}}>{p.pron}</div>
            </motion.div>
          ))}
        </motion.div>
        <motion.div className="card" {...anim(4)}>
          <div className="card-title">🎌 Cultural Tips</div>
          {country.tips.map((t,i)=>(
            <div key={i} className="tip-row">
              <span className="flex-shrink-0 mt-0.5">{t.type==='do'?'✅':t.type==='dont'?'❌':'💡'}</span>
              {t.text}
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
