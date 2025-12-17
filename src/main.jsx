import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles/index.css'
import { Provider } from 'react-redux'
import { store } from './Redux/Store'

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  </Provider>

)

