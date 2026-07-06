import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Sparkles, BookOpen, Headphones, Video } from 'lucide-react';

export default function LandingPage() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] px-4">
      <div className="text-center max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 text-green-700 text-sm font-medium mb-6">
          <Sparkles size={14} />
          <span>{t('landing.badge')}</span>
        </div>
        <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight text-gray-900 mb-6 leading-tight">
          {t('landing.title_line1')} <br className="hidden sm:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500">
            {t('landing.title_line2')}
          </span>
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
          {t('landing.subtitle')}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/signup"
            className="flex items-center gap-2 bg-black text-white px-8 py-4 rounded-full font-medium hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            {t('landing.cta')}
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>

      <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-4">
            <BookOpen size={24} />
          </div>
          <h3 className="font-bold text-lg mb-2">{t('landing.feature1_title')}</h3>
          <p className="text-gray-500 text-sm leading-relaxed">{t('landing.feature1_desc')}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600 mb-4">
            <Headphones size={24} />
          </div>
          <h3 className="font-bold text-lg mb-2">{t('landing.feature2_title')}</h3>
          <p className="text-gray-500 text-sm leading-relaxed">{t('landing.feature2_desc')}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center text-red-600 mb-4">
            <Video size={24} />
          </div>
          <h3 className="font-bold text-lg mb-2">{t('landing.feature3_title')}</h3>
          <p className="text-gray-500 text-sm leading-relaxed">{t('landing.feature3_desc')}</p>
        </div>
      </div>
    </div>
  );
}
