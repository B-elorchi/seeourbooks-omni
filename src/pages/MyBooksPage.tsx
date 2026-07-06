import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { pipelineApi } from '../lib/api';
import { Book, Play, Video, Wand2, Loader2, Map, Clock } from 'lucide-react';
import EpubReaderModal from '../components/EpubReaderModal';
import { useNavigate } from 'react-router-dom';
import catalogDataRaw from '../data/rank_101_200.json';
import { calculateEstimatedTimeMs } from '../lib/utils';

export default function MyBooksPage() {
  const { t } = useTranslation();
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'youtube' | 'upload' | 'catalog'>('all');
  const [readingEpubUrl, setReadingEpubUrl] = useState<string | null>(null);
  const [readingTitle] = useState<string>('');
  const navigate = useNavigate();

  const filterLabels: Record<typeof filter, string> = {
    all: t('mybooks.filter_all'),
    youtube: t('mybooks.filter_youtube'),
    upload: t('mybooks.filter_upload'),
    catalog: t('mybooks.filter_catalog'),
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const data = await pipelineApi.getMyJobs();
      setJobs(data || []);
    } catch (err) {
      console.error('Failed to fetch my jobs', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = jobs.filter(job => {
    if (filter === 'all') return true;
    // Assuming we can infer source from input data or metadata
    const source = job.input?.source || 'catalog';
    return source === filter;
  });

  return (
    <div className="pb-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{t('mybooks.title')}</h1>
        <p className="text-gray-500 mt-1">{t('mybooks.subtitle')}</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-8">
        {(['all', 'youtube', 'upload', 'catalog'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              filter === f
                ? 'bg-black text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {filterLabels[f]}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
          <Wand2 className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">{t('mybooks.empty_title')}</h3>
          <p className="mt-1 text-gray-500">{t('mybooks.empty_desc')}</p>
          <button onClick={() => navigate('/process')} className="mt-6 px-6 py-2.5 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition-colors">
            {t('common.start_processing')}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredJobs.map(job => {
            const bookId = job.book_id || job.input?.book_id;
            const catalogData = catalogDataRaw as { books: any[] };
            const catalogBook = bookId ? catalogData.books.find((b: any) => String(b.gutenberg_id) === String(bookId)) : null;
            const title = job.metadata?.title || catalogBook?.title || t('mybooks.unknown_title');
            const isRunning = ['queued', 'running'].includes(job.status);

            let estTimeStr = '';
            if (isRunning && job.input?.steps) {
              const pages = job.input.pages || catalogBook?.page_count || 200;
              const estMs = calculateEstimatedTimeMs(pages, job.input.steps);
              const startTime = new Date(job.created_at);
              const endTime = new Date(startTime.getTime() + estMs);
              estTimeStr = `${startTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - ${endTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
            }

            return (
            <div key={job.id} className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center">
                    {job.input?.source === 'youtube' ? <Video className="text-red-500" size={20} /> :
                     job.input?.source === 'upload' ? <Book className="text-blue-500" size={20} /> :
                     <Wand2 className="text-purple-500" size={20} />}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 line-clamp-1" title={title}>
                      {title}
                    </h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                        job.status === 'done' ? 'bg-green-100 text-green-700' :
                        job.status === 'failed' ? 'bg-red-100 text-red-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {job.status}
                      </span>
                      {isRunning && estTimeStr && (
                        <span className="text-[10px] text-gray-500 flex items-center gap-1 font-medium bg-gray-50 px-2 py-0.5 rounded-full border border-gray-100">
                          <Clock size={10} /> {estTimeStr}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex-1 mt-4 border-t border-gray-100 pt-4">
                {/* Check for outputs */}
                <div className="flex flex-wrap gap-2">
                  {isRunning && (
                    <div className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-gray-50 text-gray-600 rounded-lg text-xs font-semibold border border-gray-200">
                      <Loader2 className="animate-spin" size={14} /> {t('common.in_progress')}
                    </div>
                  )}

                  {job.status === 'failed' && (
                    <div className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-red-50 text-red-600 rounded-lg text-xs font-semibold border border-red-100">
                       {t('common.failed')}
                    </div>
                  )}

                  {(job.status === 'done' || job.status === 'partial') && (
                    <>
                      {(!job.input?.steps || job.input.steps.length === 0 || job.input.steps.includes('summarize')) && (
                        <button className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-xs font-semibold border border-blue-100">
                          <Book size={14} /> {t('common.summary')}
                        </button>
                      )}
                      {job.input?.steps?.includes('audio_full') && (
                        <button className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors text-xs font-semibold border border-purple-100">
                          <Play size={14} fill="currentColor" /> {t('common.audio')}
                        </button>
                      )}
                      {job.input?.steps?.includes('mindmap') && (
                        <button className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors text-xs font-semibold border border-green-100">
                          <Map size={14} /> {t('common.mindmap')}
                        </button>
                      )}
                      {job.input?.steps?.includes('inject_epub') && (
                        <button className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100 transition-colors text-xs font-semibold border border-orange-100">
                          <Book size={14} /> {t('common.epub')}
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          )})}
        </div>
      )}

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
