import { useState } from 'react'
import { Search, Loader, AlertCircle, RefreshCw, BarChart3 } from 'lucide-react'
import type { AnalysisFormProps } from '../types'

const AnalysisForm: React.FC<AnalysisFormProps> = ({ onAnalyze, isLoading, error, onReset }) => {
  const [url, setUrl] = useState('')
  const [urlError, setUrlError] = useState('')

  const validateURL = (url: string): boolean => {
    if (!url.trim()) {
      return false
    }

    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    if (!validateURL(url)) {
      setUrlError('لطفاً یک آدرس معتبر وارد کنید')
      return
    }
    
    setUrlError('')
    onAnalyze(url)
  }

  const handleSample = () => {
    const sampleUrl = 'https://templates.landin.ir/catalystt/'
    setUrl(sampleUrl)
    setUrlError('')
    onAnalyze(sampleUrl)
  }

  const handleReset = () => {
    setUrl('')
    setUrlError('')
    onReset()
  }

  return (
    <div className="card mb-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="url" className="block text-lg font-medium text-gray-700 mb-3">
            آدرس صفحه فرود:
          </label>
          <div className="relative">
            <input
              type="url"
              id="url"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value)
                setUrlError('')
              }}
              placeholder="https://example.com"
              className="input-field pr-12"
              disabled={isLoading}
              required
            />
            <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>
          {urlError && (
            <div className="flex items-center mt-2 text-red-600">
              <AlertCircle className="w-4 h-4 ml-2" />
              <span className="text-sm">{urlError}</span>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-4">
          <button
            type="submit"
            disabled={isLoading || !url.trim()}
            className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                در حال تحلیل...
              </>
            ) : (
              <>
                <Search className="w-5 h-5" />
                تحلیل صفحه
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleSample}
            disabled={isLoading}
            className="btn-secondary flex items-center gap-2 disabled:opacity-50"
          >
            <BarChart3 className="w-5 h-5" />
            نمونه تحلیل
          </button>

          {(url || error) && (
            <button
              type="button"
              onClick={handleReset}
              disabled={isLoading}
              className="btn-secondary flex items-center gap-2 disabled:opacity-50"
            >
              <RefreshCw className="w-5 h-5" />
              شروع مجدد
            </button>
          )}
        </div>
      </form>

      {isLoading && (
        <div className="mt-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-violet-700/10 rounded-full mb-4">
            <Loader className="w-8 h-8 text-violet-700 animate-spin" />
          </div>
          <p className="text-lg font-medium text-gray-700">در حال تحلیل صفحه...</p>
          <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
            <div className="bg-gradient-to-r from-violet-700 to-purple-800 h-2 rounded-full animate-pulse" style={{width: '70%'}}></div>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl">
          <div className="flex items-center text-red-800">
            <AlertCircle className="w-5 h-5 ml-2" />
            <span className="font-medium">{error}</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default AnalysisForm