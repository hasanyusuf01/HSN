'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { ProductWithCategory } from '@/types/database'
import ProductCard from '@/components/product/ProductCard'

interface Props {
  products: ProductWithCategory[]
}

export default function FeaturedProducts({ products }: Props) {
  return (
    <section className="py-24 bg-ivory">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div>
            <p className="section-subtitle mb-3">Handpicked for You</p>
            <h2 className="section-title">
              Featured <em className="italic text-gold-500">Essences</em>
            </h2>
          </div>
          <Link href="/shop" className="group flex items-center gap-2 font-body text-xs tracking-widest uppercase text-stone-500 hover:text-gold-500 transition-colors whitespace-nowrap">
            View All
            <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        {/* Grid */}
        {products.length === 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-stone-200 aspect-[3/4] mb-4" />
                <div className="h-4 bg-stone-200 rounded mb-2" />
                <div className="h-4 bg-stone-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
