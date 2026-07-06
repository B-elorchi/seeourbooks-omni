import { Outlet, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

export default function PublicLayout() {
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'ar' ? 'en' : 'ar');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <header className="border-b border-gray-100 bg-white/80 backdrop-blur-md fixed top-0 w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/See-Our-Book.svg" alt="SeeOurBook" className="w-8 h-8 rounded-md object-contain" />
            <span className="font-bold text-xl tracking-tight">SeeOurBook</span>
          </div>
          <nav className="flex gap-4 items-center">
            <button 
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-black transition-colors"
            >
              <Globe size={16} />
              {t('switch_lang')}
            </button>
            <div className="w-px h-4 bg-gray-200 mx-2"></div>
            <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-black">{t('login')}</Link>
            <Link to="/signup" className="text-sm font-medium bg-black text-white px-4 py-2 rounded-full hover:bg-gray-800 transition-colors">{t('signup')}</Link>
          </nav>
        </div>
      </header>
      <main className="flex-1 flex flex-col pt-16">
        <Outlet />
      </main>
    </div>
  );
}
