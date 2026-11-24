import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  Check,
  Lightbulb,
  Pause,
  Play,
  RotateCcw,
  RotateCw,
  Timer,
  Undo2,
} from 'lucide-react';
import {
  BLOCK_AFFIRMATIONS,
  PASTEL_THEMES,
  parseDurationMinutes,
  type ActivityItem,
} from '../data/activities';
import { soundEngine } from '../utils/sound';
import { ActivityIcon } from './ActivityIcon';

interface ActivityFlipCardProps {
  activity: ActivityItem;
  spinCount: number;
  isSpinning: boolean;
  isCompleted: boolean;
  onToggleComplete: () => void;
  onSpinAgain: () => void;
  onBackToWheel: () => void;
}

function formatTimer(totalSeconds: number): string {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export const ActivityFlipCard: React.FC<ActivityFlipCardProps> = ({
  activity,
  spinCount,
  isSpinning,
  isCompleted,
  onToggleComplete,
  onSpinAgain,
  onBackToWheel,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showTimer, setShowTimer] = useState(false);
  const [isEntering, setIsEntering] = useState(false);

  const defaultSeconds = parseDurationMinutes(activity.duration) * 60;
  const [secondsLeft, setSecondsLeft] = useState<number>(defaultSeconds);
  const [timerRunning, setTimerRunning] = useState<boolean>(false);
  const [timerFinished, setTimerFinished] = useState<boolean>(false);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    setIsFlipped(false);
    setShowTimer(false);
    setTimerRunning(false);
    setTimerFinished(false);
    setSecondsLeft(parseDurationMinutes(activity.duration) * 60);

    if (spinCount > 0) {
      setIsEntering(true);
      const timer = window.setTimeout(() => setIsEntering(false), 420);
      return () => window.clearTimeout(timer);
    }
  }, [spinCount, activity]);

  useEffect(() => {
    if (!timerRunning) {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          setTimerRunning(false);
          setTimerFinished(true);
          soundEngine.playCompleteChime();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [timerRunning]);

  const theme = PASTEL_THEMES[activity.colorKey];
  const playLabel =
    activity.playMode === 'solo'
      ? 'Solo'
      : activity.playMode === 'group'
        ? 'Group'
        : 'Solo · Group';

  const handleFlip = () => {
    soundEngine.playFlip();
    setIsFlipped((prev) => !prev);
  };

  const handleResetTimer = () => {
    setTimerRunning(false);
    setTimerFinished(false);
    setSecondsLeft(parseDurationMinutes(activity.duration) * 60);
  };

  const handleToggleTimerDrawer = () => {
    if (!showTimer) {
      setShowTimer(true);
      setTimerRunning(true);
    } else {
      setShowTimer(false);
      setTimerRunning(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-4">
      {/* Quiet Back-to-Wheel link */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBackToWheel}
          className="inline-flex items-center gap-1.5 min-h-[44px] px-3 -ml-3 rounded-full text-sm font-display font-bold text-slate-600 hover:text-slate-900 hover:bg-white/70 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Wheel</span>
        </button>

        {/* Secondary Actions hidden behind clean icons (Timer + Tip) */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleToggleTimerDrawer}
            aria-label={showTimer ? 'Hide play timer' : 'Start play timer'}
            title="Play Timer"
            className={`inline-flex items-center justify-center w-11 h-11 rounded-full border transition-colors cursor-pointer ${
              showTimer
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Timer className="w-5 h-5" strokeWidth={2.2} />
          </button>

          <button
            type="button"
            onClick={handleFlip}
            aria-label={isFlipped ? 'Show activity' : 'Flip for tip'}
            title="Play Tip"
            className={`inline-flex items-center justify-center w-11 h-11 rounded-full border transition-colors cursor-pointer ${
              isFlipped
                ? 'bg-amber-300 text-amber-950 border-amber-400'
                : 'bg-white text-amber-600 border-slate-200 hover:bg-amber-50'
            }`}
          >
            <Lightbulb className="w-5 h-5" strokeWidth={2.2} />
          </button>
        </div>
      </div>

      {/* Focused Picked Card */}
      <div className="relative">
        <div
          aria-hidden="true"
          style={{ backgroundColor: theme.slice }}
          className="pointer-events-none absolute -inset-3 rounded-[2.25rem] opacity-40 blur-2xl transition-colors duration-300"
        />

        <div
          className={`relative flip-perspective transition-transform duration-300 ${
            isEntering ? 'scale-[1.03]' : 'scale-100'
          }`}
        >
          <div className={`flip-card-inner ${isFlipped ? 'is-flipped' : ''}`}>
            {/* Front Face */}
            <div
              style={{ backgroundColor: theme.surface, borderColor: theme.border }}
              className="flip-card-face rounded-3xl border-2 p-6 sm:p-7 shadow-[0_14px_32px_-14px_rgba(30,41,59,0.14)] text-center flex flex-col items-center"
            >
              <div
                style={{ backgroundColor: theme.iconBg, color: theme.accentText }}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl border border-black/5 flex items-center justify-center shadow-2xs"
              >
                <ActivityIcon icon={activity.icon} className="w-8 h-8 sm:w-10 sm:h-10" />
              </div>

              <p className="mt-4 text-xs font-medium text-slate-600 tabular-nums">
                {playLabel} · {activity.duration}
              </p>

              <h2 className="mt-1.5 font-display text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight text-balance">
                {activity.title}
              </h2>

              <p className="mt-2 text-sm sm:text-base text-slate-700 leading-snug max-w-xs">
                {activity.ideas}
              </p>

              {/* Expandable Timer (Hidden behind Timer Icon until tapped) */}
              {showTimer && (
                <div className="mt-5 w-full flex items-center justify-between gap-2 rounded-2xl bg-white/85 px-4 py-2.5 border border-black/5">
                  <div className="flex items-center gap-2">
                    <span className="font-display text-lg font-bold text-slate-900 tabular-nums">
                      {formatTimer(secondsLeft)}
                    </span>
                    <span className="text-xs font-medium text-slate-500">
                      {timerFinished ? 'Done!' : timerRunning ? 'Playing' : 'Paused'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        if (timerFinished) handleResetTimer();
                        setTimerRunning((r) => !r);
                      }}
                      aria-label={timerRunning ? 'Pause timer' : 'Start timer'}
                      className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-slate-900 text-white hover:bg-slate-800 cursor-pointer"
                    >
                      {timerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </button>
                    <button
                      type="button"
                      onClick={handleResetTimer}
                      aria-label="Reset timer"
                      className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 cursor-pointer"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Completion Affirmation */}
              {isCompleted && (
                <div className="mt-4 w-full rounded-2xl bg-emerald-600/12 border border-emerald-600/20 px-4 py-2.5 text-sm font-semibold text-emerald-950">
                  {BLOCK_AFFIRMATIONS[activity.block]}
                </div>
              )}

              {/* Two Clean Primary Kid Actions */}
              <div className="mt-6 w-full grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={onToggleComplete}
                  className={`inline-flex items-center justify-center gap-2 min-h-[52px] px-4 py-2.5 rounded-full font-display font-bold text-base transition-all duration-150 cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-400/60 ${
                    isCompleted
                      ? 'bg-emerald-600 text-white shadow-sm hover:bg-emerald-700'
                      : 'bg-white text-slate-900 border-2 border-slate-800/15 hover:bg-white/80 active:scale-[0.98]'
                  }`}
                >
                  <Check className="w-5 h-5" strokeWidth={3} />
                  <span>{isCompleted ? 'Done!' : 'I Did It!'}</span>
                </button>

                <button
                  type="button"
                  onClick={onSpinAgain}
                  disabled={isSpinning}
                  className="inline-flex items-center justify-center gap-2 min-h-[52px] px-4 py-2.5 rounded-full bg-slate-900 text-white font-display font-bold text-base shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] hover:bg-slate-800 active:scale-[0.98] transition-all duration-150 cursor-pointer whitespace-nowrap shrink-0 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-400/60"
                >
                  <RotateCw className={`w-4 h-4 ${isSpinning ? 'animate-spin' : ''}`} strokeWidth={2.5} />
                  <span>Spin Again</span>
                </button>
              </div>
            </div>

            {/* Back Face: Tip */}
            <div
              style={{ backgroundColor: '#FFFFFF', borderColor: theme.border }}
              className="flip-card-face flip-card-back rounded-3xl border-2 p-6 sm:p-7 shadow-[0_14px_32px_-14px_rgba(30,41,59,0.14)] text-center flex flex-col items-center justify-between"
            >
              <div className="flex flex-col items-center">
                <div
                  style={{ backgroundColor: theme.surface, color: theme.accentText }}
                  className="w-14 h-14 rounded-2xl flex items-center justify-center"
                >
                  <Lightbulb className="w-7 h-7" strokeWidth={2.3} />
                </div>
                <h3 className="mt-4 font-display text-xl font-bold text-slate-900 text-balance">
                  {activity.title}
                </h3>
                <p className="mt-2.5 text-sm sm:text-base text-slate-700 leading-relaxed max-w-xs">
                  {activity.tip}
                </p>
              </div>

              <button
                type="button"
                onClick={handleFlip}
                className="mt-6 w-full inline-flex items-center justify-center gap-2 min-h-[52px] px-5 py-2.5 rounded-full bg-slate-900 text-white font-display font-bold text-base hover:bg-slate-800 active:scale-[0.98] transition-all duration-150 cursor-pointer"
              >
                <Undo2 className="w-4 h-4" strokeWidth={2.3} />
                <span>Back to Activity</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
