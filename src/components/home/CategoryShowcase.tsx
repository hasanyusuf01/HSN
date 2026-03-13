'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Category } from '@/types/database'
import { ArrowUpRight } from 'lucide-react'

const CATEGORY_IMAGES: Record<string, string> = {
  'luxury-oud': 'https://images.unsplash.com/photo-1563170351-be82bc888aa4?q=80&w=600',
  'oriental': 'https://images.unsplash.com/photo-1598521101657-1c1ad0e6b0e3?q=80&w=600',
  'floral': 'https://images.unsplash.com/photo-1590156206657-aec37e06ef4a?q=80&w=600',
  'woody': 'https://images.unsplash.com/photo-1605652441986-8c72e43c5f43?q=80&w=600',
  'fresh': 'https://images.unsplash.com/photo-1595535873420-a599195b3f4a?q=80&w=600',
  'default': 'https://images.unsplash.com/photo-1541643600914-78b084683702?q=80&w=600',
}

interface Props { categories: Category[] }

export default function CategoryShowcase({ categories }: Props) {
  const displayCategories = categories.length > 0 ? categories : [
    { id: '1', name: 'Luxury Oud', slug: 'luxury-oud', description: 'Ancient wood, deep warmth', created_at: '' },
    { id: '2', name: 'Oriental', slug: 'oriental', description: 'Spice, amber & mystery', created_at: '' },
    { id: '3', name: 'Floral', slug: 'floral', description: 'Blooming gardens in a bottle', created_at: '' },
  ]

  return (
    <section className="py-24 bg-champagne">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <p className="section-subtitle mb-3">Browse by Mood</p>
          <h2 className="section-title">Our <em className="italic text-gold-500">Collections</em></h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {displayCategories.slice(0, 3).map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.15 }}
            >
              <Link
                href={`/shop?category=${cat.slug}`}
                className={`group relative overflow-hidden block ${i === 0 ? 'aspect-[4/5]' : 'aspect-square'}`}
              >
                <img
                  src={CATEGORY_IMAGES[cat.slug] || CATEGORY_IMAGES.default}
                  alt={cat.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 p-6">
                  <p className="font-body text-xs text-gold-300 tracking-widest uppercase mb-2">{cat.description}</p>
                  <h3 className="font-display text-3xl text-white font-light">{cat.name}</h3>
                  <div className="flex items-center gap-2 mt-3 text-white/60 font-body text-xs tracking-widest uppercase group-hover:text-gold-300 transition-colors">
                    <span>Explore</span>
                    <ArrowUpRight size={12} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
