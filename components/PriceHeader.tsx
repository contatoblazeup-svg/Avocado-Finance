"use client"

import { RefreshCw } from "lucide-react"
import { useCoinGeckoPrice } from "@/hooks/useCoinGeckoPrice"
import { TokenPrice } from "@/components/TokenPrice"

const MAJOR_TOKENS = ["WETH", "USDC", "WBTC", "UNI"]

export function PriceHeader() {
  const { prices, loading, lastUpdated, refresh } = useCoinGeckoPrice(MAJOR_TOKENS)

  return (
    <div className="bg-gray-800/30 border-b border-gray-700/50 backdrop-blur-sm">
      <div className="container mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            {MAJOR_TOKENS.map((symbol) => {
              const tokenPrice = prices[symbol]
              return (
                <div key={symbol} className="flex items-center space-x-2">
                  <span className="text-gray-400 text-sm font-medium">{symbol}:</span>
                  <TokenPrice
                    symbol={symbol}
                    price={tokenPrice?.current_price}
                    change24h={tokenPrice?.price_change_percentage_24h}
                    className="text-sm"
                  />
                </div>
              )
            })}
          </div>

          <div className="flex items-center space-x-4 text-sm text-gray-400">
            {lastUpdated && <span>Updated: {lastUpdated.toLocaleTimeString()}</span>}
            <button
              onClick={refresh}
              disabled={loading}
              className="flex items-center space-x-1 hover:text-white transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
