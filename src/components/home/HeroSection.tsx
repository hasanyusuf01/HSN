'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

export default function HeroSection() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  return (
    <section ref={ref} className="relative h-screen min-h-[700px] overflow-hidden flex items-center">
      {/* Background */}
      <motion.div className="absolute inset-0" style={{ y }}>
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1541643600914-78b084683702?q=80&w=2508&auto=format&fit=crop')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/30" />
      </motion.div>

      {/* Decorative grain overlay */}
      <div className="absolute inset-0 opacity-20"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.4'/%3E%3C/svg%3E\")" }}
      />

      <motion.div
        className="relative z-10 max-w-7xl mx-auto px-6 w-full"
        style={{ opacity }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-6"
        >
          <span className="font-body text-xs text-gold-300 tracking-[0.5em] uppercase">
            New Collection 2025
          </span>
          <div className="w-16 h-px bg-gold-400 mt-3" />
        </motion.div>

        <motion.h1
          className="font-display text-6xl md:text-8xl lg:text-[110px] text-white font-light leading-none mb-6 max-w-3xl"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          The Art of
          <br />
          <em className="italic text-gold-300">Fragrance</em>
        </motion.h1>

        <motion.p
          className="font-body text-lg text-white/60 max-w-md mb-10 leading-relaxed font-light"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          Rare essences from ancient traditions, reimagined for the modern soul. Each bottle holds a journey.
        </motion.p>

        <motion.div
          className="flex flex-wrap gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          <Link href="/shop" className="group flex items-center gap-3 px-8 py-4 bg-white text-obsidian font-body text-xs tracking-widest uppercase hover:bg-gold-500 hover:text-white transition-all duration-300">
            Explore Collection
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link href="/shop?featured=true" className="flex items-center gap-3 px-8 py-4 border border-white/40 text-white font-body text-xs tracking-widest uppercase hover:border-gold-400 hover:text-gold-300 transition-all duration-300">
            Featured Picks
          </Link>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-10 left-6 flex flex-col items-start gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <motion.div
            className="w-px h-12 bg-white/30 origin-top"
            animate={{ scaleY: [1, 0.3, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <span className="font-body text-[9px] text-white/30 tracking-[0.3em] uppercase">Scroll</span>
        </motion.div>
      </motion.div>

      {/* Floating tag */}
      <motion.div
        className="absolute bottom-20 right-10 hidden lg:flex flex-col items-end"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.9, duration: 0.7 }}
        style={{ opacity }}
      >
        <div className="border border-white/20 backdrop-blur-sm bg-white/5 px-6 py-4 text-right">
          <p className="font-body text-xs text-white/40 tracking-widest uppercase mb-1">Free Shipping</p>
          <p className="font-display text-lg text-white font-light">On orders over $100</p>
        </div>
      </motion.div>
    </section>
  )
}
