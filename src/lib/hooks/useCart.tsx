'use client'

import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react'
import { CartItem, Product } from '@/types/database'

type CartState = {
  items: CartItem[]
  total: number
  itemCount: number
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: { product: Product; quantity: number; selected_size: string | null } }
  | { type: 'REMOVE_ITEM'; payload: { productId: string; selected_size: string | null } }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: string; selected_size: string | null; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: CartItem[] }

type CartContextType = CartState & {
  addItem: (product: Product, quantity?: number, selected_size?: string | null) => void
  removeItem: (productId: string, selected_size?: string | null) => void
  updateQuantity: (productId: string, quantity: number, selected_size?: string | null) => void
  clearCart: () => void
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { product, quantity, selected_size } = action.payload
      const existingIndex = state.items.findIndex(
        (i) => i.product.id === product.id && i.selected_size === selected_size
      )

      let newItems: CartItem[]
      if (existingIndex >= 0) {
        newItems = state.items.map((item, idx) =>
          idx === existingIndex
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      } else {
        newItems = [...state.items, { product, quantity, selected_size }]
      }

      return calculateTotals({ ...state, items: newItems })
    }

    case 'REMOVE_ITEM': {
      const newItems = state.items.filter(
        (i) => !(i.product.id === action.payload.productId && i.selected_size === action.payload.selected_size)
      )
      return calculateTotals({ ...state, items: newItems })
    }

    case 'UPDATE_QUANTITY': {
      const { productId, selected_size, quantity } = action.payload
      if (quantity <= 0) {
        const newItems = state.items.filter(
          (i) => !(i.product.id === productId && i.selected_size === selected_size)
        )
        return calculateTotals({ ...state, items: newItems })
      }
      const newItems = state.items.map((item) =>
        item.product.id === productId && item.selected_size === selected_size
          ? { ...item, quantity }
          : item
      )
      return calculateTotals({ ...state, items: newItems })
    }

    case 'CLEAR_CART':
      return { items: [], total: 0, itemCount: 0 }

    case 'LOAD_CART':
      return calculateTotals({ ...state, items: action.payload })

    default:
      return state
  }
}

function calculateTotals(state: CartState): CartState {
  const total = state.items.reduce((sum, item) => {
    const price = item.product.discount_price ?? item.product.price
    return sum + price * item.quantity
  }, 0)
  const itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0)
  return { ...state, total, itemCount }
}

const CartContext = createContext<CartContextType | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], total: 0, itemCount: 0 })

  // Persist cart to localStorage
  useEffect(() => {
    const saved = localStorage.getItem('luxe_cart')
    if (saved) {
      try {
        const items = JSON.parse(saved)
        dispatch({ type: 'LOAD_CART', payload: items })
      } catch {}
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('luxe_cart', JSON.stringify(state.items))
  }, [state.items])

  const addItem = (product: Product, quantity = 1, selected_size: string | null = null) =>
    dispatch({ type: 'ADD_ITEM', payload: { product, quantity, selected_size } })

  const removeItem = (productId: string, selected_size: string | null = null) =>
    dispatch({ type: 'REMOVE_ITEM', payload: { productId, selected_size } })

  const updateQuantity = (productId: string, quantity: number, selected_size: string | null = null) =>
    dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, selected_size, quantity } })

  const clearCart = () => dispatch({ type: 'CLEAR_CART' })

  return (
    <CartContext.Provider value={{ ...state, addItem, removeItem, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
