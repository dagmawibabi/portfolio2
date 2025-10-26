<script>
	import EachExperience from '../components/each_experience.svelte';
	import SectionTitle from '../components/section_title.svelte';

	let educations = [
		{
			company: 'Addis Ababa Science and Tech University',
			logo: '',
			link: 'http://www.aastu.edu.et',
			role: 'Software Engineering Degree',
			date: '2019 - 2024',
			responsibilities: [],
			description: [
				"My years in AASTU is one of the most profound years of my life. It was during my campus years I've built most of my projects and participated in clubs and events. I've made some incredible memories in there and learnt so much and the current version of me was very much shaped because of it."
			]
		},
		{
			company: 'Unity University',
			logo: '',
			link: 'https://uu.edu.et',
			role: 'Management Degree',
			date: '2020 - 2024',
			responsibilities: [],
			description: [
				'While learning my software engineering degree in AASTU, I was learning Management in Unity as a distance student. It is a very interesting subject that has accouning, marketing, leadership and more.'
			]
		},
		{
			company: 'Lebawi International Academy',
			logo: '',
			link: 'https://www.youtube.com/watch?v=2JYN2F65J4M',
			role: 'High School Diploma',
			date: '2018 - 2019',
			responsibilities: [],
			description: [
				'These few years were some of my favorite years in school where I had to start as new and ready myself for what is coming'
			]
		},
		{
			company: 'Bahir Dar Academy',
			logo: '',
			link: 'https://www.bdaschool.net',
			role: 'Middle and High School',
			date: '2010 - 2018',
			responsibilities: [],
			description: [
				'These were some of the years that shaped my teenage years and befriended some of my life long friends. It is also where I discovered programming.'
			]
		}
	];
</script>

<div class="pb-10">
	<SectionTitle title={'Education'} />
	<div class="pl-10">
		<div class="h-7 border-l border-dashed border-zinc-900 dark:border-zinc-600"></div>
	</div>

	{#each educations as education}
		<EachExperience experience={education} />
	{/each}
</div>
