"use client"

import { useState, useEffect } from "react"

interface TokenPrice {
  [key: string]: {
    usd: number
    usd_24h_change: number
  }
}

export function useTokenPrices(tokenSymbols: string[]) {
  const [prices, setPrices] = useState<TokenPrice>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (tokenSymbols.length === 0) {
      setLoading(false)
      return
    }

    const fetchPrices = async () => {
      try {
        setLoading(true)
        setError(null)

        // Convert token symbols to CoinGecko IDs
        const symbolMap: { [key: string]: string } = {
          WETH: "ethereum",
          ETH: "ethereum",
          USDC: "usd-coin",
          USDT: "tether",
          WBTC: "wrapped-bitcoin",
          DAI: "dai",
          UNI: "uniswap",
          LINK: "chainlink",
          AAVE: "aave",
          MATIC: "matic-network",
          CRV: "curve-dao-token",
          COMP: "compound-governance-token",
          MKR: "maker",
          SNX: "havven",
          YFI: "yearn-finance",
        }

        const coinGeckoIds = tokenSymbols
          .map((symbol) => symbolMap[symbol.toUpperCase()] || symbol.toLowerCase())
          .filter(Boolean)
          .join(",")

        if (!coinGeckoIds) {
          setLoading(false)
          return
        }

        const response = await fetch(
          `https://api.coingecko.com/api/v3/simple/price?ids=${coinGeckoIds}&vs_currencies=usd&include_24hr_change=true`,
          {
            headers: {
              Accept: "application/json",
            },
          },
        )

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        setPrices(data)
      } catch (err) {
        console.error("Error fetching token prices:", err)
        setError(err instanceof Error ? err.message : "Failed to fetch prices")
      } finally {
        setLoading(false)
      }
    }

    fetchPrices()

    // Update prices every 60 seconds
    const interval = setInterval(fetchPrices, 60000)
    return () => clearInterval(interval)
  }, [tokenSymbols])

  return { prices, loading, error }
}
