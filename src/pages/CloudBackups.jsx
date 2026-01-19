import { useEffect, useState } from "react"
import styles from './Restore.module.css'
import { restoreAPI, startSync, writeLog, setPermissions, getTransferredWithHosts, getTransferPolicies } from '../services/api'
import { useSelector } from 'react-redux'
import { userRoles } from '../services/role'

const hosts = ['farside', 'larson', 'apollo', 'zeus']
const providers = ['All', 'AWS S3', 'Azure Blob', 'GCS']

const backups = [
  { provider: 'Azure Blob', host: 'farside', backupId: '124', type: 'Full', date: '2025-12-15 02:00', size: '8.1 GB', status: 'Present', cloudPath: 's3://backuppc-prod/farside/124' },
  { provider: 'Azure Blob', host: 'farside', backupId: '123', type: 'Incr', date: '2025-12-14 02:00', size: '1.2 GB', status: 'Present', cloudPath: 's3://backuppc-prod/farside/123' },
  { provider: 'Azure Blob', host: 'larson', backupId: '89', type: 'Full', date: '2025-12-15 02:05', size: '6.7 GB', status: 'Present', cloudPath: 'azure://backuppc-az/larson/89' },
  { provider: 'Azure Blob', host: 'apollo', backupId: '211', type: 'Full', date: '2025-12-14 01:55', size: '9.4 GB', status: 'Present', cloudPath: 's3://backuppc-prod/apollo/211' },
  { provider: 'Azure Blob', host: 'zeus', backupId: '54', type: 'Incr', date: '2025-12-15 03:10', size: '900 MB', status: 'Present', cloudPath: 'gs://backuppc-gcs/zeus/54' }
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
  marginTop: '8px',
  tableLayout: 'fixed'   // ✅ ADD THIS
}


const thtd = {
  textAlign: 'left',
  padding: '10px 8px',
  borderBottom: '1px solid #e5e7eb',
  fontSize: '14px'
}

const badgeColor = (status) => {
  if (status === 'Present') return '#16a34a'
  if (status === 'Missing locally') return '#dc2626'
  if (status.toLowerCase().includes('queued')) return '#eab308'
  return '#374151'
}

const providerColor = (provider) => {
  if (provider === 'AWS S3') return '#0ea5e9'
  if (provider === 'Azure Blob') return '#2563eb'
  if (provider === 'GCS') return '#22c55e'
  return '#6b7280'
}


