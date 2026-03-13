'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ProductWithCategory } from '@/types/database'
import ProductCard from './ProductCard'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useSearchParams } from 'next/navigation'

interface Props {
  products: ProductWithCategory[]
  total: number
  page: number
  perPage: number
}

export default function ProductGrid({ products, total, page, perPage }: Props) {
  const searchParams = useSearchParams()
  const totalPages = Math.ceil(total / perPage)

  const buildPageUrl = (p: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', p.toString())
    return `/shop?${params.toString()}`
  }

  if (products.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-24 text-center">
        <p className="font-display text-3xl text-stone-300 font-light mb-3">No fragrances found</p>
        <p className="font-body text-sm text-stone-400">Try adjusting your filters</p>
      </div>
    )
  }

  return (
    <div className="flex-1">
      <div className="flex items-center justify-between mb-6">
        <p className="font-body text-sm text-stone-400">{total} fragrance{total !== 1 ? 's' : ''}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
        {products.map((product, i) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.05 }}
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-16">
          {page > 1 && (
            <Link href={buildPageUrl(page - 1)} className="w-10 h-10 flex items-center justify-center border border-stone-200 hover:border-gold-400 transition-colors">
              <ChevronLeft size={16} />
            </Link>
          )}
          {[...Array(totalPages)].map((_, i) => (
            <Link
              key={i}
              href={buildPageUrl(i + 1)}
              className={`w-10 h-10 flex items-center justify-center font-body text-sm transition-colors ${
                page === i + 1
                  ? 'bg-obsidian text-white'
                  : 'border border-stone-200 hover:border-gold-400'
              }`}
            >
              {i + 1}
            </Link>
          ))}
          {page < totalPages && (
            <Link href={buildPageUrl(page + 1)} className="w-10 h-10 flex items-center justify-center border border-stone-200 hover:border-gold-400 transition-colors">
              <ChevronRight size={16} />
            </Link>
          )}
        </div>
      )}
    </div>
  )
}
