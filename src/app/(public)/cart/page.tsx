'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react'
import { useCart } from '@/lib/hooks/useCart'
import { formatPrice } from '@/lib/utils'

export default function CartPage() {
  const { items, total, removeItem, updateQuantity, itemCount } = useCart()

  return (
    <div className="min-h-screen bg-ivory pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-6">
        <div className="mb-10">
          <p className="section-subtitle mb-2">Your Selection</p>
          <h1 className="font-display text-5xl font-light">
            Shopping <em className="italic text-gold-500">Cart</em>
          </h1>
        </div>

        {itemCount === 0 ? (
          <div className="text-center py-24">
            <ShoppingBag size={48} className="text-stone-200 mx-auto mb-6" />
            <h2 className="font-display text-3xl font-light text-stone-400 mb-3">Your cart is empty</h2>
            <p className="font-body text-sm text-stone-400 mb-8">Discover our exquisite collection</p>
            <Link href="/shop" className="btn-primary">Explore Collection</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Items */}
            <div className="lg:col-span-2 space-y-0 divide-y divide-stone-100">
              <AnimatePresence>
                {items.map((item) => {
                  const price = item.product.discount_price ?? item.product.price
                  const img = item.product.image_urls?.[0] || 'https://images.unsplash.com/photo-1541643600914-78b084683702?q=80&w=200'
                  return (
                    <motion.div
                      key={`${item.product.id}-${item.selected_size}`}
                      layout
                      exit={{ opacity: 0, x: -20 }}
                      className="flex gap-5 py-6"
                    >
                      <Link href={`/shop/${item.product.slug}`}>
                        <img src={img} alt={item.product.name} className="w-24 h-28 object-cover bg-stone-100 flex-shrink-0" />
                      </Link>
                      <div className="flex-1 min-w-0">
                        <Link href={`/shop/${item.product.slug}`}>
                          <h3 className="font-display text-xl font-light hover:text-gold-600 transition-colors">{item.product.name}</h3>
                        </Link>
                        <p className="font-body text-xs text-stone-400 mt-0.5 mb-3">{item.product.brand}</p>
                        {item.selected_size && (
                          <p className="font-body text-xs text-stone-500 mb-3">Size: {item.selected_size}</p>
                        )}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center border border-stone-200">
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.selected_size)}
                              className="w-8 h-8 flex items-center justify-center hover:bg-stone-50 font-body"
                            >−</button>
                            <span className="w-10 text-center font-body text-sm">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.selected_size)}
                              className="w-8 h-8 flex items-center justify-center hover:bg-stone-50 font-body"
                            >+</button>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="font-body font-medium">{formatPrice(price * item.quantity)}</span>
                            <button
                              onClick={() => removeItem(item.product.id, item.selected_size)}
                              className="text-stone-300 hover:text-red-400 transition-colors"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <div className="bg-champagne p-6 sticky top-28">
                <h2 className="font-display text-2xl font-light mb-6">Order Summary</h2>
                <div className="space-y-3 mb-6 pb-6 border-b border-stone-200">
                  <div className="flex justify-between font-body text-sm text-stone-600">
                    <span>Subtotal</span><span>{formatPrice(total)}</span>
                  </div>
                  <div className="flex justify-between font-body text-sm text-stone-600">
                    <span>Shipping</span>
                    <span className="text-green-600">{total >= 100 ? 'Free' : formatPrice(9.99)}</span>
                  </div>
                </div>
                <div className="flex justify-between font-body font-medium text-base mb-6">
                  <span>Total</span>
                  <span>{formatPrice(total < 100 ? total + 9.99 : total)}</span>
                </div>
                <Link href="/checkout" className="btn-primary w-full flex items-center justify-center gap-2">
                  Checkout <ArrowRight size={14} />
                </Link>
                <Link href="/shop" className="block text-center font-body text-xs tracking-widest uppercase text-stone-400 hover:text-gold-500 transition-colors mt-4">
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
