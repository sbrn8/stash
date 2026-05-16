import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Link, Upload, Loader2 } from 'lucide-react'
import { extractFromLink, extractFromScreenshot } from '../services/gemini'
import type { Category, SavedItem } from '../types'

type Step = 'input' | 'preview'

interface ExtractedData {
  title: string
  description: string
  category: Category
  location?: {
    name: string
    lat: number
    lng: number
  }
  ai_summary: string
  tags: string[]
}

export function AddItem() {
  const navigate = useNavigate()
  const [step, setStep] = useState<Step>('input')
  const [inputType, setInputType] = useState<'link' | 'screenshot' | null>(null)
  const [url, setUrl] = useState('')
  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [extracted, setExtracted] = useState<ExtractedData | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Editable fields in preview
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState<Category>('Restaurants')
  const [notes, setNotes] = useState('')

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImage(file)
    setImagePreview(URL.createObjectURL(file))
    setInputType('screenshot')
  }

  const handleAnalyse = async () => {
    setIsLoading(true)
    setError(null)

    try {
      let data: ExtractedData

      if (inputType === 'link' && url) {
        data = await extractFromLink(url)
      } else if (inputType === 'screenshot' && image) {
        // Convert image to base64
        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = () => {
            const result = reader.result as string
            resolve(result.split(',')[1]) // strip the data:image/...;base64, prefix
          }
          reader.onerror = reject
          reader.readAsDataURL(image)
        })
        data = await extractFromScreenshot(base64, image.type)
      } else {
        return
      }

      setExtracted(data)
      setTitle(data.title)
      setCategory(data.category)
      setStep('preview')
    } catch (err) {
      setError('Something went wrong. Please try again.')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = () => {
    if (!extracted) return

    // This will hook into real state/database later
    const newItem: SavedItem = {
      id: Date.now().toString(),
      user_id: 'mock-user-1',
      title,
      description: extracted.description,
      category,
      thumbnail_url: imagePreview ?? 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800',
      source_type: inputType === 'link' ? 'link' : 'screenshot',
      source_url: url || undefined,
      location: extracted.location?.name ? extracted.location : undefined,
      tags: extracted.tags,
      ai_summary: notes || extracted.ai_summary,
      status: 'saved',
      created_at: new Date().toISOString(),
    }

    console.log('Saved item:', newItem)
    navigate('/')
  }

  if (step === 'preview' && extracted) {
    return (
      <div className="min-h-screen bg-white">
        {/* Header */}
        <div className="flex items-center gap-3 p-4 border-b border-gray-100">
          <button
            onClick={() => setStep('input')}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100"
          >
            <ArrowLeft className="w-4 h-4 text-gray-700" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">Review</h1>
        </div>

        <div className="p-5">
          {imagePreview && (
            <img
              src={imagePreview}
              alt="preview"
              className="w-full h-48 object-cover rounded-2xl mb-4"
            />
          )}

          {/* AI summary badge */}
          {extracted.ai_summary && (
            <div className="mb-4 p-3 bg-blue-50 rounded-xl">
              <p className="text-xs text-blue-500 font-medium mb-1">AI Summary</p>
              <p className="text-sm text-blue-700">{extracted.ai_summary}</p>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full mt-1 px-4 py-2.5 bg-gray-50 rounded-xl text-sm text-gray-900 border border-gray-200 focus:outline-none focus:border-blue-400"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Category
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as Category)}
                className="w-full mt-1 px-4 py-2.5 bg-gray-50 rounded-xl text-sm text-gray-900 border border-gray-200 focus:outline-none focus:border-blue-400"
              >
                <option>Restaurants</option>
                <option>Travel</option>
                <option>Fitness</option>
                <option>Products</option>
              </select>
            </div>

            {extracted.location?.name && (
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Location
                </label>
                <p className="mt-1 px-4 py-2.5 bg-gray-50 rounded-xl text-sm text-gray-500 border border-gray-200">
                  {extracted.location.name}
                </p>
              </div>
            )}

            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Tags
              </label>
              <div className="flex flex-wrap gap-2 mt-2">
                {extracted.tags.map(tag => (
                  <span
                    key={tag}
                    className="text-xs bg-gray-100 text-gray-500 px-3 py-1 rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Notes
              </label>
              <textarea
                placeholder="Add a personal note..."
                value={notes}
                onChange={e => setNotes(e.target.value)}
                rows={3}
                className="w-full mt-1 px-4 py-2.5 bg-gray-50 rounded-xl text-sm text-gray-900 border border-gray-200 focus:outline-none focus:border-blue-400 resize-none"
              />
            </div>
          </div>

          <button
            onClick={handleSave}
            className="w-full mt-6 py-3 bg-gray-900 text-white rounded-2xl font-medium text-sm"
          >
            Save to Stash
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-gray-100">
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100"
        >
          <ArrowLeft className="w-4 h-4 text-gray-700" />
        </button>
        <h1 className="text-lg font-semibold text-gray-900">Add to Stash</h1>
      </div>

      <div className="p-5 space-y-4">

        {/* Link input */}
        <div className={`border-2 rounded-2xl p-4 transition-colors ${
          inputType === 'link' ? 'border-blue-400 bg-blue-50' : 'border-gray-200'
        }`}>
          <div className="flex items-center gap-2 mb-3">
            <Link className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Paste a link</span>
          </div>
          <input
            type="url"
            placeholder="https://..."
            value={url}
            onChange={e => {
              setUrl(e.target.value)
              setInputType('link')
            }}
            className="w-full px-4 py-2.5 bg-white rounded-xl text-sm border border-gray-200 focus:outline-none focus:border-blue-400"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400">or</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Screenshot upload */}
        <label className={`block border-2 rounded-2xl p-6 text-center cursor-pointer transition-colors ${
          inputType === 'screenshot'
            ? 'border-blue-400 bg-blue-50'
            : 'border-dashed border-gray-300 hover:border-gray-400'
        }`}>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
          {imagePreview ? (
            <img
              src={imagePreview}
              alt="preview"
              className="w-full h-40 object-cover rounded-xl"
            />
          ) : (
            <>
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-700">Upload a screenshot</p>
              <p className="text-xs text-gray-400 mt-1">Tap to choose from your camera roll</p>
            </>
          )}
        </label>

        {/* Error */}
        {error && (
          <p className="text-sm text-red-500 text-center">{error}</p>
        )}

        {/* Analyse button */}
        <button
          onClick={handleAnalyse}
          disabled={!url && !image}
          className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl font-medium text-sm flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Analysing...
            </>
          ) : (
            'Analyse with AI'
          )}
        </button>

      </div>
    </div>
  )
}