import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Upload, Book, Video, Wand2, FileText, LayoutDashboard, Loader2, Clock } from 'lucide-react';
import { pipelineApi } from '../lib/api';
import { calculateEstimatedTime } from '../lib/utils';
import ProgressTracker from '../components/ui/ProgressTracker';
import catalogData from '../data/rank_101_200.json';

export default function ProcessingPage() {
  const { t } = useTranslation();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<'upload' | 'library' | 'youtube'>('upload');

  // Pipeline Options
  const [options, setOptions] = useState({
    audio_full: true,
    translate_ar: true,
    mindmap: true,
    epub: true,
  });

  // Inputs
  const [file, setFile] = useState<File | null>(null);
  const [selectedBookId, setSelectedBookId] = useState<string>('86'); // Example mock ID

  useEffect(() => {
    if (location.state?.prefillBookId) {
      setActiveTab('library');
      setSelectedBookId(location.state.prefillBookId);
    }
  }, [location.state]);
  const [youtubeUrl, setYoutubeUrl] = useState<string>('');

  // State
  const [isStarting, setIsStarting] = useState(false);
  const [jobId, setJobId] = useState<string | null>(null);

  const getSelectedSteps = () => {
    const steps = ['summarize'];
    if (options.audio_full) steps.push('audio_full');
    if (options.translate_ar) steps.push('translate');
    if (options.mindmap) steps.push('mindmap');
    if (options.epub) steps.push('inject_epub');
    return steps;
  };

  const getEstimatedTime = () => {
    const steps = getSelectedSteps();
    if (activeTab === 'library') {
      const selectedBook = catalogData.books.find((b: any) => b.gutenberg_id.toString() === selectedBookId);
      const pages = selectedBook?.page_count || 200;
      return calculateEstimatedTime(pages, steps);
    } else if (activeTab === 'upload') {
      const pages = file ? Math.max(1, Math.round(file.size / 1024 / 2)) : 50;
      return calculateEstimatedTime(pages, steps);
    } else if (activeTab === 'youtube') {
      return calculateEstimatedTime(30, steps);
    }
    return t('processing.default_estimate');
  };

  const handleStart = async () => {
    setIsStarting(true);
    setJobId(null);
    try {
      const steps = getSelectedSteps();
      let res;

      if (activeTab === 'upload') {
        if (!file) return alert(t('processing.alert_select_file'));
        res = await pipelineApi.uploadDocument(file, steps);
      } else if (activeTab === 'library') {
        res = await pipelineApi.startLibraryJob(selectedBookId, steps);
      } else if (activeTab === 'youtube') {
        if (!youtubeUrl) return alert(t('processing.alert_enter_youtube'));
        res = await pipelineApi.processYouTube(youtubeUrl, steps);
      }

      if (res && res.job_id) {
        setJobId(res.job_id);
      }
    } catch (err: any) {
      alert(t('processing.error_starting') + (err.response?.data?.detail || err.message));
    } finally {
      setIsStarting(false);
    }
  };

  const tabs = [
    { id: 'upload', label: t('processing.tab_upload'), icon: Upload },
    { id: 'library', label: t('processing.tab_library'), icon: Book },
    { id: 'youtube', label: t('processing.tab_youtube'), icon: Video },
  ] as const;

  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{t('processing.title')}</h1>
        <p className="text-gray-500 mt-1">{t('processing.subtitle')}</p>
      </div>

      {jobId ? (
        <ProgressTracker jobId={jobId} onComplete={() => {}} />
      ) : (
        <>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-gray-100">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-medium transition-colors ${
                      isActive
                        ? 'text-black border-b-2 border-black bg-gray-50/50'
                        : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <Icon size={18} />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Content */}
            <div className="p-8">
              {activeTab === 'upload' && (
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-12 flex flex-col items-center justify-center text-center hover:bg-gray-50 hover:border-gray-300 transition-colors">
                  <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-4">
                    <FileText size={32} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{t('processing.upload_title')}</h3>
                  <p className="text-sm text-gray-500 mb-6">{t('processing.upload_desc')}</p>
                  <label className="bg-black text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors cursor-pointer">
                    {t('processing.browse_files')}
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => e.target.files && setFile(e.target.files[0])}
                    />
                  </label>
                  {file && <p className="mt-4 text-sm font-medium text-emerald-600">{file.name}</p>}
                </div>
              )}

              {activeTab === 'library' && (
                <div className="space-y-4">
                  <p className="text-sm text-gray-600 mb-4">{t('processing.library_desc')}</p>
                    <div className="grid grid-cols-2 gap-4 max-h-96 overflow-y-auto pr-2">
                      {catalogData.books.map((book: any) => {
                        const bookIdStr = book.gutenberg_id.toString();
                        return (
                          <div
                            key={bookIdStr}
                            onClick={() => setSelectedBookId(bookIdStr)}
                            className={`border rounded-xl p-4 flex gap-4 cursor-pointer transition-colors ${selectedBookId === bookIdStr ? 'border-black bg-gray-50' : 'border-gray-100 hover:border-gray-300'}`}
                          >
                            <div className="w-16 h-24 bg-gray-200 rounded-md flex-shrink-0"></div>
                            <div>
                              <h4 className="font-bold text-gray-900 text-sm line-clamp-2" title={book.title}>{book.title}</h4>
                              <p className="text-xs text-gray-500 mt-1 line-clamp-1">{book.author}</p>
                              <p className="text-xs text-gray-400 mt-1">{t('processing.id_label')}: {bookIdStr}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                </div>
              )}

              {activeTab === 'youtube' && (
                <div className="space-y-4">
                  <p className="text-sm text-gray-600 mb-4">{t('processing.youtube_desc')}</p>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('processing.youtube_url_label')}</label>
                    <input
                      type="url"
                      value={youtubeUrl}
                      onChange={(e) => setYoutubeUrl(e.target.value)}
                      placeholder="https://youtube.com/watch?v=..."
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Configuration Options */}
          <div className="mt-8 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <LayoutDashboard size={18} />
              {t('processing.options_title')}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="flex items-center gap-3 p-4 border border-gray-100 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="checkbox"
                  checked={options.audio_full}
                  onChange={(e) => setOptions({...options, audio_full: e.target.checked})}
                  className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black"
                />
                <div className="text-sm">
                  <p className="font-medium text-gray-900">{t('processing.opt_audio_title')}</p>
                  <p className="text-gray-500 text-xs">{t('processing.opt_audio_desc')}</p>
                </div>
              </label>
              <label className="flex items-center gap-3 p-4 border border-gray-100 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="checkbox"
                  checked={options.translate_ar}
                  onChange={(e) => setOptions({...options, translate_ar: e.target.checked})}
                  className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black"
                />
                <div className="text-sm">
                  <p className="font-medium text-gray-900">{t('processing.opt_translate_title')}</p>
                  <p className="text-gray-500 text-xs">{t('processing.opt_translate_desc')}</p>
                </div>
              </label>
              <label className="flex items-center gap-3 p-4 border border-gray-100 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="checkbox"
                  checked={options.mindmap}
                  onChange={(e) => setOptions({...options, mindmap: e.target.checked})}
                  className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black"
                />
                <div className="text-sm">
                  <p className="font-medium text-gray-900">{t('processing.opt_mindmap_title')}</p>
                  <p className="text-gray-500 text-xs">{t('processing.opt_mindmap_desc')}</p>
                </div>
              </label>
              <label className="flex items-center gap-3 p-4 border border-gray-100 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="checkbox"
                  checked={options.epub}
                  onChange={(e) => setOptions({...options, epub: e.target.checked})}
                  className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black"
                />
                <div className="text-sm">
                  <p className="font-medium text-gray-900">{t('processing.opt_epub_title')}</p>
                  <p className="text-gray-500 text-xs">{t('processing.opt_epub_desc')}</p>
                </div>
              </label>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row sm:items-center justify-between bg-gray-50 p-6 rounded-2xl border border-gray-100 gap-4">
              <div className="flex items-center gap-3">
                <div className="bg-white p-2 rounded-xl shadow-sm border border-gray-200 text-gray-500">
                  <Clock size={20} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">{t('processing.estimated_time')}</p>
                  <p className="text-gray-900 font-bold text-lg">{getEstimatedTime()}</p>
                </div>
              </div>
              <button
                onClick={handleStart}
                disabled={isStarting}
                className="flex items-center justify-center gap-2 bg-black text-white px-8 py-3 rounded-full font-bold hover:bg-gray-800 transition-colors shadow-lg disabled:opacity-50 w-full sm:w-auto"
              >
                {isStarting ? <Loader2 className="animate-spin" size={18} /> : <Wand2 size={18} />}
                {isStarting ? t('processing.starting') : t('processing.start_pipeline')}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
