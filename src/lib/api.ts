import axios from 'axios';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8080/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

// Attach the CURRENT WordPress access token to every request.
apiClient.interceptors.request.use(async (config) => {
  const token = localStorage.getItem('wp_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Pipeline result / job types ───────────────────────────────────────────────
// These mirror the actual FastAPI response shapes (api/models + orchestrator.py
// on the backend) — NOT a guess. Asset URLs (audio/epub/mindmap/summaries) only
// live under `result`, keyed by variant (e.g. "full_en", "enriched_ar").

export type StepStatus = 'done' | 'failed' | 'partial' | 'skipped' | 'running' | 'pending';

export interface SummaryAsset {
  text:       string;
  word_count: number;
  style:      string;
  language:   string;
}

export interface AudioAsset {
  url:       string;
  duration?: string;
  size_mb?:  number;
}

export interface MindmapAsset {
  url:  string;
  data?: unknown;
}

export interface PipelineResult {
  book_id?:         string;
  status?:          'done' | 'partial' | 'failed' | 'running';
  current_step?:    string | null;
  running_steps?:   string[];
  steps?:           Record<string, StepStatus>;
  metadata?: {
    title?:      string;
    author?:     string;
    cover_url?:  string;
    [key: string]: unknown;
  };
  summaries?: Record<string, SummaryAsset>;   // e.g. "10min_en"
  audio?:     Record<string, AudioAsset>;      // e.g. "full_en", "full_ar"
  mindmap?:    MindmapAsset;
  mindmap_en?: MindmapAsset;
  mindmap_ar?: MindmapAsset;
  epub?:      Record<string, { url: string }> | null;  // e.g. "enriched_en"
  errors?:    Record<string, string>;
}

export interface PipelineJob {
  id:          string;
  book_id:     string;
  status:      'queued' | 'running' | 'done' | 'partial' | 'failed' | 'cancelled';
  input?:      { source?: string; language?: string; steps?: string[]; pages?: number; [key: string]: unknown };
  result?:     PipelineResult | string | null;  // may arrive as a JSON string on legacy rows
  metadata?:   Record<string, unknown>;         // lean field returned by the /my-jobs list endpoint
  error_msg?:  string | null;
  created_at?: string;
}

/** Parse a job's `result` field, which the backend may return as a JSON string. */
export function parseJobResult(job: PipelineJob | null | undefined): PipelineResult | null {
  if (!job?.result) return null;
  if (typeof job.result === 'string') {
    try { return JSON.parse(job.result) as PipelineResult; } catch { return null; }
  }
  return job.result;
}

/** Pick the best-matching asset variant for a language, e.g. audio["full_ar"] then audio["full_en"]. */
function pickByLanguage<T>(map: Record<string, T> | undefined | null, prefix: string, language?: string): T | null {
  if (!map) return null;
  const lang = language === 'ar' ? 'ar' : 'en';
  return map[`${prefix}_${lang}`] ?? map[`${prefix}_en`] ?? map[`${prefix}_ar`] ?? Object.values(map)[0] ?? null;
}

export function pickSummary(result: PipelineResult | null, language?: string): SummaryAsset | null {
  if (!result?.summaries) return null;
  const lang = language === 'ar' ? 'ar' : 'en';
  const match = Object.entries(result.summaries).find(([k]) => k.endsWith(`_${lang}`));
  return match?.[1] ?? Object.values(result.summaries)[0] ?? null;
}

export function pickAudio(result: PipelineResult | null, language?: string): AudioAsset | null {
  return pickByLanguage(result?.audio, 'full', language);
}

export function pickMindmap(result: PipelineResult | null, language?: string): MindmapAsset | null {
  if (!result) return null;
  const lang = language === 'ar' ? 'ar' : 'en';
  return (lang === 'ar' ? result.mindmap_ar : result.mindmap_en) ?? result.mindmap ?? null;
}

export function pickEpub(result: PipelineResult | null): { url: string } | null {
  if (!result?.epub) return null;
  return Object.values(result.epub)[0] ?? null;
}

export const pipelineApi = {
  startLibraryJob: async (bookId: string, steps: string[]) => {
    const res = await apiClient.post('/v2/pipeline/run', {
      book_id: bookId,
      language: 'en',
      steps: steps,
      force: true,
    });
    return res.data;
  },

  uploadDocument: async (file: File, steps: string[]) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('language', 'en');
    formData.append('steps', steps.join(','));

    const res = await apiClient.post('/document/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  processYouTube: async (url: string, steps: string[]) => {
    const res = await apiClient.post('/document/youtube', {
      url,
      language: 'en',
      steps: steps.join(','),
    });
    return res.data;
  },

  getMyJobs: async (): Promise<PipelineJob[]> => {
    const res = await apiClient.get('/v2/pipeline/my-jobs');
    return res.data;
  },

  getJobStatus: async (jobId: string): Promise<PipelineJob> => {
    const res = await apiClient.get(`/pipeline/status/${jobId}`);
    return res.data;
  }
};
