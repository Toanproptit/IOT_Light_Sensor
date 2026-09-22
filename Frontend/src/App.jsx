import { useCallback, useState } from 'react'
import Toast from './components/common/Toast'
import DashboardLayout from './components/layout/DashboardLayout'
import { DEFAULT_PAGE } from './config/navigation'
import ActivityHistoryPage from './features/activity/ActivityHistoryPage'
import DeviceControlPage from './features/devices/DeviceControlPage'
import OverviewPage from './features/overview/OverviewPage'
import ProfilePage from './features/profile/ProfilePage'
import SensorHistoryPage from './features/sensors/SensorHistoryPage'
import useHashNavigation from './hooks/useHashNavigation'
import { initialDevices } from './mocks/iotData'

export default function App() {
  const { activePage, navigate } = useHashNavigation()
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

  const changeBrightness = (id, brightness) => {
    setDevices((currentDevices) => currentDevices.map((device) => (
      device.id === id ? { ...device, brightness, updated: 'Vừa xong' } : device
    )))
  }

  const turnAllDevicesOff = () => {
    setDevices((currentDevices) => currentDevices.map((device) => ({
      ...device,
      on: false,
      updated: 'Vừa xong',
    })))
    setToast('Đã tắt tất cả thiết bị')
  }

  const closeToast = useCallback(() => setToast(''), [])

  const pages = {
    overview: <OverviewPage devices={devices} onToggle={toggleDevice} onNavigate={navigate} />,
    sensors: <SensorHistoryPage />,
    devices: (
      <DeviceControlPage
        devices={devices}
        onToggle={toggleDevice}
        onBrightness={changeBrightness}
        onAllOff={turnAllDevicesOff}
      />
    ),
    history: <ActivityHistoryPage />,
    profile: <ProfilePage />,
  }

  return (
    <>
      <DashboardLayout
        activePage={activePage}
        sidebarOpen={sidebarOpen}
        onNavigate={navigate}
        onOpenMenu={() => setSidebarOpen(true)}
        onCloseMenu={() => setSidebarOpen(false)}
      >
        {pages[activePage] ?? pages[DEFAULT_PAGE]}
      </DashboardLayout>
      {toast && <Toast message={toast} onClose={closeToast} />}
    </>
  )
}
