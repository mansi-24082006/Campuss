import React, { useState, useEffect } from "react";
import { Clock } from "lucide-react";

const CountdownTimer = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isLive: false,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = new Date(targetDate).getTime() - now;

      if (distance < 0) {
        setTimeLeft({ ...timeLeft, isLive: true });
        clearInterval(timer);
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
        isLive: false,
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (timeLeft.isLive) {
    return (
      <div className="flex items-center gap-1.5 text-rose-600 font-black animate-pulse text-[10px] uppercase">
        <span className="w-2 h-2 rounded-full bg-rose-600" />
        Live Now
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800">
      <Clock size={12} className="text-indigo-500" />
      <div className="flex gap-1.5 font-black text-slate-800 dark:text-white text-[10px] uppercase tracking-tighter">
         {timeLeft.days > 0 && <span>{timeLeft.days}d</span>}
         <span>{timeLeft.hours}h</span>
         <span>{timeLeft.minutes}m</span>
         <span>{timeLeft.seconds}s</span>
         <span className="text-slate-400 font-bold ml-1">Left</span>
      </div>
    </div>
  );
};

export default CountdownTimer;
