import '@fontsource-variable/plus-jakarta-sans'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import { DemoStateProvider } from './context/DemoStateContext.tsx'
import { ToastProvider } from './context/ToastContext.tsx'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ToastProvider>
        <DemoStateProvider>
          <App />
        </DemoStateProvider>
      </ToastProvider>
    </BrowserRouter>
  </StrictMode>,
)
