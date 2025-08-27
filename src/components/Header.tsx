import { BarChart3 } from 'lucide-react'

const Header = () => {
  return (
    <div className="text-center mb-12 card bg-gradient-to-r from-violet-700 to-purple-800 text-white">
      <div className="flex items-center justify-center mb-4">
        <BarChart3 className="w-12 h-12 ml-4" />
        <h1 className="text-4xl font-bold">تحلیلگر صفحات فرود</h1>
      </div>
      <p className="text-xl opacity-90">
        تحلیل رایگان و جامع صفحات فرود با ارزیابی فنی، سئو، تجربه کاربری و نرخ تبدیل
      </p>
    </div>
  )
}

export default Header