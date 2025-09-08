"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Droplets, PieChart, BarChart3, AlertTriangle } from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Cell,
  LineChart,
  Line,
} from "recharts"

interface Pool {
  id: string
  token0: string
  token1: string
  feeTier: number
  tvl: number
  volume24h: number
  apr: number
}

interface LiquidityDistributionProps {
  pool: Pool
  timeframe: "7d" | "30d" | "90d"
}

export function LiquidityDistribution({ pool, timeframe }: LiquidityDistributionProps) {
  // Mock current price (for demonstration)
  const currentPrice = 1850 // USDT per token

  // Generate price range distribution data
  const generatePriceRangeData = () => {
    const ranges = []
    const priceStep = currentPrice * 0.05 // 5% steps

    for (let i = -10; i <= 10; i++) {
      const minPrice = currentPrice + i * priceStep
      const maxPrice = currentPrice + (i + 1) * priceStep
      const distanceFromCurrent = Math.abs(i)

      // More liquidity concentrated near current price
      const liquidityMultiplier = Math.exp(-distanceFromCurrent * 0.3)
      const baseLiquidity = pool.tvl * 0.05
      const liquidity = baseLiquidity * liquidityMultiplier * (0.5 + Math.random())

      ranges.push({
        range: `${minPrice.toFixed(0)}-${maxPrice.toFixed(0)}`,
        minPrice,
        maxPrice,
        liquidity: Math.floor(liquidity),
        percentage: 0, // Will be calculated after
        isActive: minPrice <= currentPrice && maxPrice >= currentPrice,
        distanceFromCurrent,
      })
    }

    // Calculate percentages
    const totalLiquidity = ranges.reduce((sum, r) => sum + r.liquidity, 0)
    ranges.forEach((r) => {
      r.percentage = (r.liquidity / totalLiquidity) * 100
    })

    return ranges
  }

  // Generate token composition data
  const generateTokenComposition = () => {
    const token0Amount = (pool.tvl * 0.5) / currentPrice // Assuming 50/50 split for simplicity
    const token1Amount = pool.tvl * 0.5

    return [
      {
        token: pool.token0,
        amount: token0Amount,
        value: pool.tvl * 0.5,
        percentage: 50,
        color: "hsl(var(--chart-1))",
      },
      {
        token: pool.token1,
        amount: token1Amount,
        value: pool.tvl * 0.5,
        percentage: 50,
        color: "hsl(var(--chart-2))",
      },
    ]
  }

  // Generate position size distribution
  const generatePositionSizes = () => {
    return [
      { size: "Small (<$1K)", count: 450, percentage: 65, avgSize: 500, totalValue: 225000 },
      { size: "Medium ($1K-$10K)", count: 180, percentage: 26, avgSize: 5000, totalValue: 900000 },
      { size: "Large ($10K-$100K)", count: 45, percentage: 7, avgSize: 40000, totalValue: 1800000 },
      { size: "Whale (>$100K)", count: 15, percentage: 2, avgSize: 200000, totalValue: 3000000 },
    ]
  }

  // Generate liquidity health metrics over time
  const generateHealthData = () => {
    const days = timeframe === "7d" ? 7 : timeframe === "30d" ? 30 : 90
    const data = []

    for (let i = days; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)

      const concentration = 60 + Math.random() * 20 // 60-80%
      const utilization = 40 + Math.random() * 30 // 40-70%
      const efficiency = 70 + Math.random() * 25 // 70-95%
      const stability = 80 + Math.random() * 15 // 80-95%

      data.push({
        date: date.toISOString().split("T")[0],
        concentration: Number(concentration.toFixed(1)),
        utilization: Number(utilization.toFixed(1)),
        efficiency: Number(efficiency.toFixed(1)),
        stability: Number(stability.toFixed(1)),
      })
    }

    return data
  }

  const priceRangeData = generatePriceRangeData()
  const tokenComposition = generateTokenComposition()
  const positionSizes = generatePositionSizes()
  const healthData = generateHealthData()

  // Calculate key metrics
  const activeRanges = priceRangeData.filter((r) => r.percentage > 1).length
  const concentrationRisk = Math.max(...priceRangeData.map((r) => r.percentage))
  const liquidityUtilization = (pool.volume24h / pool.tvl) * 100
  const currentHealth = healthData[healthData.length - 1]

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`
    }
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(1)}K`
    }
    return `$${value.toFixed(0)}`
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {entry.name.includes("%") ? `${entry.value}%` : formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <div className="space-y-6">
      {/* Liquidity Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Ranges</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeRanges}</div>
            <div className="text-xs text-muted-foreground">Price ranges with &gt;1% liquidity</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Concentration Risk</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{concentrationRisk.toFixed(1)}%</div>
            <div className="text-xs text-muted-foreground">Max liquidity in single range</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilization Rate</CardTitle>
            <Droplets className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{liquidityUtilization.toFixed(1)}%</div>
            <div className="text-xs text-muted-foreground">Volume to TVL ratio</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Health Score</CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentHealth?.stability.toFixed(0)}%</div>
            <div className="text-xs text-muted-foreground">Overall liquidity health</div>
          </CardContent>
        </Card>
      </div>

      {/* Price Range Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Liquidity Distribution by Price Range</CardTitle>
          <CardDescription>How liquidity is distributed across different price ranges</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={priceRangeData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="range" className="text-xs" angle={-45} textAnchor="end" height={60} />
                <YAxis className="text-xs" tickFormatter={(value) => `${value}%`} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="percentage" name="Liquidity %" radius={[2, 2, 0, 0]}>
                  {priceRangeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.isActive ? "hsl(var(--primary))" : "hsl(var(--muted))"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-center gap-4 mt-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-primary rounded"></div>
              <span>Active Range</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-muted rounded"></div>
              <span>Inactive Range</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Token Composition and Position Sizes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Token Composition</CardTitle>
            <CardDescription>Current token balance in the pool</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Tooltip formatter={(value: any, name: string) => [formatCurrency(Number(value)), name]} />
                  {tokenComposition.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2">
              {tokenComposition.map((token, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: token.color }}></div>
                    <span className="font-medium">{token.token}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-mono">{formatCurrency(token.value)}</div>
                    <div className="text-xs text-muted-foreground">{token.amount.toLocaleString()} tokens</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Position Size Distribution</CardTitle>
            <CardDescription>Breakdown of liquidity providers by position size</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {positionSizes.map((position, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{position.size}</span>
                    <div className="text-right">
                      <div className="text-sm font-mono">{position.count} positions</div>
                      <div className="text-xs text-muted-foreground">{formatCurrency(position.totalValue)}</div>
                    </div>
                  </div>
                  <Progress value={position.percentage} className="h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{position.percentage}% of positions</span>
                    <span>Avg: {formatCurrency(position.avgSize)}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Liquidity Health Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Liquidity Health Metrics</CardTitle>
          <CardDescription>Historical health indicators over {timeframe}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={healthData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="date"
                  className="text-xs"
                  tickFormatter={(value) =>
                    new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                  }
                />
                <YAxis className="text-xs" tickFormatter={(value) => `${value}%`} />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="concentration"
                  stroke="hsl(var(--chart-1))"
                  strokeWidth={2}
                  dot={false}
                  name="Concentration"
                />
                <Line
                  type="monotone"
                  dataKey="utilization"
                  stroke="hsl(var(--chart-2))"
                  strokeWidth={2}
                  dot={false}
                  name="Utilization"
                />
                <Line
                  type="monotone"
                  dataKey="efficiency"
                  stroke="hsl(var(--chart-3))"
                  strokeWidth={2}
                  dot={false}
                  name="Efficiency"
                />
                <Line
                  type="monotone"
                  dataKey="stability"
                  stroke="hsl(var(--chart-4))"
                  strokeWidth={2}
                  dot={false}
                  name="Stability"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Risk Assessment */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Liquidity Risk Assessment
          </CardTitle>
          <CardDescription>Potential risks and recommendations for liquidity management</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <div
                  className={`w-3 h-3 rounded-full ${concentrationRisk > 30 ? "bg-red-500" : concentrationRisk > 20 ? "bg-yellow-500" : "bg-green-500"}`}
                ></div>
                <span className="font-medium">Concentration Risk</span>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                {concentrationRisk > 30
                  ? "High concentration detected. Consider diversifying liquidity across more price ranges."
                  : concentrationRisk > 20
                    ? "Moderate concentration. Monitor for potential risks."
                    : "Well-distributed liquidity across price ranges."}
              </p>
              <Badge
                variant={concentrationRisk > 30 ? "destructive" : concentrationRisk > 20 ? "secondary" : "default"}
              >
                {concentrationRisk > 30 ? "High Risk" : concentrationRisk > 20 ? "Medium Risk" : "Low Risk"}
              </Badge>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <div
                  className={`w-3 h-3 rounded-full ${liquidityUtilization < 30 ? "bg-red-500" : liquidityUtilization < 60 ? "bg-yellow-500" : "bg-green-500"}`}
                ></div>
                <span className="font-medium">Utilization Efficiency</span>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                {liquidityUtilization < 30
                  ? "Low utilization. Consider tighter price ranges for better capital efficiency."
                  : liquidityUtilization < 60
                    ? "Moderate utilization. Room for optimization."
                    : "High utilization indicates efficient capital deployment."}
              </p>
              <Badge
                variant={
                  liquidityUtilization < 30 ? "destructive" : liquidityUtilization < 60 ? "secondary" : "default"
                }
              >
                {liquidityUtilization.toFixed(1)}% Utilized
              </Badge>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <div
                  className={`w-3 h-3 rounded-full ${currentHealth?.stability < 70 ? "bg-red-500" : currentHealth?.stability < 85 ? "bg-yellow-500" : "bg-green-500"}`}
                ></div>
                <span className="font-medium">Overall Health</span>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                {(currentHealth?.stability || 0) < 70
                  ? "Pool health needs attention. Monitor closely for potential issues."
                  : (currentHealth?.stability || 0) < 85
                    ? "Good pool health with minor areas for improvement."
                    : "Excellent pool health across all metrics."}
              </p>
              <Badge
                variant={
                  (currentHealth?.stability || 0) < 70
                    ? "destructive"
                    : (currentHealth?.stability || 0) < 85
                      ? "secondary"
                      : "default"
                }
              >
                {currentHealth?.stability.toFixed(0)}% Health
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
