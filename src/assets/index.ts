// Tools

import { type Imported, resolveDir } from '@utils/vite.ts';

type Img = { src: string };

const labelIconEntries = await resolveDir(
  import.meta.glob<Imported<Img>>('./icons/label/*.svg'),
  '.svg',
);

export const findLabelIcon = (label: string) => {
  const pattern = label.toLowerCase().replace(/[ .]/g, '');

  const match =
    labelIconEntries.find(([key]) => key === pattern) ??
    labelIconEntries
      .filter(([key]) => key.includes(pattern) || pattern.includes(key))
      .sort((a, b) => a.length - b.length)[0];

  return match?.[1] ?? '';
};

// Icons

import arrowRight from './icons/arrow-right.svg?raw';
import chevronRightSharp from './icons/chevron-right-sharp.svg?raw';
import chevronRight from './icons/chevron-right.svg?raw';

export const icons = { arrowRight, chevronRight, chevronRightSharp };
