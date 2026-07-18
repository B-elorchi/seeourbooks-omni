import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Wand2, Library, Clock, Zap } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function DashboardPage() {
  const { t } = useTranslation();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    setUser({
      email: localStorage.getItem('wp_user_email') || ''
    });
  }, []);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 truncate">{t('dashboard_page.welcome_back')}{user?.email ? `, ${user.email.split("@")[0]}!` : "!"}</h1>
        <p className="text-gray-500 mt-1">{t('dashboard_page.overview')}</p>
      </div>

      {/* Trial Status */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-6 text-white mb-8 shadow-lg shadow-emerald-500/20">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-xl font-bold mb-1 flex items-center gap-2">
              <Zap size={20} className="text-emerald-100" />
              {t('dashboard_page.trial_active')}
            </h2>
            <p className="text-emerald-50">{t('dashboard_page.trial_remaining')}</p>
          </div>
          <Link to="/process" className="bg-white text-emerald-700 px-6 py-2.5 rounded-full font-medium hover:bg-emerald-50 transition-colors shadow-sm">
            {t('dashboard_page.use_generation')}
          </Link>
        </div>
        <div className="mt-6">
          <div className="w-full bg-emerald-900/30 rounded-full h-2">
            <div className="bg-white h-2 rounded-full" style={{ width: '33%' }}></div>
          </div>
          <p className="text-xs text-emerald-100 mt-2 font-medium">{t('dashboard_page.uses_consumed')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center text-purple-600 mb-4">
            <Wand2 size={20} />
          </div>
          <h3 className="font-bold text-gray-900 mb-1">{t('dashboard_page.start_processing_title')}</h3>
          <p className="text-sm text-gray-500 mb-4">{t('dashboard_page.start_processing_desc')}</p>
          <Link to="/process" className="text-sm font-medium text-purple-600 hover:text-purple-700">{t('dashboard_page.get_started')} &rarr;</Link>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 mb-4">
            <Library size={20} />
          </div>
          <h3 className="font-bold text-gray-900 mb-1">{t('dashboard_page.your_library_title')}</h3>
          <p className="text-sm text-gray-500 mb-4">{t('dashboard_page.your_library_desc')}</p>
          <Link to="/library" className="text-sm font-medium text-blue-600 hover:text-blue-700">{t('dashboard_page.view_library')} &rarr;</Link>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center text-orange-600 mb-4">
            <Clock size={20} />
          </div>
          <h3 className="font-bold text-gray-900 mb-1">{t('dashboard_page.recent_activity_title')}</h3>
          <p className="text-sm text-gray-500 mb-4">{t('dashboard_page.recent_activity_desc')}</p>
          <Link to="/library" className="text-sm font-medium text-orange-600 hover:text-orange-700">{t('dashboard_page.see_history')} &rarr;</Link>
        </div>
      </div>
    </div>
  );
}
