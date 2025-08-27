import { Zap, BarChart3, Target, Shield } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

const Features = () => {
  const features: Feature[] = [
    {
      icon: Zap,
      title: 'تحلیل سریع',
      description: 'تحلیل کامل صفحه در کمتر از 5 ثانیه'
    },
    {
      icon: BarChart3,
      title: 'گزارش جامع',
      description: 'بررسی ۴ بخش اصلی: فنی، سئو، UX و تبدیل'
    },
    {
      icon: Target,
      title: 'پیشنهادات عملی',
      description: 'راهکارهای مشخص برای بهبود صفحه'
    },
    {
      icon: Shield,
      title: 'رایگان و امن',
      description: 'بدون ثبت‌نام و با حفظ حریم خصوصی'
    }
  ]

  return (
    <div className="mt-20">
      <div className="card">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
          ویژگی‌های تحلیلگر
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon
            return (
              <div
                key={index}
                className="text-center p-6 rounded-xl bg-gradient-to-b from-white to-gray-50 border border-gray-100 hover:shadow-lg transition-all duration-300"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-violet-700 to-purple-800 text-white rounded-xl mb-4">
                  <IconComponent className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-800">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Features