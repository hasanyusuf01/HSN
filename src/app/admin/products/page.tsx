import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { formatPrice } from '@/lib/utils'
import { Plus, Pencil, Trash2, ImageOff } from 'lucide-react'
import AdminDeleteProduct from '@/components/admin/AdminDeleteProduct'

export const metadata = { title: 'Products — Admin' }

export default async function AdminProductsPage() {
  const supabase = await createClient()
  const { data: products } = await supabase
    .from('products')
    .select('*, categories(name)')
    .order('created_at', { ascending: false })

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-4xl font-light">Products</h1>
          <p className="font-body text-sm text-stone-400 mt-1">{products?.length || 0} total products</p>
        </div>
        <Link href="/admin/products/new" className="flex items-center gap-2 px-5 py-2.5 bg-obsidian text-white font-body text-xs tracking-widest uppercase hover:bg-gold-500 transition-colors">
          <Plus size={14} /> Add Product
        </Link>
      </div>

      <div className="bg-white border border-stone-100 rounded-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-stone-100 bg-stone-50">
                {['Product', 'Category', 'Price', 'Stock', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="text-left px-5 py-3 font-body text-xs text-stone-400 tracking-widest uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {products?.map((product: any) => (
                <tr key={product.id} className="hover:bg-stone-50/30 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      {product.image_urls?.[0] ? (
                        <img src={product.image_urls[0]} alt={product.name} className="w-10 h-12 object-cover bg-stone-100 flex-shrink-0" />
                      ) : (
                        <div className="w-10 h-12 bg-stone-100 flex items-center justify-center flex-shrink-0">
                          <ImageOff size={14} className="text-stone-300" />
                        </div>
                      )}
                      <div>
                        <p className="font-body text-sm font-medium">{product.name}</p>
                        <p className="font-body text-xs text-stone-400">{product.brand}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 font-body text-sm text-stone-500">{product.categories?.name || '—'}</td>
                  <td className="px-5 py-4">
                    <div className="font-body text-sm">
                      <span className={product.discount_price ? 'line-through text-stone-400 text-xs mr-1' : ''}>
                        {formatPrice(product.price)}
                      </span>
                      {product.discount_price && <span className="text-gold-600 font-medium">{formatPrice(product.discount_price)}</span>}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`font-body text-sm ${product.stock === 0 ? 'text-red-500' : product.stock < 5 ? 'text-amber-500' : 'text-green-600'}`}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`font-body text-xs px-2 py-1 rounded-full ${product.is_active ? 'bg-green-100 text-green-700' : 'bg-stone-100 text-stone-500'}`}>
                      {product.is_active ? 'Active' : 'Hidden'}
                    </span>
                    {product.featured && (
                      <span className="ml-1 font-body text-xs px-2 py-1 rounded-full bg-gold-100 text-gold-700">Featured</span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <Link href={`/admin/products/${product.id}/edit`}
                        className="p-1.5 text-stone-400 hover:text-blue-500 transition-colors">
                        <Pencil size={14} />
                      </Link>
                      <AdminDeleteProduct productId={product.id} productName={product.name} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {(!products || products.length === 0) && (
            <div className="py-16 text-center">
              <p className="font-display text-2xl font-light text-stone-300">No products yet</p>
              <p className="font-body text-sm text-stone-400 mt-2 mb-6">Add your first product to get started</p>
              <Link href="/admin/products/new" className="btn-primary">Add First Product</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
