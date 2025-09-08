import type { Pool } from "@/types/pool"

export function formatNumber(value: string | number, decimals = 2): string {
  const num = typeof value === "string" ? Number.parseFloat(value) : value

  if (isNaN(num)) return "$0.00"

  if (num >= 1e9) return `$${(num / 1e9).toFixed(decimals)}B`
  if (num >= 1e6) return `$${(num / 1e6).toFixed(decimals)}M`
  if (num >= 1e3) return `$${(num / 1e3).toFixed(decimals)}K`
  return `$${num.toFixed(decimals)}`
}

export function formatPercentage(value: number): string {
  if (isNaN(value)) return "0.00%"
  return `${value.toFixed(2)}%`
}

export function calculateAPR(pool: Pool): number {
  if (!pool.poolDayData || pool.poolDayData.length === 0) return 0

  // Calculate 7-day average APR for more stability
  const recentDays = pool.poolDayData.slice(0, 7)
  const totalFees = recentDays.reduce((sum, day) => {
    const fees = Number.parseFloat(day.feesUSD || "0")
    return sum + (isNaN(fees) ? 0 : fees)
  }, 0)

  const avgTVL =
    recentDays.reduce((sum, day) => {
      const tvl = Number.parseFloat(day.tvlUSD || pool.totalValueLockedUSD || "0")
      return sum + (isNaN(tvl) ? 0 : tvl)
    }, 0) / recentDays.length

  if (avgTVL === 0) return 0

  const weeklyAPR = (totalFees / avgTVL) * 100
  return weeklyAPR * 52 // Annualized
}

export function getFeeTierColor(feeTier: string): string {
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

export function getFeeTierLabel(feeTier: string): string {
  const tier = Number.parseInt(feeTier) / 10000
  return `${tier}%`
}

export function getTokenPairName(pool: Pool): string {
  return `${pool.token0.symbol}/${pool.token1.symbol}`
}

export function getPoolAge(createdAtTimestamp: string): string {
  if (!createdAtTimestamp) return "Unknown"

  const created = new Date(Number.parseInt(createdAtTimestamp) * 1000)
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - created.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays < 30) return `${diffDays}d`
  if (diffDays < 365) return `${Math.floor(diffDays / 30)}mo`
  return `${Math.floor(diffDays / 365)}y`
}

export function calculateHistoricalAPR(pool: Pool, days = 30): number[] {
  if (!pool.poolDayData || pool.poolDayData.length === 0) return []

  return pool.poolDayData
    .slice(0, days)
    .map((day) => {
      const fees = Number.parseFloat(day.feesUSD || "0")
      const tvl = Number.parseFloat(day.tvlUSD || "0")
      return tvl > 0 ? (fees / tvl) * 365 * 100 : 0
    })
    .reverse()
}
