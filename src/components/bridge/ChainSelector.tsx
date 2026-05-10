import { BRIDGE_CHAINS } from '../../config/chains'

interface Props { label: string; value: string; onChange: (v: string) => void }

export function ChainSelector({ label, value, onChange }: Props) {
  const chain = BRIDGE_CHAINS.find(c => c.id === value)
  return (
    <div className="flex items-center gap-2 mt-3 pt-3 border-t" style={{ borderColor:'var(--border)' }}>
      <span className="text-[9px] font-bold uppercase tracking-widest flex-shrink-0"
        style={{ color:'var(--text3)', fontFamily:'JetBrains Mono,monospace' }}>{label}</span>
      <div className="relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border cursor-pointer"
        style={{ background:'var(--surface)', borderColor:'var(--border2)', minHeight:30 }}>
        <div className="w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-black text-white flex-shrink-0"
          style={{ background: chain?.color }}>{chain?.icon}</div>
        <span className="text-[11px] font-semibold" style={{ color:'var(--text)', fontFamily:'JetBrains Mono,monospace' }}>{chain?.label}</span>
        <select className="absolute inset-0 opacity-0 cursor-pointer w-full" style={{ fontSize:16 }}
          value={value} onChange={e => onChange(e.target.value)}>
          {BRIDGE_CHAINS.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
        </select>
      </div>
    </div>
  )
}