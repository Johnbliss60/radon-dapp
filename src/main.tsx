// Intercept Circle API calls — must be first
const _originalFetch = window.fetch.bind(window)
window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
  const url = typeof input === 'string'
    ? input
    : input instanceof URL
    ? input.href
    : (input as Request).url

  if (url.includes('api.circle.com')) {
    const proxyUrl = url.replace('https://api.circle.com', '/circle-proxy')
    const cleanHeaders: Record<string, string> = {}
    if (init?.headers) {
      const entries = init.headers instanceof Headers
        ? Array.from(init.headers.entries())
        : Object.entries(init.headers as Record<string, string>)
      for (const [k, v] of entries) {
        if (k.toLowerCase() !== 'x-user-agent') cleanHeaders[k] = v
      }
    }
    return _originalFetch(proxyUrl, { ...init, headers: cleanHeaders })
  }
  return _originalFetch(input, init)
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