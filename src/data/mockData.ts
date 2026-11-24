import type {
  ActivityItem,
  AiResponse,
  ChatMessage,
  HowItWorksStep,
  LearnModule,
  Match,
  MatchCategory,
  MatchPreview,
  NavItem,
  SkillProgress,
  UpcomingSwap,
} from '../types'

export const currentUser = {
  name: 'Aisha Sharma',
  firstName: 'Aisha',
  initials: 'AS',
  role: 'Product design student',
  headline: 'Design student learning Spanish',
  credits: 12,
  teaches: 'UI Design',
  wants: 'Spanish',
  streak: 5,
  availability: 'Evenings after 6 PM',
}

export const navItems: NavItem[] = [
  { label: 'Home', to: '/' },
  { label: 'Match Hub', to: '/match' },
  { label: 'Swap Sessions', to: '/swap' },
  { label: 'Learn', to: '/learn' },
  { label: 'Dashboard', to: '/dashboard' },
]

export const guideNavItem: NavItem = { label: 'AI Guide', to: '/guide' }

export const matchPreview: MatchPreview = {
  compatibility: 96,
  durationMinutes: 25,
  reason: 'You both teach exactly what the other person wants to learn.',
  aisha: {
    name: 'Aisha Sharma',
    initials: 'AS',
    role: 'You',
    teaches: 'UI Design',
    wants: 'Spanish',
    rating: 4.9,
    swaps: 18,
  },
  rohan: {
    name: 'Rohan Mehta',
    initials: 'RM',
    role: 'Your match',
    teaches: 'Spanish',
    wants: 'UI Design',
    rating: 4.8,
    swaps: 24,
  },
}

export const howItWorksSteps: HowItWorksStep[] = [
  {
    step: '01',
    label: 'List',
    title: 'Show what you know',
    description:
      'Add the skills you can teach and the ones you are curious to learn. No résumé required.',
    icon: 'list',
  },
  {
    step: '02',
    label: 'Match',
    title: 'Find your perfect swap',
    description:
      'We surface people whose skills complement yours, so every swap is a fair exchange.',
    icon: 'sparkles',
  },
  {
    step: '03',
    label: 'Swap',
    title: 'Meet face to face',
    description:
      'Hop into a focused 25-minute video session. Teach, practice, and ask real questions.',
    icon: 'video',
  },
  {
    step: '04',
    label: 'Build Proof',
    title: 'Make your growth visible',
    description:
      'Every completed swap adds to your proof of skill. Show what you can do, not just what you watched.',
    icon: 'proof',
  },
]

export const matchCategories: Array<'All' | MatchCategory> = [
  'All',
  'Languages',
  'Design',
  'Code',
  'Music',
  'Photography',
  'Cooking',
  'Business',
  'Communication',
  'Data',
  'Games',
]

