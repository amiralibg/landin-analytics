import { useState } from 'react'
import Header from './components/Header'
import AnalysisForm from './components/AnalysisForm'
import Results from './components/Results'
import Features from './components/Features'
import Footer from './components/Footer'
import { analyzeURL } from './utils/analyzer'
import type { AnalysisResult } from './types'

function App() {
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleAnalyze = async (url: string) => {
    setIsLoading(true)
    setError(null)
    setResults(null)

    try {
      // Simulate analysis delay
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const analysisResults = await analyzeURL(url)
      setResults(analysisResults)
    } catch (err) {
      setError('خطا در تحلیل صفحه. لطفاً دوباره تلاش کنید.')
      console.error('Analysis error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setResults(null)
    setError(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <Header />
        
        <AnalysisForm 
          onAnalyze={handleAnalyze}
          isLoading={isLoading}
          error={error}
          onReset={handleReset}
        />
        
        {results && (
          <Results 
            results={results}
            onReset={handleReset}
          />
        )}
        
        <Features />
      </div>
      
      <Footer />
    </div>
  )
}

export default App