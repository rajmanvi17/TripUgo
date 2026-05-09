import { motion } from 'framer-motion'
import { useApp } from '../context/AppContext'
import countries from '../data/countries.json'
import CountrySelector from '../components/ui/CountrySelector'

function EmergCard({icon,label,number,bg,index}) {
  return (
    <motion.div className="flex items-center gap-4 p-4 rounded-2xl" style={{background:bg,border:'1px solid rgba(255,255,255,0.08)'}}
      initial={{opacity:0,x:-14}} animate={{opacity:1,x:0}} transition={{delay:index*0.07}}>
      <div className="text-3xl">{icon}</div>
      <div className="flex-1">
        <div className="text-xs font-bold uppercase tracking-wide mb-0.5" style={{color:'var(--muted)'}}>{label}</div>
        <div className="font-bold text-2xl text-white" style={{letterSpacing:'-0.5px'}}>{number}</div>
      </div>
      <a href={`tel:${number}`} className="btn text-xs" style={{borderRadius:9}}>📞 Call</a>
    </motion.div>
  )
}

export default function EmergencyPage() {
  const { state } = useApp()
  const country = countries[state.selectedCountry]
  const { emergency, embassy, hospitals } = country

  return (
    <div className="space-y-5">
      <motion.div className="flex flex-wrap items-center gap-3" initial={{opacity:0}} animate={{opacity:1}}>
        <CountrySelector/>
        <span className="badge badge-coral">🚨 Emergency Info</span>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <motion.div className="card" initial={{opacity:0,y:18}} animate={{opacity:1,y:0}} transition={{delay:0.1}}>
          <div className="card-title" style={{color:'#FCA5A5'}}>🆘 Emergency Numbers</div>
          <div className="space-y-3">
            <EmergCard icon="🚔" label="Police" number={emergency.police} bg="rgba(239,68,68,0.1)" index={0}/>
            <EmergCard icon="🚑" label="Ambulance" number={emergency.ambulance} bg="rgba(245,158,11,0.1)" index={1}/>
            <EmergCard icon="🚒" label="Fire Dept" number={emergency.fire} bg="rgba(249,115,22,0.1)" index={2}/>
            {emergency.tourist&&<EmergCard icon="ℹ️" label="Tourist Helpline" number={emergency.tourist} bg="rgba(59,130,246,0.1)" index={3}/>}
          </div>
        </motion.div>

        <motion.div className="card" initial={{opacity:0,y:18}} animate={{opacity:1,y:0}} transition={{delay:0.15}}>
          <div className="card-title">🏛 Embassy Info</div>
          <div className="space-y-3">
            {Object.entries(embassy).map(([key,info],i)=>(
              <motion.div key={key} className="p-3 rounded-2xl" style={{background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.08)'}}
                initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.2+i*0.08}}
                whileHover={{background:'rgba(255,255,255,0.08)',borderColor:'rgba(255,255,255,0.14)'}}>
                <div className="font-bold text-sm text-white mb-1">{info.name}</div>
                <div className="text-xs font-medium mb-2" style={{color:'var(--muted)'}}>📍 {info.address}</div>
                <a href={`tel:${info.phone}`} className="text-xs font-bold" style={{color:'var(--cyan)'}}>📞 {info.phone}</a>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div className="card" initial={{opacity:0,y:18}} animate={{opacity:1,y:0}} transition={{delay:0.2}}>
          <div className="card-title">🏥 Nearby Hospitals</div>
          <div className="space-y-3">
            {hospitals.map((h,i)=>(
              <motion.div key={i} className="flex items-start gap-3 p-3 rounded-2xl"
                style={{background:'rgba(16,185,129,0.08)',border:'1px solid rgba(16,185,129,0.18)'}}
                initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.25+i*0.08}}
                whileHover={{background:'rgba(16,185,129,0.12)',borderColor:'rgba(16,185,129,0.28)'}}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0" style={{background:'rgba(16,185,129,0.15)'}}>🏥</div>
                <div>
                  <div className="font-bold text-sm text-white">{h.name}</div>
                  <div className="text-xs font-medium mt-0.5" style={{color:'var(--muted)'}}>📍 {h.distance}</div>
                  <a href={`tel:${h.phone}`} className="text-xs font-bold mt-0.5 block" style={{color:'#34D399'}}>{h.phone}</a>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div className="card" style={{background:'rgba(245,158,11,0.06)',border:'1px solid rgba(245,158,11,0.15)'}}
        initial={{opacity:0,y:18}} animate={{opacity:1,y:0}} transition={{delay:0.3}}>
        <div className="card-title" style={{color:'#FCD34D'}}>⚠️ Safety Tips</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm font-medium" style={{color:'rgba(252,211,77,0.8)'}}>
          {['Keep digital & physical copies of your passport','Share your itinerary with someone back home','Save emergency numbers offline on your phone','Locate nearest embassy/consulate on arrival','Buy travel insurance before departing','Keep local cash for emergencies'].map((t,i)=>(
            <div key={i} className="flex gap-2"><span>•</span>{t}</div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
