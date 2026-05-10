import { AppKit } from '@circle-fin/app-kit'
import { useWalletClient, usePublicClient } from 'wagmi'
import { useMemo } from 'react'

export function useAppKit() {
  const { data: walletClient } = useWalletClient()
  const publicClient = usePublicClient()

  return useMemo(() => {
    if (!walletClient) return null
    try {
      const kit = new AppKit()
      return { kit, walletClient, publicClient }
    } catch (e) {
      console.error('AppKit init error:', e)
      return null
    }
  }, [walletClient, publicClient])
}