import { useState } from 'react'
import { useWalletClient, usePublicClient } from 'wagmi'
import toast from 'react-hot-toast'

export function useSwap() {
  const { data: walletClient } = useWalletClient()
  const publicClient = usePublicClient()
  const [loading, setLoading] = useState(false)

  async function swap(params: {
    chain: string
    tokenIn: string
    tokenOut: string
    amount: string
  }) {
    if (!walletClient) {
      toast.error('Connect your wallet first')
      throw new Error('Not connected')
    }
    setLoading(true)
    try {
      const [{ AppKit }, { ViemAdapter, resolveChainIdentifier }] = await Promise.all([
        import('@circle-fin/app-kit'),
        import('@circle-fin/adapter-viem-v2'),
      ])

      const supportedChains = ([
        'Ethereum', 'Base', 'Polygon', 'Arbitrum', 'Avalanche', 'Optimism',
        'Ethereum_Sepolia', 'Base_Sepolia', 'Arc_Testnet',
      ] as const).map((c) => resolveChainIdentifier(c)).filter(Boolean)

      const adapter = new ViemAdapter(
        {
          getWalletClient: () => Promise.resolve(walletClient as any),
          getPublicClient: (_params: any) => publicClient as any,
        },
        {
          addressContext: 'user-controlled',
          supportedChains: supportedChains as any,
        }
      )

      const kit = new AppKit({
  baseUrl: 'https://radon-dapp.vercel.app',
} as any)

      const tx = await kit.swap({
        from: { adapter, chain: params.chain as any },
        tokenIn:  params.tokenIn,
        tokenOut: params.tokenOut,
        amountIn: params.amount,
        config: {
          kitKey: import.meta.env.VITE_CIRCLE_KIT_KEY,
          allowanceStrategy: 'approve' as any,
        },
      })

      toast.success('Swap confirmed!')
      return tx
    } catch (err: any) {
      toast.error(err?.message || 'Swap failed')
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { swap, loading }
}