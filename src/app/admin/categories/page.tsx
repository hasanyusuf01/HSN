import { createClient } from '@/lib/supabase/server'
import AdminCategoriesClient from '@/components/admin/AdminCategoriesClient'

export const metadata = { title: 'Categories — Admin' }

export default async function AdminCategoriesPage() {
  const supabase = await createClient()
  const { data: categories } = await supabase
    .from('categories')
    .select('*, products(count)')
    .order('name')

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-4xl font-light">Categories</h1>
        <p className="font-body text-sm text-stone-400 mt-1">{categories?.length || 0} categories</p>
      </div>
      <AdminCategoriesClient categories={categories ?? []} />
    </div>
  )
}
