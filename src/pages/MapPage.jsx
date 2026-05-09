import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useEffect, useRef, useState } from 'react'
import CountrySelector from '../components/ui/CountrySelector'
import { useApp } from '../context/AppContext'
import countries from '../data/countries.json'

/*
   FREE APIS — No key required:
   • Nominatim  (OpenStreetMap geocoding)
   • Overpass   (OpenStreetMap POI data)
   • OSM embed  (Interactive map iframe)
 */
const NOMINATIM = 'https://nominatim.openstreetmap.org'
const OVERPASS_SERVERS = [
  "https://overpass-api.de/api/interpreter",
  "https://overpass.kumi.systems/api/interpreter",
  "https://lz4.overpass-api.de/api/interpreter",
];

const OVERPASS_TAGS = {
  attraction: `node["tourism"~"attraction|museum|artwork|theme_park|viewpoint|zoo"](around:30000,{lat},{lon});
               node["historic"~"monument|castle|ruins|memorial"](around:30000,{lat},{lon});`,
  restaurant: `node["amenity"="restaurant"](around:10000,{lat},{lon});
               node["amenity"="cafe"](around:10000,{lat},{lon});`,
  hotel:      `node["tourism"~"hotel|hostel|guest_house|motel"](around:15000,{lat},{lon});`,
}

const TYPE_META = {
  attraction: { emoji:'🎯', bg:'rgba(59,130,246,0.12)', border:'rgba(59,130,246,0.25)', badge:'badge-blue',  label:'Attraction' },
  restaurant: { emoji:'🍽', bg:'rgba(16,185,129,0.12)', border:'rgba(16,185,129,0.25)', badge:'badge-green', label:'Restaurant' },
  hotel:      { emoji:'🏨', bg:'rgba(245,158,11,0.12)', border:'rgba(245,158,11,0.25)', badge:'badge-amber', label:'Hotel'      },
}

const FILTERS = [
  { v:'all',        icon:'📍', label:'All'         },
  { v:'attraction', icon:'🎯', label:'Attractions' },
  { v:'restaurant', icon:'🍽', label:'Restaurants' },
  { v:'hotel',      icon:'🏨', label:'Hotels'      },
]

function haversine(lat1,lon1,lat2,lon2){
  const R=6371,dLat=((lat2-lat1)*Math.PI)/180,dLon=((lon2-lon1)*Math.PI)/180
  const a=Math.sin(dLat/2)**2+Math.cos((lat1*Math.PI)/180)*Math.cos((lat2*Math.PI)/180)*Math.sin(dLon/2)**2
  return +(R*2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a))).toFixed(1)
}

async function geocodeCity(city,countryName){
  try{
    const r=await fetch(`${NOMINATIM}/search?q=${encodeURIComponent(city+', '+countryName)}&format=json&limit=1`,{headers:{'Accept-Language':'en'}})
    const d=await r.json()
    if(d[0]) return {lat:parseFloat(d[0].lat),lon:parseFloat(d[0].lon)}
  }catch{}
  return null
}

async function fetchPOIs(lat,lon,type){
  const tags=OVERPASS_TAGS[type].replace(/\{lat\}/g,lat).replace(/\{lon\}/g,lon)
  try {
    let res;
  
    for (const server of OVERPASS_SERVERS) {
      try {
        const controller = new AbortController();
    
        const timeout = setTimeout(() => {
          controller.abort();
        }, 8000);
    
        res = await fetch(server, {
          method: "POST",
          body: "data=" + encodeURIComponent(query),
          signal: controller.signal,
        });
    
        clearTimeout(timeout);
    
        if (res.ok) break;
      } catch {}
    }
  
    if (!res || !res.ok) {
      throw new Error("All Overpass servers failed");
    }
  
    const data = await res.json();
    return(d.elements||[]).filter(e=>e.tags?.name).map(e=>({
      id:`${type}-${e.id}`,name:e.tags.name,
      area:e.tags['addr:city']||e.tags['addr:suburb']||'',
      distance:haversine(lat,lon,e.lat,e.lon)+' km',
      distNum:haversine(lat,lon,e.lat,e.lon),
      rating:Math.floor(Math.random()*2)+4,
      type,emoji:TYPE_META[type].emoji,lat:e.lat,lon:e.lon,
      website:e.tags?.website||null,phone:e.tags?.phone||null,
      openingHours:e.tags?.opening_hours||null,cuisine:e.tags?.cuisine||null,
    })).sort((a,b)=>a.distNum-b.distNum).slice(0,12)
  }catch{return[]}
}

