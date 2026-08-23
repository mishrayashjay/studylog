'use client'

import { useRef, useState } from 'react'

interface CircularTimePickerProps {
  value: number // in minutes
  onChange: (value: number) => void
  maxMinutes?: number // defaults to 120
}

export default function CircularTimePicker({
  value,
  onChange,
  maxMinutes = 120,
}: CircularTimePickerProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  // Circular math parameters
  const cx = 100
  const cy = 100
  const r = 72
  const strokeWidth = 8
  const circumference = 2 * Math.PI * r // ~452.39

  // Value percentage (0 to 1)
  const percentage = Math.min(Math.max(value / maxMinutes, 0), 1)
  const strokeDashoffset = circumference - percentage * circumference

  // Straight up (12 o'clock) is -90 degrees (-Math.PI/2 radians)
  const angleRad = percentage * 2 * Math.PI - Math.PI / 2
  const kx = cx + r * Math.cos(angleRad)
  const ky = cy + r * Math.sin(angleRad)

  const updateValueFromPointer = (clientX: number, clientY: number) => {
    if (!svgRef.current) return

    const rect = svgRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    const vx = clientX - centerX
    const vy = clientY - centerY

    // Angle in radians (-Math.PI to Math.PI)
    const angle = Math.atan2(vy, vx)

    // Shift coordinate space so 12 o'clock (-Math.PI/2) is 0 radians
    let shiftedAngle = angle + Math.PI / 2
    if (shiftedAngle < 0) {
      shiftedAngle += 2 * Math.PI
    }

    // Convert angle to minutes
    const rawMins = (shiftedAngle / (2 * Math.PI)) * maxMinutes
    
    // Snap to 5-minute increments
    let snappedMins = Math.round(rawMins / 5) * 5

    // Clamp between 5 minutes (minimum study block) and maxMinutes (120)
    snappedMins = Math.min(Math.max(snappedMins, 5), maxMinutes)
    onChange(snappedMins)
  }

  const handlePointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    e.preventDefault()
    svgRef.current?.setPointerCapture(e.pointerId)
    setIsDragging(true)
    updateValueFromPointer(e.clientX, e.clientY)
  }

  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!isDragging) return
    updateValueFromPointer(e.clientX, e.clientY)
  }

  const handlePointerUp = (e: React.PointerEvent<SVGSVGElement>) => {
    if (isDragging) {
      svgRef.current?.releasePointerCapture(e.pointerId)
      setIsDragging(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center p-2.5">
      <div className="relative w-52 h-52">
        <svg
          ref={svgRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          className={`w-full h-full select-none cursor-pointer overflow-visible ${
            isDragging ? 'grabbing' : 'grab'
          }`}
          viewBox="0 0 200 200"
          style={{ touchAction: 'none' }}
        >
          {/* Background Outer Ring Track (Muted Gray/Sepia border) */}
          <circle
            cx={cx}
            cy={cy}
            r={r}
            strokeWidth={strokeWidth}
            className="stroke-warmborder/50 dark:stroke-white/5 fill-transparent transition-colors duration-300"
          />

          {/* Indigo Progress Arc */}
          <circle
            cx={cx}
            cy={cy}
            r={r}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="stroke-indigo-600 dark:stroke-indigo-500 fill-transparent transition-all duration-75"
            transform="rotate(-90 100 100)"
          />

          {/* Draggable Knob Handle */}
          <circle
            cx={kx}
            cy={ky}
            r={10}
            className="fill-indigo-600 dark:fill-indigo-400 stroke-[#FDFCFB] dark:stroke-darkbg stroke-2 shadow-md"
          />
        </svg>

        {/* Center Text displaying Selected Duration */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
          <span className="text-2xl font-black tracking-tight text-warmtext dark:text-darktext tabular-nums">
            {value}
          </span>
          <span className="text-[10px] font-bold text-warmtext/40 dark:text-darktext/40 uppercase tracking-widest mt-0.5">
            Minutes
          </span>
        </div>
      </div>
    </div>
  )
}
