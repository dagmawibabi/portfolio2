import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import config from '$lib/blog-config.json';

export const OG_WIDTH = 1200;
export const OG_HEIGHT = 630;

// OG images are prerendered at build time, so reading from the project root is safe.
// Satori can't parse variable fonts, so the static Lexend weights from fontsource are used.
let assets: { regular: Buffer; semibold: Buffer; logo: string } | null = null;
const loadAssets = () =>
	(assets ??= {
		regular: readFileSync(
			resolve('node_modules/@fontsource/lexend/files/lexend-latin-400-normal.woff')
		),
		semibold: readFileSync(
			resolve('node_modules/@fontsource/lexend/files/lexend-latin-600-normal.woff')
		),
		logo: `data:image/png;base64,${readFileSync(
			resolve('src/lib/assets/logo/DagmawiBabiLogo.png')
		).toString('base64')}`
	});

type Style = Record<string, string | number>;
type Child = OgNode | string | null | false;
interface OgNode {
	type: string;
	key: null;
	props: { style?: Style; children?: Child[]; [prop: string]: unknown };
}

// Minimal element factory so satori gets a plain object tree (no JSX / HTML parsing needed)
const h = (type: string, props: OgNode['props'], ...children: Child[]): OgNode => ({
	type,
	key: null,
	props: { ...props, children: children.filter((child) => child !== null && child !== false) }
});

const truncate = (text: string, max: number) =>
	text.length > max ? `${text.slice(0, max).trimEnd()}…` : text;

interface OgCardOptions {
	title: string;
	description?: string;
	date?: string | null;
	category?: string;
	footer?: string;
}

// Mirrors the blog list card: date + category on top, title, muted description
export const renderOgCard = async ({
	title,
	description = '',
	date = null,
	category,
	footer = 'dagmawibabi.com/blog'
}: OgCardOptions): Promise<Uint8Array<ArrayBuffer>> => {
	const { regular, semibold, logo } = loadAssets();
	const parsedDate = date ? new Date(date) : null;
	const dateLabel = parsedDate && !isNaN(parsedDate.getTime()) ? parsedDate.toDateString() : '';
	const titleSize = title.length > 60 ? 54 : title.length > 32 ? 64 : 76;

	const tree = h(
		'div',
		{
			style: {
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				width: OG_WIDTH,
				height: OG_HEIGHT,
				backgroundColor: '#f4f4f5',
				fontFamily: 'Lexend'
			}
		},
		h(
			'div',
			{
				style: {
					display: 'flex',
					flexDirection: 'column',
					boxSizing: 'border-box',
					width: OG_WIDTH - 96,
					height: OG_HEIGHT - 96,
					padding: '44px 56px 40px',
					backgroundColor: '#fafafa',
					border: '2px solid #d4d4d8',
					borderRadius: 18,
					boxShadow: '0 12px 32px rgba(24, 24, 27, 0.08)'
				}
			},
			// Date + category
			h(
				'div',
				{
					style: {
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'space-between',
						fontSize: 26,
						color: '#737373'
					}
				},
				h('div', { style: { display: 'flex' } }, dateLabel),
				!!category &&
					h(
						'div',
						{
							style: {
								display: 'flex',
								padding: '6px 22px',
								borderRadius: 999,
								backgroundColor: '#e5e5e5',
								color: '#52525b'
							}
						},
						category
					)
			),
			// Title + description
			h(
				'div',
				{
					style: {
						display: 'flex',
						flexDirection: 'column',
						flexGrow: 1,
						justifyContent: 'center'
					}
				},
				h(
					'div',
					{
						style: {
							display: 'flex',
							fontSize: titleSize,
							fontWeight: 600,
							lineHeight: 1.15,
							letterSpacing: -1.5,
							color: '#18181b'
						}
					},
					truncate(title, 110)
				),
				!!description &&
					h(
						'div',
						{
							style: {
								display: 'flex',
								marginTop: 20,
								fontSize: 28,
								lineHeight: 1.45,
								color: '#737373'
							}
						},
						truncate(description, 140)
					)
			),
			// Branding
			h(
				'div',
				{
					style: {
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'space-between',
						paddingTop: 24,
						borderTop: '2px dashed #d4d4d8'
					}
				},
				h(
					'div',
					{ style: { display: 'flex', alignItems: 'center' } },
					h('img', { src: logo, width: 60, height: 60, style: { marginRight: 16 } }),
					h(
						'div',
						{ style: { display: 'flex', flexDirection: 'column' } },
						h(
							'div',
							{ style: { display: 'flex', fontSize: 28, fontWeight: 600, color: '#18181b' } },
							config.name
						),
						h(
							'div',
							{ style: { display: 'flex', fontSize: 20, color: '#737373' } },
							config.subtitle
						)
					)
				),
				h('div', { style: { display: 'flex', fontSize: 24, color: '#059669' } }, footer)
			)
		)
	);

	const svg = await satori(tree as Parameters<typeof satori>[0], {
		width: OG_WIDTH,
		height: OG_HEIGHT,
		fonts: [
			{ name: 'Lexend', data: regular, weight: 400, style: 'normal' },
			{ name: 'Lexend', data: semibold, weight: 600, style: 'normal' }
		]
	});

	const png = new Resvg(svg, { fitTo: { mode: 'width', value: OG_WIDTH } }).render().asPng();
	return new Uint8Array(png);
};
