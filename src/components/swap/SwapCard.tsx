import { useState, useEffect } from 'react'
import { ArrowUpDown } from 'lucide-react'
import { useAccount } from 'wagmi'
import { useSwap } from '../../hooks/useSwap'
import { TokenInput } from './TokenInput'
import { RouteDetails } from './RouteDetails'
import { TOKENS } from '../../config/tokens'
import { SWAP_CHAINS } from '../../config/chains'
import type { TxRecord } from '../../types'

// Tokens supported per chain (from Arc docs)
const CHAIN_TOKENS: Record<string, string[]> = {
  Arc_Testnet: ['USDC', 'EURC'],
  default:     ['USDC', 'USDT', 'EURC', 'NATIVE'],
}

interface Props { onTx: (tx: Omit<TxRecord,'id'|'timestamp'>) => void }

export function SwapCard({ onTx }: Props) {
  const { isConnected } = useAccount()
  const { swap, loading } = useSwap()
  const [fromToken, setFromToken] = useState('USDC')
  const [toToken,   setToToken]   = useState('USDT')
  const [amount,    setAmount]    = useState('')
  const [chain,     setChain]     = useState('Base')

  // When chain changes, reset tokens to valid ones for that chain
  useEffect(() => {
    const allowed = CHAIN_TOKENS[chain] ?? CHAIN_TOKENS.default
    if (!allowed.includes(fromToken)) setFromToken(allowed[0])
    if (!allowed.includes(toToken))   setToToken(allowed[1] ?? allowed[0])
  }, [chain])

  const allowedTokens = CHAIN_TOKENS[chain] ?? CHAIN_TOKENS.default

  const fp     = TOKENS[fromToken]?.price || 1
  const tp     = TOKENS[toToken]?.price   || 1
  const amtNum = parseFloat(amount) || 0
  const fee    = 0.00035 * amtNum * fp
  const amtOut = amtNum > 0 ? ((amtNum * fp / tp) * 0.995) - fee / tp : 0

  function flip() {
    const t = fromToken; setFromToken(toToken); setToToken(t); setAmount('')
  }

  async function handleSwap() {
    if (!amount || !isConnected) return
    try {
      await swap({ chain, tokenIn: fromToken, tokenOut: toToken, amount })
      onTx({
        type: 'swap', fromToken, toToken,
        amount: amtNum, amountOut: amtOut,
        hash: '0x' + Math.random().toString(16).slice(2, 10) + '…',
        status: 'confirmed',
      })
      setAmount('')
    } catch {}
  }

  const btnLabel = !isConnected
    ? 'Connect Wallet'
    : !amount ? 'Enter an amount'
    : loading  ? 'Swapping…'
    : `Swap ${fromToken} → ${toToken}`

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-[15px] font-black" style={{ color:'var(--text)' }}>Swap</span>
          <span className="text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest"
            style={{ background:'var(--blue-dim)', color:'var(--blue2)', border:'1px solid var(--blue-ring)', fontFamily:'JetBrains Mono,monospace' }}>
            App Kits
          </span>
        </div>

        {/* Chain selector */}
        <div className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl border cursor-pointer"
          style={{ background:'var(--surface2)', borderColor:'var(--border2)' }}>
          <span className="text-xs font-bold" style={{ color:'var(--text)', fontFamily:'JetBrains Mono,monospace' }}>
            {SWAP_CHAINS.find(c => c.id === chain)?.label ?? chain}
          </span>
          <select className="absolute inset-0 opacity-0 cursor-pointer w-full" style={{ fontSize:16 }}
            value={chain} onChange={e => setChain(e.target.value)}>
            {SWAP_CHAINS.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
          </select>
        </div>
      </div>

      {/* Chain info banner */}
      {chain === 'Arc_Testnet' && (
        <div className="text-[11px] px-3 py-2 rounded-lg mb-3 font-medium"
          style={{ background:'var(--blue-dim)', color:'var(--blue2)', border:'1px solid var(--blue-ring)' }}>
          ℹ Arc Testnet swap supports USDC and EURC only
        </div>
      )}

      <TokenInput
        label="You pay" token={fromToken} amount={amount}
        usdValue={`$${(amtNum * fp).toFixed(2)}`}
        balance={isConnected ? '250.00' : undefined}
        allowedTokens={allowedTokens}
        onChange={setAmount} onToken={setFromToken} onMax={() => setAmount('250')}
      />

      <div className="flex justify-center my-1 relative z-10">
        <button onClick={flip}
          className="w-10 h-10 rounded-xl border flex items-center justify-center"
          style={{ background:'var(--surface)', borderColor:'var(--border2)', color:'var(--text2)', transition:'transform 0.25s' }}
          onMouseEnter={e => e.currentTarget.style.transform = 'rotate(180deg)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'rotate(0deg)'}>
          <ArrowUpDown size={18} />
        </button>
      </div>

      <TokenInput
        label="You receive" token={toToken}
        amount={amtOut > 0 ? amtOut.toFixed(6) : ''}
        usdValue={`$${(amtOut * tp).toFixed(2)}`}
        allowedTokens={allowedTokens}
        onToken={setToToken} readonly
      />

      {amtNum > 0 && (
        <RouteDetails
          mode="swap" fromToken={fromToken} toToken={toToken}
          fee={`~$${fee.toFixed(3)}`} impact="<0.01%"
          minReceived={`${(amtOut * 0.995).toFixed(6)} ${toToken}`}
          estimatedTime="~15 seconds"
        />
      )}

      <button
        onClick={handleSwap}
        disabled={isConnected && (!amount || loading)}
        className={isConnected && amount && !loading ? 'btn-primary' : 'btn-ghost'}
        style={{ marginTop: 12 }}>
        {loading && <span className="w-4 h-4 border-2 border-white/25 border-t-white rounded-full animate-spin inline-block" />}
        {btnLabel}
      </button>
    </div>
  )
}