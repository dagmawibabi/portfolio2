// Refreshes the bundled podcast snapshot used when the YouTube API is unavailable.
// Run with: node --env-file=.env scripts/podcast-snapshot.ts
import { writeFileSync } from 'node:fs';
import { fetchPodcast } from '../src/lib/podcast/youtube.ts';

const key = process.env.YOUTUBE_API_KEY;
if (!key) {
	console.error('Set YOUTUBE_API_KEY in .env first.');
	process.exit(1);
}

const data = await fetchPodcast(key);
data.source = 'snapshot';
const out = new URL('../src/lib/podcast/snapshot.json', import.meta.url);
writeFileSync(out, JSON.stringify(data, null, '\t') + '\n');
console.log(`Saved ${data.episodes.length} episodes and ${data.extras.length} extras.`);
