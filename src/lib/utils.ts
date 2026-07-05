import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function calculateEstimatedTimeMs(pageCount: number, steps: string[] = ['summarize', 'audio_full', 'translate', 'mindmap', 'epub']): number {
  const timeMap: Record<string, number> = {
    summarize: 0.5,
    audio_full: 1.5,
    translate: 0.8,
    mindmap: 0.2,
    epub: 0.1
  };
  
  let totalSeconds = 0;
  for (const step of steps) {
    if (timeMap[step]) {
      totalSeconds += timeMap[step] * pageCount;
    }
  }
  
  totalSeconds += 10;
  return totalSeconds * 1000;
}

export function calculateEstimatedTime(pageCount: number, steps: string[] = ['summarize', 'audio_full', 'translate', 'mindmap', 'epub']): string {
  const totalSeconds = calculateEstimatedTimeMs(pageCount, steps) / 1000;
  
  if (totalSeconds < 60) {
    return "< 1 min";
  }
  
  const mins = Math.ceil(totalSeconds / 60);
  return `~${mins} min${mins > 1 ? 's' : ''}`;
}
