"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, Copy, TrendingUp, Droplets, DollarSign, Activity } from "lucide-react"
import type { Pool } from "@/types/pool"
import { PoolChart } from "@/components/PoolChart"
import {
  formatNumber,
  formatPercentage,
  calculateAPR,
  getFeeTierColor,
  getFeeTierLabel,
  getTokenPairName,
  getPoolAge,
} from "@/utils/pool"

interface PoolModalProps {
  pool: Pool | null
  isOpen: boolean
  onClose: () => void
}

export function PoolModal({ pool, isOpen, onClose }: PoolModalProps) {
  if (!pool) return null

  const apr = calculateAPR(pool)
  const tvl = Number.parseFloat(pool.totalValueLockedUSD || "0")
  const volume24h = Number.parseFloat(pool.volumeUSD || "0")
  const fees24h = pool.poolDayData?.[0] ? Number.parseFloat(pool.poolDayData[0].feesUSD || "0") : 0

  const copyAddress = () => {
    navigator.clipboard.writeText(pool.id)
    // You could add a toast notification here
  }

  const openUniswap = () => {
    window.open(`https://app.uniswap.org/#/pools/${pool.id}`, "_blank")
  }

  const openInfo = () => {
    window.open(`https://info.uniswap.org/#/pools/${pool.id}`, "_blank")
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl bg-gray-900 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                {pool.token0.symbol[0]}
              </div>
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold -ml-2">
                {pool.token1.symbol[0]}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold">{getTokenPairName(pool)}</h2>
              <div className="flex items-center space-x-2 mt-1">
                <Badge className={getFeeTierColor(pool.feeTier)}>{getFeeTierLabel(pool.feeTier)}</Badge>
                <span className="text-gray-400 text-sm">Age: {getPoolAge(pool.createdAtTimestamp)}</span>
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Stats */}
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-800/50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <TrendingUp className="h-5 w-5 text-green-400" />
                  <span className="text-gray-400 text-sm">APR</span>
                </div>
                <div className="text-2xl font-bold text-green-400">{formatPercentage(apr)}</div>
              </div>

              <div className="bg-gray-800/50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Droplets className="h-5 w-5 text-blue-400" />
                  <span className="text-gray-400 text-sm">TVL</span>
                </div>
                <div className="text-2xl font-bold text-white">{formatNumber(tvl)}</div>
              </div>

              <div className="bg-gray-800/50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Activity className="h-5 w-5 text-purple-400" />
                  <span className="text-gray-400 text-sm">Volume 24h</span>
                </div>
                <div className="text-2xl font-bold text-white">{formatNumber(volume24h)}</div>
              </div>

              <div className="bg-gray-800/50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <DollarSign className="h-5 w-5 text-yellow-400" />
                  <span className="text-gray-400 text-sm">Fees 24h</span>
                </div>
                <div className="text-2xl font-bold text-white">{formatNumber(fees24h)}</div>
              </div>
            </div>

            {/* Token Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Token Details</h3>

              <div className="bg-gray-800/50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{pool.token0.name}</span>
                  <Badge variant="secondary">{pool.token0.symbol}</Badge>
                </div>
                <div className="text-sm text-gray-400">
                  Balance: {formatNumber(Number.parseFloat(pool.totalValueLockedToken0 || "0"))} {pool.token0.symbol}
                </div>
              </div>

              <div className="bg-gray-800/50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{pool.token1.name}</span>
                  <Badge variant="secondary">{pool.token1.symbol}</Badge>
                </div>
                <div className="text-sm text-gray-400">
                  Balance: {formatNumber(Number.parseFloat(pool.totalValueLockedToken1 || "0"))} {pool.token1.symbol}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <Button
                onClick={openUniswap}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Trade on Uniswap
              </Button>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  onClick={openInfo}
                  className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
                >
                  Pool Info
                </Button>
                <Button
                  variant="outline"
                  onClick={copyAddress}
                  className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Address
                </Button>
              </div>
            </div>
          </div>

          {/* Right Column - Chart */}
          <div>
            <PoolChart pool={pool} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
