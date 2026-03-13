'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { registerSchema, RegisterInput } from '@/lib/validations'

export default function RegisterPage() {
  const router = useRouter()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterInput) => {
    setLoading(true); setError('')
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: { data: { full_name: data.full_name } }
    })
    if (authError) { setError(authError.message); setLoading(false); return }
    if (authData.user) {
      await supabase.from('profiles').insert({
        id: authData.user.id,
        full_name: data.full_name,
        role: 'customer',
      })
    }
    router.push('/account')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-champagne flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-10">
            <Link href="/" className="inline-flex flex-col items-center mb-8">
              <span className="font-display text-3xl font-light tracking-[0.15em] text-obsidian">LUXE</span>
              <span className="font-body text-[9px] text-gold-500 tracking-[0.5em] uppercase">ESSENCE</span>
            </Link>
            <h1 className="font-display text-4xl font-light mb-2">Create Account</h1>
            <p className="font-body text-sm text-stone-400">Join the world of Luxe Essence</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {[
              { name: 'full_name' as const, placeholder: 'Full Name', type: 'text' },
              { name: 'email' as const, placeholder: 'Email Address', type: 'email' },
              { name: 'password' as const, placeholder: 'Password', type: 'password' },
              { name: 'confirm_password' as const, placeholder: 'Confirm Password', type: 'password' },
            ].map(({ name, placeholder, type }) => (
              <div key={name}>
                <input {...register(name)} type={type} placeholder={placeholder} className="input-luxury" />
                {errors[name] && <p className="font-body text-xs text-red-500 mt-1">{errors[name]?.message}</p>}
              </div>
            ))}

            {error && <p className="font-body text-sm text-red-500 bg-red-50 p-3 text-center">{error}</p>}

            <motion.button type="submit" disabled={loading} className="btn-primary w-full" whileTap={{ scale: 0.98 }}>
              {loading ? <Loader2 size={16} className="animate-spin inline mr-2" /> : null}
              {loading ? 'Creating Account...' : 'Create Account'}
            </motion.button>

            <p className="text-center font-body text-sm text-stone-400">
              Already have an account?{' '}
              <Link href="/login" className="text-gold-600 hover:underline">Sign in</Link>
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  )
}
