// Mock API service layer
// Replace these with actual API calls to your Perl backend

// Simulate API delay
const BASE_URL = 'http://localhost:8081';
const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms))

// Global Configuration API
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
      return {
        topDir: "",
        maxBackups: "",
        compressLevel: "",
        fillCycle: ""
      };
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

      const data = await res.json();
     // console.log(data.message);
    } catch (error) {
      console.error("Error:", error);
    }




  }
}

// Hosts API
export const hostsAPI = {
  list: async () => {

    try {
      const res = await fetch(`${BASE_URL}/api/hosts`);

      if (!res.ok) {
        throw new Error(`Server Error: ${res.status} ${res.statusText}`);
      }

      const data = await res.json();

      return data.map(item => ({
        hostname: item.hostname,
        dhcp: item.dhcp,
        user: item.user,
        moreUsers: item.moreUsers ?? ""
      }));
    } catch (error) {
      console.error("Error fetching hosts:", error);

      // return fallback empty array so UI doesn't break
      return [];
    }


    // return [
    //   { hostname: 'farside', dhcp: false, user: 'craig' },
    //   { hostname: 'larson', dhcp: true, user: 'gary' }
    // ]
  },


  
  
  get: async (hostname) => {

    try {
      const res = await fetch(`${BASE_URL}/api/hosts/${hostname}`);

      if (!res.ok) {
        throw new Error(`Server Error: ${res.status} ${res.statusText}`);
      }

      const data = await res.json();



      return {
        hostname: data?.hostname ?? "",
        dhcpFlag: data?.dhcpFlag ?? "",
        user: data?.user ?? "",
        moreUsers: data?.moreUsers ?? "",
        xferMethod: data?.xferMethod ?? "",
        clientCharset: data?.clientCharset ?? "",
        smbShare: data?.smbShare ?? "",
        fullBackupSchedule: data?.fullBackupSchedule ?? "",
        incrBackupSchedule: data?.incrBackupSchedule ?? "",
        retentionFull: data?.retentionFull ?? "",
        retentionIncr: data?.retentionIncr ?? "",
        sharePass: data?.sharePass ?? "",
      };

    } catch (error) {
      console.error("Error fetching host details:", error);

      // return empty defaults so UI safe rahe
      return {
        hostname: "",
        dhcpFlag: "",
        user: "",
        moreUsers: "",
        xferMethod: "",
        clientCharset: "",
        smbShare: "",
        fullBackupSchedule: "",
        incrBackupSchedule: "",
        retentionFull: "",
        retentionIncr: "",
      };
    }
  },
  save: async (hostData) => {

    const payload = {
      hostname: "newhost",
      dhcpFlag: "0",
      user: "username",
      moreUsers: "user1,user2",
      xferMethod: "rsync",
      clientCharset: "cp1252",
      smbShare: "C$",
      fullBackupSchedule: "0 2 * * 0",
      incrBackupSchedule: "0 2 * * 1-6",
      retentionFull: 30,
      retentionIncr: 14
    };

    //console.log("host", hostData)
    // return

    try {
      const res = await fetch(`${BASE_URL}/api/hosts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(hostData)
      });

      const data = await res.json();
     // console.log(data);
    } catch (err) {
      console.error("Error creating host:", err);
    }
  },


  update: async (hostname, hostData) => {
    //console.log("hostupdate" , hostname, hostData)
    // return
    try {
      const response = await fetch(`${BASE_URL}/api/hosts/${hostname}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(hostData),
      });

      const data = await response.json();
      //console.log("Update Response:", data);

      if (data.success) {
        console.log("Host configuration updated successfully");
      } else {
        console.warn("Failed to update host");
      }

      return data;

    } catch (error) {
      console.error("Error updating host:", error);
    }
  },



  delete: async (hostname) => {

    try {
      const response = await fetch(`${BASE_URL}/api/hosts/${hostname}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
     // console.log("Delete Response:", data);

      if (data.success) {
        console.log("Host deleted successfully");
      } else {
        console.log("Failed to delete host");
      }

    } catch (error) {
      console.error("Error:", error);
    }
  }
}

// Backups API
export const backupsAPI = {
  list: async () => {

    try {
      const response = await fetch(`${BASE_URL}/api/backups`);
      const data = await response.json();
      // console.log("Backups:", data);

      return data;

    } catch (error) {
      console.error("Error fetching backups:", error);
    }
  },
  trigger: async (hostname, type) => {
    // await delay()
    // console.log(`Triggering ${type} backup for ${hostname}`)
    // return { success: true, message: `${type} backup started for ${hostname}` }

    try {
      const res = await fetch(`${BASE_URL}/api/backups/${hostname}/trigger`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ type })
      });

      if (!res.ok) throw new Error("Failed to trigger backup");

      const data = await res.json();
      return data;

    } catch (err) {
      console.error("Error triggering backup:", err);
      throw err;
    }

  }
}

// Restore API
export const restoreAPI_old = {
  getHosts: async () => {

    try {
      const res = await fetch(`${BASE_URL}/api/hosts`, {
        method: "GET",
      });
      

      if (!res.ok) {
        throw new Error("Failed to load restore hosts");
      }

      const data = await res.json();

      //console.log(data, "gethosts")
      return data;
    } catch (err) {
      console.error("Error fetching restore hosts:", err);
      throw err;
    }
  },







  getBackups: async (hostname) => {

    try {
      const res = await fetch(`${BASE_URL}/api/restore/${hostname}/backups`, {
        method: "GET",
      });

      if (!res.ok) {
        throw new Error("Failed to fetch backup list");
      }
      const data = await res.json();


      //console.log("get backups", data)
      return data;
    } catch (error) {
      console.error("Error fetching host backups:", error);
      throw error;
    }

  },


  getFiles: async (hostname, backupDate) => {

    try {
      const response = await fetch(
        `${BASE_URL}/api/restore/${hostname}/backups/${backupDate}/restore`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            files,
            ...(destination ? { destination } : {})
          })
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      const result = await response.json();
      return result;

    } catch (error) {
      console.error("Error initiating restore:", error);
      return null;
    }

  },


  restore: async (hostname, backupDate, files) => {

    try {

      const url = `${BASE_URL}/api/restore/${hostname}/backups/${backupDate}/files?path=${encodeURIComponent(files)}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }
      const data = await response.json();
      //console.log("restore ", data)
      return data;

    } catch (error) {
      console.error("Error fetching backup files:", error);
      return null;
    }
  }
}