const CloudBackups = () => {

  const { userid, role } = useSelector((state) => state.user)
  const [loading, setLoading] = useState(false)
  const [selectedHost, setSelectedHost] = useState('')
  const [a, setdata] = useState([])
  const [syncing, setSyncing] = useState(false);
  const [transfers, setTransfers] = useState([]);
  const safeNumber = (v) => Math.max(0, Number(v) || 0);
  const [data, setDataTransfer] = useState({
    mode: "After every backup",
    bandwidth: "",
    retries: "",
    parallel: ""
  });

  const loadHosts = async () => {
    try {
      setLoading(true)

      const data = await restoreAPI.getHosts()

      //console.log(data)
      while (backups.length < data.length) {
        backups.push({ host: undefined });
      }
      let currentDate = new Date();
      let formattedDate = currentDate.getFullYear() + '-' +
        ('0' + (currentDate.getMonth() + 1)).slice(-2) + '-' +
        ('0' + currentDate.getDate()).slice(-2) + ' ' +
        ('0' + currentDate.getHours()).slice(-2) + ':' +
        ('0' + currentDate.getMinutes()).slice(-2) + ':' +
        ('0' + currentDate.getSeconds()).slice(-2);

      const formatDateTime = (iso) => {
        if (!iso) return "-";

        return iso.split(".")[0].replace("T", " ");
      };

      backups.forEach((item, index) => {
        item.provider = 'Azure Blob';
        item.host = data[index]?.user;
        item.backupId = data[index]?.hostname;
        const dpath = `azure:sudheer/BackupVMTest/pc/${data[index]?.hostname}`;
        item.cloudPath = dpath;
        item.date = formattedDate //formatDateTime(transfers[index]?.started_at);
        //item.type = 'Full';
        item.status = 'Present';
        item.size = `${safeNumber(transfers[index]?.size)} bytes`;//'100MB';
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
    const loadData = async () => {
      try {
        const data = await getTransferredWithHosts();
        setTransfers(data);
        //console.log(data);
      } catch (err) {
        console.error("Failed to load transfers", err);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    if (transfers.length === 0) return;

    loadHosts();
  }, [transfers]);

  useEffect(() => {
    getTransferPolicies()
      .then(res => {
        if (res && Object.keys(res).length) {
          setDataTransfer(res);
        }
      })
      .catch(err => {
        console.error("Failed to load transfer policies", err);
      });
  }, []);
  const handleClick = async (selectedHost) => {
    if (!selectedHost) {
      alert("Please select a host");
      await writeLog("ERROR", "No host selected");
      return;
    }

    try {
      alert(`${selectedHost} restore started`);
      //setSyncing(true);
      //const path = "/home/aagarwalAnubhav/BackupVMTest";
      //await setPermissions(path);
      const spath = `/home/aagarwalAnubhav/BackupVMTest/pc/${selectedHost}`;
      const dpath = `azure:sudheer/BackupVMTest/pc/${selectedHost}`;

      await writeLog("INFO", `Starting restore for host: ${selectedHost}`);
      await writeLog("INFO", `Retries: ${data.retries}`);
      const result = await startSync(dpath, spath, data.retries);

      alert(`${selectedHost} restored Successfully !`);
      await writeLog("INFO", `Host ${selectedHost} restored successfully sync/copy api`);

      await writeLog("INFO", `Payload {sourcepath -  ${dpath}, destinationpath - ${spath}}`);

      //setSyncing(false);
    } catch (err) {
      console.error(err);
      alert(`Failed to restore`);
      await writeLog("ERROR", `Failed to restore host ${selectedHost}: ${err.message}`);
      //setSyncing(false);
    }
  };

  return (
    <div>
      <h1>Cloud Backups</h1>

      {/* <section style={{ marginTop: 16 }}>
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
         <div style={card}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
            {providers.map(provider => (
              <button
                key={provider}
                style={{
                  padding: '8px 10px',
                  borderRadius: 8,
                  border: '1px solid #d1d5db',
                  background: provider === 'All' ? '#e5edff' : '#f8fafc',
                  cursor: 'not-allowed',
                  color: providerColor(provider)
                }}
                title="Provider filtering not wired yet"
              >
                {provider}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {hosts.map(host => (
              <button
                key={host}
                style={{
                  padding: '8px 10px',
                  borderRadius: 8,
                  border: '1px solid #d1d5db',
                  background: '#f8fafc',
                  cursor: 'not-allowed'
                }}
                title="Filtering logic not wired yet"
              >
                {host}
              </button>
            ))}
          </div>
          <div style={{ marginTop: 8, fontSize: 12, color: '#6b7280' }}>
            Filter buttons are UI-only; wiring to data will come later.
          </div>
        </div>  
      </section> */}

      <section style={{ marginTop: 18 }}>
        <h2>Backup Inventory</h2>
        <div style={card}>
          <table style={table}>
            <thead>
              <tr>
                <th style={{ ...thtd, color: 'black', fontWeight: 600 }}>Provider</th>
                <th style={{ ...thtd, color: 'black', fontWeight: 600 }}>Host</th>
                <th style={{ ...thtd, color: 'black', fontWeight: 600 }}>Host IP</th>
                <th style={{ ...thtd, color: 'black', fontWeight: 600 }}>Type</th>
                <th style={{ ...thtd, color: 'black', fontWeight: 600 }}>Date</th>
                <th style={{ ...thtd, color: 'black', fontWeight: 600 }}>Size</th>
                <th style={{ ...thtd, color: 'black', fontWeight: 600 }}>Status</th>
                <th style={{ ...thtd, color: 'black', fontWeight: 600 }}>Cloud Path</th>
                <th style={{ ...thtd, color: 'black', fontWeight: 600 }}>Restore</th>
              </tr>
            </thead>
            <tbody>
              {backups.map(row => (
                <tr key={row.host + row.backupId}>
                  <td style={thtd}>
                    <span style={{ color: providerColor(row.provider), fontWeight: 600 }}>
                      {row.provider}
                    </span>
                  </td>
                  <td style={thtd}>{row.host}</td>
                  <td style={thtd}>{row.backupId}</td>
                  <td style={thtd}>{row.type}</td>
                  <td style={thtd}>{row.date}</td>
                  <td style={thtd}>{row.size}</td>
                  <td style={thtd}>
                    <span style={{ color: badgeColor(row.status), fontWeight: 600 }}>
                      {row.status}
                    </span>
                  </td>
                  <td style={{
                    ...thtd,
                    maxWidth: 220,
                    wordBreak: 'break-all',
                    whiteSpace: 'normal'
                  }}>
                    {row.cloudPath}
                  </td>

                  <td style={thtd}>
                    <button
                      onClick={() => handleClick(row.backupId)}
                      disabled={!row.backupId || syncing}
                      style={{
                        padding: '7px 10px',
                        borderRadius: 8,
                        border: '1px solid #d1d5db',
                        background: '#fef3c7',
                        cursor: 'pointer'
                      }}
                    >
                      Restore
                      {/* {syncing ? 'Restoring' : 'Restore'} */}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* <section style={{ marginTop: 18 }}>
        <h2>Action</h2>
        <div style={card}>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
             <button style={{ padding: '9px 12px', borderRadius: 8, border: '1px solid #d1d5db', background: '#e5edff', cursor: 'not-allowed' }}>Refresh Inventory</button>
            <button style={{ padding: '9px 12px', borderRadius: 8, border: '1px solid #d1d5db', background: '#f0fdf4', cursor: 'not-allowed' }}>Verify Presence</button> 
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
              {syncing ? 'Restore in progress' : 'Restore from Cloud'}
            </button>
          </div>
           <div style={{ marginTop: 8, fontSize: 12, color: '#6b7280' }}>
            Buttons are disabled placeholders; hook them up to backend logic later. Restore should know which backup and provider to pull from; plan to pass both IDs to the backend.
          </div> 
        </div>
      </section> */}
    </div>
  )
}

export default CloudBackups

