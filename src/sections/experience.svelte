<script>
	import EachExperience from '../components/each_experience.svelte';
	import SectionTitle from '../components/section_title.svelte';

	// Images
	import afriwork from '$lib/assets/experience/Afriwork.png';
	import itd3 from '$lib/assets/experience/ITD3.png';
	import dreamIntelligence from '$lib/assets/experience/DreamIntelligence.png';

	let experiences = [
		{
			company: 'Dream Intelligence',
			logo: dreamIntelligence,
			link: '',
			role: 'CEO and Founder',
			date: 'Nov 2018 - Present',
			responsibilities: [
				'Handle day to day business and technology directions',
				'Architected and implemented multiple products and solutions',
				'Offer a great line of products to help ease life and solve problems'
			],
			description: [
				"I've founded and run my own tech company which has helped bring a great line of incredible and complex products and services to the world. I'm running all aspects of business and working to expand and enrich my company."
			]
		},
		{
			company: 'Afriwork',
			logo: afriwork,
			link: 'https://www.afriworket.com',
			role: 'Web and Mobile Fullstack Dev',
			date: 'Aug 2024 - Present',
			responsibilities: [
				'Designed a hiring pipeline for the company',
				'Consulted on outsourcing projects',
				'Main mobile apps developer for outsourced projects'
			],
			description: [
				'Afriwork is a platform that connects freelancers and clients trusted by over 15k companies and 300k freelancers. And it is the top freelancing platform in Ethiopia.'
			]
		},
		{
			company: 'ITD3',
			logo: itd3,
			link: 'https://aaitdb.gov.et',
			role: 'Fullstack Dev and DevOps Engineer',
			date: 'February 2022 - January 2024',
			responsibilities: [
				'Deployed, secured and maintained multiple web apps',
				'Wrote automating code to backup, log and maintain multiple projects',
				'Wrote modern, performant, maintainable code for a diverse array of internal projects',
				'Communicate with multi-disciplinary teams of engineers, designers, testers, project managers and stakeholders'
			],
			description: [
				'Innovation and Technology Development Bureau, ITD3, is an Addis Ababa based institution whose main objective is to make the procedures of institutions modern and efficient.'
			]
		},
		{
			company: 'Artificial Intelligence and Robotics Center of Excellence',
			logo: '',
			link: '',
			role: 'Backend and DevOps Engineer',
			date: 'February 2021 - June 2023',
			responsibilities: [
				'Deployed, secured and maintained multiple web apps',
				'Wrote automating code to backup, log and maintain multiple projects',
				'Write modern, performant, maintainable code for a diverse array of internal projects'
			],
			description: [
				"I was a member of AASTU's Center of Excellence. It's a research and development program where I've developed multiple complex softwares and apps."
			]
		},
		{
			company: 'Freelancing',
			logo: '',
			link: '',
			role: 'Web and Mobile App Developer',
			date: 'June 2020 - Present',
			responsibilities: [
				'Worked on lots of contract-based projects',
				'System analysis and modeling for multiple clients and projects',
				'Specification and Requirements engineering for a ride hauling company',
				'Interfaced with clients on a weekly basis, providing technological expertise',
				'Developed, secured, deployed and maintained multiple web and mobile apps for multiple startup companies'
			],
			description: [
				"I've freelanced on the side for multiple years. I've learnt and developed multiple technologies and projects. I've worked with several startups and clients to create products that solve real-world problems."
			]
		},
		{
			company: 'Arif Events',
			logo: '',
			link: '',
			role: 'web and mobile fullstack dev',
			date: 'July - September 2019',
			responsibilities: [
				'Built new event management related features',
				'Improved and maintained existing features'
			],
			description: [
				'ArifEvents was my first internship where I worked on multiple projects and features.'
			]
		}
	];
</script>

<div class="pb-10">
	<SectionTitle title={'Experience'} />
	<div class="pl-10">
		<div class="h-7 border-l border-dashed border-zinc-900"></div>
	</div>

	{#each experiences as experience}
		<EachExperience {experience} />
	{/each}
</div>
