"use client"

import { useState, useEffect } from "react"

interface TokenPrice {
  id: string
  symbol: string
  name: string
  current_price: number
  price_change_percentage_24h: number
  market_cap: number
  total_volume: number
  image: string
}

interface CacheItem {
  data: TokenPrice[]
  timestamp: number
}

const CACHE_KEY = "coingecko_prices"
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

export function useCoinGeckoPrice(tokenSymbols: string[]) {
  const [prices, setPrices] = useState<Record<string, TokenPrice>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  // Token symbol to CoinGecko ID mapping
  const symbolToId: Record<string, string> = {
    WETH: "ethereum",
    ETH: "ethereum",
    USDC: "usd-coin",
    USDT: "tether",
    WBTC: "wrapped-bitcoin",
    DAI: "dai",
    UNI: "uniswap",
    LINK: "chainlink",
    AAVE: "aave",
    YFI: "yearn-finance",
    MATIC: "matic-network",
    CRV: "curve-dao-token",
    COMP: "compound-governance-token",
    MKR: "maker",
    SNX: "havven",
  }

  // Cache management
  const getCachedData = (): TokenPrice[] | null => {
    try {
      const cached = localStorage.getItem(CACHE_KEY)
      if (!cached) return null

      const cacheItem: CacheItem = JSON.parse(cached)
      const now = Date.now()

      if (now - cacheItem.timestamp > CACHE_DURATION) {
        localStorage.removeItem(CACHE_KEY)
        return null
      }

      return cacheItem.data
    } catch {
      return null
    }
  }

  const setCachedData = (data: TokenPrice[]) => {
    try {
      const cacheItem: CacheItem = {
        data,
        timestamp: Date.now(),
      }
      localStorage.setItem(CACHE_KEY, JSON.stringify(cacheItem))
    } catch {
      // Ignore cache errors
    }
  }

  const fetchPrices = async () => {
    try {
      setLoading(true)
      setError(null)

      // Check cache first
      const cachedData = getCachedData()
      if (cachedData && cachedData.length > 0) {
        const priceMap = cachedData.reduce(
          (acc, token) => {
            acc[token.symbol.toUpperCase()] = token
            return acc
          },
          {} as Record<string, TokenPrice>,
        )
        setPrices(priceMap)
        setLastUpdated(new Date())
        setLoading(false)
        return
      }

      // Get unique CoinGecko IDs
      const coinGeckoIds = Array.from(
        new Set(tokenSymbols.map((symbol) => symbolToId[symbol.toUpperCase()]).filter(Boolean)),
      )

      if (coinGeckoIds.length === 0) {
        setLoading(false)
        return
      }

      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${coinGeckoIds.join(
          ",",
        )}&order=market_cap_desc&per_page=50&page=1&sparkline=false&price_change_percentage=24h`,
        {
          headers: {
            Accept: "application/json",
          },
        },
      )

      if (!response.ok) {
        throw new Error(`CoinGecko API error: ${response.status}`)
      }

      const data: TokenPrice[] = await response.json()

      // Cache the data
      setCachedData(data)

      // Convert to symbol-based mapping
      const priceMap = data.reduce(
        (acc, token) => {
          // Map back to symbols
          const symbols = Object.entries(symbolToId)
            .filter(([, id]) => id === token.id)
            .map(([symbol]) => symbol)

          symbols.forEach((symbol) => {
            acc[symbol] = token
          })

          return acc
        },
        {} as Record<string, TokenPrice>,
      )

      setPrices(priceMap)
      setLastUpdated(new Date())
    } catch (err) {
      console.error("Error fetching CoinGecko prices:", err)
      setError(err instanceof Error ? err.message : "Failed to fetch prices")

      // Use fallback prices if API fails
      const fallbackPrices = generateFallbackPrices(tokenSymbols)
      setPrices(fallbackPrices)
      setLastUpdated(new Date())
    } finally {
      setLoading(false)
    }
  }

  // Generate fallback prices for demo
  const generateFallbackPrices = (symbols: string[]): Record<string, TokenPrice> => {
    const fallbackData: Record<string, Partial<TokenPrice>> = {
      WETH: { current_price: 3201.45, price_change_percentage_24h: 2.34 },
      ETH: { current_price: 3201.45, price_change_percentage_24h: 2.34 },
      USDC: { current_price: 1.0001, price_change_percentage_24h: 0.01 },
      USDT: { current_price: 0.9999, price_change_percentage_24h: -0.01 },
      WBTC: { current_price: 67234.56, price_change_percentage_24h: 1.87 },
      DAI: { current_price: 1.0002, price_change_percentage_24h: 0.02 },
      UNI: { current_price: 7.45, price_change_percentage_24h: 4.23 },
      LINK: { current_price: 14.67, price_change_percentage_24h: 3.12 },
      AAVE: { current_price: 89.34, price_change_percentage_24h: 5.67 },
      YFI: { current_price: 6789.12, price_change_percentage_24h: 2.89 },
    }

    return symbols.reduce(
      (acc, symbol) => {
        const fallback = fallbackData[symbol.toUpperCase()]
        if (fallback) {
          acc[symbol.toUpperCase()] = {
            id: symbolToId[symbol.toUpperCase()] || symbol.toLowerCase(),
            symbol: symbol.toLowerCase(),
            name: symbol,
            current_price: fallback.current_price || 0,
            price_change_percentage_24h: fallback.price_change_percentage_24h || 0,
            market_cap: fallback.current_price ? fallback.current_price * 1000000 : 0,
            total_volume: fallback.current_price ? fallback.current_price * 100000 : 0,
            image: "",
          }
        }
        return acc
      },
      {} as Record<string, TokenPrice>,
    )
  }

  useEffect(() => {
    if (tokenSymbols.length > 0) {
      fetchPrices()

      // Update prices every 2 minutes
      const interval = setInterval(fetchPrices, 2 * 60 * 1000)
      return () => clearInterval(interval)
    }
  }, [tokenSymbols.join(",")])

  return {
    prices,
    loading,
    error,
    lastUpdated,
    refresh: fetchPrices,
  }
}
