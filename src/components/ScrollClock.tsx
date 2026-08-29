'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

export default function ScrollClock() {
  const containerRef = useRef<HTMLDivElement>(null)
  
  // Track scroll progress of this specific component within the viewport
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  })

  // Map scroll progress to clock hands rotation:
  // Minute hand rotates 4 complete circles (1440 degrees) as we scroll past the clock
  const minuteRotate = useTransform(scrollYProgress, [0, 1], [0, 1440])
  // Hour hand rotates 1 complete circle (360 degrees)
  const hourRotate = useTransform(scrollYProgress, [0, 1], [0, 120])

  // Map scroll progress to subtle 3D tilt rotations for depth
  const rotateX = useTransform(scrollYProgress, [0, 1], [-12, 12])
  const rotateY = useTransform(scrollYProgress, [0, 1], [-8, 8])

  return (
    <div
      ref={containerRef}
      className="mt-24 mb-16 flex flex-col items-center justify-center relative py-12 w-full select-none"
    >
      {/* Dynamic Background Glow */}
      <div className="absolute w-[250px] h-[250px] rounded-full bg-indigo-500/5 dark:bg-indigo-500/5 blur-[80px] pointer-events-none -z-10" />

      {/* Intro Subtitle */}
      <div className="text-center mb-10 shrink-0 z-10 max-w-sm px-6">
        <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
          Time Visualization
        </span>
        <h2 className="font-bold text-xl sm:text-2xl text-warmtext dark:text-darktext mt-1.5 font-display">
          Watch Time Work For You
        </h2>
        <p className="text-xs text-warmtext/50 dark:text-darktext/50 mt-2 leading-relaxed">
          Scroll down to see how study hours convert into streaks. studylog transforms spent time into tangible milestones.
        </p>
      </div>

      {/* 3D Clock viewport */}
      <div className="perspective-[1000px] w-60 h-60 sm:w-68 sm:h-68 relative flex items-center justify-center z-10">
        <motion.div
          style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
          className="w-full h-full rounded-full bg-gradient-to-br from-[#FAF7F2] to-[#E6DFD5] dark:from-[#201D1B] dark:to-[#1C1A18] border border-warmborder dark:border-white/10 shadow-[0_20px_50px_-12px_rgba(99,102,241,0.15)] dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.6)] flex items-center justify-center relative"
        >
          {/* Inner ring inset for depth shadow */}
          <div className="absolute inset-4 rounded-full border border-warmborder/30 dark:border-white/5 bg-transparent shadow-[inset_0_2px_8px_rgba(0,0,0,0.03)] dark:shadow-[inset_0_2px_8px_rgba(0,0,0,0.4)]" />

          {/* Clock Face ticks */}
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = (i * 30 * Math.PI) / 180
            const x = Math.sin(angle) * 98
            const y = -Math.cos(angle) * 98
            const isQuarter = i % 3 === 0

            return (
              <div
                key={i}
                style={{
                  transform: `translate(${x}px, ${y}px) rotate(${i * 30}deg)`,
                  transformOrigin: 'center center',
                }}
                className={`absolute w-1 rounded-full ${
                  isQuarter
                    ? 'h-3 bg-indigo-600 dark:bg-indigo-400'
                    : 'h-1.5 bg-warmtext/20 dark:bg-white/10'
                }`}
              />
            )
          })}

          {/* Center Pin */}
          <div className="absolute w-3.5 h-3.5 rounded-full bg-indigo-600 dark:bg-indigo-500 shadow-md z-30 border border-white/20" />

          {/* Minute Hand (faster) */}
          <motion.div
            style={{ rotate: minuteRotate, transformOrigin: 'bottom center' }}
            className="absolute bottom-1/2 left-[calc(50%-1.5px)] w-[3px] h-[82px] bg-indigo-600 dark:bg-indigo-400 rounded-full z-20 shadow-sm"
          />

          {/* Hour Hand (slower) */}
          <motion.div
            style={{ rotate: hourRotate, transformOrigin: 'bottom center' }}
            className="absolute bottom-1/2 left-[calc(50%-2.5px)] w-[5px] h-[58px] bg-purple-600 dark:bg-purple-400 rounded-full z-10 shadow-sm"
          />
        </motion.div>
      </div>
    </div>
  )
}
