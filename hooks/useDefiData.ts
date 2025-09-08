"use client"

import { useState, useEffect } from "react"

interface DefiMetrics {
  marketCap: number
  volume24h: number
  fearGreedIndex: number
  altcoinSeasonIndex: number
  cryptoMarketCap: number
  cryptoVolume24h: number
}

interface TokenPrice {
  id: string
  symbol: string
  name: string
  current_price: number
  price_change_percentage_24h: number
  market_cap: number
  total_volume: number
}

export function useDefiData() {
  const [metrics, setMetrics] = useState<DefiMetrics>({
    marketCap: 0,
    volume24h: 0,
    fearGreedIndex: 50,
    altcoinSeasonIndex: 50,
    cryptoMarketCap: 0,
    cryptoVolume24h: 0,
  })
  const [tokens, setTokens] = useState<TokenPrice[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDefiData = async () => {
      try {
        setLoading(true)

        // Fetch global crypto data from CoinGecko
        const globalResponse = await fetch("https://api.coingecko.com/api/v3/global")
        const globalData = await globalResponse.json()

        // Fetch Fear & Greed Index
        const fearGreedResponse = await fetch("https://api.alternative.me/fng/")
        const fearGreedData = await fearGreedResponse.json()

        // Fetch top DeFi tokens for market cap calculation
        const defiTokensResponse = await fetch(
          "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&category=decentralized-finance-defi&order=market_cap_desc&per_page=100&page=1",
        )
        const defiTokens = await defiTokensResponse.json()

        // Fetch popular tokens for selection
        const tokensResponse = await fetch(
          "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=ethereum,usd-coin,tether,wrapped-bitcoin,dai,uniswap,chainlink,aave-token&order=market_cap_desc&per_page=10&page=1",
        )
        const tokensData = await tokensResponse.json()

        // Calculate DeFi market cap and volume
        const defiMarketCap = defiTokens.reduce((sum: number, token: any) => sum + (token.market_cap || 0), 0)
        const defiVolume = defiTokens.reduce((sum: number, token: any) => sum + (token.total_volume || 0), 0)

        // Calculate Altcoin Season Index (simplified)
        const btcDominance = globalData.data.market_cap_percentage.btc
        const altcoinSeasonIndex = Math.max(0, Math.min(100, 100 - btcDominance))

        setMetrics({
          marketCap: defiMarketCap,
          volume24h: defiVolume,
          fearGreedIndex: Number.parseInt(fearGreedData.data[0].value),
          altcoinSeasonIndex: Math.round(altcoinSeasonIndex),
          cryptoMarketCap: globalData.data.total_market_cap.usd,
          cryptoVolume24h: globalData.data.total_volume.usd,
        })

        setTokens(tokensData)
        setError(null)
      } catch (err) {
        console.error("Error fetching DeFi data:", err)
        setError("Failed to fetch data")
      } finally {
        setLoading(false)
      }
    }

    fetchDefiData()

    // Update data every 30 seconds
    const interval = setInterval(fetchDefiData, 30000)

    return () => clearInterval(interval)
  }, [])

  return { metrics, tokens, loading, error }
}
