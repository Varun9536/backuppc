import { Link, useLocation } from 'react-router-dom'
import layoutStyles from './Layout.module.css'
import { useSelector } from 'react-redux'
import { userRoles } from '../services/role'

const Navigation = () => {
  const location = useLocation()

  const { role } = useSelector((state) => state.user)

  const navItems = [
    { path: '/', label: 'Overview', icon: '⌂' },
    { path: '/global-config', label: 'Global Configuration', icon: '⚙' },
    { path: '/hosts', label: 'Hosts', icon: '🖥' },
    { path: '/backups', label: 'Backups', icon: '⟳' },
    { path: '/restore', label: 'Restore', icon: '⤵' },
    { path: '/reports', label: 'Reports & Logs', icon: '📊' },
    //{ path: '/notifications', label: 'Notifications', icon: '✉' }
  ]

  const cloudNavItems = [
    { path: '/cloud/overview', label: 'Cloud Overview', icon: '☁' },   
    { path: '/cloud/transfers', label: 'Cloud Transfers', icon: '⇅' },
    { path: '/cloud/backups', label: 'Cloud Backups', icon: '🗂' },
    { path: '/cloud/reports', label: 'Cloud Reports & Logs', icon: '📜' },
   // { path: '/cloud/notifications', label: 'Cloud Notifications', icon: '🔔' },
    { path: '/cloud/settings', label: 'Cloud Settings', icon: '⚡' }
  ]


  const userNavItems = [
    { path: '/', label: 'Overview', icon: '⌂' },
    { path: '/backups', label: 'My Backups', icon: '⟳' },
    { path: '/restore', label: 'Restore Files', icon: '⤵' },
    { path: '/reports', label: 'Reports', icon: '📊' },

  ]

  return (
    <nav>
      <div className={layoutStyles.sidebarSectionTitle}>Navigation</div>
      <div className={layoutStyles.sidebarNav}>

        {role == userRoles.level2 ? <>{navItems.map(item => {
          const isActive =
            item.path === '/'
              ? location.pathname === '/'
              : location.pathname.startsWith(item.path)

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`${layoutStyles.sidebarLink} ${isActive ? layoutStyles.sidebarLinkActive : ''
                }`}
            >
              <span className={layoutStyles.sidebarLinkIcon}>{item.icon}</span>
              <span className={layoutStyles.sidebarLinkLabel}>{item.label}</span>
            </Link>
          )
        })}</> :


          <>{userNavItems.map(item => {
            const isActive =
              item.path === '/'
                ? location.pathname === '/'
                : location.pathname.startsWith(item.path)

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`${layoutStyles.sidebarLink} ${isActive ? layoutStyles.sidebarLinkActive : ''
                  }`}
              >
                <span className={layoutStyles.sidebarLinkIcon}>{item.icon}</span>
                <span className={layoutStyles.sidebarLinkLabel}>{item.label}</span>
              </Link>
            )
          })}</>

        }

      </div>

      {
        role == userRoles.level2 && (<>

          <div className={layoutStyles.sidebarSectionTitle}>Cloud Management</div>
          <div className={layoutStyles.sidebarNav}>
            {cloudNavItems.map(item => {
              const isActive = location.pathname.startsWith(item.path)

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`${layoutStyles.sidebarLink} ${isActive ? layoutStyles.sidebarLinkActive : ''
                    }`}
                >
                  <span className={layoutStyles.sidebarLinkIcon}>{item.icon}</span>
                  <span className={layoutStyles.sidebarLinkLabel}>{item.label}</span>
                </Link>
              )
            })}
          </div>
        </>)
      }

    </nav>
  )
}

export default Navigation

