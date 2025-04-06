import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { ThemeContextProvider } from './ThemeContext.jsx'

createRoot(document.getElementById('root')).render(
  <ThemeContextProvider>
    <BrowserRouter>
      <StrictMode>
        <App />
      </StrictMode>
    </BrowserRouter>
  </ThemeContextProvider>
)
