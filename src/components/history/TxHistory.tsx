import { CheckCircle } from 'lucide-react'
import type { TxRecord } from '../../types'

interface Props { txs: TxRecord[]; onClear: () => void }

export function TxHistory({ txs, onClear }: Props) {
  return (
    <div className="rounded-3xl border overflow-hidden" style={{ background:'var(--surface)', borderColor:'var(--border2)' }}>
      <div className="flex items-center justify-between px-4 py-3.5 border-b" style={{ borderColor:'var(--border)' }}>
        <span className="text-sm font-black" style={{ color:'var(--text)' }}>Transactions</span>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full border"
            style={{ color:'var(--text2)', background:'var(--surface2)', borderColor:'var(--border)', fontFamily:'JetBrains Mono,monospace' }}>
            {txs.length} txns
          </span>
          <button onClick={onClear} className="text-xs font-semibold px-2 py-1 rounded"
            style={{ color:'var(--text2)', fontFamily:'Sora,sans-serif' }}>Clear</button>
        </div>
      </div>
      <div style={{ maxHeight:300, overflowY:'auto' }}>
        {txs.length === 0 ? (
          <div className="py-10 text-center text-sm" style={{ color:'var(--text3)' }}>
            <div className="text-3xl mb-2 opacity-40">⟳</div>
            Your transactions will appear here
          </div>
        ) : txs.map(tx => (
          <div key={tx.id} className="flex items-center gap-3 px-4 py-3 border-b" style={{ borderColor:'var(--border)' }}>
            <div className="w-10 h-10 rounded-xl border flex items-center justify-center text-lg flex-shrink-0"
              style={{ background:'var(--input)', borderColor:'var(--border)' }}>
              {tx.type === 'bridge' ? '🌉' : '⇄'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-bold truncate" style={{ color:'var(--text)' }}>
                {tx.type === 'swap' ? `Swap ${tx.fromToken} → ${tx.toToken}` : `Bridge ${tx.fromToken} · ${tx.fromChain} → ${tx.toChain}`}
              </div>
              <div className="flex gap-2 mt-0.5 text-[10px]" style={{ color:'var(--text3)', fontFamily:'JetBrains Mono,monospace' }}>
                <span>{tx.timestamp.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})}</span>
                <span style={{ color:'var(--blue2)', cursor:'pointer' }}>{tx.hash}</span>
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="text-[10px] mb-1" style={{ color:'var(--text3)', fontFamily:'JetBrains Mono,monospace' }}>-{tx.amount} {tx.fromToken}</div>
              <div className="text-[13px] font-bold mb-1" style={{ color:'var(--green)' }}>+{tx.amountOut.toFixed(4)} {tx.toToken}</div>
              <div className="flex items-center justify-end gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full"
                style={{ background:'var(--green-dim)', color:'var(--green)' }}>
                <CheckCircle size={9} /> confirmed
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}