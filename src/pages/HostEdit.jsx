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

      {/* Hostname */}
      <label htmlFor="hostName">Hostname:</label>
      <input
        type="text"
        id="hostName"
        name="hostname"
        value={formData.hostname}
        onChange={handleChange}
        placeholder="192.168.1.42"
        required
        disabled={!!hostname}
      />

      {/* DHCP Flag */}
      <label htmlFor="dhcpFlag">DHCP:</label>
      <select
        id="dhcpFlag"
        name="dhcpFlag"
        value={formData.dhcpFlag || "0"}
        onChange={handleChange}
      >
        <option value="0">No</option>
        <option value="1">Yes</option>
      </select>

      {/* Transfer Method */}
      <label htmlFor="xferMethod">Transfer Method:</label>
      <select
        id="xferMethod"
        name="xferMethod"
        value={formData.xferMethod}
        onChange={handleChange}
      >
        <option value="rsync">rsync</option>
        <option value="smb">SMB / CIFS</option>
        <option value="tar">tar</option>
        <option value="ftp">FTP</option>
      </select>

      {/* Host Owner */}
      <label htmlFor="user">User (Host Owner):</label>
      <input
        type="text"
        id="user"
        name="user"
        value={formData.user || ""}
        onChange={handleChange}
        placeholder="backupuser"
      />

      {/* Backup Periods */}
      <label htmlFor="fullBackupPeriod">Full Backup Schedule:</label>
      <input
        type="number"
        id="fullBackupPeriod"
        name="fullBackupPeriod"
        value={formData.fullBackupPeriod || ""}
        onChange={handleChange}
      />

      <label htmlFor="incrBackupPeriod">Incremental Backup Schedule:</label>
      <input
        type="number"
        id="incrBackupPeriod"
        name="incrBackupPeriod"
        value={formData.incrBackupPeriod || ""}
        onChange={handleChange}
      />

      {/* SMB Overrides */}
      {formData.xferMethod === "smb" && (
        <>
          <label htmlFor="smbShare">SMB Share Name:</label>
          <input
            type="text"
            id="smbShare"
            name="smbShare"
            value={formData.smbShare || ""}//{formData.smbShare?.[formData.hostname] || ""}
            onChange={handleChange}
            placeholder="shared_folder"
            required
          />

          <label htmlFor="smbUserName">SMB Username:</label>
          <input
            type="text"
            id="smbUserName"
            name="smbUserName"
            value={formData.smbUserName || ""}
            onChange={handleChange}
            placeholder="backupuser"
          />

          <label htmlFor="smbPasswd">SMB Password:</label>
          <input
            type="password"
            id="smbPasswd"
            name="smbPasswd"
            value={formData.smbPasswd || ""}
            onChange={handleChange}
            placeholder="********"
          />
        </>
      )}

      <button type="submit" disabled={saving}>
        {saving ? "Saving..." : "Save Host Configuration"}
      </button>
    </form>

    <button onClick={() => navigate("/hosts")} className={styles.backButton}>
      ← Back to Hosts List
    </button>
  </div>
);


}

export default HostEdit

