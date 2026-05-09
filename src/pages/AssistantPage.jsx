import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useApp } from '../context/AppContext'
import countries from '../data/countries.json'
import CountrySelector from '../components/ui/CountrySelector'

const MOCK = {
  'best time':  c=>`🌸 Best time to visit **${c.name}** is **${c.bestSeason}**. You'll get ideal weather, fewer crowds, and better prices outside peak season.`,
  'visa':       c=>`📋 Visa for ${c.name}: **${c.visaInfo}**. Always double-check with your embassy before booking.`,
  'budget':     c=>`💰 ${c.name} is **${c.costLevel}** cost. Budget ~$${c.costLevel==='Low'?'40–80':c.costLevel.includes('High')?'150–300':'80–150'}/day for stay, food & transport.`,
  'language':   c=>`🗣 ${c.name} speaks **${c.language}**. Locals love when you try a few local words — check Dashboard for phrases!`,
  'currency':   c=>`💱 ${c.name} uses **${c.currency}** (${c.currencySymbol}). Carry some cash — smaller shops often don't accept cards.`,
  'safe':       c=>`🛡 Safety index: **${c.safetyIndex}/10**. ${c.safetyIndex>=8?'Very safe — great for solo travel!':c.safetyIndex>=7?'Generally safe. Stay aware in tourist areas.':'Exercise normal caution and avoid displaying valuables.'}`,
  'food':       c=>`🍴 Must-try in ${c.name}: **${c.food.map(f=>f.name).join(', ')}**. ${c.food[0].name} — ${c.food[0].desc}`,
  'emergency':  c=>`🆘 Emergency numbers — Police: **${c.emergency.police}**, Ambulance: **${c.emergency.ambulance}**, Fire: **${c.emergency.fire}**. Save before you travel!`,
  'weather':    c=>`🌡 ${c.name} is best during **${c.bestSeason}**. Open **Dashboard** for live forecast!`,
  'hidden gem': c=>`💎 Hidden gems: **${c.gems.map(g=>g.name).join(', ')}**. ${c.gems[0].desc}`,
  'culture':    c=>`🎭 ${c.name} culture: **${c.culture.join(', ')}**. Check Cultural Tips on Dashboard for do's & don'ts.`,
  'packing':    ()=>`🧳 Go to **Packing Checklist** — auto-generates a list based on destination & climate. Don't forget travel adapter!`,
  'itinerary':  ()=>`📅 Use **Itinerary Builder** for day-by-day drag-and-drop planning. Save it offline for reference!`,
  'hello':      c=>`👋 Hello! I'm TripUgo AI, your smart travel assistant for **${c.name}**. Ask me anything!`,
  'hi':         c=>`👋 Hi there! Ready to plan your trip to **${c.name}**? Ask about visa, budget, food, culture or hidden gems!`,
  'thank':      ()=>`😊 You're welcome! Safe travels! ✈️`,
  'help':       c=>`🤖 I can help with:\n• Best time to visit ${c.name}\n• Visa & entry info\n• Budget estimates\n• Local food & culture\n• Safety tips\n• Emergency numbers\n• Hidden gems`,
}

const QUICK = ['Best time to visit?','Is it safe solo travel?','Budget for 7 days?','What food to try?','Hidden gems?','Emergency numbers?']

function Dots() {
  return (
    <div className="flex gap-1.5 items-center px-4 py-3 rounded-2xl rounded-tl-sm"
      style={{background:'rgba(59,130,246,0.1)',border:'1px solid rgba(59,130,246,0.18)',width:'fit-content'}}>
      {[0,1,2].map(i=>(
        <motion.span key={i} className="w-1.5 h-1.5 rounded-full inline-block"
          style={{background:'rgba(255,255,255,0.4)'}}
          animate={{y:[0,-5,0]}} transition={{duration:0.9,repeat:Infinity,delay:i*0.2}}/>
      ))}
    </div>
  )
}

function Bubble({msg}) {
  const isBot = msg.role==='bot'
  const text = msg.text
  return (
    <motion.div className={`flex gap-2.5 ${isBot?'':'flex-row-reverse'}`}
      initial={{opacity:0,y:10,scale:0.96}} animate={{opacity:1,y:0,scale:1}} transition={{duration:0.22}}>
      {isBot && (
        <div className="w-7 h-7 rounded-full flex items-center justify-center text-sm flex-shrink-0 mt-0.5"
          style={{background:'linear-gradient(135deg,#3B82F6,#8B5CF6)'}}>🤖</div>
      )}
      <div className={isBot?'chat-bot':'chat-user'}>
        {text.split('**').map((part,i)=>i%2===1?<strong key={i}>{part}</strong>:part)}
      </div>
    </motion.div>
  )
}

