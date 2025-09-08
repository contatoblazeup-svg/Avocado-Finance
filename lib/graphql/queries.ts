export const GET_TOP_POOLS_QUERY = `
  query GetTopPools($first: Int!, $orderBy: String!, $orderDirection: String!, $where: Pool_filter) {
    pools(
      first: $first
      orderBy: $orderBy
      orderDirection: $orderDirection
      where: $where
    ) {
      id
      token0 {
        id
        symbol
        name
        decimals
      }
      token1 {
        id
        symbol
        name
        decimals
      }
      feeTier
      liquidity
      sqrtPrice
      tick
      token0Price
      token1Price
      volumeUSD
      txCount
      totalValueLockedUSD
      totalValueLockedToken0
      totalValueLockedToken1
      createdAtTimestamp
      poolDayData(first: 30, orderBy: date, orderDirection: desc) {
        date
        volumeUSD
        tvlUSD
        feesUSD
        open
        high
        low
        close
      }
    }
  }
`

export const SEARCH_POOLS_QUERY = `
  query SearchPools($searchTerm: String!) {
    pools(
      where: {
        or: [
          { token0_: { symbol_contains_nocase: $searchTerm } }
          { token1_: { symbol_contains_nocase: $searchTerm } }
          { token0_: { name_contains_nocase: $searchTerm } }
          { token1_: { name_contains_nocase: $searchTerm } }
        ]
      }
      orderBy: totalValueLockedUSD
      orderDirection: desc
      first: 20
    ) {
      id
      token0 {
        id
        symbol
        name
        decimals
      }
      token1 {
        id
        symbol
        name
        decimals
      }
      feeTier
      totalValueLockedUSD
      volumeUSD
      poolDayData(first: 7, orderBy: date, orderDirection: desc) {
        date
        volumeUSD
        tvlUSD
        feesUSD
      }
    }
  }
`
