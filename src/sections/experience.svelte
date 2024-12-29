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
			role: 'web and mobile fullstack dev',
			date: 'February 2022 - Present',
			responsibilities: [
				'Responsibility 1',
				'Responsibility 2',
				'Responsibility 3',
				'Responsibility 4'
			],
			description: [
				'Deployed, secured and maintained multiple web apps',
				'Wrote automating code to backup, log and maintain multiple projects',
				'Write modern, performant, maintainable code for a diverse array of internal projects',
				'Communicate with multi-disciplinary teams of engineers, designers, testers, project managers and stakeholders,'
			]
		},
		{
			company: 'Afriwork',
			logo: afriwork,
			role: 'web and mobile fullstack dev',
			date: 'February 2022 - Present',
			responsibilities: [
				'Responsibility 1',
				'Responsibility 2',
				'Responsibility 3',
				'Responsibility 4'
			],
			description: [
				'Deployed, secured and maintained multiple web apps',
				'Wrote automating code to backup, log and maintain multiple projects',
				'Write modern, performant, maintainable code for a diverse array of internal projects',
				'Communicate with multi-disciplinary teams of engineers, designers, testers, project managers and stakeholders,'
			]
		},
		{
			company: 'ITD3',
			logo: itd3,
			role: 'web and mobile fullstack dev',
			date: 'February 2022 - Present',
			responsibilities: [
				'Responsibility 1',
				'Responsibility 2',
				'Responsibility 3',
				'Responsibility 4'
			],
			description: [
				'Deployed, secured and maintained multiple web apps',
				'Wrote automating code to backup, log and maintain multiple projects',
				'Write modern, performant, maintainable code for a diverse array of internal projects',
				'Communicate with multi-disciplinary teams of engineers, designers, testers, project managers and stakeholders,'
			]
		},
		{
			company: 'Artificial Intelligence and Robotics Center of Excellence',
			logo: '',
			role: 'web and mobile fullstack dev',
			date: 'February 2022 - Present',
			responsibilities: [
				'Responsibility 1',
				'Responsibility 2',
				'Responsibility 3',
				'Responsibility 4'
			],
			description: [
				'Deployed, secured and maintained multiple web apps',
				'Wrote automating code to backup, log and maintain multiple projects',
				'Write modern, performant, maintainable code for a diverse array of internal projects',
				'Communicate with multi-disciplinary teams of engineers, designers, testers, project managers and stakeholders,'
			]
		},
		{
			company: 'Arif Events',
			logo: '',
			role: 'web and mobile fullstack dev',
			date: 'February 2022 - Present',
			responsibilities: [
				'Responsibility 1',
				'Responsibility 2',
				'Responsibility 3',
				'Responsibility 4'
			],
			description: [
				'Deployed, secured and maintained multiple web apps',
				'Wrote automating code to backup, log and maintain multiple projects',
				'Write modern, performant, maintainable code for a diverse array of internal projects',
				'Communicate with multi-disciplinary teams of engineers, designers, testers, project managers and stakeholders,'
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
