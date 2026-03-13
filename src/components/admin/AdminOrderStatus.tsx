'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { OrderStatus } from '@/types/database'

const statuses: OrderStatus[] = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']

export default function AdminOrderStatus({ orderId, currentStatus }: { orderId: string; currentStatus: string }) {
  const [status, setStatus] = useState(currentStatus)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleChange = async (newStatus: string) => {
    setLoading(true)
    setStatus(newStatus)
    await supabase.from('orders').update({ status: newStatus }).eq('id', orderId)
    setLoading(false)
    router.refresh()
  }

  return (
    <select
      value={status}
      onChange={e => handleChange(e.target.value)}
      disabled={loading}
      className="border border-stone-200 px-2 py-1.5 font-body text-xs outline-none focus:border-gold-400 transition-colors bg-white disabled:opacity-50 cursor-pointer"
    >
      {statuses.map(s => (
        <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
      ))}
    </select>
  )
}
