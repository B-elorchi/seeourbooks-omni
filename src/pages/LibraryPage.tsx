import { Search, Play, BookOpen, Map, ArrowRight, Wand2, BookUp, Clock } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import catalogData from '../data/rank_101_200.json';
import { useNavigate } from 'react-router-dom';
import EpubReaderModal from '../components/EpubReaderModal';
import { calculateEstimatedTime } from '../lib/utils';
import { API_BASE_URL } from '../lib/api';

const GRADIENTS = [
  'bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500',
  'bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600',
  'bg-gradient-to-br from-rose-400 via-fuchsia-500 to-indigo-500',
  'bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600',
  'bg-gradient-to-br from-amber-400 via-orange-500 to-rose-500',
];

export default function LibraryPage() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [readingEpubUrl, setReadingEpubUrl] = useState<string | null>(null);
  const [readingTitle, setReadingTitle] = useState<string>('');
  const navigate = useNavigate();

  const filteredBooks = catalogData.books.filter((b: any) =>
    b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (b.author && b.author.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleReadBook = (book: any, e: React.MouseEvent) => {
    e.stopPropagation();
    // Use our backend proxy to avoid Gutenberg blocking the JS fetch and public CORS proxies failing
    const url = `${API_BASE_URL}/document/proxy/epub?url=${encodeURIComponent('https://www.gutenberg.org/ebooks/' + book.gutenberg_id + '.epub.images')}`;
    setReadingEpubUrl(url);
    setReadingTitle(book.title);
  };

  return (
    <div className="pb-12">
      <div className="relative mb-10 overflow-hidden rounded-3xl bg-black text-white p-8 sm:p-12 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-extrabold tracking-tight mb-4">{t('library.title')}</h1>
            <p className="text-gray-400 text-lg leading-relaxed">
              {t('library.subtitle')}
            </p>
          </div>
          <div className="w-full md:w-80 relative">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-500" />
            </div>
            <input
              type="text"
              className="w-full bg-white/10 border border-white/20 text-white placeholder-gray-400 rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-white/50 backdrop-blur-md transition-all"
              placeholder={t('library.search_placeholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="absolute -top-24 -right-24 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          {t('library.available_books')} <span className="px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-600 text-sm">{filteredBooks.length}</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
        {filteredBooks.map((book: any) => {
          const bgGradient = GRADIENTS[book.gutenberg_id % GRADIENTS.length];
          return (
            <div
              key={book.gutenberg_id}
              className="group bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col"
            >
              <div className={`h-48 ${bgGradient} relative flex items-center justify-center p-6 overflow-hidden`}>
                {/* On touch devices (no real hover) these stay visible; on sm+
                    pointer devices they reveal on hover, matching the original
                    "hover to reveal" desktop interaction. */}
                <div className="absolute inset-0 bg-black/20 sm:bg-black/0 sm:group-hover:bg-black/40 transition-colors duration-300 z-10 flex flex-col items-center justify-center gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100">
                  <button
                    onClick={() => navigate('/process', { state: { prefillBookId: String(book.gutenberg_id) } })}
                    className="flex items-center gap-2 bg-white text-black px-5 py-2.5 rounded-full font-semibold sm:transform sm:translate-y-4 sm:group-hover:translate-y-0 transition-all duration-300"
                  >
                    <Wand2 size={16} /> {t('library.process_book')}
                  </button>
                  <button
                    onClick={(e) => handleReadBook(book, e)}
                    className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-full font-semibold sm:transform sm:translate-y-4 sm:group-hover:translate-y-0 transition-all duration-300 sm:delay-75 border border-white/20"
                  >
                    <BookUp size={16} /> {t('library.read_book')}
                  </button>
                </div>

                <div className="w-24 h-36 bg-white rounded shadow-2xl transform rotate-3 group-hover:rotate-0 transition-transform duration-500 flex flex-col">
                  <div className="h-1 bg-red-500 w-full rounded-t opacity-50"></div>
                  <div className="flex-1 p-2 flex flex-col justify-center">
                    <p className="text-[8px] font-bold text-gray-900 text-center leading-tight line-clamp-3">{book.title}</p>
                    <p className="text-[6px] text-gray-500 text-center mt-1 uppercase tracking-wider line-clamp-1">{book.author}</p>
                  </div>
                </div>

                <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '16px 16px' }}></div>
              </div>

              <div className="p-5 flex-1 flex flex-col">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-bold text-gray-900 line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">{book.title}</h3>
                </div>
                <p className="text-sm text-gray-500 line-clamp-1">{book.author || t('library.unknown_author')}</p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {book.subjects?.slice(0, 2).map((sub: string, i: number) => (
                    <span key={i} className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-gray-50 text-gray-500 border border-gray-200 line-clamp-1 max-w-full">
                      {sub.split('--')[0].trim()}
                    </span>
                  ))}
                </div>

                <div className="mt-3 flex items-center gap-1.5 text-xs text-gray-400 font-medium bg-gray-50/50 w-fit px-2 py-1 rounded border border-gray-100">
                  <Clock size={12} />
                  {t('library.est_process_prefix')} {calculateEstimatedTime(book.page_count || 200)}
                </div>

                <div className="mt-auto pt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <div className="w-7 h-7 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center cursor-pointer hover:bg-blue-100 transition-colors" title={t('library.read_epub_title')} onClick={(e) => handleReadBook(book, e)}>
                        <BookOpen size={12} />
                      </div>
                      <div className="w-7 h-7 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center" title={t('library.audio_generation_title')}>
                        <Play size={12} fill="currentColor" />
                      </div>
                      <div className="w-7 h-7 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center" title={t('library.interactive_mindmap_title')}>
                        <Map size={12} />
                      </div>
                    </div>
                    <button
                      onClick={() => navigate('/process', { state: { prefillBookId: String(book.gutenberg_id) } })}
                      className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center hover:scale-110 transition-transform shadow-md hover:shadow-lg"
                    >
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {readingEpubUrl && (
        <EpubReaderModal
          url={readingEpubUrl}
          title={readingTitle}
          onClose={() => setReadingEpubUrl(null)}
        />
      )}
    </div>
  );
}
