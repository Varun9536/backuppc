import { useEffect, useState } from "react"
import styles from './Restore.module.css'
import { startSync, restoreAPI, writeLog, setPermissions } from '../services/api'
import { useSelector } from 'react-redux'
import { userRoles } from '../services/role'

const recent = [
  { host: 'farside', type: 'Full', size: '8.1 GB', duration: '14m', status: 'Success', ended: '02:15', message: 'Uploaded 124 objects' },
  { host: 'larson', type: 'Incr', size: '1.2 GB', duration: '4m', status: 'Success', ended: '02:08', message: 'Uploaded 38 objects' },
  { host: 'apollo', type: 'Full', size: '9.4 GB', duration: '12m', status: 'Failed', ended: '01:55', message: 'Network timeout at 78%' },
  { host: 'zeus', type: 'Incr', size: '900 MB', duration: '—', status: 'Queued', ended: '—', message: 'Scheduled for 03:10' }
]

const schedule = [
  { name: 'Global: Nightly sync', cron: '0 2 * * *', scope: 'All hosts (inherit)', nextRun: 'Tonight 02:00' }
  // { name: 'Host override: larson', cron: '30 3 * * 1-6', scope: 'Host larson (custom)', nextRun: 'Tomorrow 03:30' },
  // { name: 'Host override: zeus', cron: '15 1 * * 0', scope: 'Host zeus (custom)', nextRun: 'Sun 01:15' }
]

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

const statusColor = (status) => {
  if (status === 'Success') return '#16a34a'
  if (status === 'Failed') return '#dc2626'
  if (status === 'Queued') return '#eab308'
  return '#374151'
}

const CloudTransfers = () => {
  const { userid, role } = useSelector((state) => state.user)
  const [loading, setLoading] = useState(false)
  const [selectedHost, setSelectedHost] = useState('')
  const [a, setdata] = useState([])
  const [syncing, setSyncing] = useState(false);


  const loadHosts = async () => {
    try {
      setLoading(true)

      const data = await restoreAPI.getHosts()
      // console.log(data)
      while (recent.length < data.length) {
        recent.push({ host: undefined });
      }
      recent.forEach((item, index) => {
        item.host = data[index]?.user;
        item.duration = '14ms';
        item.ended = '02:15';
        item.message = 'Uploaded 38 objects';
        item.size = '100MB';
        item.status = 'Success';
        item.type = 'Full';
      });

      setdata(data)

    } catch (error) {
      console.error(error)
      alert('Failed to load hosts')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadHosts()
  }, [])

  const handleClick = async (selectedHost) => {
    if (!selectedHost) {
      alert("Please select a host");
      return;
    }
    try {
      alert(`${selectedHost} sync started`);
      setSyncing(true);
      const path = "/home/aagarwalAnubhav/BackupVMTest";
      await setPermissions(path);

      const spath = `/home/aagarwalAnubhav/BackupVMTest/pc/${selectedHost}`;
      const dpath = `azure:sudheer/BackupVMTest/pc/${selectedHost}`;

      // log start
      await writeLog("INFO", `Starting sync for host ${selectedHost}`);

      const result = await startSync(spath, dpath);

      // log success
      await writeLog("INFO", `Sync completed successfully for host ${selectedHost} by sync/copy api`);

      await writeLog("INFO", `Payload {sourcepath -  ${spath}, destinationpath - ${dpath}}`);

      alert(`${selectedHost} Sync Successfully !`);
      setSyncing(false);
    } catch (err) {
      console.error(err);

      // log failure
      await writeLog("ERROR", `Sync failed for host ${selectedHost}: ${err.message}`);

      alert(`Failed to sync`);
      setSyncing(false);
    }
  };


  return (
    <div>
      <h1>Cloud Transfers</h1>

      <div className={styles.selectGroup}>
        <label>Select Host:</label>

        <select
          value={selectedHost}
          onChange={(e) => setSelectedHost(e.target.value)}
        >
          <option value="" disabled>
            Select a host
          </option>

          {a?.map((h) => (
            <option key={h.user} value={h.hostname}>
              {h.user}
            </option>
          ))}
        </select>
      </div>

      {/* Recent Transfers  */}
      <section style={{ marginTop: 16 }}>
        <h2>Recent Transfers</h2>
        <div style={card}>
          <table style={table}>
            <thead>
              <tr>
                {['Host', 'Type', 'Size', 'Duration', 'Ended', 'Status', 'Message'].map(h => (
                  <th key={h} style={{ ...thtd, color: 'black', fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recent.map(row => (
                <tr key={row.host + row.ended}>
                  <td style={thtd}>{row.host}</td>
                  <td style={thtd}>{row.type}</td>
                  <td style={thtd}>{row.size}</td>
                  <td style={thtd}>{row.duration}</td>
                  <td style={thtd}>{row.ended}</td>
                  <td style={thtd}>
                    <span style={{ color: statusColor(row.status), fontWeight: 600 }}>
                      {row.status}
                    </span>
                  </td>
                  <td style={thtd}>{row.message}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Scheduled Jobs */}
      <section style={{ marginTop: 18 }}>
        <h2>Scheduled Jobs</h2>
        <div style={card}>
          <table style={table}>
            <thead>
              <tr>
                {['Name', 'Cron', 'Scope', 'Next Run'].map(h => (
                  <th key={h} style={{ ...thtd, color: 'black', fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {schedule.map(row => (
                <tr key={row.name}>
                  <td style={thtd}>{row.name}</td>
                  <td style={thtd}>{row.cron}</td>
                  <td style={thtd}>{row.scope}</td>
                  <td style={thtd}>{row.nextRun}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Manual Actions */}
      <section style={{ marginTop: 18 }}>
        <h2>Action</h2>
        <div style={card}>
          <button
            onClick={() => handleClick(selectedHost)}
            disabled={!selectedHost || syncing}
            style={{
              padding: '9px 12px',
              borderRadius: 8,
              border: '1px solid #d1d5db',
              background: '#e5edff',
              cursor: selectedHost && !syncing ? 'pointer' : 'not-allowed',
              opacity: selectedHost && !syncing ? 1 : 0.6
            }}
          >
            {syncing ? 'Syncing in progress' : 'Start Sync Now'}
          </button>

        </div>
      </section>
    </div>
  )
}

export default CloudTransfers
