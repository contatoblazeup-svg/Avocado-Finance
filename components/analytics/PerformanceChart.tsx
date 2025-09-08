"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown } from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
  ReferenceLine,
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

interface PerformanceChartProps {
  pool: Pool
  timeframe: "7d" | "30d" | "90d"
}

export function PerformanceChart({ pool, timeframe }: PerformanceChartProps) {
  // Generate mock historical data
  const generateData = () => {
    const days = timeframe === "7d" ? 7 : timeframe === "30d" ? 30 : 90
    const data = []

    for (let i = days; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)

      const baseAPR = pool.apr
      const volatility = 0.2
      const trend = Math.sin(i * 0.1) * 0.1
      const noise = (Math.random() - 0.5) * volatility

      const apr = Math.max(0, baseAPR * (1 + trend + noise))
      const volume = pool.volume24h * (0.5 + Math.random())
      const tvl = pool.tvl * (0.9 + Math.random() * 0.2)
      const utilization = (volume / tvl) * 100

      data.push({
        date: date.toISOString().split("T")[0],
        apr: Number(apr.toFixed(2)),
        volume: Math.floor(volume),
        tvl: Math.floor(tvl),
        utilization: Number(utilization.toFixed(2)),
        fees: Math.floor(volume * (pool.feeTier / 10000)),
      })
    }

    return data
  }

  const data = generateData()
  const currentAPR = data[data.length - 1]?.apr || pool.apr
  const previousAPR = data[data.length - 2]?.apr || pool.apr
  const aprChange = ((currentAPR - previousAPR) / previousAPR) * 100
  const avgAPR = data.reduce((sum, d) => sum + d.apr, 0) / data.length

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
              {entry.name}:{" "}
              {entry.name === "APR"
                ? `${entry.value}%`
                : entry.name === "Utilization"
                  ? `${entry.value}%`
                  : formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <div className="space-y-6">
      {/* APR Performance Chart */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>APR Performance</CardTitle>
              <CardDescription>Historical APR trends over {timeframe}</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={aprChange >= 0 ? "default" : "destructive"}>
                {aprChange >= 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                {aprChange.toFixed(2)}%
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="aprGradient" x1="0" y1="0" x2="0" y2="1">
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
                  dataKey="apr"
                  stroke="hsl(var(--primary))"
                  fillOpacity={1}
                  fill="url(#aprGradient)"
                  name="APR"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-between text-sm text-muted-foreground mt-2">
            <span>Average APR: {avgAPR.toFixed(2)}%</span>
            <span>Current: {currentAPR.toFixed(2)}%</span>
          </div>
        </CardContent>
      </Card>

      {/* Volume vs TVL Correlation */}
      <Card>
        <CardHeader>
          <CardTitle>Volume vs TVL Correlation</CardTitle>
          <CardDescription>Relationship between trading volume and total value locked</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="date"
                  className="text-xs"
                  tickFormatter={(value) =>
                    new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                  }
                />
                <YAxis yAxisId="left" className="text-xs" tickFormatter={formatCurrency} />
                <YAxis yAxisId="right" orientation="right" className="text-xs" tickFormatter={(value) => `${value}%`} />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="volume"
                  stroke="hsl(var(--chart-1))"
                  strokeWidth={2}
                  dot={false}
                  name="Volume"
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="tvl"
                  stroke="hsl(var(--chart-2))"
                  strokeWidth={2}
                  dot={false}
                  name="TVL"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="utilization"
                  stroke="hsl(var(--chart-3))"
                  strokeWidth={2}
                  dot={false}
                  name="Utilization"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
