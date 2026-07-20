import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  pipelineApi, parseJobResult, pickAudio, pickMindmap, pickEpub,
  type PipelineJob, type PipelineResult,
} from '../lib/api';
import { Book, Play, Video, Wand2, Loader2, Map, Clock, X } from 'lucide-react';
import EpubReaderModal from '../components/EpubReaderModal';
import { useNavigate } from 'react-router-dom';
import catalogDataRaw from '../data/rank_101_200.json';
import { calculateEstimatedTimeMs } from '../lib/utils';

export default function MyBooksPage() {
  const { t } = useTranslation();
  const [jobs, setJobs] = useState<PipelineJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'youtube' | 'upload' | 'catalog'>('all');
  const [readingEpubUrl, setReadingEpubUrl] = useState<string | null>(null);
  const [readingTitle, setReadingTitle] = useState<string>('');
  const [summaryModal, setSummaryModal] = useState<{ title: string; summaries: { lang: string; text: string }[]; activeLang: string; } | null>(null);
  const [playingAudio, setPlayingAudio] = useState<{ jobId: string; url: string } | null>(null);
  // Cache full job details (with asset URLs) fetched on-demand per card,
  // since /my-jobs only returns lean metadata (no audio/epub/mindmap URLs).
  const [detailCache, setDetailCache] = useState<Record<string, PipelineResult | null>>({});
  const [loadingAction, setLoadingAction] = useState<string | null>(null); // `${jobId}:${action}`
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
    const source = job.input?.source || 'catalog';
    return source === filter;
  });

  /** Fetch (and cache) the full job result, which carries the actual asset URLs. */
  async function resolveResult(job: PipelineJob): Promise<PipelineResult | null> {
    if (job.id in detailCache) return detailCache[job.id];
    const full = await pipelineApi.getJobStatus(job.id);
    const result = parseJobResult(full);
    setDetailCache(prev => ({ ...prev, [job.id]: result }));
    return result;
  }

  async function handleSummary(job: PipelineJob, title: string) {
    const key = `${job.id}:summary`;
    setLoadingAction(key);
    try {
      const result = await resolveResult(job);
      if (result?.summaries && Object.keys(result.summaries).length > 0) {
        const summariesList = Object.entries(result.summaries).map(([k, v]) => {
           const lang = k.endsWith('_ar') ? 'ar' : 'en';
           return { lang, text: v.text };
        });
        const prefLang = job.input?.language === 'ar' ? 'ar' : 'en';
        const initLang = summariesList.find(s => s.lang === prefLang)?.lang || summariesList[0].lang;
        setSummaryModal({ title, summaries: summariesList, activeLang: initLang });
      } else {
        alert(t('mybooks.asset_unavailable'));
      }
    } catch (err) {
      console.error('Failed to load summary', err);
      alert(t('mybooks.asset_unavailable'));
    } finally {
      setLoadingAction(null);
    }
  }

  async function handleAudio(job: PipelineJob) {
    const key = `${job.id}:audio`;
    if (playingAudio?.jobId === job.id) {
      setPlayingAudio(null);
      return;
    }
    setLoadingAction(key);
    try {
      const result = await resolveResult(job);
      const audio = pickAudio(result, job.input?.language);
      if (audio?.url) {
        setPlayingAudio({ jobId: job.id, url: audio.url });
      } else {
        alert(t('mybooks.asset_unavailable'));
      }
    } catch (err) {
      console.error('Failed to load audio', err);
      alert(t('mybooks.asset_unavailable'));
    } finally {
      setLoadingAction(null);
    }
  }

  async function handleMindmap(job: PipelineJob) {
    const key = `${job.id}:mindmap`;
    setLoadingAction(key);
    try {
      const result = await resolveResult(job);
      const mindmap = pickMindmap(result, job.input?.language);
      if (mindmap?.url) {
        window.open(mindmap.url, '_blank', 'noopener,noreferrer');
      } else {
        alert(t('mybooks.asset_unavailable'));
      }
    } catch (err) {
      console.error('Failed to load mindmap', err);
      alert(t('mybooks.asset_unavailable'));
    } finally {
      setLoadingAction(null);
    }
  }

  async function handleEpub(job: PipelineJob, title: string) {
    const key = `${job.id}:epub`;
    setLoadingAction(key);
    try {
      const result = await resolveResult(job);
      const epub = pickEpub(result);
      if (epub?.url) {
        setReadingTitle(title);
        setReadingEpubUrl(epub.url);
      } else {
        alert(t('mybooks.asset_unavailable'));
      }
    } catch (err) {
      console.error('Failed to load EPUB', err);
      alert(t('mybooks.asset_unavailable'));
    } finally {
      setLoadingAction(null);
    }
  }

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
            const title = (job.metadata?.title as string) || catalogBook?.title || t('mybooks.unknown_title');
            const isRunning = ['queued', 'running'].includes(job.status);

            let estTimeStr = '';
            if (isRunning && job.input?.steps) {
              const pages = job.input.pages || catalogBook?.page_count || 200;
              const estMs = calculateEstimatedTimeMs(pages, job.input.steps);
              const startTime = new Date(job.created_at || Date.now());
              const endTime = new Date(startTime.getTime() + estMs);
              estTimeStr = `${startTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - ${endTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
            }

            const isPlaying = playingAudio?.jobId === job.id;

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
                        <button
                          onClick={() => handleSummary(job, title)}
                          disabled={loadingAction === `${job.id}:summary`}
                          className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-xs font-semibold border border-blue-100 disabled:opacity-50"
                        >
                          {loadingAction === `${job.id}:summary` ? <Loader2 className="animate-spin" size={14} /> : <Book size={14} />} {t('common.summary')}
                        </button>
                      )}
                      {job.input?.steps?.includes('audio_full') && (
                        <button
                          onClick={() => handleAudio(job)}
                          disabled={loadingAction === `${job.id}:audio`}
                          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg transition-colors text-xs font-semibold border disabled:opacity-50 ${isPlaying ? 'bg-purple-600 text-white border-purple-600' : 'bg-purple-50 text-purple-600 hover:bg-purple-100 border-purple-100'}`}
                        >
                          {loadingAction === `${job.id}:audio` ? <Loader2 className="animate-spin" size={14} /> : <Play size={14} fill="currentColor" />} {t('common.audio')}
                        </button>
                      )}
                      {job.input?.steps?.includes('mindmap') && (
                        <button
                          onClick={() => handleMindmap(job)}
                          disabled={loadingAction === `${job.id}:mindmap`}
                          className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors text-xs font-semibold border border-green-100 disabled:opacity-50"
                        >
                          {loadingAction === `${job.id}:mindmap` ? <Loader2 className="animate-spin" size={14} /> : <Map size={14} />} {t('common.mindmap')}
                        </button>
                      )}
                      {job.input?.steps?.includes('inject_epub') && (
                        <button
                          onClick={() => handleEpub(job, title)}
                          disabled={loadingAction === `${job.id}:epub`}
                          className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100 transition-colors text-xs font-semibold border border-orange-100 disabled:opacity-50"
                        >
                          {loadingAction === `${job.id}:epub` ? <Loader2 className="animate-spin" size={14} /> : <Book size={14} />} {t('common.epub')}
                        </button>
                      )}
                    </>
                  )}
                </div>

                {isPlaying && playingAudio && (
                  <audio
                    className="w-full mt-3"
                    src={playingAudio.url}
                    controls
                    autoPlay
                    onEnded={() => setPlayingAudio(null)}
                  />
                )}
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

      {summaryModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] flex flex-col shadow-xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
              <h3 className="font-bold text-gray-900 truncate">{summaryModal.title}</h3>
              <button onClick={() => setSummaryModal(null)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-900 transition-colors">
                <X size={18} />
              </button>
            </div>
            {summaryModal.summaries.length > 1 && (
              <div className="px-6 pt-4 flex gap-4 border-b border-gray-100 shrink-0">
                {summaryModal.summaries.map(s => (
                  <button
                    key={s.lang}
                    onClick={() => setSummaryModal(prev => prev ? { ...prev, activeLang: s.lang } : null)}
                    className={`pb-3 px-1 text-sm font-semibold border-b-2 transition-colors ${
                      summaryModal.activeLang === s.lang 
                        ? 'border-black text-black' 
                        : 'border-transparent text-gray-400 hover:text-gray-700'
                    }`}
                  >
                    {s.lang === 'en' ? 'English' : s.lang === 'ar' ? 'العربية' : s.lang}
                  </button>
                ))}
              </div>
            )}
            <div 
              className="px-6 py-4 overflow-y-auto text-sm text-gray-700 leading-relaxed whitespace-pre-wrap"
              dir={summaryModal.activeLang === 'ar' ? 'rtl' : 'ltr'}
            >
              {summaryModal.summaries.find(s => s.lang === summaryModal.activeLang)?.text}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
