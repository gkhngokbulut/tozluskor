import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const sporKitapligi = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/spor-kitapligi' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    bookTitle: z.string(),
    bookAuthor: z.string(),
    publishDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    coverImage: z.string().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

const sporFilmografisi = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/spor-filmografisi' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    filmTitle: z.string(),
    filmYear: z.number(),
    director: z.string(),
    publishDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    coverImage: z.string().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

const cumhuriyetDonemiSpor = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/cumhuriyet-donemi-spor' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    period: z.string().optional(),
    publishDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    coverImage: z.string().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

const kisiselBlog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/kisisel-blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    coverImage: z.string().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = {
  'spor-kitapligi': sporKitapligi,
  'spor-filmografisi': sporFilmografisi,
  'cumhuriyet-donemi-spor': cumhuriyetDonemiSpor,
  'kisisel-blog': kisiselBlog,
};
