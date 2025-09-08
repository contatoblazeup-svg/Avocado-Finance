"use client"

import { ExternalLink, BarChart3 } from "lucide-react"
import { TokenPrice } from "@/components/TokenPrice"

interface Pool {
  id: string
  token0: { symbol: string; name: string }
  token1: { symbol: string; name: string }
  feeTier: string
  totalValueLockedUSD: string
  volumeUSD: string
  poolDayData: Array<{ feesUSD: string }>
}

interface PoolCardMobileProps {
  pool: Pool
  tokenPrices: Record<string, any>
  onAnalyze: () => void
  formatNumber: (value: string | number) => string
  formatPercentage: (value: number) => string
  calculateAPR: (pool: Pool) => number
  getFeeTierColor: (feeTier: string) => string
  getFeeTierLabel: (feeTier: string) => string
}

export function PoolCardMobile({
  pool,
  tokenPrices,
  onAnalyze,
  formatNumber,
  formatPercentage,
  calculateAPR,
  getFeeTierColor,
  getFeeTierLabel,
}: PoolCardMobileProps) {
  const tvl = Number.parseFloat(pool.totalValueLockedUSD || "0")
  const volume24h = Number.parseFloat(pool.volumeUSD || "0")
  const apr = calculateAPR(pool)
  const fees24h = pool.poolDayData?.[0] ? Number.parseFloat(pool.poolDayData[0].feesUSD || "0") : 0

  const token0Price = tokenPrices[pool.token0.symbol.toUpperCase()]
  const token1Price = tokenPrices[pool.token1.symbol.toUpperCase()]

  return (
    <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50 backdrop-blur-sm rounded-lg p-4 hover:from-gray-700/50 hover:to-gray-800/50 transition-all duration-300">
      {/* Header - Mobile Optimized */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3 flex-1">
          <div className="flex -space-x-1">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold border-2 border-gray-800 shadow-lg">
              {pool.token0.symbol[0]}
            </div>
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold border-2 border-gray-800 shadow-lg">
              {pool.token1.symbol[0]}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-bold text-white truncate">
              {pool.token0.symbol}/{pool.token1.symbol}
            </h3>
            <span
              className={`inline-block px-2 py-1 rounded text-xs font-medium border ${getFeeTierColor(pool.feeTier)}`}
            >
              {getFeeTierLabel(pool.feeTier)}
            </span>
          </div>
        </div>

        <div className="text-right">
          <div className="text-lg font-bold text-green-400">{formatPercentage(apr)}</div>
          <div className="text-xs text-gray-400">APR</div>
        </div>
      </div>

      {/* Token Prices - Stacked on Mobile */}
      <div className="space-y-2 mb-4">
        <div className="bg-gray-700/20 backdrop-blur-sm p-2 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">{pool.token0.symbol}</span>
            <TokenPrice
              symbol={pool.token0.symbol}
              price={token0Price?.current_price}
              change24h={token0Price?.price_change_percentage_24h}
              className="text-xs"
            />
          </div>
        </div>
        <div className="bg-gray-700/20 backdrop-blur-sm p-2 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">{pool.token1.symbol}</span>
            <TokenPrice
              symbol={pool.token1.symbol}
              price={token1Price?.current_price}
              change24h={token1Price?.price_change_percentage_24h}
              className="text-xs"
            />
          </div>
        </div>
      </div>

      {/* Metrics - Mobile Grid */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="bg-gray-700/30 backdrop-blur-sm p-2 rounded-lg border border-gray-600/30">
          <div className="text-xs text-gray-400 font-medium mb-1">TVL</div>
          <div className="text-sm font-bold text-white">{formatNumber(tvl)}</div>
        </div>
        <div className="bg-gray-700/30 backdrop-blur-sm p-2 rounded-lg border border-gray-600/30">
          <div className="text-xs text-gray-400 font-medium mb-1">Volume</div>
          <div className="text-sm font-bold text-white">{formatNumber(volume24h)}</div>
        </div>
      </div>

      {/* Fees */}
      <div className="bg-gray-700/30 backdrop-blur-sm p-2 rounded-lg border border-gray-600/30 mb-4">
        <div className="flex items-center justify-between">
          <div className="text-xs text-gray-400 font-medium">24h Fees</div>
          <div className="text-sm font-bold text-white">{formatNumber(fees24h)}</div>
        </div>
      </div>

      {/* Performance Bar */}
      <div className="flex items-center justify-between text-sm mb-4">
        <span className="text-gray-400 text-xs">Performance</span>
        <div className="flex items-center gap-2">
          <div className="w-16 h-1.5 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(Math.max(apr * 2, 5), 100)}%` }}
            />
          </div>
          <span
            className={`font-medium text-xs ${
              apr > 20 ? "text-green-400" : apr > 10 ? "text-yellow-400" : apr > 5 ? "text-orange-400" : "text-red-400"
            }`}
          >
            {apr > 20 ? "High" : apr > 10 ? "Med" : "Low"}
          </span>
        </div>
      </div>

      {/* Action Buttons - Mobile Optimized */}
      <div className="flex gap-2">
        <button
          onClick={onAnalyze}
          className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white text-sm px-3 py-2 rounded-lg font-medium transition-all flex items-center justify-center"
        >
          <BarChart3 className="h-4 w-4 mr-1" />
          Analyze
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation()
            window.open(`https://info.uniswap.org/#/pools/${pool.id}`, "_blank")
          }}
          className="border border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent text-sm px-3 py-2 rounded-lg transition-all"
        >
          <ExternalLink className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
