import { useApp } from '../../context/AppContext'
import countries from '../../data/countries.json'
export default function CountrySelector({ className='' }) {
  const { state, dispatch } = useApp()
  return (
    <select value={state.selectedCountry}
      onChange={e=>dispatch({type:'SET_COUNTRY',payload:e.target.value})}
      className={`input cursor-pointer max-w-xs ${className}`}>
      {Object.entries(countries).map(([key,c])=>(
        <option key={key} value={key}>{c.flag} {c.name}</option>
      ))}
    </select>
  )
}
