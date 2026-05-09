import { useState } from 'react'
import { motion } from 'framer-motion'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { useApp } from '../context/AppContext'
import countries from '../data/countries.json'
import CountrySelector from '../components/ui/CountrySelector'
import { fmt } from '../utils/formatters'
import toast from 'react-hot-toast'

const CATS = ['Food','Stay','Transport','Activities','Shopping','Other']
const CAT_IC = {Food:'🍽',Stay:'🏨',Transport:'🚆',Activities:'🎯',Shopping:'🛍',Other:'📦'}
const COLORS = ['#3B82F6','#10B981','#F97316','#8B5CF6','#EC4899','#6B7280']

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) return (
    <div style={{background:'rgba(15,25,42,0.95)',border:'1px solid rgba(255,255,255,0.12)',borderRadius:12,padding:'8px 14px',fontSize:12,fontWeight:600,color:'#F0F6FF',backdropFilter:'blur(20px)'}}>
      <div style={{marginBottom:4}}>{label}</div>
      {payload.map(p=><div key={p.name} style={{color:p.color}}>{p.name}: ${p.value}</div>)}
    </div>
  )
  return null
}

export default function BudgetPage() {
  const { state, dispatch } = useApp()
  const country = countries[state.selectedCountry]
  const breakdown = country.budgetBreakdown
  const budget = state.budget
  const tripDays = state.tripDays||3
  const [expenses, setExpenses] = useState(state.expenses||[])
  const [form, setForm] = useState({label:'',category:'Food',amount:''})

  const totalSpent = expenses.reduce((s,e)=>s+Number(e.amount),0)
  const remaining = budget - totalSpent
  const pct = Math.min(100,(totalSpent/budget)*100)

  const chartData = CATS.map((cat,i)=>({
    name:cat,
    budget:Math.round(budget*(breakdown[cat.toLowerCase()]||10)/100),
    spent:expenses.filter(e=>e.category===cat).reduce((s,e)=>s+Number(e.amount),0),
    fill:COLORS[i]
  }))

  function addExpense() {
    if (!form.label||!form.amount) return toast.error('Fill all fields!')
    const e = { id:fmt.uid(),...form,amount:Number(form.amount),date:new Date().toLocaleDateString() }
    setExpenses(prev=>[...prev,e])
    dispatch({type:'ADD_EXPENSE',payload:e})
    setForm({label:'',category:'Food',amount:''})
    toast.success('Expense added!')
  }

  return (
    <div className="space-y-5">
      <motion.div className="flex flex-wrap items-center gap-3" initial={{opacity:0}} animate={{opacity:1}}>
        <CountrySelector/>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold" style={{color:'var(--muted)'}}>Budget (USD):</span>
          <input type="number" value={budget} onChange={e=>dispatch({type:'SET_BUDGET',payload:Number(e.target.value)})} className="input w-28" min={100} step={100}/>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold" style={{color:'var(--muted)'}}>Days:</span>
          <select value={tripDays} onChange={e=>dispatch({type:'SET_TRIP_DAYS',payload:Number(e.target.value)})} className="input w-20 cursor-pointer">
            {[1,2,3,5,7,10,14].map(d=><option key={d} value={d}>{d}</option>)}
          </select>
        </div>
      </motion.div>

      {/* Budget overview */}
      <motion.div className="card" initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} transition={{delay:0.1}}>
        <div className="flex items-center justify-between mb-3">
          <div className="card-title mb-0">💳 Budget Overview</div>
          <span className={`badge ${remaining>=0?'badge-green':'badge-coral'}`}>
            {remaining>=0?`✅ $${remaining.toFixed(0)} left`:`⚠️ $${Math.abs(remaining).toFixed(0)} over`}
          </span>
        </div>
        <div className="h-2 rounded-full overflow-hidden mb-2" style={{background:'rgba(255,255,255,0.08)'}}>
          <motion.div className="h-full rounded-full"
            style={{background:pct>90?'var(--red)':'linear-gradient(90deg,#3B82F6,#06B6D4)'}}
            initial={{width:0}} animate={{width:`${pct}%`}} transition={{duration:0.8,ease:'easeOut'}}/>
        </div>
        <div className="flex justify-between text-xs font-semibold" style={{color:'var(--muted)'}}>
          <span>Spent: <strong className="text-white">${totalSpent.toFixed(0)}</strong></span>
          <span>Total: <strong className="text-white">${budget}</strong></span>
        </div>
      </motion.div>

      {/* Category cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {CATS.map((cat,i)=>{
          const allocated = Math.round(budget*(breakdown[cat.toLowerCase()]||10)/100)
          const spent = expenses.filter(e=>e.category===cat).reduce((s,e)=>s+Number(e.amount),0)
          return (
            <motion.div key={cat} className="card text-center"
              initial={{opacity:0,scale:0.92}} animate={{opacity:1,scale:1}} transition={{delay:0.1+i*0.05}}>
              <div className="text-2xl mb-1">{CAT_IC[cat]}</div>
              <div className="text-[10px] font-bold uppercase tracking-wide mb-1" style={{color:'var(--muted)'}}>{cat}</div>
              <div className="font-bold text-lg" style={{color:COLORS[i],letterSpacing:'-0.3px'}}>${allocated}</div>
              <div className="text-xs mb-2" style={{color:'var(--muted)'}}>Spent: ${spent}</div>
              <div className="h-1 rounded-full overflow-hidden" style={{background:'rgba(255,255,255,0.08)'}}>
                <div className="h-full rounded-full transition-all" style={{width:`${Math.min(100,(spent/allocated)*100)}%`,background:COLORS[i]}}/>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Chart + Expense tracker */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div className="card" initial={{opacity:0,y:18}} animate={{opacity:1,y:0}} transition={{delay:0.3}}>
          <div className="card-title">📊 Budget vs Spent</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData} barGap={3}>
              <XAxis dataKey="name" tick={{fontSize:11,fill:'rgba(255,255,255,0.4)',fontFamily:'"Plus Jakarta Sans"'}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fontSize:11,fill:'rgba(255,255,255,0.4)'}} axisLine={false} tickLine={false}/>
              <Tooltip content={<CustomTooltip/>} cursor={{fill:'rgba(255,255,255,0.04)'}}/>
              <Bar dataKey="budget" name="Budget" fill="rgba(255,255,255,0.08)" radius={[4,4,0,0]}/>
              <Bar dataKey="spent" name="Spent" radius={[4,4,0,0]}>
                {chartData.map((e,i)=><Cell key={i} fill={e.fill}/>)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div className="card" initial={{opacity:0,y:18}} animate={{opacity:1,y:0}} transition={{delay:0.4}}>
          <div className="card-title">💰 Add Expense</div>
          <div className="flex flex-col gap-2 mb-3">
            <input value={form.label} onChange={e=>setForm(f=>({...f,label:e.target.value}))} className="input" placeholder="e.g. Lunch at Ramen shop"/>
            <div className="flex gap-2">
              <select value={form.category} onChange={e=>setForm(f=>({...f,category:e.target.value}))} className="input cursor-pointer flex-1">
                {CATS.map(c=><option key={c}>{c}</option>)}
              </select>
              <input type="number" value={form.amount} onChange={e=>setForm(f=>({...f,amount:e.target.value}))} className="input w-24" placeholder="USD" min={0}/>
              <motion.button onClick={addExpense} className="btn btn-primary whitespace-nowrap" whileTap={{scale:0.96}}>+ Add</motion.button>
            </div>
          </div>
          <div className="max-h-48 overflow-y-auto space-y-0">
            {expenses.length===0&&<div className="text-sm text-center py-6 font-medium" style={{color:'var(--muted)'}}>No expenses yet — add your first one!</div>}
            {expenses.map(e=>(
              <div key={e.id} className="flex items-center justify-between py-2.5 text-sm" style={{borderBottom:'1px solid rgba(255,255,255,0.06)'}}>
                <div className="font-medium" style={{color:'rgba(255,255,255,0.85)'}}>
                  <span className="mr-1.5">{CAT_IC[e.category]}</span>{e.label}
                  <span className="ml-1.5 text-xs" style={{color:'var(--muted)'}}>{e.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="badge badge-blue text-[10px]">{e.category}</span>
                  <strong className="text-white">${e.amount}</strong>
                  <button onClick={()=>{setExpenses(p=>p.filter(x=>x.id!==e.id));dispatch({type:'REMOVE_EXPENSE',payload:e.id})}}
                    className="text-lg transition-colors" style={{color:'rgba(255,255,255,0.2)'}}
                    onMouseEnter={x=>x.target.style.color='var(--red)'} onMouseLeave={x=>x.target.style.color='rgba(255,255,255,0.2)'}>×</button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
