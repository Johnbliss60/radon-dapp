// Intercept Circle API calls and route through our proxy
const originalFetch = window.fetch
window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
  const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url
  if (url.includes('api.circle.com')) {
    const newUrl = url.replace('https://api.circle.com', 'http://localhost:3001/circle-api')
    const newInit = {
      ...init,
      headers: {
        ...Object.fromEntries(
          Object.entries(init?.headers || {}).filter(([k]) => k.toLowerCase() !== 'x-user-agent')
        ),
      },
    }
    return originalFetch(newUrl, newInit)
  }
  return originalFetch(input, init)
}
import { Buffer as BufferPolyfill } from 'buffer'
;(globalThis as any).Buffer = BufferPolyfill
;(window as any).Buffer = BufferPolyfill

import React from 'react'
import ReactDOM from 'react-dom/client'
import { WagmiConfig } from 'wagmi'
import { RainbowKitProvider, darkTheme, lightTheme } from '@rainbow-me/rainbowkit'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider, useTheme } from './context/ThemeContext'
import { wagmiConfig, chains } from './config/chains'
import App from './App'
import '@rainbow-me/rainbowkit/styles.css'
import './index.css'

const queryClient = new QueryClient()

function Root() {
  const { theme } = useTheme()
  return (
    <RainbowKitProvider chains={chains}
      theme={theme === 'dark' ? darkTheme({ accentColor:'#3D6FFF' }) : lightTheme({ accentColor:'#3D6FFF' })}>
      <App />
    </RainbowKitProvider>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WagmiConfig config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <Root />
        </ThemeProvider>
      </QueryClientProvider>
    </WagmiConfig>
  </React.StrictMode>
)