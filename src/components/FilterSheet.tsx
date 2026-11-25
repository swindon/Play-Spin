import React, { useEffect } from 'react';
import { Clock, Coffee, Shuffle, Smile, Sun, Sunset, User, Users, X } from 'lucide-react';

export type PlayFilter = 'all' | 'solo' | 'group';
export type TimeFilter = 'all' | 'before' | 'after';

interface FilterSheetProps {
  isOpen: boolean;
  onClose: () => void;
  playFilter: PlayFilter;
  onChangePlayFilter: (value: PlayFilter) => void;
  timeFilter: TimeFilter;
  onChangeTimeFilter: (value: TimeFilter) => void;
  wheelCount: number;
  totalMatchingCount: number;
  onMixWheel: () => void;
  isSpinning: boolean;
}

export const FilterSheet: React.FC<FilterSheetProps> = ({
  isOpen,
  onClose,
  playFilter,
  onChangePlayFilter,
  timeFilter,
  onChangeTimeFilter,
  wheelCount,
  totalMatchingCount,
  onMixWheel,
  isSpinning,
}) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/40 backdrop-blur-xs sm:p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Wheel filters"
    >
      <div
        className="w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl bg-white border border-slate-200/80 p-5 sm:p-6 shadow-2xl space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile drag handle */}
        <div className="sm:hidden w-10 h-1.5 bg-slate-200 rounded-full mx-auto -mt-1 mb-1" />

        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-lg font-bold text-slate-900">Wheel Options</h2>
            <p className="text-xs text-slate-500 tabular-nums">
              {wheelCount} of {totalMatchingCount} ideas on wheel
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close options"
            className="min-w-[44px] min-h-[44px] rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Who's Playing */}
        <div className="space-y-2">
          <span className="block text-xs font-semibold text-slate-500">Players</span>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => onChangePlayFilter('all')}
              className={`inline-flex items-center justify-center gap-1.5 min-h-[46px] rounded-2xl text-sm font-display font-bold transition-colors cursor-pointer ${
                playFilter === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'bg-[#FAF8F3] text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Smile className="w-4 h-4" />
              <span>All</span>
            </button>
            <button
              type="button"
              onClick={() => onChangePlayFilter('solo')}
              className={`inline-flex items-center justify-center gap-1.5 min-h-[46px] rounded-2xl text-sm font-display font-bold transition-colors cursor-pointer ${
                playFilter === 'solo'
                  ? 'bg-amber-300 text-amber-950'
                  : 'bg-[#FAF8F3] text-slate-700 hover:bg-slate-100'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Solo</span>
            </button>
            <button
              type="button"
              onClick={() => onChangePlayFilter('group')}
              className={`inline-flex items-center justify-center gap-1.5 min-h-[46px] rounded-2xl text-sm font-display font-bold transition-colors cursor-pointer ${
                playFilter === 'group'
                  ? 'bg-emerald-200 text-emerald-950'
                  : 'bg-[#FAF8F3] text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Group</span>
            </button>
          </div>
        </div>

        {/* Time of Day */}
        <div className="space-y-2">
          <span className="block text-xs font-semibold text-slate-500">When</span>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => onChangeTimeFilter('before')}
              className={`inline-flex items-center justify-center gap-1.5 min-h-[46px] rounded-2xl text-sm font-display font-bold transition-colors cursor-pointer ${
                timeFilter === 'before'
                  ? 'bg-sky-200 text-sky-950'
                  : 'bg-[#FAF8F3] text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Sun className="w-4 h-4" />
              <span>Before</span>
            </button>
            <button
              type="button"
              onClick={() => onChangeTimeFilter('after')}
              className={`inline-flex items-center justify-center gap-1.5 min-h-[46px] rounded-2xl text-sm font-display font-bold transition-colors cursor-pointer ${
                timeFilter === 'after'
                  ? 'bg-violet-200 text-violet-950'
                  : 'bg-[#FAF8F3] text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Sunset className="w-4 h-4" />
              <span>After</span>
            </button>
            <button
              type="button"
              onClick={() => onChangeTimeFilter('all')}
              className={`inline-flex items-center justify-center gap-1.5 min-h-[46px] rounded-2xl text-sm font-display font-bold transition-colors cursor-pointer ${
                timeFilter === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'bg-[#FAF8F3] text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>All Day</span>
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2.5 pt-1">
          {totalMatchingCount > 10 && (
            <button
              type="button"
              disabled={isSpinning}
              onClick={onMixWheel}
              className="flex-1 inline-flex items-center justify-center gap-2 min-h-[48px] rounded-full bg-amber-100 text-amber-950 font-display font-bold text-sm hover:bg-amber-200 transition-colors cursor-pointer disabled:opacity-50"
            >
              <Shuffle className="w-4 h-4" />
              <span>Shuffle Slices</span>
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="flex-1 min-h-[48px] rounded-full bg-slate-900 text-white font-display font-bold text-sm hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>

        {/* Support Link */}
        <div className="pt-2 text-center border-t border-slate-100">
          <a
            href="https://buymeacoffee.com/scottwindon"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => console.log('Support PlaySpin: https://buymeacoffee.com/scottwindon')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 hover:text-amber-800 hover:underline transition-colors cursor-pointer"
          >
            <Coffee className="w-3.5 h-3.5" />
            <span>Support PlaySpin on Buy Me a Coffee</span>
          </a>
        </div>
      </div>
    </div>
  );
};
