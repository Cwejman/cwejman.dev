import { defineCollection, z } from 'astro:content';

export const experienceZ = z.object({
  company: z.string(),
  model: z.string(),
  tools: z.array(z.string()),
});

export const collections = {
  experiences: defineCollection({
    type: 'content',
    schema: experienceZ,
  }),
};
