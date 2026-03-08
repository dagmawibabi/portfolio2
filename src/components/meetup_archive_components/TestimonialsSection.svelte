<script lang="ts">
	type TestimonialItem = {
		quote: string;
		name: string;
		role: string;
		link: string;
		tone: string;
	};

	const testimonials: TestimonialItem[] = [
		{
			quote: 'What a wonderful day it is :)) GRWM to go to @Dagmawi_Babi Meetup :)',
			name: '@Dot_Ruth',
			role: 'Studio Lead / Community Builder',
			link: 'https://t.me/dot_ruth',
			tone: 'tall'
		},
		{
			quote:
				'Such a great event :) The talks, live podcast and music from code, all of it went smoothly and were mind blowing. Also so glad to meet a lot of people in person, love you guys <3 Kudos to @dagmawi_babi and his team for organizing such a flowless event',
			name: '@Dot_Ruth',
			role: 'Independent Product Designer',
			link: 'https://t.me/dot_ruth/1438',
			tone: 'wide'
		},
		{
			quote:
				'I was invited to #DagmawiBabisMeetup as @T4TSA founder today. Grateful for the opportunity to meet fellow builders and creators.',
			name: '@T4TSA',
			role: 'Engineer / Event Attendee',
			link: 'https://t.me/IrisMovies2/242',
			tone: 'compact'
		},
		{
			quote:
				'I can’t say anything more than this. Man. ብቻ there’s a reason everybody loves him. And I hope he means as much to them (they love him more because of the more time spent, I understand that too) as he means to me. For the person that captured  this moment, በጣም ፍቅር  ይብዘላቹ',
			name: '@SurafelYimam',
			role: 'Community Organizer',
			link: 'https://t.me/SurafelYimam/160',
			tone: 'compact'
		},
		{
			quote: 'We did our first event talk yayy',
			name: '@Robi_makes_stuff',
			role: 'Product Lead',
			link: 'https://t.me/Robi_makes_stuff/8070',
			tone: 'compact'
		},
		{
			quote:
				'First talk at an event went well lene😅. Hope you guys enjoyed it, and maybe learned a bit',
			name: '@Ezras_Channel',
			role: 'Early Supporter',
			link: 'https://t.me/ezras_channel/364',
			tone: 'wide'
		},
		{
			quote:
				'It was a triple combo: Etsub threw a left swing with "Concept and Functionality" I did an uppercut with "Designing Visuals That Move" And Robi had the knockout blow with "Bespoke UI" All three of our talks tackled the basic concepts of design, but with each of our specialties. An architect, a motion designer and a fantabulous (Blain taught me this wonky ahh word) UI designer; we were a great trio. It was an honor being a guest here. Thank you all for the love and support!',
			name: '@EyuelZeroStuff',
			role: 'Early Supporter',
			link: 'https://t.me/eyuelzerostuff/705',
			tone: 'wide'
		},
		{
			quote:
				"God did. Creator of the year award 😁😁 Thank you for your support I'll keep on giving it my all",
			name: '@SoloDevChronicles',
			role: 'Early Supporter',
			link: 'https://t.me/SoloDevChronicles/2335',
			tone: 'wide'
		},
		{
			quote:
				'Let’s celebrate this together 🥂🏆 This award belongs to the community, not just me. Super grateful to be named Best Telegram Content Creator. Huge thanks to the organizers for the love, and special shoutout to @Dagmawi_Babi and @codenight. Most importantly, thank you to everyone in the community your engagement, feedback, and trust even when I prepare a live session you guys where there. Thank you Jesus 🙏',
			name: '@OnyxDesignx',
			role: 'Early Supporter',
			link: 'https://t.me/OnyxDesignx/838',
			tone: 'wide'
		},
		{
			quote:
				'Thank you for voting in the poll! Seeing that this is your favorite channel honestly means a lot. It also comes with responsibility on my side—so I’m committing to deliver more content, with better quality, clearer value, and real consistency. I’ll be posting more regularly, staying focused on what helps you most, and making sure every post is worth your time.',
			name: '@Birhan_Nega',
			role: 'Early Supporter',
			link: 'https://t.me/birhan_nega/3084',
			tone: 'wide'
		},
		{
			quote: 'Great day! Thank you Dagmawi :)',
			name: '@EyuelZeroStuff',
			role: 'Early Supporter',
			link: 'https://t.me/eyuelzerostuff/706',
			tone: 'wide'
		},
		{
			quote:
				"Had a blast today at #DagmawiBabisMeetup! Met some wonderful people, ran into some old friends from highschool and learned quite a lot from all the speakers and attendees. I can't wait for the next one (or other similar events).",
			name: '@Fanuel_Anteneh',
			role: 'Early Supporter',
			link: 'https://t.me/Fanuel_Anteneh/642',
			tone: 'wide'
		},
		{
			quote:
				'Event was a big W, my praise goes to babi and the organizers for making this event a reality.',
			name: '@GugutLogs',
			role: 'Early Supporter',
			link: 'https://t.me/gugutlogs/4673',
			tone: 'wide'
		},
		{
			quote:
				'One of the best events I’ve been to fr. Met a lot of cool people, new faces and also people I only knew from Telegram but never met in person. Had conversations on so many different topics with genuinely interesting people. Programmers, designers, architects, writers, musicians, filmmakers ... so many different vibes in one place. The speakers, the podcast, the whole event in general was dope. I even locked in a big 2026 goal promise with some creators so we can keep each other accountable. It was also really nice to see that this community has a lot of creative people beyond just programmers. Big ups to Dagi for taking the initiative to organize this ... everything went really well 👏',
			name: '@Natyiu0',
			role: 'Early Supporter',
			link: 'https://t.me/Natyiu0/1908',
			tone: 'wide'
		},
		{
			quote:
				'I would like to thank babi for organizing such a wonderful meetup and i hope this would be something we do annually',
			name: '@XCYohannes',
			role: 'Early Supporter',
			link: 'https://t.me/XCYohannes/8',
			tone: 'wide'
		},
		{
			quote:
				'Truly inspired by so many sharing their work, I don’t know how many channels I joined today. Everyone I talked to had one. here’s my channel. It’s empty (for now) but I’ll start posting soon. It’s 50% tech, 25% my obsession with vintage watches and film cameras, 25% miscellaneous. TBH Dagmawi Babi asked me to create one a while back, couldn’t really find the time to create cool stuff to share, but I have to now. Glad I met you all :)',
			name: '@Morph_and_Beyond',
			role: 'Early Supporter',
			link: 'https://t.me/Dagmawi_Babi/36290',
			tone: 'wide'
		},
		{
			quote:
				'Thank you to @DagmawiBabi for such a beautiful and enriching event. Both the opening and closing speeches were the cherries on top. It was incredibly inspiring to be passion-bombed, in the best way possible. Seeing the speakers’ and project presenters’ eyes light up as they talked about what they love and shared such insightful ideas',
			name: '@ShegoCodes',
			role: 'Early Supporter',
			link: 'https://t.me/shegocodes/171',
			tone: 'wide'
		},
		{
			quote:
				"This is one of the best if not the best events I've gone to. This is coming from someone who is not comfortable with cameras. In most gatherings, you have to know your audience. Here, I just had to be me. There are not a lot of places where you can talk about the nerdy and technical stuff about the things you love building and what's going on in the back of your company/projects, and people get it!",
			name: '@B1n1yamBuilds',
			role: 'Early Supporter',
			link: 'https://t.me/b1n1yamBuilds/101',
			tone: 'wide'
		},
		{
			quote:
				"Having insights from the wonderful people at the event was great. Here is my message to y'all: seeing what I see, people are here to celebrate what you're building. There has never been a time like this before; your community is here to support whatever you're building, and this is proof. Thanks @Dagmawi_Babi for letting me be a part of this!",
			name: '@B1n1yamBuilds',
			role: 'Early Supporter',
			link: 'https://t.me/b1n1yamBuilds/101',
			tone: 'wide'
		},
		{
			quote:
				'First of all I would like to Thank Dagmawi Babi and his team for organizing such an amazing event with clear goal and taking time to appreciate content creators on telegram. To win the award means a lot because my goal has always been simple: share what I learn, help other channels grow, and create real positive impact—especially for beginners. If you’re just starting, keep going. Consistency + value beats everything. Thank you to everyone who reads, replies, and shares — you made this possible. 🙏',
			name: '@Birhan_Nega',
			role: 'Early Supporter',
			link: 'https://t.me/birhan_nega/3088',
			tone: 'wide'
		}
	];

	const firstRow = testimonials;
	const secondRow = [...testimonials.slice(3), ...testimonials.slice(0, 3)];

	$: marqueeRows = [firstRow, secondRow];
