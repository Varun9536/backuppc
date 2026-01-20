import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { reportsAPI } from '../services/api'
import styles from './Reports.module.css'
import jsPDF from "jspdf";
const Reports = () => {
  const navigate = useNavigate()
  const [logType, setLogType] = useState('backup')
  // const [logDates, setLogDates] = useState([])
  // const [selectedDate, setSelectedDate] = useState('')
  const [logContent, setLogContent] = useState('')
  const [loading, setLoading] = useState(false)

  // useEffect(() => {
  //   loadLogDates()
  // }, [logType])

  // useEffect(() => {
  //   if (selectedDate) {
  //     loadLog()
  //   } else {
  //     setLogContent('')
  //   }
  // }, [logType, selectedDate])






  useEffect(() => {
    if (logType) {
      loadLog()
    } else {
      setLogContent('')
    }
  }, [logType])

  const handleDownloadLogs = () => {
    if (!logContent?.content) {
      alert("No logs available to download");
      return;
    }
    const doc = new jsPDF();

    // Format date: DD-MM-YYYY
    const today = new Date();
    const printDate = today.toLocaleDateString("en-GB").replace(/\//g, "-");

    // Title
    doc.setFontSize(12);
    doc.text(`Print On: ${printDate}`, 10, 10);

    // Log content
    doc.setFontSize(10);
    const pageWidth = doc.internal.pageSize.getWidth();
    const textLines = doc.splitTextToSize(
      logContent.content,
      pageWidth - 20
    );

    doc.text(textLines, 10, 20);

    // Save PDF
    doc.save(`cloud-logs-${printDate}.pdf`);
  };
  // const loadLogDates = async () => {
  //   try {
  //     setLoading(true)
  //     const dates = await reportsAPI.getLogDates(logType)
  //     setLogDates(dates)
  //     if (dates.length > 0) {
  //       setSelectedDate(dates[0])
  //     } else {
  //       setSelectedDate('')
  //     }
  //   } catch (error) {
  //     console.error('Error loading log dates:', error)
  //     alert('Failed to load log dates')
  //   } finally {
  //     setLoading(false)
  //   }
  // }

  const loadLog = async () => {

    try {
      setLoading(true)
      const tomorrow = new Date(Date.now() + 86400000)
        .toISOString()
        .slice(0, 10)
        .replace(/-/g, "-");

      const content = await reportsAPI.getLog(logType, tomorrow)
      //  console.log("logcontent", logContent)
      setLogContent(content)
    } catch (error) {
      console.error('Error loading log:', error)
      alert('Failed to load log')
      setLogContent('')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      {/* <h1>Reports & Logs</h1> */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Reports & Logs</h1>

        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={handleDownloadLogs}
            style={{
              padding: "8px 12px",
              borderRadius: 8,
              border: "1px solid #0284c7",
              background: "#e0f2fe", // sky blue
              color: "#0369a1",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Download Logs
          </button>

          <button
            onClick={() => {
              if (
                window.confirm(
                  "Are you sure you want to permanently clear reports & logs?"
                )
              ) {
                handleDeleteLog();
              }
            }}
            style={{
              padding: "8px 12px",
              borderRadius: 8,
              border: "1px solid #dc2626",
              background: "#fee2e2",
              color: "#b91c1c",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Clear Logs
          </button>
        </div>
      </div>
      <div className={styles.selectGroup}>
        <label htmlFor="logSelect">Select Log Type:</label>
        <select
          id="logSelect"
          value={logType}
          onChange={(e) => {
            setLogType(e.target.value)
            setLogContent('')
          }}
          disabled={loading}
        >
          <option value="backup">Backup Logs</option>

          {/* <option value="restore">Restore Logs</option>
          <option value="system">System Logs</option> */}

        </select>
      </div>

      { /*  <div className={styles.selectGroup}>
        <label htmlFor="logDateSelect">Select Log Date/Version:</label>
        <select
          id="logDateSelect"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          disabled={loading || logDates.length === 0}
        >
          {logDates.length === 0 ? (
            <option value="">No logs available</option>
          ) : (
            logDates.map(date => (
              <option key={date} value={date}>
                {date}
              </option>
            ))
          )}
        </select>
      </div>  */}




      {/* <button
        onClick={loadLog}
        disabled={loading || !selectedDate}
        className={styles.loadButton}
      >
        {loading ? 'Loading...' : 'Load Log'}
      </button> */}

      <textarea
        id="logContent"
        className={styles.logContent}
        value={logContent?.content}
        readOnly
        placeholder="Log contents will appear here..."
      />

      <button onClick={() => navigate('/')} className={styles.backButton}>
        ← Back to Home
      </button>
    </div>
  )
}

export default Reports

