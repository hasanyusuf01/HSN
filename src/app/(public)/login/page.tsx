'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { loginSchema, LoginInput } from '@/lib/validations'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/account'
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const { register, handleSubmit, formState: { errors } } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginInput) => {
    setLoading(true); setError('')
    // const { error: authError } = await supabase.auth.signInWithPassword(data)
    const { error: authError } = await supabase.auth.signInWithPassword({
  email: data.email!,
  password: data.password!,
})
    if (authError) { setError(authError.message); setLoading(false); return }
    router.push(redirect)
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-champagne flex items-center justify-center px-6">
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
            <h1 className="font-display text-4xl font-light mb-2">Welcome Back</h1>
            <p className="font-body text-sm text-stone-400">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <input
                {...register('email')}
                type="email"
                placeholder="Email Address"
                className="input-luxury"
              />
              {errors.email && <p className="font-body text-xs text-red-500 mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <input
                {...register('password')}
                type="password"
                placeholder="Password"
                className="input-luxury"
              />
              {errors.password && <p className="font-body text-xs text-red-500 mt-1">{errors.password.message}</p>}
            </div>

            {error && <p className="font-body text-sm text-red-500 bg-red-50 p-3 text-center">{error}</p>}

            <motion.button
              type="submit"
              disabled={loading}
              className="btn-primary w-full"
              whileTap={{ scale: 0.98 }}
            >
              {loading ? <Loader2 size={16} className="animate-spin inline mr-2" /> : null}
              {loading ? 'Signing In...' : 'Sign In'}
            </motion.button>

            <p className="text-center font-body text-sm text-stone-400">
              New here?{' '}
              <Link href="/register" className="text-gold-600 hover:underline">Create an account</Link>
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  )
}
