'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

export default function BrandStory() {
  return (
    <section className="py-24 bg-obsidian overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Text */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <p className="font-body text-xs tracking-[0.4em] uppercase text-gold-400 mb-5">Our Philosophy</p>
          <h2 className="font-display text-5xl md:text-6xl text-white font-light leading-tight mb-8">
            Where Tradition
            <br />
            Meets <em className="italic text-gold-300">Modernity</em>
          </h2>
          <div className="w-16 h-px bg-gold-500 mb-8" />
          <p className="font-body text-white/50 leading-relaxed mb-5 font-light">
            Born from a reverence for the ancient art of perfumery, Luxe Essence bridges centuries of craft with contemporary desire. We source only the rarest ingredients—Cambodian oud, Bulgarian rose, Somalian frankincense—and entrust them to master noses.
          </p>
          <p className="font-body text-white/50 leading-relaxed font-light">
            Every fragrance is a story. A memory crystallized. A signature as unique as the person who wears it.
          </p>
          <div className="grid grid-cols-3 gap-8 mt-12 pt-10 border-t border-white/10">
            {[['15+', 'Rare Ingredients'], ['200+', 'Unique Blends'], ['50k+', 'Happy Clients']].map(([num, label]) => (
              <div key={label}>
                <p className="font-display text-3xl text-gold-400 font-light">{num}</p>
                <p className="font-body text-xs text-white/30 tracking-widest uppercase mt-1">{label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Image collage */}
        <motion.div
          className="relative h-[550px] hidden lg:block"
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="absolute top-0 right-0 w-64 h-80 overflow-hidden luxury-border">
            <img
              src="https://images.unsplash.com/photo-1588514912908-a927ef3f0e96?q=80&w=600&auto=format&fit=crop"
              alt="Perfume crafting"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute bottom-0 left-0 w-72 h-80 overflow-hidden luxury-border">
            <img
              src="https://images.unsplash.com/photo-1590156562745-5daf50b69200?q=80&w=600&auto=format&fit=crop"
              alt="Luxury perfume bottle"
              className="w-full h-full object-cover"
            />
          </div>
          {/* Gold accent */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gold-gradient opacity-10 rounded-full blur-2xl" />
          <div className="absolute top-20 left-20 w-px h-40 bg-gold-500/30" />
          <div className="absolute bottom-24 right-28 w-20 h-px bg-gold-500/30" />
        </motion.div>
      </div>
    </section>
  )
}
