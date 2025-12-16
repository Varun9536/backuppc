import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { notificationsAPI } from '../services/api'
import styles from './Notifications.module.css'

const Notifications = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    emailFrom: '',
    emailTo: '',
    sendReminders: true,
    reminderSchedule: '',
    emailSubject: '',
    emailBody: ''
  })

  // const [formData, setFormData] = useState()


  useEffect(() => {
    loadConfig()
  }, [])

  const loadConfig = async () => {
    try {
      setLoading(true)
      const config = await notificationsAPI.get()
setFormData(config)
      

    } catch (error) {
      console.error('Error loading notification config:', error)
      alert('Failed to load notification configuration')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setSaving(true)
      await notificationsAPI.save(formData)
      alert('Notification settings saved successfully!')
    } catch (error) {
      console.error('Error saving notification config:', error)
      alert('Failed to save notification configuration')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className={styles.container}>Loading...</div>
  }

  return (
    <div className={styles.container}>
      <h1>Notification Configuration</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <label htmlFor="emailFrom">From Email Address:</label>
        <input
          type="email"
          id="emailFrom"
          name="emailFrom"
          value={formData?.emailFrom}
          onChange={handleChange}
          placeholder="no-reply@example.com"
        />

        <label htmlFor="emailTo">Default Recipient Email(s):</label>
        <input
          type="text"
          id="emailTo"
          name="emailTo"
          value={formData?.emailTo}
          onChange={handleChange}
          placeholder="user@example.com,admin@example.com"
        />

        <label htmlFor="sendReminders">Send Backup Reminders:</label>
        <select
          id="sendReminders"
          name="sendReminders"
          value={formData?.sendReminders ? '1' : '0'}
          onChange={(e) =>
            setFormData(prev => ({
              ...prev,
              sendReminders: e.target.value === '1'
            }))
          }
        >
          <option value="1">Yes</option>
          <option value="0">No</option>
        </select>

        <label htmlFor="reminderSchedule">Reminder Schedule (Cron Syntax):</label>
        <input
          type="text"
          id="reminderSchedule"
          name="reminderSchedule"
          value={formData?.reminderSchedule}
          onChange={handleChange}
          placeholder="0 8 * * * (Daily at 8 AM)"
        />

        <label htmlFor="emailSubject">Email Subject Template:</label>
        <input
          type="text"
          id="emailSubject"
          name="emailSubject"
          value={formData?.emailSubject}
          onChange={handleChange}
          placeholder="BackupPC Notification"
        />

        <label htmlFor="emailBody">Email Body Template:</label>
        <textarea
          id="emailBody"
          name="emailBody"
          value={formData?.emailBody}
          onChange={handleChange}
          placeholder="Hello,&#10;&#10;This is a reminder that your backup is due."
          rows="5"
        />

        <button type="submit" disabled={saving}>
          {saving ? 'Saving...' : 'Save Notification Settings'}
        </button>
      </form>

      <button onClick={() => navigate('/')} className={styles.backButton}>
        ← Back to Home
      </button>
    </div>
  )
}

export default Notifications

