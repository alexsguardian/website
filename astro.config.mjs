import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import vue from '@astrojs/vue';
import tailwind from '@astrojs/tailwind';
import compress from 'astro-compress';
import icon from 'astro-icon';
import partytown from '@astrojs/partytown';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://alexsguardian.net',
  compressHTML: true,
  output: "server",
  integrations: [
    mdx(),
    vue(),
    icon(),
    tailwind({
      applyBaseStyles: false,
    }),
    compress(),
    partytown({
      // Adds dataLayer.push as a forwarding-event.
      config: {
        forward: ['dataLayer.push'],
      },
    }),
    sitemap({
      // Filter out unready pages from sitemap
      filter: (page) =>
        page !== 'https://alexsguardian.net/support/' &&
        page !== 'https://alexsguardian.net/contact/',
    }),
  ],
})
