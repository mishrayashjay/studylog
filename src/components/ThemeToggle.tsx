'use client'

import { useEffect, useState } from 'react'
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion'

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  // Motion values to dynamically track pull distance
  const y = useMotionValue(0)
  // Dynamic string height starts at 24px and extends with drag displacement
  const stringHeight = useTransform(y, (latest) => 24 + latest)

  useEffect(() => {
    setMounted(true)
    const root = window.document.documentElement
    if (root.classList.contains('dark')) {
      setTheme('dark')
    } else {
      setTheme('light')
    }
  }, [])

  const toggleTheme = () => {
    const root = window.document.documentElement
    if (theme === 'light') {
      root.classList.add('dark')
      localStorage.setItem('theme', 'dark')
      setTheme('dark')
    } else {
      root.classList.remove('dark')
      localStorage.setItem('theme', 'light')
      setTheme('light')
    }
  }

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    // If user dragged the cord past the 40px threshold downward
    if (info.offset.y > 40) {
      toggleTheme()
    }
  }

  if (!mounted) {
    return (
      <div className="relative flex flex-col items-center select-none w-10 h-16">
        <div className="w-2.5 h-1 bg-slate-300 dark:bg-slate-700 rounded-sm animate-pulse" />
        <div className="w-[1.5px] h-6 bg-slate-300 dark:bg-slate-700 animate-pulse" />
        <div className="w-4 h-6 bg-slate-200 dark:bg-slate-800 rounded-b-full rounded-t-sm animate-pulse" />
      </div>
    )
  }

  return (
    <div className="relative flex flex-col items-center select-none w-10 h-20 pt-1" style={{ touchAction: 'none' }}>
      {/* Base metal bracket mount */}
      <div className="w-2.5 h-1 bg-slate-400 dark:bg-slate-600 rounded-sm shadow-sm" />

      {/* Elastic hanging string */}
      <motion.div
        style={{ height: stringHeight }}
        className="w-[1.5px] bg-slate-400 dark:bg-slate-500 origin-top shadow-sm"
      />

      {/* Teardrop metal pull knob */}
      <motion.div
        drag="y"
        dragConstraints={{ top: 0, bottom: 80 }}
        dragElastic={{ top: 0.05, bottom: 0.6 }}
        dragSnapToOrigin
        style={{ y }}
        onDragEnd={handleDragEnd}
        className="w-4.5 h-6.5 bg-indigo-600 dark:bg-indigo-500 rounded-b-full rounded-t-sm shadow-md cursor-grab active:cursor-grabbing flex items-center justify-center border border-indigo-700/10 dark:border-indigo-400/20 -mt-0.5 hover:brightness-110 active:scale-95 transition-all"
        title="Pull down to toggle theme"
      >
        {/* Metal insert loop detail */}
        <div className="w-1.5 h-2.5 bg-white/40 dark:bg-black/30 rounded-full" />
      </motion.div>
    </div>
  )
}
