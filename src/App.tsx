import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  CalendarDays,
  LayoutGrid,
  SlidersHorizontal,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { ActivityFlipCard } from './components/ActivityFlipCard';
import { ConfettiCanvas } from './components/ConfettiCanvas';
import { FilterSheet, type PlayFilter, type TimeFilter } from './components/FilterSheet';
import { HistoryLog } from './components/HistoryLog';
import { OfflineIndicator } from './components/OfflineIndicator';
import { PWAInstallButton } from './components/PWAInstallButton';
import { SpinnerWheel } from './components/SpinnerWheel';
import { WeeklyPlanView } from './components/WeeklyPlanView';
import {
  WEEKLY_ACTIVITIES,
  type ActivityIconKey,
  type ActivityItem,
  type PastelColorKey,
  type PlayMode,
  type TimePeriod,
} from './data/activities';
import {
  computeWeeklyStats,
  createCustomActivity,
  loadCustomActivities,
  loadHistory,
  loadMutePreference,
  saveCustomActivities,
  saveHistory,
  saveMutePreference,
  toLocalDateKey,
  type HistoryEntry,
} from './utils/historyStorage';
import { soundEngine } from './utils/sound';

type AppView = 'spin' | 'history' | 'plan';

function getDefaultTimeFilter(): TimeFilter {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 11) return 'before';
  if (hour >= 14 && hour < 21) return 'after';
  return 'all';
}

