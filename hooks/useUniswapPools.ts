"use client"

import { useState, useEffect, useCallback } from "react"
import { fetchGraphQL } from "@/lib/graphql/client"
import { GET_TOP_POOLS_QUERY } from "@/lib/graphql/queries"
import type { Pool, PoolsResponse, PoolFilters } from "@/types/pool"

export function useUniswapPools(filters: PoolFilters) {
  const [pools, setPools] = useState<Pool[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(0)
  const [isUsingFallback, setIsUsingFallback] = useState(false)

  const fetchPools = useCallback(
    async (reset = false) => {
      try {
        setLoading(true)
        setError(null)

        if (reset) {
          setPools([])
          setPage(0)
        }

        const currentPage = reset ? 0 : page
        const skip = currentPage * 20

        // Build where clause based on filters
        const where: any = {
          totalValueLockedUSD_gt: "1000", // Minimum $1k TVL
        }

        if (filters.minTVL > 0) {
          where.totalValueLockedUSD_gte = filters.minTVL.toString()
        }

        if (filters.maxTVL > 0) {
          where.totalValueLockedUSD_lte = filters.maxTVL.toString()
        }

        if (filters.minVolume > 0) {
          where.volumeUSD_gte = filters.minVolume.toString()
        }

        if (filters.maxVolume > 0) {
          where.volumeUSD_lte = filters.maxVolume.toString()
        }

        if (filters.feeTiers.length > 0) {
          where.feeTier_in = filters.feeTiers
        }

        // Add search filter
        if (filters.searchToken) {
          where.or = [
            { token0_: { symbol_contains_nocase: filters.searchToken } },
            { token1_: { symbol_contains_nocase: filters.searchToken } },
            { token0_: { name_contains_nocase: filters.searchToken } },
            { token1_: { name_contains_nocase: filters.searchToken } },
          ]
        }

        const orderBy =
          filters.sortBy === "tvl"
            ? "totalValueLockedUSD"
            : filters.sortBy === "volume"
              ? "volumeUSD"
              : "totalValueLockedUSD"

        const result = await fetchGraphQL<PoolsResponse>(GET_TOP_POOLS_QUERY, {
          first: 20,
          skip,
          orderBy,
          orderDirection: filters.sortDirection || "desc",
          where,
        })

        const newPools = result.pools || []

        // Check if we're using fallback data
        if (newPools.length > 0 && newPools[0].id.startsWith("0x")) {
          setIsUsingFallback(true)
        }

        if (reset) {
          setPools(newPools)
        } else {
          setPools((prev) => [...prev, ...newPools])
        }

        setHasMore(newPools.length === 20)
        setPage(currentPage + 1)
      } catch (err) {
        console.error("Error fetching pools:", err)
        setError(err instanceof Error ? err.message : "Failed to fetch pools")
        setIsUsingFallback(true)

        // Generate some fallback pools if we have none
        if (pools.length === 0) {
          const fallbackResult = await fetchGraphQL<PoolsResponse>("", {})
          setPools(fallbackResult.pools || [])
        }
      } finally {
        setLoading(false)
      }
    },
    [filters, page, pools.length],
  )

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      fetchPools(false)
    }
  }, [fetchPools, loading, hasMore])

  const refresh = useCallback(() => {
    setIsUsingFallback(false)
    fetchPools(true)
  }, [fetchPools])

  useEffect(() => {
    fetchPools(true)
  }, [
    filters.minTVL,
    filters.maxTVL,
    filters.minVolume,
    filters.maxVolume,
    filters.feeTiers,
    filters.sortBy,
    filters.sortDirection,
  ])

  return {
    pools,
    loading,
    error,
    hasMore,
    loadMore,
    refresh,
    isUsingFallback,
  }
}
