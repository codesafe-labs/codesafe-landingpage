export type ChangelogTag = 'Release' | 'Rules' | 'Cloud' | 'Fix';

export const tagStyles: Record<
	ChangelogTag,
	{ bg: string; border: string; text: string }
> = {
	Release: { bg: '#131A0C', border: '#4A3E28', text: '#9FBF6B' },
	Rules: { bg: '#171105', border: '#4A3E28', text: '#F5A623' },
	Cloud: { bg: '#0A0805', border: '#F5A623', text: '#F5E9CE' },
	Fix: { bg: '#0A0805', border: '#2E2618', text: '#B3A180' },
};
