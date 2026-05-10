import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

interface Props {
  mode: 'swap'|'bridge'; fromToken: string; toToken: string
  fee: string; impact: string; minReceived: string
  estimatedTime?: string; fromChain?: string; toChain?: string
}

export function RouteDetails({ mode, fromToken, toToken, fee, impact, minReceived, estimatedTime, fromChain, toChain }: Props) {
  const [open, setOpen] = useState(false)
  return (
    <div className="rounded-2xl border overflow-hidden mt-3" style={{ background:'var(--input)', borderColor:'var(--border)' }}>
      <button onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-2.5">
        <span className="text-xs font-medium" style={{ color:'var(--text2)', fontFamily:'JetBrains Mono,monospace' }}>
          1 {fromToken} = 1.0000 {toToken}
        </span>
        <div className="flex items-center gap-2">
          <span className="text-[10px] px-2 py-0.5 rounded-full border"
            style={{ color:'var(--text2)', background:'var(--surface)', borderColor:'var(--border2)' }}>{fee}</span>
          <ChevronDown size={12} style={{ color:'var(--text3)', transform: open?'rotate(180deg)':'none', transition:'transform 0.2s' }} />
        </div>
      </button>
      {open && (
        <div className="border-t" style={{ borderColor:'var(--border)' }}>
          {[
            { k:'Route',         v: mode==='swap' ? `${fromToken} → ${toToken} (App Kits)` : `${fromChain} → ${toChain} (CCTP)` },
            { k:'Price impact',  v: impact },
            { k:'Network fee',   v: fee },
            { k:'Min. received', v: minReceived },
            ...(estimatedTime ? [{ k:'Est. time', v: estimatedTime }] : []),
          ].map(({ k, v }) => (
            <div key={k} className="flex justify-between items-center px-4 py-2.5 border-b text-[13px]"
              style={{ borderColor:'var(--border)' }}>
              <span style={{ color:'var(--text2)', fontWeight:500 }}>{k}</span>
              <span style={{ color:'var(--text)', fontWeight:700 }}>{v}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}