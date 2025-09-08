"use client"

import { useQuery } from "@apollo/client"
import { GET_TOP_POOLS } from "@/lib/graphql/queries"
import type { PoolFilters } from "@/types/pool"

interface UseTopPoolsProps {
  filters: PoolFilters
  first?: number
}

export function useTopPools({ filters, first = 50 }: UseTopPoolsProps) {
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

  const orderBy =
    filters.sortBy === "tvl" ? "totalValueLockedUSD" : filters.sortBy === "volume" ? "volumeUSD" : "totalValueLockedUSD"

  const { data, loading, error, refetch } = useQuery(GET_TOP_POOLS, {
    variables: {
      first,
      orderBy,
      orderDirection: filters.sortDirection || "desc",
      where,
    },
    pollInterval: 30000, // Poll every 30 seconds
    notifyOnNetworkStatusChange: true,
    errorPolicy: "all",
  })

  return {
    pools: data?.pools || [],
    loading,
    error,
    refetch,
  }
}
