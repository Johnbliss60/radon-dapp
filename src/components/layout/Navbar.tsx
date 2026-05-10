import { ConnectButton } from '@rainbow-me/rainbowkit'
import { ThemeToggle } from '../ui/ThemeToggle'
import type { Mode } from '../../types'

interface Props { mode: Mode; onMode: (m: Mode) => void }

export function Navbar({ mode, onMode }: Props) {
  return (
    <nav className="sticky top-0 z-50 flex items-center gap-2 px-4 md:px-6"
      style={{ height:62, background:'var(--nav-bg)', borderBottom:'1px solid var(--border)', backdropFilter:'blur(20px)' }}>
      <a href="/" className="flex items-center gap-2 no-underline flex-shrink-0">
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
          <defs>
            <linearGradient id="rg" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#5A84FF"/>
              <stop offset="100%" stopColor="#3D6FFF"/>
            </linearGradient>
          </defs>
          <rect width="36" height="36" rx="10" fill="url(#rg)"/>
          <path d="M11 9h8.5a5 5 0 0 1 0 10H11V9Z" fill="white" opacity="0.95"/>
          <path d="M11 19h5l5.5 8H17L11 19Z" fill="white" opacity="0.95"/>
          <rect x="11" y="9" width="2.5" height="18" rx="1.25" fill="white"/>
        </svg>
        <div className="flex flex-col leading-none">
          <span className="font-black tracking-tight"
            style={{ fontSize:17, color:'var(--text)', fontFamily:'Sora,sans-serif' }}>Radon</span>
          <span className="uppercase tracking-widest"
            style={{ fontSize:9, color:'var(--blue2)', marginTop:2, fontFamily:'JetBrains Mono,monospace' }}>Cross-Chain Bridge</span>
        </div>
      </a>
      <div className="hidden md:flex gap-1 ml-4">
        {(['swap','bridge'] as Mode[]).map(m => (
          <button key={m} onClick={() => onMode(m)}
            className="px-3 py-1.5 rounded-lg text-sm font-semibold capitalize transition-all"
            style={{ background: mode===m ? 'var(--surface2)' : 'none', color: mode===m ? 'var(--text)' : 'var(--text2)', fontFamily:'Sora,sans-serif' }}>
            {m}
          </button>
        ))}
      </div>
      <div className="ml-auto flex items-center gap-2">
        <ThemeToggle />
        <ConnectButton chainStatus="icon" showBalance={false} />
      </div>
    </nav>
  )
}