export const matches: Match[] = [
  {
    id: 'rohan-mehta',
    name: 'Rohan Mehta',
    initials: 'RM',
    tone: 'teal',
    headline: 'Spanish tutor & language exchange regular',
    bio: 'I grew up between Mumbai and Madrid and love helping people get comfortable speaking Spanish out loud. In return, I am finally learning my way around product design.',
    teaches: ['Spanish', 'Conversation'],
    wants: ['UI Design', 'Figma'],
    category: 'Languages',
    rating: 4.8,
    swaps: 24,
    availability: 'week',
    compatibility: 96,
    reason:
      'You both teach exactly what the other person wants to learn — a clean, two-way swap with no filler.',
    slots: ['Tomorrow, 4:00 PM', 'Friday, 11:30 AM', 'Saturday, 10:00 AM'],
  },
  {
    id: 'diego-alvarez',
    name: 'Diego Alvarez',
    initials: 'DA',
    tone: 'amber',
    headline: 'Native Spanish speaker, product tinkerer',
    bio: 'I teach practical Spanish for design and tech conversations. I want to learn enough UI design to stop bothering my colleagues with every tiny Figma question.',
    teaches: ['Spanish', 'Public Speaking'],
    wants: ['UI Design', 'Design systems'],
    category: 'Languages',
    rating: 4.9,
    swaps: 31,
    availability: 'now',
    compatibility: 94,
    reason:
      'Diego teaches conversational Spanish and is actively looking for a patient UI Design guide.',
    slots: ['Today, 7:30 PM', 'Tomorrow, 9:00 AM', 'Sunday, 3:00 PM'],
  },
  {
    id: 'priya-nair',
    name: 'Priya Nair',
    initials: 'PN',
    tone: 'rose',
    headline: 'Data analyst by day, workshop host by night',
    bio: 'I turn messy spreadsheets into clear stories. I can teach the analytics basics that actually matter at work, and I would love help sounding confident on stage.',
    teaches: ['Data Analytics', 'Excel'],
    wants: ['Public Speaking'],
    category: 'Data',
    rating: 4.7,
    swaps: 17,
    availability: 'week',
    compatibility: 91,
    reason:
      'Priya can demystify data while you help her structure and deliver a calm three-minute talk.',
    slots: ['Thursday, 6:00 PM', 'Saturday, 9:30 AM'],
  },
  {
    id: 'noah-williams',
    name: 'Noah Williams',
    initials: 'NW',
    tone: 'blue',
    headline: 'Session guitarist learning product design',
    bio: 'I have played guitar for twelve years and can get almost anyone through their first chords. I am a complete beginner at Figma and would rather learn by doing.',
    teaches: ['Guitar', 'Songwriting'],
    wants: ['Figma', 'UI Design'],
    category: 'Music',
    rating: 4.8,
    swaps: 22,
    availability: 'weekend',
    compatibility: 88,
    reason:
      'You want a creative outlet and Noah wants a design start — two first steps that line up nicely.',
    slots: ['Saturday, 2:00 PM', 'Sunday, 11:00 AM'],
  },
  {
    id: 'sofia-rossi',
    name: 'Sofia Rossi',
    initials: 'SR',
    tone: 'rose',
    headline: 'Home cook with a soft spot for film photography',
    bio: 'I can teach you three Italian dishes that look impressive but are genuinely weeknight-friendly. I just bought a camera and have no idea what I am doing.',
    teaches: ['Italian Cooking', 'Meal prep'],
    wants: ['Photography'],
    category: 'Cooking',
    rating: 4.9,
    swaps: 19,
    availability: 'weekend',
    compatibility: 86,
    reason:
      'Sofia wants a patient photography guide, and she has a hands-on kitchen lesson ready for you.',
    slots: ['Sunday, 12:30 PM', 'Next Tuesday, 6:30 PM'],
  },
  {
    id: 'kenji-tanaka',
    name: 'Kenji Tanaka',
    initials: 'KT',
    tone: 'slate',
    headline: 'Full-stack developer and Japanese conversation partner',
    bio: 'I can help you get past textbook Japanese and into real conversation. I am picking up React properly this year and want a project-based learning partner.',
    teaches: ['Japanese', 'Conversation'],
    wants: ['React', 'TypeScript'],
    category: 'Languages',
    rating: 4.7,
    swaps: 15,
    availability: 'week',
    compatibility: 84,
    reason:
      'A relaxed language exchange with someone who is equally serious about learning a technical skill.',
    slots: ['Wednesday, 8:00 PM', 'Saturday, 8:30 AM'],
  },
  {
    id: 'amara-okafor',
    name: 'Amara Okafor',
    initials: 'AO',
    tone: 'amber',
    headline: 'Communication coach & spreadsheet beginner',
    bio: 'I help people say the thing they actually mean, without memorising a script. I am looking for a no-judgement introduction to Excel formulas.',
    teaches: ['Public Speaking', 'Storytelling'],
    wants: ['Excel'],
    category: 'Communication',
    rating: 4.8,
    swaps: 28,
    availability: 'now',
    compatibility: 82,
    reason:
      'Amara is great at untangling nerves, and her teaching style matches your preference for practice over theory.',
    slots: ['Today, 5:30 PM', 'Friday, 10:00 AM'],
  },
  {
    id: 'liam-obrien',
    name: "Liam O'Brien",
    initials: 'LO',
    tone: 'blue',
    headline: 'Street photographer and weekend guitar learner',
    bio: 'I can teach you to find better light with the camera you already own. I am trying to learn three songs on guitar before my sister’s wedding.',
    teaches: ['Photography', 'Photo editing'],
    wants: ['Guitar'],
    category: 'Photography',
    rating: 4.6,
    swaps: 13,
    availability: 'weekend',
    compatibility: 80,
    reason:
      'Liam can take the mystery out of your phone camera while you help him prepare a tiny guitar set.',
    slots: ['Saturday, 4:00 PM', 'Sunday, 9:00 AM'],
  },
  {
    id: 'elena-petrova',
    name: 'Elena Petrova',
    initials: 'EP',
    tone: 'rose',
    headline: 'Chess coach and lifelong language learner',
    bio: 'I teach chess openings without the intimidating jargon. I am working on conversational Spanish and would like a partner who enjoys slow, repetitive practice.',
    teaches: ['Chess', 'Strategy'],
    wants: ['Spanish'],
    category: 'Games',
    rating: 4.7,
    swaps: 16,
    availability: 'week',
    compatibility: 78,
    reason:
      'Elena is patient, structured, and genuinely invested in steady language progress — not quick wins.',
    slots: ['Thursday, 7:00 PM', 'Sunday, 5:30 PM'],
  },
  {
    id: 'marcus-lee',
    name: 'Marcus Lee',
    initials: 'ML',
    tone: 'teal',
    headline: 'Front-end engineer moving into UX research',
    bio: 'I build React interfaces all day and want to understand the research behind them. I can teach you enough React to ship a small idea without feeling lost.',
    teaches: ['React', 'TypeScript'],
    wants: ['UX Research', 'UI Design'],
    category: 'Code',
    rating: 4.8,
    swaps: 21,
    availability: 'now',
    compatibility: 76,
    reason:
      'Marcus brings a practical coding session, and your design background gives him the user lens he is missing.',
    slots: ['Today, 8:00 PM', 'Wednesday, 6:30 PM'],
  },
  {
    id: 'zara-ahmed',
    name: 'Zara Ahmed',
    initials: 'ZA',
    tone: 'slate',
    headline: 'Digital marketer learning to edit video',
    bio: 'I can teach you how to get a small idea in front of the right people without a big budget. I am looking for help making my first proper video edit.',
    teaches: ['Digital Marketing', 'Copywriting'],
    wants: ['Video Editing'],
    category: 'Business',
    rating: 4.6,
    swaps: 11,
    availability: 'week',
    compatibility: 74,
    reason:
      'A useful crossover: Zara can sharpen your story, and you can trade creative feedback on her first edit.',
    slots: ['Friday, 3:00 PM', 'Saturday, 11:30 AM'],
  },
  {
    id: 'mina-patel',
    name: 'Mina Patel',
    initials: 'MP',
    tone: 'teal',
    headline: 'Product designer learning everyday Spanish',
    bio: 'I have been designing mobile products for four years and love teaching the small Figma habits that save hours. I want to order dinner in Spanish without pointing.',
    teaches: ['UI Design', 'Figma'],
    wants: ['Spanish'],
    category: 'Design',
    rating: 4.9,
    swaps: 26,
    availability: 'weekend',
    compatibility: 72,
    reason:
      'Mina is another designer, but her Spanish goal and your teaching style make this a useful cross-skill swap.',
    slots: ['Saturday, 1:00 PM', 'Sunday, 4:30 PM'],
  },
]

