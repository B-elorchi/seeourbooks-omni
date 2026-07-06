import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight, BookOpen, Headphones, Video, Play, Map, CheckCircle2 } from 'lucide-react';

export default function LandingPage() {
  const { t } = useTranslation();

  const features = [
    { icon: BookOpen, title: t('landing.feature1_title'), desc: t('landing.feature1_desc'), color: 'from-blue-500 to-indigo-500', bg: 'bg-blue-50', text: 'text-blue-600' },
    { icon: Headphones, title: t('landing.feature2_title'), desc: t('landing.feature2_desc'), color: 'from-purple-500 to-fuchsia-500', bg: 'bg-purple-50', text: 'text-purple-600' },
    { icon: Video, title: t('landing.feature3_title'), desc: t('landing.feature3_desc'), color: 'from-rose-500 to-orange-500', bg: 'bg-red-50', text: 'text-red-600' },
  ];

  return (
    <div className="flex flex-col">
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden px-4 pt-12 sm:pt-20 pb-16 sm:pb-28">
        {/* Ambient gradient blobs */}
        <div className="absolute -top-24 -left-24 w-72 h-72 sm:w-96 sm:h-96 bg-emerald-300/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-40 -right-24 w-72 h-72 sm:w-96 sm:h-96 bg-teal-300/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[36rem] h-[36rem] bg-emerald-100/40 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 border border-green-100 text-green-700 text-sm font-medium mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            {t('landing.badge')}
          </div>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-gray-900 mb-6 leading-[1.1]">
            {t('landing.title_line1')} <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600">
              {t('landing.title_line2')}
            </span>
          </h1>
          <p className="text-base sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            {t('landing.subtitle')}
          </p>
          <div className="flex flex-col items-center gap-3">
            <Link
              to="/signup"
              className="flex items-center gap-2 bg-black text-white px-6 sm:px-8 py-3.5 sm:py-4 rounded-full font-medium hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              {t('landing.cta')}
              <ArrowRight size={18} className="rtl:rotate-180" />
            </Link>
            <span className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-400">
              <CheckCircle2 size={14} className="text-emerald-500" />
              {t('landing.no_cc')}
            </span>
          </div>
        </div>

        {/* ── Product mockup ─────────────────────────────────────────────── */}
        <div className="relative max-w-3xl mx-auto mt-14 sm:mt-20 px-2 sm:px-0">
          <div className="rounded-2xl sm:rounded-3xl border border-gray-200 bg-white shadow-2xl shadow-gray-200/60 overflow-hidden">
            {/* Fake title bar */}
            <div className="flex items-center gap-1.5 px-4 py-3 border-b border-gray-100 bg-gray-50/80">
              <span className="w-2.5 h-2.5 rounded-full bg-red-300" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-300" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-300" />
              <span className="ms-3 text-xs text-gray-400 font-medium truncate">{t('landing.mock_summary_title')}</span>
              <span className="ms-auto flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full shrink-0">
                <CheckCircle2 size={11} /> {t('landing.mock_status')}
              </span>
            </div>

            <div className="p-4 sm:p-6 space-y-4 sm:space-y-5">
              {/* Summary preview lines */}
              <div className="space-y-2">
                <div className="h-2.5 w-3/4 sm:w-2/3 bg-gray-200 rounded-full" />
                <p className="text-sm text-gray-500 leading-relaxed">
                  {t('landing.mock_summary_line1')} {t('landing.mock_summary_line2')}
                </p>
                <div className="h-2.5 w-1/2 bg-gray-100 rounded-full" />
              </div>

              {/* Audio row */}
              <div className="flex items-center gap-3 bg-purple-50/60 border border-purple-100 rounded-xl p-3">
                <div className="w-9 h-9 rounded-full bg-purple-600 text-white flex items-center justify-center shrink-0">
                  <Play size={14} fill="currentColor" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-700 truncate">{t('landing.mock_audio_label')}</p>
                  <div className="mt-1.5 flex items-end gap-0.5 h-4">
                    {[6, 10, 14, 8, 16, 12, 7, 15, 9, 13, 6, 11, 8, 14, 10].map((h, i) => (
                      <span key={i} className={`w-1 rounded-full ${i < 6 ? 'bg-purple-500' : 'bg-purple-200'}`} style={{ height: `${h}px` }} />
                    ))}
                  </div>
                </div>
              </div>

              {/* Mindmap + language chips */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-green-700 bg-green-50 border border-green-100 px-3 py-1.5 rounded-full">
                  <Map size={13} /> {t('landing.mock_mindmap_label')}
                </span>
                <span className="text-xs font-medium text-gray-500 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-full">EN</span>
                <span className="text-xs font-medium text-gray-500 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-full">AR</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────────────────── */}
      <section className="px-4 pb-16 sm:pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={i}
                className="group relative bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
              >
                <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${f.color} opacity-0 group-hover:opacity-100 transition-opacity`} />
                <div className={`w-12 h-12 ${f.bg} rounded-xl flex items-center justify-center ${f.text} mb-4`}>
                  <Icon size={24} />
                </div>
                <h3 className="font-bold text-lg mb-2 text-gray-900">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Final CTA band ──────────────────────────────────────────────── */}
      <section className="px-4 pb-16 sm:pb-24">
        <div className="relative max-w-5xl mx-auto rounded-3xl overflow-hidden bg-gray-900 px-6 sm:px-16 py-12 sm:py-16 text-center">
          <div className="absolute -top-16 -right-16 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="relative">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white mb-3 sm:mb-4 tracking-tight">
              {t('landing.final_cta_title')}
            </h2>
            <p className="text-gray-400 text-sm sm:text-base max-w-xl mx-auto mb-8 leading-relaxed">
              {t('landing.final_cta_subtitle')}
            </p>
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 bg-white text-black px-6 sm:px-8 py-3.5 sm:py-4 rounded-full font-medium hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              {t('landing.final_cta_button')}
              <ArrowRight size={18} className="rtl:rotate-180" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer className="px-4 pb-10">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-100 pt-8">
          <div className="flex items-center gap-2">
            <img src="/See-Our-Book.svg" alt="SeeOurBook" className="w-6 h-6 rounded-md object-contain" />
            <span className="font-bold text-sm text-gray-700">SeeOurBook</span>
          </div>
          <p className="text-xs text-gray-400 text-center">{t('landing.footer_tagline')}</p>
          <p className="text-xs text-gray-400">&copy; {new Date().getFullYear()} SeeOurBook. {t('landing.footer_rights')}</p>
        </div>
      </footer>
    </div>
  );
}
