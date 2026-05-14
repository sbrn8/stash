import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Link, Upload, Loader2 } from 'lucide-react'

type Step = 'input' | 'preview' | 'done'

export function AddItem() {
  const navigate = useNavigate()
  const [step, setStep] = useState<Step>('input')
  const [inputType, setInputType] = useState<'link' | 'screenshot' | null>(null)
  const [url, setUrl] = useState('')
  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Simulates what the AI will eventually return
  const mockExtract = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      setStep('preview')
    }, 1500)
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImage(file)
    setImagePreview(URL.createObjectURL(file))
    setInputType('screenshot')
  }

  if (step === 'preview') {
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
          {/* Extracted preview - this will come from AI later */}
          {imagePreview && (
            <img
              src={imagePreview}
              alt="preview"
              className="w-full h-48 object-cover rounded-2xl mb-4"
            />
          )}

          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Title
              </label>
              <input
                type="text"
                defaultValue="Extracted title will appear here"
                className="w-full mt-1 px-4 py-2.5 bg-gray-50 rounded-xl text-sm text-gray-900 border border-gray-200 focus:outline-none focus:border-blue-400"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Category
              </label>
              <select className="w-full mt-1 px-4 py-2.5 bg-gray-50 rounded-xl text-sm text-gray-900 border border-gray-200 focus:outline-none focus:border-blue-400">
                <option>Restaurants</option>
                <option>Travel</option>
                <option>Fitness</option>
                <option>Products</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Notes
              </label>
              <textarea
                placeholder="Add a note..."
                rows={3}
                className="w-full mt-1 px-4 py-2.5 bg-gray-50 rounded-xl text-sm text-gray-900 border border-gray-200 focus:outline-none focus:border-blue-400 resize-none"
              />
            </div>
          </div>

          <button
            onClick={() => navigate('/')}
            className="w-full mt-6 py-3 bg-gray-900 text-white rounded-2xl font-medium text-sm"
          >
            Save
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
        <div
          className={`border-2 rounded-2xl p-4 transition-colors ${
            inputType === 'link' ? 'border-blue-400 bg-blue-50' : 'border-gray-200'
          }`}
        >
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
        <label
          className={`block border-2 rounded-2xl p-6 text-center cursor-pointer transition-colors ${
            inputType === 'screenshot' ? 'border-blue-400 bg-blue-50' : 'border-dashed border-gray-300 hover:border-gray-400'
          }`}
        >
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

        {/* Analyse button */}
        <button
          onClick={mockExtract}
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