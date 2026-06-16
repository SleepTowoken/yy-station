import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AdminDashboard } from './admin/AdminDashboard'
import { AdminLayout } from './admin/AdminLayout'
import { AdminMood } from './admin/AdminMood'
import { AdminOutfits } from './admin/AdminOutfits'
import { AdminRhythm } from './admin/AdminRhythm'
import { AdminSparks } from './admin/AdminSparks'
import { AdminSupply } from './admin/AdminSupply'
import { Gate } from './pages/Gate'
import { Home } from './pages/Home'
import { ToastProvider } from './components/Toast'
import { useLocalStorage } from './hooks/useLocalStorage'

function StationApp() {
  const [passedGate, setPassedGate] = useLocalStorage('station_passed_gate', false)

  if (!passedGate) {
    return <Gate onPassed={() => setPassedGate(true)} />
  }

  return <Home />
}

function App() {
  return (
    <ToastProvider>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <Routes>
          <Route path="/admin/*" element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="mood" element={<AdminMood />} />
            <Route path="supply" element={<AdminSupply />} />
            <Route path="rhythm" element={<AdminRhythm />} />
            <Route path="outfits" element={<AdminOutfits />} />
            <Route path="sparks" element={<AdminSparks />} />
          </Route>
          <Route path="*" element={<StationApp />} />
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  )
}

export default App