export const restoreAPI = {
  getHosts: async () => {
    const res = await fetch(`${BASE_URL}/api/hosts`);
    //  const res = await fetch(`${BASE_URL}/api/backups`);
   
    if (!res.ok) throw new Error("Failed to load hosts");
    return await res.json();
  },


  getUserHosts: async (payload) => {

    try {
      const res = await fetch(`${BASE_URL}/api/get-user-hosts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify( payload)
      });
      

      if (!res.ok) {
        throw new Error("Failed to load restore hosts");
      }

      const data = await res.json();

      //console.log(data, "gethosts")
      return data;
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
    const res = await fetch(
      `${BASE_URL}/api/restore/${hostname}/backups/${backupNum}/files?path=${path}`
    );

   
    if (!res.ok) throw new Error("Failed to load files");
    return await res.json();
  },


  restore: async (hostname, backupNum, files) => {

    const res = await fetch(
      `${BASE_URL}/api/restore/${hostname}/backups/${backupNum}/requests`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify( files)
      }
    );

    if (!res.ok) throw new Error("Restore failed");
    return await res.json();
  } ,



   sendInfo: async (hostname, backupNum, payload) => {

    const res = await fetch(
      `${BASE_URL}/api/restore/${hostname}/backups/${backupNum}/restore`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify( payload)
      }
    );

    if (!res.ok) throw new Error("Restore failed");
    return await res.json();
  }

};



export const reportsAPI = {

  getLogTypes: async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/reports/log-types`);

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      const data = await response.json();
      //console.log("get log types", data)

      return data;



    } catch (error) {
      console.error("Error fetching log types:", error);
      return [];
    }
  },

  // 2️⃣ Get log dates for a logType
  getLogDates: async (logType) => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/reports/logs/${logType}/dates`
      );

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      const data = await response.json();
      //console.log("get log dates", data)

      return data;

    } catch (error) {
      console.error("Error fetching log dates:", error);
      return [];
    }
  },

  // 3️⃣ Get a specific log by logType + date
  getLog: async (logType, date) => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/reports/logs/${logType}/${date}`
      );

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      const data = await response.json();
      //console.log("get log ", data)

      return data;

    } catch (error) {
      console.error("Error fetching log:", error);
      return {
        content: `No log available for ${logType} on ${date}.`,
        date,
        type: logType
      };
    }
  }
};










export const userApi = {

  login: async (payload) => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(
           payload
          )
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      const result = await response.json();
      return result;

    } catch (error) {
      console.error("Error initiating restore:", error);
      return null;
    }
  },

  
  
};














// // Notifications API
// export const notificationsAPI = {
//   get: async () => {
//     await delay()
//     return {
//       emailFrom: 'no-reply@example.com',
//       emailTo: 'user@example.com,admin@example.com',
//       sendReminders: true,
//       reminderSchedule: '0 8 * * *',
//       emailSubject: 'BackupPC Notification',
//       emailBody: 'Hello,\n\nThis is a reminder that your backup is due.'
//     }
//   },
//   save: async (config) => {
//     await delay()
//     console.log('Saving notification config:', config)
//     return { success: true }
//   }
// }





export const notificationsAPI = {
  // 1️⃣ GET /api/notifications
  get: async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/notifications`);

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      const data = await response.json();

      //console.log("get notification", data)
      return data;

    } catch (error) {
      console.error("Error fetching notification settings:", error);
      return null;
    }
  },

  // 2️⃣ PUT /api/notifications
  save: async (config) => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/notifications`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(config)
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      const data = await response.json();
      //console.log("save notification", data)
      return data;

    } catch (error) {
      console.error("Error saving notification config:", error);
      return { success: false, message: "Failed to update notifications" };
    }
  }
};

