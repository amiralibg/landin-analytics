import type {
  AnalysisMetrics,
  AnalysisFeedback,
  AnalysisResult,
} from "../types";

// Landing Page Analyzer Logic - Now with real data fetching
export const analyzeURL = async (url: string): Promise<AnalysisResult> => {
  let metrics: AnalysisMetrics;
  
  try {
    // Try to fetch real content first
    const response = await fetch(url, { mode: 'cors' });
    
    if (response.ok) {
      const html = await response.text();
      metrics = await analyzeHTMLContent(html, url);
    } else {
      // Fallback to simulation if fetch fails
      metrics = generateSimulatedMetrics(url);
    }
  } catch (error) {
    // CORS or network error - use simulation
    console.warn('Fetch failed, using simulation:', error);
    metrics = generateSimulatedMetrics(url);
  }

  // Calculate scores using same logic as extension
  calculateScores(metrics);

  // Generate feedback
  const feedback = generateFeedback(metrics);

  // Calculate final score and grade
  const finalScore = calculateFinalScore(metrics);
  const grade = getGrade(finalScore);

  // Prepare chart data
  const chartData = {
    labels: ["فنی", "سئو", "تجربه کاربری", "نرخ تبدیل"],
    values: [
      metrics.technical.score,
      metrics.seo.score,
      metrics.ux.score,
      metrics.conversion.score,
    ],
  };

  return {
    url,
    metrics,
    finalScore,
    grade,
    feedback,
    chartData,
  };
};

// Function to analyze real HTML content
const analyzeHTMLContent = async (html: string, url: string): Promise<AnalysisMetrics> => {
  // Parse HTML using DOMParser (browser) or jsdom (Node.js)
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  
  // Enhanced Landin detection
  const isLandinSite = url.toLowerCase().includes('landin.ir') ||
                      url.toLowerCase().includes('templates.landin') ||
                      url.toLowerCase().includes('landin') ||
                      url.includes('لندین') ||
                      html.toLowerCase().includes('landin');
  
  const metrics: AnalysisMetrics = {
    url: url,
    technical: {
      https: url.startsWith('https:'),
      pageSize: html.length, // Real HTML size
      responsive: !!doc.querySelector('meta[name="viewport"]'),
      isLandin: isLandinSite,
      imageOptimization: analyzeImagesFromHTML(doc),
      pageSpeed: estimatePageSpeedFromHTML(doc, isLandinSite),
      score: 0,
    },
    seo: {
      hasTitle: !!doc.querySelector('title'),
      titleLength: doc.querySelector('title')?.textContent?.trim().length || 0,
      titleScore: 0,
      hasMetaDesc: !!doc.querySelector('meta[name="description"]'),
      metaDescLength: doc.querySelector('meta[name="description"]')?.getAttribute('content')?.length || 0,
      metaDescScore: 0,
      h1Count: doc.querySelectorAll('h1').length,
      h2Count: doc.querySelectorAll('h2').length,
      headingStructureScore: 0,
      altTagsScore: analyzeAltTagsFromHTML(doc),
      urlScore: analyzeURLStructure(url, doc),
      score: 0,
    },
    ux: {
      ctas: Array.from(analyzeCTAsFromHTML(doc)),
      ctaScore: 0,
      contrastScore: estimateContrastFromHTML(),
      whitespaceScore: estimateWhitespaceFromHTML(html),
      mobileFriendly: !!doc.querySelector('meta[name="viewport"]'),
      score: 0,
    },
    conversion: {
      forms: analyzeFormsFromHTML(doc),
      formScore: 0,
      socialProofElements: Array.from(findSocialProofFromHTML(doc)),
      socialProof: 0,
      trustSignals: Array.from(findTrustSignalsFromHTML(doc)),
      trustScore: 0,
      contactInfo: findContactInfoFromHTML(doc, html),
      contactScore: 0,
      uspScore: analyzeUSPFromHTML(doc, isLandinSite),
      score: 0,
    },
  };
  
  return metrics;
};

