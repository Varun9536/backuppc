const card = {
  padding: '14px 16px',
  borderRadius: '12px',
  background: '#fff',
  boxShadow: '0 8px 20px rgba(17, 24, 39, 0.06)',
  border: '1px solid #e5e7eb'
}

const label = { display: 'flex', flexDirection: 'column', gap: 4, fontSize: 13, color: '#374151' }
const input = { padding: '8px 10px', borderRadius: 8, border: '1px solid #d1d5db', fontSize: 14 }
const select = input
const hint = { fontSize: 12, color: '#6b7280' }

const hosts = [
  { host: 'farside', schedule: 'inherit', cron: '0 2 * * *', window: '02:00-04:00' },
  { host: 'larson', schedule: 'custom', cron: '30 3 * * 1-6', window: '03:00-05:00' },
  { host: 'apollo', schedule: 'inherit', cron: '0 2 * * *', window: '02:00-04:00' },
  { host: 'zeus', schedule: 'custom', cron: '15 1 * * 0', window: '01:00-03:00' }
]

const providerAssignments = [
  { host: 'farside', provider: 'AWS S3', secondary: 'GCS', mode: 'inherit' },
  { host: 'larson', provider: 'Azure Blob', secondary: '—', mode: 'custom' },
  { host: 'apollo', provider: 'AWS S3', secondary: '—', mode: 'inherit' },
  { host: 'zeus', provider: 'GCS', secondary: 'AWS S3', mode: 'custom' }
]

const providersList = [
  { name: 'AWS S3', type: 'S3', bucket: 'backuppc-prod', region: 'us-east-1', status: 'Healthy' },
  { name: 'Azure Blob', type: 'Azure', bucket: 'backuppc-az', region: 'eastus', status: 'Healthy' },
  { name: 'GCS', type: 'GCS', bucket: 'backuppc-gcs', region: 'us-central1', status: 'Standby' }
]

