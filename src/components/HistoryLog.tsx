import React from 'react';
import { CalendarDays, Check, RotateCw, Trash2 } from 'lucide-react';
import { PASTEL_THEMES } from '../data/activities';
import { computeWeeklyStats, getLast7Days, type HistoryEntry } from '../utils/historyStorage';
import { ActivityIcon } from './ActivityIcon';

interface HistoryLogProps {
  entries: HistoryEntry[];
  selectedDateKey: string;
  onSelectDate: (dateKey: string) => void;
  onToggleComplete: (uid: string) => void;
  onDeleteEntry: (uid: string) => void;
  onSpinRequest?: () => void;
  compact?: boolean;
}

export const HistoryLog: React.FC<HistoryLogProps> = ({
  entries,
  selectedDateKey,
  onSelectDate,
  onToggleComplete,
  onDeleteEntry,
  onSpinRequest,
  compact = false,
}) => {
  const days = getLast7Days();
  const selectedDayInfo = days.find((d) => d.dateKey === selectedDateKey) ?? days[days.length - 1];

  const dayEntries = entries
    .filter((e) => e.dateKey === selectedDayInfo.dateKey)
    .sort((a, b) => b.timestamp - a.timestamp);

  const stats = computeWeeklyStats(entries);
  const todayRatio =
    stats.todayTotal > 0 ? Math.min(1, stats.todayCompleted / stats.todayTotal) : 0;
  const ringRadius = 18;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const ringOffset = ringCircumference * (1 - todayRatio);

  return (
    <section
      aria-label="7-Day Activity History"
      className="rounded-3xl bg-white border border-slate-200/80 p-4 sm:p-6 shadow-[0_8px_24px_-12px_rgba(180,120,40,0.1)]"
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <CalendarDays className="w-5 h-5 text-slate-700" strokeWidth={2.2} />
          <h2 className="font-display text-lg sm:text-xl font-bold text-slate-900">
            Activity Log
          </h2>
        </div>

        <span className="text-xs font-medium text-slate-500 tabular-nums">
          {stats.weekTotal} {stats.weekTotal === 1 ? 'spin' : 'spins'}
        </span>
      </div>

      {/* 2-Column Mobile Metric Summary Strip with SVG Progress Ring */}
      <div className="mt-3 grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-[#FAF8F3] p-3 sm:p-3.5 flex items-center gap-3">
          <div className="relative w-11 h-11 shrink-0 flex items-center justify-center">
            <svg className="w-11 h-11 -rotate-90" viewBox="0 0 44 44" aria-hidden="true">
              <circle
                cx="22"
                cy="22"
                r={ringRadius}
                fill="none"
                stroke="#E2E8F0"
                strokeWidth="4.5"
              />
              <circle
                cx="22"
                cy="22"
                r={ringRadius}
                fill="none"
                stroke="#16A34A"
                strokeWidth="4.5"
                strokeLinecap="round"
                strokeDasharray={ringCircumference}
                strokeDashoffset={ringOffset}
                className="transition-all duration-300"
              />
            </svg>
            <span className="absolute font-display text-[11px] font-extrabold text-slate-900 tabular-nums">
              {stats.todayCompleted}/{stats.todayTotal}
            </span>
          </div>
          <div className="min-w-0">
            <p className="font-display text-base font-extrabold text-slate-900 tabular-nums leading-tight">
              {stats.todayCompleted} Done
            </p>
            <p className="text-xs text-slate-500 truncate">Today</p>
          </div>
        </div>

        <div className="rounded-2xl bg-[#FAF8F3] p-3 sm:p-3.5 flex flex-col justify-center">
          <p className="font-display text-base font-extrabold text-slate-900 tabular-nums leading-tight">
            {stats.weekCompleted} Wins
          </p>
          <p className="text-xs text-slate-500 mt-0.5 tabular-nums">
            {stats.activeDays}/7 active days
          </p>
        </div>
      </div>

      {/* 7-Day Horizontal Selector Strip */}
      <div className="mt-3.5 grid grid-cols-7 gap-1 sm:gap-2">
        {days.map((day) => {
          const dayItems = entries.filter((e) => e.dateKey === day.dateKey);
          const countForDay = dayItems.length;
          const completedForDay = dayItems.filter((e) => e.completed).length;
          const isSelected = day.dateKey === selectedDayInfo.dateKey;
          return (
            <button
              key={day.dateKey}
              type="button"
              onClick={() => onSelectDate(day.dateKey)}
              className={`flex flex-col items-center justify-center min-h-[52px] rounded-2xl py-1.5 px-1 transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${
                isSelected
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-[#FAF8F3] text-slate-700 hover:bg-amber-50'
              }`}
            >
              <span
                className={`text-[11px] font-medium ${
                  isSelected ? 'text-slate-300' : 'text-slate-500'
                }`}
              >
                {day.dayShort}
              </span>
              <span className="font-display text-sm font-bold tabular-nums mt-0.5">
                {day.dayNum}
              </span>
              <span
                className={`text-[10px] font-semibold tabular-nums ${
                  isSelected
                    ? 'text-amber-300'
                    : completedForDay > 0
                      ? 'text-emerald-700'
                      : countForDay > 0
                        ? 'text-slate-600'
                        : 'text-slate-400'
                }`}
              >
                {countForDay > 0 ? `${countForDay}` : '–'}
              </span>
            </button>
          );
        })}
      </div>

      {/* Selected Day Heading */}
      <div className="mt-4 flex items-center justify-between border-b border-slate-100 pb-2">
        <h3 className="font-display text-sm font-bold text-slate-900">
          {selectedDayInfo.fullLabel}
        </h3>
        <span className="text-xs font-medium text-slate-500 tabular-nums">
          {dayEntries.length}
        </span>
      </div>

      {/* Day Activity List */}
      {dayEntries.length === 0 ? (
        <div className="py-5 text-center">
          <p className="text-sm text-slate-500">
            {selectedDayInfo.isToday ? 'No spins yet today.' : 'Nothing logged.'}
          </p>
          {onSpinRequest && selectedDayInfo.isToday && (
            <button
              type="button"
              onClick={onSpinRequest}
              className="mt-3 inline-flex items-center justify-center gap-1.5 min-h-[44px] px-5 py-2 rounded-full bg-slate-900 text-white font-display font-bold text-xs sm:text-sm hover:bg-slate-800 transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>Spin Now</span>
            </button>
          )}
        </div>
      ) : (
        <ul className={`divide-y divide-slate-100 ${compact ? 'max-h-[300px] overflow-y-auto pr-1' : ''}`}>
          {dayEntries.map((entry) => {
            const theme = PASTEL_THEMES[entry.colorKey] ?? PASTEL_THEMES.butter;
            const timeString = new Date(entry.timestamp).toLocaleTimeString([], {
              hour: 'numeric',
              minute: '2-digit',
            });
            const modeLabel =
              entry.selectedPlayMode === 'solo'
                ? 'Solo'
                : entry.selectedPlayMode === 'group'
                  ? 'Group'
                  : 'Any';

            return (
              <li
                key={entry.uid}
                className="py-3 min-h-[60px] flex items-center gap-3 group"
              >
                {/* Completion Toggle Button (>=44x44px touch target) */}
                <button
                  type="button"
                  onClick={() => onToggleComplete(entry.uid)}
                  aria-label={entry.completed ? `Mark ${entry.title} incomplete` : `Mark ${entry.title} completed`}
                  className="shrink-0 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                >
                  <span
                    className={`w-7 h-7 rounded-full flex items-center justify-center border-2 transition-colors duration-150 ${
                      entry.completed
                        ? 'bg-emerald-500 border-emerald-500 text-white'
                        : 'bg-white border-slate-300 text-transparent hover:border-emerald-400'
                    }`}
                  >
                    <Check className="w-4 h-4" strokeWidth={3} />
                  </span>
                </button>

                {/* Activity Icon Container */}
                <div
                  style={{ backgroundColor: theme.surface, color: theme.accentText }}
                  className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
                >
                  <ActivityIcon icon={entry.icon} className="w-5 h-5" />
                </div>

                {/* Text Content */}
                <div className="min-w-0 flex-1">
                  <p
                    className={`font-display text-sm sm:text-base font-bold truncate ${
                      entry.completed ? 'text-slate-400 line-through' : 'text-slate-900'
                    }`}
                  >
                    {entry.title}
                  </p>
                  <div className="text-xs text-slate-500 truncate tabular-nums">
                    <span>{entry.timePeriod === 'before' ? 'Before School' : 'After School'}</span>
                    <span className="mx-1.5" aria-hidden="true">·</span>
                    <span>{modeLabel}</span>
                    <span className="mx-1.5" aria-hidden="true">·</span>
                    <span>{timeString}</span>
                  </div>
                </div>

                {/* Delete Entry Button (>=44x44px touch target) */}
                <button
                  type="button"
                  onClick={() => onDeleteEntry(entry.uid)}
                  aria-label={`Remove ${entry.title} from history`}
                  className="shrink-0 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
};
