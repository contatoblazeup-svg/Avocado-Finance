"use client"

import { useState, useEffect } from "react"

interface CacheItem<T> {
  data: T
  timestamp: number
  key: string
}

const CACHE_DURATION = 30 * 1000 // 30 seconds for pool data

export function usePoolCache<T>(key: string, fetchFn: () => Promise<T>, dependencies: any[] = []) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const getCacheKey = (key: string) => `pool_cache_${key}`

  const getCachedData = (): T | null => {
    try {
      const cached = localStorage.getItem(getCacheKey(key))
      if (!cached) return null

      const cacheItem: CacheItem<T> = JSON.parse(cached)
      const now = Date.now()

      if (now - cacheItem.timestamp > CACHE_DURATION) {
        localStorage.removeItem(getCacheKey(key))
        return null
      }

      return cacheItem.data
    } catch {
      return null
    }
  }

  const setCachedData = (data: T) => {
    try {
      const cacheItem: CacheItem<T> = {
        data,
        timestamp: Date.now(),
        key,
      }
      localStorage.setItem(getCacheKey(key), JSON.stringify(cacheItem))
    } catch {
      // Ignore cache errors
    }
  }

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Check cache first
      const cachedData = getCachedData()
      if (cachedData) {
        setData(cachedData)
        setLastUpdated(new Date())
        setLoading(false)
        return
      }

      // Fetch fresh data
      const freshData = await fetchFn()
      setData(freshData)
      setCachedData(freshData)
      setLastUpdated(new Date())
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch data")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, dependencies)

  return {
    data,
    loading,
    error,
    lastUpdated,
    refresh: fetchData,
  }
}