// Fallback simulation function
const generateSimulatedMetrics = (url: string): AnalysisMetrics => {
  const isLandinSite = url.toLowerCase().includes('landin.ir') ||
                      url.toLowerCase().includes('templates.landin') ||
                      url.toLowerCase().includes('landin') ||
                      url.includes('لندین');

  return {
    url: url,
    technical: {
      https: url.startsWith('https:'),
      pageSize: isLandinSite ? Math.random() * 2000000 + 800000 : Math.random() * 3000000 + 500000,
      responsive: isLandinSite ? true : Math.random() > 0.2,
      isLandin: isLandinSite,
      imageOptimization: isLandinSite ? Math.random() * 20 + 80 : Math.random() * 40 + 60,
      pageSpeed: isLandinSite ? Math.random() * 15 + 80 : Math.random() * 30 + 60,
      score: 0,
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
      score: 0,
    },
    ux: {
      ctas: Array(isLandinSite ? Math.floor(Math.random() * 2) + 2 : Math.floor(Math.random() * 4) + 1).fill({}),
      ctaScore: 0,
      contrastScore: 80, // Match extension logic
      whitespaceScore: 70, // Conservative estimate for simulation
      mobileFriendly: isLandinSite ? true : Math.random() > 0.3,
      score: 0,
    },
    conversion: {
      forms: Array(isLandinSite ? 1 : Math.floor(Math.random() * 2)).fill({
        fieldCount: isLandinSite ? Math.floor(Math.random() * 3) + 2 : Math.floor(Math.random() * 6) + 2,
      }),
      formScore: 0,
      socialProofElements: Array(isLandinSite ? Math.floor(Math.random() * 2) + 2 : Math.floor(Math.random() * 4)).fill({}),
      socialProof: 0,
      trustSignals: Array(isLandinSite ? Math.floor(Math.random() * 2) + 1 : Math.floor(Math.random() * 3)).fill({}),
      trustScore: 0,
      contactInfo: isLandinSite ? Math.floor(Math.random() * 2) + 2 : Math.floor(Math.random() * 2) + 1,
      contactScore: 0,
      uspScore: isLandinSite ? Math.random() * 20 + 75 : Math.random() * 50 + 40,
      score: 0,
    },
  };
};

// Helper functions for HTML analysis
const analyzeImagesFromHTML = (doc: Document): number => {
  const images = doc.querySelectorAll('img');
  if (images.length === 0) return 100;
  
  const withAlt = Array.from(images).filter(img => img.alt && img.alt.trim() !== '').length;
  return (withAlt / images.length) * 100;
};

const estimatePageSpeedFromHTML = (doc: Document, isLandin: boolean): number => {
  const resourceCount = doc.querySelectorAll('script, link[rel="stylesheet"], img').length;
  let baseScore = 85; // Match extension default
  
  // Landin sites are generally well-optimized
  if (isLandin) {
    baseScore = 90; // Match extension exactly
  }
  
  const penalty = Math.min(resourceCount * 1.5, 25); // Match extension penalty
  return Math.max(baseScore - penalty, 60); // Match extension minimum
};

const analyzeAltTagsFromHTML = (doc: Document): number => {
  const images = doc.querySelectorAll('img');
  if (images.length === 0) return 100;
  
  const withAlt = Array.from(images).filter(img => img.alt && img.alt.trim() !== '').length;
  const percentage = (withAlt / images.length) * 100;
  
  if (percentage >= 90) return 100;
  if (percentage >= 60) return 70;
  return 30;
};

const analyzeURLStructure = (url: string, doc: Document): number => {
  const hasCanonical = !!doc.querySelector('link[rel="canonical"]');
  const isClean = !url.includes('?') || url.split('?')[1].length < 50;
  const hasReadableStructure = url.split('/').length <= 6;
  
  let score = 0;
  if (hasCanonical) score += 40;
  if (isClean) score += 30;
  if (hasReadableStructure) score += 30;
  
  return score;
};

const analyzeCTAsFromHTML = (doc: Document): Set<Element> => {
  const ctaSelectors = [
    'button',
    'a[href*="signup"]', 'a[href*="register"]', 'a[href*="buy"]',
    'a[href*="order"]', 'a[href*="purchase"]', 'a[href*="contact"]',
    '.cta', '.btn', '.button', '[class*="call-to-action"]'
  ];
  
  const ctas = new Set<Element>();
  ctaSelectors.forEach(selector => {
    doc.querySelectorAll(selector).forEach(el => ctas.add(el));
  });
  
  return ctas;
};

