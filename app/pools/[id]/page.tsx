"use client"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, ExternalLink, TrendingUp, TrendingDown } from "lucide-react"
import Link from "next/link"
import { PoolAnalytics } from "@/components/analytics/PoolAnalytics"

// Mock pool data - in real app this would come from API
const mockPool = {
  id: "uniswap-v3-usdc-eth-3000",
  token0: "USDC",
  token1: "ETH",
  feeTier: 3000,
  tvl: 45000000,
  volume24h: 12500000,
  apr: 8.45,
  fees24h: 37500,
  priceChange24h: 2.34,
  currentPrice: 1850.42,
}

export default function PoolDetailPage() {
  const params = useParams()
  const poolId = params.id as string

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

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Pools
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">
              {mockPool.token0}/{mockPool.token1}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline">Fee: {mockPool.feeTier / 10000}%</Badge>
              <Badge variant="outline">Uniswap V3</Badge>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <ExternalLink className="h-4 w-4 mr-2" />
            View on Uniswap
          </Button>
          <Button>Add Liquidity</Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Price</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${mockPool.currentPrice.toLocaleString()}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {mockPool.priceChange24h >= 0 ? (
                <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
              )}
              {mockPool.priceChange24h >= 0 ? "+" : ""}
              {mockPool.priceChange24h}% (24h)
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">TVL</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(mockPool.tvl)}</div>
            <div className="text-xs text-muted-foreground">Total Value Locked</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Volume (24h)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(mockPool.volume24h)}</div>
            <div className="text-xs text-muted-foreground">
              {((mockPool.volume24h / mockPool.tvl) * 100).toFixed(1)}% of TVL
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">APR</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPercent(mockPool.apr)}</div>
            <div className="text-xs text-muted-foreground">Annual Percentage Rate</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fees (24h)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(mockPool.fees24h)}</div>
            <div className="text-xs text-muted-foreground">
              {((mockPool.fees24h / mockPool.volume24h) * 100).toFixed(3)}% of volume
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Component */}
      <PoolAnalytics pool={mockPool} />
    </div>
  )
}