export const modules: LearnModule[] = [
  {
    id: 'figma-fundamentals',
    title: 'Figma Fundamentals',
    description:
      'Move from messy artboards to a clean, reusable design file. A practical path through frames, auto layout, components, and a shareable prototype.',
    category: 'Design',
    level: 'Beginner',
    icon: 'figma',
    accent: 'teal',
    durationMinutes: 62,
    lessons: [
      {
        id: 'figma-1',
        title: 'The Figma canvas tour',
        durationMinutes: 8,
        description:
          'Learn how frames, groups, pages, and the layers panel fit together so your files stop fighting back.',
        takeaways: [
          'Use frames for screens, groups for related layers',
          'Name layers before a file grows, not after',
          'Keep explorations on a separate page from the final flow',
        ],
      },
      {
        id: 'figma-2',
        title: 'Auto layout essentials',
        durationMinutes: 14,
        description:
          'Build layouts that respond properly instead of nudging every element by hand.',
        takeaways: [
          'Choose horizontal or vertical direction before spacing',
          'Use padding for the container and gap for the children',
          'Set resizing behavior deliberately for text and buttons',
        ],
      },
      {
        id: 'figma-3',
        title: 'Components & variants',
        durationMinutes: 18,
        description:
          'Turn repeated UI into a small system with clear properties and predictable states.',
        takeaways: [
          'Start with the smallest repeated unit',
          'Use variants for meaningful states, not every tiny difference',
          'Expose only the properties another designer needs',
        ],
      },
      {
        id: 'figma-4',
        title: 'Prototype a click-through',
        durationMinutes: 22,
        description:
          'Connect your screens into a short story someone can test without a walkthrough.',
        takeaways: [
          'Prototype one primary flow before adding edge cases',
          'Use smart animate for spatial continuity, not decoration',
          'Share the prototype with presentation settings hidden',
        ],
      },
    ],
  },
  {
    id: 'spanish-for-beginners',
    title: 'Spanish for Beginners',
    description:
      'The first conversations that actually come up: greetings, ordering, small talk, and introducing yourself with less overthinking.',
    category: 'Languages',
    level: 'Beginner',
    icon: 'languages',
    accent: 'amber',
    durationMinutes: 60,
    lessons: [
      {
        id: 'spanish-1',
        title: 'Greetings that stick',
        durationMinutes: 10,
        description:
          'Learn a small set of greetings you can use before you feel ready for a full conversation.',
        takeaways: [
          'Choose one greeting and use it until it feels natural',
          'Notice formal versus casual address early',
          'Practice the rhythm out loud, not only on paper',
        ],
      },
      {
        id: 'spanish-2',
        title: 'Ordering without panic',
        durationMinutes: 16,
        description:
          'A café script you can adapt: ask for something, check the price, and say thank you like a person.',
        takeaways: [
          '“Quisiera” is a gentle way to ask for something',
          'Learn one follow-up phrase for when you miss the answer',
          'You do not need a perfect sentence to be understood',
        ],
      },
      {
        id: 'spanish-3',
        title: 'The past tense shortcut',
        durationMinutes: 20,
        description:
          'A tiny, useful pattern for talking about what you did yesterday without a grammar lecture.',
        takeaways: [
          'Start with the most common regular verbs',
          'Anchor new tense forms to a real sentence about your day',
          'Aim for clear, not exhaustive',
        ],
      },
      {
        id: 'spanish-4',
        title: 'A 60-second intro',
        durationMinutes: 14,
        description:
          'Build and rehearse a short introduction covering who you are, what you do, and what you are learning.',
        takeaways: [
          'Keep the first version under five sentences',
          'Record yourself once and listen for pace',
          'Bring this intro to your next swap as a warm-up',
        ],
      },
    ],
  },
  {
    id: 'public-speaking-101',
    title: 'Public Speaking 101',
    description:
      'A calm, practical toolkit for short talks, demos, and the moment someone asks you to “say a few words.”',
    category: 'Communication',
    level: 'Beginner',
    icon: 'presentation',
    accent: 'rose',
    durationMinutes: 58,
    lessons: [
      {
        id: 'speaking-1',
        title: 'Open with a hook',
        durationMinutes: 12,
        description:
          'Skip the throat-clearing and give your audience a reason to lean in during the first twenty seconds.',
        takeaways: [
          'Open with a concrete moment, question, or number',
          'Save your name and agenda for after the hook',
          'Write the first line separately and rehearse it more',
        ],
      },
      {
        id: 'speaking-2',
        title: 'Structure a 3-minute talk',
        durationMinutes: 18,
        description:
          'A simple beginning, turn, and landing structure that fits almost any short presentation.',
        takeaways: [
          'One talk, one sentence you want remembered',
          'Use three beats rather than ten bullet points',
          'End on the idea, not a rushed thank-you',
        ],
      },
      {
        id: 'speaking-3',
        title: 'Pace, pause, project',
        durationMinutes: 15,
        description:
          'Three vocal habits that make nervous speaking sound intentional instead of rushed.',
        takeaways: [
          'Pause after a key point instead of filling space',
          'Speak to the back of the room when practicing',
          'Mark breathing points directly on your notes',
        ],
      },
      {
        id: 'speaking-4',
        title: 'Handling Q&A nerves',
        durationMinutes: 13,
        description:
          'Buy yourself a breath, answer the question you heard, and keep your exit clean.',
        takeaways: [
          'Repeat the question to buy a thinking beat',
          'It is okay to say “I do not know yet”',
          'Keep a closing sentence ready for the final question',
        ],
      },
    ],
  },
  {
    id: 'react-essentials',
    title: 'React Essentials',
    description:
      'Build a small interface without losing track of state. Components, state, effects, and a final data-driven page.',
    category: 'Code',
    level: 'Intermediate',
    icon: 'code',
    accent: 'blue',
    durationMinutes: 98,
    lessons: [
      {
        id: 'react-1',
        title: 'Thinking in components',
        durationMinutes: 18,
        description:
          'Break a screen into pieces with clear jobs before you start writing code.',
        takeaways: [
          'Split when a piece has a name and a purpose',
          'Pass data down, keep local state local',
          'Prefer small components over clever abstractions',
        ],
      },
      {
        id: 'react-2',
        title: 'State without spaghetti',
        durationMinutes: 24,
        description:
          'Choose where state lives and keep updates predictable as the interface grows.',
        takeaways: [
          'Store the smallest version of the truth',
          'Derive what you can instead of syncing copies',
          'Use a reducer when several fields change together',
        ],
      },
      {
        id: 'react-3',
        title: 'Effects and cleanup',
        durationMinutes: 26,
        description:
          'Connect to the browser without leaking timers, listeners, or subscriptions.',
        takeaways: [
          'An effect should have one clear external job',
          'Always pair a subscription with cleanup',
          'If no external system is involved, you probably do not need an effect',
        ],
      },
      {
        id: 'react-4',
        title: 'Ship a data-driven page',
        durationMinutes: 30,
        description:
          'Bring loading, empty, and error states together in a page that feels finished.',
        takeaways: [
          'Design the empty state before the happy path',
          'Keep the loading layout close to the final layout',
          'Test with slow network conditions once',
        ],
      },
    ],
  },
  {
    id: 'photography-basics',
    title: 'Photography Basics',
    description:
      'Better photos with the camera you already have. Start with light, learn the exposure triangle, and build a small visual story.',
    category: 'Photography',
    level: 'Beginner',
    icon: 'camera',
    accent: 'green',
    durationMinutes: 66,
    lessons: [
      {
        id: 'photo-1',
        title: 'Light before gear',
        durationMinutes: 12,
        description:
          'Recognise the difference between hard, soft, and directional light before touching a setting.',
        takeaways: [
          'Window light is often the most forgiving light',
          'Look at the shadows before the subject',
          'Move your feet before changing your lens',
        ],
      },
      {
        id: 'photo-2',
        title: 'The exposure triangle',
        durationMinutes: 20,
        description:
          'A friendly introduction to aperture, shutter speed, and ISO that explains what changes what.',
        takeaways: [
          'Aperture changes depth of field and light',
          'Shutter speed freezes or blurs motion',
          'Raise ISO last when light is low',
        ],
      },
      {
        id: 'photo-3',
        title: 'Framing with intention',
        durationMinutes: 16,
        description:
          'Use edges, layers, and negative space to make a snapshot feel composed.',
        takeaways: [
          'Decide what the photo is about before you frame it',
          'Try a low and high angle in the same spot',
          'Give moving subjects somewhere to travel into',
        ],
      },
      {
        id: 'photo-4',
        title: 'A 10-shot mini story',
        durationMinutes: 18,
        description:
          'Turn ten ordinary photos into a small sequence with a beginning, middle, and end.',
        takeaways: [
          'Open wide to establish the scene',
          'Mix details with wider context',
          'Choose one image as the ending, not the leftover',
        ],
      },
    ],
  },
  {
    id: 'personal-finance',
    title: 'Personal Finance',
    description:
      'A low-drama starting point for understanding where your money goes, building a buffer, and automating the boring parts.',
    category: 'Life',
    level: 'Beginner',
    icon: 'wallet',
    accent: 'slate',
    durationMinutes: 60,
    lessons: [
      {
        id: 'finance-1',
        title: 'Know your money map',
        durationMinutes: 12,
        description:
          'A quick, judgment-free review of what comes in, what goes out, and what you are actually saving.',
        takeaways: [
          'Look at three months, not one unusual week',
          'Separate fixed commitments from flexible spending',
          'Name one expense that does not match your priorities',
        ],
      },
      {
        id: 'finance-2',
        title: 'The 50/30/20 starting point',
        durationMinutes: 18,
        description:
          'Use a simple split as a conversation starter, not a rule you have to obey perfectly.',
        takeaways: [
          'Start with needs, wants, and future-you',
          'Adjust percentages for your real cost of living',
          'A rough plan you use beats a perfect plan you abandon',
        ],
      },
      {
        id: 'finance-3',
        title: 'Build a tiny emergency fund',
        durationMinutes: 16,
        description:
          'Make the first buffer feel achievable, even when a full emergency fund sounds impossible.',
        takeaways: [
          'Start with one small, specific target',
          'Keep the buffer separate from daily spending',
          'Replenish it without treating it as failure',
        ],
      },
      {
        id: 'finance-4',
        title: 'Automate the boring parts',
        durationMinutes: 14,
        description:
          'Set up a simple rhythm so saving and bill-paying do not rely on remembering.',
        takeaways: [
          'Automate the smallest reliable amount first',
          'Align transfers with when money actually arrives',
          'Review once a month, not every day',
        ],
      },
    ],
  },
]

