import { createConfig, configureChains } from 'wagmi'
import {
  mainnet, polygon, optimism, arbitrum,
  base, sepolia, baseSepolia, avalancheFuji
} from 'wagmi/chains'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'
import { connectorsForWallets } from '@rainbow-me/rainbowkit'
import {
  metaMaskWallet,
  coinbaseWallet,
  rainbowWallet
} from '@rainbow-me/rainbowkit/wallets'
import type { Chain } from '../types'

const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'demo'

// Arc Testnet — correct values from docs.arc.network/arc/references/connect-to-arc
const arcTestnet = {
  id: 5042002,
  name: 'Arc Testnet',
  network: 'arc-testnet',
  nativeCurrency: { name: 'USDC', symbol: 'USDC', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://rpc.testnet.arc.network', 'https://api.testnet.arc.network'] },
    public:  { http: ['https://rpc.testnet.arc.network', 'https://api.testnet.arc.network'] },
  },
  blockExplorers: {
    default: { name: 'ArcScan', url: 'https://testnet.arcscan.app' },
  },
  testnet: true,
} as const

const RPC: Record<number, string> = {
  [mainnet.id]:       'https://eth.llamarpc.com',
  [polygon.id]:       'https://polygon.llamarpc.com',
  [optimism.id]:      'https://optimism.llamarpc.com',
  [arbitrum.id]:      'https://arbitrum.llamarpc.com',
  [base.id]:          'https://base.llamarpc.com',
  [sepolia.id]:       'https://ethereum-sepolia-rpc.publicnode.com',
  [baseSepolia.id]:   'https://base-sepolia-rpc.publicnode.com',
  [avalancheFuji.id]: 'https://avalanche-fuji-c-chain-rpc.publicnode.com',
  [arcTestnet.id]:    'https://rpc.testnet.arc.network',
}

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [mainnet, polygon, optimism, arbitrum, base, sepolia, baseSepolia, avalancheFuji, arcTestnet],
  [
    jsonRpcProvider({
      rpc: (chain) => ({ http: RPC[chain.id] ?? 'https://eth.llamarpc.com' }),
    }),
  ]
)

const connectors = connectorsForWallets([
  {
    groupName: 'Recommended',
    wallets: [
      metaMaskWallet({ projectId, chains }),
      coinbaseWallet({ appName: 'Radon', chains }),
      rainbowWallet({ projectId, chains }),
    ],
  },
])

export const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
})

export { chains }

// Bridge: USDC only via CCTP — mainnet + testnet
export const BRIDGE_CHAINS: Chain[] = [
  { id:'Ethereum',         label:'Ethereum',         color:'#627eea', icon:'E' },
  { id:'Base',             label:'Base',             color:'#0052ff', icon:'B' },
  { id:'Arbitrum',         label:'Arbitrum',         color:'#28a0f0', icon:'R' },
  { id:'Polygon',          label:'Polygon',          color:'#8247e5', icon:'P' },
  { id:'Avalanche',        label:'Avalanche',        color:'#e84142', icon:'V' },
  { id:'Optimism',         label:'OP Mainnet',       color:'#ff0420', icon:'O' },
  { id:'Arc_Testnet',      label:'Arc Testnet',      color:'#3D6FFF', icon:'A' },
  { id:'Ethereum_Sepolia', label:'Ethereum Sepolia', color:'#627eea', icon:'E' },
  { id:'Base_Sepolia',     label:'Base Sepolia',     color:'#0052ff', icon:'B' },
  { id:'Avalanche_Fuji',   label:'Avalanche Fuji',   color:'#e84142', icon:'V' },
  { id:'Arbitrum_Sepolia', label:'Arbitrum Sepolia', color:'#28a0f0', icon:'R' },
  { id:'Optimism_Sepolia', label:'OP Sepolia',       color:'#ff0420', icon:'O' },
]

// Swap: mainnet chains + Arc Testnet (USDC/EURC only on Arc)
export const SWAP_CHAINS: Chain[] = [
  { id:'Ethereum',    label:'Ethereum',    color:'#627eea', icon:'E' },
  { id:'Base',        label:'Base',        color:'#0052ff', icon:'B' },
  { id:'Arbitrum',    label:'Arbitrum',    color:'#28a0f0', icon:'R' },
  { id:'Polygon',     label:'Polygon',     color:'#8247e5', icon:'P' },
  { id:'Avalanche',   label:'Avalanche',   color:'#e84142', icon:'V' },
  { id:'Optimism',    label:'OP Mainnet',  color:'#ff0420', icon:'O' },
  { id:'Arc_Testnet', label:'Arc Testnet', color:'#3D6FFF', icon:'A' },
]