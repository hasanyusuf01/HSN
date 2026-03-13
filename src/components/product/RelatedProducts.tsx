'use client'

import { motion } from 'framer-motion'
import { ProductWithCategory } from '@/types/database'
import ProductCard from './ProductCard'

export default function RelatedProducts({ products }: { products: ProductWithCategory[] }) {
  return (
    <section className="py-16 border-t border-stone-100">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="section-subtitle mb-3">You May Also Like</p>
          <h2 className="font-display text-3xl font-light mb-10">Related Fragrances</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {products.map((product, i) => (
              <motion.div key={product.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
