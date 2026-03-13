'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ShoppingBag, Heart } from 'lucide-react'
import { ProductWithCategory } from '@/types/database'
import { formatPrice, getDiscountPercent } from '@/lib/utils'
import { useCart } from '@/lib/hooks/useCart'

interface Props {
  product: ProductWithCategory
}

export default function ProductCard({ product }: Props) {
  const { addItem } = useCart()
  const imageUrl = product.image_urls?.[0] || 'https://images.unsplash.com/photo-1541643600914-78b084683702?q=80&w=600'
  const displayPrice = product.discount_price ?? product.price

  return (
    <div className="group relative">
      {/* Image container */}
      <div className="relative overflow-hidden bg-stone-100 aspect-[3/4] mb-4">
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.featured && (
            <span className="bg-obsidian text-white font-body text-[9px] tracking-widest uppercase px-2 py-1">
              Featured
            </span>
          )}
          {product.discount_price && (
            <span className="bg-gold-500 text-white font-body text-[9px] tracking-widest uppercase px-2 py-1">
              -{getDiscountPercent(product.price, product.discount_price)}%
            </span>
          )}
          {product.stock === 0 && (
            <span className="bg-stone-500 text-white font-body text-[9px] tracking-widest uppercase px-2 py-1">
              Sold Out
            </span>
          )}
        </div>

        {/* Quick actions */}
        <motion.div
          className="absolute inset-x-0 bottom-0 flex flex-col gap-2 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300"
        >
          <button
            onClick={() => addItem(product, 1)}
            disabled={product.stock === 0}
            className="w-full py-3 bg-obsidian text-white font-body text-xs tracking-widest uppercase hover:bg-gold-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            <ShoppingBag size={12} />
            {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </motion.div>

        {/* Wishlist */}
        <button className="absolute top-3 right-3 w-8 h-8 bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gold-50">
          <Heart size={14} className="text-stone-400 hover:text-gold-500 transition-colors" />
        </button>
      </div>

      {/* Info */}
      <div>
        {product.categories && (
          <p className="font-body text-[10px] text-gold-500 tracking-widest uppercase mb-1">
            {product.categories.name}
          </p>
        )}
        <Link href={`/shop/${product.slug}`}>
          <h3 className="font-display text-xl font-light text-obsidian hover:text-gold-600 transition-colors">
            {product.name}
          </h3>
        </Link>
        <p className="font-body text-xs text-stone-400 mt-0.5 mb-2">{product.brand}</p>
        <div className="flex items-center gap-2">
          <span className="font-body text-base font-medium text-obsidian">
            {formatPrice(displayPrice)}
          </span>
          {product.discount_price && (
            <span className="font-body text-sm text-stone-400 line-through">
              {formatPrice(product.price)}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