const CloudSettings = () => {
  return (
    <div>
      <h1>Cloud Settings</h1>

      <section style={{ marginTop: 16 }}>
        <h2>Providers & Credentials</h2>
        <div style={card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <div style={{ fontWeight: 600, color: '#111827' }}>Configured Providers</div>
            <button
              style={{
                padding: '8px 10px',
                borderRadius: 8,
                border: '1px solid #d1d5db',
                background: '#e5edff',
                cursor: 'not-allowed'
              }}
              title="Add provider (UI-only)"
            >
              + Add Provider
            </button>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 14 }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #e5e7eb', color: '#6b7280', fontWeight: 600 }}>Name</th>
                <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #e5e7eb', color: '#6b7280', fontWeight: 600 }}>Type</th>
                <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #e5e7eb', color: '#6b7280', fontWeight: 600 }}>Bucket/Container</th>
                <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #e5e7eb', color: '#6b7280', fontWeight: 600 }}>Region/Endpoint</th>
                <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #e5e7eb', color: '#6b7280', fontWeight: 600 }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {providersList.map(p => (
                <tr key={p.name}>
                  <td style={{ padding: '8px', borderBottom: '1px solid #e5e7eb' }}>{p.name}</td>
                  <td style={{ padding: '8px', borderBottom: '1px solid #e5e7eb' }}>{p.type}</td>
                  <td style={{ padding: '8px', borderBottom: '1px solid #e5e7eb' }}>{p.bucket}</td>
                  <td style={{ padding: '8px', borderBottom: '1px solid #e5e7eb' }}>{p.region}</td>
                  <td style={{ padding: '8px', borderBottom: '1px solid #e5e7eb', color: p.status === 'Healthy' ? '#16a34a' : '#6b7280', fontWeight: 600 }}>
                    {p.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
            <label style={label}>
              Provider
              <select disabled style={select}>
                <option>AWS S3</option>
                <option>Azure Blob</option>
                <option>GCS</option>
                <option>S3-compatible</option>
              </select>
              <span style={hint}>Selection UI only; not wired.</span>
            </label>
            <label style={label}>
              Bucket / Container
              <input disabled style={input} placeholder="backuppc-prod" />
            </label>
            <label style={label}>
              Region / Endpoint
              <input disabled style={input} placeholder="us-east-1 or https://minio.local" />
            </label>
            <label style={label}>
              Access Key
              <input disabled style={input} placeholder="AKIA..." />
            </label>
            <label style={label}>
              Secret Key
              <input disabled style={input} placeholder="••••••••••" type="password" />
            </label>
          </div>
          <div style={{ marginTop: 10 }}>
            <button style={{ padding: '9px 12px', borderRadius: 8, border: '1px solid #d1d5db', background: '#e5edff', cursor: 'not-allowed' }}>
              Test Connection
            </button>
            <span style={{ marginLeft: 8, ...hint }}>UI-only; no calls sent.</span>
          </div>
        </div>
      </section>

      <section style={{ marginTop: 18 }}>
        <h2>Transfer Policies</h2>
        <div style={card}>
          <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
            <label style={label}>
              Transfer Mode
              <select disabled style={select}>
                <option>After every backup</option>
                <option>Scheduled window</option>
                <option>Manual only</option>
              </select>
            </label>
            <label style={label}>
              Bandwidth Limit (MB/s)
              <input disabled style={input} placeholder="50" />
            </label>
            <label style={label}>
              Retries
              <input disabled style={input} placeholder="3" />
            </label>
            <label style={label}>
              Parallel Uploads
              <input disabled style={input} placeholder="4" />
            </label>
          </div>
          <div style={{ marginTop: 10, ...hint }}>
            Values are static; connect to backend settings later.
          </div>
        </div>
      </section>

      <section style={{ marginTop: 18 }}>
        <h2>Transfer Schedule</h2>
        <div style={card}>
          <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
            <label style={label}>
              Mode (Global)
              <select disabled style={select}>
                <option>After every backup</option>
                <option>Cron-based</option>
                <option>Manual only</option>
              </select>
            </label>
            <label style={label}>
              Cron (Global)
              <input disabled style={input} placeholder="0 2 * * *" />
              <span style={hint}>Example: daily at 02:00.</span>
            </label>
            <label style={label}>
              Window (Global)
              <input disabled style={input} placeholder="02:00-04:00" />
              <span style={hint}>Optional transfer window.</span>
            </label>
            <label style={label}>
              Bandwidth Cap (MB/s)
              <input disabled style={input} placeholder="50" />
            </label>
          </div>
          <div style={{ marginTop: 10, ...hint }}>
            Cron and window are UI-only; backend will enforce schedule later.
          </div>
        </div>
      </section>

      <section style={{ marginTop: 18 }}>
        <h2>Per-Host Overrides</h2>
        <div style={card}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #e5e7eb', color: '#6b7280', fontWeight: 600 }}>Host</th>
                <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #e5e7eb', color: '#6b7280', fontWeight: 600 }}>Mode</th>
                <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #e5e7eb', color: '#6b7280', fontWeight: 600 }}>Cron</th>
                <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #e5e7eb', color: '#6b7280', fontWeight: 600 }}>Window</th>
                <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #e5e7eb', color: '#6b7280', fontWeight: 600 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {hosts.map(row => (
                <tr key={row.host}>
                  <td style={{ padding: '8px', borderBottom: '1px solid #e5e7eb' }}>{row.host}</td>
                  <td style={{ padding: '8px', borderBottom: '1px solid #e5e7eb' }}>
                    <select disabled style={select}>
                      <option selected={row.schedule === 'inherit'}>Inherit global</option>
                      <option selected={row.schedule === 'custom'}>Custom</option>
                    </select>
                  </td>
                  <td style={{ padding: '8px', borderBottom: '1px solid #e5e7eb' }}>
                    <input disabled style={input} placeholder={row.cron} />
                  </td>
                  <td style={{ padding: '8px', borderBottom: '1px solid #e5e7eb' }}>
                    <input disabled style={input} placeholder={row.window} />
                  </td>
                  <td style={{ padding: '8px', borderBottom: '1px solid #e5e7eb' }}>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      <button style={{ padding: '7px 10px', borderRadius: 8, border: '1px solid #d1d5db', background: '#e5edff', cursor: 'not-allowed' }}>Set custom</button>
                      <button style={{ padding: '7px 10px', borderRadius: 8, border: '1px solid #d1d5db', background: '#f0fdf4', cursor: 'not-allowed' }}>Revert to global</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ marginTop: 10, ...hint }}>
            Overrides are UI-only; when wired, selecting “Custom” should enable per-host cron/window and save to backend.
          </div>
        </div>
      </section>

      <section style={{ marginTop: 18 }}>
        <h2>Provider Assignment</h2>
        <div style={card}>
          <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
            <label style={label}>
              Default Provider (Global)
              <select disabled style={select}>
                <option>AWS S3</option>
                <option>Azure Blob</option>
                <option>GCS</option>
                <option>S3-compatible</option>
              </select>
              <span style={hint}>Applies to all hosts unless overridden.</span>
            </label>
            <label style={label}>
              Secondary / Standby (Global)
              <select disabled style={select}>
                <option>None</option>
                <option>AWS S3</option>
                <option>Azure Blob</option>
                <option>GCS</option>
              </select>
              <span style={hint}>Optional fallback target.</span>
            </label>
          </div>
          <div style={{ marginTop: 14, fontWeight: 600, color: '#111827' }}>Per-Host Overrides</div>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 8 }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #e5e7eb', color: '#6b7280', fontWeight: 600 }}>Host</th>
                <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #e5e7eb', color: '#6b7280', fontWeight: 600 }}>Mode</th>
                <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #e5e7eb', color: '#6b7280', fontWeight: 600 }}>Provider</th>
                <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #e5e7eb', color: '#6b7280', fontWeight: 600 }}>Secondary</th>
                <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #e5e7eb', color: '#6b7280', fontWeight: 600 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {providerAssignments.map(row => (
                <tr key={row.host}>
                  <td style={{ padding: '8px', borderBottom: '1px solid #e5e7eb' }}>{row.host}</td>
                  <td style={{ padding: '8px', borderBottom: '1px solid #e5e7eb' }}>
                    <select disabled style={select}>
                      <option selected={row.mode === 'inherit'}>Inherit global</option>
                      <option selected={row.mode === 'custom'}>Custom</option>
                    </select>
                  </td>
                  <td style={{ padding: '8px', borderBottom: '1px solid #e5e7eb' }}>
                    <select disabled style={select}>
                      <option selected={row.provider === 'AWS S3'}>AWS S3</option>
                      <option selected={row.provider === 'Azure Blob'}>Azure Blob</option>
                      <option selected={row.provider === 'GCS'}>GCS</option>
                      <option selected={row.provider === 'S3-compatible'}>S3-compatible</option>
                    </select>
                  </td>
                  <td style={{ padding: '8px', borderBottom: '1px solid #e5e7eb' }}>
                    <select disabled style={select}>
                      <option selected={row.secondary === '—'}>None</option>
                      <option selected={row.secondary === 'AWS S3'}>AWS S3</option>
                      <option selected={row.secondary === 'Azure Blob'}>Azure Blob</option>
                      <option selected={row.secondary === 'GCS'}>GCS</option>
                    </select>
                  </td>
                  <td style={{ padding: '8px', borderBottom: '1px solid #e5e7eb' }}>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      <button style={{ padding: '7px 10px', borderRadius: 8, border: '1px solid #d1d5db', background: '#e5edff', cursor: 'not-allowed' }}>Set custom</button>
                      <button style={{ padding: '7px 10px', borderRadius: 8, border: '1px solid #d1d5db', background: '#f0fdf4', cursor: 'not-allowed' }}>Revert to global</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ marginTop: 10, ...hint }}>
            Provider assignments are UI-only; wire to backend to save defaults and per-host overrides.
          </div>
        </div>
      </section>

      <section style={{ marginTop: 18 }}>
        <h2>Retention & Lifecycle</h2>
        <div style={card}>
          <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
            <label style={label}>
              Cloud Retention (days)
              <input disabled style={input} placeholder="90" />
            </label>
            <label style={label}>
              Mirror Local Deletions
              <select disabled style={select}>
                <option>Enabled</option>
                <option>Disabled</option>
              </select>
            </label>
            <label style={label}>
              Archive to Cold Storage after (days)
              <input disabled style={input} placeholder="30" />
            </label>
          </div>
          <div style={{ marginTop: 10, ...hint }}>
            Lifecycle controls are UI-only; hook to provider policies later.
          </div>
        </div>
      </section>

      <section style={{ marginTop: 18 }}>
        <h2>Restore Behavior</h2>
        <div style={card}>
          <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
            <label style={label}>
              Rehydrate from Cloud if Missing
              <select disabled style={select}>
                <option>Yes</option>
                <option>No</option>
              </select>
            </label>
            <label style={label}>
              Staging Path
              <input disabled style={input} placeholder="/var/lib/backuppc/cloud-staging" />
            </label>
            <label style={label}>
              Verify Checksums After Download
              <select disabled style={select}>
                <option>Yes</option>
                <option>No</option>
              </select>
            </label>
          </div>
          <div style={{ marginTop: 10, ...hint }}>
            Restore options are UI-only; connect to restore workflow later.
          </div>
        </div>
      </section>
    </div>
  )
}

export default CloudSettings

