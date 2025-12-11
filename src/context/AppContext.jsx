import { createContext, useContext, useState, useEffect } from 'react'
import { globalConfigAPI, hostsAPI, backupsAPI , restoreAPI } from '../services/api'

import { useSelector } from 'react-redux'

const AppContext = createContext()

export const useApp = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within AppProvider')
  }
  return context
}

export const AppProvider = ({ children }) => {
  const [hosts, setHosts] = useState([])
  const [backups, setBackups] = useState([])
  const [loading, setLoading] = useState(false)
  const { role  , userid} = useSelector((state) => state.user)

  useEffect(() => {
    loadHosts()
    loadBackups()
  }, [])

  const loadHosts = async () => {
    try {
      setLoading(true)
      const data = await hostsAPI.list()
      setHosts(data)
    } catch (error) {
      console.error('Error loading hosts:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadBackups = async () => {
    try {
      // const data = await backupsAPI.list()
      // setBackups(data)




      if (role == "Admin") {
              const data = await backupsAPI.list()
              setBackups(data)
            }
      
            if (role == "User") {
             
              const admindata = await backupsAPI.list()
              const userdata = await restoreAPI.getUserHosts({userid})
              const matchedObjects = admindata?.filter(host_name =>
                userdata?.hosts?.includes(host_name.hostname)
              );
              setBackups(matchedObjects)
      
            }
    } catch (error) {
      console.error('Error loading backups:', error)
    }
  }

  const refreshHosts = () => loadHosts()
  const refreshBackups = () => loadBackups()

  return (
    <AppContext.Provider
      value={{
        hosts,
        backups,
        loading,
        refreshHosts,
        refreshBackups
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

