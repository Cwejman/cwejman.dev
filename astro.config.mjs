// @ts-check
import { defineConfig } from 'astro/config';

import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  devToolbar: {
    site: 'https://cwejman.dev',
    enabled: false
  },

  integrations: [tailwind()]
});