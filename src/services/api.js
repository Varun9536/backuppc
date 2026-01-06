// api.js

//const BASE_URL = 'http://192.168.1.37:8081';

const BASE_URL = '';
const BASE_URL_CLOUD = "https://occupation-notified-photo-gif.trycloudflare.com"//"http://127.0.0.1:8082";
const BASE_URL_LOG = "https://bridges-packages-prices-ottawa.trycloudflare.com"//"http://127.0.0.1:8085";
const BASE_URL_READLOG = "https://beef-printer-dealing-die.trycloudflare.com"//"http://127.0.0.1:3000";
const BASE_URL_PERMISSION = "https://cause-merge-vcr-sticker.trycloudflare.com"//"http://127.0.0.1:8084";
const BASE_URL_SETTING = "https://knights-lined-herself-tom.trycloudflare.com"//"http://127.0.0.1:8088";
// Utility delay function
const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

// Helper function to append logs
export const writeLog = async (level, message) => {
  try {
    await fetch(`${BASE_URL_LOG}/log`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ level, message }),
    });
  } catch (err) {
    console.error("Failed to send log:", err);
  }
};
// Fetch the log file (plain text)
export async function fetchLog() {
  const response = await fetch(`${BASE_URL_READLOG}/readlog`);
  if (!response.ok) {
    throw new Error("Failed to fetch log");
  }
  return response.text();
}
// set permission
export async function setPermissions(dir) {
  try {
    const response = await fetch(`${BASE_URL_PERMISSION}/setpermissions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ dir: dir })
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error calling API:", error);
    return { success: 0, message: error.message };
  }
}


// ------------------------- Global Config API -------------------------
export const globalConfigAPI = {
  get: async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/config`);
      const json = await res.json();
      const data = json?.config;

      return {
        topDir: data?.TopDir,
        maxBackups: data?.MaxBackups,
        compressLevel: data?.CompressLevel,
        fillCycle: data?.FillCycle
      };
    } catch (error) {
      console.error("Error fetching config:", error);
      return { topDir: "", maxBackups: "", compressLevel: "", fillCycle: "" };
    }
  },

  save: async (config) => {
    try {
      const res = await fetch(`${BASE_URL}/api/config`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          config: {
            TopDir: config.topDir,
            MaxBackups: config.maxBackups,
            CompressLevel: config.compressLevel,
            FullPeriod: config.fullPeriod,
            FillCycle: config.fillCycle
          }
        })
      });
      return await res.json();
    } catch (error) {
      console.error("Error saving global config:", error);
    }
  }
};

// ------------------------- Hosts API -------------------------
export const hostsAPI = {
  list: async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/hosts`);
      if (!res.ok) throw new Error(`Server Error: ${res.status} ${res.statusText}`);
      const data = await res.json();

      return data.map(item => ({
        hostname: item.hostname,
        dhcpFlag: item.dhcp ?? "0",
        user: item.user,
        moreUsers: item.moreUsers ?? "",
        xferMethod: item.xferMethod ?? "rsync"
      }));
    } catch (error) {
      console.error("Error fetching hosts:", error);
      return [];
    }
  },

  get: async (hostname) => {
    try {
      const res = await fetch(`${BASE_URL}/api/hosts/${hostname}`);
      if (!res.ok) throw new Error(`Server Error: ${res.status} ${res.statusText}`);
      const data = await res.json();

      return {
        hostname: data?.hostname ?? "",
        dhcpFlag: data?.dhcpFlag ?? "0",
        user: data?.user ?? "",
        moreUsers: data?.moreUsers ?? "",
        xferMethod: data?.xferMethod ?? "rsync",
        fullBackupPeriod: data?.fullBackupPeriod ?? "",
        incrBackupPeriod: data?.incrBackupPeriod ?? "",
        smbShare: data?.smbShare ?? "",
        smbUserName: data?.smbShareUserName ?? "",
        smbPasswd: data?.smbPasswd ?? ""
      };
    } catch (error) {
      console.error("Error fetching host details:", error);
      return {
        hostname: "",
        dhcpFlag: "0",
        user: "",
        moreUsers: "",
        xferMethod: "rsync",
        fullBackupPeriod: "",
        incrBackupPeriod: "",
        smbShare: "",
        smbUserName: "",
        smbPasswd: ""
      };
    }
  },

  save: async (hostData) => {
    try {
      const payload = {
        hostname: hostData.hostname,
        dhcpFlag: hostData.dhcpFlag,
        user: hostData.user,
        moreUsers: hostData.moreUsers,
        xferMethod: hostData.xferMethod,
        fullBackupSchedule: Number(hostData.fullBackupSchedule),
        incrBackupSchedule: Number(hostData.incrBackupSchedule)
      };

      if (hostData.xferMethod === "smb") {
        if (hostData.smbShare) payload.smbShare = hostData.smbShare;
        if (hostData.smbUserName) payload.smbUserName = hostData.smbUserName;
        if (hostData.smbPasswd) payload.smbPasswd = hostData.smbPasswd;
      }

      const res = await fetch(`${BASE_URL}/api/hosts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      return await res.json();
    } catch (err) {
      console.error("Error creating host:", err);
    }
  },

  update: async (hostname, hostData) => {
    try {
      const payload = {
        dhcpFlag: hostData.dhcpFlag,
        user: hostData.user,
        moreUsers: hostData.moreUsers,
        xferMethod: hostData.xferMethod,
        fullBackupPeriod: Number(hostData.fullBackupPeriod),
        incrBackupPeriod: Number(hostData.incrBackupPeriod)
      };

      if (hostData.xferMethod === "smb") {
        if (hostData.smbShare) payload.smbShare = hostData.smbShare;
        if (hostData.smbUserName) payload.smbUserName = hostData.smbUserName;
        if (hostData.smbPasswd) payload.smbPasswd = hostData.smbPasswd;
      }

      const res = await fetch(`${BASE_URL}/api/hosts/${hostname}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      return await res.json();
    } catch (error) {
      console.error("Error updating host:", error);
    }
  },

  delete: async (hostname) => {
    try {
      const res = await fetch(`${BASE_URL}/api/hosts/${hostname}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" }
      });
      return await res.json();
    } catch (error) {
      console.error("Error deleting host:", error);
    }
  }
};

