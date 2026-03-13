'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, Pencil, Trash2, Check, X, Loader2 } from 'lucide-react'
import { categorySchema, CategoryInput } from '@/lib/validations'
import { createClient } from '@/lib/supabase/client'
import { slugify } from '@/lib/utils'

export default function AdminCategoriesClient({ categories }: { categories: any[] }) {
  const router = useRouter()
  const supabase = createClient()
  const [showAdd, setShowAdd] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CategoryInput>({
    resolver: zodResolver(categorySchema),
  })

  const onAdd = async (data: CategoryInput) => {
    setLoading(true)
    await supabase.from('categories').insert({ name: data.name, slug: slugify(data.name), description: data.description })
    reset(); setShowAdd(false); setLoading(false); router.refresh()
  }

  const onEdit = async (id: string, data: CategoryInput) => {
    setLoading(true)
    await supabase.from('categories').update({ name: data.name, description: data.description }).eq('id', id)
    setEditingId(null); setLoading(false); router.refresh()
  }

  const onDelete = async (id: string) => {
    setDeletingId(id)
    await supabase.from('categories').delete().eq('id', id)
    setDeletingId(null); router.refresh()
  }

  const inputClass = "border border-stone-200 px-3 py-2 font-body text-sm outline-none focus:border-gold-400 transition-colors"

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Category List */}
      <div className="bg-white border border-stone-100">
        <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between">
          <h2 className="font-display text-xl font-light">All Categories</h2>
          <button onClick={() => setShowAdd(true)} className="flex items-center gap-1 font-body text-xs text-gold-500 hover:text-gold-600 tracking-widest uppercase">
            <Plus size={12} /> Add
          </button>
        </div>
        <ul className="divide-y divide-stone-50">
          {categories.map((cat) => {
            const count = cat.products?.[0]?.count || 0
            return (
              <li key={cat.id} className="px-6 py-4 flex items-center justify-between">
                <div>
                  <p className="font-body text-sm font-medium">{cat.name}</p>
                  <p className="font-body text-xs text-stone-400">{count} products · /{cat.slug}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setEditingId(cat.id)} className="p-1 text-stone-400 hover:text-blue-500 transition-colors"><Pencil size={14} /></button>
                  <button
                    onClick={() => onDelete(cat.id)}
                    disabled={deletingId === cat.id}
                    className="p-1 text-stone-400 hover:text-red-500 transition-colors"
                  >
                    {deletingId === cat.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                  </button>
                </div>
              </li>
            )
          })}
        </ul>
      </div>

      {/* Add / Edit Form */}
      {(showAdd || editingId) && (
        <div className="bg-white border border-stone-100 p-6">
          <h2 className="font-display text-xl font-light mb-5">
            {editingId ? 'Edit Category' : 'New Category'}
          </h2>
          <form
            onSubmit={handleSubmit(editingId
              ? (data) => onEdit(editingId, data)
              : onAdd
            )}
            className="space-y-4"
          >
            {editingId && (() => {
              const cat = categories.find(c => c.id === editingId)
              if (cat) {
                // Set default values imperatively
              }
              return null
            })()}
            <div>
              <label className="block font-body text-xs text-stone-400 tracking-widest uppercase mb-1.5">Name *</label>
              <input
                {...register('name')}
                defaultValue={editingId ? categories.find(c => c.id === editingId)?.name : ''}
                className={`${inputClass} w-full`}
                placeholder="e.g. Floral"
              />
              {errors.name && <p className="font-body text-xs text-red-500 mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <label className="block font-body text-xs text-stone-400 tracking-widest uppercase mb-1.5">Description</label>
              <textarea
                {...register('description')}
                defaultValue={editingId ? categories.find(c => c.id === editingId)?.description : ''}
                rows={3}
                className={`${inputClass} w-full resize-none`}
                placeholder="Short description..."
              />
            </div>
            <div className="flex gap-3">
              <button type="submit" disabled={loading} className="flex items-center gap-2 px-4 py-2 bg-obsidian text-white font-body text-xs tracking-widest uppercase hover:bg-gold-500 transition-colors">
                {loading ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />}
                {editingId ? 'Save' : 'Create'}
              </button>
              <button type="button" onClick={() => { setShowAdd(false); setEditingId(null); reset() }}
                className="px-4 py-2 border border-stone-200 font-body text-xs tracking-widest uppercase hover:border-stone-400 transition-colors flex items-center gap-2">
                <X size={12} /> Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
