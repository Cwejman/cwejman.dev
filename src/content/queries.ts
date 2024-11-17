import { getCollection } from 'astro:content';
import { marked } from 'marked';

import {
  groupMarkdownByHeading,
  parseInlineMarkdown,
  parseMarkdown,
} from '@utils/markdown.ts';

//

interface ExperienceMarkdownGroups {
  title: string;
  intro: string;
  efforts?: string;
  results?: string;
}

export const getExperiences = async () => {
  const collection = await getCollection('experiences');

  return await Promise.all(
    collection.map(async ({ data, body, slug }) => {
      const { title, intro, efforts, results } =
        groupMarkdownByHeading<ExperienceMarkdownGroups>(body);

      return {
        ...data,
        title: await parseInlineMarkdown(title),
        intro: await parseMarkdown(intro),
        efforts: efforts ? await parseMarkdown(efforts) : undefined,
        results: results ? await parseMarkdown(results) : undefined,
        slug,
      };
    }),
  );
};
