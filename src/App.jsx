import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom'
import { AppProvider, useApp } from './context/AppContext'
import Layout from './components/Layout'
import Home from './pages/Home'
import GlobalConfig from './pages/GlobalConfig'
import HostsList from './pages/HostsList'
import HostEdit from './pages/HostEdit'
import Backups from './pages/Backups'
import Restore from './pages/Restore'
import Reports from './pages/Reports'
import Notifications from './pages/Notifications'
import CreateHost from './pages/CreateHost'
import { PrivateRoute, PublicRoute } from './components/RouteChecking'
import {  useSelector } from 'react-redux'
import Login from './pages/Login'

function App() {

  const { isLoggedIn } = useSelector((state) => state.user)

  return (
    <AppProvider>
      <Router>

        <Routes>

          <Route path='/' element={<PublicRoute isLoggedIn={isLoggedIn}>
            <Login />
          </PublicRoute>} >
          </Route>

          <Route element={<PrivateRoute isLoggedIn={isLoggedIn}>
            <Layout />
          </PrivateRoute>}>

            <Route path="/home" element={<Home />} />
            <Route path="/global-config" element={<GlobalConfig />} />
            <Route path="/hosts" element={<HostsList />} />
            <Route path="/hosts/createHost" element={<CreateHost />} />
            <Route path="/hosts/edit/:hostname" element={<HostEdit />} />
            <Route path="/backups" element={<Backups />} />
            <Route path="/restore" element={<Restore />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/notifications" element={<Notifications />} />

          </Route>
        </Routes>

      </Router>

      
    </AppProvider>
  )
}

export default App

