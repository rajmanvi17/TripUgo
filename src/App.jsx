import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useAuth } from './context/AuthContext'
import Layout from './components/layout/Layout'
import AuthPage      from './pages/AuthPage'
import DashboardPage from './pages/DashboardPage'
import MapPage       from './pages/MapPage'
import ItineraryPage from './pages/ItineraryPage'
import BudgetPage    from './pages/BudgetPage'
import PackingPage   from './pages/PackingPage'
import ComparePage   from './pages/ComparePage'
import EmergencyPage from './pages/EmergencyPage'
import LocalPage     from './pages/LocalPage'
import UtilitiesPage from './pages/UtilitiesPage'
import AssistantPage from './pages/AssistantPage'
import NotFound      from './pages/NotFound'

function ProtectedRoute({ children }) {
  const { user } = useAuth()
  return user ? children : <Navigate to="/auth" replace />
}
function PublicRoute({ children }) {
  const { user } = useAuth()
  return user ? <Navigate to="/dashboard" replace /> : children
}

export default function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: 'rgba(15,25,42,0.95)',
            color: '#F0F6FF',
            border: '1px solid rgba(255,255,255,0.1)',
            backdropFilter: 'blur(20px)',
            fontFamily: '"Plus Jakarta Sans", sans-serif',
            fontSize: '13px',
            fontWeight: '600',
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
          },
          success: { iconTheme: { primary: '#34D399', secondary: '#0A1118' } },
          error:   { iconTheme: { primary: '#F87171', secondary: '#0A1118' } },
        }}
      />
      <Routes>
        <Route path="/auth" element={<PublicRoute><AuthPage/></PublicRoute>} />
        <Route path="/" element={<ProtectedRoute><Layout/></ProtectedRoute>}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard"  element={<DashboardPage/>} />
          <Route path="map"        element={<MapPage/>} />
          <Route path="itinerary"  element={<ItineraryPage/>} />
          <Route path="budget"     element={<BudgetPage/>} />
          <Route path="packing"    element={<PackingPage/>} />
          <Route path="compare"    element={<ComparePage/>} />
          <Route path="emergency"  element={<EmergencyPage/>} />
          <Route path="local"      element={<LocalPage/>} />
          <Route path="utilities"  element={<UtilitiesPage/>} />
          <Route path="assistant"  element={<AssistantPage/>} />
        </Route>
        <Route path="*" element={<NotFound/>} />
      </Routes>
    </>
  )
}
