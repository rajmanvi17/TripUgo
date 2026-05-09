import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center text-center" style={{background:'var(--bg)'}}>
      <div className="bg-orb orb-1"/><div className="bg-orb orb-2"/>
      <motion.div className="relative z-10" initial={{opacity:0,y:24}} animate={{opacity:1,y:0}}>
        <div className="text-8xl mb-5">✈️</div>
        <h1 className="font-bold text-4xl text-white mb-2" style={{letterSpacing:'-1px'}}>Lost in Transit</h1>
        <p className="text-base font-medium mb-6" style={{color:'var(--muted)'}}>This destination doesn't exist on our map.</p>
        <Link to="/dashboard" className="btn btn-primary">← Back to Dashboard</Link>
      </motion.div>
    </div>
  )
}
