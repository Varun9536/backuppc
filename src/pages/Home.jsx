import { Link } from 'react-router-dom'
import styles from './Home.module.css'

const Home = () => {
  const menuItems = [
    {
      path: '/global-config',
      label: 'Global Configuration',
      description: 'Storage locations, compression and pool lifecycle.',
      icon: '⚙'
    },
    {
      path: '/hosts',
      label: 'Manage Hosts',
      description: 'Register machines, owners and transfer methods.',
      icon: '🖥'
    },
    {
      path: '/backups',
      label: 'Backups',
      description: 'Monitor status and trigger full or incremental runs.',
      icon: '⟳'
    },
    {
      path: '/restore',
      label: 'Restore',
      description: 'Browse snapshots and securely recover files.',
      icon: '⤵'
    },
    {
      path: '/reports',
      label: 'Reports & Logs',
      description: 'Audit history, analyze outcomes and spot issues.',
      icon: '📊'
    },
    {
      path: '/notifications',
      label: 'Notifications',
      description: 'Reminder cadence, email templates and routing.',
      icon: '✉'
    }
  ]



 

  return (
    <div className={styles.home}>
      <section className={styles.hero}>
        <div>
          <p className={styles.eyebrow}>Backup Health at a Glance</p>
          <h1>ISyncLite Backup Admin Panel</h1>
          <p className={styles.subtitle}>
            Configure clients, orchestrate backups, restore data and keep teams in the loop,
            all from a single delightful console.
          </p>
        </div>
        <div className={styles.heroBadge}>
          <span className={styles.badgeIcon}>☁</span>
          <div>
            <strong>4.4.0</strong>
            <p>Powered by BackupPC</p>
          </div>
        </div>
      </section>

      <nav className={styles.menuGrid}>
        {menuItems.map(item => (
          <Link key={item.path} to={item.path} className={styles.menuCard}>
            <div className={styles.iconBubble}>{item.icon}</div>
            <div>
              <h3>{item.label}</h3>
              <p>{item.description}</p>
            </div>
            <span className={styles.arrow}>→</span>
          </Link>
        ))}
      </nav>
    </div>
  )
}

export default Home

