'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Instagram, Facebook, Twitter } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-obsidian text-white/70">
      {/* Top strip */}
      <div className="border-b border-white/10 py-12">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-1">
            <div className="flex flex-col leading-none mb-6">
              <span className="font-display text-3xl text-white font-light tracking-[0.15em]">LUXE</span>
              <span className="font-body text-[9px] text-gold-400 tracking-[0.5em] uppercase">ESSENCE</span>
            </div>
            <p className="font-body text-sm text-white/50 leading-relaxed max-w-xs">
              Rare fragrances for those who seek to leave an impression. Curated from the finest ingredients worldwide.
            </p>
            <div className="flex gap-4 mt-6">
              {[Instagram, Facebook, Twitter].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 border border-white/20 flex items-center justify-center text-white/50 hover:border-gold-400 hover:text-gold-400 transition-all duration-300">
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-body text-xs tracking-widest uppercase text-white mb-5">Collections</h4>
            <ul className="space-y-3">
              {['Luxury Oud', 'Oriental', 'Floral', 'Woody', 'Fresh'].map((item) => (
                <li key={item}>
                  <Link href={`/shop?category=${item.toLowerCase().replace(' ', '-')}`}
                    className="font-body text-sm text-white/50 hover:text-gold-400 transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-body text-xs tracking-widest uppercase text-white mb-5">Account</h4>
            <ul className="space-y-3">
              {[['My Account', '/account'], ['My Orders', '/account/orders'], ['Wishlist', '/account'], ['Login', '/login'], ['Register', '/register']].map(([label, href]) => (
                <li key={label}>
                  <Link href={href} className="font-body text-sm text-white/50 hover:text-gold-400 transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-body text-xs tracking-widest uppercase text-white mb-5">Support</h4>
            <ul className="space-y-3">
              {[['About Us', '#'], ['Contact', '#'], ['Shipping Policy', '#'], ['Returns', '#'], ['FAQ', '#']].map(([label, href]) => (
                <li key={label}>
                  <Link href={href} className="font-body text-sm text-white/50 hover:text-gold-400 transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <p className="font-body text-xs text-white/30 uppercase tracking-widest mb-2">Contact</p>
              <p className="font-body text-sm text-white/50">hello@luxeessence.com</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-3">
        <p className="font-body text-xs text-white/30">© {new Date().getFullYear()} Luxe Essence. All rights reserved.</p>
        <p className="font-body text-xs text-white/30">Crafted with precision & passion</p>
      </div>
    </footer>
  )
}