// ------------------------- Backups API -------------------------
export const backupsAPI = {
  list: async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/backups`);
      return await res.json();
    } catch (error) {
      console.error("Error fetching backups:", error);
    }
  },

  trigger: async (hostname, type) => {
    try {
      const res = await fetch(`${BASE_URL}/api/backups/${hostname}/trigger`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type })
      });

      if (!res.ok) throw new Error("Failed to trigger backup");
      return await res.json();
    } catch (err) {
      console.error("Error triggering backup:", err);
      throw err;
    }
  }
};

// ------------------------- Restore API -------------------------
export const restoreAPI = {
  getHosts: async () => {
    const res = await fetch(`${BASE_URL}/api/hosts`);
    if (!res.ok) throw new Error("Failed to load hosts");
    return await res.json();
  },

  getUserHosts: async (payload) => {
    try {
      const res = await fetch(`${BASE_URL}/api/get-user-hosts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error("Failed to load restore hosts");
      return await res.json();
    } catch (err) {
      console.error("Error fetching restore hosts:", err);
      throw err;
    }
  },

  getBackups: async (hostname) => {
    const res = await fetch(`${BASE_URL}/api/restore/${hostname}/backups`);
    if (!res.ok) throw new Error("Failed to load backups");
    return await res.json();
  },

  getFiles: async (hostname, backupNum, path = "/") => {
    const res = await fetch(`${BASE_URL}/api/restore/${hostname}/backups/${backupNum}/files?path=${path}`);
    if (!res.ok) throw new Error("Failed to load files");
    return await res.json();
  },

  restore: async (hostname, backupNum, files) => {
    const res = await fetch(`${BASE_URL}/api/restore/${hostname}/backups/${backupNum}/requests`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(files)
    });
    if (!res.ok) throw new Error("Restore failed");
    return await res.json();
  },

  sendInfo: async (hostname, backupNum, payload) => {
    const res = await fetch(`${BASE_URL}/api/restore/${hostname}/backups/${backupNum}/restore`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error("Restore failed");
    return await res.json();
  }
};

// ------------------------- Reports API -------------------------
export const reportsAPI = {
  getLogTypes: async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/reports/log-types`);
      if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
      return await res.json();
    } catch (error) {
      console.error("Error fetching log types:", error);
      return [];
    }
  },

  getLogDates: async (logType) => {
    try {
      const res = await fetch(`${BASE_URL}/api/reports/logs/${logType}/dates`);
      if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
      return await res.json();
    } catch (error) {
      console.error("Error fetching log dates:", error);
      return [];
    }
  },

  getLog: async (logType, date) => {
    try {
      const res = await fetch(`${BASE_URL}/api/reports/logs/${logType}/${date}`);
      if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
      return await res.json();
    } catch (error) {
      console.error("Error fetching log:", error);
      return { content: `No log available for ${logType} on ${date}.`, date, type: logType };
    }
  }
};

// ------------------------- Notifications API -------------------------
export const notificationsAPI = {
  get: async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/notifications`);
      if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
      return await res.json();
    } catch (error) {
      console.error("Error fetching notifications:", error);
      // return null;
      return {
        emailFrom: '',
        emailTo: '',
        sendReminders: true,
        reminderSchedule: '',
        emailSubject: '',
        emailBody: ''
      }
    }
  },

  save: async (config) => {
    try {
      const res = await fetch(`${BASE_URL}/api/notifications`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config)
      });
      if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
      return await res.json();
    } catch (error) {
      console.error("Error saving notification config:", error);
      return { success: false, message: "Failed to update notifications" };
    }
  }
};

// ------------------------- User API -------------------------
export const userApi = {
  login: async (payload) => {
    try {
      const res = await fetch(`${BASE_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
      return await res.json();
    } catch (error) {
      console.error("Error logging in:", error);
      return null;
    }
  }
};
// Cloud APIs

const request = async (url, options) => {
  const res = await fetch(`${BASE_URL_CLOUD}${url}`, options);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
};

export const startSync = (spath, dpath) =>
  request("/sync/copy", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      //_async: true,
      srcFs: spath,
      dstFs: dpath,
      opt: {
        no_update_dir_modtime: true,
        create_empty_src_dirs: true,
        ignore_existing: false,
        retries: 3
      }
    })

  });

export const getJobStatus = (jobid) =>
  request("/job/status", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ jobid }),
  });

export const getRcloneStats = () =>
  request("/core/stats", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({})
  });

export const getTransferred = () =>
  request("/core/transferred", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({})
  });

export const getTransferredWithHosts = async () => {
  const res = await getTransferred();
   //console.log(res)
  return res.transferred.map(t => ({
    file: t.name,
    size: t.size,
    status: t.error ? "Failed" : "OK",
    job: t.group,
    completed_at: t.completed_at,
    started_at: t.started_at
  }));
};

export async function getProviders() {
  const res = await fetch(`${BASE_URL_SETTING}/get-cloud-configurations`);
  if (!res.ok) throw new Error("Failed to fetch providers");
  return res.json();
}

export async function saveProvider(payload) {
  const res = await fetch(`${BASE_URL_SETTING}/save-cloud-settings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams(payload).toString(),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Save failed");
  return data;
}
