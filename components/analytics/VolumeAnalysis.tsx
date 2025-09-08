"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, TrendingDown, BarChart3 } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface Pool {
  id: string
  token0: string
  token1: string
  feeTier: number
  tvl: number
  volume24h: number
  apr: number
}

interface VolumeAnalysisProps {
  pool: Pool
  timeframe: "7d" | "30d" | "90d"
}

export function VolumeAnalysis({ pool, timeframe }: VolumeAnalysisProps) {
  // Generate mock volume data
  const generateVolumeData = () => {
    const days = timeframe === "7d" ? 7 : timeframe === "30d" ? 30 : 90
    const data = []

    for (let i = days; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)

      // Simulate weekly patterns (higher volume on weekdays)
      const dayOfWeek = date.getDay()
      const weekdayMultiplier = dayOfWeek === 0 || dayOfWeek === 6 ? 0.6 : 1.0

      const baseVolume = pool.volume24h
      const volatility = 0.4
      const noise = (Math.random() - 0.5) * volatility
      const volume = Math.max(0, baseVolume * weekdayMultiplier * (1 + noise))

      const fees = volume * (pool.feeTier / 10000)
      const trades = Math.floor(volume / 1000) + Math.floor(Math.random() * 100)

      data.push({
        date: date.toISOString().split("T")[0],
        dayName: date.toLocaleDateString("en-US", { weekday: "short" }),
        volume: Math.floor(volume),
        fees: Math.floor(fees),
        trades: trades,
        avgTradeSize: Math.floor(volume / trades),
        utilization: Math.min((volume / pool.tvl) * 100, 100),
      })
    }

    return data
  }

  const data = generateVolumeData()

  // Calculate analytics
  const totalVolume = data.reduce((sum, d) => sum + d.volume, 0)
  const avgDailyVolume = totalVolume / data.length
  const currentVolume = data[data.length - 1]?.volume || pool.volume24h
  const volumeChange = ((currentVolume - avgDailyVolume) / avgDailyVolume) * 100

  const totalFees = data.reduce((sum, d) => sum + d.fees, 0)
  const totalTrades = data.reduce((sum, d) => sum + d.trades, 0)
  const avgTradeSize = totalVolume / totalTrades

  // Weekly pattern analysis
  const weeklyPattern = data.reduce(
    (acc, d) => {
      const day = d.dayName
      if (!acc[day]) acc[day] = { volume: 0, count: 0 }
      acc[day].volume += d.volume
      acc[day].count += 1
      return acc
    },
    {} as Record<string, { volume: number; count: number }>,
  )

  const weeklyData = Object.entries(weeklyPattern).map(([day, data]) => ({
    day,
    avgVolume: Math.floor(data.volume / data.count),
  }))

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
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <div className="space-y-6">
      {/* Volume Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Volume</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalVolume)}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {volumeChange >= 0 ? (
                <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
              )}
              {volumeChange.toFixed(1)}% vs avg
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Fees</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalFees)}</div>
            <div className="text-xs text-muted-foreground">
              {((totalFees / totalVolume) * 100).toFixed(3)}% of volume
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Trades</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTrades.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">{Math.floor(totalTrades / data.length)} avg/day</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Trade Size</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(avgTradeSize)}</div>
            <div className="text-xs text-muted-foreground">Per transaction</div>
          </CardContent>
        </Card>
      </div>

      {/* Volume History Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Volume History</CardTitle>
          <CardDescription>Daily trading volume over {timeframe}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="date"
                  className="text-xs"
                  tickFormatter={(value) =>
                    new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                  }
                />
                <YAxis className="text-xs" tickFormatter={formatCurrency} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="volume" fill="hsl(var(--primary))" name="Volume" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Pattern Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Weekly Volume Pattern</CardTitle>
            <CardDescription>Average volume by day of week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="day" className="text-xs" />
                  <YAxis className="text-xs" tickFormatter={formatCurrency} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="avgVolume" fill="hsl(var(--chart-2))" name="Avg Volume" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Volume Volatility Analysis</CardTitle>
            <CardDescription>Volume consistency and patterns</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Volume Consistency</span>
                <span>78%</span>
              </div>
              <Progress value={78} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Weekday Activity</span>
                <span>85%</span>
              </div>
              <Progress value={85} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Weekend Activity</span>
                <span>52%</span>
              </div>
              <Progress value={52} className="h-2" />
            </div>

            <div className="pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Peak Volume Day</span>
                <Badge variant="outline">Wednesday</Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span>Low Volume Day</span>
                <Badge variant="outline">Sunday</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
