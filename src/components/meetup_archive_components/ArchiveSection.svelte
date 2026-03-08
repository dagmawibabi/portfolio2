<script lang="ts">
	import { Play } from 'lucide-svelte';
	import type { SessionLink, VideoItem, VideoSection } from './types';

	export let videoSections: VideoSection[] = [];

	$: initialPlayers = Object.fromEntries(
		videoSections.map((section) => [section.id, section.items[0]])
	) as Record<string, VideoItem>;

	let activePlayers: Record<string, VideoItem> = {};
	let selectedSectionId = '';

	$: if (videoSections.length && !selectedSectionId) {
		selectedSectionId = videoSections[0].id;
	}

	$: if (Object.keys(initialPlayers).length && Object.keys(activePlayers).length === 0) {
		activePlayers = initialPlayers;
	}

	$: selectedSection =
		videoSections.find((section) => section.id === selectedSectionId) ?? videoSections[0];
	$: selectedVideo = selectedSection
		? activePlayers[selectedSection.id] ?? selectedSection.items[0]
		: undefined;

	function getVideoId(url: string): string {
		try {
			const parsed = new URL(url);
			if (parsed.hostname.includes('youtu.be')) return parsed.pathname.slice(1);
			if (parsed.hostname.includes('youtube.com')) return parsed.searchParams.get('v') ?? '';
		} catch {
			return '';
		}

		return '';
	}

	function embedUrl(url: string): string {
		const id = getVideoId(url);
		return id ? `https://www.youtube.com/embed/${id}?rel=0` : '';
	}

	function thumbnailUrl(url: string): string {
		const id = getVideoId(url);
		return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : '';
	}

	function externalLink(url: string, label: string): string {
		return `<a href="${url}" target="_blank" rel="noreferrer">${label}</a>`;
	}

	function speakerMarkup(item: VideoItem): string {
		switch (item.title) {
			case 'ALX and Guest Remarks':
				return `${externalLink('https://t.me/AlxEthiopiaOfficial', 'Bisrat Gizaw')}, Recruitment Analyst at <a href="https://t.me/AlxEthiopiaOfficial" target="_blank" rel="noreferrer">ALX Ethiopia</a>; Mike Atskemichael, CTO of <a href="https://afriworket.com/" target="_blank" rel="noreferrer">Afriwork</a>; and Dagmawi Mekonnen of <a href="https://www.youtube.com/@Gugutpodcast" target="_blank" rel="noreferrer">Gugut Podcast</a>`;
			case 'Hot Spot Showcase':
				return `${externalLink('https://t.me/CodeItLab', 'Gemechis Elias')}, co-founder of <a href="https://horan.et/" target="_blank" rel="noreferrer">Horan Technologies</a>`;
			case 'LucyAI Showcase':
				return `Moan Bekele, co-founder of <a href="https://lucy.zemenu.org/" target="_blank" rel="noreferrer">Lucy AI</a>`;
			case 'Building AI That Ships':
				return `${externalLink('https://t.me/b1n1yamBuilds', 'Biniyam Daniel')}, <a href="https://addisassistant.com" target="_blank" rel="noreferrer">Addis AI</a>`;
			case 'Debugging':
				return `${externalLink('https://t.me/ezras_channel', 'Ezra Ashenafi')}, <a href="https://afriworket.com/" target="_blank" rel="noreferrer">Afriwork</a>`;
			case 'Everything is Broken':
				return externalLink('https://t.me/MajorJohn23', 'Yohanes Fikru');
			case 'Live Coding Music':
				return externalLink('https://t.me/SurafelYimam', 'Surafel Yimam');
			case 'Designing Visuals That Move':
				return externalLink('https://t.me/eyuelzerostuff', 'Eyuel Zerabruk');
			case 'Concept and Functionality':
				return externalLink('https://t.me/nirvanaland7', 'Etsub Mekonnen');
			case 'Bespoke UI':
				return externalLink('https://t.me/robi_makes_stuff', 'Robel Mezemir');
			case 'ExamBuddy':
				return externalLink('https://t.me/DoughNutDrops', 'Mohammed Ibrahim');
			case 'DBStudio':
				return externalLink('https://t.me/ruhambek', 'Ruhama Bekele');
			case 'Better Auth Studio':
				return externalLink('https://t.me/kinfishfarms', 'Kinfemichael Tariku');
			case 'Ora Browser':
				return externalLink('https://t.me/yonaries', 'Yonathan Dejene');
			case 'Stark':
				return externalLink('https://t.me/miheretabtrysstuff', 'Miheretab Samson');
			case 'Devtopia Live Podcast':
				return `${externalLink('https://t.me/thefrectonz', 'Fraol Lemecha')}, ${externalLink('https://t.me/morphandbeyond', 'Yafet Getachew')}, and ${externalLink('https://t.me/b1n1yamBuilds', 'Biniyam Daniel')}`;
			case "A day at Dagmawi Babi's Meetup":
				return `${externalLink('https://www.instagram.com/tihitnat/', 'Tihitina Tesfaye')}`;
			case 'Telegram Creators Award and Closing':
				return `<a href="https://t.me/CodeNight" target="_blank" rel="noreferrer">Codenight</a> and Dagmawi Babi`;
			default:
				return item.speakerOrPresenter;
		}
	}

	function descriptionMarkup(item: VideoItem): string {
		switch (item.title) {
			case 'Event Recap':
				return `The full-day event recap capturing the keynotes, showcases, live podcast, creator awards, and the overall atmosphere of Dagmawi Babi's Meetup. Visit the <a href="https://dagmawibabi.com/meetup" target="_blank" rel="noreferrer">event site</a> for the full context.`;
			case 'Hot Spot Showcase':
				return `Gemechis Elias showcases <a href="https://hotspot.et/" target="_blank" rel="noreferrer">Hot Spot</a>, an upcoming travel super app for Ethiopia, at Dagmawi Babi's Meetup.`;
			case 'LucyAI Showcase':
				return `Moan Bekele showcases <a href="https://lucy.zemenu.org/" target="_blank" rel="noreferrer">Lucy AI</a>, an AI customer service agent built under ZEMENU, and walks the audience through the product's purpose.`;
			case 'Building AI That Ships':
				return `This talk is a technical talk for every AI enthusiast covering the parts that make AI work. From infrastructure and platforms to fine-tuning and inference, it is one of the most comprehensive AI talks given in Ethiopia.`;
			case 'Debugging':
				return `In his technical talk on debugging and troubleshooting, Ezra shares resources, tools, tricks, do's and don'ts, and practical lessons on how to track issues accurately and fix full-stack products with clarity.`;
			case 'Everything is Broken':
				return `Using game development as the frame, this talk explores how real products are often built around feeling and user desire before code purity. It walks through lessons from building games and running a studio while chasing satisfaction over theory.`;
			case 'Designing Visuals That Move':
				return `Design is bigger than how things look. This talk breaks down design as intention across systems, tools, communication, and feeling, then explores motion design as designing in time through rhythm, pacing, continuity, and change.`;
			case 'Concept and Functionality':
				return `Good design is not only about how something looks, but also about how it works. This talk argues that every strong design begins with a clear concept and is completed through thoughtful functionality.`;
			case 'Bespoke UI':
				return `This talk looks at what it takes to move UI from merely tolerable to memorable. Robel walks through bad design, bare minimum design, great design, and the workflow he uses to build half-decent interfaces that feel like experiences.`;
			case 'ExamBuddy':
				return `Mohammed Ibrahim showcases <a href="https://exambuddy.app/" target="_blank" rel="noreferrer">ExamBuddy</a>, an all-in-one AI-powered study assistant that helps users create exams from documents, generate concise notes, flashcards, audiobooks, and more.`;
			case 'DBStudio':
				return `Ruhama Bekele showcases <a href="https://dbstudio.tech/" target="_blank" rel="noreferrer">DBStudio</a>, a modern and AI-powered workspace for data teams building, managing, and scaling database applications.`;
			case 'Better Auth Studio':
				return `Kinfemichael Tariku showcases <a href="https://better-auth-studio.vercel.app/" target="_blank" rel="noreferrer">Better Auth Studio</a>, an admin dashboard for Better Auth that manages users, sessions, organizations, teams, database tooling, testing, utilities, and more.`;
			case 'Ora Browser':
				return `<a href="https://www.orabrowser.com/" target="_blank" rel="noreferrer">Ora Browser</a> is an open-source macOS browser built with Swift and WebKit. Yonathan Dejene showcases it as a fast, secure, native Arc alternative with spaces, vertical sidebar, smooth tab management, and more.`;
			case 'Stark':
				return `Miheretab Samson showcases <a href="https://stark.et/" target="_blank" rel="noreferrer">Stark.et</a>, a definitive portfolio network for developers, designers, and motion creators.`;
			case 'Devtopia Live Podcast':
				return `Fraol Lemecha and Yafet Getachew host a live podcast session interviewing Addis AI CEO Biniyam Daniel. A longer version of the conversation was slated for the <a href="https://www.youtube.com/@thedevtopia" target="_blank" rel="noreferrer">Devtopia channel</a>.`;
			case "A day at Dagmawi Babi's Meetup":
				return `Tihitina Tesfaye captured the atmosphere of the meetup, the people in the room, and short speaker interviews in this event vlog. See more from her on <a href="https://www.instagram.com/tihitnat/" target="_blank" rel="noreferrer">Instagram</a>.`;
			case 'Telegram Creators Award and Closing':
				return `Codenight and Dagmawi Babi partnered to host the first Telegram Creators Award, celebrating influential creators producing high-quality educational and entertaining content. The closing recognized <a href="https://t.me/solodevchronicles" target="_blank" rel="noreferrer">@SoloDevChronicles</a>, <a href="https://t.me/OnyxDesignX" target="_blank" rel="noreferrer">@OnyxDesignX</a>, and <a href="https://t.me/Birhan_Nega" target="_blank" rel="noreferrer">@Birhan_Nega</a>.`;
			default:
				return item.description;
		}
	}

	function sessionAction(item: VideoItem): SessionLink {
		switch (item.title) {
			case 'Building AI That Ships':
				return {
					label: 'View Slides',
					url: 'https://www.canva.com/design/DAG_amsGHQM/wTSvpjQ3opCZNK6BAg8nEA/edit?utm_content=DAG_amsGHQM&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton'
				};
			case 'Debugging':
				return {
					label: 'View Slides',
					url: 'https://www.canva.com/design/DAG_ak80-A4/jwunA4Z5EZ8b_xhpTzihSw/edit?utm_content=DAG_ak80-A4&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton'
				};
			case 'Everything is Broken':
				return {
					label: 'View Slides',
					url: 'https://www.canva.com/design/DAG_ajgvtLY/K2T6tiAG69nTNAeSPIWuow/edit?utm_content=DAG_ajgvtLY&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton'
				};
			case 'Designing Visuals That Move':
				return { label: 'View Slides', url: 'https://t.me/Dagmawi_Babi/36254' };
			case 'Concept and Functionality':
				return { label: 'View Slides', url: 'https://t.me/Dagmawi_Babi/36253' };
			case 'Bespoke UI':
				return {
					label: 'View Slides',
					url: 'https://www.canva.com/design/DAG_av0SbgI/Jlzr83sHBoudytgzeM6FxQ/edit?utm_content=DAG_av0SbgI&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton'
				};
			default:
				return { label: 'Watch on YouTube', url: item.url };
		}
	}

	function selectSection(id: string): void {
		selectedSectionId = id;
	}

	function selectVideo(sectionId: string, item: VideoItem): void {
		activePlayers = { ...activePlayers, [sectionId]: item };
		selectedSectionId = sectionId;
	}
