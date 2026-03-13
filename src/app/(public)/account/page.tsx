import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { User, Package, LogOut } from 'lucide-react'
import LogoutButton from '@/components/ui/LogoutButton'
import { formatDate } from '@/lib/utils'

export default async function AccountPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  const { data: recentOrders } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(5)

  return (
    <div className="min-h-screen bg-ivory pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-6">
        <div className="mb-10">
          <p className="section-subtitle mb-2">Welcome Back</p>
          <h1 className="font-display text-5xl font-light">
            My <em className="italic text-gold-500">Account</em>
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            { icon: User, label: 'Profile', sub: profile?.full_name || user.email, href: '#' },
            { icon: Package, label: 'Orders', sub: `${recentOrders?.length || 0} recent orders`, href: '/account/orders' },
          ].map((card) => (
            <Link key={card.label} href={card.href}
              className="bg-white p-6 border border-stone-100 hover:border-gold-300 transition-colors group">
              <card.icon size={22} className="text-gold-500 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="font-display text-xl font-light mb-1">{card.label}</h3>
              <p className="font-body text-sm text-stone-400">{card.sub}</p>
            </Link>
          ))}
          <LogoutButton />
        </div>

        {/* Profile Info */}
        <div className="bg-white border border-stone-100 p-8 mb-6">
          <h2 className="font-display text-2xl font-light mb-6">Profile Information</h2>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="font-body text-xs text-stone-400 tracking-widest uppercase mb-1">Full Name</p>
              <p className="font-body text-base">{profile?.full_name || '—'}</p>
            </div>
            <div>
              <p className="font-body text-xs text-stone-400 tracking-widest uppercase mb-1">Email</p>
              <p className="font-body text-base">{user.email}</p>
            </div>
            <div>
              <p className="font-body text-xs text-stone-400 tracking-widest uppercase mb-1">Phone</p>
              <p className="font-body text-base">{profile?.phone || '—'}</p>
            </div>
            <div>
              <p className="font-body text-xs text-stone-400 tracking-widest uppercase mb-1">Member Since</p>
              <p className="font-body text-base">{formatDate(user.created_at)}</p>
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        {recentOrders && recentOrders.length > 0 && (
          <div className="bg-white border border-stone-100 p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-2xl font-light">Recent Orders</h2>
              <Link href="/account/orders" className="font-body text-xs text-gold-500 tracking-widest uppercase hover:underline">View All</Link>
            </div>
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <Link key={order.id} href={`/account/orders/${order.id}`}
                  className="flex items-center justify-between p-4 border border-stone-50 hover:border-gold-200 transition-colors">
                  <div>
                    <p className="font-body text-sm font-medium">#{order.id.slice(0, 8).toUpperCase()}</p>
                    <p className="font-body text-xs text-stone-400">{formatDate(order.created_at)}</p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-block font-body text-xs px-2 py-1 ${
                      order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                      order.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                      order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                    <p className="font-body text-sm font-medium mt-1">${order.total.toFixed(2)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
