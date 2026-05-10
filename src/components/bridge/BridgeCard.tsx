import { useState } from 'react'
import { ArrowUpDown, Info } from 'lucide-react'
import { useAccount } from 'wagmi'
import { useBridge } from '../../hooks/useBridge'
import { ChainSelector } from './ChainSelector'
import { RouteDetails } from '../swap/RouteDetails'
import { BRIDGE_CHAINS } from '../../config/chains'
import type { TxRecord } from '../../types'

interface Props { onTx: (tx: Omit<TxRecord,'id'|'timestamp'>) => void }

export function BridgeCard({ onTx }: Props) {
  const { isConnected } = useAccount()
  const { bridge, loading } = useBridge()
  const [fromChain, setFromChain] = useState('Ethereum_Sepolia')
  const [toChain,   setToChain]   = useState('Arc_Testnet')
  const [amount,    setAmount]    = useState('')

  const amtNum = parseFloat(amount) || 0
  const fromLabel = BRIDGE_CHAINS.find(c => c.id === fromChain)?.label || fromChain
  const toLabel   = BRIDGE_CHAINS.find(c => c.id === toChain)?.label   || toChain

  async function handleBridge() {
    if (!amount || !isConnected) return
    try {
      await bridge({ fromChain, toChain, amount })
      onTx({ type:'bridge', fromToken:'USDC', toToken:'USDC', amount: amtNum, amountOut: amtNum, hash:'0x'+Math.random().toString(16).slice(2,10)+'…', status:'confirmed', fromChain: fromLabel, toChain: toLabel })
      setAmount('')
    } catch {}
  }

  const btnLabel = !isConnected ? 'Connect Wallet' : !amount ? 'Enter an amount' : loading ? 'Bridging…' : 'Bridge USDC'

  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-[15px] font-black" style={{ color:'var(--text)' }}>Bridge</span>
        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest"
          style={{ background:'var(--blue-dim)', color:'var(--blue2)', border:'1px solid var(--blue-ring)', fontFamily:'JetBrains Mono,monospace' }}>CCTP</span>
      </div>

      <div className="tok-box">
        <div className="flex justify-between items-center mb-2.5 text-xs" style={{ color:'var(--text3)' }}>
          <span>You pay</span>
          {isConnected && (
            <button onClick={() => setAmount('250')}
              className="text-[10px] font-bold px-2 py-0.5 rounded"
              style={{ background:'var(--blue-dim)', color:'var(--blue2)', border:'1px solid var(--blue-ring)', fontFamily:'JetBrains Mono,monospace' }}>
              Balance: 250.00 &nbsp;MAX
            </button>
          )}
        </div>
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-2 px-2.5 py-2 rounded-xl border flex-shrink-0"
            style={{ background:'var(--surface)', borderColor:'var(--border2)', minHeight:46 }}>
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black text-white" style={{ background:'#2775ca' }}>U</div>
            <span className="text-[15px] font-black" style={{ color:'var(--text)' }}>USDC</span>
          </div>
          <input type="number" className="flex-1 min-w-0 bg-transparent border-none outline-none text-right font-black"
            style={{ fontSize:'clamp(20px,5vw,28px)', color:'var(--text)', fontFamily:'Sora,sans-serif' }}
            placeholder="0.00" value={amount} inputMode="decimal" onChange={e => setAmount(e.target.value)} />
        </div>
        <div className="flex justify-end mt-2 text-xs" style={{ color:'var(--text3)', fontFamily:'JetBrains Mono,monospace' }}>≈ ${amtNum.toFixed(2)}</div>
        <ChainSelector label="FROM" value={fromChain} onChange={setFromChain} />
      </div>

      <div className="flex justify-center my-1">
        <div className="w-10 h-10 rounded-xl border flex items-center justify-center"
          style={{ background:'var(--surface)', borderColor:'var(--border2)', color:'var(--text2)' }}>
          <ArrowUpDown size={18} />
        </div>
      </div>

      <div className="tok-box">
        <div className="flex justify-between items-center mb-2.5 text-xs" style={{ color:'var(--text3)' }}>
          <span>You receive</span>
          <span style={{ fontFamily:'JetBrains Mono,monospace' }}>Balance: —</span>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-2 px-2.5 py-2 rounded-xl border flex-shrink-0"
            style={{ background:'var(--surface)', borderColor:'var(--border2)', minHeight:46 }}>
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black text-white" style={{ background:'#2775ca' }}>U</div>
            <span className="text-[15px] font-black" style={{ color:'var(--text)' }}>USDC</span>
          </div>
          <input type="number" readOnly className="flex-1 min-w-0 bg-transparent border-none outline-none text-right font-black"
            style={{ fontSize:'clamp(20px,5vw,28px)', color:'var(--text3)', fontFamily:'Sora,sans-serif', opacity:.55 }}
            placeholder="0.00" value={amtNum > 0 ? amtNum.toFixed(6) : ''} />
        </div>
        <div className="flex justify-end mt-2 text-xs" style={{ color:'var(--text3)', fontFamily:'JetBrains Mono,monospace' }}>≈ ${amtNum.toFixed(2)}</div>
        <ChainSelector label="TO" value={toChain} onChange={setToChain} />
      </div>

      {amtNum > 0 && (
        <RouteDetails mode="bridge" fromToken="USDC" toToken="USDC"
          fee="~$2.20" impact="~0.00%"
          minReceived={`${amtNum.toFixed(6)} USDC`}
          estimatedTime="~2–5 minutes"
          fromChain={fromLabel} toChain={toLabel} />
      )}

      <div className="flex gap-2 items-start p-3 rounded-xl mt-3 text-[12px] font-medium leading-relaxed"
        style={{ background:'var(--blue-dim)', border:'1px solid var(--blue-ring)', color:'#A5B4FC' }}>
        <Info size={14} className="flex-shrink-0 mt-0.5" />
        <span>Uses Circle's CCTP — USDC burned on source, minted natively on destination. No wrapped tokens.</span>
      </div>

      <button onClick={handleBridge}
        disabled={isConnected && (!amount || loading)}
        className={isConnected && amount && !loading ? 'btn-primary' : 'btn-ghost'}
        style={{ marginTop:12 }}>
        {loading && <span className="w-4 h-4 border-2 border-white/25 border-t-white rounded-full animate-spin inline-block" />}
        {btnLabel}
      </button>
    </div>
  )
}