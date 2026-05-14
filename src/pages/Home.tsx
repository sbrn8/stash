import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Masonry from 'react-responsive-masonry'
import { Plus, Map } from 'lucide-react'
import { SavedItemCard } from '../components/SavedItemCard'
import { mockSavedItems } from '../data/mockData'
import type { Category } from '../types'

const CATEGORIES: (Category | 'All')[] = ['All', 'Restaurants', 'Travel', 'Fitness', 'Products']

export function Home() {
  const navigate = useNavigate()
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All')

  const filteredItems = selectedCategory === 'All'
    ? mockSavedItems
    : mockSavedItems.filter(item => item.category === selectedCategory)

  if (mockSavedItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="max-w-md text-center">
          <div className="mb-6 inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full">
            <Plus className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Save your first thing</h2>
          <p className="text-gray-600 mb-8">
            Screenshot something cool, paste a link, or upload an image. We'll organize it for you.
          </p>
          <button
            onClick={() => navigate('/add')}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-purple-700 transition-all"
          >
            Add Your First Save
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">

      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100">
        <div className="flex items-center justify-between px-4 pt-4 pb-2">
          <h1 className="text-xl font-bold text-gray-900">Stash</h1>
          <button
            onClick={() => navigate('/map')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors text-sm"
          >
            <Map className="w-4 h-4" />
            Map
          </button>
        </div>

        {/* Category filters */}
        <div className="px-4 pb-3 overflow-x-auto scrollbar-hide">
          <div className="flex gap-2 min-w-max">
            {CATEGORIES.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                  selectedCategory === category
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="p-4">
        {filteredItems.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-sm">Nothing saved in this category yet</p>
          </div>
        ) : (
          <Masonry columnsCount={2} gutter="12px">
            {filteredItems.map(item => (
              <SavedItemCard
                key={item.id}
                item={item}
                onClick={() => navigate(`/item/${item.id}`)}
              />
            ))}
          </Masonry>
        )}
      </div>

      {/* FAB */}
      <button
        onClick={() => navigate('/add')}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all active:scale-95"
      >
        <Plus className="w-6 h-6" />
      </button>

    </div>
  )
}
