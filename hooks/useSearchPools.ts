"use client"

import { useLazyQuery } from "@apollo/client"
import { SEARCH_POOLS } from "@/lib/graphql/queries"

export function useSearchPools() {
  const [searchPools, { data, loading, error }] = useLazyQuery(SEARCH_POOLS, {
    errorPolicy: "all",
  })

  const search = (searchTerm: string) => {
    if (searchTerm.trim()) {
      searchPools({
        variables: { searchTerm: searchTerm.trim() },
      })
    }
  }

  return {
    search,
    pools: data?.pools || [],
    loading,
    error,
  }
}
