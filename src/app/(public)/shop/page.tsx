import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import ProductGrid from '@/components/product/ProductGrid'
import ShopFilters from '@/components/product/ShopFilters'

export const metadata: Metadata = { title: 'Shop — Luxe Essence' }

interface SearchParams {
  category?: string
  sort?: string
  search?: string
  page?: string
}

export default async function ShopPage({ searchParams }: { searchParams: SearchParams }) {
  const supabase = await createClient()
  const page = parseInt(searchParams.page || '1')
  const perPage = 12
  const from = (page - 1) * perPage
  const to = from + perPage - 1

  let query = supabase
    .from('products')
    .select('*, categories(*)', { count: 'exact' })
    .eq('is_active', true)
    .range(from, to)

  if (searchParams.category) {
    const { data: cat } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', searchParams.category)
      .single()
    if (cat) query = query.eq('category_id', cat.id)
  }

  if (searchParams.search) {
    query = query.ilike('name', `%${searchParams.search}%`)
  }

  switch (searchParams.sort) {
    case 'price_asc': query = query.order('price', { ascending: true }); break
    case 'price_desc': query = query.order('price', { ascending: false }); break
    case 'newest': query = query.order('created_at', { ascending: false }); break
    default: query = query.order('featured', { ascending: false }).order('created_at', { ascending: false })
  }

  const { data: products, count } = await query

  const { data: categories } = await supabase.from('categories').select('*')

  return (
    <div className="min-h-screen bg-ivory pt-24">
      {/* Header */}
      <div className="bg-champagne border-b border-stone-200 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <p className="font-body text-xs text-gold-500 tracking-widest uppercase mb-2">Discover</p>
          <h1 className="font-display text-5xl font-light">The Collection</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex flex-col lg:flex-row gap-10">
          <ShopFilters
            categories={categories ?? []}
            activeCategory={searchParams.category}
            activeSort={searchParams.sort}
            searchValue={searchParams.search}
          />
          <ProductGrid
            products={products ?? []}
            total={count ?? 0}
            page={page}
            perPage={perPage}
          />
        </div>
      </div>
    </div>
  )
}