function Stars({n}){
  return <span className="text-amber-400 text-xs">{'★'.repeat(n)}{'☆'.repeat(5-n)}</span>
}

function SkeletonRow(){
  return(
    <div className="place-card animate-pulse">
      <div className="w-12 h-12 rounded-xl flex-shrink-0" style={{background:'rgba(255,255,255,0.07)'}}/>
      <div className="flex-1 space-y-2">
        <div className="h-3 rounded" style={{background:'rgba(255,255,255,0.07)',width:'65%'}}/>
        <div className="h-2.5 rounded" style={{background:'rgba(255,255,255,0.05)',width:'45%'}}/>
        <div className="h-2.5 rounded" style={{background:'rgba(255,255,255,0.05)',width:'30%'}}/>
      </div>
    </div>
  )
}

function DetailDrawer({place,onClose}){
  const tm=TYPE_META[place.type]||TYPE_META.attraction
  return(
    <motion.div className="flex-shrink-0"
      style={{borderTop:'1px solid rgba(255,255,255,0.08)',background:'rgba(8,14,30,0.97)',padding:'12px 16px'}}
      initial={{opacity:0,height:0}} animate={{opacity:1,height:'auto'}}
      exit={{opacity:0,height:0}} transition={{duration:0.22}}>
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
          style={{background:tm.bg,border:`1px solid ${tm.border}`}}>{place.emoji}</div>
        <div className="flex-1 min-w-0">
          <div className="font-bold text-white text-sm truncate">{place.name}</div>
          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
            {place.area&&<span className="text-xs" style={{color:'var(--muted)'}}>{place.area} · {place.distance}</span>}
            <Stars n={place.rating}/>
            <span className={`badge ${tm.badge} text-[10px] capitalize`}>{tm.label}</span>
            {place.cuisine&&<span className="badge badge-blue text-[10px]">{place.cuisine.split(';')[0]}</span>}
          </div>
          {place.openingHours&&<div className="text-[10px] mt-1" style={{color:'var(--muted)'}}>🕐 {place.openingHours}</div>}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {place.lat&&(
            <a href={`https://www.openstreetmap.org/?mlat=${place.lat}&mlon=${place.lon}#map=17/${place.lat}/${place.lon}`}
              target="_blank" rel="noreferrer"
              className="btn btn-primary" style={{padding:'5px 10px',fontSize:11,borderRadius:8}}>
              🗺 Map
            </a>
          )}
          <button onClick={onClose}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold"
            style={{background:'rgba(255,255,255,0.07)',color:'var(--muted)',border:'1px solid rgba(255,255,255,0.1)'}}>
            ✕
          </button>
        </div>
      </div>
    </motion.div>
  )
}