const estimateContrastFromHTML = (): number => {
  // Match extension logic: simplified contrast analysis
  // Since we can't access getComputedStyle, use a conservative estimate
  // Most sites have decent contrast, so default to 80 like extension does
  return 80;
};

const estimateWhitespaceFromHTML = (html: string): number => {
  // Match extension logic exactly: textLength / htmlLength ratio
  const textLength = html.replace(/<[^>]*>/g, '').trim().length;
  const ratio = textLength / html.length;
  
  // Lower ratio indicates more markup/whitespace relative to text
  if (ratio < 0.3) return 100; // Good whitespace
  if (ratio < 0.5) return 70;
  return 40; // Too dense
};

const analyzeFormsFromHTML = (doc: Document): Array<{ fieldCount: number }> => {
  const forms = doc.querySelectorAll('form');
  return Array.from(forms).map(form => {
    const fields = form.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"], textarea, select');
    return {
      fieldCount: fields.length
    };
  });
};

const findSocialProofFromHTML = (doc: Document): Element[] => {
  const selectors = [
    '.testimonial', '.review', '.rating', '.customer-logo',
    '[class*="testimonial"]', '[class*="review"]', '[class*="rating"]',
    'img[src*="logo"]', '[class*="trust"]', '[class*="badge"]'
  ];
  
  const elements: Element[] = [];
  selectors.forEach(selector => {
    elements.push(...Array.from(doc.querySelectorAll(selector)));
  });
  
  return elements;
};

const findTrustSignalsFromHTML = (doc: Document): Element[] => {
  const selectors = [
    '[class*="secure"]', '[class*="guarantee"]', '[class*="warranty"]',
    'img[src*="ssl"]', 'img[src*="secure"]', 'img[src*="trust"]',
    '[class*="certified"]', '[class*="verified"]'
  ];
  
  const elements: Element[] = [];
  selectors.forEach(selector => {
    elements.push(...Array.from(doc.querySelectorAll(selector)));
  });
  
  return elements;
};

const findContactInfoFromHTML = (doc: Document, html: string): number => {
  const phonePattern = /\+?\d{1,4}[-.\s]?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,9}/g;
  const emailPattern = /[\w._%+-]+@[\w.-]+\.[A-Za-z]{2,}/g;
  
  const text = doc.body?.textContent || html;
  const phones = (text.match(phonePattern) || []).length;
  const emails = (text.match(emailPattern) || []).length;
  const contactLinks = doc.querySelectorAll('a[href^="tel:"], a[href^="mailto:"]').length;
  
  return phones + emails + contactLinks;
};

const analyzeUSPFromHTML = (doc: Document, isLandin: boolean): number => {
  // Look for unique selling proposition in headings and prominent text
  const prominentText = Array.from(doc.querySelectorAll('h1, h2, .hero, [class*="headline"]'))
    .map(el => el.textContent)
    .join(' ');
  
  // Basic check for value proposition keywords
  const uspKeywords = ['فقط', 'منحصر', 'بهترین', 'رایگان', 'سریع', 'آسان', 'تضمین', 'exclusive', 'best', 'free', 'fast', 'easy', 'guarantee'];
  const hasUSP = uspKeywords.some(keyword => prominentText.toLowerCase().includes(keyword));
  
  if (hasUSP) return 100;
  return isLandin ? 80 : 60; // Match extension logic
};

