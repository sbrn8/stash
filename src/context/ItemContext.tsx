import { createContext, useContext, useState } from 'react'
import type { SavedItem } from '../types'
import { mockSavedItems } from '../data/mockData'

interface ItemsContextType {
  items: SavedItem[]
  addItem: (item: SavedItem) => void
}

const ItemsContext = createContext<ItemsContextType | null>(null)

export function ItemsProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<SavedItem[]>(mockSavedItems)

  const addItem = (item: SavedItem) => {
    setItems(prev => [item, ...prev])
  }

  return (
    <ItemsContext.Provider value={{ items, addItem }}>
      {children}
    </ItemsContext.Provider>
  )
}

export function useItems() {
  const context = useContext(ItemsContext)
  if (!context) throw new Error('useItems must be used within ItemsProvider')
  return context
}
