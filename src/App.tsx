import { useState, useRef } from 'react'
import { Toaster } from 'react-hot-toast'
import { Navbar } from './components/layout/Navbar'
import { BottomNav } from './components/layout/BottomNav'
import { SwapCard } from './components/swap/SwapCard'
import { BridgeCard } from './components/bridge/BridgeCard'
import { TxHistory } from './components/history/TxHistory'
import { useTxHistory } from './hooks/useTxHistory'
import type { Mode } from './types'

export default function App() {
  const [mode, setMode] = useState<Mode>('swap')
  const { txs, addTx, clearTxs } = useTxHistory()
  const histRef = useRef<HTMLDivElement>(null)

  return (
    <div className="min-h-screen flex flex-col" style={{ background:'var(--bg)' }}>
      <Navbar mode={mode} onMode={setMode} />
      <main className="flex-1 flex justify-center px-3 md:px-6 py-8 md:py-12 pb-24 md:pb-16 relative z-10">
        <div className="w-full max-w-[468px] flex flex-col gap-3">
          <div className="text-center pb-2">
            <h1 className="text-[22px] md:text-[28px] font-black tracking-tight mb-1">
              Bridge{' '}
              <span style={{ background:'linear-gradient(90deg,var(--blue),var(--blue2))', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
                &amp; Swap
              </span>
            </h1>
            <p className="text-[12px]" style={{ color:'var(--text2)' }}>
              Powered by Arc App Kits · CCTP-native cross-chain transfers
            </p>
          </div>

          <div className="flex gap-1 p-1 rounded-xl border" style={{ background:'var(--surface)', borderColor:'var(--border2)' }}>
            {(['swap','bridge'] as Mode[]).map(m => (
              <button key={m} onClick={() => setMode(m)}
                className="flex-1 py-2.5 rounded-lg text-sm font-bold capitalize transition-all flex items-center justify-center gap-2"
                style={{ background: mode===m ? 'var(--bg)' : 'none', color: mode===m ? 'var(--text)' : 'var(--text2)', fontFamily:'Sora,sans-serif', minHeight:44, boxShadow: mode===m ? '0 1px 8px rgba(0,0,0,0.3)' : 'none' }}>
                {m === 'swap' ? '⇄' : '🌉'} {m.charAt(0).toUpperCase()+m.slice(1)}
              </button>
            ))}
          </div>

          {mode === 'swap' ? <SwapCard onTx={addTx} /> : <BridgeCard onTx={addTx} />}

          <div ref={histRef}>
            <TxHistory txs={txs} onClear={clearTxs} />
          </div>
        </div>
      </main>
      <BottomNav mode={mode} onMode={setMode} onHistory={() => histRef.current?.scrollIntoView({ behavior:'smooth' })} />
      <Toaster position="top-center" toastOptions={{ style: { background:'var(--surface)', color:'var(--text)', border:'1px solid var(--border2)', fontFamily:'Sora,sans-serif', fontSize:13 } }} />
    </div>
  )
}