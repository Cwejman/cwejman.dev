import rehypeStringify from 'rehype-stringify';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';

export const parseMarkdown = async (input: string) =>
  String(
    await unified()
      .use(remarkParse)
      .use(remarkRehype)
      .use(rehypeStringify)
      .process(input),
  );

export const parseInlineMarkdown = async (input: string) =>
  (await parseMarkdown(input)).replace(/^<p>(.*?)<\/p>$/s, '$1');

export const groupMarkdownByHeading = <
  Res extends { [K in keyof Res]?: string },
>(
  body: string,
): Res =>
  body.split('\n').reduce((acc, line) => {
    const isHeading = line.startsWith('#');
    const key = isHeading
      ? (line.slice(2).trim() as keyof Res)
      : (Object.keys(acc).slice(-1)?.[0] as keyof Res | undefined);

    if (key) {
      if (isHeading) {
        acc[key] = '' as Res[keyof Res];
      } else {
        acc[key] = `${acc[key] || ''}\n${line}` as Res[keyof Res];
      }
    }

    return acc;
  }, {} as Res);
