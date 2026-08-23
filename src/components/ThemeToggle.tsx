'use client'

import { useEffect, useState } from 'react'
import { motion, useMotionValue, useTransform, PanInfo, animate } from 'framer-motion'

type ThemeType = 'theme-light' | 'theme-sepia' | 'theme-dark' | 'theme-oled' | 'theme-midnight'

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false)
  const [theme, setTheme] = useState<ThemeType>('theme-light')

  // Motion values to dynamically track pull distance in 2D
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  // Connect string line SVG endpoints to motion values
  // Base is at (20, 3) in the 40px wide SVG. At rest, knob centers at (20, 24).
  const x2 = useTransform(x, (latest) => 20 + latest)
  const y2 = useTransform(y, (latest) => 24 + latest)

  const darkThemes: ThemeType[] = ['theme-dark', 'theme-oled', 'theme-midnight']
  const allThemes: ThemeType[] = ['theme-light', 'theme-sepia', 'theme-dark', 'theme-oled', 'theme-midnight']

  useEffect(() => {
    setMounted(true)
    const activeTheme = (localStorage.getItem('theme') || 'theme-light') as ThemeType
    setTheme(activeTheme)

    // Sync theme if changed from another component (like settings page swatches)
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
      // Toggle from dark to preferred light theme
      nextTheme = (localStorage.getItem('pref-light-theme') || 'theme-light') as ThemeType
    } else {
      // Toggle from light to preferred dark theme
      nextTheme = (localStorage.getItem('pref-dark-theme') || 'theme-dark') as ThemeType
    }

    const root = window.document.documentElement
    
    // Remove all existing theme classes
    allThemes.forEach((t) => root.classList.remove(t))
    
    // Apply new theme class
    root.classList.add(nextTheme)
    
    // Toggle Tailwind dark mode state
    if (darkThemes.includes(nextTheme)) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }

    localStorage.setItem('theme', nextTheme)
    setTheme(nextTheme)

    // Dispatch global event so Settings swatches update immediately
    window.dispatchEvent(new Event('theme-change'))
  }

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    // If user dragged the cord past the 40px threshold downward, toggle the theme
    if (info.offset.y > 40) {
      toggleTheme()
    }

    // Snaps Y back with an overshooting spring (low damping, high stiffness)
    animate(y, 0, { type: 'spring', stiffness: 350, damping: 8 })

    // Wobble X (pendulum wobble) side to side decaying to 0
    // If the horizontal offset is too small, give it an organic push to toggle oscillation
    const dragX = info.offset.x
    const wobbleStart = Math.abs(dragX) > 3 ? dragX : (Math.random() > 0.5 ? 12 : -12)
    
    x.set(wobbleStart)
    animate(x, 0, { type: 'spring', stiffness: 100, damping: 4 })
  }

  if (!mounted) {
    return (
      <div className="relative flex flex-col items-center select-none w-10 h-20 pt-1">
        <div className="w-2.5 h-1 bg-slate-300 dark:bg-slate-700 rounded-sm" />
        <div className="w-[1.5px] h-6 bg-slate-300 dark:bg-slate-700" />
        <div className="w-4 h-6 bg-slate-200 dark:bg-slate-800 rounded-b-full rounded-t-sm" />
      </div>
    )
  }

  return (
    <div className="relative flex flex-col items-center select-none w-10 h-20 pt-1" style={{ touchAction: 'none' }}>
      {/* Absolute SVG for drawing the elastic cord line */}
      <svg className="w-10 h-28 absolute top-0 pointer-events-none text-warmborder dark:text-white/10" viewBox="0 0 40 112">
        {/* Base bracket mount */}
        <rect x="15" y="0" width="10" height="3" rx="1" className="fill-slate-400 dark:fill-slate-600" />
        {/* Elastic line */}
        <motion.line
          x1="20"
          y1="3"
          x2={x2}
          y2={y2}
          stroke="currentColor"
          strokeWidth="1.5"
          className="stroke-slate-400 dark:stroke-slate-500"
        />
      </svg>

      {/* Teardrop metal pull knob */}
      <motion.div
        drag="y"
        dragConstraints={{ top: 0, bottom: 80 }}
        dragElastic={{ top: 0.05, bottom: 0.6 }}
        dragSnapToOrigin
        style={{ y, x }}
        onDragEnd={handleDragEnd}
        className="absolute top-6 left-[20px] -translate-x-1/2 w-4.5 h-6.5 bg-indigo-600 dark:bg-indigo-500 rounded-b-full rounded-t-sm shadow-md cursor-grab active:cursor-grabbing flex items-center justify-center border border-indigo-700/10 dark:border-indigo-400/20 hover:brightness-110 active:scale-95 transition-all"
        title="Pull down to toggle theme"
      >
        {/* Inner loop highlight detail */}
        <div className="w-1.5 h-2.5 bg-white/40 dark:bg-black/30 rounded-full animate-pulse" />
      </motion.div>
    </div>
  )
}