</script>

<section id="archive" class="section-frame replay-block">
	<div class="section-heading">
		<p class="eyebrow">Video Archive</p>
		<h2>Talks, showcases, sponsor moments, and the close.</h2>
	</div>

	{#if selectedSection && selectedVideo}
		<div class="replay-layout">
			<div class="chapter-list">
				{#each videoSections as section}
					<button
						type="button"
						class:current={selectedSectionId === section.id}
						on:click={() => selectSection(section.id)}
					>
						<div>
							<p>{section.title}</p>
							<span>{section.subtitle}</span>
						</div>
						<strong>{section.items.length}</strong>
					</button>
				{/each}
			</div>

			<div class="player-panel">
				<div class="player-shell">
					<img src={thumbnailUrl(selectedVideo.url)} alt={selectedVideo.title} class="player-fallback" />
					<iframe
						src={embedUrl(selectedVideo.url)}
						title={selectedVideo.title}
						allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
						allowfullscreen
					></iframe>
				</div>

				<div class="player-meta">
					<div class="selected-session">
						<p class="eyebrow subtle">Selected Session</p>
						<h3>{selectedVideo.title}</h3>
						<p class="meta-line">{selectedSection.subtitle}</p>
					</div>
					<a href={sessionAction(selectedVideo).url} target="_blank" rel="noreferrer" class="ghost-link">
						{sessionAction(selectedVideo).label}
					</a>
				</div>

				<div class="speaker-strip">
					<div class="info-card">
						<p class="eyebrow subtle">Speaker / Presenter</p>
						<p>{@html speakerMarkup(selectedVideo)}</p>
					</div>
					<div class="info-card">
						<p class="eyebrow subtle">Description</p>
						<p>{@html descriptionMarkup(selectedVideo)}</p>
					</div>
				</div>

				{#if selectedSection.items.length > 1}
					<div class="session-tabs">
						{#each selectedSection.items as item}
							<button
								type="button"
								class:playing={selectedVideo.url === item.url}
								on:click={() => selectVideo(selectedSection.id, item)}
							>
								<Play size={14} />
								<span>{item.title}</span>
							</button>
						{/each}
					</div>
				{/if}
			</div>
		</div>
	{/if}
</section>

<style>
	.section-frame {
		width: min(100%, 1420px);
		margin: 0 auto 1.1rem;
		border: 1px solid var(--line);
		background: linear-gradient(180deg, rgba(38, 38, 38, 0.8), rgba(23, 23, 23, 0.96));
	}

	.replay-block {
		position: relative;
		padding-bottom: 1.5rem;
	}

	.section-heading,
	.replay-layout {
		padding: 1.5rem;
	}

	.section-heading {
		display: grid;
		gap: 0.85rem;
		padding-bottom: 0;
	}

	.eyebrow {
		margin: 0;
		font-family: 'IBM Plex Mono', monospace;
		font-size: 0.72rem;
		letter-spacing: 0.24em;
		text-transform: uppercase;
	}

	.subtle {
		color: #737373;
	}

	h2,
	h3 {
		margin: 0;
		font-family: 'Chivo', sans-serif;
		font-weight: 800;
		line-height: 0.95;
		letter-spacing: -0.06em;
		text-transform: uppercase;
	}

	h2 {
		font-size: clamp(1.8rem, 4.3vw, 4.2rem);
		text-wrap: balance;
	}

	h3 {
		font-size: clamp(1.7rem, 3vw, 2.8rem);
	}

	.replay-layout {
		display: grid;
		grid-template-columns: 20rem 1fr;
		gap: 1rem;
		align-items: stretch;
	}

	.chapter-list {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		height: 100%;
	}

	.chapter-list button,
	.session-tabs button {
		border: 1px solid var(--line);
		background: #101010;
		color: var(--text);
		font: inherit;
		cursor: pointer;
	}

	.chapter-list button {
		display: grid;
		grid-template-columns: 1fr auto;
		gap: 0.45rem 1rem;
		padding: 1rem;
		text-align: left;
	}

	.chapter-list button p {
		margin: 0;
		font-weight: 700;
	}

	.chapter-list button span {
		grid-column: 1 / 2;
		color: var(--muted);
		font-size: 0.9rem;
		line-height: 1.5;
	}

	.chapter-list button strong {
		grid-row: 1 / 3;
		align-self: center;
		padding: 0.35rem 0.45rem;
		border: 1px solid var(--line-soft);
		font-family: 'IBM Plex Mono', monospace;
		font-size: 0.68rem;
	}

	.chapter-list button.current,
	.chapter-list button:hover {
		background: var(--mono);
		color: #171717;
	}

	.chapter-list button.current span,
	.chapter-list button:hover span {
		color: #404040;
	}

	.player-panel {
		display: grid;
		gap: 1rem;
		height: 100%;
	}

	.player-shell {
		position: relative;
		aspect-ratio: 16 / 9;
		overflow: hidden;
		border: 1px solid var(--line);
		background: #000;
	}

	.player-fallback,
	.player-shell iframe {
		position: absolute;
		inset: 0;
	}

	.player-fallback {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.player-shell iframe {
		width: 100%;
		height: 100%;
	}

	.player-meta,
	.session-tabs {
		display: flex;
		flex-wrap: wrap;
		gap: 0.9rem;
	}

	.player-meta {
		align-items: end;
		justify-content: space-between;
		width: 100%;
	}

	.selected-session {
		flex: 1 1 auto;
		min-width: 0;
	}

	.meta-line {
		margin-top: 0.7rem;
		color: var(--muted);
		font-size: 0.98rem;
	}

	.ghost-link {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.75rem 0.95rem;
		border: 1px solid var(--line);
		color: var(--text);
		font-family: 'IBM Plex Mono', monospace;
		font-size: 0.74rem;
		letter-spacing: 0.16em;
		text-decoration: none;
		text-transform: uppercase;
	}

	.speaker-strip {
		display: grid;
		grid-template-columns: 18rem 1fr;
		gap: 1rem;
	}

	.info-card {
		padding: 1.1rem;
		border: 1px solid var(--line);
		background: #101010;
	}

	.info-card p {
		margin: 0;
	}

	.info-card p:last-child {
		margin-top: 0.65rem;
		color: var(--muted);
		line-height: 1.75;
	}

	.info-card :global(a) {
		color: var(--text);
		text-decoration: underline;
		text-decoration-color: rgba(255, 255, 255, 0.25);
		text-underline-offset: 0.16em;
	}

	.info-card :global(a:hover) {
		text-decoration-color: rgba(255, 255, 255, 0.6);
	}

	.session-tabs button {
		display: inline-flex;
		align-items: center;
		gap: 0.55rem;
		padding: 0.9rem 1rem;
	}

	.session-tabs button.playing,
	.session-tabs button:hover {
		background: #262626;
	}

	@media (max-width: 1180px) {
		.replay-layout,
		.speaker-strip {
			grid-template-columns: 1fr;
		}
	}

	@media (max-width: 720px) {
		.section-heading,
		.replay-layout {
			padding: 1rem;
		}

		h2 {
			font-size: clamp(1.65rem, 7.4vw, 2.5rem);
		}
	}
</style>