function deterministicShuffle<T>(items: T[], seed: number): T[] {
  const copy = [...items];
  let s = seed + 1;
  for (let i = copy.length - 1; i > 0; i--) {
    s = (s * 1664525 + 1013904223) % 4294967296;
    const j = s % (i + 1);
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function App() {
  const [activeView, setActiveView] = useState<AppView>('spin');
  const [showFilters, setShowFilters] = useState(false);
  const [playFilter, setPlayFilter] = useState<PlayFilter>('all');
  const [timeFilter, setTimeFilter] = useState<TimeFilter>(getDefaultTimeFilter);
  const [wheelSeed, setWheelSeed] = useState<number>(1);

  const [isSpinning, setIsSpinning] = useState(false);
  const [spinStage, setSpinStage] = useState<'wheel' | 'picked'>('wheel');
  const [currentActivity, setCurrentActivity] = useState<ActivityItem | null>(null);
  const [currentEntryUid, setCurrentEntryUid] = useState<string | null>(null);
  const [spinCount, setSpinCount] = useState(0);
  const [confettiTrigger, setConfettiTrigger] = useState(0);

  const [history, setHistory] = useState<HistoryEntry[]>(() => loadHistory());
  const [selectedDateKey, setSelectedDateKey] = useState<string>(() => toLocalDateKey());
  const [customActivities, setCustomActivities] = useState<ActivityItem[]>(() =>
    loadCustomActivities()
  );
  const [isMuted, setIsMuted] = useState<boolean>(() => {
    const m = loadMutePreference();
    soundEngine.setMuted(m);
    return m;
  });

  useEffect(() => {
    saveHistory(history);
  }, [history]);

  useEffect(() => {
    saveCustomActivities(customActivities);
  }, [customActivities]);

  const toggleMute = () => {
    setIsMuted((prev) => {
      const next = !prev;
      soundEngine.setMuted(next);
      saveMutePreference(next);
      return next;
    });
  };

  const allActivities = useMemo(
    () => [...customActivities, ...WEEKLY_ACTIVITIES],
    [customActivities]
  );

  const filteredActivities = useMemo(() => {
    return allActivities.filter((item) => {
      const matchesTime = timeFilter === 'all' || item.timePeriod === timeFilter;
      const matchesPlay =
        playFilter === 'all' ||
        item.playMode === 'both' ||
        item.playMode === playFilter;
      return matchesTime && matchesPlay;
    });
  }, [allActivities, timeFilter, playFilter]);

  const wheelActivities = useMemo(() => {
    if (filteredActivities.length <= 10) return filteredActivities;
    return deterministicShuffle(filteredActivities, wheelSeed).slice(0, 10);
  }, [filteredActivities, wheelSeed]);

  const logActivityResult = useCallback(
    (activity: ActivityItem) => {
      const todayKey = toLocalDateKey();
      const newUid = `log-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      const entry: HistoryEntry = {
        uid: newUid,
        activityId: activity.id,
        title: activity.title,
        ideas: activity.ideas,
        block: activity.block,
        timePeriod: activity.timePeriod,
        selectedPlayMode: playFilter,
        colorKey: activity.colorKey,
        icon: activity.icon,
        dateKey: todayKey,
        timestamp: Date.now(),
        completed: false,
      };

      setHistory((prev) => [entry, ...prev]);
      setSelectedDateKey(todayKey);
      setCurrentEntryUid(newUid);
      setCurrentActivity(activity);
      setSpinCount((c) => c + 1);
      setConfettiTrigger((c) => c + 1);
      setSpinStage('picked');
    },
    [playFilter]
  );

  const handleSpinStart = () => {
    setIsSpinning(true);
  };

  const handleSpinComplete = (winner: ActivityItem) => {
    setIsSpinning(false);
    logActivityResult(winner);
  };

  const handleToggleHistoryComplete = (uid: string) => {
    setHistory((prev) =>
      prev.map((item) => {
        if (item.uid !== uid) return item;
        const nextCompleted = !item.completed;
        if (nextCompleted) {
          soundEngine.playCompleteChime();
          setConfettiTrigger((c) => c + 1);
        }
        return { ...item, completed: nextCompleted };
      })
    );
  };

  const handleDeleteHistoryEntry = (uid: string) => {
    setHistory((prev) => prev.filter((item) => item.uid !== uid));
    if (currentEntryUid === uid) {
      setCurrentEntryUid(null);
    }
  };

  const handleAddCustomActivity = (input: {
    title: string;
    ideas: string;
    timePeriod: TimePeriod;
    playMode: PlayMode;
    colorKey: PastelColorKey;
    icon?: ActivityIconKey;
  }) => {
    const newItem = createCustomActivity(input);
    setCustomActivities((prev) => [newItem, ...prev]);
    soundEngine.playCompleteChime();
  };

  const handleRemoveCustomActivity = (id: string) => {
    setCustomActivities((prev) => prev.filter((item) => item.id !== id));
  };

  const handlePickFromPlan = (activity: ActivityItem) => {
    soundEngine.playWinFanfare();
    logActivityResult(activity);
    setActiveView('spin');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSpinAgain = () => {
    setSpinStage('wheel');
    window.setTimeout(() => {
      const wheelBtn = document.querySelector<HTMLButtonElement>(
        'button[aria-label*="Tap to spin"]'
      );
      wheelBtn?.click();
    }, 80);
  };

  const currentEntryCompleted = useMemo(() => {
    if (!currentEntryUid) return false;
    return history.find((h) => h.uid === currentEntryUid)?.completed ?? false;
  }, [history, currentEntryUid]);

  const weeklyStats = useMemo(() => computeWeeklyStats(history), [history]);
  const hasActiveFilter = playFilter !== 'all' || timeFilter !== 'all';

  return (
    <div className="min-h-screen bg-[#FAF8F3] text-slate-800 flex flex-col">
      <ConfettiCanvas triggerKey={confettiTrigger} />
      <OfflineIndicator />

      {/* Minimal Sticky Top Navigation (Icon-First) */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/70 bg-[#FAF8F3]/92 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-4">
          {/* Brand Wordmark (Tapping always returns to the Wheel) */}
          <button
            type="button"
            onClick={() => {
              setActiveView('spin');
              setSpinStage('wheel');
            }}
            className="inline-flex items-center gap-2 font-display text-lg sm:text-xl font-extrabold tracking-tight text-slate-900 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <img
              src={`${import.meta.env.BASE_URL}icon.svg`}
              alt="PlaySpin logo"
              className="w-8 h-8 rounded-lg"
            />
            <span>PlaySpin</span>
          </button>

          {/* Clean Circular Icon Controls (All secondary sections tucked behind icons) */}
          <nav aria-label="App tools" className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setShowFilters(true)}
              aria-label="Wheel options and filters"
              title="Wheel Filters"
              className={`relative inline-flex items-center justify-center w-11 h-11 rounded-full border transition-colors cursor-pointer ${
                hasActiveFilter
                  ? 'bg-amber-100 text-amber-950 border-amber-300'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" strokeWidth={2.2} />
            </button>

            <button
              type="button"
              onClick={() => setActiveView((v) => (v === 'history' ? 'spin' : 'history'))}
              aria-label="7-Day History"
              title="7-Day History"
              className={`relative inline-flex items-center justify-center w-11 h-11 rounded-full border transition-colors cursor-pointer ${
                activeView === 'history'
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <CalendarDays className="w-4 h-4" strokeWidth={2.2} />
              {weeklyStats.todayCompleted > 0 && activeView !== 'history' && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-emerald-600 text-white font-display text-[10px] font-bold flex items-center justify-center tabular-nums">
                  {weeklyStats.todayCompleted}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveView((v) => (v === 'plan' ? 'spin' : 'plan'))}
              aria-label="Weekly Plan and Boredom Jar"
              title="Weekly Plan & Boredom Jar"
              className={`inline-flex items-center justify-center w-11 h-11 rounded-full border transition-colors cursor-pointer ${
                activeView === 'plan'
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <LayoutGrid className="w-4 h-4" strokeWidth={2.2} />
            </button>

            <PWAInstallButton />

            <button
              type="button"
              onClick={toggleMute}
              aria-label={isMuted ? 'Turn sound on' : 'Mute sound'}
              title={isMuted ? 'Sound Muted' : 'Sound On'}
              className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4 text-slate-400" strokeWidth={2.2} />
              ) : (
                <Volume2 className="w-4 h-4 text-emerald-600" strokeWidth={2.2} />
              )}
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content: Single Focused Stage at a Time */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col">
        {activeView === 'spin' && spinStage === 'wheel' && (
          <div className="flex-1 flex flex-col items-center justify-center py-2">
            <SpinnerWheel
              activities={wheelActivities}
              isSpinning={isSpinning}
              onSpinStart={handleSpinStart}
              onSpinComplete={handleSpinComplete}
            />

            {/* Subtle 1-line filter indicator button only if filtered, or quiet tap hint */}
            {hasActiveFilter && (
              <button
                type="button"
                onClick={() => setShowFilters(true)}
                className="mt-4 inline-flex items-center gap-1.5 min-h-[36px] px-3.5 rounded-full text-xs font-medium text-slate-500 hover:text-slate-800 hover:bg-white/80 transition-colors cursor-pointer"
              >
                <span>
                  {playFilter === 'all' ? 'All Play' : playFilter === 'solo' ? 'Solo' : 'Group'}
                  {' · '}
                  {timeFilter === 'all' ? 'All Day' : timeFilter === 'before' ? 'Before School' : 'After School'}
                </span>
              </button>
            )}
          </div>
        )}

        {activeView === 'spin' && spinStage === 'picked' && currentActivity && (
          <div className="flex-1 flex flex-col items-center justify-center py-2">
            <ActivityFlipCard
              activity={currentActivity}
              spinCount={spinCount}
              isSpinning={isSpinning}
              isCompleted={currentEntryCompleted}
              onToggleComplete={() => {
                if (currentEntryUid) {
                  handleToggleHistoryComplete(currentEntryUid);
                }
              }}
              onSpinAgain={handleSpinAgain}
              onBackToWheel={() => setSpinStage('wheel')}
            />
          </div>
        )}

        {activeView === 'history' && (
          <div className="max-w-2xl w-full mx-auto space-y-4">
            <button
              type="button"
              onClick={() => setActiveView('spin')}
              className="inline-flex items-center gap-1.5 min-h-[44px] px-3 -ml-3 rounded-full text-sm font-display font-bold text-slate-600 hover:text-slate-900 hover:bg-white/70 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Wheel</span>
            </button>

            <HistoryLog
              entries={history}
              selectedDateKey={selectedDateKey}
              onSelectDate={setSelectedDateKey}
              onToggleComplete={handleToggleHistoryComplete}
              onDeleteEntry={handleDeleteHistoryEntry}
              onSpinRequest={() => {
                setActiveView('spin');
                setSpinStage('wheel');
              }}
            />
          </div>
        )}

        {activeView === 'plan' && (
          <div className="w-full space-y-4">
            <button
              type="button"
              onClick={() => setActiveView('spin')}
              className="inline-flex items-center gap-1.5 min-h-[44px] px-3 -ml-3 rounded-full text-sm font-display font-bold text-slate-600 hover:text-slate-900 hover:bg-white/70 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Wheel</span>
            </button>

            <WeeklyPlanView
              customActivities={customActivities}
              onAddCustomActivity={handleAddCustomActivity}
              onRemoveCustomActivity={handleRemoveCustomActivity}
              onPickActivity={handlePickFromPlan}
            />
          </div>
        )}
      </main>

      {/* Filter Drawer / Modal */}
      <FilterSheet
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        playFilter={playFilter}
        onChangePlayFilter={setPlayFilter}
        timeFilter={timeFilter}
        onChangeTimeFilter={setTimeFilter}
        wheelCount={wheelActivities.length}
        totalMatchingCount={filteredActivities.length}
        onMixWheel={() => setWheelSeed((s) => s + 1)}
        isSpinning={isSpinning}
      />
    </div>
  );
}
