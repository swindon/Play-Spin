export type TimePeriod = 'before' | 'after';
export type PlayMode = 'solo' | 'group' | 'both';
export type PastelColorKey = 'butter' | 'mint' | 'lavender' | 'sky' | 'peach' | 'rose';
export type ActivityBlock =
  | 'Morning (Before School)'
  | 'After School: Decompress'
  | 'After School: Focus & Create'
  | 'Pre-Dinner: Pitch In'
  | 'Evening: Wind Down'
  | 'Boredom Jar';

export type ActivityIconKey =
  | 'book'
  | 'blocks'
  | 'stretch'
  | 'puzzle'
  | 'palette'
  | 'bike'
  | 'train'
  | 'soccer'
  | 'crown'
  | 'music'
  | 'beads'
  | 'flask'
  | 'scissors'
  | 'broom'
  | 'shirt'
  | 'utensils'
  | 'bed'
  | 'sparkles'
  | 'moon'
  | 'dice'
  | 'tent'
  | 'jar';

export interface ActivityItem {
  id: string;
  title: string;
  shortLabel: string;
  ideas: string;
  timePeriod: TimePeriod;
  block: ActivityBlock;
  playMode: PlayMode;
  dayHint: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Anytime';
  duration: string;
  tip: string;
  colorKey: PastelColorKey;
  icon: ActivityIconKey;
  isCustom?: boolean;
}

export interface PastelTheme {
  surface: string;
  slice: string;
  sliceStroke: string;
  iconBg: string;
  accentText: string;
  border: string;
  buttonBg: string;
}

export const PASTEL_THEMES: Record<PastelColorKey, PastelTheme> = {
  butter: {
    surface: '#FFF6D6',
    slice: '#FDE68A',
    sliceStroke: '#F59E0B',
    iconBg: '#FEF08A',
    accentText: '#713F12',
    border: '#FDE047',
    buttonBg: '#F59E0B',
  },
  mint: {
    surface: '#E2F8EA',
    slice: '#BBF7D0',
    sliceStroke: '#22C55E',
    iconBg: '#DCFCE7',
    accentText: '#14532D',
    border: '#86EFAC',
    buttonBg: '#16A34A',
  },
  lavender: {
    surface: '#EFEAFE',
    slice: '#DDD6FE',
    sliceStroke: '#8B5CF6',
    iconBg: '#EDE9FE',
    accentText: '#4C1D95',
    border: '#C4B5FD',
    buttonBg: '#7C3AED',
  },
  sky: {
    surface: '#E0F3FE',
    slice: '#BAE6FD',
    sliceStroke: '#0EA5E9',
    iconBg: '#E0F2FE',
    accentText: '#0C4A6E',
    border: '#7DD3FC',
    buttonBg: '#0284C7',
  },
  peach: {
    surface: '#FFEDD8',
    slice: '#FED7AA',
    sliceStroke: '#F97316',
    iconBg: '#FFEDD5',
    accentText: '#7C2D12',
    border: '#FDBA74',
    buttonBg: '#EA580C',
  },
  rose: {
    surface: '#FCE7F3',
    slice: '#FBCFE8',
    sliceStroke: '#EC4899',
    iconBg: '#FCE7F3',
    accentText: '#831843',
    border: '#F9A8D4',
    buttonBg: '#DB2777',
  },
};

