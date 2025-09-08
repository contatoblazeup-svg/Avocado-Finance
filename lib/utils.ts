import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Pool } from "@/types/pool"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatCurrency = (value: number): string => {
  if (value >= 1e9) {
    return `$${(value / 1e9).toFixed(2)}B`
  } else if (value >= 1e6) {
    return `$${(value / 1e6).toFixed(2)}M`
  } else if (value >= 1e3) {
    return `$${(value / 1e3).toFixed(2)}K`
  }
  return `$${value.toFixed(2)}`
}

export const formatPercentage = (value: number): string => {
  return `${value.toFixed(2)}%`
}

export const calculateAPR = (pool: Pool): number => {
  if (!pool.poolDayData || pool.poolDayData.length === 0) return 0

  // Calculate 7-day average APR for more stability
  const recentDays = pool.poolDayData.slice(0, 7)
  const totalFees = recentDays.reduce((sum, day) => sum + Number.parseFloat(day.feesUSD || "0"), 0)
  const avgTVL =
    recentDays.reduce((sum, day) => sum + Number.parseFloat(day.totalValueLockedUSD || "0"), 0) / recentDays.length

  if (avgTVL === 0) return 0

  const weeklyAPR = (totalFees / avgTVL) * 100
  return weeklyAPR * 52 // Annualized
}

export const getFeeTierColor = (feeTier: string): string => {
  switch (feeTier) {
    case "100":
      return "bg-blue-500/20 text-blue-400 border-blue-500/30"
    case "500":
      return "bg-green-500/20 text-green-400 border-green-500/30"
    case "3000":
      return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
    case "10000":
      return "bg-red-500/20 text-red-400 border-red-500/30"
    default:
      return "bg-gray-500/20 text-gray-400 border-gray-500/30"
  }
}

export const getFeeTierLabel = (feeTier: string): string => {
  const tier = Number.parseInt(feeTier) / 10000
  return `${tier}%`
}

export const getPoolAge = (createdAtTimestamp?: string): string => {
  if (!createdAtTimestamp) return "Unknown"

  const created = new Date(Number.parseInt(createdAtTimestamp) * 1000)
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - created.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays < 30) return `${diffDays}d`
  if (diffDays < 365) return `${Math.floor(diffDays / 30)}mo`
  return `${Math.floor(diffDays / 365)}y`
}
