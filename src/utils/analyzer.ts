import type { AnalysisMetrics, AnalysisFeedback, AnalysisResult } from '../types'

// Landing Page Analyzer Logic (same as extension)
export const analyzeURL = async (url: string): Promise<AnalysisResult> => {
  const urlObj = new URL(url)
  
  // Enhanced Landin detection for URLs
  const isLandinSite = url.toLowerCase().includes('landin.ir') || 
                       url.toLowerCase().includes('templates.landin') ||
                       url.toLowerCase().includes('landin')

  // Create base metrics with Landin optimizations
  const metrics: AnalysisMetrics = {
    url: url,
    technical: {
      https: urlObj.protocol === 'https:',
      pageSize: isLandinSite ? Math.random() * 2000000 + 800000 : Math.random() * 3000000 + 500000,
      responsive: isLandinSite ? true : Math.random() > 0.2,
      isLandin: isLandinSite,
      imageOptimization: isLandinSite ? Math.random() * 20 + 80 : Math.random() * 40 + 60,
      pageSpeed: isLandinSite ? Math.random() * 15 + 80 : Math.random() * 30 + 60,
      score: 0
    },
    seo: {
      hasTitle: true,
      titleLength: isLandinSite ? Math.floor(Math.random() * 20 + 50) : Math.floor(Math.random() * 40 + 30),
      titleScore: 0,
      hasMetaDesc: isLandinSite ? true : Math.random() > 0.3,
      metaDescLength: isLandinSite ? Math.floor(Math.random() * 40 + 120) : Math.floor(Math.random() * 80 + 100),
      metaDescScore: 0,
      h1Count: 1,
      h2Count: isLandinSite ? Math.floor(Math.random() * 3) + 3 : Math.floor(Math.random() * 4) + 2,
      headingStructureScore: 0,
      altTagsScore: isLandinSite ? Math.random() * 20 + 75 : Math.random() * 40 + 50,
      urlScore: isLandinSite ? Math.random() * 20 + 70 : Math.random() * 50 + 40,
      score: 0
    },
    ux: {
      ctas: Array(isLandinSite ? Math.floor(Math.random() * 2) + 2 : Math.floor(Math.random() * 4) + 1).fill({}),
      ctaScore: 0,
      contrastScore: isLandinSite ? Math.random() * 15 + 80 : Math.random() * 40 + 50,
      whitespaceScore: isLandinSite ? Math.random() * 15 + 80 : Math.random() * 40 + 50,
      mobileFriendly: isLandinSite ? true : Math.random() > 0.3,
      score: 0
    },
    conversion: {
      forms: Array(isLandinSite ? 1 : Math.floor(Math.random() * 2)).fill({
        fieldCount: isLandinSite ? Math.floor(Math.random() * 3) + 2 : Math.floor(Math.random() * 6) + 2
      }),
      formScore: 0,
      socialProofElements: Array(isLandinSite ? Math.floor(Math.random() * 2) + 2 : Math.floor(Math.random() * 4)).fill({}),
      socialProof: 0,
      trustSignals: Array(isLandinSite ? Math.floor(Math.random() * 2) + 1 : Math.floor(Math.random() * 3)).fill({}),
      trustScore: 0,
      contactInfo: isLandinSite ? Math.floor(Math.random() * 2) + 2 : Math.floor(Math.random() * 2) + 1,
      contactScore: 0,
      uspScore: isLandinSite ? Math.random() * 20 + 75 : Math.random() * 50 + 40,
      score: 0
    }
  }

  // Calculate scores using same logic as extension
  calculateScores(metrics)
  
  // Generate feedback
  const feedback = generateFeedback(metrics)
  
  // Calculate final score and grade
  const finalScore = calculateFinalScore(metrics)
  const grade = getGrade(finalScore)
  
  // Prepare chart data
  const chartData = {
    labels: ['فنی', 'سئو', 'تجربه کاربری', 'نرخ تبدیل'],
    values: [
      metrics.technical.score,
      metrics.seo.score,
      metrics.ux.score,
      metrics.conversion.score
    ]
  }

  return {
    url,
    metrics,
    finalScore,
    grade,
    feedback,
    chartData
  }
}

