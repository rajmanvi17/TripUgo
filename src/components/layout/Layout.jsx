import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
export default function Layout() {
  const [open, setOpen] = useState(false)
  return (
    <div className="flex h-screen overflow-hidden" style={{ background:'var(--bg)' }}>
      <div className="bg-orb orb-1" /><div className="bg-orb orb-2" /><div className="bg-orb orb-3" />
      <AnimatePresence>
        {open && (
          <motion.div className="fixed inset-0 z-20 lg:hidden" style={{ background:'rgba(0,0,0,0.6)', backdropFilter:'blur(4px)' }}
            initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} onClick={() => setOpen(false)} />
        )}
      </AnimatePresence>
      <div className={`fixed lg:static z-30 h-full transition-transform duration-300 ${open?'translate-x-0':'-translate-x-full lg:translate-x-0'}`}>
        <Sidebar onClose={() => setOpen(false)} />
      </div>
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-10">
        <Topbar onMenuClick={() => setOpen(true)} />
        <main className="flex-1 overflow-y-auto" style={{ background:'transparent' }}>
          <motion.div className="max-w-screen-xl mx-auto p-4 lg:p-6"
            initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.3, ease:'easeOut' }}>
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  )
}