</script>

<section id="testimonials" class="section-frame testimonials-block">
	<div class="marquee-shell" aria-label="Moving testimonials">
		{#each marqueeRows as row, rowIndex}
			<div class="marquee-viewport">
				<div class={`marquee-column column-${rowIndex + 1}`}>
					{#each [...row, ...row] as item}
						<a
							href={item.link}
							target="_blank"
							rel="noreferrer"
							class={`testimonial-card ${item.tone}`}
						>
							<div class="quote-mark">"</div>
							<p class="quote">{item.quote}</p>
							<div class="person">
								<p class="name">{item.name}</p>
								<!-- <p class="role">{item.role}</p> -->
							</div>
						</a>
					{/each}
				</div>
			</div>
		{/each}
	</div>
</section>

<style>
	.section-frame {
		width: min(100%, 1420px);
		margin: 0 auto 1.1rem;
		border: 1px solid var(--line);
		background:
			linear-gradient(180deg, rgba(255, 255, 255, 0.04), transparent 30%),
			linear-gradient(180deg, rgba(25, 25, 25, 0.94), rgba(12, 12, 12, 0.98));
	}

	.testimonials-block {
		position: relative;
		padding: 1.5rem;
	}

	.testimonials-block::after {
		content: '';
		position: absolute;
		inset: auto 1.5rem 1.5rem auto;
		width: 7rem;
		height: 7rem;
		border-right: 1px solid rgba(255, 255, 255, 0.12);
		border-bottom: 1px solid rgba(255, 255, 255, 0.12);
		pointer-events: none;
	}

	.marquee-shell {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1rem;
	}

	.marquee-viewport {
		overflow: hidden;
		height: 50rem;
	}

	.marquee-column {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		will-change: transform;
	}

	.column-1 {
		animation: testimonials-up 36s linear infinite;
	}

	.column-2 {
		animation: testimonials-up 42s linear infinite reverse;
	}

	.testimonial-card {
		display: grid;
		align-content: start;
		gap: 1rem;
		padding: 1.35rem;
		border: 1px solid rgba(255, 255, 255, 0.12);
		background:
			linear-gradient(180deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.01)),
			rgba(15, 15, 15, 0.9);
		color: inherit;
		text-decoration: none;
		transition:
			transform 180ms ease,
			border-color 180ms ease,
			background 180ms ease;
	}

	.testimonial-card:hover {
		transform: translateY(-4px);
		border-color: rgba(255, 255, 255, 0.24);
		background:
			linear-gradient(180deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.02)),
			rgba(18, 18, 18, 0.95);
	}

	.quote-mark {
		color: rgba(255, 255, 255, 0.28);
		font-family: 'Chivo', sans-serif;
		font-size: 3.4rem;
		font-weight: 800;
		line-height: 0.8;
	}

	.quote {
		margin: 0;
		color: #e8e8e8;
		font-size: 1rem;
		line-height: 1.85;
	}

	.person {
		display: grid;
		gap: 0.3rem;
		margin-top: 0.25rem;
	}

	.name,
	.role {
		margin: 0;
	}

	.name {
		font-weight: 700;
		letter-spacing: -0.02em;
	}

	.role {
		color: var(--muted);
		font-size: 0.92rem;
	}

	@keyframes testimonials-up {
		from {
			transform: translateY(0);
		}

		to {
			transform: translateY(-50%);
		}
	}

	@media (max-width: 1180px) {
		.marquee-viewport {
			height: 42rem;
		}
	}

	@media (max-width: 720px) {
		.testimonials-block {
			padding: 1rem;
		}

		.marquee-shell {
			grid-template-columns: 1fr;
		}

		.marquee-viewport {
			height: 34rem;
		}

		.column-2 {
			display: none;
		}
	}
</style>
