'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, Package, Tag, ShoppingCart, LogOut, ExternalLink } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/categories', label: 'Categories', icon: Tag },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingCart },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href)

  return (
    <aside className="w-60 bg-obsidian flex-shrink-0 flex flex-col min-h-screen">
      {/* Logo */}
      <div className="px-6 py-8 border-b border-white/10">
        <div className="flex flex-col leading-none">
          <span className="font-display text-2xl text-white font-light tracking-[0.15em]">LUXE</span>
          <span className="font-body text-[9px] text-gold-400 tracking-[0.5em] uppercase">ADMIN</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {navItems.map(({ href, label, icon: Icon, exact }) => (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-sm font-body text-sm transition-all ${
              isActive(href, exact)
                ? 'bg-gold-500/20 text-gold-300 border-l-2 border-gold-400'
                : 'text-white/50 hover:text-white/90 hover:bg-white/5'
            }`}
          >
            <Icon size={16} />
            {label}
          </Link>
        ))}
      </nav>

      {/* Bottom */}
      <div className="px-4 py-6 border-t border-white/10 space-y-1">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-3 py-2.5 text-white/40 hover:text-white/70 font-body text-sm transition-colors"
        >
          <ExternalLink size={16} />
          View Store
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-white/40 hover:text-red-400 font-body text-sm transition-colors"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </aside>
  )
}
