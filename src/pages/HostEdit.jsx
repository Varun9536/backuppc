import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { hostsAPI } from '../services/api'
import { useApp } from '../context/AppContext'
import styles from './HostEdit.module.css'

const HostEdit = () => {
  const navigate = useNavigate()
  const { hostname } = useParams()
  const { refreshHosts } = useApp()
  const [loading, setLoading] = useState(!!hostname)
  const [saving, setSaving] = useState(false)
  // const [formData, setFormData] = useState({
  //   hostname: '',
  //   dhcpFlag: '0',
  //   user: '',
  //   moreUsers: '',
  //   xferMethod: 'rsync',
  //   clientCharset: 'cp1252',
  //   smbShare: 'C$',
  //   fullBackupSchedule: '0 2 * * 0',
  //   incrBackupSchedule: '0 2 * * 1-6',
  //   retentionFull: 30,
  //   retentionIncr: 14
  // })

  const [formData, setFormData] = useState()

  const [serverHostanme, setServerHostName] = useState()

  useEffect(() => {
    if (hostname) {

      loadHost()
    }
  }, [hostname])

  const loadHost = async () => {
    try {
      setLoading(true)
      const data = await hostsAPI.get(hostname)


      //console.log(data , "get edit data")
      setFormData(data)

    } catch (error) {
      console.error('Error loading host:', error)
      alert('Failed to load host configuration')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    //console.log(e.target.value)
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'retentionFull' || name === 'retentionIncr'
        ? Number(value) || 0
        : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const hostname = e?.target?.hostname?.value
    if (hostname.length > 1) {
      try {
        setSaving(true)
        await hostsAPI.update(hostname, formData)
        alert('Host configuration saved successfully!')
        refreshHosts()
        navigate('/hosts')
      } catch (error) {
        console.error('Error saving host:', error)
        alert('Failed to save host configuration')
      } finally {
        setSaving(false)
      }

    }
    // return

  }

  if (loading) {
    return <div className={styles.container}>Loading...</div>
  }

  return (
    <div className={styles.container}>
      <h1>Host Configuration</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <label htmlFor="hostName">Hostname:</label>
        <input
          type="text"
          id="hostName"
          name="hostname"
          value={formData.hostname}
          onChange={handleChange}
          placeholder="127.0.0.1"
          required
          disabled={!!hostname}
        />

        <label htmlFor="xferMethod">Transfer Method:</label>
        <select
          id="xferMethod"
          name="xferMethod"
          value={formData.xferMethod}
          onChange={handleChange}
        >
          <option value="rsync">rsync</option>
          <option value="smb">SMB/CIFS</option>
          <option value="tar">tar</option>
          <option value="ftp">FTP</option>
        </select>

        <label htmlFor="dhcpFlag">DHCP Flag (Is host DHCP?):</label>
        <select
          id="dhcpFlag"
          name="dhcpFlag"
          value={formData.dhcpFlag}
          onChange={handleChange}
        >
          <option value="0">No</option>
          <option value="1">Yes</option>
        </select>

        <label htmlFor="user">User (Owner of Host):</label>
        <input
          type="text"
          id="user"
          name="user"
          value={formData.user}
          onChange={handleChange}
          placeholder="username"
        />
        {formData.xferMethod !== "rsync" && (
          <>
            <label htmlFor="sharePass">SmbSharePassword:</label>
            <input
              type="password"
              id="sharePass"
              name="sharePass"
              value={formData.sharePass || "123456789"}
              onChange={handleChange}
              placeholder=""
            />
          </>
        )}

        <label htmlFor="moreUsers">Additional Users (comma separated):</label>
        <input
          type="text"
          id="moreUsers"
          name="moreUsers"
          value={formData.moreUsers}
          onChange={handleChange}
          placeholder="user1,user2"
        />


        {/* <label htmlFor="clientCharset">Client Charset (for Windows clients):</label>
        <input
          type="text"
          id="clientCharset"
          name="clientCharset"
          value={formData.clientCharset}
          onChange={handleChange}
          placeholder="cp1252"
        /> */}

        {/* <label htmlFor="smbShare">SMB Share Name (if using SMB):</label>
        <input
          type="text"
          id="smbShare"
          name="smbShare"
          value={formData.smbShare}
          onChange={handleChange}
          placeholder="C$"
        />  */}

        <label htmlFor="fullBackupSchedule">Full Backup Schedule (Cron Syntax):</label>
        <input
          type="text"
          id="fullBackupSchedule"
          name="fullBackupSchedule"
          value={formData.fullBackupSchedule}
          onChange={handleChange}
          placeholder="0 2 * * 0 (Every Sunday 2AM)"
        />

        <label htmlFor="incrBackupSchedule">Incremental Backup Schedule (Cron Syntax):</label>
        <input
          type="text"
          id="incrBackupSchedule"
          name="incrBackupSchedule"
          value={formData.incrBackupSchedule}
          onChange={handleChange}
          placeholder="0 2 * * 1-6 (Mon-Sat 2AM)"
        />

        {/* <label htmlFor="retentionFull">Full Backup Retention (Days):</label>
        <input
          type="number"
          id="retentionFull"
          name="retentionFull"
          value={formData.retentionFull}
          onChange={handleChange}
          min="1"
          required
        />

        <label htmlFor="retentionIncr">Incremental Backup Retention (Days):</label>
        <input
          type="number"
          id="retentionIncr"
          name="retentionIncr"
          value={formData.retentionIncr}
          onChange={handleChange}
          min="1"
          required
        />  */}

        <button type="submit" disabled={saving}>
          {saving ? 'Updating...' : 'Update Host Configuration'}
        </button>
      </form>

      <button onClick={() => navigate('/hosts')} className={styles.backButton}>
        ← Back to Hosts List
      </button>
    </div>
  )
}

export default HostEdit

