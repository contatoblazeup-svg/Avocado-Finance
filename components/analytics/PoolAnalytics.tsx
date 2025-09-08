"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { TrendingUp, TrendingDown, BarChart3, PieChart, Activity, DollarSign } from "lucide-react"
import { PerformanceChart } from "./PerformanceChart"
import { VolumeAnalysis } from "./VolumeAnalysis"
import { APRComparison } from "./APRComparison"
import { FeeTierComparison } from "./FeeTierComparison"
import { LiquidityDistribution } from "./LiquidityDistribution"

interface Pool {
  id: string
  token0: string
  token1: string
  feeTier: number
  tvl: number
  volume24h: number
  apr: number
}

interface PoolAnalyticsProps {
  pool: Pool
}

export function PoolAnalytics({ pool }: PoolAnalyticsProps) {
  const [timeframe, setTimeframe] = useState<"7d" | "30d" | "90d">("7d")

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const formatPercent = (value: number) => {
    return `${value.toFixed(2)}%`
  }

  // Mock analytics data
  const analytics = {
    currentAPR: pool.apr,
    avgAPR: pool.apr * 0.85,
    aprTrend: pool.apr > pool.apr * 0.85 ? "up" : "down",
    volumeToTVL: (pool.volume24h / pool.tvl) * 100,
    utilizationRate: Math.min((pool.volume24h / pool.tvl) * 100, 100),
    feeRevenue24h: pool.volume24h * (pool.feeTier / 10000),
    totalPositions: Math.floor(Math.random() * 500) + 100,
    activePositions: Math.floor(Math.random() * 300) + 50,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">
            {pool.token0}/{pool.token1} Analytics
          </h2>
          <p className="text-muted-foreground">
            Fee Tier: {pool.feeTier / 10000}% • TVL: {formatCurrency(pool.tvl)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant={timeframe === "7d" ? "default" : "outline"} size="sm" onClick={() => setTimeframe("7d")}>
            7D
          </Button>
          <Button variant={timeframe === "30d" ? "default" : "outline"} size="sm" onClick={() => setTimeframe("30d")}>
            30D
          </Button>
          <Button variant={timeframe === "90d" ? "default" : "outline"} size="sm" onClick={() => setTimeframe("90d")}>
            90D
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current APR</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPercent(analytics.currentAPR)}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {analytics.aprTrend === "up" ? (
                <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
              )}
              vs {formatPercent(analytics.avgAPR)} avg
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilization Rate</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPercent(analytics.utilizationRate)}</div>
            <div className="text-xs text-muted-foreground">Volume/TVL ratio</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fee Revenue (24h)</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(analytics.feeRevenue24h)}</div>
            <div className="text-xs text-muted-foreground">From {formatCurrency(pool.volume24h)} volume</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Positions</CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.activePositions}</div>
            <div className="text-xs text-muted-foreground">of {analytics.totalPositions} total</div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="volume">Volume</TabsTrigger>
          <TabsTrigger value="fees">Fees</TabsTrigger>
          <TabsTrigger value="liquidity">Liquidity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <APRComparison pool={pool} timeframe={timeframe} />
            <PerformanceChart pool={pool} timeframe={timeframe} />
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <PerformanceChart pool={pool} timeframe={timeframe} />
        </TabsContent>

        <TabsContent value="volume" className="space-y-4">
          <VolumeAnalysis pool={pool} timeframe={timeframe} />
        </TabsContent>

        <TabsContent value="fees" className="space-y-4">
          <FeeTierComparison pool={pool} timeframe={timeframe} />
        </TabsContent>

        <TabsContent value="liquidity" className="space-y-4">
          <LiquidityDistribution pool={pool} timeframe={timeframe} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
