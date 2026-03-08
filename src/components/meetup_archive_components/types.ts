export interface SessionLink {
	label: string;
	url: string;
}

export interface VideoItem {
	title: string;
	url: string;
	speakerOrPresenter: string;
	description: string;
	primaryLink?: SessionLink;
	secondaryLinks?: SessionLink[];
}

export interface VideoSection {
	id: string;
	title: string;
	subtitle: string;
	items: VideoItem[];
}

export interface GalleryImage {
	src: string;
	alt: string;
}

export interface SupporterLogo {
	name: string;
	link: string;
	group: string;
	src: string;
}
