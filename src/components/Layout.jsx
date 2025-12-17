import Navigation from './Navigation'
import styles from './Layout.module.css'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../Redux/userSlice'
import { Navigate, Outlet, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { userRoles } from '../services/role'
import { useEffect } from 'react'

const Layout = () => {

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { clearState } = useApp()

  const { role } = useSelector((state) => state.user)

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

  useEffect(() => {
    let timer;

    const setTimer = () => {
      clearTimeout(timer);
      timer = setTimeout(handleLogout2 ,60000*30)
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
          <div className={styles.brandMark}>IS</div>
          <div className={styles.brandText}>
            <span className={styles.brandName}>ISyncLite</span>
            {role == userRoles.level1 ? <span className={styles.brandSub}>Backup User</span> : <span className={styles.brandSub}>Backup Administration</span>}
          </div>
        </div>
        <div onClick={handleLogout} className={styles.userBadge}>Logout</div>
        {/* <div className={styles.userBadge}>Admin Console</div> */}
      </header>


      <aside className={styles.sidebar}>
        <Navigation />
      </aside>

      <main className={styles.main}>
        <div className={styles.mainInner}>

          <Outlet />

        </div>

      </main>
    </div>
  )
}

export default Layout

