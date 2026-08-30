'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'

// Clock Geometry
const CX = 140
const CY = 140
const VB = 280

const HOUR_LENGTH = 46  // Short, bold
const MIN_LENGTH  = 78  // Longer, sleek
const SEC_LENGTH  = 94  // Longest, thin needle

const HOUR_WIDTH = 6
const MIN_WIDTH  = 3.5
const SEC_WIDTH  = 1.5

// Minor hour dots (1, 2, 4, 5, 7, 8, 10, 11) at radius 98
const MINOR_HOURS = [1, 2, 4, 5, 7, 8, 10, 11].map(h => {
  const a = (h * 30 - 90) * (Math.PI / 180)
  return {
    cx: CX + 98 * Math.cos(a),
    cy: CY + 98 * Math.sin(a),
  }
})

export default function ScrollClock() {
  const sectionRef = useRef<HTMLDivElement>(null)

  // ── Real-Time Clock State (Starts at standard 10:10:30 before hydration, then live ticks)
  const [angles, setAngles] = useState({
    hour: 305,
    minute: 60,
    second: 180,
  })

  useEffect(() => {
    let animId: number
    const updateClock = () => {
      const now = new Date()
      const ms = now.getMilliseconds()
      const s = now.getSeconds() + ms / 1000
      const m = now.getMinutes() + s / 60
      const h = (now.getHours() % 12) + m / 60

      setAngles({
        hour: h * 30,       // (h % 12) * 30 + m * 0.5 + s * (0.5/60)
        minute: m * 6,      // m * 6 + s * 0.1
        second: s * 6,      // 360° per 60s
      })

      animId = requestAnimationFrame(updateClock)
    }

    animId = requestAnimationFrame(updateClock)
    return () => cancelAnimationFrame(animId)
  }, [])

  // ── 3D Scroll Perspective / Tilt (Interactive depth on scroll)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  const smooth = useSpring(scrollYProgress, { stiffness: 80, damping: 25, restDelta: 0.0001 })
  const rotateX = useTransform(smooth, [0, 0.5, 1], [-8, 0, 8])
  const rotateY = useTransform(smooth, [0, 0.5, 1], [8, 0, -8])
  const clockScale = useTransform(smooth, [0, 0.5, 1], [0.96, 1.02, 0.96])
  const shadowX = useTransform(smooth, [0, 1], [-14, 14])
  const shadowY = useTransform(smooth, [0, 1], [-6, 18])
  const shadowBlur = useTransform(smooth, [0, 0.5, 1], [18, 36, 18])

  // ── Pure Trigonometric Coordinates for Real-Time Hands (Anchored at (140, 140))
  const hourX2 = CX + HOUR_LENGTH * Math.sin((angles.hour * Math.PI) / 180)
  const hourY2 = CY - HOUR_LENGTH * Math.cos((angles.hour * Math.PI) / 180)

  const minX2 = CX + MIN_LENGTH * Math.sin((angles.minute * Math.PI) / 180)
  const minY2 = CY - MIN_LENGTH * Math.cos((angles.minute * Math.PI) / 180)

  const secX2 = CX + SEC_LENGTH * Math.sin((angles.second * Math.PI) / 180)
  const secY2 = CY - SEC_LENGTH * Math.cos((angles.second * Math.PI) / 180)

  return (
    <section
      ref={sectionRef}
      className="relative w-full py-16 select-none"
    >
      {/* Centered content frame */}
      <div className="flex flex-col items-center justify-center overflow-hidden">

        {/* Ambient glow */}
        <div className="absolute w-[500px] h-[500px] rounded-full bg-indigo-600/[0.04] dark:bg-indigo-500/[0.03] blur-[140px] pointer-events-none" />

        {/* Header */}
        <div className="relative z-10 text-center mb-10 max-w-xl px-4">
          <span className="text-xs font-mono font-bold tracking-[0.25em] text-indigo-500 dark:text-indigo-400 uppercase">
            Time Visualization
          </span>
          <h2 className="mt-3 font-display font-black text-3xl sm:text-4xl text-warmtext dark:text-darktext tracking-tight">
            Watch Time Work For You
          </h2>
          <p className="mt-3 text-sm text-warmtext/65 dark:text-darktext/60 leading-relaxed">
            Scroll down to see how study hours convert into streaks. studylog transforms spent time into tangible milestones.
          </p>
        </div>

        {/* 3D Perspective Wrapper */}
        <div
          className="relative z-10"
          style={{
            perspective: '1200px',
            perspectiveOrigin: '50% 50%',
          }}
        >
          {/* Theme-Adaptive Shadow */}
          <motion.div
            style={{
              x: shadowX,
              y: shadowY,
              filter: useTransform(shadowBlur, b => `blur(${b}px)`),
            }}
            className="absolute inset-0 rounded-full bg-black/10 dark:bg-black/80 pointer-events-none -z-10 transition-colors duration-300"
          />

          {/* Theme-Adaptive Clock Face */}
          <motion.div
            style={{
              rotateX,
              rotateY,
              scale: clockScale,
              transformStyle: 'preserve-3d',
            }}
          >
            <svg
              viewBox={`0 0 ${VB} ${VB}`}
              width={290}
              height={290}
              className="overflow-visible"
            >
              <defs>
                {/* Dynamic Gradient for Hour Hand (aligned from center to tip) */}
                <linearGradient
                  id="hourGradTrig"
                  x1={CX}
                  y1={CY}
                  x2={hourX2}
                  y2={hourY2}
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0%" stopColor="#818cf8" />
                  <stop offset="100%" stopColor="#e879f9" />
                </linearGradient>

                {/* Dynamic Gradient for Minute Hand (aligned from center to tip) */}
                <linearGradient
                  id="minGradTrig"
                  x1={CX}
                  y1={CY}
                  x2={minX2}
                  y2={minY2}
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0%" stopColor="#818cf8" />
                  <stop offset="100%" stopColor="#60a5fa" />
                </linearGradient>
              </defs>

              {/* ── Outer Bezel (Light cream / Dark charcoal) ── */}
              <circle
                cx={CX}
                cy={CY}
                r={124}
                className="fill-[#EDEAE3] stroke-[#DCD7CD] dark:fill-[#232226] dark:stroke-[#2e2d32] transition-colors duration-300"
                strokeWidth={1.5}
                style={{ transform: 'translateZ(2px)' }}
              />

              {/* ── Circular Dial Face (Clean white/cream / Dark obsidian) ── */}
              <circle
                cx={CX}
                cy={CY}
                r={114}
                className="fill-[#FAF7F2] dark:fill-[#18181b] transition-colors duration-300"
                style={{ transform: 'translateZ(4px)' }}
              />

              {/* ── Tick Marks (4 Pill Markers + 8 Subtle Dots) ── */}
              <g style={{ transform: 'translateZ(6px)' }}>
                {/* 12 o'clock pill */}
                <line
                  x1={140} y1={36} x2={140} y2={46}
                  stroke="#818cf8" strokeWidth={3.5} strokeLinecap="round"
                />
                {/* 3 o'clock pill */}
                <line
                  x1={244} y1={140} x2={234} y2={140}
                  stroke="#818cf8" strokeWidth={3.5} strokeLinecap="round"
                />
                {/* 6 o'clock pill */}
                <line
                  x1={140} y1={244} x2={140} y2={234}
                  stroke="#818cf8" strokeWidth={3.5} strokeLinecap="round"
                />
                {/* 9 o'clock pill */}
                <line
                  x1={36} y1={140} x2={46} y2={140}
                  stroke="#818cf8" strokeWidth={3.5} strokeLinecap="round"
                />

                {/* Minor hour dots (1, 2, 4, 5, 7, 8, 10, 11) */}
                {MINOR_HOURS.map((pt, i) => (
                  <circle
                    key={i}
                    cx={pt.cx}
                    cy={pt.cy}
                    r={2}
                    className="fill-black/20 dark:fill-white/[0.18] transition-colors duration-300"
                  />
                ))}
              </g>

              {/* ── Real-Time Live Clock Hands (Anchored strictly at (140, 140)) ── */}
              <g style={{ transform: 'translateZ(10px)' }}>

                {/* 1. Real-Time Hour Hand */}
                <line
                  x1={CX}
                  y1={CY}
                  x2={hourX2}
                  y2={hourY2}
                  stroke="url(#hourGradTrig)"
                  strokeWidth={HOUR_WIDTH}
                  strokeLinecap="round"
                />

                {/* 2. Real-Time Minute Hand */}
                <line
                  x1={CX}
                  y1={CY}
                  x2={minX2}
                  y2={minY2}
                  stroke="url(#minGradTrig)"
                  strokeWidth={MIN_WIDTH}
                  strokeLinecap="round"
                />

                {/* 3. Real-Time Second Hand (Coral Red needle ticking / sweeping in real time) */}
                <line
                  x1={CX}
                  y1={CY}
                  x2={secX2}
                  y2={secY2}
                  stroke="#f43f5e"
                  strokeWidth={SEC_WIDTH}
                  strokeLinecap="round"
                />

                {/* 4. Center Pivot Pin (Solid filled periwinkle circle locked at (140, 140)) */}
                <circle
                  cx={CX}
                  cy={CY}
                  r={7.5}
                  fill="#818cf8"
                />
              </g>
            </svg>
          </motion.div>
        </div>

      </div>
    </section>
  )
}
