import { createClient } from '@/lib/supabase/server'
import { formatDate, formatPrice, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '@/lib/utils'
import AdminOrderStatus from '@/components/admin/AdminOrderStatus'

export const metadata = { title: 'Orders — Admin' }

export default async function AdminOrdersPage() {
  const supabase = await createClient()
  const { data: orders } = await supabase
    .from('orders')
    .select('*, profiles(full_name, phone), order_items(quantity)')
    .order('created_at', { ascending: false })

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-4xl font-light">Orders</h1>
        <p className="font-body text-sm text-stone-400 mt-1">{orders?.length || 0} total orders</p>
      </div>

      <div className="bg-white border border-stone-100 rounded-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-stone-100 bg-stone-50">
                {['Order #', 'Customer', 'Date', 'Items', 'Total', 'Payment', 'Status', 'Update Status'].map(h => (
                  <th key={h} className="text-left px-4 py-3 font-body text-xs text-stone-400 tracking-widest uppercase whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {orders?.map((order: any) => {
                const itemCount = order.order_items?.reduce((s: number, i: any) => s + i.quantity, 0) || 0
                return (
                  <tr key={order.id} className="hover:bg-stone-50/30 transition-colors">
                    <td className="px-4 py-3 font-body text-sm font-medium">#{order.id.slice(0, 8).toUpperCase()}</td>
                    <td className="px-4 py-3">
                      <p className="font-body text-sm">{order.profiles?.full_name || 'Unknown'}</p>
                      <p className="font-body text-xs text-stone-400">{order.profiles?.phone}</p>
                    </td>
                    <td className="px-4 py-3 font-body text-xs text-stone-400 whitespace-nowrap">{formatDate(order.created_at)}</td>
                    <td className="px-4 py-3 font-body text-sm text-center">{itemCount}</td>
                    <td className="px-4 py-3 font-body text-sm font-medium">{formatPrice(order.total)}</td>
                    <td className="px-4 py-3">
                      <span className={`font-body text-xs px-2 py-1 rounded-full ${
                        order.payment_status === 'paid' ? 'bg-green-100 text-green-700' :
                        order.payment_status === 'failed' ? 'bg-red-100 text-red-700' :
                        'bg-amber-100 text-amber-700'
                      }`}>
                        {order.payment_status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`font-body text-xs px-2 py-1 rounded-full ${ORDER_STATUS_COLORS[order.status] || 'bg-stone-100'}`}>
                        {ORDER_STATUS_LABELS[order.status] || order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <AdminOrderStatus orderId={order.id} currentStatus={order.status} />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {(!orders || orders.length === 0) && (
            <div className="py-16 text-center">
              <p className="font-display text-2xl font-light text-stone-300">No orders yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
