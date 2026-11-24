import type { ActivityBlock, ActivityIconKey, ActivityItem, PastelColorKey, PlayMode, TimePeriod } from '../data/activities';

const HISTORY_STORAGE_KEY = 'playspin_history_v1';
const CUSTOM_ACTIVITIES_KEY = 'playspin_custom_activities_v1';
const MUTE_STORAGE_KEY = 'playspin_muted_v1';

export interface HistoryEntry {
  uid: string;
  activityId: string;
  title: string;
  ideas: string;
  block: ActivityBlock;
  timePeriod: TimePeriod;
  selectedPlayMode: 'solo' | 'group' | 'all';
  colorKey: PastelColorKey;
  icon: ActivityIconKey;
  dateKey: string; // YYYY-MM-DD local date
  timestamp: number;
  completed: boolean;
}

export function toLocalDateKey(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getLast7Days(): {
  dateKey: string;
  dayShort: string;
  dayNum: string;
  fullLabel: string;
  isToday: boolean;
}[] {
  const today = new Date();
  const todayKey = toLocalDateKey(today);
  const days = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = toLocalDateKey(d);
    days.push({
      dateKey: key,
      dayShort: d.toLocaleDateString('en-US', { weekday: 'short' }),
      dayNum: String(d.getDate()),
      fullLabel:
        key === todayKey
          ? 'Today'
          : i === 1
            ? 'Yesterday'
            : d.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }),
      isToday: key === todayKey,
    });
  }
  return days;
}

export function pruneToLast7Days(entries: HistoryEntry[]): HistoryEntry[] {
  const validKeys = new Set(getLast7Days().map((d) => d.dateKey));
  return entries.filter((entry) => validKeys.has(entry.dateKey));
}

export function loadHistory(): HistoryEntry[] {
  try {
    const raw = localStorage.getItem(HISTORY_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as HistoryEntry[];
    if (!Array.isArray(parsed)) return [];
    const pruned = pruneToLast7Days(parsed);
    if (pruned.length !== parsed.length) {
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(pruned));
    }
    return pruned;
  } catch {
    return [];
  }
}

export function saveHistory(entries: HistoryEntry[]): void {
  try {
    const pruned = pruneToLast7Days(entries);
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(pruned));
  } catch {
    // Ignore quota errors cleanly
  }
}

export function loadCustomActivities(): ActivityItem[] {
  try {
    const raw = localStorage.getItem(CUSTOM_ACTIVITIES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as ActivityItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveCustomActivities(items: ActivityItem[]): void {
  try {
    localStorage.setItem(CUSTOM_ACTIVITIES_KEY, JSON.stringify(items));
  } catch {
    // Ignore storage errors
  }
}

export function createCustomActivity(input: {
  title: string;
  ideas: string;
  timePeriod: TimePeriod;
  playMode: PlayMode;
  colorKey: PastelColorKey;
  icon?: ActivityIconKey;
}): ActivityItem {
  const cleanTitle = input.title.trim();
  const shortLabel = cleanTitle.length > 14 ? `${cleanTitle.slice(0, 12).trim()}…` : cleanTitle;
  return {
    id: `custom-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    title: cleanTitle,
    shortLabel,
    ideas: input.ideas.trim() || 'A custom screen-free idea from your Boredom Jar!',
    timePeriod: input.timePeriod,
    block: 'Boredom Jar',
    playMode: input.playMode,
    dayHint: 'Anytime',
    duration: '15–30 min',
    tip: 'Your own Boredom Jar creation—have fun making it your own!',
    colorKey: input.colorKey,
    icon: input.icon ?? 'jar',
    isCustom: true,
  };
}

export interface WeeklyStats {
  todayTotal: number;
  todayCompleted: number;
  weekTotal: number;
  weekCompleted: number;
  activeDays: number;
}

export function computeWeeklyStats(entries: HistoryEntry[]): WeeklyStats {
  const todayKey = toLocalDateKey();
  const todayEntries = entries.filter((e) => e.dateKey === todayKey);
  const activeDaySet = new Set(entries.map((e) => e.dateKey));
  return {
    todayTotal: todayEntries.length,
    todayCompleted: todayEntries.filter((e) => e.completed).length,
    weekTotal: entries.length,
    weekCompleted: entries.filter((e) => e.completed).length,
    activeDays: activeDaySet.size,
  };
}

export function loadMutePreference(): boolean {
  try {
    return localStorage.getItem(MUTE_STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
}

export function saveMutePreference(muted: boolean): void {
  try {
    localStorage.setItem(MUTE_STORAGE_KEY, muted ? 'true' : 'false');
  } catch {
    // Ignore
  }
}
