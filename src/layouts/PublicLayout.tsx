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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0 shrink-0">
            <img src="/See-Our-Book.svg" alt="SeeOurBook" className="w-8 h-8 rounded-md object-contain shrink-0" />
            <span className="font-bold text-lg sm:text-xl tracking-tight truncate">SeeOurBook</span>
          </div>
          <nav className="flex gap-1.5 sm:gap-4 items-center shrink-0">
            <button
              onClick={toggleLanguage}
              title={t('switch_lang')}
              className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-black transition-colors p-2 -m-2 sm:p-0 sm:m-0"
            >
              <Globe size={16} />
              <span className="hidden sm:inline">{t('switch_lang')}</span>
            </button>
            <div className="hidden sm:block w-px h-4 bg-gray-200 mx-2"></div>
            <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-black whitespace-nowrap px-1">{t('login')}</Link>
            <Link to="/signup" className="text-sm font-medium bg-black text-white px-3 sm:px-4 py-2 rounded-full hover:bg-gray-800 transition-colors whitespace-nowrap">{t('signup')}</Link>
          </nav>
        </div>
      </header>
      <main className="flex-1 flex flex-col pt-16">
        <Outlet />
      </main>
    </div>
  );
}
