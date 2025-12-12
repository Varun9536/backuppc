

// import { useState, useEffect } from 'react'
// import { useNavigate } from 'react-router-dom'
// import { restoreAPI } from '../services/api'
// import styles from './Restore.module.css'

// const Restore = () => {
//   const navigate = useNavigate()
//   const [hosts, setHosts] = useState([])
//   const [selectedHost, setSelectedHost] = useState('')
//   const [backups, setBackups] = useState([])
//   const [selectedBackup, setSelectedBackup] = useState('')
//   const [files, setFiles] = useState([])
//   const [currentPath, setCurrentPath] = useState('/')
//   const [loading, setLoading] = useState(false)
//   const [backup_no, setbackup_no] = useState("")


//   // ⭐ NEW: selected files
//   const [selectedFiles, setSelectedFiles] = useState([])

//   useEffect(() => {
//     loadHosts()
//   }, [])

//   useEffect(() => {
//     if (selectedHost) {
//       loadBackups(selectedHost)
//     } else {
//       setBackups([])
//       setSelectedBackup('')
//       setFiles([])
//     }
//   }, [selectedHost])

//   useEffect(() => {
//     if (selectedHost && selectedBackup) {
//       loadFiles(selectedHost, backup_no, currentPath)
//     } else {
//       setFiles([])
//     }
//   }, [selectedHost, selectedBackup, backup_no , currentPath])

//   const loadHosts = async () => {
//     try {
//       setLoading(true)
//       const data = await restoreAPI.getHosts()
//       console.log(data)
//       setHosts(data)
//     } catch (error) {
//       alert('Failed to load hosts')
//     } finally {
//       setLoading(false)
//     }
//   }

//   const loadBackups = async (hostname) => {
//     try {
//       setLoading(true)
//       const data = await restoreAPI.getBackups(hostname)
//       console.log("backups" , data)


//       setBackups(data)

//       // if (data.length > 0) {
//       //   setSelectedBackup(data[0])
//       // }
//     } catch (error) {
//       alert('Failed to load backups')
//     } finally {
//       setLoading(false)
//     }
//   }

