import { defineCollection, z } from 'astro:content';

export const experienceZ = z.object({
  company: z.string().optional(),
  model: z.union([
    z.literal('robot'),
    z.literal('bearing'),
    z.literal('containers'),
    z.literal('computer'),
    z.literal('module'),
    z.literal('bobby'),
    z.literal('crates'),
    z.literal('wheel'),
    z.literal('plant'),
  ]),
  year: z.string(),
  type: z.string().optional(),
  color: z
    .union([
      z.literal('red'),
      z.literal('yellow'),
      z.literal('green'),
      z.literal('blue'),
      z.literal('purple'),
      z.literal('pink'),
      z.literal('silver'),
      z.literal('night'),
    ])
    .optional(),
  tools: z.array(z.string()),
});

export const collections = {
  experiences: defineCollection({
    type: 'content',
    schema: experienceZ,
  }),
};
