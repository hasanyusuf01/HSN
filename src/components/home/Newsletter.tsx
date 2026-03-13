'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  return (
    <section className="py-24 bg-ivory">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <p className="section-subtitle mb-4">Stay Inspired</p>
          <h2 className="section-title mb-4">
            The <em className="italic text-gold-500">Insider</em>
          </h2>
          <p className="font-body text-stone-500 mb-10 max-w-md mx-auto leading-relaxed">
            New arrivals, exclusive offers, and the art of fragrance — delivered to your inbox.
          </p>
          {submitted ? (
            <motion.p
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="font-display text-xl text-gold-500 italic"
            >
              Welcome to the world of Luxe Essence ✦
            </motion.p>
          ) : (
            <form
              onSubmit={(e) => { e.preventDefault(); setSubmitted(true) }}
              className="flex flex-col sm:flex-row gap-0 max-w-md mx-auto border border-obsidian"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                required
                className="flex-1 px-6 py-4 font-body text-sm bg-transparent outline-none placeholder:text-stone-400"
              />
              <button type="submit" className="px-6 py-4 bg-obsidian text-white font-body text-xs tracking-widest uppercase hover:bg-gold-500 transition-colors flex items-center gap-2 justify-center">
                Subscribe <ArrowRight size={12} />
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  )
}
