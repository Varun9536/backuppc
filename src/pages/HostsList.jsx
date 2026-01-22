import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { hostsAPI } from '../services/api'
import { useApp } from '../context/AppContext'
import styles from './HostsList.module.css'
import layoutStyles from "../components/Layout.module.css";


const HostsList = () => {
  const navigate = useNavigate()
  const { hosts, loading, refreshHosts } = useApp()
  const [localHosts, setLocalHosts] = useState([])



  // useEffect(() => {
  //   if (hosts.length > 0) {
  //     setLocalHosts(hosts)
  //   } else {
  //     loadHosts()
  //   }
  // }, [hosts])

  useEffect(() => {
    loadHosts()
  }, [])

  const loadHosts = async () => {
    try {
      const data = await hostsAPI.list()
      setLocalHosts(data)
    } catch (error) {
      console.error('Error loading hosts:', error)
      alert('Failed to load hosts')
    }
  }

  const handleEdit = (hostname) => {
    navigate(`/hosts/edit/${hostname}`)
  }

  const handleDelete = async (hostname) => {
    if (!window.confirm(`Are you sure you want to delete host "${hostname}"?`)) {
      return
    }

    try {
      await hostsAPI.delete(hostname)
      alert(`Host "${hostname}" deleted successfully`)
      refreshHosts()
      loadHosts()
    } catch (error) {
      console.error('Error deleting host:', error)
      alert('Failed to delete host')
    }
  }

  return (
    <div className={styles.container}>
      <h1>Hosts List</h1>
      <div className={styles.buttonBar}>
        <button
          className={styles.addButton}
          onClick={() => navigate("/hosts/createHost")}
        >
          + Add New Host
        </button>

        <button
          onClick={() => navigate("/")}
          className={styles.backButton}
        >
          ← Back to Home
        </button>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Hostname</th>
              <th>DHCP</th>
              <th>User Owner</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {localHosts.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center' }}>
                  No hosts found. Add a new host to get started.
                </td>
              </tr>
            ) : (
              localHosts.map(host => (
                <tr key={host.hostname}>
                  <td>{host.hostname}</td>
                  <td>{host.dhcpFlag == "1" ? 'Yes' : 'No'}</td>
                  <td>{host.user || '-'}</td>
                  <td>
                    <div style={{ display: "flex", gap: 8 }}>
                      {/* Edit */}
                      <button
                        className={layoutStyles.iconBtn}
                        onClick={() => handleEdit(host.hostname)}
                        title="Edit"
                      >
                        <img
                          src="/assets/edit.ico"
                          alt="Edit"
                          width={16}
                          height={16}
                        />
                      </button>

                      {/* Delete */}
                      <button
                        className={layoutStyles.iconBtn}
                        onClick={() => {
                          {
                            handleDelete(host.hostname);
                          }
                        }}
                        title="Delete"
                      >
                        <img
                          src="/assets/delete.ico"
                          alt="Delete"
                          width={16}
                          height={16}
                        />
                      </button>
                    </div>
                  </td>

                </tr>
              ))
            )}
          </tbody>
        </table>
      )}

      <button onClick={() => navigate('/')} className={styles.backButton}>
        ← Back to Home
      </button>
    </div>
  )
}

export default HostsList