/* MAIN */
export default function MapPage() {
  const { state }    = useApp()
  const country      = countries[state.selectedCountry]
  const [filter,     setFilter]     = useState('all')
  const [selected,   setSelected]   = useState(null)
  const [places,     setPlaces]     = useState([])
  const [loading,    setLoading]    = useState(false)
  const [cityCoords, setCityCoords] = useState(null)
  const [error,      setError]      = useState(null)
  const [source,     setSource]     = useState('static')
  const [search,     setSearch]     = useState('')
  const fetchRef = useRef(0)

  const loadData = useCallback(async () => {
    if(!country) return
    const tick = ++fetchRef.current
    setLoading(true); setError(null); setPlaces([]); setSelected(null)
    setSource('static'); setCityCoords(null)
    try{
      const city = country.defaultCity || country.capital || country.name
      const coords = await geocodeCity(city, country.name)
      if(tick!==fetchRef.current) return
      if(!coords) throw new Error('Geocode failed')
      setCityCoords(coords)
      const [att,res,hot] = await Promise.all([
        fetchPOIs(coords.lat,coords.lon,'attraction'),
        fetchPOIs(coords.lat,coords.lon,'restaurant'),
        fetchPOIs(coords.lat,coords.lon,'hotel'),
      ])
      if(tick!==fetchRef.current) return
      const all=[...att,...res,...hot]
      if(all.length>0){ setPlaces(all); setSource('live') }
      else { setPlaces(country.places||[]); setSource('static') }
    }catch{
      if(tick!==fetchRef.current) return
      setError('Live data unavailable — showing curated places.')
      setPlaces(country.places||[]); setSource('static')
    }finally{
      if(tick===fetchRef.current) setLoading(false)
    }
  },[state.selectedCountry])

  useEffect(()=>{ loadData() },[loadData])

  const visible = places
    .filter(p=>filter==='all'||p.type===filter)
    .filter(p=>!search||p.name.toLowerCase().includes(search.toLowerCase())||p.area?.toLowerCase().includes(search.toLowerCase()))

  const detail = selected ? places.find(p=>p.id===selected) : null

  const counts = {
    attraction: places.filter(p=>p.type==='attraction').length,
    restaurant: places.filter(p=>p.type==='restaurant').length,
    hotel:      places.filter(p=>p.type==='hotel').length,
  }

  /* OSM embed — dark-inverted via CSS filter on the iframe */
  const mapSrc = cityCoords
    ? `https://www.openstreetmap.org/export/embed.html?bbox=${cityCoords.lon-0.12}%2C${cityCoords.lat-0.09}%2C${cityCoords.lon+0.12}%2C${cityCoords.lat+0.09}&layer=mapnik&marker=${cityCoords.lat}%2C${cityCoords.lon}`
    : null
  const GRID_H = 'calc(100vh - 172px)'

  return (
    <div style={{display:'flex',flexDirection:'column',gap:16}}>

      {/* Top control row */}
      <motion.div style={{display:'flex',flexWrap:'wrap',alignItems:'center',gap:8}}
        initial={{opacity:0,y:-8}} animate={{opacity:1,y:0}}>

        <CountrySelector/>

        {/* Live / curated badge */}
        <div style={{
          display:'flex',alignItems:'center',gap:6,padding:'6px 14px',
          borderRadius:100,fontSize:12,fontWeight:700,flexShrink:0,
          ...(source==='live'
            ?{background:'rgba(16,185,129,0.15)',border:'1px solid rgba(16,185,129,0.3)',color:'#34D399'}
            :{background:'rgba(245,158,11,0.12)',border:'1px solid rgba(245,158,11,0.25)',color:'#FCD34D'})
        }}>
          <span style={{
            width:7,height:7,borderRadius:'50%',flexShrink:0,
            background: source==='live'?'#34D399':'#FCD34D',
            animation: source==='live'?'pulse 1.5s infinite':undefined
          }}/>
          {source==='live'?'● Live':'○ Curated'}
        </div>

        {/* Search — pushed right */}
        <div style={{position:'relative',marginLeft:'auto'}}>
          <span style={{position:'absolute',left:10,top:'50%',transform:'translateY(-50%)',fontSize:12,color:'var(--muted)'}}>🔍</span>
          <input value={search} onChange={e=>setSearch(e.target.value)}
            placeholder="Search destinations..."
            className="input"
            style={{width:200,fontSize:12,paddingLeft:30,paddingTop:7,paddingBottom:7,paddingRight:12}}/>
        </div>

        {/* Filter buttons */}
        {FILTERS.map(f=>(
          <motion.button key={f.v} onClick={()=>{setFilter(f.v);setSelected(null)}}
            whileTap={{scale:0.95}} className="btn"
            style={{fontSize:12,
              ...(filter===f.v?{background:'rgba(59,130,246,0.2)',borderColor:'rgba(59,130,246,0.4)',color:'#93C5FD'}:{})}}>
            {f.icon} {f.label}
            {f.v!=='all'&&counts[f.v]>0&&(
              <span style={{marginLeft:4,padding:'1px 6px',borderRadius:100,fontSize:10,fontWeight:700,
                background:'rgba(59,130,246,0.2)',color:'#93C5FD'}}>{counts[f.v]}</span>
            )}
          </motion.button>
        ))}
      </motion.div>

      {/* 2-column grid */}
      <div style={{
        display:'grid',
        gridTemplateColumns:'3fr 2fr',
        gap:16,
        height: GRID_H,
        minHeight:400
      }}>

        {/* LEFT: Map card */}
        <motion.div
          style={{
            borderRadius:20, padding:0, overflow:'hidden',
            display:'flex', flexDirection:'column',
            height:'100%',
            /* card-flat styles */
            background:'rgba(10,14,28,0.85)',
            backdropFilter:'blur(16px)',
            border:'1px solid rgba(255,255,255,0.07)',
          }}
          initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.1}}>

          {/* Map fill area — flex:1, position:relative so iframe can be absolute inset:0 */}
          <div style={{
            flex:1, minHeight:0, position:'relative',
            borderRadius: detail ? '20px 20px 0 0' : 20,
            overflow:'hidden',
          }}>

            {/* LIVE MAP IFRAME */}
            {mapSrc && !loading && (
              <iframe
                key={mapSrc}
                src={mapSrc}
                title="OpenStreetMap"
                style={{
                  position:'absolute', top:0, left:0,
                  width:'100%', height:'100%',
                  border:'none', display:'block',
                  /* invert makes it dark like the screenshot */
                  filter:'invert(0.88) hue-rotate(180deg) brightness(0.9) contrast(1.08) saturate(0.8)',
                }}
                loading="lazy"
                scrolling="no"
              />
            )}

            {/* LOADING / PLACEHOLDER */}
            {(loading || !mapSrc) && (
              <div style={{
                position:'absolute',inset:0,
                display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:12,
                background:'linear-gradient(135deg,rgba(14,28,54,0.97),rgba(8,14,26,0.99))',
              }}>
                {/* grid lines bg */}
                <div style={{
                  position:'absolute',inset:0,opacity:0.18,
                  backgroundImage:'linear-gradient(rgba(59,130,246,0.4) 1px,transparent 1px),linear-gradient(90deg,rgba(59,130,246,0.4) 1px,transparent 1px)',
                  backgroundSize:'40px 40px',
                }}/>
                <div style={{position:'relative',zIndex:1,textAlign:'center'}}>
                  {loading ? (
                    <>
                      <div style={{
                        width:44,height:44,borderRadius:'50%',
                        border:'2px solid rgba(59,130,246,0.25)',
                        borderTopColor:'#3B82F6',
                        animation:'spin 0.8s linear infinite',
                        margin:'0 auto 12px'
                      }}/>
                      <div style={{color:'#fff',fontWeight:700,fontSize:14}}>Fetching map…</div>
                      <div style={{color:'var(--muted)',fontSize:11,marginTop:4}}>OpenStreetMap · Overpass API</div>
                    </>
                  ):(
                    <>
                      <div style={{fontSize:48,marginBottom:10,opacity:0.5}}>🗺</div>
                      <div style={{color:'#fff',fontWeight:700}}>Interactive Map</div>
                      <div style={{color:'var(--muted)',fontSize:11,marginTop:4}}>Powered by OpenStreetMap • Free</div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* City label overlay */}
            {cityCoords && !loading && (
              <div style={{
                position:'absolute',top:12,left:12,zIndex:10,
                display:'flex',alignItems:'center',gap:8,
                padding:'7px 12px',borderRadius:12,
                background:'rgba(4,8,20,0.78)',backdropFilter:'blur(10px)',
                border:'1px solid rgba(255,255,255,0.13)',
                pointerEvents:'none',
              }}>
                <span style={{fontSize:18}}>{country.flag}</span>
                <div>
                  <div style={{color:'#fff',fontSize:12,fontWeight:700,lineHeight:1.2}}>{country.defaultCity||country.capital}</div>
                  <div style={{color:'rgba(255,255,255,0.42)',fontSize:9}}>OpenStreetMap · Free</div>
                </div>
              </div>
            )}

            {/* Count badges overlay — bottom center */}
            {!loading && (counts.attraction>0||counts.restaurant>0||counts.hotel>0) && (
              <div style={{
                position:'absolute',bottom:12,left:0,right:0,
                display:'flex',gap:8,justifyContent:'center',
                zIndex:10,pointerEvents:'none',
              }}>
                {counts.attraction>0&&<span className="badge badge-blue">🎯 {counts.attraction} Attractions</span>}
                {counts.restaurant>0&&<span className="badge badge-green">🍽 {counts.restaurant} Restaurants</span>}
                {counts.hotel>0&&<span className="badge badge-amber">🏨 {counts.hotel} Hotels</span>}
              </div>
            )}
          </div>

          {/* Detail drawer — slides in, pushes up from bottom */}
          <AnimatePresence>
            {detail && <DetailDrawer key={detail.id} place={detail} onClose={()=>setSelected(null)}/>}
          </AnimatePresence>

          {/* Error bar */}
          {error && (
            <div style={{
              flexShrink:0,padding:'8px 16px',fontSize:11,fontWeight:500,
              display:'flex',alignItems:'center',gap:8,
              background:'rgba(245,158,11,0.08)',
              borderTop:'1px solid rgba(245,158,11,0.15)',color:'#FCD34D',
            }}>
              ⚠️ {error}
              <button onClick={loadData} style={{marginLeft:'auto',fontSize:11,textDecoration:'underline',opacity:0.7,background:'none',border:'none',color:'inherit',cursor:'pointer'}}>
                Retry
              </button>
            </div>
          )}
        </motion.div>

        {/*  RIGHT: Places list */}
        <motion.div className="card"
          style={{
            height:'100%', padding:0,
            display:'flex',flexDirection:'column',overflow:'hidden',
          }}
          initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} transition={{delay:0.15}}>

          {/* Header */}
          <div style={{
            flexShrink:0,display:'flex',alignItems:'center',justifyContent:'space-between',
            padding:'12px 16px',
            borderBottom:'1px solid rgba(255,255,255,0.07)',
          }}>
            <div className="card-title" style={{marginBottom:0}}>📍 Places in {country.name}</div>
            <div style={{display:'flex',alignItems:'center',gap:8}}>
              {loading && (
                <div style={{display:'flex',alignItems:'center',gap:6,fontSize:11,color:'var(--muted)'}}>
                  <div style={{width:13,height:13,borderRadius:'50%',border:'1.5px solid rgba(59,130,246,0.3)',borderTopColor:'#3B82F6',animation:'spin 0.7s linear infinite'}}/>
                  Fetching…
                </div>
              )}
              {source==='live'&&!loading&&(
                <div style={{fontSize:10,fontWeight:700,padding:'2px 8px',borderRadius:100,
                  background:'rgba(16,185,129,0.12)',color:'#34D399',border:'1px solid rgba(16,185,129,0.2)'}}>
                  🌐 Live
                </div>
              )}
              <button onClick={loadData} title="Refresh" style={{
                width:26,height:26,borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center',
                fontSize:12,cursor:'pointer',
                background:'rgba(255,255,255,0.05)',color:'var(--muted)',border:'1px solid rgba(255,255,255,0.08)',
              }}>🔄</button>
            </div>
          </div>

          {/* Scrollable list */}
          <div style={{
            flex:1,overflowY:'auto',padding:'8px 12px',
            scrollbarWidth:'thin',scrollbarColor:'rgba(59,130,246,0.2) transparent',
          }}>
            {loading && Array.from({length:7}).map((_,i)=><SkeletonRow key={i}/>)}

            {!loading && visible.length===0 && (
              <div style={{textAlign:'center',padding:'40px 0',color:'var(--muted)',fontSize:13}}>
                <div style={{fontSize:28,marginBottom:8}}>🔍</div>
                {search?`No results for "${search}"`:'No places for this filter.'}
              </div>
            )}

            {!loading && visible.map((p,i)=>{
              const tm=TYPE_META[p.type]||TYPE_META.attraction
              const isActive=selected===p.id
              return(
                <motion.div key={p.id}
                  onClick={()=>setSelected(isActive?null:p.id)}
                  className="place-card"
                  style={isActive?{background:'rgba(59,130,246,0.08)',borderRadius:10,paddingLeft:10}:{}}
                  initial={{opacity:0,x:10}} animate={{opacity:1,x:0}}
                  transition={{delay:Math.min(i*0.04,0.4)}}>
                  <div style={{
                    width:48,height:48,borderRadius:12,flexShrink:0,
                    display:'flex',alignItems:'center',justifyContent:'center',
                    fontSize:22,background:tm.bg,border:`1px solid ${tm.border}`
                  }}>{p.emoji}</div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontWeight:700,fontSize:13,color:'#fff',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{p.name}</div>
                    <div style={{fontSize:11,marginTop:2,color:'var(--muted)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>
                      {[p.area,p.distance].filter(Boolean).join(' · ')}
                    </div>
                    <div style={{display:'flex',alignItems:'center',gap:6,marginTop:4,flexWrap:'wrap'}}>
                      <Stars n={p.rating}/>
                      <span className={`badge ${tm.badge}`} style={{fontSize:10,textTransform:'capitalize'}}>{tm.label}</span>
                      {p.cuisine&&<span className="badge badge-blue" style={{fontSize:10}}>{p.cuisine.split(';')[0]}</span>}
                    </div>
                  </div>
                  <motion.span animate={{rotate:isActive?180:0}}
                    style={{fontSize:10,color:'var(--muted)',flexShrink:0}}>▼</motion.span>
                </motion.div>
              )
            })}
          </div>

          {/* Footer */}
          <div style={{
            flexShrink:0,padding:'8px 12px',textAlign:'center',fontSize:10,
            color:'var(--muted2)',borderTop:'1px solid rgba(255,255,255,0.06)',
          }}>
            {source==='live'
              ?'🌐 Real-time data · OpenStreetMap · Overpass API · 100% Free'
              :'📁 Curated places · Change country for live data'}
          </div>
        </motion.div>
      </div>

      <style>{`@keyframes spin{to{transform:rotate(360deg)}} @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}`}</style>
    </div>
  )
}