export default function AssistantPage() {
  const { state } = useApp()
  const country = countries[state.selectedCountry]
  const [messages, setMessages] = useState([
    {id:'1',role:'bot',text:`👋 Hi! I'm TripUgo AI, your smart travel assistant. I'm set up for **${country.name}**.\n\nAsk me anything — best time, visa, budget, food, culture, safety, or hidden gems!`}
  ])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(()=>{ bottomRef.current?.scrollIntoView({behavior:'smooth'}) },[messages,typing])
  useEffect(()=>{
    setMessages([{id:'init',role:'bot',text:`🌍 Switched to **${country.name}**! Ask me anything about your upcoming trip.`}])
  },[state.selectedCountry])

  function getResponse(text) {
    const lower = text.toLowerCase()
    for (const [kw,fn] of Object.entries(MOCK)) {
      if (lower.includes(kw)) return fn(country)
    }
    return `🤔 Great question about ${country.name}! This is demo mode — connect a real AI in \`src/services/aiService.js\`.\n\nTry: **visa**, **budget**, **best time**, **food**, **safety**, or **hidden gems**.`
  }

  async function send(text) {
    const trimmed = text.trim()
    if (!trimmed||typing) return
    setMessages(prev=>[...prev,{id:Date.now().toString(),role:'user',text:trimmed}])
    setInput('')
    setTyping(true)
    await new Promise(r=>setTimeout(r,500+Math.random()*600))
    setMessages(prev=>[...prev,{id:Date.now()+'b',role:'bot',text:getResponse(trimmed)}])
    setTyping(false)
    inputRef.current?.focus()
  }

  return (
    <div className="space-y-4">
      <motion.div className="flex flex-wrap items-center gap-3" initial={{opacity:0}} animate={{opacity:1}}>
        <CountrySelector/>
        <span className="badge badge-purple">🤖 AI Assistant</span>
        <span className="badge badge-amber">Demo Mode</span>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Chat window */}
        <motion.div className="lg:col-span-3 card flex flex-col" style={{height:560}}
          initial={{opacity:0,y:18}} animate={{opacity:1,y:0}} transition={{delay:0.1}}>
          {/* Header */}
          <div className="flex items-center gap-3 pb-4 mb-4" style={{borderBottom:'1px solid rgba(255,255,255,0.07)'}}>
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl flex-shrink-0"
              style={{background:'linear-gradient(135deg,#3B82F6,#8B5CF6)',boxShadow:'0 4px 16px rgba(59,130,246,0.35)'}}>🤖</div>
            <div>
              <div className="font-bold text-white">TripUgo AI Assistant</div>
              <div className="text-xs font-semibold flex items-center gap-1.5" style={{color:'#34D399'}}>
                <span className="w-1.5 h-1.5 rounded-full inline-block bg-green-400"/>Online · {country.name} mode
              </div>
            </div>
            <span className="ml-auto badge badge-amber text-[10px]">Connect API for live AI →</span>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            <AnimatePresence initial={false}>
              {messages.map(msg=><Bubble key={msg.id} msg={msg}/>)}
            </AnimatePresence>
            {typing && (
              <div className="flex gap-2.5">
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-sm flex-shrink-0"
                  style={{background:'linear-gradient(135deg,#3B82F6,#8B5CF6)'}}>🤖</div>
                <Dots/>
              </div>
            )}
            <div ref={bottomRef}/>
          </div>

          {/* Input */}
          <div className="pt-4 mt-4" style={{borderTop:'1px solid rgba(255,255,255,0.07)'}}>
            <div className="flex gap-2">
              <input ref={inputRef} value={input}
                onChange={e=>setInput(e.target.value)}
                onKeyDown={e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();send(input)}}}
                className="input flex-1" placeholder={`Ask anything about ${country.name}...`} disabled={typing}/>
              <motion.button onClick={()=>send(input)} disabled={!input.trim()||typing}
                className="btn btn-primary px-5 disabled:opacity-40" whileTap={{scale:0.95}}>↗</motion.button>
            </div>
          </div>
        </motion.div>

        {/* Sidebar */}
        <div className="flex flex-col gap-3">
          <motion.div className="card" initial={{opacity:0,x:18}} animate={{opacity:1,x:0}} transition={{delay:0.2}}>
            <div className="card-title">⚡ Quick Questions</div>
            <div className="space-y-1.5">
              {QUICK.map(q=>(
                <button key={q} onClick={()=>send(q)} disabled={typing}
                  className="quick-btn">{q}</button>
              ))}
            </div>
          </motion.div>

          <motion.div className="card" initial={{opacity:0,x:18}} animate={{opacity:1,x:0}} transition={{delay:0.3}}>
            <div className="card-title">🌍 Exploring</div>
            <div className="text-center py-2">
              <div className="text-4xl mb-1">{country.flag}</div>
              <div className="font-bold text-white">{country.name}</div>
              <div className="text-xs font-medium mt-1" style={{color:'var(--muted)'}}>Safety: {country.safetyIndex}/10</div>
              <div className="text-xs font-medium" style={{color:'var(--muted)'}}>Cost: {country.costLevel}</div>
            </div>
          </motion.div>

          <motion.div className="card" style={{background:'rgba(139,92,246,0.08)',border:'1px solid rgba(139,92,246,0.18)'}}
            initial={{opacity:0,x:18}} animate={{opacity:1,x:0}} transition={{delay:0.4}}>
            <div className="card-title" style={{color:'#C4B5FD'}}>🔌 Connect Real AI</div>
            <div className="text-xs font-medium leading-relaxed" style={{color:'rgba(196,181,253,0.75)'}}>
              Edit <code className="px-1 rounded" style={{background:'rgba(139,92,246,0.2)',fontSize:10}}>aiService.js</code> and add key to{' '}
              <code className="px-1 rounded" style={{background:'rgba(139,92,246,0.2)',fontSize:10}}>.env</code> for live responses.
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
