'use client'

import { motion } from 'framer-motion'
import { Star } from 'lucide-react'

const testimonials = [
  {
    name: 'Aisha Al-Rashid',
    location: 'Dubai, UAE',
    rating: 5,
    text: "Oud Royale is unlike anything I've ever worn. It's majestic, long-lasting, and people stop me to ask what I'm wearing. Worth every penny.",
  },
  {
    name: 'Marcus Chen',
    location: 'Singapore',
    rating: 5,
    text: "Noir Bloom is my signature scent now. The floral notes are sophisticated without being overwhelming. The bottle itself is a work of art.",
  },
  {
    name: 'Elena Voronova',
    location: 'Paris, France',
    rating: 5,
    text: "Amber Silk is pure elegance. I received it as a gift and immediately ordered three more bottles. The longevity is extraordinary.",
  },
]

export default function Testimonials() {
  return (
    <section className="py-24 bg-obsidian">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <p className="font-body text-xs tracking-[0.4em] uppercase text-gold-400 mb-3">What Clients Say</p>
          <h2 className="font-display text-5xl text-white font-light">
            Worn & <em className="italic text-gold-300">Loved</em>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              className="border border-white/10 p-8 hover:border-gold-500/40 transition-colors duration-300"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.12 }}
            >
              <div className="flex gap-1 mb-5">
                {[...Array(t.rating)].map((_, j) => (
                  <Star key={j} size={12} className="fill-gold-400 text-gold-400" />
                ))}
              </div>
              <p className="font-display text-xl text-white/80 font-light italic leading-relaxed mb-6">
                &ldquo;{t.text}&rdquo;
              </p>
              <div className="border-t border-white/10 pt-5">
                <p className="font-body text-sm text-white font-medium">{t.name}</p>
                <p className="font-body text-xs text-white/30 tracking-wider">{t.location}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
