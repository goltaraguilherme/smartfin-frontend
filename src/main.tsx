import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { AuthProvider } from './context/AuthContext';
import { BrowserRouter } from 'react-router-dom';
import './index.css'
import { DarkThemeProvider } from './context/DarkThemeContext';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <DarkThemeProvider>
          <App />
        </DarkThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
