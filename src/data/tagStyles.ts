export type ChangelogTag = 'Release' | 'Rules' | 'Cloud' | 'Fix';

export const tagStyles: Record<
	ChangelogTag,
	{ bg: string; border: string; text: string }
> = {
	Release: { bg: '#EEF6F0', border: '#CFE4D8', text: '#10664A' },
	Rules: { bg: '#FDF3EC', border: '#F0D9C8', text: '#B4552D' },
	Cloud: { bg: '#EEF2FA', border: '#D3DEF0', text: '#2A5FB8' },
	Fix: { bg: '#F6F8F4', border: '#E7EAE4', text: '#4C5751' },
};
