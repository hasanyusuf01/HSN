'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Loader2, Upload, X, Plus } from 'lucide-react'
import { productSchema, ProductInput } from '@/lib/validations'
import { createClient } from '@/lib/supabase/client'
import { slugify } from '@/lib/utils'
import { Category, Product } from '@/types/database'

interface Props {
  categories: Category[]
  product?: Product
  mode: 'new' | 'edit'
}

export default function ProductForm({ categories, product, mode }: Props) {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [imageUrls, setImageUrls] = useState<string[]>(
    (product?.image_urls as string[] | null) ?? []
  )
  const [newImageUrl, setNewImageUrl] = useState('')
  const [uploading, setUploading] = useState(false)

  const existingNotes = product?.fragrance_notes as any
  const existingSizes = product?.size_options as any[]

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<ProductInput>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name ?? '',
      short_description: product?.short_description ?? '',
      full_description: product?.full_description ?? '',
      brand: product?.brand ?? '',
      price: product?.price ?? 0,
      discount_price: product?.discount_price ?? undefined,
      stock: product?.stock ?? 0,
      category_id: product?.category_id ?? undefined,
      featured: product?.featured ?? false,
      is_active: product?.is_active ?? true,
      fragrance_notes_top: existingNotes?.top?.join(', ') ?? '',
      fragrance_notes_middle: existingNotes?.middle?.join(', ') ?? '',
      fragrance_notes_base: existingNotes?.base?.join(', ') ?? '',
      size_options: existingSizes ? JSON.stringify(existingSizes) : '',
    },
  })

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const fileExt = file.name.split('.').pop()
    const fileName = `products/${Date.now()}.${fileExt}`
    const { data, error } = await supabase.storage.from('product-images').upload(fileName, file)
    if (!error && data) {
      const { data: { publicUrl } } = supabase.storage.from('product-images').getPublicUrl(data.path)
      setImageUrls(prev => [...prev, publicUrl])
    }
    setUploading(false)
  }

  const addImageUrl = () => {
    if (newImageUrl.trim()) {
      setImageUrls(prev => [...prev, newImageUrl.trim()])
      setNewImageUrl('')
    }
  }

  const onSubmit = async (data: ProductInput) => {
    setLoading(true)
    setError('')
    try {
      const slug = slugify(data.name)
      const fragranceNotes = {
        top: data.fragrance_notes_top?.split(',').map(s => s.trim()).filter(Boolean) ?? [],
        middle: data.fragrance_notes_middle?.split(',').map(s => s.trim()).filter(Boolean) ?? [],
        base: data.fragrance_notes_base?.split(',').map(s => s.trim()).filter(Boolean) ?? [],
      }
      let sizeOptions = null
      if (data.size_options) {
        try { sizeOptions = JSON.parse(data.size_options) } catch { sizeOptions = null }
      }

      const payload = {
        name: data.name,
        slug: mode === 'new' ? slug : product!.slug,
        short_description: data.short_description,
        full_description: data.full_description,
        brand: data.brand || null,
        price: data.price,
        discount_price: data.discount_price || null,
        stock: data.stock,
        category_id: data.category_id || null,
        featured: data.featured,
        is_active: data.is_active,
        fragrance_notes: fragranceNotes,
        size_options: sizeOptions,
        image_urls: imageUrls,
        updated_at: new Date().toISOString(),
      }

      if (mode === 'new') {
        const { error: insertError } = await supabase.from('products').insert({ ...payload, created_at: new Date().toISOString() })
        if (insertError) throw insertError
      } else {
        const { error: updateError } = await supabase.from('products').update(payload).eq('id', product!.id)
        if (updateError) throw updateError
      }

      router.push('/admin/products')
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const inputClass = "w-full border border-stone-200 px-3 py-2.5 font-body text-sm outline-none focus:border-gold-400 transition-colors bg-white"
  const labelClass = "block font-body text-xs text-stone-500 tracking-widest uppercase mb-1.5"
  const errClass = "font-body text-xs text-red-500 mt-1"

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {error && <div className="bg-red-50 border border-red-200 p-4 font-body text-sm text-red-600">{error}</div>}

      {/* Basic Info */}
      <div className="bg-white border border-stone-100 p-6 space-y-5">
        <h2 className="font-display text-xl font-light border-b border-stone-100 pb-3">Basic Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="md:col-span-2">
            <label className={labelClass}>Product Name *</label>
            <input {...register('name')} className={inputClass} placeholder="e.g. Oud Royale" />
            {errors.name && <p className={errClass}>{errors.name.message}</p>}
          </div>
          <div>
            <label className={labelClass}>Brand</label>
            <input {...register('brand')} className={inputClass} placeholder="e.g. Luxe Essence" />
          </div>
          <div>
            <label className={labelClass}>Category</label>
            <select {...register('category_id')} className={inputClass}>
              <option value="">Select category...</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>Short Description *</label>
            <input {...register('short_description')} className={inputClass} placeholder="Brief, enticing description (max 200 chars)" />
            {errors.short_description && <p className={errClass}>{errors.short_description.message}</p>}
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>Full Description *</label>
            <textarea {...register('full_description')} rows={5} className={`${inputClass} resize-none`} placeholder="Full product description..." />
            {errors.full_description && <p className={errClass}>{errors.full_description.message}</p>}
          </div>
        </div>
      </div>

      {/* Pricing & Stock */}
      <div className="bg-white border border-stone-100 p-6 space-y-5">
        <h2 className="font-display text-xl font-light border-b border-stone-100 pb-3">Pricing & Inventory</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <label className={labelClass}>Price (USD) *</label>
            <input {...register('price')} type="number" step="0.01" className={inputClass} placeholder="49.99" />
            {errors.price && <p className={errClass}>{errors.price.message}</p>}
          </div>
          <div>
            <label className={labelClass}>Sale Price (optional)</label>
            <input {...register('discount_price')} type="number" step="0.01" className={inputClass} placeholder="39.99" />
          </div>
          <div>
            <label className={labelClass}>Stock *</label>
            <input {...register('stock')} type="number" className={inputClass} placeholder="25" />
            {errors.stock && <p className={errClass}>{errors.stock.message}</p>}
          </div>
        </div>
        <div className="flex gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" {...register('featured')} className="accent-gold-500 w-4 h-4" />
            <span className="font-body text-sm">Featured Product</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" {...register('is_active')} className="accent-gold-500 w-4 h-4" />
            <span className="font-body text-sm">Active (visible in shop)</span>
          </label>
        </div>
      </div>

      {/* Images */}
      <div className="bg-white border border-stone-100 p-6 space-y-4">
        <h2 className="font-display text-xl font-light border-b border-stone-100 pb-3">Product Images</h2>

        {/* Upload button */}
        <div>
          <label className="inline-flex items-center gap-2 px-4 py-2 border border-stone-200 hover:border-gold-400 cursor-pointer transition-colors font-body text-xs tracking-widest uppercase">
            {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
            {uploading ? 'Uploading...' : 'Upload Image'}
            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploading} />
          </label>
        </div>

        {/* URL input */}
        <div className="flex gap-2">
          <input
            value={newImageUrl}
            onChange={e => setNewImageUrl(e.target.value)}
            className={`${inputClass} flex-1`}
            placeholder="Or paste an image URL..."
          />
          <button type="button" onClick={addImageUrl} className="px-3 py-2 bg-stone-100 hover:bg-gold-50 transition-colors">
            <Plus size={16} />
          </button>
        </div>

        {/* Preview grid */}
        {imageUrls.length > 0 && (
          <div className="flex gap-3 flex-wrap">
            {imageUrls.map((url, i) => (
              <div key={i} className="relative group">
                <img src={url} alt="" className="w-20 h-24 object-cover bg-stone-100" />
                <button
                  type="button"
                  onClick={() => setImageUrls(prev => prev.filter((_, j) => j !== i))}
                  className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={10} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Fragrance Notes */}
      <div className="bg-white border border-stone-100 p-6 space-y-5">
        <h2 className="font-display text-xl font-light border-b border-stone-100 pb-3">Fragrance Profile</h2>
        <p className="font-body text-xs text-stone-400">Enter notes separated by commas</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            { field: 'fragrance_notes_top' as const, label: 'Top Notes' },
            { field: 'fragrance_notes_middle' as const, label: 'Heart Notes' },
            { field: 'fragrance_notes_base' as const, label: 'Base Notes' },
          ].map(({ field, label }) => (
            <div key={field}>
              <label className={labelClass}>{label}</label>
              <input {...register(field)} className={inputClass} placeholder="Rose, Bergamot..." />
            </div>
          ))}
        </div>
      </div>

      {/* Size Options */}
      <div className="bg-white border border-stone-100 p-6">
        <h2 className="font-display text-xl font-light border-b border-stone-100 pb-3 mb-4">Size Options (JSON)</h2>
        <p className="font-body text-xs text-stone-400 mb-3">
          Example: <code className="bg-stone-100 px-1">[{"{"}"size":"30ml","price":39.99{"}"},{"{"}"size":"50ml","price":59.99{"}"}]</code>
        </p>
        <textarea
          {...register('size_options')}
          rows={3}
          className={`${inputClass} resize-none font-mono text-xs`}
          placeholder='[{"size":"30ml","price":39.99},{"size":"50ml","price":59.99}]'
        />
      </div>

      {/* Submit */}
      <div className="flex items-center gap-4">
        <motion.button
          type="submit"
          disabled={loading}
          className="btn-primary flex items-center gap-2"
          whileTap={{ scale: 0.98 }}
        >
          {loading && <Loader2 size={14} className="animate-spin" />}
          {loading ? 'Saving...' : mode === 'new' ? 'Create Product' : 'Save Changes'}
        </motion.button>
        <button type="button" onClick={() => router.back()} className="font-body text-sm text-stone-400 hover:text-stone-600 transition-colors">
          Cancel
        </button>
      </div>
    </form>
  )
}
