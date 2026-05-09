import { motion } from 'framer-motion'
import { useApp } from '../context/AppContext'
import countries from '../data/countries.json'
import CountrySelector from '../components/ui/CountrySelector'

export default function LocalPage() {
  const { state } = useApp()
  const country = countries[state.selectedCountry]
  return (
    <div className="space-y-5">
      <motion.div className="flex flex-wrap items-center gap-3" initial={{opacity:0}} animate={{opacity:1}}>
        <CountrySelector/><span className="badge badge-amber">{country.flag} Local Experience</span>
      </motion.div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div className="card" initial={{opacity:0,y:18}} animate={{opacity:1,y:0}} transition={{delay:0.1}}>
          <div className="card-title">🍴 Famous Foods</div>
          {country.food.map((item,i)=>(
            <motion.div key={i} className="flex gap-3 py-3 transition-all cursor-default"
              style={{borderBottom:i<country.food.length-1?'1px solid rgba(255,255,255,0.06)':'none'}}
              initial={{opacity:0,x:-10}} animate={{opacity:1,x:0}} transition={{delay:0.15+i*0.06}}
              whileHover={{paddingLeft:6}}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                style={{background:'rgba(245,158,11,0.1)',border:'1px solid rgba(245,158,11,0.2)'}}>
                {item.emoji}
              </div>
              <div>
                <div className="font-bold text-sm text-white">{item.name}</div>
                <div className="text-xs font-medium mt-0.5 leading-relaxed" style={{color:'var(--muted)'}}>{item.desc}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>
        <div className="flex flex-col gap-4">
          <motion.div className="card flex-1" initial={{opacity:0,y:18}} animate={{opacity:1,y:0}} transition={{delay:0.15}}>
            <div className="card-title">💎 Hidden Gems</div>
            <div className="space-y-2">
              {country.gems.map((gem,i)=>(
                <motion.div key={i} className="p-3 rounded-2xl cursor-default"
                  style={{background:'rgba(139,92,246,0.08)',border:'1px solid rgba(139,92,246,0.18)'}}
                  initial={{opacity:0,scale:0.96}} animate={{opacity:1,scale:1}} transition={{delay:0.2+i*0.07}}
                  whileHover={{background:'rgba(139,92,246,0.14)',borderColor:'rgba(139,92,246,0.3)',x:4}}>
                  <div className="font-bold text-sm" style={{color:'#C4B5FD'}}>{gem.name}</div>
                  <div className="text-xs mt-0.5 font-medium" style={{color:'rgba(196,181,253,0.65)'}}>{gem.desc}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
          <motion.div className="card" initial={{opacity:0,y:18}} animate={{opacity:1,y:0}} transition={{delay:0.2}}>
            <div className="card-title">🎭 Culture Highlights</div>
            <div className="flex flex-wrap gap-2">
              {country.culture.map((tag,i)=>(
                <motion.span key={i} className="px-3 py-1.5 rounded-full text-xs font-bold"
                  style={{background:'rgba(59,130,246,0.12)',border:'1px solid rgba(59,130,246,0.22)',color:'#93C5FD'}}
                  initial={{opacity:0,scale:0.8}} animate={{opacity:1,scale:1}} transition={{delay:0.25+i*0.04}}
                  whileHover={{background:'rgba(59,130,246,0.2)',scale:1.05}}>
                  {tag}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
      <motion.div className="rounded-2xl p-6 relative overflow-hidden"
        style={{background:'linear-gradient(135deg,rgba(14,30,65,0.9),rgba(8,18,46,0.95))',border:'1px solid rgba(59,130,246,0.2)'}}
        initial={{opacity:0,y:18}} animate={{opacity:1,y:0}} transition={{delay:0.3}}>
        <div className="absolute right-0 bottom-0 text-9xl opacity-8 select-none">{country.flag}</div>
        <div className="text-sm font-medium mb-1" style={{color:'var(--muted)'}}>Traveler's Summary</div>
        <div className="font-bold text-2xl text-white mb-4">{country.flag} {country.name}</div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[{label:'Best Time',value:country.bestSeason},{label:'Cost Level',value:country.costLevel},{label:'Language',value:country.language},{label:'Visa',value:country.visaInfo.split(' ')[0]}].map(item=>(
            <div key={item.label} className="rounded-xl p-3" style={{background:'rgba(255,255,255,0.07)'}}>
              <div className="text-xs font-bold uppercase tracking-wide mb-1" style={{color:'var(--muted)'}}>{item.label}</div>
              <div className="font-bold text-sm text-white">{item.value}</div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