export const initialCompletedLessons: Record<string, string[]> = {
  'figma-fundamentals': ['figma-1', 'figma-2', 'figma-3'],
  'spanish-for-beginners': ['spanish-1'],
}

export const upcomingSwap: UpcomingSwap = {
  partnerName: 'Rohan Mehta',
  partnerInitials: 'RM',
  partnerTone: 'teal',
  topic: 'UI Design ↔ Spanish',
  when: 'Tomorrow, 4:00 PM',
  durationMinutes: 25,
  roomId: 'SWP428',
  matchId: 'rohan-mehta',
}

export const dashboardBaseline = {
  completedSwaps: 12,
  learningHours: 8.5,
  streak: 5,
}

export const skillProgress: SkillProgress[] = [
  {
    name: 'UI Design',
    role: 'Teaching',
    level: 78,
    note: '18 swaps completed',
  },
  {
    name: 'Spanish',
    role: 'Learning',
    level: 42,
    note: 'A2 conversation level',
  },
  {
    name: 'Public Speaking',
    role: 'Learning',
    level: 25,
    note: 'Working on pacing',
  },
]

export const weeklyActivity = [
  { day: 'Mon', minutes: 45 },
  { day: 'Tue', minutes: 90 },
  { day: 'Wed', minutes: 30 },
  { day: 'Thu', minutes: 120 },
  { day: 'Fri', minutes: 60 },
  { day: 'Sat', minutes: 150 },
  { day: 'Sun', minutes: 75 },
]

