export function Skeleton({ className='' }) {
  return <div className={`rounded-xl ${className}`} style={{ background:'linear-gradient(90deg,rgba(255,255,255,0.05) 25%,rgba(255,255,255,0.09) 50%,rgba(255,255,255,0.05) 75%)', backgroundSize:'200% 100%', animation:'shimmer 1.5s infinite' }}/>
}
export function WeatherSkeleton() {
  return (
    <div className="weather-card space-y-3 opacity-60">
      <Skeleton className="h-4 w-28"/>
      <Skeleton className="h-14 w-36"/>
      <Skeleton className="h-4 w-52"/>
    </div>
  )
}
if(typeof document!=='undefined'&&!document.getElementById('sk-s')){
  const s=document.createElement('style');s.id='sk-s';
  s.textContent='@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}';
  document.head.appendChild(s);
}
