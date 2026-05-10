import { useTheme } from '../../context/ThemeContext'
import { Sun, Moon } from 'lucide-react'

export function ThemeToggle() {
  const { theme, toggle } = useTheme()
  return (
    <button onClick={toggle}
      className="w-9 h-9 rounded-xl border flex items-center justify-center transition-all"
      style={{ background:'var(--surface)', borderColor:'var(--border2)', color:'var(--text2)' }}>
      {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
    </button>
  )
}