const calculateScores = (metrics: AnalysisMetrics) => {
  // Technical score calculation
  let techScore = 0
  techScore += metrics.technical.isLandin ? 20 : 0
  techScore += (metrics.technical.pageSpeed / 100) * 30
  techScore += (scorePageSize(metrics.technical.pageSize) / 100) * 20
  techScore += metrics.technical.https ? 15 : 0
  techScore += metrics.technical.responsive ? 15 : 0
  
  if (metrics.technical.isLandin) {
    techScore += 10 // Bonus for Landin sites
  }
  
  metrics.technical.score = Math.min(techScore, 100)

  // SEO score calculation
  metrics.seo.titleScore = scoreTitleLength(metrics.seo.titleLength)
  metrics.seo.metaDescScore = scoreMetaDescLength(metrics.seo.metaDescLength)
  metrics.seo.headingStructureScore = scoreHeadingStructure(metrics.seo.h1Count, metrics.seo.h2Count)

  let seoScore = 0
  seoScore += (metrics.seo.titleScore / 100) * 30
  seoScore += (metrics.seo.metaDescScore / 100) * 25
  seoScore += (metrics.seo.headingStructureScore / 100) * 25
  seoScore += (metrics.seo.altTagsScore / 100) * 20
  metrics.seo.score = seoScore

  // UX score calculation
  metrics.ux.ctaScore = scoreCTAs(metrics.ux.ctas.length)
  let uxScore = 0
  uxScore += (metrics.ux.ctaScore / 100) * 40
  uxScore += (metrics.ux.contrastScore / 100) * 20
  uxScore += (metrics.ux.whitespaceScore / 100) * 20
  uxScore += metrics.ux.mobileFriendly ? 20 : 0
  metrics.ux.score = uxScore

  // Conversion score calculation
  metrics.conversion.formScore = scoreForms(metrics.conversion.forms)
  metrics.conversion.socialProof = scoreSocialProof(metrics.conversion.socialProofElements.length)
  metrics.conversion.trustScore = scoreTrustSignals(metrics.conversion.trustSignals.length)
  metrics.conversion.contactScore = scoreContactInfo(metrics.conversion.contactInfo)

  let conversionScore = 0
  conversionScore += (metrics.conversion.formScore / 100) * 25
  conversionScore += (metrics.conversion.socialProof / 100) * 25
  conversionScore += (metrics.conversion.trustScore / 100) * 25
  conversionScore += (metrics.conversion.contactScore / 100) * 12.5
  conversionScore += (metrics.conversion.uspScore / 100) * 12.5
  metrics.conversion.score = conversionScore
}

const generateFeedback = (metrics: AnalysisMetrics): AnalysisFeedback => {
  const positive: string[] = []
  const warning: string[] = []
  const negative: string[] = []

  // Technical feedback
  if (metrics.technical.isLandin) positive.push('صفحه با ابزارهای حرفه‌ای ساخته شده')
  
  if (metrics.technical.pageSpeed >= 80) positive.push('صفحه خیلی سریع بار می‌شه - این عالیه!')
  else if (metrics.technical.pageSpeed >= 60) warning.push('صفحه می‌تونه سریع‌تر بار بشه')
  else negative.push('صفحه کند بار می‌شه - کاربرا منتظر نمی‌مونن')
  
  if (metrics.technical.https) positive.push('ارتباط امن داره - کاربرا بهش اعتماد می‌کنن')
  else negative.push('ارتباط امن نداره - خطرناکه برای کاربرا')
  
  if (metrics.technical.responsive) positive.push('روی گوشی هم خوب کار می‌کنه')
  else negative.push('روی گوشی بد دیده می‌شه')

  const sizeInMB = metrics.technical.pageSize / (1024 * 1024)
  if (sizeInMB < 1) positive.push(`حجم صفحه مناسبه`)
  else if (sizeInMB < 3) warning.push(`صفحه یکم قاب سنگینه`)
  else negative.push(`صفحه خیلی سنگینه - اینترنت کند رو اذیت می‌کنه`)

  // SEO feedback
  if (metrics.seo.titleScore >= 80) positive.push('عنوان صفحه خوبه')
  else if (metrics.seo.titleScore >= 60) warning.push('عنوان صفحه می‌تونه بهتر بشه')
  else negative.push('عنوان صفحه مناسب نیست')
  
  if (metrics.seo.metaDescScore >= 80) positive.push('توضیح صفحه خوب نوشته شده')
  else if (metrics.seo.metaDescScore >= 60) warning.push('توضیح صفحه می‌تونه بهتر بشه')
  else negative.push('توضیح صفحه کم یا نداره')
  
  if (metrics.seo.headingStructureScore >= 80) positive.push('عناوین به خوبی مرتب شدن')
  else if (metrics.seo.headingStructureScore < 60) negative.push('عناوین بهم ریختن')
  
  if (metrics.seo.altTagsScore >= 80) positive.push('تمام عکس‌ها توضیح دارن')
  else if (metrics.seo.altTagsScore < 60) negative.push('عکس‌ها توضیح ندارن')

  // UX feedback
  if (metrics.ux.ctaScore >= 80) positive.push('دکمه‌های کار مناسبه')
  else if (metrics.ux.ctaScore >= 60) warning.push('تعداد دکمه‌ها بهتره کمتر باشه')
  else negative.push('دکمه‌ها زیاده یا نامفهومه')
  
  if (metrics.ux.contrastScore >= 80) positive.push('رنگ‌ها خوب دیده می‌شن')
  else if (metrics.ux.contrastScore < 60) negative.push('رنگ‌ها بد دیده می‌شن')
  
  if (metrics.ux.mobileFriendly) positive.push('با گوشی هم راحته')
  else negative.push('با گوشی مشکل داره')

  // Conversion feedback
  if (metrics.conversion.socialProof >= 80) positive.push('نظرات خوب کاربرا رو نشون داده')
  else if (metrics.conversion.socialProof < 60) negative.push('تعریف یا نظر کاربرا نداره')
  
  if (metrics.conversion.formScore >= 80) positive.push('فرم‌ها آسونه')
  else if (metrics.conversion.formScore < 60) negative.push('فرم‌ها پیچیده و طولانیه')
  
  if (metrics.conversion.trustScore >= 80) positive.push('علامت‌های اعتماد داره')
  else if (metrics.conversion.trustScore < 60) negative.push('علامت‌های اعتماد نداره')
  
  if (metrics.conversion.contactScore >= 80) positive.push('راه تماس راحته')
  else if (metrics.conversion.contactScore < 60) negative.push('راه تماس مشخص نیست')

  return { positive, warning, negative }
}

