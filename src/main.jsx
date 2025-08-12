import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Organiser from './Organiser.jsx'
import CustomerHome from './CustomerHome.jsx'
import LoginForm from './LoginForm.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App/>
  </StrictMode>,
)


/* <App />  */