import { Heart } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="mt-20 py-8 border-t border-gray-200 bg-white">
      <div className="container mx-auto px-4 text-center">
        <div className="flex items-center justify-center text-gray-600">
          <span>ساخته شده با</span>
          <Heart className="w-4 h-4 mx-2 text-red-500 fill-current" />
          <span>برای بهبود صفحات فرود فارسی</span>
        </div>
        <p className="mt-2 text-sm text-gray-500">
          © 2024 تحلیلگر صفحات فرود. تمامی حقوق محفوظ است.
        </p>
      </div>
    </footer>
  )
}

export default Footer