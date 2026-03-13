import { createClient } from '@/lib/supabase/server'
import { formatPrice } from '@/lib/utils'
import { Package, ShoppingCart, Users, DollarSign } from 'lucide-react'

export const metadata = { title: 'Admin Dashboard — Luxe Essence' }

export default async function AdminDashboard() {
  const supabase = await createClient()

const [
  { count: productCount },
  { count: orderCount },
  { count: userCount },
  { data: revenueData },
  { data: recentOrders },
] = await Promise.all([
  (supabase as any).from('products').select('*', { count: 'exact', head: true }).eq('is_active', true),
  (supabase as any).from('orders').select('*', { count: 'exact', head: true }),
  (supabase as any).from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'customer'),
  (supabase as any).from('orders').select('total').neq('status', 'cancelled'),
  (supabase as any).from('orders').select('*, profiles(full_name)').order('created_at', { ascending: false }).limit(8),
])

const totalRevenue = (revenueData as any[])?.reduce((sum: number, o: any) => sum + o.total, 0) || 0
  const stats = [
    { label: 'Active Products', value: productCount || 0, icon: Package, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Total Orders', value: orderCount || 0, icon: ShoppingCart, color: 'text-purple-500', bg: 'bg-purple-50' },
    { label: 'Customers', value: userCount || 0, icon: Users, color: 'text-green-500', bg: 'bg-green-50' },
    { label: 'Revenue', value: formatPrice(totalRevenue), icon: DollarSign, color: 'text-gold-500', bg: 'bg-amber-50', isPrice: true },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-4xl font-light text-obsidian">Dashboard</h1>
        <p className="font-body text-sm text-stone-400 mt-1">Welcome back to Luxe Essence admin</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-10">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white border border-stone-100 p-6 rounded-sm">
            <div className={`w-10 h-10 ${stat.bg} rounded-sm flex items-center justify-center mb-4`}>
              <stat.icon size={20} className={stat.color} />
            </div>
            <p className="font-display text-3xl font-light text-obsidian mb-1">{stat.value}</p>
            <p className="font-body text-xs text-stone-400 tracking-widest uppercase">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white border border-stone-100 rounded-sm">
        <div className="px-6 py-5 border-b border-stone-100 flex items-center justify-between">
          <h2 className="font-display text-xl font-light">Recent Orders</h2>
          <a href="/admin/orders" className="font-body text-xs text-gold-500 tracking-widest uppercase hover:underline">View All</a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-stone-50">
                {['Order', 'Customer', 'Date', 'Total', 'Status'].map((h) => (
                  <th key={h} className="text-left px-6 py-3 font-body text-xs text-stone-400 tracking-widest uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {recentOrders?.map((order: any) => (
                <tr key={order.id} className="hover:bg-stone-50/50 transition-colors">
                  <td className="px-6 py-4 font-body text-sm font-medium">#{order.id.slice(0, 8).toUpperCase()}</td>
                  <td className="px-6 py-4 font-body text-sm text-stone-600">{order.profiles?.full_name || 'Guest'}</td>
                  <td className="px-6 py-4 font-body text-sm text-stone-400">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 font-body text-sm">{formatPrice(order.total)}</td>
                  <td className="px-6 py-4">
                    <span className={`font-body text-xs px-2 py-1 rounded-full ${
                      order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                      order.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                      order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                      order.status === 'processing' ? 'bg-purple-100 text-purple-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
