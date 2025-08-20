import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Toaster } from 'react-hot-toast'
import {Provider} from "react-redux"
import store from './state/store.js'

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
    <Toaster
      position="top-right"
      gutter={18}
      toastOptions={{
        // Auto-close messages after 3 seconds (3000ms)
        duration: 1000, 
        
       
      }}
    />
  </Provider>,
)