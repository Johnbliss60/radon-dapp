import { useState } from 'react'
import { useWalletClient, usePublicClient } from 'wagmi'
import toast from 'react-hot-toast'

export function useBridge() {
  const { data: walletClient } = useWalletClient()
  const publicClient = usePublicClient()
  const [loading, setLoading] = useState(false)

  async function bridge(params: {
    fromChain: string
    toChain: string
    amount: string
    token?: string
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
        'Ethereum_Sepolia', 'Base_Sepolia', 'Arc_Testnet', 'Avalanche_Fuji',
        'Arbitrum_Sepolia', 'Optimism_Sepolia',
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

      const kit = new AppKit()

      const result = await kit.bridge({
        from: { adapter, chain: params.fromChain as any },
        to:   { adapter, chain: params.toChain as any },
        amount: params.amount,
        token: (params.token ?? 'USDC') as 'USDC',
      })

      toast.success('Bridge initiated! USDC is on its way.')
      return result
    } catch (err: any) {
      toast.error(err?.message || 'Bridge failed')
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { bridge, loading }
}