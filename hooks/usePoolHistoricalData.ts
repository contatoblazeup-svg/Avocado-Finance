"use client"

import { useQuery } from "@apollo/client"
import { GET_POOL_HISTORICAL_DATA } from "@/lib/graphql/queries"

export function usePoolHistoricalData(poolId: string, days = 30) {
  const { data, loading, error } = useQuery(GET_POOL_HISTORICAL_DATA, {
    variables: {
      poolId,
      first: days,
    },
    skip: !poolId,
    pollInterval: 60000, // Poll every minute
    errorPolicy: "all",
  })

  return {
    historicalData: data?.poolDayDatas || [],
    loading,
    error,
  }
}
