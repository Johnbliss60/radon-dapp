import express from 'express'
import { createProxyMiddleware } from 'http-proxy-middleware'
import cors from 'cors'

const app = express()

app.use(cors({ origin: 'http://localhost:5173' }))

app.use('/circle-api', createProxyMiddleware({
  target: 'https://api.circle.com',
  changeOrigin: true,
  pathRewrite: { '^/circle-api': '' },
  on: {
    proxyReq: (proxyReq) => {
      proxyReq.removeHeader('x-user-agent')
      proxyReq.removeHeader('origin')
    },
  },
}))

app.listen(3001, () => console.log('Proxy running on http://localhost:3001'))