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

    // Date & Time: DD-MM-YYYY HH:mm:ss
    const now = new Date();
    const printDateTime = now
      .toLocaleString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      })
      .replace(/\//g, "-")
      .replace(",", "");

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    const margin = 10;
    const headerHeight = 15;
    const lineHeight = 6;

    // Helper: draw header on each page
    const drawHeader = () => {
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("Reports & Logs", margin, 10);

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(`Printed On: ${printDateTime}`, pageWidth - margin, 10, {
        align: "right",
      });
    };

    drawHeader();

    // Split text
    const textLines = doc.splitTextToSize(
      logContent.content,
      pageWidth - margin * 2
    );

    let y = headerHeight;

    textLines.forEach((line) => {
      if (y + lineHeight > pageHeight - margin) {
        doc.addPage();
        drawHeader();
        y = headerHeight;
      }

      doc.text(line, margin, y);
      y += lineHeight;
    });

    // Save PDF
    doc.save(`Reports_Logs-${printDateTime.replace(/:/g, "-")}.pdf`);
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

