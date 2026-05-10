import { TOKENS } from '../../config/tokens'

interface Props {
  label: string; token: string; amount: string; usdValue: string
  balance?: string; readonly?: boolean; allowedTokens?: string[]
  onChange?: (v: string) => void; onToken?: (t: string) => void; onMax?: () => void
}

export function TokenInput({ label, token, amount, usdValue, balance, readonly, allowedTokens, onChange, onToken, onMax }: Props) {
  const t = TOKENS[token]
  const tokenList = allowedTokens ?? Object.keys(TOKENS)

  return (
    <div className="tok-box">
      <div className="flex justify-between items-center mb-2.5 text-xs" style={{ color:'var(--text3)' }}>
        <span>{label}</span>
        {balance !== undefined
          ? <button onClick={onMax} className="text-[10px] font-bold px-2 py-0.5 rounded"
              style={{ background:'var(--blue-dim)', color:'var(--blue2)', border:'1px solid var(--blue-ring)', fontFamily:'JetBrains Mono,monospace' }}>
              Balance: {balance} &nbsp;MAX
            </button>
          : <span style={{ fontFamily:'JetBrains Mono,monospace' }}>Balance: —</span>
        }
      </div>
      <div className="flex items-center gap-2.5">
        <div className="relative flex items-center gap-2 px-2.5 py-2 rounded-xl border cursor-pointer flex-shrink-0"
          style={{ background:'var(--surface)', borderColor:'var(--border2)', minHeight:46 }}>
          <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black text-white flex-shrink-0"
            style={{ background: t?.color }}>{t?.letter}</div>
          <span className="text-[15px] font-black" style={{ color:'var(--text)' }}>{token}</span>
          <span className="text-[10px]" style={{ color:'var(--text3)' }}>▾</span>
          <select className="absolute inset-0 opacity-0 cursor-pointer w-full" style={{ fontSize:16 }}
            value={token} onChange={e => onToken?.(e.target.value)}>
            {tokenList.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <input type="number"
          className="flex-1 min-w-0 bg-transparent border-none outline-none text-right font-black"
          style={{ fontSize:'clamp(20px,5vw,28px)', color: readonly ? 'var(--text3)' : 'var(--text)', fontFamily:'Sora,sans-serif' }}
          placeholder="0.00" value={amount} readOnly={readonly} inputMode="decimal"
          onChange={e => onChange?.(e.target.value)} />
      </div>
      <div className="flex justify-end mt-2 text-xs" style={{ color:'var(--text3)', fontFamily:'JetBrains Mono,monospace' }}>
        ≈ {usdValue}
      </div>
    </div>
  )
}