export const WEEKLY_ACTIVITIES: ActivityItem[] = [
  // Morning (Before School)
  {
    id: 'mon-morning',
    title: 'Independent Reading',
    shortLabel: 'Reading',
    ideas: 'Picture books, chapter books, or audiobooks',
    timePeriod: 'before',
    block: 'Morning (Before School)',
    playMode: 'solo',
    dayHint: 'Monday',
    duration: '15–20 min',
    tip: 'Set out 2 favorite books on the sofa the night before as an invitation to read.',
    colorKey: 'butter',
    icon: 'book',
  },
  {
    id: 'tue-morning',
    title: 'Quiet Toy Play',
    shortLabel: 'Toy Play',
    ideas: 'Building blocks, Lego, or magnetic tiles',
    timePeriod: 'before',
    block: 'Morning (Before School)',
    playMode: 'both',
    dayHint: 'Tuesday',
    duration: '15–20 min',
    tip: 'Try a 5-minute challenge: build the tallest tower or a tiny bridge before school.',
    colorKey: 'mint',
    icon: 'blocks',
  },
  {
    id: 'wed-morning',
    title: 'Morning Stretch & Gymnastics',
    shortLabel: 'Stretch',
    ideas: 'Cartwheels, balance beam, or yoga poses',
    timePeriod: 'before',
    block: 'Morning (Before School)',
    playMode: 'both',
    dayHint: 'Wednesday',
    duration: '10–15 min',
    tip: 'Take turns calling out animal yoga poses like frog jump, downward dog, or flamingo balance.',
    colorKey: 'lavender',
    icon: 'stretch',
  },
  {
    id: 'thu-morning',
    title: 'Brain Teasers & Learning',
    shortLabel: 'Puzzles',
    ideas: 'Puzzles, flash cards, or matching games',
    timePeriod: 'before',
    block: 'Morning (Before School)',
    playMode: 'both',
    dayHint: 'Thursday',
    duration: '15 min',
    tip: 'Flip over memory cards together or race gently to finish a small jigsaw corner.',
    colorKey: 'peach',
    icon: 'puzzle',
  },
  {
    id: 'fri-morning',
    title: 'Drawing & Coloring',
    shortLabel: 'Drawing',
    ideas: 'Free sketch, color-by-number, or stickers',
    timePeriod: 'before',
    block: 'Morning (Before School)',
    playMode: 'solo',
    dayHint: 'Friday',
    duration: '15–20 min',
    tip: 'Draw a quick comic strip or rainbow bookmark to slip inside your school bag.',
    colorKey: 'sky',
    icon: 'palette',
  },

  // Before School Bonus ideas so Solo & Group wheels both have rich options
  {
    id: 'bonus-morning-group-scavenger',
    title: 'Morning Treasure Hunt',
    shortLabel: 'Treasure Hunt',
    ideas: 'Find 5 colorful things around the house before leaving',
    timePeriod: 'before',
    block: 'Boredom Jar',
    playMode: 'group',
    dayHint: 'Anytime',
    duration: '10 min',
    tip: 'Pick one color (like sunny yellow) and race to spot 5 items together.',
    colorKey: 'rose',
    icon: 'jar',
  },
  {
    id: 'bonus-morning-group-story',
    title: 'Pass-the-Story Breakfast',
    shortLabel: 'Story Chain',
    ideas: 'Take turns adding one silly sentence to a morning story',
    timePeriod: 'before',
    block: 'Boredom Jar',
    playMode: 'group',
    dayHint: 'Anytime',
    duration: '10 min',
    tip: 'Start with "Once upon a time, a flying pancake..." and let everyone add a twist.',
    colorKey: 'butter',
    icon: 'sparkles',
  },
  {
    id: 'bonus-morning-solo-origami',
    title: 'Paper Airplane Fold',
    shortLabel: 'Paper Planes',
    ideas: 'Fold 2 paper airplanes or simple origami shapes',
    timePeriod: 'before',
    block: 'Boredom Jar',
    playMode: 'solo',
    dayHint: 'Anytime',
    duration: '10–15 min',
    tip: 'Decorate the wings with stripes and test how far it glides down the hallway.',
    colorKey: 'sky',
    icon: 'scissors',
  },

  // After School: Decompress
  {
    id: 'mon-decompress',
    title: 'Snack & Outside Play',
    shortLabel: 'Outside Play',
    ideas: 'Backyard run-around, bikes, or chalk',
    timePeriod: 'after',
    block: 'After School: Decompress',
    playMode: 'both',
    dayHint: 'Monday',
    duration: '30–45 min',
    tip: 'Draw a giant hopscotch path or obstacle line with sidewalk chalk after your snack.',
    colorKey: 'sky',
    icon: 'bike',
  },
  {
    id: 'tue-decompress',
    title: 'Snack & Free Toy Play',
    shortLabel: 'Free Toy Play',
    ideas: 'Action figures, dolls, or train sets',
    timePeriod: 'after',
    block: 'After School: Decompress',
    playMode: 'both',
    dayHint: 'Tuesday',
    duration: '30–45 min',
    tip: 'Build a bustling town or train station using cushions as hills and tunnels.',
    colorKey: 'mint',
    icon: 'train',
  },
  {
    id: 'wed-decompress',
    title: 'Snack & Park Games',
    shortLabel: 'Park & Ball',
    ideas: 'Park visit, ball games, or nature walk',
    timePeriod: 'after',
    block: 'After School: Decompress',
    playMode: 'group',
    dayHint: 'Wednesday',
    duration: '40 min',
    tip: 'Collect interesting leaves or count how many birds you spot on a quick walk.',
    colorKey: 'lavender',
    icon: 'soccer',
  },
  {
    id: 'thu-decompress',
    title: 'Snack & Imagination Play',
    shortLabel: 'Fort & Dress-Up',
    ideas: 'Dress-up, fort building, or pretend store',
    timePeriod: 'after',
    block: 'After School: Decompress',
    playMode: 'group',
    dayHint: 'Thursday',
    duration: '40 min',
    tip: 'Drape a light sheet over two chairs to make a cozy hideout or pretend bakery.',
    colorKey: 'peach',
    icon: 'crown',
  },
  {
    id: 'fri-decompress',
    title: 'Snack & Movement Party',
    shortLabel: 'Dance & Tumbling',
    ideas: 'Obstacle course, dance party, or tumbling',
    timePeriod: 'after',
    block: 'After School: Decompress',
    playMode: 'both',
    dayHint: 'Friday',
    duration: '30 min',
    tip: 'Play freeze dance or set up pillows for a safe indoor jumping course.',
    colorKey: 'rose',
    icon: 'music',
  },

  // After School: Focus & Create
  {
    id: 'mon-focus',
    title: 'Arts & Crafts Studio',
    shortLabel: 'Arts & Crafts',
    ideas: 'Painting, clay, collage, or origami',
    timePeriod: 'after',
    block: 'After School: Focus & Create',
    playMode: 'solo',
    dayHint: 'Monday',
    duration: '35–45 min',
    tip: 'Sculpt a tiny clay animal or cut shapes from scrap paper for a bright collage.',
    colorKey: 'lavender',
    icon: 'palette',
  },
  {
    id: 'tue-focus',
    title: 'Science & Board Games',
    shortLabel: 'Science & Games',
    ideas: 'Schoolwork, science kits, or board games',
    timePeriod: 'after',
    block: 'After School: Focus & Create',
    playMode: 'group',
    dayHint: 'Tuesday',
    duration: '35–45 min',
    tip: 'Tackle homework first for 15 minutes, then celebrate with a tabletop game or experiment.',
    colorKey: 'mint',
    icon: 'flask',
  },
  {
    id: 'wed-focus',
    title: 'Beading & Cardboard Build',
    shortLabel: 'Cardboard Craft',
    ideas: 'Beading, cardboard creations, or stamping',
    timePeriod: 'after',
    block: 'After School: Focus & Create',
    playMode: 'solo',
    dayHint: 'Wednesday',
    duration: '35–45 min',
    tip: 'Turn an empty cardboard box into a castle, robot helmet, or cozy pet house.',
    colorKey: 'peach',
    icon: 'beads',
  },
  {
    id: 'thu-focus',
    title: 'Paired Reading & Stories',
    shortLabel: 'Story Writing',
    ideas: 'Paired reading, writing stories, or math games',
    timePeriod: 'after',
    block: 'After School: Focus & Create',
    playMode: 'group',
    dayHint: 'Thursday',
    duration: '30–40 min',
    tip: 'Staple 4 sheets of folded paper together to write and illustrate your own mini book.',
    colorKey: 'sky',
    icon: 'book',
  },
  {
    id: 'fri-focus',
    title: 'Free Choice Creative',
    shortLabel: 'Free Creative',
    ideas: 'Pick any favorite screen-free project from the week',
    timePeriod: 'after',
    block: 'After School: Focus & Create',
    playMode: 'both',
    dayHint: 'Friday',
    duration: '40 min',
    tip: 'Combine two supplies—like stickers and Lego, or yarn and cardboard—for something new.',
    colorKey: 'rose',
    icon: 'scissors',
  },

  // Pre-Dinner: Pitch In
  {
    id: 'mon-pitch',
    title: 'Chores & Toy Reset',
    shortLabel: 'Toy Reset',
    ideas: 'Tidy play area, wipe table, feed pets',
    timePeriod: 'after',
    block: 'Pre-Dinner: Pitch In',
    playMode: 'both',
    dayHint: 'Monday',
    duration: '15–20 min',
    tip: 'Put on one upbeat song and see if the play area sparkles before the song ends.',
    colorKey: 'sky',
    icon: 'broom',
  },
  {
    id: 'tue-pitch',
    title: 'Chores & Laundry Match',
    shortLabel: 'Sock Match',
    ideas: 'Match socks, put away folded clothes',
    timePeriod: 'after',
    block: 'Pre-Dinner: Pitch In',
    playMode: 'solo',
    dayHint: 'Tuesday',
    duration: '15–20 min',
    tip: 'Turn sock matching into a basketball toss into the laundry basket.',
    colorKey: 'mint',
    icon: 'shirt',
  },
  {
    id: 'wed-pitch',
    title: 'Chores & Kitchen Help',
    shortLabel: 'Kitchen Help',
    ideas: 'Wash veggies, set the table, sweep',
    timePeriod: 'after',
    block: 'Pre-Dinner: Pitch In',
    playMode: 'group',
    dayHint: 'Wednesday',
    duration: '20 min',
    tip: 'Be the official sous-chef: tear lettuce, arrange napkins, or set forks on the table.',
    colorKey: 'butter',
    icon: 'utensils',
  },
  {
    id: 'thu-pitch',
    title: 'Chores & Room Tidy',
    shortLabel: 'Room Tidy',
    ideas: 'Make bed, organize books, empty small bins',
    timePeriod: 'after',
    block: 'Pre-Dinner: Pitch In',
    playMode: 'solo',
    dayHint: 'Thursday',
    duration: '15–20 min',
    tip: 'Line up your favorite stuffed animals neatly on the bed once it is made.',
    colorKey: 'peach',
    icon: 'bed',
  },
  {
    id: 'fri-pitch',
    title: 'Weekly Toy & Craft Clean-Up',
    shortLabel: 'Craft Clean-Up',
    ideas: 'Deep tidy of craft supplies and toy bins',
    timePeriod: 'after',
    block: 'Pre-Dinner: Pitch In',
    playMode: 'group',
    dayHint: 'Friday',
    duration: '20–25 min',
    tip: 'Check marker caps, sort stray Lego pieces, and get the craft bin ready for the weekend.',
    colorKey: 'lavender',
    icon: 'broom',
  },

  // Evening: Wind Down
  {
    id: 'mon-evening',
    title: 'Family Read-Aloud',
    shortLabel: 'Read-Aloud',
    ideas: 'Chapter book together before lights out',
    timePeriod: 'after',
    block: 'Evening: Wind Down',
    playMode: 'group',
    dayHint: 'Monday',
    duration: '20–30 min',
    tip: 'Cozy up with pillows and use fun voices for different characters in the chapter.',
    colorKey: 'butter',
    icon: 'moon',
  },
  {
    id: 'tue-evening',
    title: 'Quiet Imagination',
    shortLabel: 'Shadow Puppets',
    ideas: 'Shadow puppets, storytelling, or audiobooks',
    timePeriod: 'after',
    block: 'Evening: Wind Down',
    playMode: 'group',
    dayHint: 'Tuesday',
    duration: '20 min',
    tip: 'Shine a flashlight onto a blank wall and make bunnies, birds, or dinosaurs with your hands.',
    colorKey: 'lavender',
    icon: 'sparkles',
  },
  {
    id: 'wed-evening',
    title: 'Calm Games & Puzzles',
    shortLabel: 'Card & Dominoes',
    ideas: 'Card games, dominoes, or jigsaw puzzles',
    timePeriod: 'after',
    block: 'Evening: Wind Down',
    playMode: 'both',
    dayHint: 'Wednesday',
    duration: '25 min',
    tip: 'Build a winding domino trail across the rug or play a quiet round of Go Fish.',
    colorKey: 'mint',
    icon: 'puzzle',
  },
  {
    id: 'thu-evening',
    title: 'Cozy Book Light Reading',
    shortLabel: 'Book Light',
    ideas: 'Independent reading in bed with a book light',
    timePeriod: 'after',
    block: 'Evening: Wind Down',
    playMode: 'solo',
    dayHint: 'Thursday',
    duration: '20 min',
    tip: 'Tuck in early with a clip-on book light and read two chapters at your own pace.',
    colorKey: 'peach',
    icon: 'book',
  },
  {
    id: 'fri-evening',
    title: 'Friday Family Game Night',
    shortLabel: 'Game Night',
    ideas: 'Board games, charades, or indoor camping',
    timePeriod: 'after',
    block: 'Evening: Wind Down',
    playMode: 'group',
    dayHint: 'Friday',
    duration: '45 min',
    tip: 'Unroll sleeping bags in the living room for indoor camping or act out silly charades.',
    colorKey: 'rose',
    icon: 'tent',
  },

  // Boredom Jar Solo & Group extras
  {
    id: 'jar-comic-book',
    title: 'Write a Mini Comic Book',
    shortLabel: 'Comic Book',
    ideas: 'Create a 4-panel superhero or funny pet adventure',
    timePeriod: 'after',
    block: 'Boredom Jar',
    playMode: 'solo',
    dayHint: 'Anytime',
    duration: '25 min',
    tip: 'Give your hero a goofy weakness—like slipping on banana peels!',
    colorKey: 'butter',
    icon: 'palette',
  },
  {
    id: 'jar-handstands',
    title: 'Handstand & Balance Challenge',
    shortLabel: 'Gymnastics',
    ideas: 'Practice wall handstands, bridges, or slow-motion ninja walks',
    timePeriod: 'after',
    block: 'Boredom Jar',
    playMode: 'solo',
    dayHint: 'Anytime',
    duration: '15 min',
    tip: 'See how many seconds you can balance on one foot with your eyes closed.',
    colorKey: 'mint',
    icon: 'stretch',
  },
];

