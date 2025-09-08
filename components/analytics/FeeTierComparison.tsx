"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { TrendingUp, TrendingDown, Target, Zap, Shield, DollarSign } from "lucide-react"
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
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

interface FeeTierComparisonProps {
  pool: Pool
  timeframe: "7d" | "30d" | "90d"
}

export function FeeTierComparison({ pool, timeframe }: FeeTierComparisonProps) {
  // Mock data for different fee tiers
  const feeTiers = [
    {
      tier: 100, // 0.01%
      name: "0.01%",
      tvl: pool.tvl * 0.3,
      volume24h: pool.volume24h * 0.2,
      apr: pool.apr * 0.4,
      trades: 1200,
      avgTradeSize: 50000,
      efficiency: 65,
      competitiveness: 85,
      risk: "Low",
      description: "Stable pairs, low volatility",
    },
    {
      tier: 500, // 0.05%
      name: "0.05%",
      tvl: pool.tvl * 0.8,
      volume24h: pool.volume24h * 0.6,
      apr: pool.apr * 0.7,
      trades: 800,
      avgTradeSize: 75000,
      efficiency: 78,
      competitiveness: 92,
      risk: "Low",
      description: "Most common tier, balanced",
    },
    {
      tier: 3000, // 0.3%
      name: "0.30%",
      tvl: pool.tvl,
      volume24h: pool.volume24h,
      apr: pool.apr,
      trades: 450,
      avgTradeSize: 120000,
      efficiency: 88,
      competitiveness: 95,
      risk: "Medium",
      description: "Standard tier, good balance",
      current: true,
    },
    {
      tier: 10000, // 1.0%
      name: "1.00%",
      tvl: pool.tvl * 0.4,
      volume24h: pool.volume24h * 1.2,
      apr: pool.apr * 1.4,
      trades: 200,
      avgTradeSize: 200000,
      efficiency: 92,
      competitiveness: 78,
      risk: "High",
      description: "Exotic pairs, high volatility",
    },
  ]

  // Generate performance data over time for each tier
  const generatePerformanceData = () => {
    const days = 7
    const data = []

    for (let i = days; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)

      const dataPoint: any = {
        date: date.toISOString().split("T")[0],
      }

      feeTiers.forEach((tier) => {
        const volatility = tier.tier === 100 ? 0.1 : tier.tier === 500 ? 0.15 : tier.tier === 3000 ? 0.2 : 0.3
        const noise = (Math.random() - 0.5) * volatility
        dataPoint[`apr_${tier.tier}`] = Math.max(0, tier.apr * (1 + noise))
      })

      data.push(dataPoint)
    }

    return data
  }

  const performanceData = generatePerformanceData()

  // Radar chart data for current pool
  const currentTier = feeTiers.find((t) => t.current) || feeTiers[2]
  const radarData = [
    { metric: "Efficiency", value: currentTier.efficiency, fullMark: 100 },
    { metric: "Competitiveness", value: currentTier.competitiveness, fullMark: 100 },
    {
      metric: "Volume",
      value: Math.min((currentTier.volume24h / Math.max(...feeTiers.map((t) => t.volume24h))) * 100, 100),
      fullMark: 100,
    },
    {
      metric: "TVL",
      value: Math.min((currentTier.tvl / Math.max(...feeTiers.map((t) => t.tvl))) * 100, 100),
      fullMark: 100,
    },
    {
      metric: "APR",
      value: Math.min((currentTier.apr / Math.max(...feeTiers.map((t) => t.apr))) * 100, 100),
      fullMark: 100,
    },
    {
      metric: "Activity",
      value: Math.min((currentTier.trades / Math.max(...feeTiers.map((t) => t.trades))) * 100, 100),
      fullMark: 100,
    },
  ]

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`
    }
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(1)}K`
    }
    return `$${value.toFixed(0)}`
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "Low":
        return "text-green-600"
      case "Medium":
        return "text-yellow-600"
      case "High":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  const getRiskVariant = (risk: string) => {
    switch (risk) {
      case "Low":
        return "default" as const
      case "Medium":
        return "secondary" as const
      case "High":
        return "destructive" as const
      default:
        return "outline" as const
    }
  }

  return (
    <div className="space-y-6">
      {/* Fee Tier Comparison Table */}
      <Card>
        <CardHeader>
          <CardTitle>Fee Tier Comparison</CardTitle>
          <CardDescription>
            Compare performance across different fee tiers for {pool.token0}/{pool.token1}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Fee Tier</th>
                  <th className="text-right p-2">TVL</th>
                  <th className="text-right p-2">Volume (24h)</th>
                  <th className="text-right p-2">APR</th>
                  <th className="text-right p-2">Trades</th>
                  <th className="text-right p-2">Efficiency</th>
                  <th className="text-center p-2">Risk</th>
                  <th className="text-center p-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {feeTiers.map((tier) => (
                  <tr key={tier.tier} className={`border-b ${tier.current ? "bg-muted/50" : ""}`}>
                    <td className="p-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{tier.name}</span>
                        {tier.current && (
                          <Badge variant="default" size="sm">
                            Current
                          </Badge>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">{tier.description}</div>
                    </td>
                    <td className="text-right p-2 font-mono">{formatCurrency(tier.tvl)}</td>
                    <td className="text-right p-2 font-mono">{formatCurrency(tier.volume24h)}</td>
                    <td className="text-right p-2">
                      <div className="flex items-center justify-end gap-1">
                        <span className="font-mono">{tier.apr.toFixed(2)}%</span>
                        {tier.apr > pool.apr && <TrendingUp className="h-3 w-3 text-green-500" />}
                        {tier.apr < pool.apr && <TrendingDown className="h-3 w-3 text-red-500" />}
                      </div>
                    </td>
                    <td className="text-right p-2 font-mono">{tier.trades}</td>
                    <td className="text-right p-2">
                      <div className="flex items-center justify-end gap-2">
                        <Progress value={tier.efficiency} className="w-12 h-2" />
                        <span className="text-xs font-mono w-8">{tier.efficiency}%</span>
                      </div>
                    </td>
                    <td className="text-center p-2">
                      <Badge variant={getRiskVariant(tier.risk)} className={getRiskColor(tier.risk)}>
                        {tier.risk}
                      </Badge>
                    </td>
                    <td className="text-center p-2">
                      {!tier.current && (
                        <Button variant="outline" size="sm">
                          Switch
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Performance Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Radar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Current Tier Performance</CardTitle>
            <CardDescription>Multi-dimensional analysis of {currentTier.name} fee tier</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="metric" className="text-xs" />
                  <PolarRadiusAxis
                    angle={90}
                    domain={[0, 100]}
                    className="text-xs"
                    tickFormatter={(value) => `${value}%`}
                  />
                  <Radar
                    name="Performance"
                    dataKey="value"
                    stroke="hsl(var(--primary))"
                    fill="hsl(var(--primary))"
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* APR Comparison Chart */}
        <Card>
          <CardHeader>
            <CardTitle>APR Performance Comparison</CardTitle>
            <CardDescription>7-day APR trends across fee tiers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    dataKey="date"
                    className="text-xs"
                    tickFormatter={(value) =>
                      new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                    }
                  />
                  <YAxis className="text-xs" tickFormatter={(value) => `${value.toFixed(1)}%`} />
                  <Tooltip
                    formatter={(value: any, name: string) => [
                      `${Number(value).toFixed(2)}%`,
                      feeTiers.find((t) => `apr_${t.tier}` === name)?.name || name,
                    ]}
                    labelFormatter={(value) => new Date(value).toLocaleDateString()}
                  />
                  {feeTiers.map((tier, index) => (
                    <Line
                      key={tier.tier}
                      type="monotone"
                      dataKey={`apr_${tier.tier}`}
                      stroke={`hsl(var(--chart-${index + 1}))`}
                      strokeWidth={tier.current ? 3 : 2}
                      dot={false}
                      strokeDasharray={tier.current ? "0" : "5 5"}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Optimization Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Optimization Recommendations
          </CardTitle>
          <CardDescription>AI-powered suggestions for fee tier optimization</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-4 w-4 text-yellow-500" />
                <span className="font-medium">Current Status</span>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                Your {currentTier.name} fee tier is performing well with {currentTier.efficiency}% efficiency.
              </p>
              <Badge variant="default">Optimal</Badge>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="h-4 w-4 text-green-500" />
                <span className="font-medium">Higher Yield Option</span>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                Consider 1.00% tier for {(((feeTiers[3].apr - currentTier.apr) / currentTier.apr) * 100).toFixed(1)}%
                higher APR, but with increased risk.
              </p>
              <Badge variant="secondary">
                +{(((feeTiers[3].apr - currentTier.apr) / currentTier.apr) * 100).toFixed(1)}% APR
              </Badge>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-4 w-4 text-blue-500" />
                <span className="font-medium">Lower Risk Option</span>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                0.05% tier offers more stability with {feeTiers[1].competitiveness}% competitiveness and lower
                volatility.
              </p>
              <Badge variant="outline">Stable</Badge>
            </div>
          </div>

          <div className="pt-4 border-t">
            <h4 className="font-medium mb-2">Key Insights:</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>
                • Your current {currentTier.name} tier captures{" "}
                {((currentTier.volume24h / feeTiers.reduce((sum, t) => sum + t.volume24h, 0)) * 100).toFixed(1)}% of
                total volume
              </li>
              <li>
                • Average trade size of {formatCurrency(currentTier.avgTradeSize)} indicates{" "}
                {currentTier.avgTradeSize > 100000 ? "institutional" : "retail"} activity
              </li>
              <li>
                • {currentTier.competitiveness}% competitiveness score suggests{" "}
                {currentTier.competitiveness > 90
                  ? "excellent"
                  : currentTier.competitiveness > 80
                    ? "good"
                    : "moderate"}{" "}
                market positioning
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
