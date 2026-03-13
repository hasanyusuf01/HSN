import { Metadata } from 'next'
import HeroSection from '@/components/home/HeroSection'
import FeaturedProducts from '@/components/home/FeaturedProducts'
import CategoryShowcase from '@/components/home/CategoryShowcase'
import Testimonials from '@/components/home/Testimonials'
import BrandStory from '@/components/home/BrandStory'
import Newsletter from '@/components/home/Newsletter'
import { createClient } from '@/lib/supabase/server'

export const metadata: Metadata = {
  title: 'Luxe Essence — Premium Perfumes',
}

export default async function HomePage() {
  const supabase = await createClient()

  const { data: featuredProducts } = await supabase
    .from('products')
    .select('*, categories(*)')
    .eq('featured', true)
    .eq('is_active', true)
    .limit(4)

  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .limit(6)

  return (
    <>
      <HeroSection />
      <FeaturedProducts products={featuredProducts ?? []} />
      <BrandStory />
      <CategoryShowcase categories={categories ?? []} />
      <Testimonials />
      <Newsletter />
    </>
  )
}
