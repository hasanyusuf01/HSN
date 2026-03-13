'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBag, User, Search, Menu, X, Heart } from 'lucide-react'
import { useCart } from '@/lib/hooks/useCart'
import { createClient } from '@/lib/supabase/client'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const { itemCount } = useCart()
  const pathname = usePathname()
  const supabase = createClient()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  const isHome = pathname === '/'

  const navLinks = [
    { href: '/shop', label: 'Collection' },
    { href: '/shop?category=luxury-oud', label: 'Oud' },
    { href: '/shop?category=oriental', label: 'Oriental' },
    { href: '/shop?category=floral', label: 'Floral' },
  ]

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled || !isHome
            ? 'bg-white/95 backdrop-blur-md border-b border-stone-100 shadow-sm'
            : 'bg-transparent'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex flex-col leading-none">
            <span className={`font-display text-2xl font-light tracking-[0.15em] transition-colors ${
              scrolled || !isHome ? 'text-obsidian' : 'text-white'
            }`}>
              LUXE
            </span>
            <span className={`font-body text-[9px] tracking-[0.5em] uppercase transition-colors ${
              scrolled || !isHome ? 'text-gold-500' : 'text-gold-300'
            }`}>
              ESSENCE
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`font-body text-xs tracking-widest uppercase transition-colors hover:text-gold-500 ${
                  scrolled || !isHome ? 'text-stone-600' : 'text-white/80'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Icons */}
          <div className="flex items-center gap-4">
            <button className={`p-2 transition-colors hover:text-gold-500 ${
              scrolled || !isHome ? 'text-stone-600' : 'text-white/80'
            }`}>
              <Search size={18} />
            </button>

            {user ? (
              <Link href="/account" className={`p-2 transition-colors hover:text-gold-500 ${
                scrolled || !isHome ? 'text-stone-600' : 'text-white/80'
              }`}>
                <User size={18} />
              </Link>
            ) : (
              <Link href="/login" className={`p-2 transition-colors hover:text-gold-500 ${
                scrolled || !isHome ? 'text-stone-600' : 'text-white/80'
              }`}>
                <User size={18} />
              </Link>
            )}

            <Link href="/cart" className={`relative p-2 transition-colors hover:text-gold-500 ${
              scrolled || !isHome ? 'text-stone-600' : 'text-white/80'
            }`}>
              <ShoppingBag size={18} />
              {itemCount > 0 && (
                <motion.span
                  key={itemCount}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-gold-500 text-white text-[9px] rounded-full flex items-center justify-center font-body font-medium"
                >
                  {itemCount}
                </motion.span>
              )}
            </Link>

            {/* Mobile menu button */}
            <button
              className={`md:hidden p-2 transition-colors ${
                scrolled || !isHome ? 'text-stone-600' : 'text-white'
              }`}
              onClick={() => setMenuOpen(true)}
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-50 bg-obsidian"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          >
            <div className="p-6 flex justify-end">
              <button onClick={() => setMenuOpen(false)} className="text-white p-2">
                <X size={24} />
              </button>
            </div>
            <nav className="flex flex-col items-center gap-8 pt-12">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link
                    href={link.href}
                    className="font-display text-4xl text-white hover:text-gold-400 transition-colors"
                    onClick={() => setMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex gap-6 pt-8"
              >
                <Link href={user ? '/account' : '/login'} onClick={() => setMenuOpen(false)} className="text-white/60 hover:text-gold-400 transition-colors">
                  <User size={22} />
                </Link>
                <Link href="/cart" onClick={() => setMenuOpen(false)} className="text-white/60 hover:text-gold-400 transition-colors">
                  <ShoppingBag size={22} />
                </Link>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
