import styles from './Reports.module.css'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchLog } from '../services/api'

const card = {
  padding: '14px 16px',
  borderRadius: '12px',
  background: '#fff',
  boxShadow: '0 8px 20px rgba(17, 24, 39, 0.06)',
  border: '1px solid #e5e7eb'
}

const table = {
  width: '100%',
  borderCollapse: 'collapse',
  marginTop: '8px'
}

const thtd = {
  textAlign: 'left',
  padding: '10px 8px',
  borderBottom: '1px solid #e5e7eb',
  fontSize: '14px'
}

const transfers = [
  { time: '2025-12-15 02:15', provider: 'AWS S3', host: 'farside', action: 'Upload', bytes: '12.4 GB', duration: '14m', status: 'Success', message: '124 objects' },
  { time: '2025-12-15 02:08', provider: 'Azure Blob', host: 'larson', action: 'Upload', bytes: '1.2 GB', duration: '4m', status: 'Success', message: '38 objects' },
  { time: '2025-12-15 01:55', provider: 'AWS S3', host: 'apollo', action: 'Upload', bytes: '9.4 GB', duration: '12m', status: 'Failed', message: 'Network timeout at 78%' }
]

const errors = [
  { time: '2025-12-15 01:55', provider: 'AWS S3', host: 'apollo', summary: 'Network timeout during upload' },
  { time: '2025-12-14 22:10', provider: 'GCS', host: 'zeus', summary: 'Credential expired' }
]

const lifecycle = [
  { time: '2025-12-14 04:00', provider: 'AWS S3', action: 'Retention delete', detail: 'Removed 4 backups older than 90d' },
  { time: '2025-12-14 03:30', provider: 'Azure Blob', action: 'Verification', detail: 'Verified 2 backups' }
]

const statusColor = (status) => {
  if (status === 'Success') return '#16a34a'
  if (status === 'Failed') return '#dc2626'
  return '#374151'
}

const CloudReportsLogs = () => {
  const [logContent, setLogContent] = useState({ content: "" });

  useEffect(() => {
    fetchLog()
      .then((data) => {
        // bind fetched text into state
        setLogContent({ content: data });
      })
      .catch((err) => {
        console.error("Error fetching log:", err);
      });
  }, []);
  
  return (
    <div>
      <h1>Cloud Reports & Logs</h1>

      <section style={{ marginTop: 14 }}>
        <h2>Filters</h2>
        <div style={card}>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <select disabled style={{ padding: '8px 10px', borderRadius: 8, border: '1px solid #d1d5db' }}>
              <option>All Providers</option>
              <option>AWS S3</option>
              <option>Azure Blob</option>
              <option>GCS</option>
            </select>
            <select disabled style={{ padding: '8px 10px', borderRadius: 8, border: '1px solid #d1d5db' }}>
              <option>All Hosts</option>
              <option>farside</option>
              <option>larson</option>
              <option>apollo</option>
              <option>zeus</option>
            </select>
            <select disabled style={{ padding: '8px 10px', borderRadius: 8, border: '1px solid #d1d5db' }}>
              <option>All Events</option>
              <option>Transfers</option>
              <option>Errors</option>
              <option>Retention/Cleanup</option>
            </select>
            <button style={{ padding: '8px 10px', borderRadius: 8, border: '1px solid #d1d5db', background: '#e5edff', cursor: 'not-allowed' }}>
              Apply
            </button>
          </div>
          {/* <div style={{ marginTop: 8, fontSize: 12, color: '#6b7280' }}>
            Filters are UI-only; hook to backend logs later.
          </div> */}
        </div>
      </section>

      <section style={{ marginTop: 16 }}>
        <textarea
          id="logContent"
          className={styles.logContent}
          value={logContent?.content}
          readOnly
          placeholder="Log contents will appear here..."
        />
        {/* <h2>Transfers</h2>
        <div style={card}>
          <table style={table}>
            <thead>
              <tr>
                <th style={{ ...thtd, color: '#6b7280', fontWeight: 600 }}>Time</th>
                <th style={{ ...thtd, color: '#6b7280', fontWeight: 600 }}>Provider</th>
                <th style={{ ...thtd, color: '#6b7280', fontWeight: 600 }}>Host</th>
                <th style={{ ...thtd, color: '#6b7280', fontWeight: 600 }}>Action</th>
                <th style={{ ...thtd, color: '#6b7280', fontWeight: 600 }}>Bytes</th>
                <th style={{ ...thtd, color: '#6b7280', fontWeight: 600 }}>Duration</th>
                <th style={{ ...thtd, color: '#6b7280', fontWeight: 600 }}>Status</th>
                <th style={{ ...thtd, color: '#6b7280', fontWeight: 600 }}>Message</th>
              </tr>
            </thead>
            <tbody>
              {transfers.map(row => (
                <tr key={row.time + row.host}>
                  <td style={thtd}>{row.time}</td>
                  <td style={thtd}>{row.provider}</td>
                  <td style={thtd}>{row.host}</td>
                  <td style={thtd}>{row.action}</td>
                  <td style={thtd}>{row.bytes}</td>
                  <td style={thtd}>{row.duration}</td>
                  <td style={thtd}>
                    <span style={{ color: statusColor(row.status), fontWeight: 600 }}>{row.status}</span>
                  </td>
                  <td style={thtd}>{row.message}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ marginTop: 10, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button style={{ padding: '8px 10px', borderRadius: 8, border: '1px solid #d1d5db', background: '#f8fafc', cursor: 'not-allowed' }}>
              Export CSV
            </button>
            <button style={{ padding: '8px 10px', borderRadius: 8, border: '1px solid #d1d5db', background: '#f8fafc', cursor: 'not-allowed' }}>
              View Raw Log
            </button>
          </div>
        </div> */}
      </section>

      {/* <section style={{ marginTop: 16 }}>
        <h2>Errors & Alerts</h2>
        <div style={card}>
          <table style={table}>
            <thead>
              <tr>
                <th style={{ ...thtd, color: '#6b7280', fontWeight: 600 }}>Time</th>
                <th style={{ ...thtd, color: '#6b7280', fontWeight: 600 }}>Provider</th>
                <th style={{ ...thtd, color: '#6b7280', fontWeight: 600 }}>Host</th>
                <th style={{ ...thtd, color: '#6b7280', fontWeight: 600 }}>Summary</th>
              </tr>
            </thead>
            <tbody>
              {errors.map(row => (
                <tr key={row.time + row.host}>
                  <td style={thtd}>{row.time}</td>
                  <td style={thtd}>{row.provider}</td>
                  <td style={thtd}>{row.host}</td>
                  <td style={thtd}>{row.summary}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section> */}

      {/* <section style={{ marginTop: 16 }}>
        <h2>Retention & Cleanup</h2>
        <div style={card}>
          <table style={table}>
            <thead>
              <tr>
                <th style={{ ...thtd, color: '#6b7280', fontWeight: 600 }}>Time</th>
                <th style={{ ...thtd, color: '#6b7280', fontWeight: 600 }}>Provider</th>
                <th style={{ ...thtd, color: '#6b7280', fontWeight: 600 }}>Action</th>
                <th style={{ ...thtd, color: '#6b7280', fontWeight: 600 }}>Details</th>
              </tr>
            </thead>
            <tbody>
              {lifecycle.map(row => (
                <tr key={row.time + row.provider}>
                  <td style={thtd}>{row.time}</td>
                  <td style={thtd}>{row.provider}</td>
                  <td style={thtd}>{row.action}</td>
                  <td style={thtd}>{row.detail}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section> */}
    </div>
  )
}

export default CloudReportsLogs

