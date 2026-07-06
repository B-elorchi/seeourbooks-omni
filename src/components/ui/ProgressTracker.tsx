import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { pipelineApi, parseJobResult, type PipelineJob, type StepStatus } from '../../lib/api';
import { CheckCircle2, Circle, Loader2, XCircle } from 'lucide-react';

interface ProgressTrackerProps {
  jobId: string;
  onComplete?: (job: PipelineJob) => void;
}

const TERMINAL = ['done', 'failed', 'partial', 'cancelled'];

export default function ProgressTracker({ jobId, onComplete }: ProgressTrackerProps) {
  const { t } = useTranslation();
  const [job, setJob] = useState<PipelineJob | null>(null);

  useEffect(() => {
    if (!jobId) return;

    let intervalId: ReturnType<typeof setInterval>;

    const pollStatus = async () => {
      try {
        const data = await pipelineApi.getJobStatus(jobId);
        setJob(data);

        if (TERMINAL.includes(data.status)) {
          clearInterval(intervalId);
          onComplete?.(data);
        }
      } catch (err) {
        console.error("Error polling status:", err);
      }
    };

    pollStatus();
    intervalId = setInterval(pollStatus, 3000);

    return () => clearInterval(intervalId);
  }, [jobId, onComplete]);

  if (!job) {
    return <div className="flex items-center gap-2 text-gray-500"><Loader2 className="animate-spin" size={18} /> {t('progress.initializing')}</div>;
  }

  const result = parseJobResult(job);
  const stepsMap = result?.steps || {};
  const stepNames = Object.keys(stepsMap);
  const isTerminal = TERMINAL.includes(job.status);

  const doneCount = stepNames.filter(s => stepsMap[s] === 'done' || stepsMap[s] === 'skipped').length;
  const percentage = job.status === 'done'
    ? 100
    : stepNames.length > 0
      ? Math.min(Math.round((doneCount / stepNames.length) * 100), 99)
      : 0;

  const currentStep = result?.current_step;

  const iconFor = (stepStatus: StepStatus | undefined) => {
    if (stepStatus === 'done' || stepStatus === 'skipped') return { Icon: CheckCircle2, color: 'text-emerald-500', labelColor: 'text-gray-900 font-medium' };
    if (stepStatus === 'running') return { Icon: Loader2, color: 'text-black animate-spin', labelColor: 'text-black font-bold' };
    if (stepStatus === 'failed') return { Icon: XCircle, color: 'text-red-500', labelColor: 'text-red-600 font-medium' };
    return { Icon: Circle, color: 'text-gray-300', labelColor: 'text-gray-400' };
  };

  return (
    <div className="bg-gray-50 border border-gray-200 p-6 rounded-2xl w-full">
      <div className="flex justify-between items-end mb-4">
        <div>
          <h3 className="font-bold text-gray-900">{t('progress.title')}</h3>
          <p className="text-sm text-gray-500 capitalize">{job.status} • {currentStep || t('progress.starting_step')}</p>
        </div>
        <span className="text-2xl font-black text-black">{Math.round(percentage)}%</span>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-3 mb-6 overflow-hidden">
        <div
          className="bg-black h-3 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>

      <div className="space-y-3">
        {stepNames.map((step) => {
          const { Icon, color, labelColor } = iconFor(stepsMap[step]);
          return (
            <div key={step} className="flex items-center gap-3">
              <Icon size={18} className={color} />
              <span className={`text-sm ${labelColor} capitalize`}>{step.replace(/_/g, ' ')}</span>
            </div>
          );
        })}
      </div>

      {isTerminal && (
        <div className={`mt-6 p-4 rounded-xl text-sm font-medium ${job.status === 'done' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
          {job.status === 'done' ? t('progress.completed') : `${t('progress.ended_with_status')} ${job.status}. ${job.error_msg || ''}`}
        </div>
      )}
    </div>
  );
}
