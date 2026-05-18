import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './styles/global.css'

const tokenViejo   = localStorage.getItem('token');
const usuarioViejo = localStorage.getItem('usuario');

if (tokenViejo && usuarioViejo) {
  // Mover a cookies
  import('./utils/cookieUtils').then(({ setCookie }) => {
    setCookie('token',   tokenViejo,   1);
    setCookie('usuario', usuarioViejo, 1);
  });
  // Limpiar localStorage
  localStorage.removeItem('token');
  localStorage.removeItem('usuario');
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)