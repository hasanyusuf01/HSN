import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { formatDate, formatPrice, ORDER_STATUS_COLORS, ORDER_STATUS_LABELS } from '@/lib/utils'
import { CheckCircle, ArrowLeft } from 'lucide-react'
import { ShippingAddress } from '@/types/database'

interface Props {
  params: { id: string }
  searchParams: { success?: string }
}

export default async function OrderDetailPage({ params, searchParams }: Props) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')


  const { data: orderRaw } = await supabase
  .from('orders')
  .select('*, order_items(*, products(name, image_urls, slug))')
  .eq('id', params.id)
  .eq('user_id', user.id)
  .single()

if (!orderRaw) notFound()

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const order = orderRaw as any
const items: any[] = order.order_items
const address = order.shipping_address as ShippingAddress
  
  const isNew = searchParams.success === 'true'

  return (
    <div className="min-h-screen bg-ivory pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-6">
        {isNew && (
          <div className="bg-green-50 border border-green-200 p-6 mb-8 flex items-start gap-4">
            <CheckCircle size={24} className="text-green-500 flex-shrink-0 mt-0.5" />
            <div>
              <h2 className="font-display text-2xl font-light text-green-800 mb-1">Order Placed Successfully!</h2>
              <p className="font-body text-sm text-green-600">
                Thank you for your order. We'll confirm it shortly via email.
              </p>
            </div>
          </div>
        )}

        <Link href="/account/orders" className="inline-flex items-center gap-2 font-body text-xs tracking-widest uppercase text-stone-400 hover:text-gold-500 transition-colors mb-8">
          <ArrowLeft size={12} /> Back to Orders
        </Link>

        <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
          <div>
            <p className="font-body text-xs text-stone-400 tracking-widest uppercase mb-1">Order</p>
            <h1 className="font-display text-3xl font-light">#{order.id.slice(0, 8).toUpperCase()}</h1>
            <p className="font-body text-sm text-stone-400 mt-1">{formatDate(order.created_at)}</p>
          </div>
          <span className={`font-body text-sm px-4 py-2 ${ORDER_STATUS_COLORS[order.status] || 'bg-stone-100'}`}>
            {ORDER_STATUS_LABELS[order.status] || order.status}
          </span>
        </div>

        {/* Items */}
        <div className="bg-white border border-stone-100 p-6 mb-4">
          <h2 className="font-display text-xl font-light mb-5">Items</h2>
          <div className="divide-y divide-stone-50">
            {items.map((item: any) => (
              <div key={item.id} className="flex gap-4 py-4">
                <Link href={`/shop/${item.products?.slug || ''}`}>
                  <img
                    src={item.products?.image_urls?.[0] || 'https://images.unsplash.com/photo-1541643600914-78b084683702?q=80&w=100'}
                    alt={item.product_name}
                    className="w-16 h-20 object-cover bg-stone-100"
                  />
                </Link>
                <div className="flex-1">
                  <p className="font-display text-lg font-light">{item.product_name}</p>
                  {item.selected_size && <p className="font-body text-xs text-stone-400 mt-0.5">Size: {item.selected_size}</p>}
                  <p className="font-body text-sm text-stone-500 mt-1">Qty: {item.quantity}</p>
                </div>
                <p className="font-body font-medium">{formatPrice(item.unit_price * item.quantity)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Summary & shipping in grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white border border-stone-100 p-6">
            <h2 className="font-display text-xl font-light mb-4">Payment Summary</h2>
            <div className="space-y-2 text-sm font-body">
              <div className="flex justify-between text-stone-500"><span>Subtotal</span><span>{formatPrice(order.subtotal)}</span></div>
              <div className="flex justify-between text-stone-500">
                <span>Shipping</span>
                <span className={order.shipping_fee === 0 ? 'text-green-600' : ''}>{order.shipping_fee === 0 ? 'Free' : formatPrice(order.shipping_fee)}</span>
              </div>
              <div className="flex justify-between font-medium text-base pt-2 border-t border-stone-100">
                <span>Total</span><span>{formatPrice(order.total)}</span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-stone-100">
              <p className="font-body text-xs text-stone-400 uppercase tracking-widest mb-1">Payment Method</p>
              <p className="font-body text-sm capitalize">{order.payment_method.replace('_', ' ')}</p>
            </div>
          </div>

          <div className="bg-white border border-stone-100 p-6">
            <h2 className="font-display text-xl font-light mb-4">Shipping Address</h2>
            <div className="font-body text-sm text-stone-600 space-y-1">
              <p className="font-medium text-obsidian">{address.full_name}</p>
              <p>{address.phone}</p>
              <p>{address.address_line1}</p>
              {address.address_line2 && <p>{address.address_line2}</p>}
              <p>{address.city}, {address.state} {address.postal_code}</p>
              <p>{address.country}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
