"use client"

import type React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TrendingUp, TrendingDown, Droplets, DollarSign, Activity, ExternalLink, BarChart3, Clock } from "lucide-react"
import type { Pool } from "@/types/pool"
import {
  formatNumber,
  formatPercentage,
  calculateAPR,
  getFeeTierColor,
  getFeeTierLabel,
  getTokenPairName,
  getPoolAge,
} from "@/utils/pool"

interface PoolCardProps {
  pool: Pool
  onClick?: () => void
  onAnalyze?: () => void
}

export const PoolCard: React.FC<PoolCardProps> = ({ pool, onClick, onAnalyze }) => {
  const tvl = Number.parseFloat(pool.totalValueLockedUSD || "0")
  const volume24h = Number.parseFloat(pool.volumeUSD || "0")
  const apr = calculateAPR(pool)

  // Calculate volume change from yesterday
  const volumeChange =
    pool.poolDayData?.length >= 2
      ? ((Number.parseFloat(pool.poolDayData[0]?.volumeUSD || "0") -
          Number.parseFloat(pool.poolDayData[1]?.volumeUSD || "0")) /
          Number.parseFloat(pool.poolDayData[1]?.volumeUSD || "1")) *
        100
      : 0

  const fees24h = pool.poolDayData?.[0] ? Number.parseFloat(pool.poolDayData[0].feesUSD || "0") : 0

  const handleExternalLink = (e: React.MouseEvent) => {
    e.stopPropagation()
    window.open(`https://info.uniswap.org/#/pools/${pool.id}`, "_blank")
  }

  return (
    <Card
      className="group bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700/50 backdrop-blur-sm hover:from-gray-700/50 hover:to-gray-800/50 transition-all duration-300 cursor-pointer hover:scale-[1.02] hover:shadow-xl hover:shadow-green-500/10"
      onClick={onClick}
    >
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white text-sm font-bold border-2 border-gray-800 shadow-lg">
                {pool.token0.symbol[0]}
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold border-2 border-gray-800 shadow-lg">
                {pool.token1.symbol[0]}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white group-hover:text-green-400 transition-colors">
                {getTokenPairName(pool)}
              </h3>
              <div className="flex items-center gap-2">
                <Badge className={getFeeTierColor(pool.feeTier)}>{getFeeTierLabel(pool.feeTier)}</Badge>
                <div className="flex items-center space-x-1 text-gray-400 text-xs">
                  <Clock className="h-3 w-3" />
                  <span>{getPoolAge(pool.createdAtTimestamp)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="text-right">
            <div className="flex items-center gap-1">
              <TrendingUp className="h-4 w-4 text-green-400" />
              <div className="text-xl font-bold text-green-400">{formatPercentage(apr)}</div>
            </div>
            <div className="text-xs text-gray-400">APR</div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-gray-700/30 backdrop-blur-sm p-3 rounded-lg border border-gray-600/30">
            <div className="flex items-center gap-2 mb-1">
              <Droplets className="h-4 w-4 text-blue-400" />
              <span className="text-xs text-gray-400 font-medium">TVL</span>
            </div>
            <div className="text-sm font-bold text-white">{formatNumber(tvl)}</div>
          </div>

          <div className="bg-gray-700/30 backdrop-blur-sm p-3 rounded-lg border border-gray-600/30">
            <div className="flex items-center gap-2 mb-1">
              <Activity className="h-4 w-4 text-green-400" />
              <span className="text-xs text-gray-400 font-medium">24h Volume</span>
            </div>
            <div className="text-sm font-bold text-white">{formatNumber(volume24h)}</div>
            {!isNaN(volumeChange) && volumeChange !== 0 && (
              <div
                className={`flex items-center gap-1 text-xs ${volumeChange > 0 ? "text-green-400" : "text-red-400"}`}
              >
                {volumeChange > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                <span>{formatPercentage(Math.abs(volumeChange))}</span>
              </div>
            )}
          </div>
        </div>

        {/* Additional Metrics */}
        <div className="grid grid-cols-1 gap-3 mb-4">
          <div className="bg-gray-700/30 backdrop-blur-sm p-3 rounded-lg border border-gray-600/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-yellow-400" />
                <span className="text-xs text-gray-400 font-medium">24h Fees</span>
              </div>
              <div className="text-sm font-bold text-white">{formatNumber(fees24h)}</div>
            </div>
          </div>
        </div>

        {/* Performance Indicator */}
        <div className="flex items-center justify-between text-sm mb-4">
          <span className="text-gray-400">Performance</span>
          <div className="flex items-center gap-2">
            <div className="w-20 h-2 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(Math.max(apr * 2, 5), 100)}%` }}
              />
            </div>
            <span
              className={`font-medium text-xs ${
                apr > 20
                  ? "text-green-400"
                  : apr > 10
                    ? "text-yellow-400"
                    : apr > 5
                      ? "text-orange-400"
                      : "text-red-400"
              }`}
            >
              {apr > 20 ? "Excellent" : apr > 10 ? "High" : apr > 5 ? "Medium" : "Low"}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            onClick={(e) => {
              e.stopPropagation()
              onAnalyze?.()
            }}
            className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white text-sm"
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            Analyze
          </Button>
          <Button
            variant="outline"
            onClick={handleExternalLink}
            className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent text-sm"
          >
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
