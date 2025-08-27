import { useState } from 'react'
import { Share2, RotateCcw, Trophy, CheckCircle, AlertTriangle, XCircle } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import ScoreChart from './charts/ScoreChart'
import CircularProgress from './charts/CircularProgress'
import type { ResultsProps } from '../types'

interface ScoreInfo {
  icon: LucideIcon;
  color: string;
  bgColor: string;
}

const Results: React.FC<ResultsProps> = ({ results, onReset }) => {
  const [shareMessage, setShareMessage] = useState('')

  const getGradeColor = (grade: string): string => {
    const colors: Record<string, string> = {
      A: 'from-green-500 to-green-600',
      B: 'from-blue-500 to-blue-600', 
      C: 'from-yellow-500 to-yellow-600',
      D: 'from-orange-500 to-orange-600',
      F: 'from-red-500 to-red-600'
    }
    return colors[grade] || colors.F
  }

  const handleShare = async () => {
    const shareText = `تحلیل صفحه فرود:\n${results.url}\nنمره: ${results.grade} (${Math.round(results.finalScore)})\n\n#LandingPageAnalyzer`
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'نتیجه تحلیل صفحه فرود',
          text: shareText,
          url: window.location.href
        })
      } catch (err) {
        console.log('Share cancelled')
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareText)
        setShareMessage('نتیجه در کلیپ‌برد کپی شد!')
        setTimeout(() => setShareMessage(''), 3000)
      } catch (err) {
        setShareMessage('خطا در کپی کردن')
        setTimeout(() => setShareMessage(''), 3000)
      }
    }
  }

  const categorizeScore = (score: number): ScoreInfo => {
    if (score >= 80) return { icon: CheckCircle, color: 'text-green-600', bgColor: 'bg-green-100' }
    if (score >= 60) return { icon: AlertTriangle, color: 'text-yellow-600', bgColor: 'bg-yellow-100' }
    return { icon: XCircle, color: 'text-red-600', bgColor: 'bg-red-100' }
  }

  return (
    <div className="fade-in space-y-8">
      {/* Grade Display */}
      <div className={`card text-center text-white bg-gradient-to-r ${getGradeColor(results.grade)}`}>
        <div className="flex items-center justify-center mb-4">
          <Trophy className="w-12 h-12 ml-4" />
          <div>
            <h2 className="text-3xl font-bold">نمره کلی: {results.grade}</h2>
            <p className="text-xl opacity-90">امتیاز: {Math.round(results.finalScore)}</p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Bar Chart */}
        <div className="card">
          <h3 className="text-xl font-bold mb-6 text-center">نمودار مقایسه امتیازات</h3>
          <ScoreChart data={results.chartData} />
        </div>

        {/* Circular Progress Charts */}
        <div className="card">
          <h3 className="text-xl font-bold mb-6 text-center">جزئیات امتیازات</h3>
          <div className="grid grid-cols-2 gap-6">
            <CircularProgress
              score={results.metrics.technical.score}
              label="فنی"
              color="#3500c0"
            />
            <CircularProgress
              score={results.metrics.seo.score}
              label="سئو"
              color="#4c1d95"
            />
            <CircularProgress
              score={results.metrics.ux.score}
              label="تجربه کاربری"
              color="#7c3aed"
            />
            <CircularProgress
              score={results.metrics.conversion.score}
              label="نرخ تبدیل"
              color="#8b5cf6"
            />
          </div>
        </div>
      </div>

      {/* Detailed Metrics */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Object.entries({
          technical: { title: 'فنی', score: results.metrics.technical.score },
          seo: { title: 'سئو', score: results.metrics.seo.score },
          ux: { title: 'تجربه کاربری', score: results.metrics.ux.score },
          conversion: { title: 'نرخ تبدیل', score: results.metrics.conversion.score }
        }).map(([key, data]) => {
          const scoreInfo = categorizeScore(data.score)
          const IconComponent = scoreInfo.icon
          
          return (
            <div key={key} className="card text-center">
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${scoreInfo.bgColor} mb-4`}>
                <IconComponent className={`w-6 h-6 ${scoreInfo.color}`} />
              </div>
              <h4 className="text-lg font-semibold mb-2">{data.title}</h4>
              <p className="text-2xl font-bold text-violet-700">{Math.round(data.score)}</p>
            </div>
          )
        })}
      </div>

      {/* Feedback Sections */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Positive Feedback */}
        {results.feedback.positive.length > 0 && (
          <div className="card border-r-4 border-green-500">
            <div className="flex items-center mb-4">
              <CheckCircle className="w-6 h-6 text-green-600 ml-2" />
              <h3 className="text-lg font-bold text-green-800">نکات مثبت</h3>
            </div>
            <ul className="space-y-2">
              {results.feedback.positive.map((item, index) => (
                <li key={index} className="text-sm text-gray-700 flex items-start">
                  <span className="text-green-500 ml-2">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Warning Feedback */}
        {results.feedback.warning.length > 0 && (
          <div className="card border-r-4 border-yellow-500">
            <div className="flex items-center mb-4">
              <AlertTriangle className="w-6 h-6 text-yellow-600 ml-2" />
              <h3 className="text-lg font-bold text-yellow-800">نیاز به بهبود</h3>
            </div>
            <ul className="space-y-2">
              {results.feedback.warning.map((item, index) => (
                <li key={index} className="text-sm text-gray-700 flex items-start">
                  <span className="text-yellow-500 ml-2">⚠</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Negative Feedback */}
        {results.feedback.negative.length > 0 && (
          <div className="card border-r-4 border-red-500">
            <div className="flex items-center mb-4">
              <XCircle className="w-6 h-6 text-red-600 ml-2" />
              <h3 className="text-lg font-bold text-red-800">نکات منفی</h3>
            </div>
            <ul className="space-y-2">
              {results.feedback.negative.map((item, index) => (
                <li key={index} className="text-sm text-gray-700 flex items-start">
                  <span className="text-red-500 ml-2">✗</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="card">
        <div className="flex flex-wrap justify-center gap-4">
          <button
            onClick={onReset}
            className="btn-secondary flex items-center gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            تحلیل صفحه جدید
          </button>
          
          <button
            onClick={handleShare}
            className="btn-primary flex items-center gap-2"
          >
            <Share2 className="w-5 h-5" />
            اشتراک‌گذاری نتیجه
          </button>
        </div>
        
        {shareMessage && (
          <div className="mt-4 text-center">
            <span className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-lg">
              <CheckCircle className="w-4 h-4 ml-2" />
              {shareMessage}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

export default Results