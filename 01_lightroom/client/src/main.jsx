import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import './index.css'

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 5 * 60 * 1000 } }
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
        <Toaster position="bottom-center" toastOptions={{
          style: { background: '#161616', color: '#f0ebe3', border: '1px solid #222', fontFamily: 'Outfit' },
          success: { iconTheme: { primary: '#c6a55c', secondary: '#0a0a0a' } }
        }} />
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
)
