"use client"

import { useState } from "react"
import { Slider } from "@/components/ui/slider"

interface TVLRangeFilterProps {
  minTVL: number
  maxTVL: number
  onRangeChange: (min: number, max: number) => void
  className?: string
}

export function TVLRangeFilter({ minTVL, maxTVL, onRangeChange, className = "" }: TVLRangeFilterProps) {
  const [range, setRange] = useState([minTVL, maxTVL || 1000000000])

  const formatTVL = (value: number) => {
    if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`
    if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`
    if (value >= 1e3) return `$${(value / 1e3).toFixed(1)}K`
    return `$${value}`
  }

  const handleRangeChange = (newRange: number[]) => {
    setRange(newRange)
    onRangeChange(newRange[0], newRange[1] === 1000000000 ? 0 : newRange[1])
  }

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-3">
        <label className="text-gray-400 text-sm font-medium">TVL Range</label>
        <div className="text-xs text-gray-500">
          {formatTVL(range[0])} - {range[1] === 1000000000 ? "∞" : formatTVL(range[1])}
        </div>
      </div>

      <Slider
        value={range}
        onValueChange={handleRangeChange}
        max={1000000000}
        min={0}
        step={1000000}
        className="w-full mb-2"
      />

      <div className="flex justify-between text-xs text-gray-500">
        <span>$0</span>
        <span>$1B+</span>
      </div>
    </div>
  )
}
