import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { pipelineApi, type JobStatus } from '../../lib/api';
import { CheckCircle2, Circle, Loader2, XCircle } from 'lucide-react';

interface ProgressTrackerProps {
  jobId: string;
  onComplete?: (status: JobStatus) => void;
}

export default function ProgressTracker({ jobId, onComplete }: ProgressTrackerProps) {
  const { t } = useTranslation();
  const [status, setStatus] = useState<JobStatus | null>(null);

  useEffect(() => {
    if (!jobId) return;

    let intervalId: ReturnType<typeof setInterval>;

    const pollStatus = async () => {
      try {
        const data = await pipelineApi.getJobStatus(jobId);
        setStatus(data);

        if (['done', 'failed', 'partial', 'cancelled'].includes(data.status)) {
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

  if (!status) {
    return <div className="flex items-center gap-2 text-gray-500"><Loader2 className="animate-spin" size={18} /> {t('progress.initializing')}</div>;
  }

  const isTerminal = ['done', 'failed', 'partial', 'cancelled'].includes(status.status);
  const totalSteps = status.steps?.length || 1;
  const currentStepIdx = status.steps?.indexOf(status.current_step) ?? 0;
  
  // Calculate aggregate progress (roughly based on steps)
  let percentage = 0;
  if (status.status === 'done') percentage = 100;
  else if (status.status === 'running' && totalSteps > 0) {
      const baseProgress = (currentStepIdx / totalSteps) * 100;
      const stepProgress = (status.progress || 0) / totalSteps;
      percentage = Math.min(baseProgress + stepProgress, 99);
  }

  return (
    <div className="bg-gray-50 border border-gray-200 p-6 rounded-2xl w-full">
      <div className="flex justify-between items-end mb-4">
        <div>
          <h3 className="font-bold text-gray-900">{t('progress.title')}</h3>
          <p className="text-sm text-gray-500 capitalize">{status.status} • {status.current_step || t('progress.starting_step')}</p>
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
        {status.steps?.map((step, idx) => {
          let StepIcon = Circle;
          let color = "text-gray-300";
          let labelColor = "text-gray-400";
          
          if (status.status === 'done' || idx < currentStepIdx) {
            StepIcon = CheckCircle2;
            color = "text-emerald-500";
            labelColor = "text-gray-900 font-medium";
          } else if (idx === currentStepIdx && status.status === 'running') {
            StepIcon = Loader2;
            color = "text-black animate-spin";
            labelColor = "text-black font-bold";
          } else if (status.status === 'failed' && idx === currentStepIdx) {
            StepIcon = XCircle;
            color = "text-red-500";
            labelColor = "text-red-600 font-medium";
          }

          return (
            <div key={step} className="flex items-center gap-3">
              <StepIcon size={18} className={color} />
              <span className={`text-sm ${labelColor} capitalize`}>{step.replace('_', ' ')}</span>
            </div>
          );
        })}
      </div>

      {isTerminal && (
        <div className={`mt-6 p-4 rounded-xl text-sm font-medium ${status.status === 'done' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
          {status.status === 'done' ? t('progress.completed') : `${t('progress.ended_with_status')} ${status.status}. ${status.error || ''}`}
        </div>
      )}
    </div>
  );
}
