'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Category } from '@/types/database'
import { Search } from 'lucide-react'
import { useCallback } from 'react'

interface Props {
  categories: Category[]
  activeCategory?: string
  activeSort?: string
  searchValue?: string
}

export default function ShopFilters({ categories, activeCategory, activeSort, searchValue }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const updateParam = useCallback((key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) params.set(key, value)
    else params.delete(key)
    params.delete('page')
    router.push(`/shop?${params.toString()}`)
  }, [router, searchParams])

  const sortOptions = [
    { value: '', label: 'Featured' },
    { value: 'newest', label: 'Newest' },
    { value: 'price_asc', label: 'Price: Low to High' },
    { value: 'price_desc', label: 'Price: High to Low' },
  ]

  return (
    <aside className="lg:w-56 flex-shrink-0">
      {/* Search */}
      <div className="mb-8">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            defaultValue={searchValue}
            placeholder="Search fragrances..."
            onKeyDown={(e) => {
              if (e.key === 'Enter') updateParam('search', (e.target as HTMLInputElement).value || null)
            }}
            className="w-full pl-9 pr-3 py-3 border border-stone-200 bg-white font-body text-sm outline-none focus:border-gold-400 transition-colors"
          />
        </div>
      </div>

      {/* Sort */}
      <div className="mb-8">
        <h3 className="font-body text-xs tracking-widest uppercase text-stone-500 mb-4">Sort By</h3>
        <div className="space-y-2">
          {sortOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => updateParam('sort', opt.value || null)}
              className={`block w-full text-left font-body text-sm py-1.5 transition-colors ${
                (activeSort || '') === opt.value
                  ? 'text-gold-600 font-medium'
                  : 'text-stone-600 hover:text-obsidian'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div>
        <h3 className="font-body text-xs tracking-widest uppercase text-stone-500 mb-4">Collections</h3>
        <div className="space-y-2">
          <button
            onClick={() => updateParam('category', null)}
            className={`block w-full text-left font-body text-sm py-1.5 transition-colors ${
              !activeCategory ? 'text-gold-600 font-medium' : 'text-stone-600 hover:text-obsidian'
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => updateParam('category', cat.slug)}
              className={`block w-full text-left font-body text-sm py-1.5 transition-colors ${
                activeCategory === cat.slug ? 'text-gold-600 font-medium' : 'text-stone-600 hover:text-obsidian'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>
    </aside>
  )
}
