import { useCallback, useEffect, useState } from 'react'
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import Toast from './components/common/Toast'
import DashboardLayout from './components/layout/DashboardLayout'
import ActivityHistoryPage from './features/activity/ActivityHistoryPage'
import LoginPage from './features/auth/LoginPage'
import OverviewPage from './features/overview/OverviewPage'
import ProfilePage from './features/profile/ProfilePage'
import SensorHistoryPage from './features/sensors/SensorHistoryPage'
import { authSession } from './services/apiClient'
import { iotApi } from './services/iotApi'

function AppRoutes({ onLogout }) {
  const [devices, setDevices] = useState([])
  const [summary, setSummary] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [toast, setToast] = useState('')

  const refreshOverview = useCallback(async (showError = false) => {
    try {
      const [nextSummary, nextDevices] = await Promise.all([
        iotApi.getDashboard(),
        iotApi.getDevices(),
      ])
      setSummary(nextSummary)
      setDevices(nextDevices.map((device) => ({
        ...device,
        on: device.isOn,
        room: nextSummary.room.name,
      })))
    } catch (error) {
      if (showError && error.status !== 401) setToast(error.message)
    }
  }, [])

  useEffect(() => {
    const initialTimer = window.setTimeout(() => refreshOverview(true), 0)
    const timer = window.setInterval(() => refreshOverview(false), 3000)
    return () => {
      window.clearTimeout(initialTimer)
      window.clearInterval(timer)
    }
  }, [refreshOverview])

  const toggleDevice = async (id) => {
    const targetDevice = devices.find((device) => device.id === id)
    if (!targetDevice) return
    try {
      await iotApi.controlDevice(id, !targetDevice.on, targetDevice.brightness)
      await refreshOverview()
      setToast(`${targetDevice.name} đã được ${targetDevice.on ? 'tắt' : 'bật'}`)
    } catch (error) {
      setToast(error.message)
    }
  }

  const controlAllDevices = async (isOn) => {
    try {
      await iotApi.controlAll(isOn)
      await refreshOverview()
      setToast(`Đã ${isOn ? 'bật' : 'tắt'} tất cả thiết bị`)
    } catch (error) {
      setToast(error.message)
    }
  }

  const closeToast = useCallback(() => setToast(''), [])

  return (
    <>
      <Routes>
        <Route
          element={(
            <DashboardLayout
              sidebarOpen={sidebarOpen}
              onOpenMenu={() => setSidebarOpen(true)}
              onCloseMenu={() => setSidebarOpen(false)}
              onLogout={onLogout}
            />
          )}
        >
          <Route
            index
            element={(
              <OverviewPage
                summary={summary}
                devices={devices}
                onToggle={toggleDevice}
                onAllOn={() => controlAllDevices(true)}
                onAllOff={() => controlAllDevices(false)}
              />
            )}
          />
          <Route path='sensors' element={<SensorHistoryPage />} />
          <Route path='history' element={<ActivityHistoryPage />} />
          <Route path='profile' element={<ProfilePage onNotify={setToast} />} />
          <Route path='*' element={<Navigate to='/' replace />} />
        </Route>
      </Routes>
      {toast && <Toast message={toast} onClose={closeToast} />}
    </>
  )
}

export default function App() {
  const [authenticated, setAuthenticated] = useState(authSession.hasToken())

  const handleLogout = useCallback(() => {
    authSession.clear()
    setAuthenticated(false)
  }, [])

  useEffect(() => {
    const handleExpired = () => setAuthenticated(false)
    window.addEventListener('lumina:auth-expired', handleExpired)
    return () => window.removeEventListener('lumina:auth-expired', handleExpired)
  }, [])

  if (!authenticated) return <LoginPage onAuthenticated={() => setAuthenticated(true)} />

  return (
    <HashRouter>
      <AppRoutes onLogout={handleLogout} />
    </HashRouter>
  )
}
