"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Filter, X } from "lucide-react"
import { TVLRangeFilter } from "@/components/TVLRangeFilter"

interface Filters {
  search: string
  minTVL: number
  maxTVL: number
  feeTiers: string[]
  sortBy: "tvl" | "volume" | "apr"
  sortDirection: "asc" | "desc"
}

interface MobileFiltersProps {
  filters: Filters
  onFiltersChange: (filters: Filters) => void
  onReset: () => void
}

const FEE_TIERS = [
  { value: "100", label: "0.01%", color: "bg-blue-500" },
  { value: "500", label: "0.05%", color: "bg-green-500" },
  { value: "3000", label: "0.30%", color: "bg-yellow-500" },
  { value: "10000", label: "1.00%", color: "bg-red-500" },
]

export function MobileFilters({ filters, onFiltersChange, onReset }: MobileFiltersProps) {
  const [isOpen, setIsOpen] = useState(false)

  const activeFiltersCount =
    filters.feeTiers.length + (filters.minTVL > 0 ? 1 : 0) + (filters.maxTVL > 0 ? 1 : 0) + (filters.search ? 1 : 0)

  const handleFeeTierToggle = (feeTier: string) => {
    const newFeeTiers = filters.feeTiers.includes(feeTier)
      ? filters.feeTiers.filter((tier) => tier !== feeTier)
      : [...filters.feeTiers, feeTier]

    onFiltersChange({ ...filters, feeTiers: newFeeTiers })
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="lg:hidden border-gray-600 text-gray-300 hover:bg-gray-700 bg-gray-800/50">
          <Filter className="h-4 w-4 mr-2" />
          Filters
          {activeFiltersCount > 0 && (
            <span className="ml-2 bg-green-600 text-white text-xs px-2 py-1 rounded-full">{activeFiltersCount}</span>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent side="bottom" className="bg-gray-900 border-gray-700 h-[80vh]">
        <SheetHeader>
          <SheetTitle className="text-white flex items-center justify-between">
            <span>Filters</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </Button>
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-6 mt-6 overflow-y-auto max-h-[calc(80vh-100px)]">
          {/* Search */}
          <div>
            <label className="text-gray-400 text-sm mb-2 block">Search Token</label>
            <input
              type="text"
              placeholder="ETH, USDC, etc..."
              className="w-full px-3 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 text-base"
              value={filters.search}
              onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
            />
          </div>

          {/* Sort Options */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-gray-400 text-sm mb-2 block">Sort by</label>
              <select
                className="w-full px-3 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 text-base"
                value={filters.sortBy}
                onChange={(e) => onFiltersChange({ ...filters, sortBy: e.target.value as any })}
              >
                <option value="tvl">TVL</option>
                <option value="volume">Volume</option>
                <option value="apr">APR</option>
              </select>
            </div>
            <div>
              <label className="text-gray-400 text-sm mb-2 block">Direction</label>
              <select
                className="w-full px-3 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 text-base"
                value={filters.sortDirection}
                onChange={(e) => onFiltersChange({ ...filters, sortDirection: e.target.value as any })}
              >
                <option value="desc">High to Low</option>
                <option value="asc">Low to High</option>
              </select>
            </div>
          </div>

          {/* TVL Range */}
          <TVLRangeFilter
            minTVL={filters.minTVL}
            maxTVL={filters.maxTVL}
            onRangeChange={(min, max) => onFiltersChange({ ...filters, minTVL: min, maxTVL: max })}
          />

          {/* Fee Tiers */}
          <div>
            <label className="text-gray-400 text-sm mb-3 block">Fee Tiers</label>
            <div className="grid grid-cols-2 gap-3">
              {FEE_TIERS.map((tier) => (
                <button
                  key={tier.value}
                  onClick={() => handleFeeTierToggle(tier.value)}
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    filters.feeTiers.includes(tier.value)
                      ? `${tier.color} text-white`
                      : "border border-gray-600 text-gray-300 hover:bg-gray-700"
                  }`}
                >
                  {tier.label}
                </button>
              ))}
            </div>
          </div>

          {/* Reset Button */}
          <div className="pt-4 border-t border-gray-700">
            <Button
              onClick={() => {
                onReset()
                setIsOpen(false)
              }}
              variant="outline"
              className="w-full border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent py-3"
            >
              Reset All Filters
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
