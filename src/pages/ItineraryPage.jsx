import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, useSortable, arrayMove } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useApp } from '../context/AppContext'
import countries from '../data/countries.json'
import CountrySelector from '../components/ui/CountrySelector'
import { fmt } from '../utils/formatters'
import toast from 'react-hot-toast'

function SortableItem({ item }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 50 : 'auto',
  }
  return (
    <div ref={setNodeRef} style={style} className="drag-item group relative">
      <span {...attributes} {...listeners}
        className="drag-handle text-xl select-none px-1 flex-shrink-0"
        style={{ color: 'rgba(255,255,255,0.18)' }}>⠿</span>
      <span>{item.emoji}</span>
      <span className="flex-1 text-sm font-medium" style={{ color: 'rgba(255,255,255,0.8)' }}>{item.text}</span>
    </div>
  )
}

const dayColors = [
  { bg: 'rgba(59,130,246,0.08)',  border: 'rgba(59,130,246,0.18)' },
  { bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.18)' },
  { bg: 'rgba(139,92,246,0.08)', border: 'rgba(139,92,246,0.18)' },
  { bg: 'rgba(249,115,22,0.08)', border: 'rgba(249,115,22,0.18)' },
  { bg: 'rgba(236,72,153,0.08)', border: 'rgba(236,72,153,0.18)' },
  { bg: 'rgba(6,182,212,0.08)',  border: 'rgba(6,182,212,0.18)'  },
  { bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.18)' },
]

export default function ItineraryPage() {
  const { state, dispatch } = useApp()
  const country = countries[state.selectedCountry]
  const savedKey = state.selectedCountry
  const [days, setDays] = useState(() => state.savedItineraries[savedKey] || country.defaultItinerary)
  const [newItem, setNewItem] = useState('')
  const [addingTo, setAddingTo] = useState(null)
  const [tripDays, setTripDays] = useState(state.tripDays || 3)

  useEffect(() => {
    setDays(state.savedItineraries[savedKey] || country.defaultItinerary)
  }, [state.selectedCountry])

  const sensors = useSensors(useSensor(PointerSensor))

  function handleDragEnd(event, dayIndex) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const items = days[dayIndex].items
    const oi = items.findIndex(i => i.id === active.id)
    const ni = items.findIndex(i => i.id === over.id)
    setDays(days.map((d, i) => i === dayIndex ? { ...d, items: arrayMove(d.items, oi, ni) } : d))
  }

  function addItem(dayIndex) {
    if (!newItem.trim()) return
    const item = { id: fmt.uid(), text: newItem.trim(), emoji: '📌' }
    setDays(days.map((d, i) => i === dayIndex ? { ...d, items: [...d.items, item] } : d))
    setNewItem('')
    setAddingTo(null)
  }

  function removeItem(dayIndex, itemId) {
    setDays(days.map((d, i) => i === dayIndex ? { ...d, items: d.items.filter(it => it.id !== itemId) } : d))
  }

  const visibleDays = days.slice(0, tripDays)

  return (
    <div className="space-y-5">
      <motion.div className="flex flex-wrap items-center gap-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <CountrySelector />
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold" style={{ color: 'var(--muted)' }}>Duration:</span>
          <select value={tripDays}
            onChange={e => { const v = Number(e.target.value); setTripDays(v); dispatch({ type: 'SET_TRIP_DAYS', payload: v }) }}
            className="input w-28 cursor-pointer">
            {[1, 2, 3, 4, 5, 6, 7, 10].map(d => <option key={d} value={d}>{d} day{d > 1 ? 's' : ''}</option>)}
          </select>
        </div>
        <div className="ml-auto flex gap-2">
          <motion.button
            onClick={() => { dispatch({ type: 'SAVE_ITINERARY', key: savedKey, payload: days }); toast.success('Itinerary saved! 📅') }}
            className="btn text-xs" whileTap={{ scale: 0.96 }}>📥 Save Offline</motion.button>
          <motion.button
            onClick={() => toast.success('PDF export — connect backend!')}
            className="btn btn-primary text-xs" whileTap={{ scale: 0.96 }}>📤 Export PDF</motion.button>
        </div>
      </motion.div>

      <div className={`grid gap-4 grid-cols-1 ${tripDays <= 2 ? 'md:grid-cols-2' : 'md:grid-cols-2 lg:grid-cols-3'}`}>
        {visibleDays.map((day, dayIndex) => {
          const col = dayColors[dayIndex % dayColors.length]
          return (
            <motion.div key={day.day}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: dayIndex * 0.07 }}
              whileHover={{ y: -2 }}
              style={{
                background: col.bg,
                border: `1px solid ${col.border}`,
                borderRadius: 18,
                padding: 16,
                transition: 'all 0.25s ease',
              }}>
              <div className="text-xs font-bold uppercase tracking-wide mb-3" style={{ color: 'var(--muted)' }}>
                📅 Day {day.day} — <span style={{ color: '#60A5FA' }}>{day.label}</span>
              </div>
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={e => handleDragEnd(e, dayIndex)}>
                <SortableContext items={day.items.map(i => i.id)} strategy={verticalListSortingStrategy}>
                  {day.items.map(item => (
                    <div key={item.id} className="relative group">
                      <SortableItem item={item} />
                      <button
                        onClick={() => removeItem(dayIndex, item.id)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-lg opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ color: 'rgba(239,68,68,0.7)' }}>×</button>
                    </div>
                  ))}
                </SortableContext>
              </DndContext>

              {addingTo === dayIndex ? (
                <div className="flex gap-1.5 mt-2">
                  <input autoFocus value={newItem}
                    onChange={e => setNewItem(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') addItem(dayIndex); if (e.key === 'Escape') setAddingTo(null) }}
                    className="input flex-1 text-xs py-2" placeholder="Activity name..." />
                  <motion.button onClick={() => addItem(dayIndex)} className="btn btn-primary text-xs px-3" whileTap={{ scale: 0.96 }}>Add</motion.button>
                  <button onClick={() => setAddingTo(null)} className="btn text-xs px-2">✕</button>
                </div>
              ) : (
                <button onClick={() => setAddingTo(dayIndex)}
                  className="w-full mt-1 text-xs py-2 rounded-xl text-center transition-all font-semibold"
                  style={{ color: 'var(--muted2)', border: '1px dashed rgba(255,255,255,0.12)' }}
                  onMouseEnter={e => { e.target.style.borderColor = 'rgba(59,130,246,0.4)'; e.target.style.color = '#60A5FA' }}
                  onMouseLeave={e => { e.target.style.borderColor = 'rgba(255,255,255,0.12)'; e.target.style.color = 'var(--muted2)' }}>
                  + Add activity
                </button>
              )}
            </motion.div>
          )
        })}
      </div>
      <p className="text-xs text-center font-medium" style={{ color: 'var(--muted2)' }}>
        💡 Drag and drop items to reorder within each day
      </p>
    </div>
  )
}
