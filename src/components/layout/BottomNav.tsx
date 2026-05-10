import { ArrowLeftRight, Landmark, History, Sun, Moon } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'
import type { Mode } from '../../types'

interface Props { mode: Mode; onMode: (m: Mode) => void; onHistory: () => void }

export function BottomNav({ mode, onMode, onHistory }: Props) {
  const { theme, toggle } = useTheme()
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 grid grid-cols-4 md:hidden"
      style={{ background:'var(--nav-bg)', borderTop:'1px solid var(--border)', backdropFilter:'blur(20px)', paddingBottom:'env(safe-area-inset-bottom,0px)' }}>
      {[
        { key:'swap',    label:'Swap',    Icon: ArrowLeftRight },
        { key:'bridge',  label:'Bridge',  Icon: Landmark },
        { key:'history', label:'History', Icon: History },
      ].map(({ key, label, Icon }) => (
        <button key={key}
          onClick={() => key === 'history' ? onHistory() : onMode(key as Mode)}
          className="flex flex-col items-center justify-center gap-1 py-2 min-h-[52px] text-[10px] font-semibold"
          style={{ color: mode===key ? 'var(--blue)' : 'var(--text3)', fontFamily:'Sora,sans-serif' }}>
          <Icon size={20} />
          {label}
        </button>
      ))}
      <button onClick={toggle}
        className="flex flex-col items-center justify-center gap-1 py-2 min-h-[52px] text-[10px] font-semibold"
        style={{ color:'var(--text3)', fontFamily:'Sora,sans-serif' }}>
        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        Theme
      </button>
    </nav>
  )
}