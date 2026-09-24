import { useCallback, useState } from 'react'
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import Toast from './components/common/Toast'
import DashboardLayout from './components/layout/DashboardLayout'
import ActivityHistoryPage from './features/activity/ActivityHistoryPage'
import OverviewPage from './features/overview/OverviewPage'
import ProfilePage from './features/profile/ProfilePage'
import SensorHistoryPage from './features/sensors/SensorHistoryPage'
import { initialDevices } from './mocks/iotData'

function AppRoutes() {
  const [devices, setDevices] = useState(initialDevices)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [toast, setToast] = useState('')

  const toggleDevice = (id) => {
    const targetDevice = devices.find((device) => device.id === id)
    if (!targetDevice) return

    setDevices((currentDevices) => currentDevices.map((device) => (
      device.id === id ? { ...device, on: !device.on, updated: 'Vừa xong' } : device
    )))
    setToast(`${targetDevice.name} đã được ${targetDevice.on ? 'tắt' : 'bật'}`)
  }

  const turnAllDevicesOff = () => {
    setDevices((currentDevices) => currentDevices.map((device) => ({
      ...device,
      on: false,
      updated: 'Vừa xong',
    })))
    setToast('Đã tắt tất cả thiết bị')
  }

  const turnAllDevicesOn = () => {
    setDevices((currentDevices) => currentDevices.map((device) => ({
      ...device,
      on: true,
      updated: 'Vừa xong',
    })))
    setToast('Đã bật tất cả thiết bị')
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
            />
          )}
        >
          <Route
            index
            element={(
              <OverviewPage
                devices={devices}
                onToggle={toggleDevice}
                onAllOn={turnAllDevicesOn}
                onAllOff={turnAllDevicesOff}
              />
            )}
          />
          <Route path='sensors' element={<SensorHistoryPage />} />
          <Route path='history' element={<ActivityHistoryPage />} />
          <Route path='profile' element={<ProfilePage />} />
          <Route path='*' element={<Navigate to='/' replace />} />
        </Route>
      </Routes>
      {toast && <Toast message={toast} onClose={closeToast} />}
    </>
  )
}

export default function App() {
  return (
    <HashRouter>
      <AppRoutes />
    </HashRouter>
  )
}
