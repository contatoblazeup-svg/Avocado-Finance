"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { usePoolHistoricalData } from "@/hooks/usePoolHistoricalData"
import type { Pool } from "@/types/pool"

interface PoolChartProps {
  pool: Pool
  className?: string
}

export function PoolChart({ pool, className = "" }: PoolChartProps) {
  const { historicalData, loading, error } = usePoolHistoricalData(pool.id, 30)

  if (loading) {
    return (
      <Card className={`bg-gray-800/50 border-gray-700 backdrop-blur-sm ${className}`}>
        <CardHeader>
          <CardTitle className="text-white">30-Day Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center">
            <div className="text-gray-400">Loading chart data...</div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className={`bg-gray-800/50 border-gray-700 backdrop-blur-sm ${className}`}>
        <CardHeader>
          <CardTitle className="text-white">30-Day Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center">
            <div className="text-red-400">Error loading chart data</div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const chartData = historicalData
    .map((day: any) => ({
      date: new Date(day.date * 1000).toLocaleDateString(),
      volume: Number.parseFloat(day.volumeUSD || "0") / 1000000, // Convert to millions
      tvl: Number.parseFloat(day.tvlUSD || "0") / 1000000,
      fees: Number.parseFloat(day.feesUSD || "0"),
    }))
    .reverse()

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 border border-gray-600 rounded-lg p-3 shadow-lg">
          <p className="text-white font-medium">{label}</p>
          <p className="text-blue-400">Volume: ${payload[0]?.value?.toFixed(2)}M</p>
          <p className="text-green-400">TVL: ${payload[1]?.value?.toFixed(2)}M</p>
        </div>
      )
    }
    return null
  }

  return (
    <Card className={`bg-gray-800/50 border-gray-700 backdrop-blur-sm ${className}`}>
      <CardHeader>
        <CardTitle className="text-white">30-Day Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis
                dataKey="date"
                stroke="#9CA3AF"
                fontSize={12}
                tickFormatter={(value) => {
                  const date = new Date(value)
                  return `${date.getMonth() + 1}/${date.getDate()}`
                }}
              />
              <YAxis stroke="#9CA3AF" fontSize={12} />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="volume"
                stroke="#3B82F6"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: "#3B82F6" }}
              />
              <Line
                type="monotone"
                dataKey="tvl"
                stroke="#10B981"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: "#10B981" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="flex items-center justify-center space-x-6 mt-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-gray-400 text-sm">Volume ($M)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-gray-400 text-sm">TVL ($M)</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