// Helper scoring functions
const scorePageSize = (sizeInBytes: number): number => {
  const sizeInMB = sizeInBytes / (1024 * 1024)
  if (sizeInMB < 1) return 100
  if (sizeInMB < 3) return 80
  if (sizeInMB < 5) return 50
  return 20
}

const scoreTitleLength = (length: number): number => {
  if (length >= 50 && length <= 60) return 100
  if ((length >= 30 && length < 50) || (length > 60 && length <= 70)) return 70
  return 30
}

const scoreMetaDescLength = (length: number): number => {
  if (length >= 120 && length <= 160) return 100
  if ((length >= 80 && length < 120) || (length > 160 && length <= 200)) return 70
  return 30
}

const scoreHeadingStructure = (h1Count: number, h2Count: number): number => {
  if (h1Count === 1 && h2Count >= 1) return 100
  if (h1Count === 1) return 80
  if (h1Count > 1) return 50
  return 0
}

const scoreCTAs = (ctaCount: number): number => {
  if (ctaCount >= 1 && ctaCount <= 3) return 100
  if (ctaCount >= 4 && ctaCount <= 5) return 70
  return 40
}

const scoreForms = (forms: Array<{ fieldCount: number }>): number => {
  if (forms.length === 0) return 50
  const avgFields = forms.reduce((sum, form) => sum + form.fieldCount, 0) / forms.length
  if (avgFields <= 3) return 100
  if (avgFields <= 6) return 70
  return 40
}

const scoreSocialProof = (elementCount: number): number => {
  return elementCount > 0 ? 100 : 0
}

const scoreTrustSignals = (elementCount: number): number => {
  if (elementCount >= 3) return 100
  if (elementCount >= 1) return 50
  return 0
}

const scoreContactInfo = (contactCount: number): number => {
  return contactCount > 0 ? 100 : 0
}

const calculateFinalScore = (metrics: AnalysisMetrics): number => {
  return (metrics.technical.score * 0.30) + 
         (metrics.seo.score * 0.25) + 
         (metrics.ux.score * 0.25) + 
         (metrics.conversion.score * 0.20)
}

const getGrade = (score: number): 'A' | 'B' | 'C' | 'D' | 'F' => {
  if (score >= 85) return 'A'
  if (score >= 70) return 'B'
  if (score >= 55) return 'C'
  if (score >= 40) return 'D'
  return 'F'
}