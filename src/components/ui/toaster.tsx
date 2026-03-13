'use client'

import { useEffect, useState } from 'react'
import { X } from 'lucide-react'

type Toast = { id: string; message: string; type: 'success' | 'error' | 'info' }

let toastListeners: ((toast: Toast) => void)[] = []

export function toast(message: string, type: Toast['type'] = 'info') {
  const t: Toast = { id: Date.now().toString(), message, type }
  toastListeners.forEach(l => l(t))
}

export function Toaster() {
  const [toasts, setToasts] = useState<Toast[]>([])

  useEffect(() => {
    const listener = (t: Toast) => {
      setToasts(prev => [...prev, t])
      setTimeout(() => setToasts(prev => prev.filter(p => p.id !== t.id)), 3500)
    }
    toastListeners.push(listener)
    return () => { toastListeners = toastListeners.filter(l => l !== listener) }
  }, [])

  return (
    <div className="fixed bottom-6 right-6 z-50 space-y-2">
      {toasts.map(t => (
        <div
          key={t.id}
          className={`flex items-center gap-3 px-4 py-3 shadow-lg font-body text-sm max-w-xs animate-fade-up ${
            t.type === 'success' ? 'bg-green-600 text-white' :
            t.type === 'error' ? 'bg-red-600 text-white' :
            'bg-obsidian text-white'
          }`}
        >
          <span className="flex-1">{t.message}</span>
          <button onClick={() => setToasts(prev => prev.filter(p => p.id !== t.id))}>
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  )
}
