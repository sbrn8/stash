import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, MapPin, ExternalLink, Check } from 'lucide-react'
import { mockSavedItems } from '../data/mockData'
import { useState } from 'react'

export function ItemDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const item = mockSavedItems.find(i => i.id === id)
  const [status, setStatus] = useState(item?.status ?? 'saved')

  if (!item) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Item not found</p>
          <button
            onClick={() => navigate('/')}
            className="text-blue-500 text-sm font-medium"
          >
            Go back home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">

      {/* Hero Image */}
      <div className="relative">
        <img
          src={item.thumbnail_url}
          alt={item.title}
          className="w-full h-72 object-cover"
        />
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 w-9 h-9 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm"
        >
          <ArrowLeft className="w-4 h-4 text-gray-800" />
        </button>
      </div>

      {/* Content */}
      <div className="p-5">

        {/* Category + title */}
        <span className="text-xs font-medium text-blue-500 uppercase tracking-wide">
          {item.category}
        </span>
        <h1 className="text-2xl font-bold text-gray-900 mt-1">
          {item.title}
        </h1>

        {/* Location */}
        {item.location && (
          <div className="flex items-center gap-1.5 mt-2">
            <MapPin className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-500">{item.location.name}</span>
          </div>
        )}

        {/* AI Summary */}
        {item.ai_summary && (
          <div className="mt-4 p-3 bg-blue-50 rounded-xl">
            <p className="text-sm text-blue-700">{item.ai_summary}</p>
          </div>
        )}

        {/* Description */}
        <p className="mt-4 text-gray-600 text-sm leading-relaxed">
          {item.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-4">
          {item.tags.map(tag => (
            <span
              key={tag}
              className="text-xs bg-gray-100 text-gray-500 px-3 py-1 rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Source link */}
        {item.source_url && (
           <a
            href={item.source_url ?? ''}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 mt-5 text-sm text-blue-500 font-medium"
         >
            <ExternalLink className="w-4 h-4" />
            View Source
          </a>
        )}

        {/* Mark as done */}
        <button
          onClick={() => setStatus(status === 'saved' ? 'done' : 'saved')}
          className={`w-full mt-6 py-3 rounded-2xl font-medium text-sm flex items-center justify-center gap-2 transition-all ${
            status === 'done'
              ? 'bg-green-50 text-green-600 border border-green-200'
              : 'bg-gray-900 text-white'
          }`}
        >
          {status === 'done' ? (
            <>
              <Check className="w-4 h-4" />
              Done
            </>
          ) : (
            'Mark as Done'
          )}
        </button>

      </div>
    </div>
  )
}
