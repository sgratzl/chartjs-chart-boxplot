import { defineConfig } from 'vitepress';
import {name, description, repository } from '../../package.json';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: name,
  description,
  base: `/${name}/`,
  lang: 'en',
  useWebFonts: false,
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Examples', link: '/markdown-examples' },
    ],

    sidebar: [
      {
        text: 'Examples',
        items: [
          { text: 'Markdown Examples', link: '/markdown-examples' },
          { text: 'Runtime API Examples', link: '/api-examples' },
        ],
      },
    ],

    socialLinks: [
      { icon: 'github', link: repository.url.replace('.git', '') }
    ],
  },
});
