import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8080/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

// Interceptor to attach Supabase JWT token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('omni_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface JobStatus {
  job_id: string;
  status: 'queued' | 'running' | 'done' | 'failed' | 'partial' | 'cancelled';
  steps: string[];
  current_step: string;
  progress: number;
  output?: Record<string, any>;
  error?: string;
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

  getMyJobs: async () => {
    const res = await apiClient.get('/v2/pipeline/my-jobs');
    return res.data;
  },

  getJobStatus: async (jobId: string): Promise<JobStatus> => {
    const res = await apiClient.get(`/pipeline/status/${jobId}`);
    return res.data;
  }
};