export const recentActivity: ActivityItem[] = [
  {
    id: 'activity-1',
    icon: 'swap',
    title: 'Completed a swap with Rohan Mehta',
    detail: 'UI Design ↔ Spanish · 25 min',
    time: 'Yesterday',
  },
  {
    id: 'activity-2',
    icon: 'lesson',
    title: 'Finished “Components & variants”',
    detail: 'Figma Fundamentals · +1 credit',
    time: '2 days ago',
  },
  {
    id: 'activity-3',
    icon: 'match',
    title: 'New 94% match with Diego Alvarez',
    detail: 'Spanish ↔ UI Design',
    time: '3 days ago',
  },
  {
    id: 'activity-4',
    icon: 'streak',
    title: 'Reached a 5-day swap streak',
    detail: 'Keep the momentum going',
    time: '4 days ago',
  },
]

export const pastSessions = [
  {
    id: 'past-1',
    partnerName: 'Priya Nair',
    partnerInitials: 'PN',
    partnerTone: 'rose' as const,
    topic: 'Public Speaking ↔ Data Analytics',
    date: 'Oct 18',
    durationMinutes: 25,
    rating: 5,
    credits: 4,
  },
  {
    id: 'past-2',
    partnerName: 'Noah Williams',
    partnerInitials: 'NW',
    partnerTone: 'blue' as const,
    topic: 'Figma ↔ Guitar',
    date: 'Oct 12',
    durationMinutes: 25,
    rating: 4,
    credits: 4,
  },
]

