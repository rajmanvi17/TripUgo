import { useState } from 'react'
import { motion } from 'framer-motion'
import { BarChart,Bar,XAxis,YAxis,Tooltip,ResponsiveContainer,RadarChart,Radar,PolarGrid,PolarAngleAxis,Legend, Cell } from 'recharts'
import countries from '../data/countries.json'

const ALL = Object.keys(countries)
const COST = {'Low':600,'Medium':1200,'Medium-High':1800,'High':2200}
const COLORS = ['#3B82F6','#F59E0B','#A78BFA','#F472B6']

const CustomTooltip = ({active,payload,label}) => {
  if(active&&payload?.length) return (
    <div style={{background:'rgba(15,25,42,0.95)',border:'1px solid rgba(255,255,255,0.12)',borderRadius:12,padding:'8px 14px',fontSize:12,fontWeight:600,color:'#F0F6FF',backdropFilter:'blur(20px)'}}>
      <div style={{marginBottom:4}}>{label}</div>
      {payload.map(p=><div key={p.name} style={{color:p.color}}>{p.name}: ${p.value}</div>)}
    </div>
  )
  return null
}

export default function ComparePage() {
  const [selected, setSelected] = useState(['japan','france','india'])
  const toggle = key => {
    if(selected.includes(key)){if(selected.length<=2)return;setSelected(p=>p.filter(k=>k!==key))}
    else{if(selected.length>=4)return;setSelected(p=>[...p,key])}
  }
  const cc = selected.map(k=>countries[k])
  const costData = cc.map(c=>({name:c.name,cost:COST[c.costLevel]||1000}))
  const radarData = [
    {metric:'Safety',...Object.fromEntries(cc.map(c=>[c.name,c.safetyIndex]))},
    {metric:'Affordability',...Object.fromEntries(cc.map(c=>[c.name,Math.round(10-(COST[c.costLevel]/2200)*10)]))},
    {metric:'Climate',...Object.fromEntries(cc.map(c=>[c.name,7]))},
    {metric:'Tourism',...Object.fromEntries(cc.map(c=>[c.name,c.safetyIndex-0.5]))},
    {metric:'Food',...Object.fromEntries(cc.map(c=>[c.name,8]))},
  ]
  const METRICS = [
    {key:'safetyIndex',label:'🛡 Safety',fmt:v=>v+'/10'},
    {key:'costLevel',label:'💰 Cost',fmt:v=>v},
    {key:'language',label:'🗣 Language',fmt:v=>v},
    {key:'currency',label:'💱 Currency',fmt:v=>v},
    {key:'bestSeason',label:'🌸 Best Season',fmt:v=>v},
    {key:'visaInfo',label:'📋 Visa',fmt:v=>v},
  ]

  return (
    <div className="space-y-5">
      <motion.div className="card" initial={{opacity:0,y:14}} animate={{opacity:1,y:0}}>
        <div className="card-title">Select 2–4 countries</div>
        <div className="flex flex-wrap gap-2">
          {ALL.map(key=>{
            const c=countries[key],isSel=selected.includes(key)
            return (
              <motion.button key={key} onClick={()=>toggle(key)} whileTap={{scale:0.95}}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold transition-all border"
                style={isSel?{background:'rgba(59,130,246,0.18)',borderColor:'rgba(59,130,246,0.4)',color:'#93C5FD'}:{background:'rgba(255,255,255,0.04)',borderColor:'rgba(255,255,255,0.1)',color:'rgba(255,255,255,0.6)'}}>
                {c.flag} {c.name} {isSel&&'✓'}
              </motion.button>
            )
          })}
        </div>
      </motion.div>

      <motion.div className="card overflow-x-auto" initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} transition={{delay:0.1}}>
        <div className="card-title">📊 Side-by-Side</div>
        <table className="w-full text-sm min-w-[480px]">
          <thead>
            <tr style={{borderBottom:'1px solid rgba(255,255,255,0.08)'}}>
              <th className="text-left py-3 pr-4 w-36 text-xs font-bold uppercase tracking-wide" style={{color:'var(--muted)'}}>METRIC</th>
              {cc.map((c,ci)=>(
                <th key={c.name} className="text-left py-3 px-3 font-bold text-sm" style={{color:COLORS[ci]}}>{c.flag} {c.name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {METRICS.map(({key,label,fmt:fmtFn})=>(
              <tr key={key} style={{borderBottom:'1px solid rgba(255,255,255,0.05)'}}
                onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.03)'}
                onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                <td className="py-3 pr-4 text-xs font-bold" style={{color:'var(--muted)'}}>{label}</td>
                {cc.map((c,ci)=>(
                  <td key={c.name} className="py-3 px-3 font-medium" style={{color:'rgba(255,255,255,0.85)'}}>
                    {key==='safetyIndex'
                      ?<span className={`badge ${c.safetyIndex>=8?'badge-green':c.safetyIndex>=7?'badge-blue':'badge-amber'}`}>{fmtFn(c[key])}</span>
                      :fmtFn(c[key])}
                  </td>
                ))}
              </tr>
            ))}
            <tr>
              <td className="py-3 pr-4 text-xs font-bold" style={{color:'var(--muted)'}}>💵 Monthly Cost</td>
              {cc.map((c,ci)=>(
                <td key={c.name} className="py-3 px-3 font-bold" style={{color:COLORS[ci]}}>~${COST[c.costLevel]||1200}/mo</td>
              ))}
            </tr>
          </tbody>
        </table>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div className="card" initial={{opacity:0,y:18}} animate={{opacity:1,y:0}} transition={{delay:0.2}}>
          <div className="card-title">💰 Monthly Cost</div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={costData}>
              <XAxis dataKey="name" tick={{fontSize:12,fill:'rgba(255,255,255,0.4)'}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fontSize:11,fill:'rgba(255,255,255,0.4)'}} axisLine={false} tickLine={false} tickFormatter={v=>`$${v}`}/>
              <Tooltip content={<CustomTooltip/>} cursor={{fill:'rgba(255,255,255,0.04)'}}/>
              <Bar dataKey="cost" radius={[8,8,0,0]}>
                {costData.map((_,i)=><Cell key={i} fill={COLORS[i]}/>)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div className="card" initial={{opacity:0,y:18}} animate={{opacity:1,y:0}} transition={{delay:0.3}}>
          <div className="card-title">🕸 Travel Score Radar</div>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="rgba(255,255,255,0.08)"/>
              <PolarAngleAxis dataKey="metric" tick={{fontSize:11,fill:'rgba(255,255,255,0.45)'}}/>
              {cc.map((c,i)=>(
                <Radar key={c.name} name={c.name} dataKey={c.name}
                  stroke={COLORS[i]} fill={COLORS[i]} fillOpacity={0.12} strokeWidth={2}/>
              ))}
              <Legend wrapperStyle={{fontSize:12,color:'rgba(255,255,255,0.55)'}}/>
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  )
}
