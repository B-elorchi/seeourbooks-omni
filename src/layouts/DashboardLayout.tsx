import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Wand2, Library, LogOut, Globe, BookOpen } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

export default function DashboardLayout() {
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => setUser(session?.user ?? null)
    );
    return () => authListener.subscription.unsubscribe();
  }, []);

  const handleLogout = async (e: any) => {
    e.preventDefault();
    await supabase.auth.signOut();
    navigate('/login');
  };


  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'ar' ? 'en' : 'ar');
  };

  const navItems = [
    { name: t('dashboard'), path: '/dashboard', icon: LayoutDashboard },
    { name: t('ai_process'), path: '/process', icon: Wand2 },
    { name: 'Server Catalog', path: '/library', icon: Library },
    { name: 'My Books', path: '/my-books', icon: BookOpen },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-e border-gray-200 flex flex-col fixed h-full z-10">
        <div className="h-16 flex items-center px-6 border-b border-gray-100">
          <div className="w-8 h-8 bg-black rounded-md flex items-center justify-center me-3">
            <span className="text-white font-bold text-xl">S</span>
          </div>
          <span className="font-bold text-lg tracking-tight">Omni Portal</span>
        </div>
        
        <div className="p-4 flex-1">
          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-black'}`}
                >
                  <Icon size={18} />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="p-4 border-t border-gray-100 space-y-4">
          <button 
            onClick={toggleLanguage}
            className="flex items-center gap-3 px-3 py-2 w-full rounded-md text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-black transition-colors"
          >
            <Globe size={18} />
            {t('switch_lang')}
          </button>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                <span className="text-sm font-medium text-gray-600 uppercase">
                  {user?.email ? user.email.charAt(0) : 'U'}
                </span>
              </div>
              <div className="text-sm overflow-hidden text-ellipsis whitespace-nowrap max-w-[120px]">
                <p className="font-medium text-gray-900 truncate" title={user?.email || t('user')}>
                  {user?.email || t('user')}
                </p>
                <p className="text-xs text-gray-500">{t('free_trial')}</p>
              </div>
            </div>
            <button onClick={handleLogout} className="text-gray-400 hover:text-red-600 transition-colors" title={t('logout')}>
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ms-64 p-8">
        <div className="w-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
