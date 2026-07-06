import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Wand2, Library, LogOut, Globe, BookOpen, Menu, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

export default function DashboardLayout() {
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const [user, setUser] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
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

  // Close the mobile drawer on every navigation.
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

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
    { name: t('nav.server_catalog'), path: '/library', icon: Library },
    { name: t('nav.my_books'), path: '/my-books', icon: BookOpen },
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Mobile top bar */}
      <div className="md:hidden h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 sticky top-0 z-30">
        <div className="flex items-center gap-2.5">
          <img src="/See-Our-Book.svg" alt="SeeOurBook" className="w-8 h-8 rounded-md object-contain" />
          <span className="font-bold text-lg tracking-tight">Omni Portal</span>
        </div>
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 -me-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>
      </div>

      {/* Backdrop (mobile only, when drawer open) */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/40 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar — off-canvas drawer on mobile, static on md+ */}
      <aside
        className={`w-64 bg-white border-e border-gray-200 flex flex-col fixed h-full z-50 transition-transform duration-300 ease-out
          ${sidebarOpen ? 'translate-x-0' : 'ltr:-translate-x-full rtl:translate-x-full'}
          md:translate-x-0`}
      >
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-100">
          <div className="flex items-center min-w-0">
            <img src="/See-Our-Book.svg" alt="SeeOurBook" className="w-8 h-8 rounded-md object-contain me-3 shrink-0" />
            <span className="font-bold text-lg tracking-tight truncate">Omni Portal</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-900 transition-colors shrink-0"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4 flex-1 overflow-y-auto">
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

        <div className="p-4 border-t border-gray-100 space-y-4 shrink-0">
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-3 px-3 py-2 w-full rounded-md text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-black transition-colors"
          >
            <Globe size={18} />
            {t('switch_lang')}
          </button>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden shrink-0">
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
            <button onClick={handleLogout} className="text-gray-400 hover:text-red-600 transition-colors shrink-0" title={t('logout')}>
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="md:ms-64 p-4 sm:p-6 md:p-8">
        <div className="w-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