//   const loadFiles = async (hostname, backupnumber, path) => {
//     try {
//       setLoading(true)
//       const fileList = await restoreAPI.getFiles(hostname, backupnumber, path)
//       console.log("files" , fileList)
//       setFiles(fileList)
//     } catch (error) {
//       alert('Failed to load files')
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleFileClick = (file) => {
//     if (file.type === 'folder') {
//       setCurrentPath(file.path)
//     }
//   }

//   // ⭐ NEW — toggle checkbox
//   const toggleSelectFile = (filePath) => {

//     // const filePath2 = `${selectedHost}:${filePath}`
//     const filePath2 = filePath.replace(/^\/+/, "")



//     setSelectedFiles(prev =>
//       prev.includes(filePath2)
//         ? prev.filter(f => f !== filePath2)
//         : [...prev, filePath2]
//     )




//     // const cleanPath = filePath.replace(/^\/+/, "");

//     // const fullPath = `${selectedHost}:${cleanPath}`;

//     // setSelectedFiles(prev =>
//     //   prev.includes(fullPath)
//     //     ? prev.filter(f => f !== fullPath)
//     //     : [...prev, fullPath]
//     // )
//   }




//   const buildRestorePayload = () => {
//     return selectedFiles.map(filePath => {
//       const clean = filePath.replace(/^\/+/, ""); // remove leading /
//       const parts = clean.split("/");             // split by /

//       return {
//         share: parts[0],                           // first part = share
//         file: parts.slice(1).join("/")             // rest = relative path inside share
//       };
//     });
//   };

//   // ⭐ NEW — restore selected files
//   const handleRestoreSelected = async () => {
//     if (selectedFiles.length === 0) {
//       alert("Please select at least one file!")
//       return
//     }

//     const yes = window.confirm(
//       `Restore ${selectedFiles.length} file(s)?\nHost: ${selectedHost}\nBackup: ${selectedBackup}`
//     )

//     if (!yes) return

//     try {
//       const res = await restoreAPI.restore(
//         selectedHost,
//         // selectedBackup,
//         backup_no ,
//         // selectedFiles
//         buildRestorePayload()
//       )

//       if (res.success) {
//         alert(`Restore started! Restore ID: ${res.restoreId}`)
//       } else {
//         alert("Restore failed")
//       }
//     } catch {
//       alert("Failed to initiate restore")
//     }
//   }

//   return (
//     <div className={styles.container}>
//       <h1>Restore Files</h1>

//       <div className={styles.selectGroup}>
//         <label>Select Host:</label>
//         <select
//           value={selectedHost}
//           onChange={(e) => {
//             setSelectedHost(e.target.value)
//             setCurrentPath('/')
//             setSelectedFiles([])

//           }}
//         >
//           <option disabled value="">Select a host</option>
//           {hosts.map((h, index) => (
//             <option  key={h.hostname} value={h.hostname}>
//               {h.hostname}
//             </option>
//           ))}
//         </select>
//       </div>

//       {selectedHost && (
//         <div className={styles.selectGroup}>
//           <label>Select Backup:</label>
//           <select
//             value={selectedBackup}
//             onChange={(e) => {
//               setSelectedBackup(e.target.value)
//               setCurrentPath('/')
//               setSelectedFiles([])
//               setbackup_no(e.target.value)
//             }}
//           >
//              <option disabled value="">Select a Backup Date</option>
//             {backups.map((b) => (
//               <option  key={b?.backupNum} value={b?.backupNum}>
//                 {b.date}
//               </option>
//             ))}
//           </select>
//         </div>
//       )}

//       {selectedHost && selectedBackup && (
//         <div className={styles.fileBrowser}>
//           <h2>Files</h2>

//           {currentPath !== '/' && (
//             <button
//               className={styles.backButton}
//               onClick={() => {
//                 const parent = currentPath.split('/').slice(0, -1).join('/') || '/'
//                 setCurrentPath(parent)
//                 setSelectedFiles([])
//               }}
//             >
//               ← Back
//             </button>
//           )}

//           {loading ? (
//             <div>Loading files...</div>
//           ) : (
//             <ul className={styles.fileList}>
//               {files.length === 0 ? (
//                 <li>No files found</li>
//               ) : (
//                 files.map((f, i) => (
//                   <li
//                     key={i}
//                     className={`${styles.fileItem} ${f.type === 'folder' ? styles.folder : styles.file}`}
//                     onClick={() => handleFileClick(f)}
//                   >
//                     {/* ⭐ Checkbox added ONLY for files */}
//                     {f.type === "file" && (


//                       <input
//                         type="checkbox"
//                         checked={selectedFiles.includes(f.path.replace(/^\/+/, ""))}
//                         onClick={(e) => e.stopPropagation()}
//                         onChange={() => toggleSelectFile(f.path)}
//                         style={{ marginRight: "10px" }}
//                       />
//                     )}

//                     {f.type === 'folder' ? '📁 ' : '📄 '}
//                     {f.name}
//                   </li>
//                 ))
//               )}
//             </ul>
//           )}
//         </div>
//       )}

//       {/* ⭐ NEW Button — Restore Selected */}
//       {selectedFiles.length > 0 && (
//         <button onClick={handleRestoreSelected} className={styles.backButton}>
//           🔄 Restore Selected Files ({selectedFiles.length})
//         </button>
//       )}

//       <button onClick={() => navigate('/')} className={styles.backButton}>
//         ← Back to Home
//       </button>
//     </div>
//   )
// }

// export default Restore








import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { restoreAPI } from '../services/api'
import styles from './Restore.module.css'
import { useSelector } from 'react-redux'

const Restore = () => {
  const navigate = useNavigate()
  const { userid, role } = useSelector((state) => state.user)

  // Hosts / backups
  const [hosts, setHosts] = useState([])
  // const [hosts, setHosts] = useState([])
  const [selectedHost, setSelectedHost] = useState('')
  const [backups, setBackups] = useState([])
  const [selectedBackup, setSelectedBackup] = useState('')
  const [backup_no, setbackup_no] = useState('')

  // Files UI
  const [rootFolders, setRootFolders] = useState([])     // top-level items when path === '/'
  const [insideItems, setInsideItems] = useState([])     // items for the currently opened root (or subfolder)
  const [currentPath, setCurrentPath] = useState('/')    // current path loaded from API
  const [selectedRoot, setSelectedRoot] = useState('')   // the root folder user selected (share)

  // Selections and loading
  const [selectedFiles, setSelectedFiles] = useState([]) // stores cleaned paths (no leading '/'), relative to root
  const [loading, setLoading] = useState(false)
  // const [restoreInfo , setrestoreInfo] = useState("")




  const sendRestoreInfo = async (selectedHost, backup_no, restoreInfo) => {

    let bodydata = {
      "files": [
        restoreInfo
      ]
    }

    const data = await restoreAPI.sendInfo(selectedHost, backup_no, bodydata)
    //console.log("data restore request", data)
    alert(`${data.message} Restore ID: ${data.restoreId || ""}`)
  }



  useEffect(() => {
    loadHosts()
  }, [])

  useEffect(() => {
    if (selectedHost) {
      loadBackups(selectedHost)
    } else {
      setBackups([])
      setSelectedBackup('')
      resetFileState()
    }
  }, [selectedHost])

  // When a backup is selected (backup_no updated), load root folders (path '/')
  useEffect(() => {
    if (selectedHost && backup_no) {
      setCurrentPath('/')         // ensure root path
      setSelectedRoot('')         // no root selected by default
      setSelectedFiles([])
      loadFiles(selectedHost, backup_no, '/')
    } else {
      resetFileState()
    }
  }, [selectedHost, backup_no])

  // When currentPath changes and it's not root, load its contents into insideItems.
  // (If path === '/', we treat as root and insideItems managed by rootFolders until user clicks a root)
  useEffect(() => {
    if (selectedHost && backup_no && currentPath && currentPath !== '/') {
      loadFiles(selectedHost, backup_no, currentPath)
    }
  }, [currentPath])

  const resetFileState = () => {
    setRootFolders([])
    setInsideItems([])
    setCurrentPath('/')
    setSelectedRoot('')
    setSelectedFiles([])
    setLoading(false)
  }

  const loadHosts = async () => {

   
    try {
      setLoading(true)
      if (role == "User") {
        const userdata = await restoreAPI.getUserHosts({ userid })
       
       // console.log(userdata)
        setHosts(userdata.hosts)
      }

      if(role == "Admin") {
        const data = await restoreAPI.getHosts()
        setHosts(data || [])
      }

    } catch (error) {
      console.error(error)
      alert('Failed to load hosts')
    } finally {
      setLoading(false)
    }
  }

  const loadBackups = async (hostname) => {
    try {
      setLoading(true)
      const data = await restoreAPI.getBackups(hostname)
      setBackups(data || [])
    } catch (error) {
      console.error(error)
      alert('Failed to load backups')
    } finally {
      setLoading(false)
    }
  }

  /**
   * loadFiles:
   * - when path === '/' => set rootFolders (top-level folders/files)
   * - when path !== '/' => set insideItems (contents of that path)
   *
   * Assumes restoreAPI.getFiles(hostname, backupnumber, path) returns an array of
   * items with at least: { name, path, type } where type is 'file' or 'folder'
   */
  const loadFiles = async (hostname, backupnumber, path) => {
    try {
      setLoading(true)
      const fileList = await restoreAPI.getFiles(hostname, backupnumber, path)
      const list = fileList || []

      if (path === '/' || path === '') {
        // root list: show as rootFolders
        setRootFolders(list)
        setInsideItems([])
      } else {
        // contents of some folder -> show as insideItems
        setInsideItems(list)
      }
    } catch (error) {
      console.error(error)
      alert('Failed to load files')
    } finally {
      setLoading(false)
    }
  }

  // -- UI interactions --

  // When root folder (top-level) is clicked: select it as the "share" and show its immediate contents
  const handleRootClick = (folder) => {
    // folder.path expected e.g. "/sharedforsudheer" or "/sharedforsudheer/folderA"
    // But rootFolders should contain top-level shares; we pick folder.name as share
    setSelectedRoot(folder.name)
    setSelectedFiles([])          // clear previous selections when switching root
    setCurrentPath(folder.path)   // will trigger useEffect to load insideItems
  }

  // When a folder within insideItems is clicked (not checkbox): open that folder's contents
  const handleFolderClick = (folder) => {
    // open the folder path
    setSelectedFiles([])          // per requirement: when we expand, clear current selections
    setCurrentPath(folder.path)
  }

  // Toggle selecting a folder (checkbox). When checked, the folder is considered selected;
  // when selected, we must NOT auto-expand or show internal members for that selection.
  const toggleFolderSelect = (foldername) => {
    // store cleaned path relative to root (no leading '/')
    let clean = foldername.replace(/^\/+/, '')
    clean = clean.replace(`${selectedRoot}`, '')


    setSelectedFiles(prev =>
      prev.includes(clean) ? prev.filter(p => p !== clean) : [...prev, clean]
    )
  }

  // Toggle selecting file (checkbox)
  const toggleFileSelect = (filename) => {

    let clean = filename.replace(/^\/+/, '')
    clean = clean.replace(`${selectedRoot}`, '')


    setSelectedFiles(prev =>
      prev.includes(clean) ? prev.filter(p => p !== clean) : [...prev, clean]
    )
  }

  // Build restore payload per requirement:
  // {
  //   share: "<selectedRoot>",
  //   files: ["/file1.txt","/folder1","/folder1/sub/file.txt"]
  // }
  const buildRestorePayload = () => {
    const files = selectedFiles.map(p => (p.startsWith('/') ? p : `/${p}`))
    return {
      share: selectedRoot,
      files
    }
  }

  // Restore API call - same contract as before
  const handleRestoreSelected = async () => {
    if (!selectedRoot) {
      alert('Please select a root folder (share) first.')
      return
    }
    if (selectedFiles.length === 0) {
      alert('Please select at least one file or folder to restore.')
      return
    }

    const confirmMsg = `Restore ${selectedFiles.length} item(s)?\nHost: ${selectedHost}\nBackup: ${selectedBackup}\nShare: ${selectedRoot}`
    if (!window.confirm(confirmMsg)) return

    try {
      setLoading(true)
      const payload = buildRestorePayload()
      // keep same argument order: host, backup_no, payload
      const res = await restoreAPI.restore(selectedHost, backup_no, payload)
      //console.log("request", res)
      if (res && res?.restoreInfo.length > 1) {
         //alert(`Restore started! Restore ID: ${res.restoreId || res.id || 'unknown'}`)
        // optionally clear selections
        setSelectedFiles([])
        // setrestoreInfo(res.restoreInfo)

        sendRestoreInfo(selectedHost, backup_no, res.restoreInfo)

      } else {
        console.error('Restore result:', res)
        alert('Restore failed')
      }
    } catch (err) {
      console.error(err)
      alert('Failed to initiate restore')
    } finally {
      setLoading(false)
    }
  }

  // Helper: go up one folder level from currentPath
  const goBackParent = () => {
    if (!currentPath || currentPath === '/' || selectedRoot === '') return

    // parent relative to selectedRoot: If currentPath === "/share" -> go to showing rootFolders section (i.e., deselect root)
    const parts = currentPath.split('/').filter(Boolean) // remove empty fragments
    if (parts.length <= 1) {
      // we are directly under root share -> go back to root list (show rootFolders)
      setCurrentPath('/')
      setSelectedRoot('')
      setInsideItems([])
      setSelectedFiles([])
      return
    }
    // else go one level up
    const parent = '/' + parts.slice(0, -1).join('/')
    setCurrentPath(parent)
    setSelectedFiles([])
  }

  // Provided UI JSX
  return (
    <div className={styles.container}>
      <h1>Restore Files</h1>

      <div className={styles.selectGroup}>
        <label>Select Host:</label>
        <select
          value={selectedHost}
          onChange={(e) => {
            setSelectedHost(e.target.value)
            setSelectedBackup('')
            setbackup_no('')
            resetFileState()
          }}
        >
          <option disabled value="">Select a host</option>


          {role == "Admin" && (<>
            {hosts?.map((h) => (
              <option key={h.hostname} value={h.hostname}>
                {h.hostname}
              </option>
            ))}
          </>)}

          {role == "User" && (<>
            {hosts?.map((h) => (
              <option key={h} value={h}>
                {h}
              </option>
            ))}

          </>)}
        </select>
      </div>

      {selectedHost && (
        <div className={styles.selectGroup}>
          <label>Select Backup:</label>
          <select
            value={selectedBackup}
            onChange={(e) => {
              const v = e.target.value
              setSelectedBackup(v)
              setbackup_no(v)
              // useEffect will load root folders for '/'
            }}
          >
            <option disabled value="">Select a Backup Date</option>
            {backups.map((b) => (
              <option key={b?.backupNum} value={b?.backupNum}>
                {b.date}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* FILE BROWSER AREA */}
      {selectedHost && selectedBackup && (
        <div className={styles.fileBrowser}>
          {/* ROOT FOLDERS SECTION */}
          <h2>Root Folder</h2>
          {loading && currentPath === '/' ? (
            <div>Loading root folders...</div>
          ) : (
            <ul className={styles.fileList}>
              {rootFolders.length === 0 ? (
                <li>No root folders found</li>
              ) : (
                rootFolders.map((f, i) => (
                  <li
                    key={i}
                    className={`${styles.fileItem} ${styles.folder}`}
                    onClick={() => handleRootClick(f)}
                    style={{ cursor: 'pointer' }}
                  >
                    📁 {f.name}
                  </li>
                ))
              )}
            </ul>
          )}

          {/* INSIDE SECTION (shows when user selects a root or opens a folder) */}
          {selectedRoot && (
            <>
              <h2>Inside: {selectedRoot}</h2>

              {/* Back button for inside view */}
              <div style={{ marginBottom: 8 }}>
                <button
                  className={styles.backButton}
                  onClick={goBackParent}
                >
                  ← Back
                </button>
              </div>

              {loading && currentPath !== '/' ? (
                <div>Loading...</div>
              ) : (
                <ul className={styles.fileList}>
                  {insideItems.length === 0 ? (
                    <li>No items found</li>
                  ) : (
                    insideItems.map((f, i) => {
                      let cleanedPath = f.path.replace(/^\/+/, '')

                      cleanedPath = cleanedPath.replace(`${selectedRoot}`, '')
                      const isChecked = selectedFiles.includes(cleanedPath)

                      return (
                        <li
                          key={i}
                          className={`${styles.fileItem} ${f.type === 'folder' ? styles.folder : styles.file}`}
                          onClick={() => {
                            // When clicking on list item: if it's a folder -> open it.
                            // If it's a file: do nothing (selection via checkbox only)
                            if (f.type === 'folder') {
                              // Only open if the folder is not selected via checkbox.
                              // Per requirement: when folder is selected via checkbox, we should not expand it.
                              if (!isChecked) {
                                handleFolderClick(f)
                              }
                            }
                          }}
                          style={{ cursor: f.type === 'folder' ? 'pointer' : 'default' }}
                        >
                          {/* Checkbox for folder */}
                          {f.type === 'folder' && (
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onClick={(e) => e.stopPropagation()}
                              onChange={() => toggleFolderSelect(f.path)}
                              style={{ marginRight: '10px' }}
                            />
                          )}

                          {/* Checkbox for file */}
                          {f.type === 'file' && (
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onClick={(e) => e.stopPropagation()}
                              onChange={() => toggleFileSelect(f.path)}
                              style={{ marginRight: '10px' }}
                            />
                          )}

                          {f.type === 'folder' ? '📁 ' : '📄 '}
                          {f.name}
                        </li>
                      )
                    })
                  )}
                </ul>
              )}
            </>
          )}
        </div>
      )}

      {/* Restore button */}
      <div style={{ marginTop: 16 }}>
        <button
          onClick={handleRestoreSelected}
          className={styles.backButton}
          disabled={loading || !selectedRoot || selectedFiles.length === 0}
        >
          🔄 Restore Selected ({selectedFiles.length})
        </button>
      </div>

      <div style={{ marginTop: 12 }}>
        <button onClick={() => navigate('/')} className={styles.backButton}>
          ← Back to Home
        </button>
      </div>
    </div>
  )
}

export default Restore
