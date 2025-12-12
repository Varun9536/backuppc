import Navigation from './Navigation'
import styles from './Layout.module.css'
import { useDispatch } from 'react-redux'
import { logout } from '../Redux/userSlice'
import { Navigate, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'

const Layout = ({ children }) => {

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const {clearstate} = useApp()

  const handleLogout = ()=>
  {
   
    dispatch(logout())
    clearstate()
    navigate("/")
  }


  return (
    <div className={styles.appShell}>
      <header className={styles.topbar}>
        <div className={styles.brand}>
          <div className={styles.brandMark}>IS</div>
          <div className={styles.brandText}>
            <span className={styles.brandName}>ISyncLite</span>
            <span className={styles.brandSub}>Backup Administration</span>
          </div>
        </div>
         <div onClick={handleLogout} className={styles.userBadge}>Logout</div>
        {/* <div className={styles.userBadge}>Admin Console</div> */}
      </header>


      

      <aside className={styles.sidebar}>
        <Navigation />
      </aside>

      <main className={styles.main}>
        <div className={styles.mainInner}>{children}</div>
      </main>
    </div>
  )
}

export default Layout

