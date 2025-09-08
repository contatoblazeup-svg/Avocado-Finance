"use client"

import { useState, useMemo } from "react"
import { PriceHeader } from "@/components/PriceHeader"
import { TokenPrice } from "@/components/TokenPrice"
import { MobileFilters } from "@/components/MobileFilters"
import { TVLRangeFilter } from "@/components/TVLRangeFilter"
import { PoolCardMobile } from "@/components/PoolCardMobile"
import { PoolAnalytics } from "@/components/analytics/PoolAnalytics"
import { useCoinGeckoPrice } from "@/hooks/useCoinGeckoPrice"
import { usePoolCache } from "@/hooks/usePoolCache"
import { Navbar } from "@/components/navigation/navbar"
import { Loading, PoolCardSkeleton } from "@/components/ui/loading"
import { ErrorMessage } from "@/components/ui/error-boundary"
import { useToast } from "@/hooks/use-toast"

interface Token {
  id: string
  symbol: string
  name: string
  decimals: string
}

interface PoolDayData {
  date: number
  volumeUSD: string
  tvlUSD: string
  feesUSD: string
}

interface Pool {
  id: string
  token0: Token
  token1: Token
  feeTier: string
  liquidity: string
  sqrtPrice: string
  tick: string
  token0Price: string
  token1Price: string
  volumeUSD: string
  txCount: string
  totalValueLockedUSD: string
  totalValueLockedToken0: string
  totalValueLockedToken1: string
  createdAtTimestamp: string
  poolDayData: PoolDayData[]
}

interface Filters {
  search: string
  minTVL: number
  maxTVL: number
  feeTiers: string[]
  sortBy: "tvl" | "volume" | "apr"
  sortDirection: "asc" | "desc"
}

