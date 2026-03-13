import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import ProductForm from '@/components/admin/ProductForm'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

interface Props { params: { id: string } }

export const metadata = { title: 'Edit Product — Admin' }

export default async function EditProductPage({ params }: Props) {
  const supabase = await createClient()
  const [{ data: product }, { data: categories }] = await Promise.all([
    supabase.from('products').select('*').eq('id', params.id).single(),
    supabase.from('categories').select('*').order('name'),
  ])

  if (!product) notFound()

  return (
    <div>
      <Link href="/admin/products" className="inline-flex items-center gap-2 font-body text-xs tracking-widest uppercase text-stone-400 hover:text-gold-500 transition-colors mb-6">
        <ArrowLeft size={12} /> Back to Products
      </Link>
      <h1 className="font-display text-4xl font-light mb-2">Edit Product</h1>
      <p className="font-body text-sm text-stone-400 mb-8">{product.name}</p>
      <ProductForm categories={categories ?? []} product={product} mode="edit" />
    </div>
  )
}
