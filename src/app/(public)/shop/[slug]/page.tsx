import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import ProductDetail from '@/components/product/ProductDetail'
import RelatedProducts from '@/components/product/RelatedProducts'

interface Props { params: { slug: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = await createClient()
  const { data } = await supabase.from('products').select('name, short_description').eq('slug', params.slug).single()
  if (!data) return { title: 'Product Not Found' }
  return { title: data.name, description: data.short_description ?? undefined }
}

export default async function ProductPage({ params }: Props) {
  const supabase = await createClient()

  const { data: product } = await supabase
    .from('products')
    .select('*, categories(*)')
    .eq('slug', params.slug)
    .eq('is_active', true)
    .single()

  if (!product) notFound()

  const { data: related } = await supabase
    .from('products')
    .select('*, categories(*)')
    .eq('category_id', product.category_id ?? '')
    .eq('is_active', true)
    .neq('id', product.id)
    .limit(4)

  return (
    <div className="pt-20 bg-ivory min-h-screen">
      <ProductDetail product={product} />
      {related && related.length > 0 && <RelatedProducts products={related} />}
    </div>
  )
}
