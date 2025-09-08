export interface Token {
  id: string
  symbol: string
  name: string
  decimals: string
}

export interface PoolDayData {
  date: number
  volumeUSD: string
  tvlUSD: string
  feesUSD: string
  open: string
  high: string
  low: string
  close: string
}

export interface Pool {
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

export interface PoolsResponse {
  pools: Pool[]
}

export interface PoolFilters {
  minTVL: number
  maxTVL: number
  minVolume: number
  maxVolume: number
  feeTiers: string[]
  tokens: string[]
  sortBy: "tvl" | "volume" | "apr" | "fees"
  sortDirection: "asc" | "desc"
}
