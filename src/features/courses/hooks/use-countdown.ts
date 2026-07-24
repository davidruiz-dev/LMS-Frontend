import { useEffect, useState } from 'react';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  overdue: boolean;
}

function calculate(dueDate: string | Date | undefined): TimeLeft {
  if (!dueDate) return { days: 0, hours: 0, minutes: 0, overdue: false };

  const difference = new Date(dueDate).getTime() - Date.now();

  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, overdue: true };
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
    overdue: false,
  };
}

export function useCountdown(dueDate: string | Date | undefined): TimeLeft {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => calculate(dueDate));

  useEffect(() => {
    setTimeLeft(calculate(dueDate));
    const interval = setInterval(() => setTimeLeft(calculate(dueDate)), 60_000);
    return () => clearInterval(interval);
  }, [dueDate]);

  return timeLeft;
}