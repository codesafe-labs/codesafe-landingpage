import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const changelog = defineCollection({
	loader: glob({ base: './src/content/changelog', pattern: '**/*.{md,mdx}' }),
	schema: z.object({
		title: z.string(),
		date: z.coerce.date(),
		version: z.string(),
		tag: z.enum(['Release', 'Rules', 'Cloud', 'Fix']),
		description: z.string(),
		items: z.array(z.string()),
	}),
});

export const collections = { changelog };
