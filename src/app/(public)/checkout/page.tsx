'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useCart } from '@/lib/hooks/useCart'
import { checkoutSchema, CheckoutInput } from '@/lib/validations'
import { createClient } from '@/lib/supabase/client'
import { formatPrice } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const supabase = createClient()

  const { register, handleSubmit, formState: { errors } } = useForm<CheckoutInput>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { payment_method: 'cod', country: 'US' }
  })

  const shipping = total >= 100 ? 0 : 9.99
  const orderTotal = total + shipping

  const onSubmit = async (data: CheckoutInput) => {
    setLoading(true)
    setError('')
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login?redirect=/checkout'); return }

      const shippingAddress = {
        full_name: data.full_name,
        phone: data.phone,
        address_line1: data.address_line1,
        address_line2: data.address_line2,
        city: data.city,
        state: data.state,
        postal_code: data.postal_code,
        country: data.country,
      }

const { data: order, error: orderErr } = await (supabase as any)
  .from('orders')
  .insert({
    user_id: user.id,
    status: 'pending',
    subtotal: total,
    shipping_fee: shipping,
    total: orderTotal,
    payment_method: data.payment_method,
    payment_status: 'pending',
    shipping_address: shippingAddress,
  })
  .select()
  .single()

      if (orderErr || !order) throw orderErr

      const orderItems = items.map((item) => ({
        order_id: order.id,
        product_id: item.product.id,
        product_name: item.product.name,
        unit_price: item.product.discount_price ?? item.product.price,
        quantity: item.quantity,
        selected_size: item.selected_size,
      }))

      await (supabase as any).from('order_items').insert(orderItems)

      clearCart()
      router.push(`/account/orders/${order.id}?success=true`)
    } catch (err: any) {
      setError(err?.message || 'Failed to place order. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) {
    router.push('/cart')
    return null
  }

  const fieldClass = "w-full border-b border-stone-200 py-3 bg-transparent font-body text-sm outline-none focus:border-gold-400 transition-colors placeholder:text-stone-300"
  const errClass = "font-body text-xs text-red-500 mt-1"

  return (
    <div className="min-h-screen bg-ivory pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-10">
          <p className="section-subtitle mb-2">Final Step</p>
          <h1 className="font-display text-5xl font-light">Checkout</h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Shipping Form */}
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h2 className="font-display text-2xl font-light mb-6">Shipping Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <input {...register('full_name')} placeholder="Full Name" className={fieldClass} />
                    {errors.full_name && <p className={errClass}>{errors.full_name.message}</p>}
                  </div>
                  <div>
                    <input {...register('phone')} placeholder="Phone Number" className={fieldClass} />
                    {errors.phone && <p className={errClass}>{errors.phone.message}</p>}
                  </div>
                  <div className="md:col-span-2">
                    <input {...register('address_line1')} placeholder="Address Line 1" className={fieldClass} />
                    {errors.address_line1 && <p className={errClass}>{errors.address_line1.message}</p>}
                  </div>
                  <div className="md:col-span-2">
                    <input {...register('address_line2')} placeholder="Address Line 2 (Optional)" className={fieldClass} />
                  </div>
                  <div>
                    <input {...register('city')} placeholder="City" className={fieldClass} />
                    {errors.city && <p className={errClass}>{errors.city.message}</p>}
                  </div>
                  <div>
                    <input {...register('state')} placeholder="State / Province" className={fieldClass} />
                    {errors.state && <p className={errClass}>{errors.state.message}</p>}
                  </div>
                  <div>
                    <input {...register('postal_code')} placeholder="Postal Code" className={fieldClass} />
                    {errors.postal_code && <p className={errClass}>{errors.postal_code.message}</p>}
                  </div>
                  <div>
                    <input {...register('country')} placeholder="Country" className={fieldClass} />
                    {errors.country && <p className={errClass}>{errors.country.message}</p>}
                  </div>
                </div>
              </div>

              {/* Payment */}
              <div>
                <h2 className="font-display text-2xl font-light mb-6">Payment Method</h2>
                <div className="space-y-3">
                  {[
                    { value: 'cod', label: 'Cash on Delivery', sub: 'Pay when your order arrives' },
                    { value: 'bank_transfer', label: 'Bank Transfer', sub: 'We will send you transfer details' },
                  ].map((opt) => (
                    <label key={opt.value} className="flex items-start gap-4 p-4 border border-stone-200 cursor-pointer hover:border-gold-400 transition-colors has-[:checked]:border-gold-500 has-[:checked]:bg-gold-50/30">
                      <input type="radio" value={opt.value} {...register('payment_method')} className="mt-1 accent-gold-500" />
                      <div>
                        <p className="font-body text-sm font-medium">{opt.label}</p>
                        <p className="font-body text-xs text-stone-400">{opt.sub}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {error && (
                <p className="font-body text-sm text-red-500 bg-red-50 p-3">{error}</p>
              )}
            </div>

            {/* Order Summary */}
            <div>
              <div className="bg-champagne p-6 sticky top-28">
                <h2 className="font-display text-2xl font-light mb-6">Your Order</h2>
                <div className="space-y-4 mb-6">
                  {items.map((item) => (
                    <div key={`${item.product.id}-${item.selected_size}`} className="flex gap-3">
                      <img
                        src={item.product.image_urls?.[0] || 'https://images.unsplash.com/photo-1541643600914-78b084683702?q=80&w=80'}
                        alt={item.product.name}
                        className="w-14 h-16 object-cover bg-stone-100 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-display text-base font-light truncate">{item.product.name}</p>
                        {item.selected_size && <p className="font-body text-xs text-stone-400">{item.selected_size}</p>}
                        <p className="font-body text-sm text-stone-500">× {item.quantity}</p>
                      </div>
                      <p className="font-body text-sm font-medium whitespace-nowrap">
                        {formatPrice((item.product.discount_price ?? item.product.price) * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="space-y-2 py-4 border-y border-stone-200 mb-4">
                  <div className="flex justify-between font-body text-sm text-stone-500">
                    <span>Subtotal</span><span>{formatPrice(total)}</span>
                  </div>
                  <div className="flex justify-between font-body text-sm text-stone-500">
                    <span>Shipping</span>
                    <span className={shipping === 0 ? 'text-green-600' : ''}>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
                  </div>
                </div>
                <div className="flex justify-between font-body font-medium mb-6">
                  <span>Total</span><span>{formatPrice(orderTotal)}</span>
                </div>
                <motion.button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full flex items-center justify-center gap-2"
                  whileTap={{ scale: 0.98 }}
                >
                  {loading ? <Loader2 size={16} className="animate-spin" /> : null}
                  {loading ? 'Placing Order...' : 'Place Order'}
                </motion.button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
