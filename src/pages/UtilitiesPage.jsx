import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { LineChart,Line,XAxis,YAxis,Tooltip,ResponsiveContainer,CartesianGrid } from 'recharts'
import { fmt } from '../utils/formatters'

const TZS = [
  {city:'New York',   tz:'America/New_York',   flag:'🇺🇸'},
  {city:'London',     tz:'Europe/London',       flag:'🇬🇧'},
  {city:'Paris',      tz:'Europe/Paris',        flag:'🇫🇷'},
  {city:'Dubai',      tz:'Asia/Dubai',          flag:'🇦🇪'},
  {city:'Mumbai',     tz:'Asia/Kolkata',        flag:'🇮🇳'},
  {city:'Singapore',  tz:'Asia/Singapore',      flag:'🇸🇬'},
  {city:'Tokyo',      tz:'Asia/Tokyo',          flag:'🇯🇵'},
  {city:'Sydney',     tz:'Australia/Sydney',    flag:'🇦🇺'},
  {city:'Los Angeles',tz:'America/Los_Angeles', flag:'🇺🇸'},
]
const PAIRS = [
  {from:'USD',to:'JPY',base:149.2,variation:1.5,symbol:'¥'},
  {from:'USD',to:'EUR',base:0.921,variation:0.008,symbol:'€'},
  {from:'USD',to:'GBP',base:0.788,variation:0.006,symbol:'£'},
  {from:'USD',to:'INR',base:83.4, variation:0.3,  symbol:'₹'},
]

function genTrend(base,v) {
  return ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(day=>({
    day, rate:+(base+(Math.sin(Math.random()*3)*v)).toFixed(2)
  }))
}

const CustomTooltip = ({active,payload,label,sym}) => {
  if(active&&payload?.length) return (
    <div style={{background:'rgba(15,25,42,0.95)',border:'1px solid rgba(255,255,255,0.12)',borderRadius:12,padding:'8px 14px',fontSize:12,fontWeight:600,color:'#F0F6FF',backdropFilter:'blur(20px)'}}>
      <div>{label}</div><div style={{color:'#60A5FA'}}>{sym}{payload[0].value}</div>
    </div>
  )
  return null
}

function WorldClock({tz,city,flag}) {
  const [time,setTime]=useState('')
  const [date,setDate]=useState('')
  useEffect(()=>{
    const update=()=>{
      const now=new Date()
      setTime(fmt.time(now,tz))
      setDate(now.toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric',timeZone:tz}))
    }
    update();const id=setInterval(update,1000);return()=>clearInterval(id)
  },[tz])
  return (
    <motion.div className="flex items-center justify-between p-3 rounded-xl cursor-default"
      style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.07)'}}
      whileHover={{background:'rgba(59,130,246,0.08)',borderColor:'rgba(59,130,246,0.2)'}}>
      <div className="flex items-center gap-2.5">
        <span className="text-xl">{flag}</span>
        <div>
          <div className="font-bold text-sm text-white">{city}</div>
          <div className="text-xs font-medium" style={{color:'var(--muted)'}}>{date}</div>
        </div>
      </div>
      <div className="font-bold text-lg" style={{color:'#60A5FA',fontVariantNumeric:'tabular-nums'}}>{time}</div>
    </motion.div>
  )
}

export default function UtilitiesPage() {
  const [activePair, setActivePair] = useState(0)
  const [trends] = useState(()=>PAIRS.map(p=>genTrend(p.base,p.variation)))
  const pair = PAIRS[activePair]

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div className="card" initial={{opacity:0,y:18}} animate={{opacity:1,y:0}}>
          <div className="card-title">🕐 World Clocks</div>
          <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
            {TZS.map((z,i)=>(
              <motion.div key={z.tz} initial={{opacity:0,x:-10}} animate={{opacity:1,x:0}} transition={{delay:i*0.04}}>
                <WorldClock {...z}/>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div className="card" initial={{opacity:0,y:18}} animate={{opacity:1,y:0}} transition={{delay:0.1}}>
          <div className="card-title">📈 Currency Trend (7-day simulated)</div>
          <div className="flex gap-1.5 flex-wrap mb-4">
            {PAIRS.map((p,i)=>(
              <motion.button key={i} onClick={()=>setActivePair(i)} className="btn text-xs" whileTap={{scale:0.96}}
                style={activePair===i?{background:'rgba(59,130,246,0.2)',borderColor:'rgba(59,130,246,0.4)',color:'#93C5FD'}:{}}>
                {p.from}/{p.to}
              </motion.button>
            ))}
          </div>
          <div className="text-sm font-medium mb-3" style={{color:'var(--muted)'}}>
            1 {pair.from} = <strong className="font-bold text-lg text-white">{pair.symbol}{trends[activePair].slice(-1)[0]?.rate}</strong> {pair.to}
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={trends[activePair]}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)"/>
              <XAxis dataKey="day" tick={{fontSize:11,fill:'rgba(255,255,255,0.4)'}} axisLine={false} tickLine={false}/>
              <YAxis domain={['auto','auto']} tick={{fontSize:11,fill:'rgba(255,255,255,0.4)'}} axisLine={false} tickLine={false} tickFormatter={v=>`${pair.symbol}${v}`}/>
              <Tooltip content={<CustomTooltip sym={pair.symbol}/>}/>
              <Line type="monotone" dataKey="rate" stroke="#3B82F6" strokeWidth={2.5}
                dot={{r:4,fill:'#3B82F6',strokeWidth:0}} activeDot={{r:6,fill:'#60A5FA'}}/>
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      <motion.div className="card" initial={{opacity:0,y:18}} animate={{opacity:1,y:0}} transition={{delay:0.2}}>
        <div className="card-title">⚡ Quick Trip Calculator</div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            {label:'🌍 Distance',desc:'Use Google Flights for exact distances — they change by route.'},
            {label:'⏱ Flight Time',desc:'~1hr per 800km. Add 2hrs for check-in & transit.'},
            {label:'💊 Vaccinations',desc:'Check CDC.gov or your country\'s travel health authority.'},
            {label:'🌐 Plug Types',desc:'Japan: A/B · France: C/E · India: C/D · USA: A/B'},
          ].map((item,i)=>(
            <motion.div key={item.label} className="p-4 rounded-2xl cursor-default"
              style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)'}}
              initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:0.25+i*0.06}}
              whileHover={{background:'rgba(255,255,255,0.07)',borderColor:'rgba(255,255,255,0.13)',y:-2}}>
              <div className="font-bold text-sm text-white mb-1.5">{item.label}</div>
              <div className="text-xs leading-relaxed font-medium" style={{color:'var(--muted)'}}>{item.desc}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
