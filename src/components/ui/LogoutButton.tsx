'use client'

import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function LogoutButton() {
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <button
      onClick={handleLogout}
      className="bg-white p-6 border border-stone-100 hover:border-red-200 transition-colors group text-left"
    >
      <LogOut size={22} className="text-stone-400 mb-4 group-hover:text-red-400 transition-colors" />
      <h3 className="font-display text-xl font-light mb-1">Sign Out</h3>
      <p className="font-body text-sm text-stone-400">Log out of your account</p>
    </button>
  )
}
