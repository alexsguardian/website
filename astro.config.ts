import { defineConfig } from 'astro/config'
import { fileURLToPath } from 'url'
import compress from 'astro-compress'
import icon from 'astro-icon'
import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import tailwindcss from '@tailwindcss/vite'
import itsmatteomanfsecurityTxt from '@itsmatteomanf/astro-security-txt'


// https://astro.build/config
export default defineConfig({
  compressHTML: true,
  site: 'https://alexsguardian.net',
  integrations: [
    compress(),
    icon(),
    mdx(),
    sitemap(),
    itsmatteomanfsecurityTxt({
      contact: 'mailto:webmaster@alexsguardian.net'
    })
  ],
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          logger: {
            warn: () => {},
          },
        },
      },
    },
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '@components': fileURLToPath(new URL('./src/components', import.meta.url)),
        '@layouts': fileURLToPath(new URL('./src/layouts', import.meta.url)),
        '@assets': fileURLToPath(new URL('./src/assets', import.meta.url)),
        '@pages': fileURLToPath(new URL('./src/pages', import.meta.url)),
        '@public': fileURLToPath(new URL('./public', import.meta.url)),
      },
    },
  },
})