export const demoRoom = {
  code: 'SWP428',
  durationMinutes: 25,
}

export const sessionAgenda = [
  { id: 'agenda-1', label: 'Warm-up and intros', minutes: 3 },
  { id: 'agenda-2', label: 'Aisha teaches UI Design', minutes: 10 },
  { id: 'agenda-3', label: 'Rohan teaches Spanish', minutes: 10 },
  { id: 'agenda-4', label: 'Wrap-up and next steps', minutes: 2 },
]

export const aiSuggestions = [
  'Find me a design swap',
  'How do credits work?',
  'Help me prepare for a session',
  'What should I teach?',
]

export const initialAiMessages: ChatMessage[] = [
  {
    id: 'ai-welcome',
    role: 'assistant',
    content:
      "Hi Aisha — I'm your swap guide. I can help you find a match, prep for a session, or make sense of credits. What are we working on?",
  },
]

export const aiResponses: AiResponse[] = [
  {
    keywords: ['match', 'find', 'design', 'spanish', 'recommend', 'swap with'],
    content:
      'Rohan Mehta is your strongest match right now — 96% compatible. He teaches conversational Spanish and wants to learn UI Design, so you both have something real to trade. Want to browse the Match Hub and say hello?',
    action: { label: 'Open Match Hub', to: '/match' },
  },
  {
    keywords: ['credit', 'credits', 'points', 'cost', 'pay', 'payment'],
    content:
      'Credits are demo currency that keeps swaps feeling reciprocal. You start with 12, earn a few by completing lessons or swaps, and spend them on sessions. No money changes hands — this is a prototype balance.',
    action: { label: 'View dashboard', to: '/dashboard' },
  },
  {
    keywords: ['prepare', 'session', 'nervous', 'first swap', 'before', 'ready'],
    content:
      'Keep your first swap small. Pick one thing you can teach in ten minutes, prepare one question for your partner, and test your mic and camera before joining. A 25-minute session is plenty for a first trade.',
    action: { label: 'Open Swap Sessions', to: '/swap' },
  },
  {
    keywords: ['teach', 'what should i teach', 'my skill', 'offer'],
    content:
      'You already have a strong teaching skill: UI Design. A useful first lesson is “three Figma habits that save time” — concrete, visual, and easy to practise together. Bring one example file and let them try.',
    action: { label: 'See learning modules', to: '/learn' },
  },
  {
    keywords: ['technical', 'camera', 'mic', 'connection', 'video', 'webrtc'],
    content:
      'The call experience in this build is a simulated preview. Camera, microphone, and connection states are mocked for design review — real WebRTC arrives in the next phase. For now, explore the pre-call and in-call screens freely.',
    action: { label: 'Preview a session', to: '/swap/SWP428?partner=rohan-mehta' },
  },
  {
    keywords: ['hi', 'hello', 'hey', 'help', 'start'],
    content:
      'Happy to help. I can suggest a match, explain how credits work, or help you plan a 25-minute swap. What sounds most useful?',
  },
]

export const aiFallback =
  'I can help with matches, credits, and preparing for a swap. Try asking “Find me a Spanish swap” or “How do credits work?” — this prototype assistant sticks to the script.'

export const demoStats = {
  learningMinutes: 512,
}

export const notificationCount = 3
