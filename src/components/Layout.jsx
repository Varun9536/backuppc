import Navigation from './Navigation'
import styles from './Layout.module.css'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../Redux/userSlice'
import { Outlet, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { userRoles } from '../services/role'
import { useEffect, useState } from 'react'
import isynclogo from "../assets/Logo2.svg"

const Layout = () => {

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { clearState } = useApp()
  const { role } = useSelector((state) => state.user)

  const [showHelp, setShowHelp] = useState(false)
  const [showHelp1, setShowHelp1] = useState(false)

  const handleLogout = () => {
    dispatch(logout())
    clearState()
    navigate("/")
  }

  const handleLogout2 = () => {
    dispatch(logout())
    clearState()
    navigate("/")
  }

  const handleHelp = () => {
    setShowHelp(prev => !prev)
  }

  useEffect(() => {
    let timer;

    const setTimer = () => {
      clearTimeout(timer)
      timer = setTimeout(handleLogout2, 60000 * 30)
    }

    window.addEventListener("mousedown", setTimer)
    window.addEventListener("keypress", setTimer)
    window.addEventListener("mousemove", setTimer)
    window.addEventListener("keydown", setTimer)
    setTimer()

    return () => {
      window.removeEventListener("mousedown", setTimer)
      window.removeEventListener("keypress", setTimer)
      window.removeEventListener("mousemove", setTimer)
      window.removeEventListener("keydown", setTimer)
      clearTimeout(timer)
    }
  }, [])

  return (
    <div className={styles.appShell}>
      <header className={styles.topbar}>
        <div className={styles.brand}>
          <div className={styles.isyncLogo}>
            <img style={{ width: "100%" }} src={isynclogo} alt="ISyncLite" />
          </div>
          <div className={styles.brandText}>
            {/* <span className={styles.brandName}>ISyncLite</span> */}
            {role === userRoles.level1
              ? <span className={styles.brandSub}>Backup User</span>
              : <span className={styles.brandSub}>Backup Administration</span>}
          </div>
        </div>

        <div style={{ display: "flex", gap: "0px 10px" }}>

          {/* HELP */}
          <div
            onClick={() => setShowHelp1(!showHelp1)}
            className={styles.userBadgeHelp}
            style={{ cursor: "pointer" }}
          >
            Help
          </div>

          {/* USER GUIDE DOWNLOAD (shown when Help clicked) */}
          {showHelp1 && (
            <a
              href="/assets/user-guide.pdf"
              download="User_Guide.pdf"
              className={styles.sidebarLink}
            >
              <span className={styles.sidebarLinkIcon}>📄</span>
              <span className={styles.sidebarLinkLabel}>User Guide</span>
            </a>
          )}

          {/* LOGOUT */}
          <div onClick={handleLogout} className={styles.userBadge}>
            Logout
          </div>
        </div>

        {/* <div style={{ display: 'flex', gap: "0px 10px" }}>
         * {role === userRoles.level2 && (
            <div onClick={handleHelp} className={styles.userBadgeHelp}>
              {showHelp ? "Close Help" : "Help"}
            </div>
          )} 

           <div onClick={handleLogout} className={styles.userBadge}>
            Logout
          </div> 
        </div> */}

      </header>

      <aside className={styles.sidebar}>
        <Navigation />
      </aside>

      <main className={styles.main}>
        <div className={styles.mainInner}>
          {showHelp ? (
            <iframe
              src="https://chancellor-enjoying-components-fragrance.trycloudflare.com/BackupPC"
              title="BackupPC Help"
              style={{
                width: "100%",
                height: "80vh",
                border: "none"
              }}
            />
          ) : (
            <Outlet />
          )}
        </div>
      </main>
    </div>
  )
}

export default Layout