const calculateScores = (metrics: AnalysisMetrics) => {
  // Technical score calculation (35% weight)
  let techScore = 0;

  // Landin detection bonus (20 points)
  techScore += metrics.technical.isLandin ? 20 : 0;

  // Page speed (20 points)
  techScore += (metrics.technical.pageSpeed / 100) * 20;

  // Page size (15 points)
  techScore += (scorePageSize(metrics.technical.pageSize) / 100) * 15;

  // HTTPS (20 points)
  techScore += metrics.technical.https ? 20 : 0;

  // Responsive (15 points)
  techScore += metrics.technical.responsive ? 15 : 0;

  // Image optimization (10 points)
  techScore += (metrics.technical.imageOptimization / 100) * 10;

  metrics.technical.score = Math.min(techScore, 100);

  // SEO score calculation
  metrics.seo.titleScore = scoreTitleLength(metrics.seo.titleLength);
  metrics.seo.metaDescScore = scoreMetaDescLength(metrics.seo.metaDescLength);
  metrics.seo.headingStructureScore = scoreHeadingStructure(
    metrics.seo.h1Count,
    metrics.seo.h2Count
  );

  let seoScore = 0;
  seoScore += (metrics.seo.titleScore / 100) * 30;
  seoScore += (metrics.seo.metaDescScore / 100) * 25;
  seoScore += (metrics.seo.headingStructureScore / 100) * 25;
  seoScore += (metrics.seo.altTagsScore / 100) * 20;
  metrics.seo.score = seoScore;

  // UX score calculation
  metrics.ux.ctaScore = scoreCTAs(metrics.ux.ctas.length);
  let uxScore = 0;
  uxScore += (metrics.ux.ctaScore / 100) * 40;
  uxScore += (metrics.ux.contrastScore / 100) * 20;
  uxScore += (metrics.ux.whitespaceScore / 100) * 20;
  uxScore += metrics.ux.mobileFriendly ? 20 : 0;
  metrics.ux.score = uxScore;

  // Conversion score calculation
  metrics.conversion.formScore = scoreForms(metrics.conversion.forms);
  metrics.conversion.socialProof = scoreSocialProof(
    metrics.conversion.socialProofElements.length
  );
  metrics.conversion.trustScore = scoreTrustSignals(
    metrics.conversion.trustSignals.length
  );
  metrics.conversion.contactScore = scoreContactInfo(
    metrics.conversion.contactInfo
  );

  let conversionScore = 0;
  conversionScore += (metrics.conversion.formScore / 100) * 25;
  conversionScore += (metrics.conversion.socialProof / 100) * 25;
  conversionScore += (metrics.conversion.trustScore / 100) * 25;
  conversionScore += (metrics.conversion.contactScore / 100) * 12.5;
  conversionScore += (metrics.conversion.uspScore / 100) * 12.5;
  metrics.conversion.score = conversionScore;
};

const generateFeedback = (metrics: AnalysisMetrics): AnalysisFeedback => {
  const positive: string[] = [];
  const warning: string[] = [];
  const negative: string[] = [];

  // Technical feedback
  if (metrics.technical.isLandin)
    positive.push("صفحه با ابزارهای حرفه‌ای ساخته شده");

  if (metrics.technical.pageSpeed >= 80)
    positive.push("صفحه خیلی سریع بار می‌شه - این عالیه!");
  else if (metrics.technical.pageSpeed >= 60)
    warning.push("صفحه می‌تونه سریع‌تر بار بشه");
  else negative.push("صفحه کند بار می‌شه - کاربرا منتظر نمی‌مونن");

  if (metrics.technical.https)
    positive.push("ارتباط امن داره - کاربرا بهش اعتماد می‌کنن");
  else negative.push("ارتباط امن نداره - خطرناکه برای کاربرا");

  if (metrics.technical.responsive) positive.push("روی گوشی هم خوب کار می‌کنه");
  else negative.push("روی گوشی بد دیده می‌شه");

  const sizeInMB = metrics.technical.pageSize / (1024 * 1024);
  if (sizeInMB < 1) positive.push(`حجم صفحه مناسبه`);
  else if (sizeInMB < 3) warning.push(`صفحه یکم قاب سنگینه`);
  else negative.push(`صفحه خیلی سنگینه - اینترنت کند رو اذیت می‌کنه`);

  // SEO feedback
  if (metrics.seo.titleScore >= 80) positive.push("عنوان صفحه خوبه");
  else if (metrics.seo.titleScore >= 60)
    warning.push("عنوان صفحه می‌تونه بهتر بشه");
  else negative.push("عنوان صفحه مناسب نیست");

  if (metrics.seo.metaDescScore >= 80)
    positive.push("توضیح صفحه خوب نوشته شده");
  else if (metrics.seo.metaDescScore >= 60)
    warning.push("توضیح صفحه می‌تونه بهتر بشه");
  else negative.push("توضیح صفحه کم یا نداره");

  if (metrics.seo.headingStructureScore >= 80)
    positive.push("عناوین به خوبی مرتب شدن");
  else if (metrics.seo.headingStructureScore < 60)
    negative.push("عناوین بهم ریختن");

  if (metrics.seo.altTagsScore >= 80) positive.push("تمام عکس‌ها توضیح دارن");
  else if (metrics.seo.altTagsScore < 60) negative.push("عکس‌ها توضیح ندارن");

  // UX feedback
  if (metrics.ux.ctaScore >= 80) positive.push("دکمه‌های کار مناسبه");
  else if (metrics.ux.ctaScore >= 60)
    warning.push("تعداد دکمه‌ها بهتره کمتر باشه");
  else negative.push("دکمه‌ها زیاده یا نامفهومه");

  if (metrics.ux.contrastScore >= 80) positive.push("رنگ‌ها خوب دیده می‌شن");
  else if (metrics.ux.contrastScore < 60) negative.push("رنگ‌ها بد دیده می‌شن");

  if (metrics.ux.mobileFriendly) positive.push("با گوشی هم راحته");
  else negative.push("با گوشی مشکل داره");

  // Conversion feedback
  if (metrics.conversion.socialProof >= 80)
    positive.push("نظرات خوب کاربرا رو نشون داده");
  else if (metrics.conversion.socialProof < 60)
    negative.push("تعریف یا نظر کاربرا نداره");

  if (metrics.conversion.formScore >= 80) positive.push("فرم‌ها آسونه");
  else if (metrics.conversion.formScore < 60)
    negative.push("فرم‌ها پیچیده و طولانیه");

  if (metrics.conversion.trustScore >= 80)
    positive.push("علامت‌های اعتماد داره");
  else if (metrics.conversion.trustScore < 60)
    negative.push("علامت‌های اعتماد نداره");

  if (metrics.conversion.contactScore >= 80) positive.push("راه تماس راحته");
  else if (metrics.conversion.contactScore < 60)
    negative.push("راه تماس مشخص نیست");

  return { positive, warning, negative };
};

