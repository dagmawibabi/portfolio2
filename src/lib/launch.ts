export const launchCategories = ['AI', 'Launch Videos', 'Keynotes'] as const;

export type LaunchVideo = {
	id: string;
	category: (typeof launchCategories)[number];
	// Publication date of the linked video/post, in YYYY-MM-DD format.
	date: string;
	featured?: boolean;
	title: string;
	creator: string;
	url: string;
	thumbnail: string;
} & (
	| { platform: 'X'; videoUrl: string }
	| { platform: 'YouTube'; videoId: string; startSeconds?: number }
);

// Add an entry with a category and date here. Each category sorts oldest first.
// featured pins an entry before the chronological list (ScholarXIV in AI).
// YouTube: use the video ID and https://i.ytimg.com/vi/VIDEO_ID/hqdefault.jpg.
// X: include the post URL, thumbnail, and public MP4 URL from its video metadata.
// Keep the original URL so viewers can visit the source if playback is unavailable.
export const launchVideos: LaunchVideo[] = [
	{
		id: 'tesla-cybertruck-unveiling',
		category: 'Keynotes',
		date: '2019-11-21',
		title: 'Tesla Cybertruck Unveiling',
		creator: 'Tesla · uploaded by DPCcars',
		platform: 'YouTube',
		url: 'https://www.youtube.com/watch?v=4Yf8GhqYREY',
		thumbnail: 'https://i.ytimg.com/vi/4Yf8GhqYREY/hqdefault.jpg',
		videoId: '4Yf8GhqYREY'
	},
	{
		id: 'prime-open-superintelligence',
		category: 'AI',
		date: '2026-07-08',
		title: 'The Open Superintelligence Stack',
		creator: 'Prime Intellect',
		platform: 'X',
		url: 'https://x.com/PrimeIntellect/status/2074899489190785419',
		thumbnail:
			'https://pbs.twimg.com/amplify_video_thumb/2074897472191856640/img/XsueiJW3JsPHJT0B.jpg',
		videoUrl:
			'https://video.twimg.com/amplify_video/2074897472191856640/vid/avc1/960x720/miXdrBr92gMAxhev.mp4'
	},
	{
		id: 'intellect-3',
		category: 'AI',
		date: '2025-11-27',
		title: 'Introducing INTELLECT-3',
		creator: 'Prime Intellect',
		platform: 'X',
		url: 'https://x.com/PrimeIntellect/status/1993895068290388134',
		thumbnail:
			'https://pbs.twimg.com/amplify_video_thumb/1993857731401580544/img/-_ZX7KRsBgKJpKx-.jpg',
		videoUrl:
			'https://video.twimg.com/amplify_video/1993857731401580544/vid/avc1/1280x720/8e2tEgyGUeJCQdSd.mp4'
	},
	{
		id: 'mark-ii',
		category: 'Launch Videos',
		date: '2026-05-14',
		title: 'Introducing Mark II',
		creator: 'Mark',
		platform: 'X',
		url: 'https://x.com/thinkwithmark/status/2054970441035354562',
		thumbnail:
			'https://pbs.twimg.com/amplify_video_thumb/2054967225249828864/img/tMx1m-48svqQI0Y4.jpg',
		videoUrl:
			'https://video.twimg.com/amplify_video/2054967225249828864/vid/avc1/1280x720/Tl1aBC2ATA0CohoV.mp4'
	},
	{
		id: 'fish-s21-pro',
		category: 'AI',
		date: '2026-07-28',
		title: 'Introducing S2.1 Pro',
		creator: 'Fish Audio',
		platform: 'X',
		url: 'https://x.com/FishAudio/status/2082152596739862853',
		thumbnail:
			'https://pbs.twimg.com/amplify_video_thumb/2082150306587009024/img/9la4doSn0hUu2b8Z.jpg',
		videoUrl:
			'https://video.twimg.com/amplify_video/2082150306587009024/vid/avc1/1280x720/S0rGejiC9vXEV5nG.mp4'
	},
	{
		id: 'neo-home-robot',
		category: 'Launch Videos',
		date: '2025-10-28',
		title: 'NEO The Home Robot',
		creator: '1X',
		platform: 'X',
		url: 'https://x.com/1x_tech/status/1983233494575952138',
		thumbnail:
			'https://pbs.twimg.com/amplify_video_thumb/1983232943272407042/img/e2u9_OSb9WKcTNCO.jpg',
		videoUrl:
			'https://video.twimg.com/amplify_video/1983232943272407042/vid/avc1/1280x720/pUXkd1zeF92BuyXl.mp4'
	},
	{
		id: '01-developer-preview',
		category: 'Launch Videos',
		date: '2024-03-21',
		title: 'Introducing the 01 Developer Preview',
		creator: 'Open Interpreter',
		platform: 'X',
		url: 'https://x.com/OpenInterpreter/status/1770821439458840846',
		thumbnail:
			'https://pbs.twimg.com/ext_tw_video_thumb/1770812296274612224/pu/img/dlwqaDJZSlxLPMrj.jpg',
		videoUrl:
			'https://video.twimg.com/ext_tw_video/1770812296274612224/pu/vid/avc1/960x720/GxnRxU1CDn99BbiC.mp4?tag=14'
	},
	{
		id: 'grok-bot',
		category: 'AI',
		date: '2026-08-11',
		title: 'Introducing Grok Bot',
		creator: 'Grok Bot',
		platform: 'X',
		url: 'https://x.com/bot/status/2087224798078517251',
		thumbnail:
			'https://pbs.twimg.com/amplify_video_thumb/2087221157787525120/img/n9OrR6nUrxVZL4oY.jpg',
		videoUrl:
			'https://video.twimg.com/amplify_video/2087221157787525120/vid/avc1/1280x720/QEwGx2N77OSsiKpg.mp4'
	},
	{
		id: 'anduril-menace',
		category: 'Launch Videos',
		date: '2025-05-05',
		title: 'Menace: Own the Edge',
		creator: 'Anduril Industries',
		platform: 'YouTube',
		url: 'https://www.youtube.com/watch?v=G05yUsHmd3M',
		thumbnail: 'https://i.ytimg.com/vi/G05yUsHmd3M/hqdefault.jpg',
		videoId: 'G05yUsHmd3M'
	},
	{
		id: 'anduril-pulsar-l',
		category: 'Launch Videos',
		date: '2025-04-29',
		title: 'Introducing: Pulsar-L',
		creator: 'Anduril Industries',
		platform: 'YouTube',
		url: 'https://www.youtube.com/watch?v=lO-TaVGEryE',
		thumbnail: 'https://i.ytimg.com/vi/lO-TaVGEryE/hqdefault.jpg',
		videoId: 'lO-TaVGEryE'
	},
	{
		id: 'anduril-menace-i',
		category: 'Launch Videos',
		date: '2026-06-30',
		title: 'Menace-I: Deployable Data Center',
		creator: 'Anduril Industries',
		platform: 'YouTube',
		url: 'https://www.youtube.com/watch?v=bSVonflfE0A',
		thumbnail: 'https://i.ytimg.com/vi/bSVonflfE0A/hqdefault.jpg',
		videoId: 'bSVonflfE0A'
	},
	{
		id: 'nvidia-gtc-taipei-2026',
		category: 'Keynotes',
		date: '2026-05-31',
		title: 'NVIDIA GTC Taipei 2026 Keynote',
		creator: 'NVIDIA',
		platform: 'YouTube',
		url: 'https://www.youtube.com/watch?v=wSp6AiNIrsY',
		thumbnail: 'https://i.ytimg.com/vi/wSp6AiNIrsY/hqdefault.jpg',
		videoId: 'wSp6AiNIrsY'
	},
	{
		id: 'blender-conference-2025',
		category: 'Keynotes',
		date: '2025-09-17',
		title: 'Keynote — Blender Conference 2025',
		creator: 'Blender',
		platform: 'YouTube',
		url: 'https://www.youtube.com/watch?v=JXm0-ilIknE',
		thumbnail: 'https://i.ytimg.com/vi/JXm0-ilIknE/hqdefault.jpg',
		videoId: 'JXm0-ilIknE'
	},
	{
		id: 'nvidia-ces-2025',
		category: 'Keynotes',
		date: '2025-01-06',
		title: 'NVIDIA CEO Jensen Huang Keynote at CES 2025',
		creator: 'NVIDIA',
		platform: 'YouTube',
		url: 'https://www.youtube.com/watch?v=k82RwXqZHY8',
		thumbnail: 'https://i.ytimg.com/vi/k82RwXqZHY8/hqdefault.jpg',
		videoId: 'k82RwXqZHY8'
	},
	{
		id: 'figma-config-2024',
		category: 'Keynotes',
		date: '2024-06-26',
		title: 'Config 2024: Figma product launch keynote',
		creator: 'Figma',
		platform: 'YouTube',
		url: 'https://www.youtube.com/watch?v=n5gJgkO2Dg0',
		thumbnail: 'https://i.ytimg.com/vi/n5gJgkO2Dg0/hqdefault.jpg',
		videoId: 'n5gJgkO2Dg0'
	},
	{
		id: 'make-with-notion-2024',
		category: 'Keynotes',
		date: '2024-10-24',
		title: 'Make With Notion 2024',
		creator: 'Notion',
		platform: 'YouTube',
		url: 'https://www.youtube.com/watch?v=UhHaVSd3h6U',
		thumbnail: 'https://i.ytimg.com/vi/UhHaVSd3h6U/hqdefault.jpg',
		videoId: 'UhHaVSd3h6U'
	},
	{
		id: 'framework-next-gen-2026',
		category: 'Keynotes',
		date: '2026-04-21',
		title: 'Framework [Next Gen] Event | 2026 Launch Event',
		creator: 'Framework',
		platform: 'YouTube',
		url: 'https://www.youtube.com/watch?v=rgZlzCd0DUU',
		thumbnail: 'https://i.ytimg.com/vi/rgZlzCd0DUU/hqdefault.jpg',
		videoId: 'rgZlzCd0DUU'
	},
	{
		id: 'tesla-cybercab',
		category: 'Keynotes',
		date: '2024-10-10',
		title: 'We, Robot | Tesla Cybercab Unveil',
		creator: 'Tesla',
		platform: 'YouTube',
		url: 'https://www.youtube.com/watch?v=6v6dbxPlsXs',
		thumbnail: 'https://i.ytimg.com/vi/6v6dbxPlsXs/hqdefault.jpg',
		videoId: '6v6dbxPlsXs'
	},
	{
		id: 'heypcb-multiplayer',
		category: 'Launch Videos',
		date: '2026-09-26',
		title: 'Multiplayer for PCB design',
		creator: 'HeyPCB',
		platform: 'X',
		url: 'https://x.com/justinplaygame/status/2103955275640447314',
		thumbnail:
			'https://pbs.twimg.com/amplify_video_thumb/2103955059700912128/img/eEb_ALvhlNQYR-Co.jpg',
		videoUrl:
			'https://video.twimg.com/amplify_video/2103955059700912128/vid/avc1/1152x720/Hwh8iTJ-eIaZI_Ec.mp4'
	},
	{
		id: 'pioneer-labs',
		category: 'Launch Videos',
		date: '2026-09-22',
		title: 'A first step toward terraforming Mars',
		creator: 'Pioneer Labs',
		platform: 'X',
		url: 'https://x.com/erika_alden_d/status/2102428491493085524',
		thumbnail:
			'https://pbs.twimg.com/amplify_video_thumb/2102424519378141184/img/n9SNNdWNVbcJWrKx.jpg',
		videoUrl:
			'https://video.twimg.com/amplify_video/2102424519378141184/vid/avc1/1280x720/GSn12gTWAq46hsGa.mp4'
	},
	{
		id: 'claude-opus-5',
		category: 'AI',
		date: '2026-07-24',
		title: 'Introducing Claude Opus 5',
		creator: 'Anthropic',
		platform: 'X',
		url: 'https://x.com/claudeai/status/2080699495453528290',
		thumbnail: 'https://pbs.twimg.com/media/HOAifjuWcAESshR.jpg',
		videoUrl:
			'https://video.twimg.com/amplify_video/2080694541246517248/vid/avc1/720x900/w8B1GadVkPavoUYO.mp4'
	},
	{
		id: 'kimi-k3',
		category: 'AI',
		date: '2026-07-16',
		title: 'Meet Kimi K3',
		creator: 'Kimi',
		platform: 'X',
		url: 'https://x.com/Kimi_Moonshot/status/2077821890207547467',
		thumbnail:
			'https://pbs.twimg.com/amplify_video_thumb/2077820634730749952/img/KENdSRAAtLxhYjpD.jpg',
		videoUrl:
			'https://video.twimg.com/amplify_video/2077820634730749952/vid/avc1/1280x720/ISA1v1-6h0XtjlNE.mp4'
	},
	{
		id: 'gpt-6-astra',
		category: 'AI',
		date: '2026-09-03',
		title: 'This is GPT-6 Astra',
		creator: 'OpenAI',
		platform: 'X',
		url: 'https://x.com/OpenAI/status/2095595741528125780',
		thumbnail:
			'https://pbs.twimg.com/amplify_video_thumb/2095595661559574528/img/Vmb2pgEFJ6fpCUTD.jpg',
		videoUrl:
			'https://video.twimg.com/amplify_video/2095595661559574528/vid/avc1/1280x720/Cv4dXuFNWqERUUJd.mp4'
	},
	{
		id: 'rabbit-r1',
		category: 'Keynotes',
		date: '2024-01-09',
		title: 'Introducing r1',
		creator: 'rabbit',
		platform: 'YouTube',
		url: 'https://www.youtube.com/watch?v=22wlLy7hKP4',
		thumbnail: 'https://i.ytimg.com/vi/22wlLy7hKP4/hqdefault.jpg',
		videoId: '22wlLy7hKP4'
	},
	{
		id: 'iphone-keynote',
		category: 'Keynotes',
		date: '2013-05-16',
		title: 'iPhone — Steve Jobs at Macworld 2007',
		creator: 'Apple · uploaded by Protectstar',
		platform: 'YouTube',
		url: 'https://www.youtube.com/watch?v=VQKMoT-6XSg',
		thumbnail: 'https://i.ytimg.com/vi/VQKMoT-6XSg/hqdefault.jpg',
		videoId: 'VQKMoT-6XSg'
	},
	{
		id: 'meta-connect-2026',
		category: 'Keynotes',
		date: '2026-09-23',
		title: 'Meta Connect Keynote 2026',
		creator: 'Meta',
		platform: 'YouTube',
		url: 'https://www.youtube.com/watch?v=SdKFDIAGF24',
		thumbnail: 'https://i.ytimg.com/vi/SdKFDIAGF24/hqdefault.jpg',
		videoId: 'SdKFDIAGF24'
	},
	{
		id: 'meta-connect-2025',
		category: 'Keynotes',
		date: '2025-09-17',
		title: 'Meta Connect 2025: Opening Keynote',
		creator: 'Meta Developers',
		platform: 'YouTube',
		url: 'https://www.youtube.com/watch?v=D97ILdUbYww&t=4733s',
		thumbnail: 'https://i.ytimg.com/vi/D97ILdUbYww/hqdefault.jpg',
		videoId: 'D97ILdUbYww',
		startSeconds: 4733
	},
	{
		id: 'gpt-4o',
		category: 'AI',
		date: '2024-05-13',
		title: 'Introducing GPT-4o',
		creator: 'OpenAI',
		platform: 'YouTube',
		url: 'https://www.youtube.com/watch?v=DQacCB9tDaw',
		thumbnail: 'https://i.ytimg.com/vi/DQacCB9tDaw/hqdefault.jpg',
		videoId: 'DQacCB9tDaw'
	},
	{
		id: 'scholarxiv',
		category: 'AI',
		date: '2026-05-15',
		featured: true,
		title: 'Introducing ScholarXIV',
		creator: 'Dagmawi Babi',
		platform: 'YouTube',
		url: 'https://www.youtube.com/watch?v=Zy_m1-px-fQ',
		thumbnail: 'https://i.ytimg.com/vi/Zy_m1-px-fQ/hqdefault.jpg',
		videoId: 'Zy_m1-px-fQ'
	}
];

export const launchGroups = launchCategories.map((category) => ({
	category,
	id: category.toLowerCase().replaceAll(' ', '-'),
	videos: launchVideos
		.filter((video) => video.category === category)
		.sort(
			(a, b) =>
				Number(Boolean(b.featured)) - Number(Boolean(a.featured)) || a.date.localeCompare(b.date)
		)
}));
