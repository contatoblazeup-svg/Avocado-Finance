"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Filter, X, RotateCcw, Search } from "lucide-react"
import type { PoolFilters as Filters } from "@/types/pool"

const FEE_TIERS = [
  { value: "100", label: "0.01%", color: "bg-blue-500" },
  { value: "500", label: "0.05%", color: "bg-green-500" },
  { value: "3000", label: "0.30%", color: "bg-yellow-500" },
  { value: "10000", label: "1.00%", color: "bg-red-500" },
]

const POPULAR_TOKENS = ["WETH", "USDC", "USDT", "WBTC", "DAI", "UNI", "LINK", "AAVE"]

interface PoolFiltersProps {
  filters: Filters
  onFiltersChange: (filters: Filters) => void
  onReset: () => void
}

export const PoolFilters: React.FC<PoolFiltersProps> = ({ filters, onFiltersChange, onReset }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [tvlRange, setTvlRange] = useState([filters.minTVL, filters.maxTVL || 1000000000])
  const [volumeRange, setVolumeRange] = useState([filters.minVolume, filters.maxVolume || 100000000])

  const handleFeeTierToggle = (feeTier: string) => {
    const newFeeTiers = filters.feeTiers.includes(feeTier)
      ? filters.feeTiers.filter((tier) => tier !== feeTier)
      : [...filters.feeTiers, feeTier]

    onFiltersChange({ ...filters, feeTiers: newFeeTiers })
  }

  const handleTVLChange = (values: number[]) => {
    setTvlRange(values)
    onFiltersChange({
      ...filters,
      minTVL: values[0],
      maxTVL: values[1] === 1000000000 ? 0 : values[1],
    })
  }

  const handleVolumeChange = (values: number[]) => {
    setVolumeRange(values)
    onFiltersChange({
      ...filters,
      minVolume: values[0],
      maxVolume: values[1] === 100000000 ? 0 : values[1],
    })
  }

  const activeFiltersCount =
    filters.feeTiers.length +
    (filters.minTVL > 0 ? 1 : 0) +
    (filters.maxTVL > 0 ? 1 : 0) +
    (filters.minVolume > 0 ? 1 : 0) +
    (filters.maxVolume > 0 ? 1 : 0) +
    (filters.searchToken ? 1 : 0)

  return (
    <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm sticky top-24">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <CardTitle className="text-white">Filters</CardTitle>
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="bg-green-600/20 text-green-400">
                {activeFiltersCount}
              </Badge>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" onClick={onReset} className="text-gray-400 hover:text-white">
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-gray-400 hover:text-white lg:hidden"
            >
              {isExpanded ? <X className="h-4 w-4" /> : <Filter className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className={`space-y-6 ${isExpanded ? "block" : "hidden lg:block"}`}>
        {/* Search */}
        <div>
          <Label className="text-gray-400 text-sm mb-2 block">Search Token</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="ETH, USDC, etc..."
              className="pl-10 bg-gray-700/50 border-gray-600 text-white placeholder-gray-400"
              value={filters.searchToken || ""}
              onChange={(e) => onFiltersChange({ ...filters, searchToken: e.target.value })}
            />
          </div>
        </div>

        {/* Quick Token Filters */}
        <div>
          <Label className="text-gray-400 text-sm mb-3 block">Popular Tokens</Label>
          <div className="flex flex-wrap gap-2">
            {POPULAR_TOKENS.map((token) => (
              <Button
                key={token}
                variant={filters.searchToken === token ? "default" : "outline"}
                size="sm"
                onClick={() =>
                  onFiltersChange({
                    ...filters,
                    searchToken: filters.searchToken === token ? "" : token,
                  })
                }
                className={
                  filters.searchToken === token
                    ? "bg-green-600 text-white"
                    : "border-gray-600 text-gray-300 hover:bg-gray-700"
                }
              >
                {token}
              </Button>
            ))}
          </div>
        </div>

        {/* Sort Options */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-gray-400 text-sm">Sort by</Label>
            <Select
              value={filters.sortBy || "tvl"}
              onValueChange={(value) => onFiltersChange({ ...filters, sortBy: value as any })}
            >
              <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                <SelectItem value="tvl" className="text-white">
                  TVL
                </SelectItem>
                <SelectItem value="volume" className="text-white">
                  Volume
                </SelectItem>
                <SelectItem value="apr" className="text-white">
                  APR
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-gray-400 text-sm">Direction</Label>
            <Select
              value={filters.sortDirection || "desc"}
              onValueChange={(value) => onFiltersChange({ ...filters, sortDirection: value as any })}
            >
              <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                <SelectItem value="desc" className="text-white">
                  High to Low
                </SelectItem>
                <SelectItem value="asc" className="text-white">
                  Low to High
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Fee Tiers */}
        <div>
          <Label className="text-gray-400 text-sm mb-3 block">Fee Tiers</Label>
          <div className="flex flex-wrap gap-2">
            {FEE_TIERS.map((tier) => (
              <Button
                key={tier.value}
                variant={filters.feeTiers.includes(tier.value) ? "default" : "outline"}
                size="sm"
                onClick={() => handleFeeTierToggle(tier.value)}
                className={`${
                  filters.feeTiers.includes(tier.value)
                    ? `${tier.color} text-white`
                    : "border-gray-600 text-gray-300 hover:bg-gray-700"
                }`}
              >
                {tier.label}
              </Button>
            ))}
          </div>
        </div>

        {/* TVL Range */}
        <div>
          <Label className="text-gray-400 text-sm mb-3 block">
            TVL Range: ${(tvlRange[0] / 1000000).toFixed(1)}M - $
            {tvlRange[1] === 1000000000 ? "∞" : `${(tvlRange[1] / 1000000).toFixed(1)}M`}
          </Label>
          <Slider
            value={tvlRange}
            onValueChange={handleTVLChange}
            max={1000000000}
            min={0}
            step={1000000}
            className="w-full"
          />
        </div>

        {/* Volume Range */}
        <div>
          <Label className="text-gray-400 text-sm mb-3 block">
            Volume Range: ${(volumeRange[0] / 1000000).toFixed(1)}M - $
            {volumeRange[1] === 100000000 ? "∞" : `${(volumeRange[1] / 1000000).toFixed(1)}M`}
          </Label>
          <Slider
            value={volumeRange}
            onValueChange={handleVolumeChange}
            max={100000000}
            min={0}
            step={1000000}
            className="w-full"
          />
        </div>
      </CardContent>
    </Card>
  )
}
