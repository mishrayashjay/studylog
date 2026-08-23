'use client'

import { useEffect, useState } from 'react'
import { Sun, Moon } from 'lucide-react'

type ThemeType = 'theme-light' | 'theme-sepia' | 'theme-dark' | 'theme-oled' | 'theme-midnight'

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false)
  const [theme, setTheme] = useState<ThemeType>('theme-light')

  const darkThemes: ThemeType[] = ['theme-dark', 'theme-oled', 'theme-midnight']
  const allThemes: ThemeType[] = ['theme-light', 'theme-sepia', 'theme-dark', 'theme-oled', 'theme-midnight']

  useEffect(() => {
    setMounted(true)
    const activeTheme = (localStorage.getItem('theme') || 'theme-light') as ThemeType
    setTheme(activeTheme)

    const handleThemeChange = () => {
      const current = (localStorage.getItem('theme') || 'theme-light') as ThemeType
      setTheme(current)
    }

    window.addEventListener('theme-change', handleThemeChange)
    return () => window.removeEventListener('theme-change', handleThemeChange)
  }, [])

  const toggleTheme = () => {
    const isCurrentDark = darkThemes.includes(theme)
    let nextTheme: ThemeType

    if (isCurrentDark) {
      nextTheme = (localStorage.getItem('pref-light-theme') || 'theme-light') as ThemeType
    } else {
      nextTheme = (localStorage.getItem('pref-dark-theme') || 'theme-dark') as ThemeType
    }

    const root = window.document.documentElement
    allThemes.forEach((t) => root.classList.remove(t))
    root.classList.add(nextTheme)

    if (darkThemes.includes(nextTheme)) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }

    localStorage.setItem('theme', nextTheme)
    setTheme(nextTheme)

    window.dispatchEvent(new Event('theme-change'))
  }

  if (!mounted) {
    return (
      <div className="w-8 h-8 rounded-full bg-warmbg dark:bg-white/5 border border-warmborder dark:border-white/10 flex items-center justify-center animate-pulse" />
    )
  }

  const isDark = darkThemes.includes(theme)

  return (
    <button
      onClick={toggleTheme}
      className="p-2 bg-[#FDFCFB] hover:bg-warmbg dark:bg-white/5 dark:hover:bg-white/10 border border-warmborder dark:border-white/10 rounded-full text-warmtext/60 dark:text-darktext/60 hover:text-warmtext dark:hover:text-darktext transition-colors flex items-center justify-center shadow-xs"
      title="Toggle theme mode"
    >
      {isDark ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
    </button>
  )
}
