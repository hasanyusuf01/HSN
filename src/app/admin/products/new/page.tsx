import { createClient } from '@/lib/supabase/server'
import ProductForm from '@/components/admin/ProductForm'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const metadata = { title: 'New Product — Admin' }

export default async function NewProductPage() {
  const supabase = await createClient()
  const { data: categories } = await supabase.from('categories').select('*').order('name')

  return (
    <div>
      <Link href="/admin/products" className="inline-flex items-center gap-2 font-body text-xs tracking-widest uppercase text-stone-400 hover:text-gold-500 transition-colors mb-6">
        <ArrowLeft size={12} /> Back to Products
      </Link>
      <h1 className="font-display text-4xl font-light mb-8">Add New Product</h1>
      <ProductForm categories={categories ?? []} mode="new" />
    </div>
  )
}
