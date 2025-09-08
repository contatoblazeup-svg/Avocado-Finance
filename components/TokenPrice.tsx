"use client"

import { TrendingUp, TrendingDown } from "lucide-react"

interface TokenPriceProps {
  symbol: string
  price?: number
  change24h?: number
  className?: string
}

export function TokenPrice({ symbol, price, change24h, className = "" }: TokenPriceProps) {
  if (!price) return null

  const formatPrice = (price: number) => {
    if (price >= 1000) return `$${price.toLocaleString(undefined, { maximumFractionDigits: 2 })}`
    if (price >= 1) return `$${price.toFixed(2)}`
    if (price >= 0.01) return `$${price.toFixed(4)}`
    return `$${price.toFixed(6)}`
  }

  const formatChange = (change: number) => {
    const abs = Math.abs(change)
    return `${change >= 0 ? "+" : ""}${abs.toFixed(2)}%`
  }

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className="text-white font-medium">{formatPrice(price)}</div>
      {change24h !== undefined && (
        <div className={`flex items-center space-x-1 text-xs ${change24h >= 0 ? "text-green-400" : "text-red-400"}`}>
          {change24h >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
          <span>{formatChange(change24h)}</span>
        </div>
      )}
    </div>
  )
}
