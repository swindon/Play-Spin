import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Play, Plus, Sparkles, Sun, Sunset, Trash2, User, Users } from 'lucide-react';
import {
  PASTEL_THEMES,
  QUICK_JAR_PRESETS,
  STICK_TIPS,
  WEEKLY_ACTIVITIES,
  type ActivityBlock,
  type ActivityIconKey,
  type ActivityItem,
  type PastelColorKey,
  type PlayMode,
  type TimePeriod,
} from '../data/activities';
import { ActivityIcon } from './ActivityIcon';

interface WeeklyPlanViewProps {
  customActivities: ActivityItem[];
  onAddCustomActivity: (input: {
    title: string;
    ideas: string;
    timePeriod: TimePeriod;
    playMode: PlayMode;
    colorKey: PastelColorKey;
    icon?: ActivityIconKey;
  }) => void;
  onRemoveCustomActivity: (id: string) => void;
  onPickActivity: (activity: ActivityItem) => void;
}

const SCHEDULE_BLOCKS: {
  block: ActivityBlock;
  shortName: string;
  timeHint: string;
  colorKey: PastelColorKey;
}[] = [
  { block: 'Morning (Before School)', shortName: 'Morning', timeHint: 'Before school', colorKey: 'butter' },
  { block: 'After School: Decompress', shortName: 'Decompress', timeHint: '3:30 – 4:15 PM', colorKey: 'mint' },
  { block: 'After School: Focus & Create', shortName: 'Focus', timeHint: '4:15 – 5:00 PM', colorKey: 'lavender' },
  { block: 'Pre-Dinner: Pitch In', shortName: 'Pitch In', timeHint: '5:00 – 5:30 PM', colorKey: 'sky' },
  { block: 'Evening: Wind Down', shortName: 'Evening', timeHint: 'Before bed', colorKey: 'peach' },
];

const DAYS_ORDER: ActivityItem['dayHint'][] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const COLOR_OPTIONS: PastelColorKey[] = ['butter', 'mint', 'lavender', 'sky', 'peach', 'rose'];
const ICON_OPTIONS: ActivityIconKey[] = ['jar', 'palette', 'blocks', 'tent', 'soccer', 'music', 'book'];

