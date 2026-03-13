'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface Props { productId: string; productName: string }

export default function AdminDeleteProduct({ productId, productName }: Props) {
  const [confirming, setConfirming] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleDelete = async () => {
    setLoading(true)
    await supabase.from('products').delete().eq('id', productId)
    router.refresh()
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-1">
        <button onClick={handleDelete} disabled={loading} className="px-2 py-1 bg-red-500 text-white font-body text-xs hover:bg-red-600 transition-colors flex items-center gap-1">
          {loading ? <Loader2 size={10} className="animate-spin" /> : null}
          Delete
        </button>
        <button onClick={() => setConfirming(false)} className="px-2 py-1 bg-stone-200 font-body text-xs hover:bg-stone-300 transition-colors">
          Cancel
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="p-1.5 text-stone-400 hover:text-red-500 transition-colors"
      title={`Delete ${productName}`}
    >
      <Trash2 size={14} />
    </button>
  )
}