export default function PoolDiscovery() {
  const [selectedPool, setSelectedPool] = useState<Pool | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [showAnalytics, setShowAnalytics] = useState(false)
  const [filters, setFilters] = useState<Filters>({
    search: "",
    minTVL: 0,
    maxTVL: 0,
    feeTiers: [],
    sortBy: "tvl",
    sortDirection: "desc",
  })

  const { toast } = useToast()

  // Generate more realistic fallback data
  const generateFallbackPools = (): Pool[] => {
    const currentTime = Math.floor(Date.now() / 1000)
    const yesterday = currentTime - 86400
    const twoDaysAgo = currentTime - 172800

    return [
      {
        id: "0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640",
        token0: { id: "0xa0b86a33e6776e681c6c5b7f4b8b8b8b8b8b8b8b", symbol: "USDC", name: "USD Coin", decimals: "6" },
        token1: {
          id: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
          symbol: "WETH",
          name: "Wrapped Ether",
          decimals: "18",
        },
        feeTier: "500",
        liquidity: "38472847293847",
        sqrtPrice: "1987234872394",
        tick: "201245",
        token0Price: "0.0003125",
        token1Price: "3200.45",
        volumeUSD: "127543210.50",
        txCount: "4847",
        totalValueLockedUSD: "445678901.25",
        totalValueLockedToken0: "139543210",
        totalValueLockedToken1: "139823",
        createdAtTimestamp: "1620259200",
        poolDayData: [
          { date: currentTime, volumeUSD: "127543210", tvlUSD: "445678901", feesUSD: "637716" },
          { date: yesterday, volumeUSD: "119341567", tvlUSD: "443567890", feesUSD: "596708" },
          { date: twoDaysAgo, volumeUSD: "115234567", tvlUSD: "441234567", feesUSD: "576173" },
        ],
      },
      {
        id: "0xcbcdf9626bc03e24f779434178a73a0b4bad62ed",
        token0: {
          id: "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599",
          symbol: "WBTC",
          name: "Wrapped Bitcoin",
          decimals: "8",
        },
        token1: {
          id: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
          symbol: "WETH",
          name: "Wrapped Ether",
          decimals: "18",
        },
        feeTier: "3000",
        liquidity: "12847293847",
        sqrtPrice: "987234872394",
        tick: "-54321",
        token0Price: "18.75",
        token1Price: "0.0533",
        volumeUSD: "89678901.75",
        txCount: "2234",
        totalValueLockedUSD: "298789012.50",
        totalValueLockedToken0: "4456",
        totalValueLockedToken1: "83578",
        createdAtTimestamp: "1620259200",
        poolDayData: [
          { date: currentTime, volumeUSD: "89678901", tvlUSD: "298789012", feesUSD: "2690367" },
          { date: yesterday, volumeUSD: "85567890", tvlUSD: "296234567", feesUSD: "2567037" },
          { date: twoDaysAgo, volumeUSD: "82345678", tvlUSD: "294567890", feesUSD: "2470370" },
        ],
      },
      {
        id: "0x6c6bc977e13df9b0de53b251522280bb72383700",
        token0: {
          id: "0x6b175474e89094c44da98b954eedeac495271d0f",
          symbol: "DAI",
          name: "Dai Stablecoin",
          decimals: "18",
        },
        token1: { id: "0xa0b86a33e6776e681c6c5b7f4b8b8b8b8b8b8b8b", symbol: "USDC", name: "USD Coin", decimals: "6" },
        feeTier: "100",
        liquidity: "98472847293",
        sqrtPrice: "79228162514264",
        tick: "0",
        token0Price: "1.0001",
        token1Price: "0.9999",
        volumeUSD: "156456789.25",
        txCount: "8678",
        totalValueLockedUSD: "234012345.75",
        totalValueLockedToken0: "117006172",
        totalValueLockedToken1: "117006173",
        createdAtTimestamp: "1620259200",
        poolDayData: [
          { date: currentTime, volumeUSD: "156456789", tvlUSD: "234012345", feesUSD: "156457" },
          { date: yesterday, volumeUSD: "149345678", tvlUSD: "232567890", feesUSD: "149346" },
          { date: twoDaysAgo, volumeUSD: "145234567", tvlUSD: "231234567", feesUSD: "145235" },
        ],
      },
      {
        id: "0x4e68ccd3e89f51c3074ca5072bbac773960dfa36",
        token0: {
          id: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
          symbol: "WETH",
          name: "Wrapped Ether",
          decimals: "18",
        },
        token1: { id: "0xdac17f958d2ee523a2206206994597c13d831ec7", symbol: "USDT", name: "Tether USD", decimals: "6" },
        feeTier: "3000",
        liquidity: "15847293847",
        sqrtPrice: "1987234872394",
        tick: "201245",
        token0Price: "3201.25",
        token1Price: "0.0003124",
        volumeUSD: "98890123.50",
        txCount: "3876",
        totalValueLockedUSD: "187567890.25",
        totalValueLockedToken0: "58589",
        totalValueLockedToken1: "187567890",
        createdAtTimestamp: "1620259200",
        poolDayData: [
          { date: currentTime, volumeUSD: "98890123", tvlUSD: "187567890", feesUSD: "2966704" },
          { date: yesterday, volumeUSD: "94432109", tvlUSD: "185456789", feesUSD: "2832963" },
          { date: twoDaysAgo, volumeUSD: "91234567", tvlUSD: "183345678", feesUSD: "2737037" },
        ],
      },
      {
        id: "0x1d42064fc4beb5f8aaf85f4617ae8b3b5b8bd801",
        token0: { id: "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984", symbol: "UNI", name: "Uniswap", decimals: "18" },
        token1: {
          id: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
          symbol: "WETH",
          name: "Wrapped Ether",
          decimals: "18",
        },
        feeTier: "3000",
        liquidity: "8472847293",
        sqrtPrice: "987234872394",
        tick: "-12345",
        token0Price: "0.00234",
        token1Price: "427.35",
        volumeUSD: "34345678.90",
        txCount: "1987",
        totalValueLockedUSD: "78678901.25",
        totalValueLockedToken0: "18876543",
        totalValueLockedToken1: "18689",
        createdAtTimestamp: "1620259200",
        poolDayData: [
          { date: currentTime, volumeUSD: "34345678", tvlUSD: "78678901", feesUSD: "1030370" },
          { date: yesterday, volumeUSD: "32234567", tvlUSD: "77567890", feesUSD: "967037" },
          { date: twoDaysAgo, volumeUSD: "31123456", tvlUSD: "76456789", feesUSD: "933704" },
        ],
      },
      {
        id: "0x514910771af9ca656af840dff83e8264ecf986ca",
        token0: { id: "0x514910771af9ca656af840dff83e8264ecf986ca", symbol: "LINK", name: "Chainlink", decimals: "18" },
        token1: {
          id: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
          symbol: "WETH",
          name: "Wrapped Ether",
          decimals: "18",
        },
        feeTier: "3000",
        liquidity: "6472847293",
        sqrtPrice: "887234872394",
        tick: "-23456",
        token0Price: "0.00456",
        token1Price: "219.30",
        volumeUSD: "23901234.56",
        txCount: "1654",
        totalValueLockedUSD: "56109876.50",
        totalValueLockedToken0: "12345678",
        totalValueLockedToken1: "12821",
        createdAtTimestamp: "1620259200",
        poolDayData: [
          { date: currentTime, volumeUSD: "23901234", tvlUSD: "56109876", feesUSD: "717037" },
          { date: yesterday, volumeUSD: "22567890", tvlUSD: "55876543", feesUSD: "677037" },
          { date: twoDaysAgo, volumeUSD: "21456789", tvlUSD: "54765432", feesUSD: "643704" },
        ],
      },
      {
        id: "0x7bea39867e4169dbe237d55c8242a8f2fcdcc387",
        token0: {
          id: "0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9",
          symbol: "AAVE",
          name: "Aave Token",
          decimals: "18",
        },
        token1: {
          id: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
          symbol: "WETH",
          name: "Wrapped Ether",
          decimals: "18",
        },
        feeTier: "3000",
        liquidity: "4472847293",
        sqrtPrice: "687234872394",
        tick: "-34567",
        token0Price: "0.0234",
        token1Price: "42.75",
        volumeUSD: "12345678.90",
        txCount: "987",
        totalValueLockedUSD: "34567890.25",
        totalValueLockedToken0: "808543",
        totalValueLockedToken1: "8089",
        createdAtTimestamp: "1620259200",
        poolDayData: [
          { date: currentTime, volumeUSD: "12345678", tvlUSD: "34567890", feesUSD: "370370" },
          { date: yesterday, volumeUSD: "11234567", tvlUSD: "33456789", feesUSD: "337037" },
          { date: twoDaysAgo, volumeUSD: "10876543", tvlUSD: "32345678", feesUSD: "326296" },
        ],
      },
      {
        id: "0x99ac8ca7087fa4a2a1fb6357269965a2014abc35",
        token0: {
          id: "0x0bc529c00c6401aef6d220be8c6ea1667f6ad93e",
          symbol: "YFI",
          name: "yearn.finance",
          decimals: "18",
        },
        token1: {
          id: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
          symbol: "WETH",
          name: "Wrapped Ether",
          decimals: "18",
        },
        feeTier: "3000",
        liquidity: "2472847293",
        sqrtPrice: "487234872394",
        tick: "-45678",
        token0Price: "1.875",
        token1Price: "0.533",
        volumeUSD: "8901234.56",
        txCount: "543",
        totalValueLockedUSD: "23456789.50",
        totalValueLockedToken0: "12506",
        totalValueLockedToken1: "7321",
        createdAtTimestamp: "1620259200",
        poolDayData: [
          { date: currentTime, volumeUSD: "8901234", tvlUSD: "23456789", feesUSD: "267037" },
          { date: yesterday, volumeUSD: "8567890", tvlUSD: "22876543", feesUSD: "257037" },
          { date: twoDaysAgo, volumeUSD: "8234567", tvlUSD: "22345678", feesUSD: "247037" },
        ],
      },
    ]
  }

  // Use cached pool data
  const {
    data: pools,
    loading,
    error,
    lastUpdated,
    refresh: refreshPools,
  } = usePoolCache("uniswap_pools", generateFallbackPools, [])

  // Get all unique token symbols from pools
  const tokenSymbols = useMemo(() => {
    if (!pools) return []
    const symbols = new Set<string>()
    pools.forEach((pool) => {
      symbols.add(pool.token0.symbol)
      symbols.add(pool.token1.symbol)
    })
    return Array.from(symbols)
  }, [pools])

  // Fetch token prices
  const { prices: tokenPrices } = useCoinGeckoPrice(tokenSymbols)

  // Inline utility functions
  const formatNumber = (value: string | number): string => {
    const num = typeof value === "string" ? Number.parseFloat(value) : value
    if (isNaN(num)) return "$0.00"
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`
    if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`
    return `$${num.toFixed(2)}`
  }

  const formatPercentage = (value: number): string => {
    if (isNaN(value)) return "0.00%"
    return `${value.toFixed(2)}%`
  }

  const calculateAPR = (pool: Pool): number => {
    if (!pool.poolDayData || pool.poolDayData.length === 0) return 0
    const recentDays = pool.poolDayData.slice(0, 7)
    const totalFees = recentDays.reduce((sum, day) => {
      const fees = Number.parseFloat(day.feesUSD || "0")
      return sum + (isNaN(fees) ? 0 : fees)
    }, 0)
    const avgTVL =
      recentDays.reduce((sum, day) => {
        const tvl = Number.parseFloat(day.tvlUSD || pool.totalValueLockedUSD || "0")
        return sum + (isNaN(tvl) ? 0 : tvl)
      }, 0) / recentDays.length
    if (avgTVL === 0) return 0
    const weeklyAPR = (totalFees / avgTVL) * 100
    return weeklyAPR * 52 // Annualized
  }

  const getFeeTierColor = (feeTier: string): string => {
    switch (feeTier) {
      case "100":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      case "500":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "3000":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "10000":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  const getFeeTierLabel = (feeTier: string): string => {
    const tier = Number.parseInt(feeTier) / 10000
    return `${tier}%`
  }

  // Filter pools
  const filteredPools = useMemo(() => {
    if (!pools) return []
    let filtered = [...pools]

    // Search filter
    if (filters.search) {
      const search = filters.search.toLowerCase()
      filtered = filtered.filter(
        (pool) =>
          pool.token0.symbol.toLowerCase().includes(search) ||
          pool.token1.symbol.toLowerCase().includes(search) ||
          pool.token0.name.toLowerCase().includes(search) ||
          pool.token1.name.toLowerCase().includes(search),
      )
    }

    // TVL filter
    if (filters.minTVL > 0) {
      filtered = filtered.filter((pool) => Number.parseFloat(pool.totalValueLockedUSD) >= filters.minTVL)
    }
    if (filters.maxTVL > 0) {
      filtered = filtered.filter((pool) => Number.parseFloat(pool.totalValueLockedUSD) <= filters.maxTVL)
    }

    // Fee tier filter
    if (filters.feeTiers.length > 0) {
      filtered = filtered.filter((pool) => filters.feeTiers.includes(pool.feeTier))
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue: number, bValue: number

      switch (filters.sortBy) {
        case "volume":
          aValue = Number.parseFloat(a.volumeUSD)
          bValue = Number.parseFloat(b.volumeUSD)
          break
        case "apr":
          aValue = calculateAPR(a)
          bValue = calculateAPR(b)
          break
        default:
          aValue = Number.parseFloat(a.totalValueLockedUSD)
          bValue = Number.parseFloat(b.totalValueLockedUSD)
      }

      return filters.sortDirection === "desc" ? bValue - aValue : aValue - bValue
    })

    return filtered
  }, [pools, filters])

  const FEE_TIERS = [
    { value: "100", label: "0.01%", color: "bg-blue-500" },
    { value: "500", label: "0.05%", color: "bg-green-500" },
    { value: "3000", label: "0.30%", color: "bg-yellow-500" },
    { value: "10000", label: "1.00%", color: "bg-red-500" },
  ]

  const resetFilters = () => {
    setFilters({
      search: "",
      minTVL: 0,
      maxTVL: 0,
      feeTiers: [],
      sortBy: "tvl",
      sortDirection: "desc",
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-gray-900">
        <Navbar />
        <PriceHeader />
        <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="text-center mb-8">
            <Loading size="lg" text="Loading DeFi pools... 🚀" />
            <p className="text-gray-400 mt-4">Fetching live data from Uniswap V3</p>
          </div>

          <div className="grid md:grid-cols-2 xl:grid-cols-2 gap-4 sm:gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <PoolCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-gray-900">
        <Navbar />
        <div className="container mx-auto px-4 sm:px-6 py-6">
          <ErrorMessage error={error} onRetry={refreshPools} className="max-w-2xl mx-auto" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-gray-900">
      {/* Navbar */}
      <Navbar />

      {/* Price Header */}
      <PriceHeader />

      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Hero Section */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Discover High-Performing
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">
              {" "}
              Liquidity Pools
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-300 mb-6 sm:mb-8 max-w-3xl mx-auto px-4">
            Advanced analytics with historical APR tracking, volume pattern analysis, and comprehensive fee tier
            comparison.
          </p>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto mb-6 sm:mb-8">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-gray-700/50">
              <div className="text-xl sm:text-2xl font-bold text-white mb-2">{filteredPools.length}</div>
              <div className="text-gray-400 text-sm sm:text-base">Advanced Analytics</div>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-gray-700/50">
              <div className="text-xl sm:text-2xl font-bold text-white mb-2">Live</div>
              <div className="text-gray-400 text-sm sm:text-base">Performance Data</div>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-gray-700/50">
              <div className="text-xl sm:text-2xl font-bold text-white mb-2">Smart</div>
              <div className="text-gray-400 text-sm sm:text-base">Fee Analysis</div>
            </div>
          </div>
        </div>

        {/* Status Alert */}
        <div className="mb-6 bg-blue-900/20 border border-blue-500/50 rounded-lg p-4">
          <div className="flex items-start space-x-2">
            <svg
              className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div className="text-blue-200 text-sm sm:text-base">
              <strong>Advanced Analytics:</strong> Historical APR tracking, volume pattern analysis, fee tier
              optimization, and liquidity distribution insights with professional-grade charts.
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Desktop Filters Sidebar */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="bg-gray-800/50 border border-gray-700 backdrop-blur-sm rounded-lg sticky top-24">
              <div className="p-6">
                <div className="flex items-center space-x-2 mb-6">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z"
                    />
                  </svg>
                  <h3 className="text-white font-semibold">Filters</h3>
                </div>

                <div className="space-y-6">
                  {/* Search */}
                  <div>
                    <label className="text-gray-400 text-sm mb-2 block">Search Token</label>
                    <input
                      type="text"
                      placeholder="ETH, USDC, etc..."
                      className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                      value={filters.search}
                      onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    />
                  </div>

                  {/* Sort Options */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-gray-400 text-sm mb-2 block">Sort by</label>
                      <select
                        className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                        value={filters.sortBy}
                        onChange={(e) => setFilters({ ...filters, sortBy: e.target.value as any })}
                      >
                        <option value="tvl">TVL</option>
                        <option value="volume">Volume</option>
                        <option value="apr">APR</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-gray-400 text-sm mb-2 block">Direction</label>
                      <select
                        className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                        value={filters.sortDirection}
                        onChange={(e) => setFilters({ ...filters, sortDirection: e.target.value as any })}
                      >
                        <option value="desc">High to Low</option>
                        <option value="asc">Low to High</option>
                      </select>
                    </div>
                  </div>

                  {/* TVL Range */}
                  <TVLRangeFilter
                    minTVL={filters.minTVL}
                    maxTVL={filters.maxTVL}
                    onRangeChange={(min, max) => setFilters({ ...filters, minTVL: min, maxTVL: max })}
                  />

                  {/* Fee Tiers */}
                  <div>
                    <label className="text-gray-400 text-sm mb-3 block">Fee Tiers</label>
                    <div className="flex flex-wrap gap-2">
                      {FEE_TIERS.map((tier) => (
                        <button
                          key={tier.value}
                          onClick={() => {
                            const newFeeTiers = filters.feeTiers.includes(tier.value)
                              ? filters.feeTiers.filter((t) => t !== tier.value)
                              : [...filters.feeTiers, tier.value]
                            setFilters({ ...filters, feeTiers: newFeeTiers })
                          }}
                          className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                            filters.feeTiers.includes(tier.value)
                              ? `${tier.color} text-white`
                              : "border border-gray-600 text-gray-300 hover:bg-gray-700"
                          }`}
                        >
                          {tier.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Reset Button */}
                  <button
                    onClick={resetFilters}
                    className="w-full px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-all"
                  >
                    Reset Filters
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Pools Grid */}
          <div className="lg:col-span-3">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-white">{filteredPools.length} Advanced Analytics</h2>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                {/* Mobile Filters */}
                <MobileFilters filters={filters} onFiltersChange={setFilters} onReset={resetFilters} />

                <button
                  onClick={refreshPools}
                  disabled={loading}
                  className="px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-all disabled:opacity-50 flex-shrink-0"
                >
                  <svg
                    className={`h-4 w-4 inline mr-2 ${loading ? "animate-spin" : ""}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  <span className="hidden sm:inline">Refresh</span>
                </button>
              </div>
            </div>

            {/* Responsive Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-4 sm:gap-6">
              {filteredPools.map((pool) => {
                const tvl = Number.parseFloat(pool.totalValueLockedUSD || "0")
                const volume24h = Number.parseFloat(pool.volumeUSD || "0")
                const apr = calculateAPR(pool)
                const fees24h = pool.poolDayData?.[0] ? Number.parseFloat(pool.poolDayData[0].feesUSD || "0") : 0

                // Get token prices
                const token0Price = tokenPrices[pool.token0.symbol.toUpperCase()]
                const token1Price = tokenPrices[pool.token1.symbol.toUpperCase()]

                return (
                  <div key={pool.id} className="block sm:hidden">
                    {/* Mobile Card */}
                    <PoolCardMobile
                      pool={pool}
                      tokenPrices={tokenPrices}
                      onAnalyze={() => {
                        setSelectedPool(pool)
                        setShowAnalytics(true)
                      }}
                      formatNumber={formatNumber}
                      formatPercentage={formatPercentage}
                      calculateAPR={calculateAPR}
                      getFeeTierColor={getFeeTierColor}
                      getFeeTierLabel={getFeeTierLabel}
                    />
                  </div>
                )
              })}

              {/* Desktop Cards */}
              {filteredPools.map((pool) => {
                const tvl = Number.parseFloat(pool.totalValueLockedUSD || "0")
                const volume24h = Number.parseFloat(pool.volumeUSD || "0")
                const apr = calculateAPR(pool)
                const fees24h = pool.poolDayData?.[0] ? Number.parseFloat(pool.poolDayData[0].feesUSD || "0") : 0

                // Get token prices
                const token0Price = tokenPrices[pool.token0.symbol.toUpperCase()]
                const token1Price = tokenPrices[pool.token1.symbol.toUpperCase()]

                return (
                  <div key={pool.id} className="hidden sm:block">
                    {/* Desktop Card */}
                    <div
                      className="group bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50 backdrop-blur-sm hover:from-gray-700/50 hover:to-gray-800/50 transition-all duration-300 cursor-pointer hover:scale-[1.02] hover:shadow-xl hover:shadow-green-500/10 rounded-lg"
                      onClick={() => {
                        setSelectedPool(pool)
                        setShowModal(true)
                      }}
                    >
                      <div className="p-6">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="flex -space-x-2">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white text-sm font-bold border-2 border-gray-800 shadow-lg">
                                {pool.token0.symbol[0]}
                              </div>
                              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold border-2 border-gray-800 shadow-lg">
                                {pool.token1.symbol[0]}
                              </div>
                            </div>
                            <div>
                              <h3 className="text-lg font-bold text-white group-hover:text-green-400 transition-colors">
                                {pool.token0.symbol}/{pool.token1.symbol}
                              </h3>
                              <div className="flex items-center gap-2">
                                <span
                                  className={`px-2 py-1 rounded text-xs font-medium border ${getFeeTierColor(
                                    pool.feeTier,
                                  )}`}
                                >
                                  {getFeeTierLabel(pool.feeTier)}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="text-xl font-bold text-green-400">{formatPercentage(apr)}</div>
                            <div className="text-xs text-gray-400">APR</div>
                          </div>
                        </div>

                        {/* Token Prices */}
                        <div className="grid grid-cols-2 gap-3 mb-4">
                          <div className="bg-gray-700/20 backdrop-blur-sm p-2 rounded-lg">
                            <div className="text-xs text-gray-400 mb-1">{pool.token0.symbol}</div>
                            <TokenPrice
                              symbol={pool.token0.symbol}
                              price={token0Price?.current_price}
                              change24h={token0Price?.price_change_percentage_24h}
                              className="text-xs"
                            />
                          </div>
                          <div className="bg-gray-700/20 backdrop-blur-sm p-2 rounded-lg">
                            <div className="text-xs text-gray-400 mb-1">{pool.token1.symbol}</div>
                            <TokenPrice
                              symbol={pool.token1.symbol}
                              price={token1Price?.current_price}
                              change24h={token1Price?.price_change_percentage_24h}
                              className="text-xs"
                            />
                          </div>
                        </div>

                        {/* Metrics Grid */}
                        <div className="grid grid-cols-2 gap-3 mb-4">
                          <div className="bg-gray-700/30 backdrop-blur-sm p-3 rounded-lg border border-gray-600/30">
                            <div className="text-xs text-gray-400 font-medium mb-1">TVL</div>
                            <div className="text-sm font-bold text-white">{formatNumber(tvl)}</div>
                          </div>
                          <div className="bg-gray-700/30 backdrop-blur-sm p-3 rounded-lg border border-gray-600/30">
                            <div className="text-xs text-gray-400 font-medium mb-1">24h Volume</div>
                            <div className="text-sm font-bold text-white">{formatNumber(volume24h)}</div>
                          </div>
                        </div>

                        {/* Additional Metrics */}
                        <div className="bg-gray-700/30 backdrop-blur-sm p-3 rounded-lg border border-gray-600/30 mb-4">
                          <div className="flex items-center justify-between">
                            <div className="text-xs text-gray-400 font-medium">24h Fees</div>
                            <div className="text-sm font-bold text-white">{formatNumber(fees24h)}</div>
                          </div>
                        </div>

                        {/* Performance Indicator */}
                        <div className="flex items-center justify-between text-sm mb-4">
                          <span className="text-gray-400">Performance</span>
                          <div className="flex items-center gap-2">
                            <div className="w-20 h-2 bg-gray-700 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-500"
                                style={{ width: `${Math.min(Math.max(apr * 2, 5), 100)}%` }}
                              />
                            </div>
                            <span
                              className={`font-medium text-xs ${
                                apr > 20
                                  ? "text-green-400"
                                  : apr > 10
                                    ? "text-yellow-400"
                                    : apr > 5
                                      ? "text-orange-400"
                                      : "text-red-400"
                              }`}
                            >
                              {apr > 20 ? "Excellent" : apr > 10 ? "High" : apr > 5 ? "Medium" : "Low"}
                            </span>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedPool(pool)
                              setShowAnalytics(true)
                            }}
                            className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white text-sm px-4 py-2 rounded-lg font-medium transition-all"
                          >
                            <svg className="h-4 w-4 mr-2 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                              />
                            </svg>
                            Advanced Analytics
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              window.open(`https://info.uniswap.org/#/pools/${pool.id}`, "_blank")
                            }}
                            className="border border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent text-sm px-3 py-2 rounded-lg transition-all"
                          >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {filteredPools.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 text-lg mb-4">No pools match your filters. Try adjusting them!</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Advanced Analytics Modal */}
      {showAnalytics && selectedPool && (
        <PoolAnalytics
          pool={selectedPool}
          onClose={() => {
            setShowAnalytics(false)
            setSelectedPool(null)
          }}
        />
      )}

      {/* Basic Modal */}
      {showModal && selectedPool && !showAnalytics && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                      {selectedPool.token0.symbol[0]}
                    </div>
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold -ml-2">
                      {selectedPool.token1.symbol[0]}
                    </div>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      {selectedPool.token0.symbol}/{selectedPool.token1.symbol}
                    </h2>
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs font-medium border ${getFeeTierColor(
                        selectedPool.feeTier,
                      )}`}
                    >
                      {getFeeTierLabel(selectedPool.feeTier)}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Token Prices in Modal */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <div className="text-gray-400 text-sm mb-2">{selectedPool.token0.name}</div>
                  <TokenPrice
                    symbol={selectedPool.token0.symbol}
                    price={tokenPrices[selectedPool.token0.symbol.toUpperCase()]?.current_price}
                    change24h={tokenPrices[selectedPool.token0.symbol.toUpperCase()]?.price_change_percentage_24h}
                  />
                </div>
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <div className="text-gray-400 text-sm mb-2">{selectedPool.token1.name}</div>
                  <TokenPrice
                    symbol={selectedPool.token1.symbol}
                    price={tokenPrices[selectedPool.token1.symbol.toUpperCase()]?.current_price}
                    change24h={tokenPrices[selectedPool.token1.symbol.toUpperCase()]?.price_change_percentage_24h}
                  />
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <button
                  onClick={() => {
                    setShowModal(false)
                    setShowAnalytics(true)
                  }}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-4 py-3 rounded-lg font-medium transition-all"
                >
                  <svg className="h-5 w-5 mr-2 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                  Open Advanced Analytics
                </button>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => window.open(`https://app.uniswap.org/#/pools/${selectedPool.id}`, "_blank")}
                    className="border border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent px-4 py-2 rounded-lg transition-all"
                  >
                    Trade on Uniswap
                  </button>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(selectedPool.id)
                      toast({
                        title: "Address copied!",
                        description: "Pool address has been copied to clipboard.",
                        variant: "success",
                      })
                    }}
                    className="border border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent px-4 py-2 rounded-lg transition-all"
                  >
                    Copy Address
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
