'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ShoppingBag, Heart, ArrowLeft, Star, Package, RefreshCw } from 'lucide-react'
import Link from 'next/link'
import { ProductWithCategory, SizeOption } from '@/types/database'
import { formatPrice } from '@/lib/utils'
import { useCart } from '@/lib/hooks/useCart'

interface Props { product: ProductWithCategory }

export default function ProductDetail({ product }: Props) {
  const { addItem } = useCart()
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState<SizeOption | null>(
    (product.size_options as SizeOption[] | null)?.[0] ?? null
  )
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)

  const images = product.image_urls && product.image_urls.length > 0
    ? product.image_urls
    : ['https://images.unsplash.com/photo-1541643600914-78b084683702?q=80&w=800']

  const sizeOptions = product.size_options as SizeOption[] | null
  const fragranceNotes = product.fragrance_notes as { top: string[]; middle: string[]; base: string[] } | null
  const displayPrice = selectedSize?.price ?? product.discount_price ?? product.price

  const handleAddToCart = () => {
    addItem(product, quantity, selectedSize?.size ?? null)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <Link href="/shop" className="inline-flex items-center gap-2 font-body text-xs tracking-widest uppercase text-stone-400 hover:text-gold-500 transition-colors mb-10">
        <ArrowLeft size={12} />
        Back to Collection
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Image Gallery */}
        <div className="space-y-3">
          <motion.div
            key={selectedImage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="aspect-square overflow-hidden bg-stone-100"
          >
            <img
              src={images[selectedImage]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </motion.div>
          {images.length > 1 && (
            <div className="flex gap-3">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`w-20 h-20 overflow-hidden border-2 transition-colors ${
                    selectedImage === i ? 'border-gold-500' : 'border-transparent'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {product.categories && (
            <p className="font-body text-xs text-gold-500 tracking-widest uppercase mb-2">
              {product.categories.name}
            </p>
          )}
          <h1 className="font-display text-5xl font-light text-obsidian mb-2">{product.name}</h1>
          {product.brand && (
            <p className="font-body text-sm text-stone-400 mb-5">{product.brand}</p>
          )}

          {/* Rating placeholder */}
          <div className="flex items-center gap-2 mb-6">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => <Star key={i} size={12} className="fill-gold-400 text-gold-400" />)}
            </div>
            <span className="font-body text-xs text-stone-400">(24 reviews)</span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-6">
            <span className="font-display text-4xl font-light text-obsidian">{formatPrice(displayPrice)}</span>
            {product.discount_price && !selectedSize?.price && (
              <span className="font-body text-lg text-stone-400 line-through">{formatPrice(product.price)}</span>
            )}
          </div>

          <p className="font-body text-stone-600 leading-relaxed mb-8 font-light">
            {product.short_description}
          </p>

          {/* Size Options */}
          {sizeOptions && sizeOptions.length > 0 && (
            <div className="mb-6">
              <p className="font-body text-xs tracking-widest uppercase text-stone-500 mb-3">Size</p>
              <div className="flex flex-wrap gap-2">
                {sizeOptions.map((opt) => (
                  <button
                    key={opt.size}
                    onClick={() => setSelectedSize(opt)}
                    className={`px-4 py-2 border font-body text-sm transition-all ${
                      selectedSize?.size === opt.size
                        ? 'border-obsidian bg-obsidian text-white'
                        : 'border-stone-200 hover:border-gold-400'
                    }`}
                  >
                    {opt.size}
                    {opt.price && ` — ${formatPrice(opt.price)}`}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="flex items-center gap-4 mb-8">
            <p className="font-body text-xs tracking-widest uppercase text-stone-500">Qty</p>
            <div className="flex items-center border border-stone-200">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3 py-2 hover:bg-stone-50 transition-colors font-body">−</button>
              <span className="px-5 py-2 font-body text-sm border-x border-stone-200">{quantity}</span>
              <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} className="px-3 py-2 hover:bg-stone-50 transition-colors font-body">+</button>
            </div>
            <span className="font-body text-xs text-stone-400">{product.stock} in stock</span>
          </div>

          {/* Add to cart */}
          <div className="flex gap-3 mb-10">
            <motion.button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className={`flex-1 py-4 font-body text-xs tracking-widest uppercase flex items-center justify-center gap-2 transition-all duration-300 ${
                added
                  ? 'bg-green-600 text-white'
                  : 'bg-obsidian text-white hover:bg-gold-500 disabled:opacity-50 disabled:cursor-not-allowed'
              }`}
              whileTap={{ scale: 0.98 }}
            >
              <ShoppingBag size={14} />
              {added ? 'Added!' : product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </motion.button>
            <button className="px-4 py-4 border border-stone-200 hover:border-gold-400 transition-colors">
              <Heart size={16} className="text-stone-400" />
            </button>
          </div>

          {/* Fragrance Notes */}
          {fragranceNotes && (
            <div className="border border-stone-100 p-6 bg-champagne/50 mb-6">
              <p className="font-body text-xs tracking-widest uppercase text-stone-500 mb-4">Fragrance Notes</p>
              <div className="grid grid-cols-3 gap-4">
                {[['Top', fragranceNotes.top], ['Heart', fragranceNotes.middle], ['Base', fragranceNotes.base]].map(([label, notes]) => (
                  <div key={label as string}>
                    <p className="font-body text-[10px] tracking-widest uppercase text-gold-500 mb-2">{label as string}</p>
                    <div className="space-y-1">
                      {(notes as string[]).map((note) => (
                        <p key={note} className="font-body text-xs text-stone-600">{note}</p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Trust badges */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-stone-100">
            {[
              [Package, 'Free Shipping', 'Over $100'],
              [RefreshCw, 'Easy Returns', '30 days'],
              [Star, 'Authentic', '100% genuine'],
            ].map(([Icon, title, sub], i) => (
              <div key={i} className="text-center">
                <Icon size={18} className="text-gold-500 mx-auto mb-2" />
                <p className="font-body text-xs text-stone-700 font-medium">{title as string}</p>
                <p className="font-body text-[10px] text-stone-400">{sub as string}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Full description */}
      {product.full_description && (
        <div className="mt-16 pt-16 border-t border-stone-100">
          <h2 className="font-display text-3xl font-light mb-6">About this Fragrance</h2>
          <p className="font-body text-stone-600 leading-relaxed max-w-3xl font-light">
            {product.full_description}
          </p>
        </div>
      )}
    </div>
  )
}
