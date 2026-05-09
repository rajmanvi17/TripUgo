import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useApp } from '../context/AppContext'
import countries from '../data/countries.json'
import packingRules from '../data/packingRules.json'
import CountrySelector from '../components/ui/CountrySelector'
import toast from 'react-hot-toast'

const CLIMATES = [{v:'hot',l:'🌞 Hot (25°C+)'},{v:'mild',l:'🌤 Mild (10–25°C)'},{v:'cold',l:'❄️ Cold (<10°C)'}]
const GROUPS = [
  {key:'clothing',  icon:'👕',label:'Clothing',   color:'rgba(59,130,246,0.08)',  border:'rgba(59,130,246,0.15)'},
  {key:'essentials',icon:'🎒',label:'Essentials',  color:'rgba(6,182,212,0.08)',   border:'rgba(6,182,212,0.15)'},
  {key:'health',    icon:'💊',label:'Health & Safety',color:'rgba(139,92,246,0.08)',border:'rgba(139,92,246,0.15)'},
]

export default function PackingPage() {
  const { state, dispatch } = useApp()
  const [climate, setClimate] = useState('mild')
  const ck = state.selectedCountry
  const list = useMemo(()=>({
    clothing:   [...(packingRules.clothing[climate]||[])],
    essentials: [...(packingRules.essentials.all||[]),...(packingRules.essentials[ck]||[])],
    health:     [...(packingRules.health.all||[]),...(packingRules.health[climate]||[])],
  }),[climate,ck])
  const checked = state.checklist[ck]||{}
  const all = Object.values(list).flat()
  const cnt = all.filter(i=>checked[i]).length
  const pct = all.length>0?Math.round((cnt/all.length)*100):0
  const toggle = item => dispatch({type:'TOGGLE_CHECK',country:ck,item})

  return (
    <div className="space-y-5">
      <motion.div className="flex flex-wrap items-center gap-3" initial={{opacity:0}} animate={{opacity:1}}>
        <CountrySelector/>
        <select value={climate} onChange={e=>setClimate(e.target.value)} className="input max-w-xs cursor-pointer">
          {CLIMATES.map(c=><option key={c.v} value={c.v}>{c.l}</option>)}
        </select>
        <div className="ml-auto flex items-center gap-3">
          <span className="text-sm font-semibold" style={{color:'var(--muted)'}}>{cnt} / {all.length} packed</span>
          <motion.button onClick={()=>{all.forEach(i=>{if(!checked[i])dispatch({type:'TOGGLE_CHECK',country:ck,item:i})})}} className="btn text-xs" whileTap={{scale:0.96}}>✅ All</motion.button>
          <motion.button onClick={()=>{dispatch({type:'SAVE_COUNTRY',payload:ck});toast.success('Checklist saved!')}} className="btn btn-primary text-xs" whileTap={{scale:0.96}}>📥 Save</motion.button>
        </div>
      </motion.div>

      <motion.div className="card" initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} transition={{delay:0.1}}>
        <div className="flex justify-between text-xs font-bold mb-2" style={{color:'var(--muted)'}}>
          <span>Packing Progress</span><span style={{color:'#60A5FA'}}>{pct}%</span>
        </div>
        <div className="h-2.5 rounded-full overflow-hidden" style={{background:'rgba(255,255,255,0.08)'}}>
          <motion.div className="h-full rounded-full" style={{background:'linear-gradient(90deg,#3B82F6,#06B6D4)'}}
            initial={{width:0}} animate={{width:`${pct}%`}} transition={{duration:0.7,ease:'easeOut'}}/>
        </div>
        {pct===100&&all.length>0&&(
          <motion.div className="text-center text-sm font-bold mt-2" style={{color:'#34D399'}}
            initial={{opacity:0}} animate={{opacity:1}}>🎉 All packed! Have an amazing trip!</motion.div>
        )}
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {GROUPS.map(({key,icon,label,color,border},gi)=>(
          <motion.div key={key} className="card-flat" style={{background:color,border:`1px solid ${border}`,borderRadius:18,padding:20}}
            initial={{opacity:0,y:18}} animate={{opacity:1,y:0}} transition={{delay:0.1+gi*0.07}}>
            <div className="card-title">{icon} {label}</div>
            {list[key].map((item,i)=>(
              <motion.label key={item}
                className="flex items-center gap-3 py-2.5 cursor-pointer rounded-xl px-2 -mx-2 transition-all"
                style={{borderBottom:i<list[key].length-1?'1px solid rgba(255,255,255,0.06)':'none'}}
                initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.15+i*0.03}}
                whileHover={{background:'rgba(255,255,255,0.05)'}}>
                <input type="checkbox" checked={!!checked[item]} onChange={()=>toggle(item)}/>
                <span className="text-sm flex-1 font-medium transition-all"
                  style={{color:checked[item]?'var(--muted)':'rgba(255,255,255,0.85)',textDecoration:checked[item]?'line-through':'none'}}>
                  {item}
                </span>
                {checked[item]&&<span className="text-xs font-bold" style={{color:'#34D399'}}>✓</span>}
              </motion.label>
            ))}
          </motion.div>
        ))}
      </div>
      <p className="text-xs text-center font-medium" style={{color:'var(--muted2)'}}>
        💡 Auto-generated for <strong className="text-white">{countries[ck]?.name}</strong> · {CLIMATES.find(c=>c.v===climate)?.l} climate
      </p>
    </div>
  )
}
