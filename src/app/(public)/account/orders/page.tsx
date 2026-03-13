import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { formatDate, formatPrice, ORDER_STATUS_COLORS, ORDER_STATUS_LABELS } from '@/lib/utils'
import { Package } from 'lucide-react'

export const metadata = { title: 'My Orders — Luxe Essence' }

export default async function OrdersPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: orders } = await supabase
    .from('orders')
    .select('*, order_items(*, products(name, image_urls))')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-ivory pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-6">
        <div className="mb-10">
          <p className="section-subtitle mb-2">Your History</p>
          <h1 className="font-display text-5xl font-light">
            My <em className="italic text-gold-500">Orders</em>
          </h1>
        </div>

        {!orders || orders.length === 0 ? (
          <div className="text-center py-24">
            <Package size={48} className="text-stone-200 mx-auto mb-6" />
            <h2 className="font-display text-3xl font-light text-stone-400 mb-3">No orders yet</h2>
            <p className="font-body text-sm text-stone-400 mb-8">Your order history will appear here</p>
            <Link href="/shop" className="btn-primary">Start Shopping</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const items = order.order_items as any[]
              const firstImg = items?.[0]?.products?.image_urls?.[0]
              return (
                <Link
                  key={order.id}
                  href={`/account/orders/${order.id}`}
                  className="block bg-white border border-stone-100 hover:border-gold-300 transition-colors p-6 group"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      {firstImg && (
                        <img
                          src={firstImg}
                          alt=""
                          className="w-16 h-20 object-cover bg-stone-100 flex-shrink-0"
                        />
                      )}
                      <div>
                        <p className="font-body text-xs text-stone-400 tracking-widest uppercase mb-1">
                          Order #{order.id.slice(0, 8).toUpperCase()}
                        </p>
                        <p className="font-display text-lg font-light mb-1">
                          {items?.length} item{items?.length !== 1 ? 's' : ''}
                        </p>
                        <p className="font-body text-xs text-stone-400">{formatDate(order.created_at)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`font-body text-xs px-3 py-1 ${ORDER_STATUS_COLORS[order.status] || 'bg-stone-100 text-stone-600'}`}>
                        {ORDER_STATUS_LABELS[order.status] || order.status}
                      </span>
                      <span className="font-body font-medium">{formatPrice(order.total)}</span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
