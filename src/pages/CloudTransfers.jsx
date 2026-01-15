import { useEffect, useState } from "react"
import styles from './Restore.module.css'
import { startSync, restoreAPI, writeLog, setPermissions, getTransferredWithHosts, getRcloneStats, saveSchedule, getSchedularDetails, getTransferPolicies } from '../services/api'
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

const inputStyle = {
  width: '100%',
  padding: '6px 8px',
  fontSize: 14,
  border: '1px solid #ccc',
  borderRadius: 4,
  outline: 'none',
  boxSizing: 'border-box'
};

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
  const [transfers, setTransfers] = useState([]);
  const [stats, setStats] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const safeNumber = (v) => Math.max(0, Number(v) || 0);
  const [data, setDataTransfer] = useState({
      mode: "After every backup",
      bandwidth: "",
      retries: "",
      parallel: ""
    });

  // const [schedule, setSchedule] = useState([
  //   {
  //     name: 'Cloud Backup',
  //     cron: '0 2 * * *',
  //     scope: 'system',
  //     next_run: 'Tomorrow 02:00 AM'
  //   }
  // ]);

  // const updateRow = (index, field, value) => {

  const updateRow = (e) => {
    // setSchedule(prev => {
    //   const copy = [...prev];
    //   copy[index] = { ...copy[index], [field]: value };
    //   return copy;
    // });

    const { name, value } = e.target;

    // Set new state object with updated key or new key
    setSchedule((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSaveSchedule = async () => {
    const res = await saveSchedule(schedule);

    if (res.ok) {
      alert('Schedule saved successfully');
      getScheduleDetails();
    } else {
      alert('Save failed');
    }
  };

  const getScheduleDetails = async () => {
    try {
      const data = await getSchedularDetails();   // already JSON

      setSchedule(data);

      // console.log(data);
    } catch (err) {
      console.error(err);
      alert("Failed to get scheduler details");
    }
  };

  const loadHosts = async () => {
    try {
      setLoading(true)

      await getScheduleDetails();

      const data = await restoreAPI.getHosts()

      const getStatValue = (stats, label) => {
        const item = stats.find(s => s.label === label);
        return Math.max(0, Number(item?.value || 0));
      };

      // console.log(data)
      while (recent.length < data.length) {
        recent.push({ host: undefined });
      }

      const formatDateTime = (iso) => {
        if (!iso) return "-";

        return iso.split(".")[0].replace("T", " ");
      };

      let currentDate = new Date();
      let formattedDate = currentDate.getFullYear() + '-' +
        ('0' + (currentDate.getMonth() + 1)).slice(-2) + '-' +
        ('0' + currentDate.getDate()).slice(-2) + ' ' +
        ('0' + currentDate.getHours()).slice(-2) + ':' +
        ('0' + currentDate.getMinutes()).slice(-2) + ':' +
        ('0' + currentDate.getSeconds()).slice(-2);

      recent.forEach((item, index) => {
        item.host = data[index]?.user;
        item.duration = `${getStatValue(stats, "elapsedTime").toFixed(0)} ms`;//'14ms';
        item.ended = formattedDate;//formatDateTime(transfers[index]?.completed_at)//'02:15';
        item.message = `Uploaded ${safeNumber(transfers[index]?.size || 0)} objects`;
        item.size = `${safeNumber(transfers[index]?.size)} bytes`;//'100MB';
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
    const loadData = async () => {
      try {
        const data = await getTransferredWithHosts();
        setTransfers(data);
        // console.log(data);
      } catch (err) {
        console.error("Failed to load transfers", err);
      }
    };

    loadData();
  }, []);


  useEffect(() => {
    const loadData1 = async () => {
      try {
        const data = await getRcloneStats();

        const statsArray = Object.entries(data).map(([key, value]) => ({
          label: key,
          value
        }));

        setStats(statsArray);
        // console.log(statsArray);
      } catch (err) {
        console.error("Failed to load stats", err);
      }
    };

    loadData1();
  }, []);

  useEffect(() => {
    if (stats.length === 0 || transfers.length === 0) return;

    loadHosts();
  }, [stats, transfers]);

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
      await writeLog("INFO", `Retries: ${data.retries}`);
      const result = await startSync(spath, dpath, data.retries);

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
        <h2 style={{ marginBottom: 12 }}>Scheduled Jobs</h2>

        <div
          style={{
            background: '#fff',
            borderRadius: 8,
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            overflowX: 'auto'
          }}
        >
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              minWidth: 800
            }}
          >
            <thead>
              <tr>
                {['Name', 'Schedule', 'Scope', 'Next Run'].map(h => (
                  <th
                    key={h}
                    style={{
                      textAlign: 'left',
                      padding: '12px 10px',
                      background: '#f5f7fa',
                      fontWeight: 600,
                      fontSize: 14,
                      borderBottom: '1px solid #ddd'
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {/* {schedule.map((row, i) => ( */}
              <tr>
                <td style={{ padding: 8 }}>
                  <input
                    style={inputStyle}
                    value={schedule.name}
                    onChange={updateRow}
                    name="name"
                  // onChange={e => updateRow(i, 'name', e.target.value)}
                  />
                </td>

                <td style={{ padding: 8 }}>
                  <input
                    style={inputStyle}
                    value={schedule.cron}
                    onChange={updateRow}
                    name="cron"
                    // onChange={e => updateRow(i, 'cron', e.target.value)}
                    placeholder="0 2 * * *"
                  />
                </td>

                <td style={{ padding: 8 }}>
                  <select
                    style={inputStyle}
                    value='system'
                    onChange={updateRow}

                  // onChange={e => updateRow(i, 'scope', e.target.value)}
                  >
                    <option value="system">All</option>
                    {/* <option value="user">User</option> */}
                  </select>
                </td>

                <td style={{ padding: 8 }}>
                  <input
                    style={{
                      ...inputStyle,
                      background: '#f0f0f0',
                      color: '#666',
                      cursor: 'not-allowed'
                    }}
                    placeholder="Tomorrow 02:00 AM"
                    value={schedule.next_run}
                    disabled
                  />
                </td>
              </tr>
              {/* ))} */}
            </tbody>
          </table>

          {/* <div
            style={{
              padding: 12,
              borderTop: '1px solid #eee',
              textAlign: 'right'
            }}
          >
            <button
              onClick={handleSaveSchedule}
              style={{
                padding: '8px 16px',
                background: '#2563eb',
                color: '#fff',
                border: 'none',
                borderRadius: 6,
                fontWeight: 500,
                cursor: 'pointer'
              }}
            >
              Save Schedule
            </button>
          </div> */}
        </div>
      </section>


      {/* Manual Actions */}
      <section style={{ marginTop: 18 }}>
        <h2>Action</h2>
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
                {h.hostname}
              </option>
            ))}
          </select>
        </div>
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