export const WeeklyPlanView: React.FC<WeeklyPlanViewProps> = ({
  customActivities,
  onAddCustomActivity,
  onRemoveCustomActivity,
  onPickActivity,
}) => {
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [title, setTitle] = useState('');
  const [ideas, setIdeas] = useState('');
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('after');
  const [playMode, setPlayMode] = useState<PlayMode>('both');
  const [colorKey, setColorKey] = useState<PastelColorKey>('rose');
  const [icon, setIcon] = useState<ActivityIconKey>('jar');
  const [selectedBlock, setSelectedBlock] = useState<'all' | ActivityBlock>('all');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAddCustomActivity({ title, ideas, timePeriod, playMode, colorKey, icon });
    setTitle('');
    setIdeas('');
    setShowCustomForm(false);
  };

  const existingCustomTitles = new Set(customActivities.map((c) => c.title.toLowerCase()));

  const visibleBlocks =
    selectedBlock === 'all'
      ? SCHEDULE_BLOCKS
      : SCHEDULE_BLOCKS.filter((b) => b.block === selectedBlock);

  return (
    <div className="space-y-6">
      {/* Custom Boredom Jar Creator */}
      <section className="rounded-3xl bg-white border border-slate-200/80 p-4 sm:p-6 shadow-[0_8px_24px_-12px_rgba(180,120,40,0.1)]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-lg sm:text-xl font-bold text-slate-900">
              Boredom Jar
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Tap to add ideas to your wheel · {customActivities.length} added
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowCustomForm((prev) => !prev)}
            className="inline-flex items-center gap-1.5 min-h-[40px] px-4 rounded-full bg-slate-900 text-white font-display font-bold text-xs sm:text-sm hover:bg-slate-800 transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            <Plus className="w-4 h-4" strokeWidth={2.5} />
            <span>Custom Idea</span>
            {showCustomForm ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* 1-Tap Quick-Add Starter Chips */}
        <div className="mt-4 flex flex-wrap gap-2">
          {QUICK_JAR_PRESETS.map((preset) => {
            const alreadyAdded = existingCustomTitles.has(preset.title.toLowerCase());
            const theme = PASTEL_THEMES[preset.colorKey];
            return (
              <button
                key={preset.title}
                type="button"
                disabled={alreadyAdded}
                onClick={() => onAddCustomActivity(preset)}
                style={{
                  backgroundColor: alreadyAdded ? '#F1F5F9' : theme.surface,
                  borderColor: alreadyAdded ? '#E2E8F0' : theme.border,
                }}
                className="inline-flex items-center gap-2 min-h-[40px] px-3.5 py-1.5 rounded-full border text-xs sm:text-sm font-display font-bold text-slate-800 transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-45 disabled:cursor-default cursor-pointer whitespace-nowrap shrink-0"
              >
                <ActivityIcon icon={preset.icon} className="w-4 h-4 shrink-0" />
                <span>{preset.title}</span>
                {!alreadyAdded && <Plus className="w-3.5 h-3.5 opacity-70" />}
              </button>
            );
          })}
        </div>

        {/* Collapsible Custom Idea Form */}
        {showCustomForm && (
          <form onSubmit={handleSubmit} className="mt-5 pt-5 border-t border-slate-100 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                id="jar-title"
                type="text"
                aria-label="Activity Name"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Activity name (e.g., Cardboard Castle)"
                maxLength={42}
                required
                className="w-full min-h-[44px] rounded-2xl border border-slate-200 bg-[#FAF8F3] px-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />

              <input
                id="jar-ideas"
                type="text"
                aria-label="Quick Details"
                value={ideas}
                onChange={(e) => setIdeas(e.target.value)}
                placeholder="Quick details (optional)"
                maxLength={80}
                className="w-full min-h-[44px] rounded-2xl border border-slate-200 bg-[#FAF8F3] px-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex p-1 rounded-full bg-[#FAF8F3] border border-slate-200/80">
                <button
                  type="button"
                  onClick={() => setTimePeriod('before')}
                  className={`inline-flex items-center gap-1.5 min-h-[38px] px-3 rounded-full text-xs font-display font-bold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    timePeriod === 'before' ? 'bg-sky-200 text-sky-950' : 'text-slate-600'
                  }`}
                >
                  <Sun className="w-3.5 h-3.5" />
                  <span>Before</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTimePeriod('after')}
                  className={`inline-flex items-center gap-1.5 min-h-[38px] px-3 rounded-full text-xs font-display font-bold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    timePeriod === 'after' ? 'bg-violet-200 text-violet-950' : 'text-slate-600'
                  }`}
                >
                  <Sunset className="w-3.5 h-3.5" />
                  <span>After</span>
                </button>
              </div>

              <div className="inline-flex p-1 rounded-full bg-[#FAF8F3] border border-slate-200/80">
                <button
                  type="button"
                  onClick={() => setPlayMode('both')}
                  className={`min-h-[38px] px-3 rounded-full text-xs font-display font-bold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    playMode === 'both' ? 'bg-slate-900 text-white' : 'text-slate-600'
                  }`}
                >
                  Both
                </button>
                <button
                  type="button"
                  onClick={() => setPlayMode('solo')}
                  className={`inline-flex items-center gap-1 min-h-[38px] px-3 rounded-full text-xs font-display font-bold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    playMode === 'solo' ? 'bg-amber-300 text-amber-950' : 'text-slate-600'
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Solo</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPlayMode('group')}
                  className={`inline-flex items-center gap-1 min-h-[38px] px-3 rounded-full text-xs font-display font-bold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    playMode === 'group' ? 'bg-emerald-200 text-emerald-950' : 'text-slate-600'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Group</span>
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-1.5">
                  {COLOR_OPTIONS.map((key) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setColorKey(key)}
                      aria-label={`Select ${key} color`}
                      style={{ backgroundColor: PASTEL_THEMES[key].slice }}
                      className={`w-9 h-9 rounded-full border-2 transition-transform cursor-pointer ${
                        colorKey === key ? 'border-slate-900 scale-105' : 'border-white hover:scale-105'
                      }`}
                    />
                  ))}
                </div>

                <div className="flex items-center gap-1">
                  {ICON_OPTIONS.map((ic) => (
                    <button
                      key={ic}
                      type="button"
                      onClick={() => setIcon(ic)}
                      aria-label={`Select ${ic} icon`}
                      className={`w-9 h-9 rounded-full border flex items-center justify-center transition-colors cursor-pointer ${
                        icon === ic
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-[#FAF8F3] text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <ActivityIcon icon={ic} className="w-4 h-4" />
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="inline-flex items-center justify-center gap-1.5 min-h-[44px] px-5 py-2 rounded-full bg-slate-900 text-white font-display font-bold text-sm hover:bg-slate-800 active:scale-[0.98] transition-all cursor-pointer whitespace-nowrap shrink-0"
              >
                <Plus className="w-4 h-4" strokeWidth={2.6} />
                <span>Add</span>
              </button>
            </div>
          </form>
        )}

        {/* Saved Custom Jar Items */}
        {customActivities.length > 0 && (
          <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {customActivities.map((item) => {
              const theme = PASTEL_THEMES[item.colorKey];
              return (
                <div
                  key={item.id}
                  style={{ backgroundColor: theme.surface, borderColor: theme.border }}
                  className="rounded-2xl border p-3 flex items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <div
                      style={{ backgroundColor: theme.iconBg, color: theme.accentText }}
                      className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                    >
                      <ActivityIcon icon={item.icon} className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-display font-bold text-sm text-slate-900 truncate">
                        {item.title}
                      </p>
                      <p className="text-[11px] text-slate-600 truncate">
                        {item.timePeriod === 'before' ? 'Before' : 'After'} ·{' '}
                        {item.playMode === 'both' ? 'Any' : item.playMode === 'solo' ? 'Solo' : 'Group'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center shrink-0">
                    <button
                      type="button"
                      onClick={() => onPickActivity(item)}
                      aria-label={`Try ${item.title}`}
                      className="min-w-[40px] min-h-[40px] rounded-xl bg-white/85 hover:bg-white text-slate-900 flex items-center justify-center cursor-pointer"
                    >
                      <Play className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onRemoveCustomActivity(item.id)}
                      aria-label={`Delete ${item.title}`}
                      className="min-w-[40px] min-h-[40px] rounded-xl text-slate-500 hover:text-rose-600 hover:bg-white/70 flex items-center justify-center cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Weekly Schedule with Sticky Block Filter Strip */}
      <section className="space-y-4">
        <div className="sticky top-14 sm:top-16 z-30 bg-[#FAF8F3]/95 backdrop-blur-sm py-2.5 -mx-4 px-4 sm:mx-0 sm:px-0 border-b border-slate-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <h2 className="font-display text-lg sm:text-xl font-bold text-slate-900 whitespace-nowrap shrink-0">
            Weekly Plan
          </h2>

          {/* Sticky Block Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
            <button
              type="button"
              onClick={() => setSelectedBlock('all')}
              className={`min-h-[38px] px-3.5 rounded-full text-xs font-display font-bold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                selectedBlock === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900'
              }`}
            >
              All
            </button>
            {SCHEDULE_BLOCKS.map(({ block, shortName }) => (
              <button
                key={block}
                type="button"
                onClick={() => setSelectedBlock(block)}
                className={`min-h-[38px] px-3.5 rounded-full text-xs font-display font-bold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  selectedBlock === block
                    ? 'bg-slate-900 text-white'
                    : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900'
                }`}
              >
                {shortName}
              </button>
            ))}
          </div>
        </div>

        {/* Schedule Blocks: Horizontal Snap Carousel on Mobile, 5-Col Grid on Desktop */}
        <div className="divide-y divide-slate-200/80 rounded-3xl bg-white border border-slate-200/80 px-4 sm:px-6 shadow-[0_8px_24px_-12px_rgba(180,120,40,0.1)]">
          {visibleBlocks.map(({ block, timeHint, colorKey: blockColor }) => {
            const blockTheme = PASTEL_THEMES[blockColor];
            const itemsForBlock = DAYS_ORDER.map((day) =>
              WEEKLY_ACTIVITIES.find((a) => a.block === block && a.dayHint === day)
            ).filter((a): a is ActivityItem => Boolean(a));

            return (
              <div key={block} className="py-4 sm:py-5">
                <div className="flex items-baseline justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      style={{ backgroundColor: blockTheme.slice }}
                      className="w-3 h-3 rounded-full inline-block shrink-0"
                    />
                    <h3 className="font-display text-base font-bold text-slate-900">
                      {block}
                    </h3>
                  </div>
                  <span className="text-xs text-slate-500 whitespace-nowrap shrink-0">{timeHint}</span>
                </div>

                <div className="mt-3 flex overflow-x-auto snap-x snap-mandatory gap-3 pb-1 sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 sm:overflow-visible sm:pb-0">
                  {itemsForBlock.map((act) => {
                    const cardTheme = PASTEL_THEMES[act.colorKey];
                    return (
                      <button
                        key={act.id}
                        type="button"
                        onClick={() => onPickActivity(act)}
                        style={{ backgroundColor: cardTheme.surface, borderColor: cardTheme.border }}
                        className="w-[216px] shrink-0 snap-start sm:w-auto text-left rounded-2xl border p-3.5 hover:scale-[1.015] active:scale-[0.985] transition-transform duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 flex flex-col justify-between min-h-[100px]"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 text-[11px] font-semibold text-slate-600">
                            <span>{act.dayHint}</span>
                            <ActivityIcon icon={act.icon} className="w-4 h-4 text-slate-700" />
                          </div>
                          <p className="font-display font-bold text-sm text-slate-900 mt-1.5 leading-snug">
                            {act.title}
                          </p>
                          <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                            {act.ideas}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Compact Quick Tips */}
      <section className="rounded-3xl bg-white border border-slate-200/80 p-4 sm:p-6 shadow-[0_8px_24px_-12px_rgba(180,120,40,0.1)]">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-amber-500" strokeWidth={2.2} />
          <h2 className="font-display text-base sm:text-lg font-bold text-slate-900">
            Quick Habits
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {STICK_TIPS.map((tip) => {
            const theme = PASTEL_THEMES[tip.colorKey];
            return (
              <div
                key={tip.title}
                style={{ backgroundColor: theme.surface, borderColor: theme.border }}
                className="rounded-2xl border p-3.5"
              >
                <h3 className="font-display font-bold text-sm text-slate-900">{tip.title}</h3>
                <p className="mt-1 text-xs text-slate-700 leading-relaxed">{tip.description}</p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
