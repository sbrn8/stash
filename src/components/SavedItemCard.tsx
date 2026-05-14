import type { SavedItem } from '../types'

interface Props {
  item: SavedItem
  onClick: () => void
}

export function SavedItemCard({ item, onClick }: Props) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
    >
      <img
        src={item.thumbnail_url}
        alt={item.title}
        className="w-full object-cover"
      />
      <div className="p-3">
        <span className="text-xs font-medium text-blue-500 uppercase tracking-wide">
          {item.category}
        </span>
        <h3 className="text-sm font-semibold text-gray-900 mt-1 leading-snug">
          {item.title}
        </h3>
        {item.location && (
          <p className="text-xs text-gray-400 mt-1">{item.location.name}</p>
        )}
        <div className="flex flex-wrap gap-1 mt-2">
          {item.tags.slice(0, 2).map(tag => (
            <span
              key={tag}
              className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>
        {item.status === 'done' && (
          <span className="inline-block mt-2 text-xs text-green-500 font-medium">
            ✓ Done
          </span>
        )}
      </div>
    </div>
  )
}
