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

const yearToComparable = (year: string) =>
  year.split(' - ')[1].split(' ').reverse().join();

export const getExperiences = async () => {
  const collection = await getCollection('experiences');

  const experiences = await Promise.all(
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

  return experiences.sort((a, b) =>
    yearToComparable(a.year) > yearToComparable(b.year) ? -1 : 1,
  );
};