export const STICK_TIPS = [
  {
    title: 'Set up "invitations to play"',
    description:
      'Lay out the morning activity (like a puzzle or sketchpad) the night before so kids gravitate toward it without asking for screens.',
    colorKey: 'sky' as PastelColorKey,
  },
  {
    title: 'Keep a "Boredom Jar"',
    description:
      'Add extra ideas like building a cardboard castle, practicing handstands, or writing a comic book for high-energy transitions.',
    colorKey: 'lavender' as PastelColorKey,
  },
  {
    title: 'Rotate toys every two weeks',
    description:
      'Keep half the toys tucked away in a closet and swap them biweekly so old favorites feel brand new again.',
    colorKey: 'mint' as PastelColorKey,
  },
];

export interface QuickJarPreset {
  title: string;
  ideas: string;
  timePeriod: TimePeriod;
  playMode: PlayMode;
  colorKey: PastelColorKey;
  icon: ActivityIconKey;
}

export const QUICK_JAR_PRESETS: QuickJarPreset[] = [
  {
    title: 'Blanket Fort Hideout',
    ideas: 'Draped sheets, pillows, and a cozy book inside',
    timePeriod: 'after',
    playMode: 'group',
    colorKey: 'peach',
    icon: 'tent',
  },
  {
    title: 'Sidewalk Chalk Maze',
    ideas: 'Draw a winding path with hopscotch jumps',
    timePeriod: 'after',
    playMode: 'both',
    colorKey: 'sky',
    icon: 'palette',
  },
  {
    title: 'Origami Paper Boats',
    ideas: 'Fold paper boats and race them in a shallow tub',
    timePeriod: 'before',
    playMode: 'solo',
    colorKey: 'butter',
    icon: 'scissors',
  },
  {
    title: 'Living Room Bowling',
    ideas: 'Stack plastic cups and roll a soft sock ball',
    timePeriod: 'after',
    playMode: 'group',
    colorKey: 'mint',
    icon: 'soccer',
  },
  {
    title: 'Lego 10-Minute Tower',
    ideas: 'Build the tallest tower before the timer chimes',
    timePeriod: 'before',
    playMode: 'solo',
    colorKey: 'lavender',
    icon: 'blocks',
  },
  {
    title: 'Silly Freeze Dance',
    ideas: 'Play one upbeat song and freeze like statues',
    timePeriod: 'after',
    playMode: 'group',
    colorKey: 'rose',
    icon: 'music',
  },
];

export const BLOCK_AFFIRMATIONS: Record<ActivityBlock, string> = {
  'Morning (Before School)': 'Morning win! Screen-free start complete.',
  'After School: Decompress': 'Recharged and ready to go!',
  'After School: Focus & Create': 'Creative spark unlocked!',
  'Pre-Dinner: Pitch In': 'Great teamwork helping out!',
  'Evening: Wind Down': 'Calm, cozy, and ready for rest.',
  'Boredom Jar': 'Original idea brought to life!',
};

export function parseDurationMinutes(duration: string): number {
  const match = duration.match(/\d+/);
  if (!match) return 15;
  const parsed = Number.parseInt(match[0], 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 15;
}

