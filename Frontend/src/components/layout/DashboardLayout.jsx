import Sidebar from './Sidebar'
import Topbar from './Topbar'

export default function DashboardLayout({ activePage, sidebarOpen, onNavigate, onOpenMenu, onCloseMenu, children }) {
  return (
    <div className="app-shell">
      <Sidebar
        active={activePage}
        onNavigate={onNavigate}
        open={sidebarOpen}
        onClose={onCloseMenu}
      />
      <div className="main-shell">
        <Topbar page={activePage} onMenu={onOpenMenu} />
        <main>{children}</main>
      </div>
    </div>
  )
}
