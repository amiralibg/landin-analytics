import { BarChart3 } from 'lucide-react'

const Header = () => {
  return (
    <div className="text-center mb-12 card bg-gradient-to-r from-violet-700 to-purple-800 text-white">
      <div className="flex flex-col lg:flex-row items-center justify-center mb-4">
        <BarChart3 className="w-12 h-12 mb-4 lg:ml-4 lg:mb-0" />
        <h1 className="text-3xl lg:text-4xl font-bold">تحلیلگر صفحات فرود</h1>
      </div>
      <p className="text-base lg:text-xl opacity-90">
        تحلیل رایگان و جامع صفحات فرود با ارزیابی فنی، سئو، تجربه کاربری و نرخ تبدیل
      </p>
    </div>
  )
}

export default Header