// Helper scoring functions
const scorePageSize = (sizeInBytes: number): number => {
  const sizeInMB = sizeInBytes / (1024 * 1024);
  if (sizeInMB < 1) return 100;
  if (sizeInMB < 3) return 80;
  if (sizeInMB < 5) return 50;
  return 20;
};

const scoreTitleLength = (length: number): number => {
  if (length >= 50 && length <= 60) return 100;
  if ((length >= 30 && length < 50) || (length > 60 && length <= 70)) return 70;
  return 30;
};

const scoreMetaDescLength = (length: number): number => {
  if (length >= 120 && length <= 160) return 100;
  if ((length >= 80 && length < 120) || (length > 160 && length <= 200))
    return 70;
  return 30;
};

const scoreHeadingStructure = (h1Count: number, h2Count: number): number => {
  if (h1Count === 1 && h2Count >= 1) return 100;
  if (h1Count === 1) return 80;
  if (h1Count > 1) return 50;
  return 0;
};

const scoreCTAs = (ctaCount: number): number => {
  if (ctaCount >= 1 && ctaCount <= 3) return 100;
  if (ctaCount >= 4 && ctaCount <= 5) return 70;
  return 40;
};

const scoreForms = (forms: Array<{ fieldCount: number }>): number => {
  if (forms.length === 0) return 50;
  const avgFields =
    forms.reduce((sum, form) => sum + form.fieldCount, 0) / forms.length;
  if (avgFields <= 3) return 100;
  if (avgFields <= 6) return 70;
  return 40;
};

const scoreSocialProof = (elementCount: number): number => {
  return elementCount > 0 ? 100 : 0;
};

const scoreTrustSignals = (elementCount: number): number => {
  if (elementCount >= 3) return 100;
  if (elementCount >= 1) return 50;
  return 0;
};

const scoreContactInfo = (contactCount: number): number => {
  return contactCount > 0 ? 100 : 0;
};

const calculateFinalScore = (metrics: AnalysisMetrics): number => {
  return (
    metrics.technical.score * 0.35 +
    metrics.seo.score * 0.25 +
    metrics.ux.score * 0.25 +
    metrics.conversion.score * 0.15
  );
};

const getGrade = (score: number): "A" | "B" | "C" | "D" | "F" => {
  if (score >= 90) return "A";
  if (score >= 80) return "B";
  if (score >= 70) return "C";
  if (score >= 60) return "D";
  return "F";
};