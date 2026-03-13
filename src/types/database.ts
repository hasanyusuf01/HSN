export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string | null
          phone: string | null
          role: 'customer' | 'admin'
          created_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          phone?: string | null
          role?: 'customer' | 'admin'
          created_at?: string
        }
        Update: {
          full_name?: string | null
          phone?: string | null
          role?: 'customer' | 'admin'
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          created_at?: string
        }
        Update: {
          name?: string
          slug?: string
          description?: string | null
        }
      }
      products: {
        Row: {
          id: string
          name: string
          slug: string
          short_description: string | null
          full_description: string | null
          brand: string | null
          price: number
          discount_price: number | null
          stock: number
          category_id: string | null
          featured: boolean
          is_active: boolean
          fragrance_notes: FragranceNotes | null
          size_options: SizeOption[] | null
          image_urls: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          short_description?: string | null
          full_description?: string | null
          brand?: string | null
          price: number
          discount_price?: number | null
          stock?: number
          category_id?: string | null
          featured?: boolean
          is_active?: boolean
          fragrance_notes?: FragranceNotes | null
          size_options?: SizeOption[] | null
          image_urls?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          name?: string
          slug?: string
          short_description?: string | null
          full_description?: string | null
          brand?: string | null
          price?: number
          discount_price?: number | null
          stock?: number
          category_id?: string | null
          featured?: boolean
          is_active?: boolean
          fragrance_notes?: FragranceNotes | null
          size_options?: SizeOption[] | null
          image_urls?: string[] | null
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          user_id: string
          status: OrderStatus
          subtotal: number
          shipping_fee: number
          total: number
          payment_method: string
          payment_status: PaymentStatus
          shipping_address: ShippingAddress
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          status?: OrderStatus
          subtotal: number
          shipping_fee?: number
          total: number
          payment_method?: string
          payment_status?: PaymentStatus
          shipping_address: ShippingAddress
          created_at?: string
        }
        Update: {
          status?: OrderStatus
          payment_status?: PaymentStatus
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string
          product_name: string
          unit_price: number
          quantity: number
          selected_size: string | null
        }
        Insert: {
          id?: string
          order_id: string
          product_id: string
          product_name: string
          unit_price: number
          quantity: number
          selected_size?: string | null
        }
        Update: never
      }
    }
  }
}

export type FragranceNotes = {
  top: string[]
  middle: string[]
  base: string[]
}

export type SizeOption = {
  size: string
  price?: number
  stock?: number
}

export type ShippingAddress = {
  full_name: string
  phone: string
  address_line1: string
  address_line2?: string
  city: string
  state: string
  postal_code: string
  country: string
}

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded'

// Convenience types
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Category = Database['public']['Tables']['categories']['Row']
export type Product = Database['public']['Tables']['products']['Row']
export type Order = Database['public']['Tables']['orders']['Row']
export type OrderItem = Database['public']['Tables']['order_items']['Row']

export type ProductWithCategory = Product & {
  categories: Category | null
}

export type OrderWithItems = Order & {
  order_items: (OrderItem & { products: Product | null })[]
}

// Cart types
export type CartItem = {
  product: Product
  quantity: number
  selected_size: string | null
}
