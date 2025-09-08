import type React from "react"
import { Card, CardContent } from "@/components/ui/card"

interface MetricsCardProps {
  title: string
  value: string
  subtitle?: string
  subtitleValue?: string
  progress?: number
  progressLabels?: [string, string]
  trend?: "up" | "down" | "neutral"
  icon: React.ReactNode
}

export function MetricsCard({
  title,
  value,
  subtitle,
  subtitleValue,
  progress,
  progressLabels,
  trend = "neutral",
  icon,
}: MetricsCardProps) {
  const formatValue = (val: string) => {
    const num = Number.parseFloat(val.replace(/[^0-9.-]/g, ""))
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}t`
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}b`
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}m`
    if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}k`
    return val
  }

  const getTrendColor = () => {
    switch (trend) {
      case "up":
        return "text-green-500"
      case "down":
        return "text-red-500"
      default:
        return "text-gray-400"
    }
  }

  const getProgressGradient = () => {
    if (title.includes("Fear")) {
      return "bg-gradient-to-r from-red-500 via-yellow-500 to-green-500"
    }
    return "bg-gradient-to-r from-orange-500 via-purple-500 to-blue-500"
  }

  return (
    <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm hover:bg-gray-800/70 transition-all duration-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-gray-400 text-sm font-medium">{title}</h3>
          <div className={getTrendColor()}>{icon}</div>
        </div>

        <div className="text-2xl font-bold text-white mb-1">{title.includes("Index") ? value : formatValue(value)}</div>

        {subtitle && (
          <div className="flex items-center text-sm mb-2">
            <span className="text-gray-500">{subtitle}</span>
          </div>
        )}

        {subtitleValue && (
          <div className={`text-sm ${getTrendColor()}`}>
            {title.includes("Index") ? subtitleValue : formatValue(subtitleValue)}
          </div>
        )}

        {progress !== undefined && progressLabels && (
          <div className="mt-3">
            <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
              <div className={`${getProgressGradient()} h-2 rounded-full relative`} style={{ width: "100%" }}>
                <div
                  className="absolute top-0 w-3 h-3 bg-white rounded-full transform -translate-y-0.5 shadow-lg"
                  style={{ left: `${progress}%` }}
                />
              </div>
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>{progressLabels[0]}</span>
              <span>{progressLabels[1]}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
