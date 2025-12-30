const stats = [
  { label: 'Total Cloud Storage Used', value: '1.8 TB', sub: 'Across 12 hosts' },
  { label: 'Last Transfer', value: 'Today 02:15', sub: 'Success • 12.4 GB' },
  { label: 'Next Scheduled Sync', value: 'Tonight 02:00', sub: 'Daily at 2 AM' },
  { label: 'Active Providers', value: '3', sub: 'S3 + Azure + GCS' }
]

const providerCards = [
  { name: 'AWS S3', status: 'Healthy', region: 'us-east-1', bucket: 'backuppc-prod', storage: '1.1 TB', lastSync: '02:15', nextSync: '02:00' },
  { name: 'Azure Blob', status: 'Healthy', region: 'eastus', bucket: 'backuppc-az', storage: '500 GB', lastSync: '01:40', nextSync: '02:30' },
  { name: 'GCS', status: 'Standby', region: 'us-central1', bucket: 'backuppc-gcs', storage: '200 GB', lastSync: '—', nextSync: 'On-demand' }
]

const providerChecks = [
  { name: 'AWS S3', status: 'Healthy', latency: '142 ms', region: 'us-east-1' },
  { name: 'Azure Blob', status: 'Healthy', latency: '160 ms', region: 'eastus' },
  { name: 'GCS', status: 'Standby', latency: '—', region: 'us-central1' }
]

const recentActivity = [
  { provider: 'AWS S3', host: 'farside', type: 'Full', size: '8.1 GB', status: 'Success', ended: '02:15' },
  { provider: 'Azure Blob', host: 'larson', type: 'Incr', size: '1.2 GB', status: 'Success', ended: '02:08' },
  { provider: 'AWS S3', host: 'apollo', type: 'Full', size: '9.4 GB', status: 'Failed', ended: '01:55' },
  { provider: 'GCS', host: 'zeus', type: 'Incr', size: '900 MB', status: 'Queued', ended: '—' }
]

const card = {
  padding: '14px 16px',
  borderRadius: '12px',
  background: '#fff',
  boxShadow: '0 8px 20px rgba(17, 24, 39, 0.06)',
  border: '1px solid #e5e7eb'
}

const grid = {
  display: 'grid',
  gap: '12px',
  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
  marginTop: '12px'
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

const statusColor = (status) => {
  switch (status) {
    case 'Success':
    case 'Healthy':
      return '#16a34a'
    case 'Queued':
      return '#eab308'
    case 'Failed':
      return '#dc2626'
    default:
      return '#374151'
  }
}

const badge = (text, color) => (
  <span
    style={{
      display: 'inline-block',
      padding: '4px 8px',
      borderRadius: 999,
      background: '#f8fafc',
      border: '1px solid #e5e7eb',
      color
    }}
  >
    {text}
  </span>
)

const CloudOverview = () => {
  return (
    <div>
      <h1>Cloud Overview</h1>

      <section style={{ marginTop: 16 }}>
        <h2>At a Glance</h2>
        <div style={grid}>
          {stats.map(item => (
            <div key={item.label} style={card}>
              <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 4 }}>{item.label}</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#111827' }}>{item.value}</div>
              <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>{item.sub}</div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginTop: 18 }}>
        <h2>Active Providers</h2>
        <div style={grid}>
          {providerCards.map(p => (
            <div key={p.name} style={card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#111827' }}>{p.name}</div>
                {badge(p.status, statusColor(p.status))}
              </div>
              <div style={{ marginTop: 6, fontSize: 13, color: '#374151' }}>
                Bucket/Container: <strong>{p.bucket}</strong>
              </div>
              <div style={{ marginTop: 4, fontSize: 13, color: '#6b7280' }}>
                Region: {p.region} • Storage: {p.storage}
              </div>
              <div style={{ marginTop: 4, fontSize: 12, color: '#94a3b8' }}>
                Last sync: {p.lastSync} • Next: {p.nextSync}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginTop: 22 }}>
        <h2>Provider Health</h2>
        <div style={card}>
          <table style={table}>
            <thead>
              <tr>
                <th style={{ ...thtd, color: '#6b7280', fontWeight: 600 }}>Provider</th>
                <th style={{ ...thtd, color: '#6b7280', fontWeight: 600 }}>Status</th>
                <th style={{ ...thtd, color: '#6b7280', fontWeight: 600 }}>Latency</th>
                <th style={{ ...thtd, color: '#6b7280', fontWeight: 600 }}>Region</th>
              </tr>
            </thead>
            <tbody>
              {providerChecks.map(row => (
                <tr key={row.name}>
                  <td style={thtd}>{row.name}</td>
                  <td style={thtd}>
                    <span style={{ color: statusColor(row.status), fontWeight: 600 }}>
                      {row.status}
                    </span>
                  </td>
                  <td style={thtd}>{row.latency}</td>
                  <td style={thtd}>{row.region}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* <section style={{ marginTop: 22 }}>
        <h2>Recent Activity</h2>
        <div style={{ marginBottom: 10, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {['All', 'AWS S3', 'Azure Blob', 'GCS'].map(filter => (
            <button
              key={filter}
              style={{
                padding: '8px 10px',
                borderRadius: 8,
                border: '1px solid #d1d5db',
                background: filter === 'All' ? '#e5edff' : '#f8fafc',
                cursor: 'not-allowed'
              }}
              title="Filtering not wired yet"
            >
              {filter}
            </button>
          ))}
        </div>
        <div style={card}>
          <table style={table}>
            <thead>
              <tr>
                <th style={{ ...thtd, color: '#6b7280', fontWeight: 600 }}>Provider</th>
                <th style={{ ...thtd, color: '#6b7280', fontWeight: 600 }}>Host</th>
                <th style={{ ...thtd, color: '#6b7280', fontWeight: 600 }}>Type</th>
                <th style={{ ...thtd, color: '#6b7280', fontWeight: 600 }}>Size</th>
                <th style={{ ...thtd, color: '#6b7280', fontWeight: 600 }}>Ended</th>
                <th style={{ ...thtd, color: '#6b7280', fontWeight: 600 }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentActivity.map(row => (
                <tr key={row.host + row.ended}>
                  <td style={thtd}>{row.provider}</td>
                  <td style={thtd}>{row.host}</td>
                  <td style={thtd}>{row.type}</td>
                  <td style={thtd}>{row.size}</td>
                  <td style={thtd}>{row.ended}</td>
                  <td style={thtd}>
                    <span style={{ color: statusColor(row.status), fontWeight: 600 }}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section> */}
    </div>
  )
}

export default CloudOverview

