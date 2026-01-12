import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { hostsAPI } from '../services/api'
import { useApp } from '../context/AppContext'
import styles from './CreateHost.module.css'

const CreateHost = () => {
  const navigate = useNavigate()
  const { hostname } = useParams()
  const { refreshHosts } = useApp()
  const [loading, setLoading] = useState(!!hostname)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    hostname: '',
    dhcpFlag: '0',
    user: '',
    xferMethod: 'smb',
    clientCharset: 'utf8',
    smbShare: '',
    fullBackupSchedule: '6.97',
    incrBackupSchedule: '0.97',
    retentionFull: 30,
    retentionIncr: 14
  })

  useEffect(() => {
    if (hostname) {
      loadHost()
    }
  }, [hostname])

  const loadHost = async () => {
    try {
      setLoading(true)
      const data = await hostsAPI.get(hostname)
      setFormData(data)
    } catch (error) {
      console.error('Error loading host:', error)
      alert('Failed to load host configuration')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'retentionFull' || name === 'retentionIncr'
        ? Number(value) || ''
        : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    // console.log("formdata " , "create" , formData)
    try {
      setSaving(true)
      const data = await hostsAPI.save(formData);
      //console.log(data)
      if (data?.success == 1) {
        alert(data?.message);
      }
      else if (data?.error.length > 1) {
        alert(data?.error);
      }

      //   refreshHosts()
      //   navigate('/hosts')
    } catch (error) {
      console.error('Error saving host:', error)
      alert('Failed to save host configuration')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className={styles.container}>Loading...</div>
  }

  return (
    <div className={styles.container}>
      <h1>Host Configuration</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <label htmlFor="hostName">Hostname *:</label>
        <input
          type="text"
          id="hostName"
          name="hostname"
          value={formData.hostname}
          onChange={handleChange}
          placeholder="127.0.0.1"
          required
          disabled={!!hostname}
          maxLength={15}
          pattern="^(25[0-5]|2[0-4][0-9]|1?[0-9]{1,2})(\.(25[0-5]|2[0-4][0-9]|1?[0-9]{1,2})){3}$"
          title="Enter valid IP address like 127.0.0.1"
        />

        <label htmlFor="dhcpFlag">DHCP Flag (Is host DHCP?) *:</label>
        <select
          id="dhcpFlag"
          name="dhcpFlag"
          value={formData.dhcpFlag}
          onChange={handleChange}
        >
          <option value="0">No</option>
          <option value="1">Yes</option>
        </select>

        <label htmlFor="user">User (Owner of Host) *:</label>
        <input
          type="text"
          id="user"
          name="user"
          value={formData.user}
          onChange={handleChange}
          placeholder="username"
          required
          maxLength={20}
        />

        {/* <label htmlFor="moreUsers">Additional Users (comma separated):</label>
        <input
          type="text"
          id="moreUsers"
          name="moreUsers"
          value={formData.moreUsers}
          onChange={handleChange}
          placeholder="user1,user2"
        /> */}

        <label htmlFor="xferMethod">Transfer Method: *</label>
        <select
          id="xferMethod"
          name="xferMethod"
          value={formData.xferMethod}
          onChange={handleChange}
        >
          <option value="smb">SMB/CIFS</option>
          <option value="rsync">rsync</option>
          <option value="tar">tar</option>
          <option value="ftp">FTP</option>
        </select>

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
        /> */}

        <label htmlFor="fullBackupSchedule">Full Backup Schedule:</label>
        <input
          type="text"
          id="fullBackupSchedule"
          name="fullBackupSchedule"
          value={formData.fullBackupSchedule}
          onChange={handleChange}
          placeholder="0 2 * * 0 (Every Sunday 2AM)"
          maxLength={4}
        />

        <label htmlFor="incrBackupSchedule">Incremental Backup Schedule:</label>
        <input
          type="text"
          id="incrBackupSchedule"
          name="incrBackupSchedule"
          value={formData.incrBackupSchedule}
          onChange={handleChange}
          placeholder="0 2 * * 1-6 (Mon-Sat 2AM)"
          maxLength={4}
        />

        <label htmlFor="retentionFull">Full Backup Retention (Days) *:</label>
        <input
          type="number"
          id="retentionFull"
          name="retentionFull"
          value={formData.retentionFull}
          onChange={handleChange}
          min={1}
          max={3}
          required
        />

        <label htmlFor="retentionIncr">Incremental Backup Retention (Days) *:</label>
        <input
          type="number"
          id="retentionIncr"
          name="retentionIncr"
          value={formData.retentionIncr}
          onChange={handleChange}
          min={1}
          max={3}
          required
        />

        <button type="submit" disabled={saving}>
          {saving ? 'Saving...' : 'Save Host Configuration'}
        </button>
      </form>

      <button onClick={() => navigate('/hosts')} className={styles.backButton}>
        ← Back to Hosts List
      </button>
    </div>
  )
}

export default CreateHost

