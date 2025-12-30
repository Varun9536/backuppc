const card = {
  padding: '14px 16px',
  borderRadius: '12px',
  background: '#fff',
  boxShadow: '0 8px 20px rgba(17, 24, 39, 0.06)',
  border: '1px solid #e5e7eb'
}

const label = { display: 'flex', flexDirection: 'column', gap: 4, fontSize: 13, color: '#374151' }
const input = { padding: '8px 10px', borderRadius: 8, border: '1px solid #d1d5db', fontSize: 14 }
const hint = { fontSize: 12, color: '#6b7280' }

const CloudNotifications = () => {
  return (
    <div>
      <h1>Cloud Notifications</h1>

      <section style={{ marginTop: 14 }}>
        <h2>Recipients</h2>
        <div style={card}>
          <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
            <label style={label}>
              Email Recipients
              <input disabled style={input} placeholder="admin@example.com, ops@example.com" />
              <span style={hint}>Comma-separated emails.</span>
            </label>
            <label style={label}>
              SMS Recipients
              <input disabled style={input} placeholder="+15551234567, +15557654321" />
              <span style={hint}>Comma-separated phone numbers.</span>
            </label>
          </div>
          <div style={{ marginTop: 10 }}>
            <button style={{ padding: '8px 10px', borderRadius: 8, border: '1px solid #d1d5db', background: '#e5edff', cursor: 'not-allowed' }}>
              Test Notification
            </button>
            <span style={{ marginLeft: 8, ...hint }}>UI-only; no messages sent.</span>
          </div>
        </div>
      </section>

      <section style={{ marginTop: 16 }}>
        <h2>Event Triggers</h2>
        <div style={card}>
          <div style={{ display: 'grid', gap: 10, gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
            {[
              'Transfer success',
              'Transfer failure',
              'Verification failure',
              'Retention delete',
              'Provider health change',
              'Credential expiration'
            ].map(event => (
              <label key={event} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14 }}>
                <input type="checkbox" disabled />
                {event}
              </label>
            ))}
          </div>
          <div style={{ marginTop: 10, ...hint }}>
            Checkboxes are UI-only; wire to backend notification rules later.
          </div>
        </div>
      </section>

      <section style={{ marginTop: 16 }}>
        <h2>Delivery Options</h2>
        <div style={card}>
          <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
            <label style={label}>
              Mode
              <select disabled style={input}>
                <option>Immediate</option>
                <option>Digest (hourly)</option>
                <option>Digest (daily)</option>
              </select>
            </label>
            <label style={label}>
              Max Notifications per Hour
              <input disabled style={input} placeholder="20" />
            </label>
            <label style={label}>
              Quiet Hours
              <input disabled style={input} placeholder="22:00-06:00" />
              <span style={hint}>Optional, suppress non-critical alerts.</span>
            </label>
          </div>
          <div style={{ marginTop: 10, ...hint }}>
            Delivery options are UI-only; connect to notification service later.
          </div>
        </div>
      </section>

      <section style={{ marginTop: 16 }}>
        <h2>Status</h2>
        <div style={card}>
          <div style={{ display: 'grid', gap: 8, gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
            <div>
              <div style={{ fontSize: 13, color: '#6b7280' }}>Last Notification</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#111827' }}>2025-12-15 02:16</div>
              <div style={hint}>Transfer success: farside → AWS S3</div>
            </div>
            <div>
              <div style={{ fontSize: 13, color: '#6b7280' }}>Pending Queue</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#111827' }}>0</div>
              <div style={hint}>Queue size placeholder.</div>
            </div>
            <div>
              <div style={{ fontSize: 13, color: '#6b7280' }}>Recent Failures</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#dc2626' }}>1</div>
              <div style={hint}>Last: SMS to +15551234567 (timeout)</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default CloudNotifications

