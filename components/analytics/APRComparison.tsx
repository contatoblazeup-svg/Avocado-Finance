"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, TrendingDown, Target, AlertTriangle } from "lucide-react"
import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Area,
  AreaChart,
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

interface APRComparisonProps {
  pool: Pool
  timeframe: "7d" | "30d" | "90d"
}

export function APRComparison({ pool, timeframe }: APRComparisonProps) {
  // Generate mock APR historical data
  const generateAPRData = () => {
    const days = timeframe === "7d" ? 7 : timeframe === "30d" ? 30 : 90
    const data = []

    for (let i = days; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)

      const baseAPR = pool.apr
      const volatility = 0.15
      const trend = Math.sin(i * 0.05) * 0.1
      const noise = (Math.random() - 0.5) * volatility

      const currentAPR = Math.max(0, baseAPR * (1 + trend + noise))
      const rollingAvg = baseAPR * (1 + trend * 0.5) // Smoother rolling average
      const predictedAPR = baseAPR * (1 + trend + noise * 0.3) // Less volatile prediction

      data.push({
        date: date.toISOString().split("T")[0],
        currentAPR: Number(currentAPR.toFixed(2)),
        rollingAvg: Number(rollingAvg.toFixed(2)),
        predictedAPR: Number(predictedAPR.toFixed(2)),
        volume: pool.volume24h * (0.7 + Math.random() * 0.6),
        fees: pool.volume24h * (pool.feeTier / 10000) * (0.7 + Math.random() * 0.6),
      })
    }

    return data
  }

  const data = generateAPRData()

  // Calculate analytics
  const currentAPR = data[data.length - 1]?.currentAPR || pool.apr
  const avgAPR = data.reduce((sum, d) => sum + d.currentAPR, 0) / data.length
  const maxAPR = Math.max(...data.map((d) => d.currentAPR))
  const minAPR = Math.min(...data.map((d) => d.currentAPR))

  const aprChange =
    data.length > 1 ? ((currentAPR - data[data.length - 2].currentAPR) / data[data.length - 2].currentAPR) * 100 : 0

  // Calculate volatility (standard deviation)
  const variance = data.reduce((sum, d) => sum + Math.pow(d.currentAPR - avgAPR, 2), 0) / data.length
  const volatility = Math.sqrt(variance)
  const coefficientOfVariation = (volatility / avgAPR) * 100

  // Trend analysis (simple linear regression)
  const n = data.length
  const sumX = data.reduce((sum, _, i) => sum + i, 0)
  const sumY = data.reduce((sum, d) => sum + d.currentAPR, 0)
  const sumXY = data.reduce((sum, d, i) => sum + i * d.currentAPR, 0)
  const sumXX = data.reduce((sum, _, i) => sum + i * i, 0)

  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX)
  const trendDirection = slope > 0.01 ? "increasing" : slope < -0.01 ? "decreasing" : "stable"

  // Consistency score (inverse of coefficient of variation)
  const consistencyScore = Math.max(0, 100 - coefficientOfVariation * 2)

  // Performance classification
  const getPerformanceClass = (apr: number) => {
    if (apr > avgAPR * 1.2) return { label: "Excellent", color: "text-green-600", variant: "default" as const }
    if (apr > avgAPR * 1.1) return { label: "Good", color: "text-blue-600", variant: "secondary" as const }
    if (apr > avgAPR * 0.9) return { label: "Average", color: "text-yellow-600", variant: "outline" as const }
    return { label: "Below Average", color: "text-red-600", variant: "destructive" as const }
  }

  const performance = getPerformanceClass(currentAPR)

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{new Date(label).toLocaleDateString()}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {entry.value.toFixed(2)}%
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <div className="space-y-6">
      {/* APR Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>APR Analysis</CardTitle>
              <CardDescription>Current vs Historical APR Performance</CardDescription>
            </div>
            <Badge variant={performance.variant} className={performance.color}>
              {performance.label}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{currentAPR.toFixed(2)}%</div>
              <div className="text-sm text-muted-foreground">Current APR</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{avgAPR.toFixed(2)}%</div>
              <div className="text-sm text-muted-foreground">Average APR</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{maxAPR.toFixed(2)}%</div>
              <div className="text-sm text-muted-foreground">Peak APR</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{minAPR.toFixed(2)}%</div>
              <div className="text-sm text-muted-foreground">Low APR</div>
            </div>
          </div>

          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="currentAPRGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
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
                <ReferenceLine y={avgAPR} stroke="hsl(var(--muted-foreground))" strokeDasharray="2 2" />
                <Area
                  type="monotone"
                  dataKey="currentAPR"
                  stroke="hsl(var(--primary))"
                  fillOpacity={1}
                  fill="url(#currentAPRGradient)"
                  name="Current APR"
                />
                <Line
                  type="monotone"
                  dataKey="rollingAvg"
                  stroke="hsl(var(--chart-2))"
                  strokeWidth={2}
                  dot={false}
                  name="7-day Average"
                />
                <Line
                  type="monotone"
                  dataKey="predictedAPR"
                  stroke="hsl(var(--chart-3))"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                  name="Predicted"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* APR Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Performance Metrics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Consistency Score</span>
                <span>{consistencyScore.toFixed(0)}%</span>
              </div>
              <Progress value={consistencyScore} className="h-2" />
              <div className="text-xs text-muted-foreground">Based on APR volatility over {timeframe}</div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Trend Direction</span>
                <Badge variant="outline" className="capitalize">
                  {trendDirection === "increasing" && <TrendingUp className="h-3 w-3 mr-1" />}
                  {trendDirection === "decreasing" && <TrendingDown className="h-3 w-3 mr-1" />}
                  {trendDirection}
                </Badge>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Volatility</span>
                <span>{volatility.toFixed(2)}%</span>
              </div>
              <div className="text-xs text-muted-foreground">Standard deviation of APR</div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Recent Change</span>
                <Badge variant={aprChange >= 0 ? "default" : "destructive"}>
                  {aprChange >= 0 ? "+" : ""}
                  {aprChange.toFixed(2)}%
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Risk Assessment
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>APR Stability</span>
                <Badge
                  variant={
                    coefficientOfVariation < 10 ? "default" : coefficientOfVariation < 20 ? "secondary" : "destructive"
                  }
                >
                  {coefficientOfVariation < 10 ? "High" : coefficientOfVariation < 20 ? "Medium" : "Low"}
                </Badge>
              </div>
              <div className="text-xs text-muted-foreground">
                Coefficient of variation: {coefficientOfVariation.toFixed(1)}%
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Downside Risk</span>
                <span>{(((avgAPR - minAPR) / avgAPR) * 100).toFixed(1)}%</span>
              </div>
              <div className="text-xs text-muted-foreground">Maximum observed decline from average</div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Upside Potential</span>
                <span>{(((maxAPR - avgAPR) / avgAPR) * 100).toFixed(1)}%</span>
              </div>
              <div className="text-xs text-muted-foreground">Maximum observed gain from average</div>
            </div>

            <div className="pt-2 text-xs text-muted-foreground">
              <p>
                <strong>Note:</strong> APR calculations are based on recent fee collection and may not reflect future
                performance.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
